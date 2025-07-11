-- Script para criar a view vw_dashboard_cenario
-- Esta view consolida os principais indicadores estratégicos de cada cenário
-- para uso no dashboard principal do sistema

-- Remove a view se ela já existir
DROP VIEW IF EXISTS vw_dashboard_cenario;

-- Cria a view vw_dashboard_cenario
CREATE VIEW vw_dashboard_cenario AS
SELECT 
    -- Identificadores principais
    c.id as cenario_id,
    c.nome as cenario_nome,
    c.descricao as cenario_descricao,
    e.id as empreendimento_id,
    e.nome as empreendimento_nome,
    
    -- Indicadores gerais de VGV
    COALESCE(SUM(vuc.valor_unidade_inicial), 0) as vgv_inicial_projetado,
    COALESCE(SUM(vuc.valor_unidade_venda), 0) as vgv_final_projetado,
    CASE 
        WHEN SUM(vuc.valor_unidade_inicial) > 0 THEN
            ROUND(((SUM(vuc.valor_unidade_venda) - SUM(vuc.valor_unidade_inicial)) / SUM(vuc.valor_unidade_inicial) * 100), 2)
        ELSE 0
    END as incremento_percentual,
    
    -- Contadores de unidades
    COUNT(vuc.unidade_id) as total_unidades,
    COUNT(CASE WHEN vuc.fase_unidade_venda IS NOT NULL THEN 1 END) as unidades_alocadas,
    COUNT(CASE WHEN vuc.fase_unidade_venda IS NULL THEN 1 END) as unidades_disponiveis,
    
    -- Distribuição por fases de venda
    COUNT(CASE WHEN vuc.fase_unidade_venda = 'Fase 1' THEN 1 END) as unidades_fase_1,
    COUNT(CASE WHEN vuc.fase_unidade_venda = 'Fase 2' THEN 1 END) as unidades_fase_2,
    COUNT(CASE WHEN vuc.fase_unidade_venda = 'Fase 3' THEN 1 END) as unidades_fase_3,
    COUNT(CASE WHEN vuc.fase_unidade_venda = 'Fase 4' THEN 1 END) as unidades_fase_4,
    COUNT(CASE WHEN vuc.fase_unidade_venda = 'Fase 5' THEN 1 END) as unidades_fase_5,
    COUNT(CASE WHEN vuc.fase_unidade_venda = 'Fase 6' THEN 1 END) as unidades_fase_6,
    
    -- VGV por fase de venda
    COALESCE(SUM(CASE WHEN vuc.fase_unidade_venda = 'Fase 1' THEN vuc.valor_unidade_venda ELSE 0 END), 0) as vgv_fase_1,
    COALESCE(SUM(CASE WHEN vuc.fase_unidade_venda = 'Fase 2' THEN vuc.valor_unidade_venda ELSE 0 END), 0) as vgv_fase_2,
    COALESCE(SUM(CASE WHEN vuc.fase_unidade_venda = 'Fase 3' THEN vuc.valor_unidade_venda ELSE 0 END), 0) as vgv_fase_3,
    COALESCE(SUM(CASE WHEN vuc.fase_unidade_venda = 'Fase 4' THEN vuc.valor_unidade_venda ELSE 0 END), 0) as vgv_fase_4,
    COALESCE(SUM(CASE WHEN vuc.fase_unidade_venda = 'Fase 5' THEN vuc.valor_unidade_venda ELSE 0 END), 0) as vgv_fase_5,
    COALESCE(SUM(CASE WHEN vuc.fase_unidade_venda = 'Fase 6' THEN vuc.valor_unidade_venda ELSE 0 END), 0) as vgv_fase_6,
    
    -- Contadores por tipologia
    COUNT(CASE WHEN u.tipologia = 'Apartamento' THEN 1 END) as qtd_apartamentos,
    COUNT(CASE WHEN u.tipologia = 'Studio' THEN 1 END) as qtd_studios,
    COUNT(CASE WHEN u.tipologia = 'Comercial' THEN 1 END) as qtd_comercial,
    
    -- VGV por tipologia
    COALESCE(SUM(CASE WHEN u.tipologia = 'Apartamento' THEN vuc.valor_unidade_venda ELSE 0 END), 0) as vgv_apartamentos,
    COALESCE(SUM(CASE WHEN u.tipologia = 'Studio' THEN vuc.valor_unidade_venda ELSE 0 END), 0) as vgv_studios,
    COALESCE(SUM(CASE WHEN u.tipologia = 'Comercial' THEN vuc.valor_unidade_venda ELSE 0 END), 0) as vgv_comercial,
    
    -- Valores médios por m² por tipologia
    CASE 
        WHEN SUM(CASE WHEN u.tipologia = 'Apartamento' THEN u.area_privativa ELSE 0 END) > 0 THEN
            ROUND(SUM(CASE WHEN u.tipologia = 'Apartamento' THEN vuc.valor_unidade_venda ELSE 0 END) / 
                  SUM(CASE WHEN u.tipologia = 'Apartamento' THEN u.area_privativa ELSE 0 END), 2)
        ELSE 0
    END as valor_medio_m2_apartamento,
    
    CASE 
        WHEN SUM(CASE WHEN u.tipologia = 'Studio' THEN u.area_privativa ELSE 0 END) > 0 THEN
            ROUND(SUM(CASE WHEN u.tipologia = 'Studio' THEN vuc.valor_unidade_venda ELSE 0 END) / 
                  SUM(CASE WHEN u.tipologia = 'Studio' THEN u.area_privativa ELSE 0 END), 2)
        ELSE 0
    END as valor_medio_m2_studio,
    
    CASE 
        WHEN SUM(CASE WHEN u.tipologia = 'Comercial' THEN u.area_privativa ELSE 0 END) > 0 THEN
            ROUND(SUM(CASE WHEN u.tipologia = 'Comercial' THEN vuc.valor_unidade_venda ELSE 0 END) / 
                  SUM(CASE WHEN u.tipologia = 'Comercial' THEN u.area_privativa ELSE 0 END), 2)
        ELSE 0
    END as valor_medio_m2_comercial,
    
    -- Valor médio geral por m²
    CASE 
        WHEN SUM(u.area_privativa) > 0 THEN
            ROUND(SUM(vuc.valor_unidade_venda) / SUM(u.area_privativa), 2)
        ELSE 0
    END as valor_medio_m2_geral,
    
    -- Área total por tipologia
    COALESCE(SUM(CASE WHEN u.tipologia = 'Apartamento' THEN u.area_privativa ELSE 0 END), 0) as area_total_apartamentos,
    COALESCE(SUM(CASE WHEN u.tipologia = 'Studio' THEN u.area_privativa ELSE 0 END), 0) as area_total_studios,
    COALESCE(SUM(CASE WHEN u.tipologia = 'Comercial' THEN u.area_privativa ELSE 0 END), 0) as area_total_comercial,
    COALESCE(SUM(u.area_privativa), 0) as area_total_geral,
    
    -- Informações de velocidade de vendas (baseado no número de fases)
    COUNT(DISTINCT fv.id) as total_fases_definidas,
    CASE 
        WHEN COUNT(DISTINCT fv.id) > 0 THEN
            ROUND(COUNT(vuc.unidade_id)::numeric / COUNT(DISTINCT fv.id), 2)
        ELSE 0
    END as velocidade_vendas_media,
    
    -- Timestamp de atualização
    NOW() as dashboard_atualizado_em

FROM 
    cenario c
    
    -- Join com empreendimento
    INNER JOIN empreendimento e ON c.empreendimento_id = e.id
    
    -- Left join com valor_unidades_cenario (pode não existir se cenário não tem parâmetros)
    LEFT JOIN valor_unidades_cenario vuc ON c.id = vuc.cenario_id
    
    -- Left join com unidade (através de valor_unidades_cenario)
    LEFT JOIN unidade u ON vuc.unidade_id = u.id
    
    -- Left join com fases de venda
    LEFT JOIN fase_venda fv ON c.id = fv.cenario_id

GROUP BY 
    c.id, c.nome, c.descricao,
    e.id, e.nome

ORDER BY 
    e.nome, c.nome;

-- Adiciona comentário à view
COMMENT ON VIEW vw_dashboard_cenario IS 'View que consolida os principais indicadores estratégicos de cada cenário para uso no dashboard principal. Inclui VGV inicial e final, distribuição por fases e tipologias, valores médios por m² e indicadores de velocidade de vendas.';

-- Testa a view criada
SELECT 
    cenario_nome,
    empreendimento_nome,
    total_unidades,
    vgv_inicial_projetado,
    vgv_final_projetado,
    incremento_percentual,
    unidades_alocadas,
    unidades_disponiveis,
    valor_medio_m2_geral
FROM vw_dashboard_cenario
ORDER BY empreendimento_nome, cenario_nome;

-- Verifica se a view foi criada corretamente
SELECT 
    'View vw_dashboard_cenario criada com sucesso!' as status,
    COUNT(*) as total_cenarios_encontrados
FROM vw_dashboard_cenario;
