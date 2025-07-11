-- Análise do problema das triggers no fluxo de cadastro
-- Este script ajuda a entender como as triggers se comportam

-- 1. Verificar se existem triggers ativas na tabela unidade
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'unidade';

-- 2. Verificar se existem triggers ativas na tabela parametro_precificacao  
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'parametro_precificacao';

-- 3. Verificar estrutura da tabela valor_unidades_cenario
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'valor_unidades_cenario'
ORDER BY ordinal_position;

-- 4. Verificar se existem registros órfãos (unidades sem valores calculados)
SELECT 
    u.id as unidade_id,
    u.nome as unidade_nome,
    u.empreendimento_id,
    COUNT(vuc.unidade_id) as registros_valor
FROM unidade u
LEFT JOIN valor_unidades_cenario vuc ON u.id = vuc.unidade_id
GROUP BY u.id, u.nome, u.empreendimento_id
HAVING COUNT(vuc.unidade_id) = 0;

-- 5. Verificar todas as tabelas existentes no schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 6. Verificar se existe a tabela empreendimento e seus dados
SELECT COUNT(*) as total_empreendimentos
FROM empreendimento;

-- 7. Mostrar estrutura da tabela empreendimento
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'empreendimento'
ORDER BY ordinal_position;
