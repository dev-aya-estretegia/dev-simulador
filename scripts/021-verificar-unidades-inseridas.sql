-- Script para verificar se todas as unidades foram inseridas corretamente
-- e analisar possíveis problemas com triggers

-- 1. Verificar total de unidades inseridas
SELECT 
    'TOTAL UNIDADES' as categoria,
    COUNT(*) as quantidade
FROM unidade 
WHERE empreendimento_id = (SELECT id FROM empreendimento WHERE nome = 'Cota 365');

-- 2. Verificar distribuição por tipologia
SELECT 
    'DISTRIBUIÇÃO TIPOLOGIA' as categoria,
    tipologia,
    COUNT(*) as quantidade,
    ROUND(AVG(area_privativa), 2) as area_media,
    MIN(area_privativa) as area_minima,
    MAX(area_privativa) as area_maxima
FROM unidade 
WHERE empreendimento_id = (SELECT id FROM empreendimento WHERE nome = 'Cota 365')
GROUP BY tipologia
ORDER BY tipologia;

-- 3. Verificar distribuição por pavimento
SELECT 
    'DISTRIBUIÇÃO PAVIMENTO' as categoria,
    pavimento,
    COUNT(*) as quantidade,
    STRING_AGG(DISTINCT tipologia, ', ' ORDER BY tipologia) as tipologias_presentes
FROM unidade 
WHERE empreendimento_id = (SELECT id FROM empreendimento WHERE nome = 'Cota 365')
GROUP BY pavimento
ORDER BY pavimento;

-- 4. Verificar unidades com características especiais
SELECT 
    'CARACTERÍSTICAS ESPECIAIS' as categoria,
    COUNT(CASE WHEN area_garden > 0 THEN 1 END) as com_garden,
    COUNT(CASE WHEN vista = 'Sim' THEN 1 END) as com_vista_especial,
    COUNT(CASE WHEN qtd_vaga_simples > 0 THEN 1 END) as com_vaga_simples,
    COUNT(CASE WHEN qtd_vaga_duplas > 0 THEN 1 END) as com_vaga_dupla,
    COUNT(CASE WHEN qtd_hobby_boxes > 0 THEN 1 END) as com_hobby_box,
    COUNT(CASE WHEN qtd_suite > 0 THEN 1 END) as com_suite
FROM unidade 
WHERE empreendimento_id = (SELECT id FROM empreendimento WHERE nome = 'Cota 365');

-- 5. Verificar se existem registros na tabela valor_unidades_cenario
SELECT 
    'VALORES CALCULADOS' as categoria,
    COUNT(*) as registros_valor_cenario
FROM valor_unidades_cenario vuc
JOIN unidade u ON vuc.unidade_id = u.id
WHERE u.empreendimento_id = (SELECT id FROM empreendimento WHERE nome = 'Cota 365');

-- 6. Listar primeiras 10 unidades para verificação
SELECT 
    'AMOSTRA UNIDADES' as categoria,
    u.nome,
    u.tipologia,
    u.area_privativa,
    u.pavimento,
    u.orientacao_solar,
    u.qtd_vaga_simples + u.qtd_vaga_duplas as total_vagas
FROM unidade u
WHERE u.empreendimento_id = (SELECT id FROM empreendimento WHERE nome = 'Cota 365')
ORDER BY u.pavimento, u.nome
LIMIT 10;

-- 7. Verificar se há erros ou inconsistências
SELECT 
    'VERIFICAÇÃO CONSISTÊNCIA' as categoria,
    COUNT(CASE WHEN nome IS NULL OR nome = '' THEN 1 END) as nomes_vazios,
    COUNT(CASE WHEN area_privativa <= 0 THEN 1 END) as areas_invalidas,
    COUNT(CASE WHEN pavimento < 0 THEN 1 END) as pavimentos_invalidos,
    COUNT(CASE WHEN tipologia NOT IN ('Apartamento', 'Studio', 'Comercial') THEN 1 END) as tipologias_invalidas
FROM unidade 
WHERE empreendimento_id = (SELECT id FROM empreendimento WHERE nome = 'Cota 365');
