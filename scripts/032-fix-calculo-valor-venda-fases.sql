-- =================================================================
    -- SCRIPT: 032-fix-calculo-valor-venda-fases.sql
    -- OBJETIVO: Corrige a função fn_calcular_valores_fases para
    --           atribuir corretamente o valor_unidade_venda.
    -- DATA: 2024-07-11
    -- =================================================================
    
    BEGIN;
    
    CREATE OR REPLACE FUNCTION fn_calcular_valores_fases(p_unidade_id INT, p_cenario_id INT)
    RETURNS void AS $$
    DECLARE
        v_valor_inicial NUMERIC;
        v_fase_alocada TEXT;
        v_fase RECORD;
        v_valores_fases NUMERIC[10];
        v_valor_fase_anterior NUMERIC;
        v_valor_venda_final NUMERIC;
        v_fase_alocada_ordem INT;
        v_valor_na_fase_alocada NUMERIC;
        v_ultima_fase_valor NUMERIC;
    BEGIN
        -- 1. Obter o valor inicial e a fase alocada da unidade
        SELECT valor_unidade_inicial, fase_unidade_venda
        INTO v_valor_inicial, v_fase_alocada
        FROM valor_unidades_cenario
        WHERE unidade_id = p_unidade_id AND cenario_id = p_cenario_id;
    
        -- Se não houver valor inicial, não há o que calcular
        IF v_valor_inicial IS NULL THEN
            RETURN;
        END IF;
    
        -- Inicializar valores
        v_valor_fase_anterior := v_valor_inicial;
        v_ultima_fase_valor := v_valor_inicial;
    
        -- 2. Calcular o valor para cada uma das 10 fases possíveis
        FOR v_fase IN
            SELECT id, nome, ordem, percentual_reajuste
            FROM fase_venda
            WHERE cenario_id = p_cenario_id
            ORDER BY ordem
            LIMIT 10
        LOOP
            IF v_fase.ordem = 1 THEN
                v_valores_fases[v_fase.ordem] := v_valor_inicial;
            ELSE
                v_valores_fases[v_fase.ordem] := v_valor_fase_anterior * (1 + (v_fase.percentual_reajuste / 100.0));
            END IF;
    
            v_valor_fase_anterior := v_valores_fases[v_fase.ordem];
            v_ultima_fase_valor := v_valores_fases[v_fase.ordem];
    
            -- Atualizar a tabela de valores por fase
            INSERT INTO valor_unidades_fase (fase_id, unidade_id, cenario_id, valor_unidade_na_fase)
            VALUES (v_fase.id, p_unidade_id, p_cenario_id, v_valores_fases[v_fase.ordem])
            ON CONFLICT (fase_id, unidade_id, cenario_id)
            DO UPDATE SET valor_unidade_na_fase = EXCLUDED.valor_unidade_na_fase;
        END LOOP;
    
        -- 3. Determinar o valor_unidade_venda final
        IF v_fase_alocada IS NOT NULL THEN
            -- Se a unidade está alocada, o valor de venda é o daquela fase
            SELECT fv.ordem, vuf.valor_unidade_na_fase
            INTO v_fase_alocada_ordem, v_valor_na_fase_alocada
            FROM fase_venda fv
            JOIN valor_unidades_fase vuf ON fv.id = vuf.fase_id
            WHERE fv.cenario_id = p_cenario_id
              AND vuf.unidade_id = p_unidade_id
              AND fv.nome = v_fase_alocada;
    
            v_valor_venda_final := v_valor_na_fase_alocada;
    
            -- Congelar os valores das fases futuras
            FOR i IN (v_fase_alocada_ordem + 1)..10 LOOP
                v_valores_fases[i] := v_valor_na_fase_alocada;
            END LOOP;
    
        ELSE
            -- Se não está alocada, o valor de venda é o da última fase calculada
            v_valor_venda_final := v_ultima_fase_valor;
        END IF;
    
        -- 4. Atualizar a tabela principal com todos os valores calculados
        UPDATE valor_unidades_cenario
        SET
            valor_unidade_fase_1 = v_valores_fases[1],
            valor_unidade_fase_2 = v_valores_fases[2],
            valor_unidade_fase_3 = v_valores_fases[3],
            valor_unidade_fase_4 = v_valores_fases[4],
            valor_unidade_fase_5 = v_valores_fases[5],
            valor_unidade_fase_6 = v_valores_fases[6],
            valor_unidade_fase_7 = v_valores_fases[7],
            valor_unidade_fase_8 = v_valores_fases[8],
            valor_unidade_fase_9 = v_valores_fases[9],
            valor_unidade_fase_10 = v_valores_fases[10],
            valor_unidade_venda = v_valor_venda_final
        WHERE
            unidade_id = p_unidade_id AND cenario_id = p_cenario_id;
    
    END;
    $$ LANGUAGE plpgsql;
    
    COMMIT;
