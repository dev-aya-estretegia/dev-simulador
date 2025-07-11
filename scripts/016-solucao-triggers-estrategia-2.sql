-- ESTRATÉGIA 2: Modificar a trigger para ser mais robusta
-- Esta abordagem melhora as triggers existentes para lidar com dados ausentes

BEGIN;

-- Função melhorada para trigger de unidade que não falha se não houver parâmetros
CREATE OR REPLACE FUNCTION fn_trg_after_unidade_update_safe()
RETURNS TRIGGER AS $$
DECLARE
    r_cenario RECORD;
    v_tem_parametros BOOLEAN;
BEGIN
    -- Para cada cenário do empreendimento da unidade
    FOR r_cenario IN 
        SELECT id as cenario_id 
        FROM cenario 
        WHERE empreendimento_id = NEW.empreendimento_id
    LOOP
        -- Verificar se existe parâmetro de precificação para este cenário
        SELECT EXISTS (
            SELECT 1 FROM parametro_precificacao 
            WHERE cenario_id = r_cenario.cenario_id
        ) INTO v_tem_parametros;
        
        -- Só calcular se houver parâmetros
        IF v_tem_parametros THEN
            BEGIN
                -- Verificar se as funções existem antes de chamar
                IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'fn_calcular_valor_inicial_unidade') THEN
                    -- Calcular valor inicial
                    PERFORM fn_calcular_valor_inicial_unidade(NEW.id, r_cenario.cenario_id);
                END IF;
                
                -- Calcular valores das fases
                IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'fn_calcular_valores_fases') THEN
                    PERFORM fn_calcular_valores_fases(NEW.id, r_cenario.cenario_id);
                END IF;
                
                -- Atualizar indicadores do cenário
                IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'fn_calcular_indicadores_cenario') THEN
                    PERFORM fn_calcular_indicadores_cenario(r_cenario.cenario_id);
                END IF;
                
            EXCEPTION WHEN OTHERS THEN
                -- Log do erro mas não interrompe a operação
                RAISE NOTICE 'Erro ao calcular valores para unidade % no cenário %: %', 
                    NEW.id, r_cenario.cenario_id, SQLERRM;
            END;
        ELSE
            -- Log informativo
            RAISE NOTICE 'Parâmetros não encontrados para cenário %. Cálculos serão executados após inserção dos parâmetros.', 
                r_cenario.cenario_id;
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Verificar se a trigger existe antes de tentar recriar
DO $$
BEGIN
    -- Remover trigger existente se houver
    IF EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'trg_after_unidade_update') THEN
        DROP TRIGGER trg_after_unidade_update ON unidade;
    END IF;
    
    -- Criar a nova trigger com a função segura
    CREATE TRIGGER trg_after_unidade_update
        AFTER INSERT OR UPDATE ON unidade
        FOR EACH ROW
        EXECUTE FUNCTION fn_trg_after_unidade_update_safe();
END $$;

COMMIT;
