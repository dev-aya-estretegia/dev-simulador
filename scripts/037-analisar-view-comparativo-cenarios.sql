-- Análise da view vw_comparativo_cenarios atual
-- Verificando se a view existe e sua estrutura

-- 1. Verificar se a view existe
SELECT 
    schemaname,
    viewname,
    definition
FROM pg_views 
WHERE viewname = 'vw_comparativo_cenarios';

-- 2. Verificar estrutura das tabelas base
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name IN ('cenario', 'valor_unidades_cenario', 'empreendimento')
ORDER BY table_name, ordinal_position;

-- 3. Verificar dados atuais dos cenários
SELECT 
    e.nome as empreendimento,
    c.nome as cenario,
    COUNT(vuc.unidade_id) as total_unidades,
    SUM(vuc.valor_unidade_venda) as vgv_calculado,
    AVG(vuc.valor_unidade_venda) as valor_medio
FROM cenario c
JOIN empreendimento e ON c.empreendimento_id = e.id
LEFT JOIN valor_unidades_cenario vuc ON c.id = vuc.cenario_id
GROUP BY e.id, e.nome, c.id, c.nome
ORDER BY e.nome, c.nome;

-- 4. Verificar se há duplicações nos dados
SELECT 
    cenario_id,
    unidade_id,
    COUNT(*) as duplicatas
FROM valor_unidades_cenario
GROUP BY cenario_id, unidade_id
HAVING COUNT(*) > 1;
