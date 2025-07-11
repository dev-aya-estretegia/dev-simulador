-- =====================================================
-- SCRIPT: Exclusão Completa do Cenário ID = 2
-- OBJETIVO: Remover cenário e todas suas dependências
-- DATA: $(date)
-- ATENÇÃO: Este script é IRREVERSÍVEL!
-- =====================================================

-- Verificar se o cenário existe antes de prosseguir
DO $$
DECLARE
    cenario_existe INTEGER;
    empreendimento_nome TEXT;
    cenario_nome TEXT;
BEGIN
    -- Verificar se o cenário existe
    SELECT COUNT(*) INTO cenario_existe 
    FROM cenario 
    WHERE id = 2;
    
    IF cenario_existe = 0 THEN
        RAISE NOTICE 'AVISO: Cenário com ID = 2 não existe no banco de dados.';
        RETURN;
    END IF;
    
    -- Obter informações do cenário para log
    SELECT 
        c.nome,
        e.nome
    INTO cenario_nome, empreendimento_nome
    FROM cenario c
    JOIN empreendimento e ON c.empreendimento_id = e.id
    WHERE c.id = 2;
    
    RAISE NOTICE 'Iniciando exclusão do cenário: % (Empreendimento: %)', cenario_nome, empreendimento_nome;
END $$;

-- =====================================================
-- FASE 1: CONTAGEM INICIAL DOS REGISTROS
-- =====================================================

-- Contar registros que serão excluídos
SELECT 
    'ANTES DA EXCLUSÃO' as momento,
    'valor_unidades_fase' as tabela,
    COUNT(*) as registros
FROM valor_unidades_fase 
WHERE cenario_id = 2

UNION ALL

SELECT 
    'ANTES DA EXCLUSÃO' as momento,
    'valor_unidades_cenario' as tabela,
    COUNT(*) as registros
FROM valor_unidades_cenario 
WHERE cenario_id = 2

UNION ALL

SELECT 
    'ANTES DA EXCLUSÃO' as momento,
    'fator_valorizacao' as tabela,
    COUNT(*) as registros
FROM fator_valorizacao fv
JOIN parametro_precificacao pp ON fv.parametro_precificacao_id = pp.id
WHERE pp.cenario_id = 2

UNION ALL

SELECT 
    'ANTES DA EXCLUSÃO' as momento,
    'fase_venda' as tabela,
    COUNT(*) as registros
FROM fase_venda 
WHERE cenario_id = 2

UNION ALL

SELECT 
    'ANTES DA EXCLUSÃO' as momento,
    'parametro_precificacao' as tabela,
    COUNT(*) as registros
FROM parametro_precificacao 
WHERE cenario_id = 2

UNION ALL

SELECT 
    'ANTES DA EXCLUSÃO' as momento,
    'cenario' as tabela,
    COUNT(*) as registros
FROM cenario 
WHERE id = 2

ORDER BY tabela;

-- =====================================================
-- FASE 2: EXCLUSÃO EM CASCATA (ORDEM DAS DEPENDÊNCIAS)
-- =====================================================

-- Iniciar transação para garantir atomicidade
BEGIN;

-- 1. Excluir registros da tabela VALOR_UNIDADES_FASE
DELETE FROM valor_unidades_fase 
WHERE cenario_id = 2;

-- 2. Excluir registros da tabela VALOR_UNIDADES_CENARIO
DELETE FROM valor_unidades_cenario 
WHERE cenario_id = 2;

-- 3. Excluir FATORES DE VALORIZAÇÃO (através do parametro_precificacao_id)
DELETE FROM fator_valorizacao 
WHERE parametro_precificacao_id IN (
    SELECT id 
    FROM parametro_precificacao 
    WHERE cenario_id = 2
);

-- 4. Excluir FASES DE VENDA do cenário
DELETE FROM fase_venda 
WHERE cenario_id = 2;

-- 5. Excluir PARÂMETROS DE PRECIFICAÇÃO do cenário
DELETE FROM parametro_precificacao 
WHERE cenario_id = 2;

-- 6. Excluir o CENÁRIO principal
DELETE FROM cenario 
WHERE id = 2;

-- Confirmar transação
COMMIT;

-- =====================================================
-- FASE 3: VERIFICAÇÃO PÓS-EXCLUSÃO
-- =====================================================

-- Verificar se todas as exclusões foram realizadas
SELECT 
    'APÓS EXCLUSÃO' as momento,
    'valor_unidades_fase' as tabela,
    COUNT(*) as registros_restantes
FROM valor_unidades_fase 
WHERE cenario_id = 2

UNION ALL

SELECT 
    'APÓS EXCLUSÃO' as momento,
    'valor_unidades_cenario' as tabela,
    COUNT(*) as registros_restantes
FROM valor_unidades_cenario 
WHERE cenario_id = 2

UNION ALL

SELECT 
    'APÓS EXCLUSÃO' as momento,
    'fator_valorizacao' as tabela,
    COUNT(*) as registros_restantes
FROM fator_valorizacao fv
JOIN parametro_precificacao pp ON fv.parametro_precificacao_id = pp.id
WHERE pp.cenario_id = 2

UNION ALL

SELECT 
    'APÓS EXCLUSÃO' as momento,
    'fase_venda' as tabela,
    COUNT(*) as registros_restantes
FROM fase_venda 
WHERE cenario_id = 2

UNION ALL

SELECT 
    'APÓS EXCLUSÃO' as momento,
    'parametro_precificacao' as tabela,
    COUNT(*) as registros_restantes
FROM parametro_precificacao 
WHERE cenario_id = 2

UNION ALL

SELECT 
    'APÓS EXCLUSÃO' as momento,
    'cenario' as tabela,
    COUNT(*) as registros_restantes
FROM cenario 
WHERE id = 2

ORDER BY tabela;

-- =====================================================
-- FASE 4: VERIFICAÇÃO DE INTEGRIDADE
-- =====================================================

-- Verificar se não há registros órfãos relacionados ao cenário excluído
SELECT 
    'VERIFICAÇÃO DE ÓRFÃOS' as tipo,
    'Registros em valor_unidades_fase com cenario_id = 2' as descricao,
    COUNT(*) as quantidade
FROM valor_unidades_fase 
WHERE cenario_id = 2

UNION ALL

SELECT 
    'VERIFICAÇÃO DE ÓRFÃOS' as tipo,
    'Registros em valor_unidades_cenario com cenario_id = 2' as descricao,
    COUNT(*) as quantidade
FROM valor_unidades_cenario 
WHERE cenario_id = 2

UNION ALL

SELECT 
    'VERIFICAÇÃO DE ÓRFÃOS' as tipo,
    'Registros em fase_venda com cenario_id = 2' as descricao,
    COUNT(*) as quantidade
FROM fase_venda 
WHERE cenario_id = 2;

-- =====================================================
-- FASE 5: RELATÓRIO FINAL
-- =====================================================

-- Listar cenários restantes para confirmação
SELECT 
    c.id,
    c.nome as cenario_nome,
    e.nome as empreendimento_nome,
    c.descricao,
    'CENÁRIO RESTANTE' as status
FROM cenario c
JOIN empreendimento e ON c.empreendimento_id = e.id
ORDER BY c.id;

-- =====================================================
-- RESULTADO ESPERADO:
-- - Cenário ID = 2 completamente removido
-- - Todas as tabelas relacionadas sem registros órfãos
-- - Integridade referencial mantida
-- =====================================================

-- Mensagem de confirmação
SELECT 
    'EXCLUSÃO CONCLUÍDA COM SUCESSO!' as status,
    'Cenário ID = 2 e todas suas dependências foram removidos' as detalhes,
    NOW() as timestamp_exclusao;
