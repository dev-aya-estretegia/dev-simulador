-- Verificar se o empreendimento Cota 365 foi inserido corretamente
-- e qual é o estado atual dos dados

-- ========================================
-- 1. VERIFICAR EMPREENDIMENTO COTA 365
-- ========================================
SELECT 
    'EMPREENDIMENTO INSERIDO' as categoria,
    id,
    nome,
    descricao,
    cidade,
    estado,
    data_lancamento,
    vgv_bruto_alvo,
    percentual_permuta,
    empresa,
    vgv_liquido_alvo
FROM empreendimento 
WHERE nome ILIKE '%cota%' OR nome ILIKE '%365%';

-- ========================================
-- 2. VERIFICAR TODOS OS EMPREENDIMENTOS
-- ========================================
SELECT 
    'TODOS EMPREENDIMENTOS' as categoria,
    id,
    nome,
    cidade,
    vgv_bruto_alvo,
    percentual_permuta
FROM empreendimento 
ORDER BY id;

-- ========================================
-- 3. VERIFICAR SE EXISTEM UNIDADES PARA O EMPREENDIMENTO
-- ========================================
SELECT 
    'UNIDADES DO EMPREENDIMENTO' as categoria,
    COUNT(*) as total_unidades,
    empreendimento_id
FROM unidade 
WHERE empreendimento_id IN (SELECT id FROM empreendimento WHERE nome ILIKE '%cota%')
GROUP BY empreendimento_id;

-- ========================================
-- 4. VERIFICAR SE EXISTEM CENÁRIOS PARA O EMPREENDIMENTO
-- ========================================
SELECT 
    'CENÁRIOS DO EMPREENDIMENTO' as categoria,
    COUNT(*) as total_cenarios,
    empreendimento_id
FROM cenario 
WHERE empreendimento_id IN (SELECT id FROM empreendimento WHERE nome ILIKE '%cota%')
GROUP BY empreendimento_id;

-- ========================================
-- 5. VERIFICAR ÚLTIMO ID INSERIDO
-- ========================================
SELECT 
    'ÚLTIMO EMPREENDIMENTO' as categoria,
    id,
    nome,
    data_lancamento
FROM empreendimento 
ORDER BY id DESC 
LIMIT 1;
