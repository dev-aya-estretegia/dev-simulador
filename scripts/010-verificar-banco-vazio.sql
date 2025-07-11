-- Script para verificar se o banco está realmente vazio
-- Execute este script após a limpeza para confirmar

SELECT 
    schemaname,
    tablename,
    n_tup_ins as total_inseridos,
    n_tup_upd as total_atualizados,
    n_tup_del as total_deletados,
    n_live_tup as registros_ativos,
    n_dead_tup as registros_mortos
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
    AND tablename IN (
        'empreendimento',
        'unidade', 
        'cenario',
        'parametro_precificacao',
        'fator_valorizacao',
        'fase_venda',
        'valor_unidades_cenario',
        'valor_unidades_fase'
    )
ORDER BY tablename;

-- Contagem simples de registros por tabela
SELECT 'Contagem de registros após limpeza:' as info;

SELECT 
    'EMPREENDIMENTO' as tabela, 
    COUNT(*) as registros 
FROM EMPREENDIMENTO
UNION ALL
SELECT 
    'UNIDADE' as tabela, 
    COUNT(*) as registros 
FROM UNIDADE
UNION ALL
SELECT 
    'CENARIO' as tabela, 
    COUNT(*) as registros 
FROM CENARIO
UNION ALL
SELECT 
    'PARAMETRO_PRECIFICACAO' as tabela, 
    COUNT(*) as registros 
FROM PARAMETRO_PRECIFICACAO
UNION ALL
SELECT 
    'FATOR_VALORIZACAO' as tabela, 
    COUNT(*) as registros 
FROM FATOR_VALORIZACAO
UNION ALL
SELECT 
    'FASE_VENDA' as tabela, 
    COUNT(*) as registros 
FROM FASE_VENDA
UNION ALL
SELECT 
    'VALOR_UNIDADES_CENARIO' as tabela, 
    COUNT(*) as registros 
FROM VALOR_UNIDADES_CENARIO
UNION ALL
SELECT 
    'VALOR_UNIDADES_FASE' as tabela, 
    COUNT(*) as registros 
FROM VALOR_UNIDADES_FASE
ORDER BY tabela;
