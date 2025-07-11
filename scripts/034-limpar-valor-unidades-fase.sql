-- =============================================================================
-- Script: 034-limpar-valor-unidades-fase.sql
-- Descrição: Limpa todos os registros da tabela "valor_unidades_fase".
--            Este script é útil para resetar o estado das alocações de fase
--            antes de iniciar um novo processo de alocação de unidades.
-- Autor: v0
-- Data: 2024-07-11
-- =============================================================================

-- Inicia uma transação para garantir a atomicidade da operação.
BEGIN;

DO $$
DECLARE
    initial_count INT;
    final_count INT;
BEGIN
    -- 1. Contar a quantidade de registros existentes na tabela.
    SELECT COUNT(*) INTO initial_count FROM public.valor_unidades_fase;
    RAISE NOTICE '-------------------------------------------------------------------';
    RAISE NOTICE 'Iniciando limpeza da tabela "valor_unidades_fase"...';
    RAISE NOTICE 'Quantidade de registros encontrados: %', initial_count;
    RAISE NOTICE '-------------------------------------------------------------------';

    -- 2. Limpar a tabela usando TRUNCATE.
    -- TRUNCATE é mais rápido que DELETE para apagar todos os registros e
    -- também reseta qualquer sequência de auto-incremento associada.
    IF initial_count > 0 THEN
        TRUNCATE TABLE public.valor_unidades_fase RESTART IDENTITY;
        RAISE NOTICE 'Tabela "valor_unidades_fase" foi limpa com sucesso.';
    ELSE
        RAISE NOTICE 'Tabela "valor_unidades_fase" já está vazia. Nenhuma ação foi necessária.';
    END IF;

    -- 3. Verificar a contagem final para confirmar a limpeza.
    SELECT COUNT(*) INTO final_count FROM public.valor_unidades_fase;
    RAISE NOTICE '-------------------------------------------------------------------';
    RAISE NOTICE 'Verificação final:';
    RAISE NOTICE 'Quantidade de registros após a limpeza: %', final_count;
    RAISE NOTICE '-------------------------------------------------------------------';

    -- Confirma que a operação foi bem-sucedida.
    IF final_count = 0 THEN
        RAISE NOTICE '✅ Limpeza concluída com sucesso!';
    ELSE
        RAISE NOTICE '❌ ERRO: A tabela não foi limpa corretamente. Verifique o processo.';
        -- Em caso de erro, a transação será revertida pelo ROLLBACK abaixo.
        RAISE EXCEPTION 'Falha ao limpar a tabela valor_unidades_fase';
    END IF;

END $$;

-- Confirma a transação se tudo ocorreu bem.
COMMIT;
