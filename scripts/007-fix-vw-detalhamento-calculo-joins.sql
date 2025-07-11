-- Script para corrigir os JOINs da view vw_detalhamento_calculo
-- Usando TRIM e UPPER para normalizar as comparações

BEGIN;

-- Remove a view existente
DROP VIEW IF EXISTS vw_detalhamento_calculo;

-- Recria a view com JOINs corrigidos
CREATE VIEW vw_detalhamento_calculo AS
SELECT 
    -- Identificadores principais
    u.id as unidade_id,
    u.empreendimento_id,
    c.id as cenario_id,
    
    -- Informações da unidade
    u.nome as unidade,
    u.tipologia,
    u.area_privativa,
    u.area_garden,
    u.orientacao_solar,
    u.pavimento,
    u.vista,
    u.diferencial,
    u.bloco as unidade_bloco,
    
    -- Quantidades de itens adicionais
    u.qtd_vaga_simples,
    u.qtd_vaga_duplas,
    u.qtd_vaga_moto,
    u.qtd_hobby_boxes,
    u.qtd_suite,
    
    -- Informações do cenário
    c.nome as cenario_nome,
    c.descricao as cenario_descricao,
    
    -- Informações do empreendimento
    e.id as empreendimento_id_ref,
    e.nome as empreendimento_nome,
    
    -- Valores unitários dos parâmetros de precificação
    pp.valor_area_privativa_apartamento,
    pp.valor_area_privativa_studio,
    pp.valor_area_privativa_comercial,
    pp.valor_area_garden as valor_m2_area_garden,
    pp.valor_vaga_simples as valor_unitario_vaga_simples,
    pp.valor_vaga_dupla as valor_unitario_vaga_dupla,
    pp.valor_vaga_moto as valor_unitario_vaga_moto,
    pp.valor_hobby_boxes as valor_unitario_hobby_boxes,
    pp.valor_suite as valor_unitario_suite,
    
    -- Cálculo do valor da área privativa baseado na tipologia
    CASE 
        WHEN u.tipologia = 'Apartamento' THEN u.area_privativa * pp.valor_area_privativa_apartamento
        WHEN u.tipologia = 'Studio' THEN u.area_privativa * pp.valor_area_privativa_studio
        WHEN u.tipologia = 'Comercial' THEN u.area_privativa * pp.valor_area_privativa_comercial
        ELSE 0
    END as valor_area_privativa_calculado,
    
    -- Cálculo do valor do garden
    COALESCE(u.area_garden * pp.valor_area_garden, 0) as valor_garden_calculado,
    
    -- Valor base da unidade (de valor_unidades_cenario)
    vuc.valor_unidade_base,
    
    -- Valores totais calculados para cada tipo de adicional
    COALESCE(u.qtd_vaga_simples * pp.valor_vaga_simples, 0) as valor_total_vagas_simples,
    COALESCE(u.qtd_vaga_duplas * pp.valor_vaga_dupla, 0) as valor_total_vagas_duplas,
    COALESCE(u.qtd_vaga_moto * pp.valor_vaga_moto, 0) as valor_total_vagas_moto,
    COALESCE(u.qtd_hobby_boxes * pp.valor_hobby_boxes, 0) as valor_total_hobby_boxes,
    COALESCE(u.qtd_suite * pp.valor_suite, 0) as valor_total_suites,
    
    -- Valor total de adicionais
    vuc.valor_unidade_adicionais,
    
    -- Percentuais dos fatores de valorização (com fallback para 0)
    COALESCE(fv_orientacao.percentual_valorizacao, 0) as percentual_orientacao,
    COALESCE(fv_pavimento.percentual_valorizacao, 0) as percentual_pavimento,
    COALESCE(fv_vista.percentual_valorizacao, 0) as percentual_vista,
    COALESCE(fv_diferencial.percentual_valorizacao, 0) as percentual_diferencial,
    COALESCE(fv_bloco.percentual_valorizacao, 0) as percentual_bloco,
    
    -- Valores finais dos fatores de valorização
    COALESCE(vuc.valor_unidade_orientacao, 0) as valor_unidade_orientacao,
    COALESCE(vuc.valor_unidade_pavimento, 0) as valor_unidade_pavimento,
    COALESCE(vuc.valor_unidade_vista, 0) as valor_unidade_vista,
    COALESCE(vuc.valor_unidade_diferencial, 0) as valor_unidade_diferencial,
    COALESCE(vuc.valor_unidade_bloco, 0) as valor_fator_bloco,
    
    -- Valor inicial final da unidade
    vuc.valor_unidade_inicial,
    
    -- Informações de fase (se alocada)
    vuc.fase_unidade_venda,
    vuc.valor_unidade_venda

FROM 
    unidade u
    
    -- Join com empreendimento
    INNER JOIN empreendimento e ON u.empreendimento_id = e.id
    
    -- Join com valor_unidades_cenario para obter os valores calculados
    INNER JOIN valor_unidades_cenario vuc ON u.id = vuc.unidade_id
    
    -- Join com cenário
    INNER JOIN cenario c ON vuc.cenario_id = c.id
    
    -- Join com parâmetros de precificação
    INNER JOIN parametro_precificacao pp ON c.id = pp.cenario_id
    
    -- Joins com fatores de valorização (usando TRIM e comparação case-insensitive)
    LEFT JOIN fator_valorizacao fv_orientacao ON pp.id = fv_orientacao.parametro_precificacao_id 
        AND fv_orientacao.tipo_fator = 'Orientacao Solar' 
        AND UPPER(TRIM(fv_orientacao.valor_referencia)) = UPPER(TRIM(COALESCE(u.orientacao_solar, '')))
        AND u.orientacao_solar IS NOT NULL
        
    LEFT JOIN fator_valorizacao fv_pavimento ON pp.id = fv_pavimento.parametro_precificacao_id 
        AND fv_pavimento.tipo_fator = 'Pavimento' 
        AND TRIM(fv_pavimento.valor_referencia) = TRIM(u.pavimento::text)
        AND u.pavimento IS NOT NULL
        
    LEFT JOIN fator_valorizacao fv_vista ON pp.id = fv_vista.parametro_precificacao_id 
        AND fv_vista.tipo_fator = 'Vista' 
        AND UPPER(TRIM(fv_vista.valor_referencia)) = UPPER(TRIM(COALESCE(u.vista, '')))
        AND u.vista IS NOT NULL
        
    LEFT JOIN fator_valorizacao fv_diferencial ON pp.id = fv_diferencial.parametro_precificacao_id 
        AND fv_diferencial.tipo_fator = 'Diferencial' 
        AND UPPER(TRIM(fv_diferencial.valor_referencia)) = UPPER(TRIM(COALESCE(u.diferencial, '')))
        AND u.diferencial IS NOT NULL
        
    LEFT JOIN fator_valorizacao fv_bloco ON pp.id = fv_bloco.parametro_precificacao_id 
        AND fv_bloco.tipo_fator = 'Bloco' 
        AND UPPER(TRIM(fv_bloco.valor_referencia)) = UPPER(TRIM(COALESCE(u.bloco, '')))
        AND u.bloco IS NOT NULL

ORDER BY 
    e.nome,
    c.nome,
    u.bloco,
    u.pavimento,
    u.nome;

-- Adiciona comentário à view
COMMENT ON VIEW vw_detalhamento_calculo IS 'View que apresenta o detalhamento completo do cálculo de valores para cada unidade em cada cenário, com JOINs corrigidos para fatores de valorização';

COMMIT;
