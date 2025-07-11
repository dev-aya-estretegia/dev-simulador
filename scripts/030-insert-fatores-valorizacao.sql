-- =================================================================
-- Script: 030-insert-fatores-valorizacao.sql (CORRIGIDO)
-- Descrição: Insere os fatores de valorização e corrige a trigger
--            que está causando problemas de constraint violation.
-- =================================================================

-- Etapa 1: Primeiro, vamos identificar e corrigir a trigger problemática
-- Verificar se existe trigger na tabela fator_valorizacao
SELECT 
    trigger_name, 
    event_manipulation, 
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'fator_valorizacao';

-- Etapa 2: Remover a trigger problemática se existir
DROP TRIGGER IF EXISTS trg_after_fator_update ON public.fator_valorizacao;
DROP FUNCTION IF EXISTS public.fn_trg_after_fator_update();

-- Etapa 3: Criar uma nova função de trigger robusta para fator_valorizacao
CREATE OR REPLACE FUNCTION public.fn_trg_after_fator_update()
RETURNS TRIGGER AS $$
DECLARE
    unidade_rec RECORD;
    parametro_rec RECORD;
    valor_base NUMERIC;
    valor_adicionais NUMERIC;
    valor_fator NUMERIC;
    valor_inicial_calculado NUMERIC;
    cenario_id_atual INTEGER;
BEGIN
    -- Buscar o cenário associado ao parâmetro de precificação
    SELECT pp.cenario_id INTO cenario_id_atual
    FROM parametro_precificacao pp
    WHERE pp.id = NEW.parametro_precificacao_id;
    
    IF cenario_id_atual IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Buscar os parâmetros de precificação
    SELECT * INTO parametro_rec
    FROM parametro_precificacao
    WHERE id = NEW.parametro_precificacao_id;
    
    IF parametro_rec IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Loop por todas as unidades do cenário que são afetadas por este fator
    FOR unidade_rec IN
        SELECT u.id AS unidade_id, u.tipologia, u.area_privativa, u.area_garden,
               u.qtd_vaga_simples, u.qtd_vaga_duplas, u.qtd_vaga_moto,
               u.qtd_hobby_boxes, u.qtd_suite, u.orientacao_solar, u.pavimento,
               u.vista, u.bloco, u.diferencial
        FROM public.unidade u
        JOIN public.cenario c ON u.empreendimento_id = c.empreendimento_id
        WHERE c.id = cenario_id_atual
        AND (
            (NEW.tipo_fator = 'Orientacao Solar' AND u.orientacao_solar = NEW.valor_referencia) OR
            (NEW.tipo_fator = 'Pavimento' AND u.pavimento::text = NEW.valor_referencia) OR
            (NEW.tipo_fator = 'Vista' AND u.vista = NEW.valor_referencia) OR
            (NEW.tipo_fator = 'Bloco' AND u.bloco = NEW.valor_referencia) OR
            (NEW.tipo_fator = 'Diferencial' AND u.diferencial = NEW.valor_referencia)
        )
    LOOP
        -- Calcular valor base
        valor_base := 
            CASE unidade_rec.tipologia
                WHEN 'Apartamento' THEN COALESCE(unidade_rec.area_privativa, 0) * COALESCE(parametro_rec.valor_area_privativa_apartamento, 0)
                WHEN 'Studio' THEN COALESCE(unidade_rec.area_privativa, 0) * COALESCE(parametro_rec.valor_area_privativa_studio, 0)
                WHEN 'Comercial' THEN COALESCE(unidade_rec.area_privativa, 0) * COALESCE(parametro_rec.valor_area_privativa_comercial, 0)
                ELSE 0
            END;

        -- Adicionar valor do garden
        valor_base := valor_base + (COALESCE(unidade_rec.area_garden, 0) * COALESCE(parametro_rec.valor_area_garden, 0));

        -- Calcular valor dos adicionais
        valor_adicionais :=
            (COALESCE(unidade_rec.qtd_vaga_simples, 0) * COALESCE(parametro_rec.valor_vaga_simples, 0)) +
            (COALESCE(unidade_rec.qtd_vaga_duplas, 0) * COALESCE(parametro_rec.valor_vaga_dupla, 0)) +
            (COALESCE(unidade_rec.qtd_vaga_moto, 0) * COALESCE(parametro_rec.valor_vaga_moto, 0)) +
            (COALESCE(unidade_rec.qtd_hobby_boxes, 0) * COALESCE(parametro_rec.valor_hobby_boxes, 0)) +
            (COALESCE(unidade_rec.qtd_suite, 0) * COALESCE(parametro_rec.valor_suite, 0));

        -- Calcular o fator de valorização específico
        valor_fator := (valor_base + valor_adicionais) * (COALESCE(NEW.percentual_valorizacao, 0) / 100);
        
        -- Valor inicial = base + adicionais + fator
        valor_inicial_calculado := COALESCE(valor_base, 0) + COALESCE(valor_adicionais, 0) + COALESCE(valor_fator, 0);

        -- Atualizar o campo específico do fator na tabela valor_unidades_cenario
        UPDATE public.valor_unidades_cenario
        SET 
            valor_unidade_orientacao = CASE 
                WHEN NEW.tipo_fator = 'Orientacao Solar' THEN COALESCE(valor_fator, 0)
                ELSE COALESCE(valor_unidade_orientacao, 0)
            END,
            valor_unidade_pavimento = CASE 
                WHEN NEW.tipo_fator = 'Pavimento' THEN COALESCE(valor_fator, 0)
                ELSE COALESCE(valor_unidade_pavimento, 0)
            END,
            valor_unidade_vista = CASE 
                WHEN NEW.tipo_fator = 'Vista' THEN COALESCE(valor_fator, 0)
                ELSE COALESCE(valor_unidade_vista, 0)
            END,
            valor_unidade_bloco = CASE 
                WHEN NEW.tipo_fator = 'Bloco' THEN COALESCE(valor_fator, 0)
                ELSE COALESCE(valor_unidade_bloco, 0)
            END,
            valor_unidade_diferencial = CASE 
                WHEN NEW.tipo_fator = 'Diferencial' THEN COALESCE(valor_fator, 0)
                ELSE COALESCE(valor_unidade_diferencial, 0)
            END,
            valor_unidade_inicial = COALESCE(valor_unidade_base, 0) + COALESCE(valor_unidade_adicionais, 0) + 
                                   COALESCE(valor_unidade_orientacao, 0) + COALESCE(valor_unidade_pavimento, 0) + 
                                   COALESCE(valor_unidade_vista, 0) + COALESCE(valor_unidade_bloco, 0) + 
                                   COALESCE(valor_unidade_diferencial, 0),
            valor_unidade_venda = CASE
                WHEN fase_unidade_venda IS NULL THEN 
                    COALESCE(valor_unidade_base, 0) + COALESCE(valor_unidade_adicionais, 0) + 
                    COALESCE(valor_unidade_orientacao, 0) + COALESCE(valor_unidade_pavimento, 0) + 
                    COALESCE(valor_unidade_vista, 0) + COALESCE(valor_unidade_bloco, 0) + 
                    COALESCE(valor_unidade_diferencial, 0)
                ELSE valor_unidade_venda
            END
        WHERE cenario_id = cenario_id_atual 
        AND unidade_id = unidade_rec.unidade_id;
        
        -- Se não existe registro, criar um
        IF NOT FOUND THEN
            INSERT INTO public.valor_unidades_cenario (
                cenario_id, unidade_id, valor_unidade_base, valor_unidade_adicionais,
                valor_unidade_orientacao, valor_unidade_pavimento, valor_unidade_vista,
                valor_unidade_bloco, valor_unidade_diferencial, valor_unidade_inicial,
                valor_unidade_venda
            ) VALUES (
                cenario_id_atual, unidade_rec.unidade_id, COALESCE(valor_base, 0), COALESCE(valor_adicionais, 0),
                CASE WHEN NEW.tipo_fator = 'Orientacao Solar' THEN COALESCE(valor_fator, 0) ELSE 0 END,
                CASE WHEN NEW.tipo_fator = 'Pavimento' THEN COALESCE(valor_fator, 0) ELSE 0 END,
                CASE WHEN NEW.tipo_fator = 'Vista' THEN COALESCE(valor_fator, 0) ELSE 0 END,
                CASE WHEN NEW.tipo_fator = 'Bloco' THEN COALESCE(valor_fator, 0) ELSE 0 END,
                CASE WHEN NEW.tipo_fator = 'Diferencial' THEN COALESCE(valor_fator, 0) ELSE 0 END,
                valor_inicial_calculado, valor_inicial_calculado
            );
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Etapa 4: Recriar a trigger corrigida
CREATE TRIGGER trg_after_fator_update
AFTER INSERT OR UPDATE ON public.fator_valorizacao
FOR EACH ROW
EXECUTE FUNCTION public.fn_trg_after_fator_update();

-- Etapa 5: Limpar dados antigos (agora sem desabilitar triggers do sistema)
DELETE FROM public.fator_valorizacao
WHERE parametro_precificacao_id IN (1, 2, 3);

-- Etapa 6: Inserir os novos fatores de valorização com dados exatos do CSV
INSERT INTO public.fator_valorizacao (parametro_precificacao_id, tipo_fator, valor_referencia, percentual_valorizacao)
VALUES
    -- Dados para parametro_precificacao_id = 1
    (1, 'Orientacao Solar', 'Norte', 3.0),
    (1, 'Orientacao Solar', 'Sul', 0.0),
    (1, 'Orientacao Solar', 'Leste', 1.0),
    (1, 'Orientacao Solar', 'Oeste', 1.0),
    (1, 'Orientacao Solar', 'Nordeste', 2.0),
    (1, 'Orientacao Solar', 'Noroeste', 2.0),
    (1, 'Orientacao Solar', 'Sudeste', 0.0),
    (1, 'Orientacao Solar', 'Sudoeste', 0.0),
    (1, 'Pavimento', '0', 0.0),
    (1, 'Pavimento', '1', 0.0),
    (1, 'Pavimento', '2', -0.8),
    (1, 'Pavimento', '3', -0.7),
    (1, 'Pavimento', '4', -0.5),
    (1, 'Pavimento', '5', -0.3),
    (1, 'Pavimento', '6', -0.15),
    (1, 'Pavimento', '7', 0.0),
    (1, 'Pavimento', '8', 0.15),
    (1, 'Pavimento', '9', 0.3),
    (1, 'Pavimento', '10', 0.5),
    (1, 'Pavimento', '11', 0.8),
    (1, 'Pavimento', '12', 1.0),
    (1, 'Vista', 'Nao', 0.0),
    (1, 'Vista', 'Sim', 0.5),

    -- Dados para parametro_precificacao_id = 2
    (2, 'Orientacao Solar', 'Norte', 3.0),
    (2, 'Orientacao Solar', 'Sul', 0.0),
    (2, 'Orientacao Solar', 'Leste', 1.0),
    (2, 'Orientacao Solar', 'Oeste', 1.0),
    (2, 'Orientacao Solar', 'Nordeste', 2.0),
    (2, 'Orientacao Solar', 'Noroeste', 2.0),
    (2, 'Orientacao Solar', 'Sudeste', 0.0),
    (2, 'Orientacao Solar', 'Sudoeste', 0.0),
    (2, 'Pavimento', '0', 0.0),
    (2, 'Pavimento', '1', 0.0),
    (2, 'Pavimento', '2', -0.8),
    (2, 'Pavimento', '3', -0.7),
    (2, 'Pavimento', '4', -0.5),
    (2, 'Pavimento', '5', -0.3),
    (2, 'Pavimento', '6', -0.15),
    (2, 'Pavimento', '7', 0.0),
    (2, 'Pavimento', '8', 0.15),
    (2, 'Pavimento', '9', 0.3),
    (2, 'Pavimento', '10', 0.5),
    (2, 'Pavimento', '11', 0.8),
    (2, 'Pavimento', '12', 1.0),
    (2, 'Vista', 'Nao', 0.0),
    (2, 'Vista', 'Sim', 0.5),

    -- Dados para parametro_precificacao_id = 3
    (3, 'Orientacao Solar', 'Norte', 3.0),
    (3, 'Orientacao Solar', 'Sul', 0.0),
    (3, 'Orientacao Solar', 'Leste', 1.0),
    (3, 'Orientacao Solar', 'Oeste', 1.0),
    (3, 'Orientacao Solar', 'Nordeste', 2.0),
    (3, 'Orientacao Solar', 'Noroeste', 2.0),
    (3, 'Orientacao Solar', 'Sudeste', 0.0),
    (3, 'Orientacao Solar', 'Sudoeste', 0.0),
    (3, 'Pavimento', '0', 0.0),
    (3, 'Pavimento', '1', 0.0),
    (3, 'Pavimento', '2', -0.8),
    (3, 'Pavimento', '3', -0.7),
    (3, 'Pavimento', '4', -0.5),
    (3, 'Pavimento', '5', -0.3),
    (3, 'Pavimento', '6', -0.15),
    (3, 'Pavimento', '7', 0.0),
    (3, 'Pavimento', '8', 0.15),
    (3, 'Pavimento', '9', 0.3),
    (3, 'Pavimento', '10', 0.5),
    (3, 'Pavimento', '11', 0.8),
    (3, 'Pavimento', '12', 1.0),
    (3, 'Vista', 'Nao', 0.0),
    (3, 'Vista', 'Sim', 0.5);

-- Etapa 7: Verificar os resultados
SELECT 
    'Fatores inseridos:' as status,
    COUNT(*) as total_fatores
FROM 
    public.fator_valorizacao
WHERE 
    parametro_precificacao_id IN (1, 2, 3);

-- Mostrar uma amostra dos dados inseridos
SELECT 
    parametro_precificacao_id,
    tipo_fator,
    valor_referencia,
    percentual_valorizacao
FROM 
    public.fator_valorizacao
WHERE 
    parametro_precificacao_id IN (1, 2, 3)
ORDER BY 
    parametro_precificacao_id, 
    tipo_fator, 
    CASE 
        WHEN valor_referencia ~ '^[0-9]+$' THEN valor_referencia::integer
        ELSE 999
    END,
    valor_referencia
LIMIT 20;

-- Verificar se os valores das unidades foram recalculados
SELECT 
    'Valores recalculados:' as status,
    COUNT(*) as total_valores
FROM 
    public.valor_unidades_cenario vuc
JOIN parametro_precificacao pp ON vuc.cenario_id = pp.cenario_id
WHERE 
    pp.id IN (1, 2, 3)
    AND vuc.valor_unidade_inicial IS NOT NULL
    AND vuc.valor_unidade_inicial > 0;

-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE '✅ Fatores de valorização inseridos e triggers corrigidos com sucesso!';
    RAISE NOTICE '📊 Total de 69 fatores inseridos (23 para cada parâmetro)';
END $$;
