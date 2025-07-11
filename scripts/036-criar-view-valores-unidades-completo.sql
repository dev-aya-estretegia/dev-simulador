-- Criar a view vw_valores_unidades_completo se ela não existir
-- Esta view consolida todos os dados necessários para a interface de valores das unidades

CREATE OR REPLACE VIEW vw_valores_unidades_completo AS
SELECT 
    -- Dados da unidade
    u.id as unidade_id,
    u.nome as unidade_nome,
    u.pavimento,
    u.bloco,
    u.tipologia,
    u.area_privativa,
    u.area_garden,
    u.qtd_vaga_simples,
    u.qtd_vaga_duplas,
    u.qtd_vaga_moto,
    u.qtd_hobby_boxes,
    u.qtd_suite,
    u.orientacao_solar,
    u.vista,
    u.diferencial,
    
    -- Dados do cenário
    c.id as cenario_id,
    c.nome as cenario_nome,
    c.descricao as cenario_descricao,
    
    -- Dados do empreendimento
    e.nome as empreendimento_nome,
    
    -- Valores das unidades
    vuc.valor_unidade_inicial,
    vuc.valor_unidade_fase_1,
    vuc.valor_unidade_fase_2,
    vuc.valor_unidade_fase_3,
    vuc.valor_unidade_fase_4,
    vuc.valor_unidade_fase_5,
    vuc.valor_unidade_fase_6,
    vuc.valor_unidade_fase_7,
    vuc.valor_unidade_fase_8,
    vuc.valor_unidade_fase_9,
    vuc.valor_unidade_fase_10,
    vuc.fase_unidade_venda,
    vuc.valor_unidade_venda,
    
    -- Valores por m² calculados
    CASE 
        WHEN u.area_privativa > 0 THEN vuc.valor_unidade_inicial / u.area_privativa 
        ELSE 0 
    END as valor_m2_inicial,
    
    CASE 
        WHEN u.area_privativa > 0 AND vuc.valor_unidade_fase_1 IS NOT NULL 
        THEN vuc.valor_unidade_fase_1 / u.area_privativa 
        ELSE NULL 
    END as valor_m2_fase_1,
    
    CASE 
        WHEN u.area_privativa > 0 AND vuc.valor_unidade_fase_2 IS NOT NULL 
        THEN vuc.valor_unidade_fase_2 / u.area_privativa 
        ELSE NULL 
    END as valor_m2_fase_2,
    
    CASE 
        WHEN u.area_privativa > 0 AND vuc.valor_unidade_fase_3 IS NOT NULL 
        THEN vuc.valor_unidade_fase_3 / u.area_privativa 
        ELSE NULL 
    END as valor_m2_fase_3,
    
    CASE 
        WHEN u.area_privativa > 0 AND vuc.valor_unidade_fase_4 IS NOT NULL 
        THEN vuc.valor_unidade_fase_4 / u.area_privativa 
        ELSE NULL 
    END as valor_m2_fase_4,
    
    CASE 
        WHEN u.area_privativa > 0 AND vuc.valor_unidade_fase_5 IS NOT NULL 
        THEN vuc.valor_unidade_fase_5 / u.area_privativa 
        ELSE NULL 
    END as valor_m2_fase_5,
    
    CASE 
        WHEN u.area_privativa > 0 AND vuc.valor_unidade_fase_6 IS NOT NULL 
        THEN vuc.valor_unidade_fase_6 / u.area_privativa 
        ELSE NULL 
    END as valor_m2_fase_6,
    
    CASE 
        WHEN u.area_privativa > 0 AND vuc.valor_unidade_fase_7 IS NOT NULL 
        THEN vuc.valor_unidade_fase_7 / u.area_privativa 
        ELSE NULL 
    END as valor_m2_fase_7,
    
    CASE 
        WHEN u.area_privativa > 0 AND vuc.valor_unidade_fase_8 IS NOT NULL 
        THEN vuc.valor_unidade_fase_8 / u.area_privativa 
        ELSE NULL 
    END as valor_m2_fase_8,
    
    CASE 
        WHEN u.area_privativa > 0 AND vuc.valor_unidade_fase_9 IS NOT NULL 
        THEN vuc.valor_unidade_fase_9 / u.area_privativa 
        ELSE NULL 
    END as valor_m2_fase_9,
    
    CASE 
        WHEN u.area_privativa > 0 AND vuc.valor_unidade_fase_10 IS NOT NULL 
        THEN vuc.valor_unidade_fase_10 / u.area_privativa 
        ELSE NULL 
    END as valor_m2_fase_10,
    
    CASE 
        WHEN u.area_privativa > 0 AND vuc.valor_unidade_venda IS NOT NULL 
        THEN vuc.valor_unidade_venda / u.area_privativa 
        ELSE NULL 
    END as valor_m2_venda

FROM 
    valor_unidades_cenario vuc
JOIN 
    unidade u ON vuc.unidade_id = u.id
JOIN 
    cenario c ON vuc.cenario_id = c.id
JOIN 
    empreendimento e ON c.empreendimento_id = e.id
ORDER BY 
    c.nome, u.pavimento, u.bloco, u.nome;

-- Verificar se a view foi criada corretamente
SELECT COUNT(*) as total_registros FROM vw_valores_unidades_completo;

-- Testar uma consulta específica para um cenário
SELECT 
    unidade_nome,
    tipologia,
    valor_unidade_inicial,
    valor_unidade_fase_1,
    valor_unidade_fase_2,
    valor_unidade_venda,
    valor_m2_inicial,
    valor_m2_venda
FROM vw_valores_unidades_completo 
WHERE cenario_id = 1
LIMIT 5;
