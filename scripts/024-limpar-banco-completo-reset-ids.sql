-- =====================================================
-- SCRIPT: Limpeza Completa do Banco + Reset de IDs
-- OBJETIVO: Apagar todos os registros e resetar sequences
-- DATA: $(date)
-- ATENÇÃO: Este script é IRREVERSÍVEL!
-- =====================================================

-- Desabilitar verificação de foreign keys temporariamente
SET session_replication_role = replica;

-- =====================================================
-- FASE 1: DELETAR REGISTROS (ordem das dependências)
-- =====================================================

-- 1. Tabelas de relacionamento e valores calculados
DELETE FROM valor_unidades_fase;
DELETE FROM valor_unidades_cenario;

-- 2. Tabelas de configuração de fases
DELETE FROM fase_venda;

-- 3. Tabelas de parâmetros
DELETE FROM fator_valorizacao;
DELETE FROM parametro_precificacao;

-- 4. Tabelas principais
DELETE FROM unidade;
DELETE FROM cenario;

-- 5. Tabela base
DELETE FROM empreendimento;

-- =====================================================
-- FASE 2: RESETAR SEQUENCES DOS IDs
-- =====================================================

-- Reset sequence da tabela empreendimento
ALTER SEQUENCE empreendimento_id_seq RESTART WITH 1;

-- Reset sequence da tabela cenario  
ALTER SEQUENCE cenario_id_seq RESTART WITH 1;

-- Reset sequence da tabela unidade
ALTER SEQUENCE unidade_id_seq RESTART WITH 1;

-- Reset sequence da tabela parametro_precificacao
ALTER SEQUENCE parametro_precificacao_id_seq RESTART WITH 1;

-- Reset sequence da tabela fator_valorizacao
ALTER SEQUENCE fator_valorizacao_id_seq RESTART WITH 1;

-- Reset sequence da tabela fase_venda
ALTER SEQUENCE fase_venda_id_seq RESTART WITH 1;

-- =====================================================
-- FASE 3: REABILITAR VERIFICAÇÕES
-- =====================================================

-- Reabilitar verificação de foreign keys
SET session_replication_role = DEFAULT;

-- =====================================================
-- FASE 4: VERIFICAÇÃO DE LIMPEZA
-- =====================================================

-- Verificar se todas as tabelas estão vazias
SELECT 
    'empreendimento' as tabela, 
    COUNT(*) as registros 
FROM empreendimento

UNION ALL

SELECT 
    'cenario' as tabela, 
    COUNT(*) as registros 
FROM cenario

UNION ALL

SELECT 
    'unidade' as tabela, 
    COUNT(*) as registros 
FROM unidade

UNION ALL

SELECT 
    'parametro_precificacao' as tabela, 
    COUNT(*) as registros 
FROM parametro_precificacao

UNION ALL

SELECT 
    'fator_valorizacao' as tabela, 
    COUNT(*) as registros 
FROM fator_valorizacao

UNION ALL

SELECT 
    'fase_venda' as tabela, 
    COUNT(*) as registros 
FROM fase_venda

UNION ALL

SELECT 
    'valor_unidades_cenario' as tabela, 
    COUNT(*) as registros 
FROM valor_unidades_cenario

UNION ALL

SELECT 
    'valor_unidades_fase' as tabela, 
    COUNT(*) as registros 
FROM valor_unidades_fase

ORDER BY tabela;

-- =====================================================
-- FASE 5: VERIFICAR SEQUENCES EXISTENTES
-- =====================================================

-- Listar todas as sequences do schema public
SELECT 
    schemaname,
    sequencename
FROM pg_sequences 
WHERE schemaname = 'public'
ORDER BY sequencename;

-- =====================================================
-- FASE 6: TESTE DE INSERÇÃO PARA VERIFICAR IDs
-- =====================================================

-- Inserir um registro de teste para verificar se o ID começa do 1
INSERT INTO empreendimento (nome, descricao) 
VALUES ('TESTE_LIMPEZA', 'Registro de teste para verificar reset de ID');

-- Verificar se o ID foi gerado como 1
SELECT 
    id,
    nome,
    'ID deve ser 1 se o reset funcionou' as verificacao
FROM empreendimento 
WHERE nome = 'TESTE_LIMPEZA';

-- Remover o registro de teste
DELETE FROM empreendimento WHERE nome = 'TESTE_LIMPEZA';

-- Reset da sequence novamente após o teste
ALTER SEQUENCE empreendimento_id_seq RESTART WITH 1;

-- =====================================================
-- RESULTADO ESPERADO:
-- - Todas as tabelas com 0 registros
-- - Teste de inserção deve mostrar ID = 1
-- =====================================================

-- Mensagem de confirmação
SELECT 'LIMPEZA COMPLETA REALIZADA COM SUCESSO!' as status,
       'Banco de dados vazio e IDs resetados para começar do 1' as detalhes;
