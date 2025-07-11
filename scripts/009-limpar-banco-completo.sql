-- Script para limpar completamente o banco de dados
-- ATENÇÃO: Este script irá apagar TODOS os dados do sistema!
-- Execute apenas se tiver certeza de que deseja começar do zero

-- Desabilitar verificações de chave estrangeira temporariamente (se necessário)
-- SET session_replication_role = replica;

-- 1. Limpar tabelas de valores calculados (dependentes)
DELETE FROM VALOR_UNIDADES_FASE;
DELETE FROM VALOR_UNIDADES_CENARIO;

-- 2. Limpar tabelas de configuração de cenários
DELETE FROM FATOR_VALORIZACAO;
DELETE FROM FASE_VENDA;
DELETE FROM PARAMETRO_PRECIFICACAO;

-- 3. Limpar unidades (dependem de empreendimentos)
DELETE FROM UNIDADE;

-- 4. Limpar cenários (dependem de empreendimentos)
DELETE FROM CENARIO;

-- 5. Limpar empreendimentos (tabela principal)
DELETE FROM EMPREENDIMENTO;

-- Reabilitar verificações de chave estrangeira
-- SET session_replication_role = DEFAULT;

-- Resetar sequências (IDs) para começar do 1 novamente
ALTER SEQUENCE IF EXISTS empreendimento_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS unidade_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS cenario_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS parametro_precificacao_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS fator_valorizacao_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS fase_venda_id_seq RESTART WITH 1;

-- Verificar se todas as tabelas estão vazias
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

-- Mensagem de confirmação
SELECT 'Banco de dados limpo com sucesso! Todas as tabelas estão vazias.' as status;
