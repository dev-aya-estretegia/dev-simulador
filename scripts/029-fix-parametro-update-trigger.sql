-- =================================================================
-- SCRIPT: 029-fix-parametro-update-trigger.sql
-- DESCRIÇÃO: Corrige a trigger e a função associada à tabela
--            parametro_precificacao para evitar erros de not-null
--            constraint na tabela valor_unidades_cenario.
-- DATA: 2025-07-11
-- =================================================================

-- Passo 1: Remover a trigger e a função antigas para garantir um estado limpo.
-- Usamos "IF EXISTS" para evitar erros caso não existam.
DROP TRIGGER IF EXISTS trg_after_parametro_update ON public.parametro_precificacao;
DROP FUNCTION IF EXISTS public.fn_trg_after_parametro_update();

-- Passo 2: Criar a nova função do trigger com lógica robusta.
-- Esta função será chamada sempre que um registro em parametro_precificacao for inserido ou atualizado.
CREATE OR REPLACE FUNCTION public.fn_trg_after_parametro_update()
RETURNS TRIGGER AS $$
DECLARE
    unidade_rec RECORD;
    valor_base NUMERIC;
    valor_adicionais NUMERIC;
    valor_inicial_calculado NUMERIC;
BEGIN
    -- Loop por todas as unidades associadas ao empreendimento deste cenário.
    FOR unidade_rec IN
        SELECT u.id AS unidade_id, u.tipologia, u.area_privativa, u.area_garden,
               u.qtd_vaga_simples, u.qtd_vaga_duplas, u.qtd_vaga_moto,
               u.qtd_hobby_boxes, u.qtd_suite
        FROM public.unidade u
        JOIN public.cenario c ON u.empreendimento_id = c.empreendimento_id
        WHERE c.id = NEW.cenario_id
    LOOP
        -- Calcular o valor base da unidade usando COALESCE para tratar valores NULL.
        valor_base := 
            CASE unidade_rec.tipologia
                WHEN 'Apartamento' THEN COALESCE(unidade_rec.area_privativa, 0) * COALESCE(NEW.valor_area_privativa_apartamento, 0)
                WHEN 'Studio' THEN COALESCE(unidade_rec.area_privativa, 0) * COALESCE(NEW.valor_area_privativa_studio, 0)
                WHEN 'Comercial' THEN COALESCE(unidade_rec.area_privativa, 0) * COALESCE(NEW.valor_area_privativa_comercial, 0)
                ELSE 0
            END;

        -- Adicionar o valor da área garden, se houver.
        valor_base := valor_base + (COALESCE(unidade_rec.area_garden, 0) * COALESCE(NEW.valor_area_garden, 0));

        -- Calcular o valor dos itens adicionais.
        valor_adicionais :=
            (COALESCE(unidade_rec.qtd_vaga_simples, 0) * COALESCE(NEW.valor_vaga_simples, 0)) +
            (COALESCE(unidade_rec.qtd_vaga_duplas, 0) * COALESCE(NEW.valor_vaga_dupla, 0)) +
            (COALESCE(unidade_rec.qtd_vaga_moto, 0) * COALESCE(NEW.valor_vaga_moto, 0)) +
            (COALESCE(unidade_rec.qtd_hobby_boxes, 0) * COALESCE(NEW.valor_hobby_boxes, 0)) +
            (COALESCE(unidade_rec.qtd_suite, 0) * COALESCE(NEW.valor_suite, 0));

        -- O valor inicial é a soma do valor base e dos adicionais.
        valor_inicial_calculado := COALESCE(valor_base, 0) + COALESCE(valor_adicionais, 0);

        -- Inserir ou atualizar o registro na tabela valor_unidades_cenario.
        -- O UPSERT (ON CONFLICT) garante que, se o registro já existir, ele será atualizado.
        -- Se não existir, será inserido.
        INSERT INTO public.valor_unidades_cenario (
            cenario_id,
            unidade_id,
            valor_unidade_base,
            valor_unidade_adicionais,
            valor_unidade_inicial,
            valor_unidade_venda
        )
        VALUES (
            NEW.cenario_id,
            unidade_rec.unidade_id,
            COALESCE(valor_base, 0),
            COALESCE(valor_adicionais, 0),
            valor_inicial_calculado,
            valor_inicial_calculado -- Inicialmente, o valor de venda é igual ao valor inicial.
        )
        ON CONFLICT (cenario_id, unidade_id)
        DO UPDATE SET
            valor_unidade_base = EXCLUDED.valor_unidade_base,
            valor_unidade_adicionais = EXCLUDED.valor_unidade_adicionais,
            valor_unidade_inicial = EXCLUDED.valor_unidade_inicial,
            -- Atualiza o valor de venda apenas se a unidade não estiver alocada a uma fase.
            valor_unidade_venda = CASE
                                    WHEN valor_unidades_cenario.fase_unidade_venda IS NULL THEN EXCLUDED.valor_unidade_venda
                                    ELSE valor_unidades_cenario.valor_unidade_venda
                                  END;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Passo 3: Recriar a trigger para que seja acionada após INSERT ou UPDATE.
CREATE TRIGGER trg_after_parametro_update
AFTER INSERT OR UPDATE ON public.parametro_precificacao
FOR EACH ROW
EXECUTE FUNCTION public.fn_trg_after_parametro_update();

-- Mensagem de confirmação
DO $$
BEGIN
    RAISE NOTICE '✅ Trigger trg_after_parametro_update e função fn_trg_after_parametro_update corrigidos com sucesso!';
END $$;
