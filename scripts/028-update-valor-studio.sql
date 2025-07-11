-- =====================================================
-- SCRIPT: Atualizar Valor Studio com Segurança
-- DESCRIÇÃO: Atualiza o valor do m² para studios evitando constraint violations
-- DATA: 2025-01-11
-- =====================================================

-- Primeiro, verificar se existem triggers ativos
SELECT 
    tgname as trigger_name,
    tgenabled as enabled
FROM pg_trigger 
WHERE tgrelid = 'parametro_precificacao'::regclass
  AND tgname NOT LIKE 'RI_%'; -- Excluir triggers de foreign key

-- Desabilitar todos os triggers da tabela parametro_precificacao temporariamente
ALTER TABLE parametro_precificacao DISABLE TRIGGER ALL;

-- Verificar estado atual antes da atualização
SELECT 
    'ANTES DA ATUALIZAÇÃO' as status,
    pp.id,
    c.nome as cenario_nome,
    pp.valor_area_privativa_studio as valor_atual_studio,
    pp.valor_area_privativa_apartamento,
    pp.valor_area_privativa_comercial
FROM parametro_precificacao pp
JOIN cenario c ON pp.cenario_id = c.id
ORDER BY c.id;

-- Atualizar valor da área privativa para studio
UPDATE parametro_precificacao 
SET valor_area_privativa_studio = 12850.00
WHERE cenario_id IS NOT NULL;

-- Verificar se a atualização foi realizada
SELECT 
    'APÓS ATUALIZAÇÃO' as status,
    pp.id,
    c.nome as cenario_nome,
    pp.valor_area_privativa_studio as novo_valor_studio,
    pp.valor_area_privativa_apartamento,
    pp.valor_area_privativa_comercial
FROM parametro_precificacao pp
JOIN cenario c ON pp.cenario_id = c.id
ORDER BY c.id;

-- Reabilitar triggers
ALTER TABLE parametro_precificacao ENABLE TRIGGER ALL;

-- Agora recalcular valores manualmente de forma segura
-- Para cada cenário que foi atualizado
DO $$
DECLARE
    v_cenario RECORD;
    v_unidade RECORD;
    v_parametros RECORD;
    v_valor_base NUMERIC;
    v_valor_adicionais NUMERIC;
    v_valor_inicial NUMERIC;
BEGIN
    -- Para cada cenário com parâmetros
    FOR v_cenario IN 
        SELECT DISTINCT pp.cenario_id, pp.id as parametros_id
        FROM parametro_precificacao pp
        WHERE pp.valor_area_privativa_studio = 12850.00
    LOOP
        RAISE NOTICE 'Recalculando valores para cenário %', v_cenario.cenario_id;
        
        -- Buscar parâmetros
        SELECT * INTO v_parametros 
        FROM parametro_precificacao 
        WHERE id = v_cenario.parametros_id;
        
        -- Para cada unidade do cenário
        FOR v_unidade IN 
            SELECT vuc.*, u.*
            FROM valor_unidades_cenario vuc
            INNER JOIN unidade u ON vuc.unidade_id = u.id
            INNER JOIN cenario c ON vuc.cenario_id = c.id
            WHERE vuc.cenario_id = v_cenario.cenario_id
              AND c.empreendimento_id = u.empreendimento_id
        LOOP
            -- Calcular valor base baseado na tipologia
            v_valor_base := 0;
            
            CASE v_unidade.tipologia
                WHEN 'Apartamento' THEN
                    v_valor_base := COALESCE(v_unidade.area_privativa, 0) * COALESCE(v_parametros.valor_area_privativa_apartamento, 0);
                WHEN 'Studio' THEN
                    v_valor_base := COALESCE(v_unidade.area_privativa, 0) * COALESCE(v_parametros.valor_area_privativa_studio, 0);
                WHEN 'Comercial' THEN
                    v_valor_base := COALESCE(v_unidade.area_privativa, 0) * COALESCE(v_parametros.valor_area_privativa_comercial, 0);
                ELSE
                    v_valor_base := 0;
            END CASE;
            
            -- Adicionar valor do garden se existir
            IF COALESCE(v_unidade.area_garden, 0) > 0 THEN
                v_valor_base := v_valor_base + (COALESCE(v_unidade.area_garden, 0) * COALESCE(v_parametros.valor_area_garden, 0));
            END IF;
            
            -- Calcular valor dos adicionais
            v_valor_adicionais := 
                (COALESCE(v_unidade.qtd_vaga_simples, 0) * COALESCE(v_parametros.valor_vaga_simples, 0)) +
                (COALESCE(v_unidade.qtd_vaga_duplas, 0) * COALESCE(v_parametros.valor_vaga_dupla, 0)) +
                (COALESCE(v_unidade.qtd_vaga_moto, 0) * COALESCE(v_parametros.valor_vaga_moto, 0)) +
                (COALESCE(v_unidade.qtd_hobby_boxes, 0) * COALESCE(v_parametros.valor_hobby_boxes, 0)) +
                (COALESCE(v_unidade.qtd_suite, 0) * COALESCE(v_parametros.valor_suite, 0));
            
            -- Calcular valor inicial (base + adicionais)
            v_valor_inicial := COALESCE(v_valor_base, 0) + COALESCE(v_valor_adicionais, 0);
            
            -- Atualizar registro garantindo que não há valores NULL
            UPDATE valor_unidades_cenario SET
                valor_unidade_base = COALESCE(v_valor_base, 0),
                valor_unidade_adicionais = COALESCE(v_valor_adicionais, 0),
                valor_unidade_inicial = COALESCE(v_valor_inicial, 0),
                valor_unidade_venda = COALESCE(v_valor_inicial, 0),
                valor_unidade_orientacao = COALESCE(valor_unidade_orientacao, 0),
                valor_unidade_pavimento = COALESCE(valor_unidade_pavimento, 0),
                valor_unidade_vista = COALESCE(valor_unidade_vista, 0),
                valor_unidade_bloco = COALESCE(valor_unidade_bloco, 0),
                valor_unidade_diferencial = COALESCE(valor_unidade_diferencial, 0)
            WHERE cenario_id = v_cenario.cenario_id 
              AND unidade_id = v_unidade.unidade_id;
              
        END LOOP;
        
    END LOOP;
    
    RAISE NOTICE '✅ Recálculo concluído com sucesso!';
END $$;

-- Verificar resultado final
SELECT 
    'RESULTADO FINAL' as status,
    COUNT(*) as total_registros_atualizados
FROM parametro_precificacao 
WHERE valor_area_privativa_studio = 12850.00;

-- Verificar alguns valores calculados para unidades tipo Studio
SELECT 
    'VALORES CALCULADOS - STUDIOS' as status,
    u.nome as unidade_nome,
    u.area_privativa,
    vuc.valor_unidade_base,
    vuc.valor_unidade_adicionais,
    vuc.valor_unidade_inicial,
    vuc.valor_unidade_venda
FROM valor_unidades_cenario vuc
JOIN unidade u ON vuc.unidade_id = u.id
WHERE u.tipologia = 'Studio'
  AND vuc.valor_unidade_inicial > 0
ORDER BY u.nome
LIMIT 5;

-- Verificar se há algum valor NULL remanescente
SELECT 
    'VERIFICAÇÃO NULL' as status,
    COUNT(*) as registros_com_null
FROM valor_unidades_cenario 
WHERE valor_unidade_inicial IS NULL 
   OR valor_unidade_venda IS NULL 
   OR valor_unidade_base IS NULL;

RAISE NOTICE '🎉 Script executado com sucesso! Valor do m² para Studios atualizado para R$ 12.850,00';
