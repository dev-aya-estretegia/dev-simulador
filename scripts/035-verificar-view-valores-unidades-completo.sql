-- Verificar se a view vw_valores_unidades_completo existe e tem dados
SELECT 
    schemaname,
    viewname,
    definition
FROM pg_views 
WHERE viewname = 'vw_valores_unidades_completo';

-- Se a view não existir, vamos criá-la baseada na documentação
-- Esta view deve consolidar todos os valores das unidades com suas fases

-- Primeiro, verificar dados na tabela valor_unidades_cenario
SELECT 
    COUNT(*) as total_registros,
    COUNT(DISTINCT cenario_id) as cenarios_distintos,
    COUNT(DISTINCT unidade_id) as unidades_distintas
FROM valor_unidades_cenario;

-- Verificar uma amostra dos dados
SELECT 
    vuc.*,
    u.nome as unidade_nome,
    u.tipologia,
    u.area_privativa,
    c.nome as cenario_nome
FROM valor_unidades_cenario vuc
JOIN unidade u ON vuc.unidade_id = u.id
JOIN cenario c ON vuc.cenario_id = c.id
LIMIT 5;
