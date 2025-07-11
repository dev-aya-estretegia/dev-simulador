-- Script OPCIONAL para fazer backup dos dados antes da limpeza
-- Execute APENAS se quiser manter uma cópia dos dados atuais

-- Criar tabelas de backup com timestamp
CREATE TABLE IF NOT EXISTS backup_empreendimento_20250110 AS 
SELECT *, NOW() as backup_timestamp FROM EMPREENDIMENTO;

CREATE TABLE IF NOT EXISTS backup_unidade_20250110 AS 
SELECT *, NOW() as backup_timestamp FROM UNIDADE;

CREATE TABLE IF NOT EXISTS backup_cenario_20250110 AS 
SELECT *, NOW() as backup_timestamp FROM CENARIO;

CREATE TABLE IF NOT EXISTS backup_parametro_precificacao_20250110 AS 
SELECT *, NOW() as backup_timestamp FROM PARAMETRO_PRECIFICACAO;

CREATE TABLE IF NOT EXISTS backup_fator_valorizacao_20250110 AS 
SELECT *, NOW() as backup_timestamp FROM FATOR_VALORIZACAO;

CREATE TABLE IF NOT EXISTS backup_fase_venda_20250110 AS 
SELECT *, NOW() as backup_timestamp FROM FASE_VENDA;

CREATE TABLE IF NOT EXISTS backup_valor_unidades_cenario_20250110 AS 
SELECT *, NOW() as backup_timestamp FROM VALOR_UNIDADES_CENARIO;

CREATE TABLE IF NOT EXISTS backup_valor_unidades_fase_20250110 AS 
SELECT *, NOW() as backup_timestamp FROM VALOR_UNIDADES_FASE;

-- Verificar se os backups foram criados
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = t.table_name) as backup_criado
FROM (
    VALUES 
        ('backup_empreendimento_20250110'),
        ('backup_unidade_20250110'),
        ('backup_cenario_20250110'),
        ('backup_parametro_precificacao_20250110'),
        ('backup_fator_valorizacao_20250110'),
        ('backup_fase_venda_20250110'),
        ('backup_valor_unidades_cenario_20250110'),
        ('backup_valor_unidades_fase_20250110')
) t(table_name);

SELECT 'Backup concluído! Execute o script 009-limpar-banco-completo.sql para limpar os dados.' as status;
