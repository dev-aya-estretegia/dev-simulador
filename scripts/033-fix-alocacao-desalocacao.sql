-- =================================================================
    -- SCRIPT: 033-fix-alocacao-desalocacao.sql
    -- OBJETIVO: Ajusta as funções de alocação e desalocação para
    --           chamar a função de cálculo centralizada.
    -- DATA: 2024-07-11
    -- =================================================================
    
    BEGIN;
    
    -- Função para alocar unidades
    CREATE OR REPLACE FUNCTION fn_alocar_unidades_fase(p_fase_id INT, p_unidades_ids INT[])
    RETURNS INT AS $$
    DECLARE
        v_cenario_id INT;
        v_fase_nome TEXT;
        v_unidade_id INT;
        v_unidades_alocadas INT := 0;
    BEGIN
        -- Obter informações da fase
        SELECT cenario_id, nome INTO v_cenario_id, v_fase_nome
        FROM fase_venda WHERE id = p_fase_id;
    
        IF v_cenario_id IS NULL THEN
            RAISE EXCEPTION 'Fase com ID % não encontrada.', p_fase_id;
        END IF;
    
        -- Iterar sobre as unidades a serem alocadas
        FOREACH v_unidade_id IN ARRAY p_unidades_ids
        LOOP
            -- Atualizar a fase da unidade
            UPDATE valor_unidades_cenario
            SET fase_unidade_venda = v_fase_nome
            WHERE unidade_id = v_unidade_id
              AND cenario_id = v_cenario_id
              AND fase_unidade_venda IS NULL; -- Apenas se não estiver alocada
    
            IF FOUND THEN
                -- Chamar a função de cálculo para recalcular todos os valores
                PERFORM fn_calcular_valores_fases(v_unidade_id, v_cenario_id);
                v_unidades_alocadas := v_unidades_alocadas + 1;
            END IF;
        END LOOP;
    
        -- Recalcular indicadores do cenário após a alocação
        PERFORM fn_calcular_indicadores_cenario(v_cenario_id);
    
        RETURN v_unidades_alocadas;
    END;
    $$ LANGUAGE plpgsql;
    
    -- Função para desalocar unidades
    CREATE OR REPLACE FUNCTION fn_desalocar_unidades_fase(p_fase_id INT, p_unidades_ids INT[])
    RETURNS INT AS $$
    DECLARE
        v_cenario_id INT;
        v_fase_nome TEXT;
        v_unidade_id INT;
        v_unidades_desalocadas INT := 0;
    BEGIN
        -- Obter informações da fase
        SELECT cenario_id, nome INTO v_cenario_id, v_fase_nome
        FROM fase_venda WHERE id = p_fase_id;
    
        IF v_cenario_id IS NULL THEN
            RAISE EXCEPTION 'Fase com ID % não encontrada.', p_fase_id;
        END IF;
    
        -- Iterar sobre as unidades a serem desalocadas
        FOREACH v_unidade_id IN ARRAY p_unidades_ids
        LOOP
            -- Remover a alocação da fase
            UPDATE valor_unidades_cenario
            SET fase_unidade_venda = NULL
            WHERE unidade_id = v_unidade_id
              AND cenario_id = v_cenario_id
              AND fase_unidade_venda = v_fase_nome;
    
            IF FOUND THEN
                -- Chamar a função de cálculo para recalcular todos os valores
                PERFORM fn_calcular_valores_fases(v_unidade_id, v_cenario_id);
                v_unidades_desalocadas := v_unidades_desalocadas + 1;
            END IF;
        END LOOP;
    
        -- Recalcular indicadores do cenário após a desalocação
        PERFORM fn_calcular_indicadores_cenario(v_cenario_id);
    
        RETURN v_unidades_desalocadas;
    END;
    $$ LANGUAGE plpgsql;
    
    COMMIT;
