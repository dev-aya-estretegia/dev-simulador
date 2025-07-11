-- ESTRATÉGIA 1: Desabilitar triggers durante inserção e reprocessar depois
-- Esta é a abordagem mais segura para o fluxo de cadastro

BEGIN;

-- Função para reprocessar todas as unidades de um empreendimento após inserção dos parâmetros
CREATE OR REPLACE FUNCTION fn_reprocessar_unidades_empreendimento(p_empreendimento_id INTEGER)
RETURNS TABLE(
    unidade_id INTEGER,
    cenario_id INTEGER,
    valor_calculado DECIMAL,
    status TEXT
) AS $$
DECLARE
    r_cenario RECORD;
    r_unidade RECORD;
    v_valor_inicial DECIMAL;
BEGIN
    -- Para cada cenário do empreendimento
    FOR r_cenario IN 
        SELECT c.id as cenario_id, c.nome as cenario_nome
        FROM cenario c 
        WHERE c.empreendimento_id = p_empreendimento_id
    LOOP
        -- Verificar se existe parâmetro de precificação para este cenário
        IF EXISTS (SELECT 1 FROM parametro_precificacao pp WHERE pp.cenario_id = r_cenario.cenario_id) THEN
            
            -- Para cada unidade do empreendimento
            FOR r_unidade IN 
                SELECT u.id as unidade_id, u.nome as unidade_nome
                FROM unidade u 
                WHERE u.empreendimento_id = p_empreendimento_id
            LOOP
                BEGIN
                    -- Verificar se a função de cálculo existe antes de chamar
                    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'fn_calcular_valor_inicial_unidade') THEN
                        -- Calcular valor inicial da unidade
                        SELECT valor_unidade_inicial INTO v_valor_inicial
                        FROM fn_calcular_valor_inicial_unidade(r_unidade.unidade_id, r_cenario.cenario_id);
                        
                        -- Calcular valores das fases se a função existir
                        IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'fn_calcular_valores_fases') THEN
                            PERFORM fn_calcular_valores_fases(r_unidade.unidade_id, r_cenario.cenario_id);
                        END IF;
                        
                        status := 'SUCESSO';
                    ELSE
                        v_valor_inicial := 0;
                        status := 'FUNÇÕES_NÃO_ENCONTRADAS';
                    END IF;
                    
                    -- Retornar resultado
                    unidade_id := r_unidade.unidade_id;
                    cenario_id := r_cenario.cenario_id;
                    valor_calculado := v_valor_inicial;
                    RETURN NEXT;
                    
                EXCEPTION WHEN OTHERS THEN
                    -- Em caso de erro, registrar mas continuar
                    unidade_id := r_unidade.unidade_id;
                    cenario_id := r_cenario.cenario_id;
                    valor_calculado := 0;
                    status := 'ERRO: ' || SQLERRM;
                    RETURN NEXT;
                END;
            END LOOP;
            
            -- Recalcular indicadores do cenário se a função existir
            IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'fn_calcular_indicadores_cenario') THEN
                PERFORM fn_calcular_indicadores_cenario(r_cenario.cenario_id);
            END IF;
            
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

COMMIT;
