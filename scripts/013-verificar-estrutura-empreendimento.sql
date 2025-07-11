-- Script para verificar a estrutura da tabela empreendimento
-- e confirmar quais colunas existem realmente

-- 1. Verificar a estrutura da tabela empreendimento
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'empreendimento' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar se existem constraints ou índices
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'empreendimento';

-- 3. Contar total de empreendimentos cadastrados
SELECT COUNT(*) as total_empreendimentos 
FROM empreendimento;

-- 4. Listar todos os empreendimentos existentes
SELECT 
    id,
    nome,
    cidade,
    estado,
    vgv_bruto_alvo,
    percentual_permuta,
    empresa
FROM empreendimento 
ORDER BY id DESC;

-- 5. Verificar se o empreendimento Cota 365 foi inserido
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Empreendimento Cota 365 inserido com sucesso'
        ELSE '❌ Empreendimento Cota 365 não encontrado'
    END as status_insercao
FROM empreendimento 
WHERE nome = 'Cota 365';
