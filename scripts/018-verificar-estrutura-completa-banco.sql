-- Script completo para verificar a estrutura atual do banco de dados
-- Este script nos ajudará a entender o que realmente existe no banco

-- ========================================
-- 1. VERIFICAR TODAS AS TABELAS EXISTENTES
-- ========================================
SELECT 
    'TABELAS EXISTENTES' as categoria,
    table_name as nome,
    table_type as tipo
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- ========================================
-- 2. VERIFICAR TODAS AS FUNÇÕES EXISTENTES
-- ========================================
SELECT 
    'FUNÇÕES EXISTENTES' as categoria,
    routine_name as nome,
    routine_type as tipo,
    data_type as retorno
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- ========================================
-- 3. VERIFICAR TODAS AS TRIGGERS EXISTENTES
-- ========================================
SELECT 
    'TRIGGERS EXISTENTES' as categoria,
    trigger_name as nome,
    event_object_table as tabela,
    event_manipulation as evento,
    action_timing as momento
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ========================================
-- 4. VERIFICAR TODAS AS VIEWS EXISTENTES
-- ========================================
SELECT 
    'VIEWS EXISTENTES' as categoria,
    table_name as nome,
    'VIEW' as tipo
FROM information_schema.views 
WHERE table_schema = 'public'
ORDER BY table_name;

-- ========================================
-- 5. ESTRUTURA DA TABELA EMPREENDIMENTO (se existir)
-- ========================================
SELECT 
    'ESTRUTURA EMPREENDIMENTO' as categoria,
    column_name as coluna,
    data_type as tipo,
    is_nullable as permite_null,
    column_default as valor_padrao
FROM information_schema.columns 
WHERE table_name = 'empreendimento' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========================================
-- 6. ESTRUTURA DA TABELA UNIDADE (se existir)
-- ========================================
SELECT 
    'ESTRUTURA UNIDADE' as categoria,
    column_name as coluna,
    data_type as tipo,
    is_nullable as permite_null,
    column_default as valor_padrao
FROM information_schema.columns 
WHERE table_name = 'unidade' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========================================
-- 7. ESTRUTURA DA TABELA CENARIO (se existir)
-- ========================================
SELECT 
    'ESTRUTURA CENARIO' as categoria,
    column_name as coluna,
    data_type as tipo,
    is_nullable as permite_null,
    column_default as valor_padrao
FROM information_schema.columns 
WHERE table_name = 'cenario' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========================================
-- 8. ESTRUTURA DA TABELA PARAMETRO_PRECIFICACAO (se existir)
-- ========================================
SELECT 
    'ESTRUTURA PARAMETRO_PRECIFICACAO' as categoria,
    column_name as coluna,
    data_type as tipo,
    is_nullable as permite_null,
    column_default as valor_padrao
FROM information_schema.columns 
WHERE table_name = 'parametro_precificacao' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========================================
-- 9. ESTRUTURA DA TABELA VALOR_UNIDADES_CENARIO (se existir)
-- ========================================
SELECT 
    'ESTRUTURA VALOR_UNIDADES_CENARIO' as categoria,
    column_name as coluna,
    data_type as tipo,
    is_nullable as permite_null,
    column_default as valor_padrao
FROM information_schema.columns 
WHERE table_name = 'valor_unidades_cenario' AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========================================
-- 10. VERIFICAR DADOS EXISTENTES
-- ========================================

-- Contar registros em cada tabela principal (se existirem)
DO $$
DECLARE
    table_record RECORD;
    sql_query TEXT;
    row_count INTEGER;
BEGIN
    -- Loop através das tabelas principais
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name IN ('empreendimento', 'unidade', 'cenario', 'parametro_precificacao', 'valor_unidades_cenario', 'fator_valorizacao', 'fase_venda')
    LOOP
        sql_query := 'SELECT COUNT(*) FROM ' || table_record.table_name;
        EXECUTE sql_query INTO row_count;
        RAISE NOTICE 'Tabela %: % registros', table_record.table_name, row_count;
    END LOOP;
END $$;

-- ========================================
-- 11. VERIFICAR CONSTRAINTS E CHAVES ESTRANGEIRAS
-- ========================================
SELECT 
    'CONSTRAINTS' as categoria,
    tc.constraint_name as nome,
    tc.table_name as tabela,
    tc.constraint_type as tipo,
    kcu.column_name as coluna
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name;

-- ========================================
-- 12. VERIFICAR SEQUÊNCIAS (para IDs auto-incrementais)
-- ========================================
SELECT 
    'SEQUÊNCIAS' as categoria,
    sequence_name as nome,
    data_type as tipo,
    start_value as valor_inicial,
    increment as incremento
FROM information_schema.sequences 
WHERE sequence_schema = 'public'
ORDER BY sequence_name;
