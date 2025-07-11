-- Script para corrigir a view vw_detalhamento_calculo
-- Adicionando colunas de identificação de empreendimento e cenário

BEGIN;

-- Remove a view existente se ela existir
DROP VIEW IF EXISTS vw_detalhamento_calculo;

-- Recria a view com as colunas de identificação necessárias
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
    
    -- Valor base da unidade (de valor_unidades_cenario)
    vuc.valor_unidade_base,
    
    -- Valores totais calculados para cada tipo de adicional
    (u.qtd_vaga_simples * pp.valor_vaga_simples) as valor_total_vagas_simples,
    (u.qtd_vaga_duplas * pp.valor_vaga_dupla) as valor_total_vagas_duplas,
    (u.qtd_vaga_moto * pp.valor_vaga_moto) as valor_total_vagas_moto,
    (u.qtd_hobby_boxes * pp.valor_hobby_boxes) as valor_total_hobby_boxes,
    (u.qtd_suite * pp.valor_suite) as valor_total_suites,
    
    -- Valor total de adicionais
    vuc.valor_unidade_adicionais,
    
    -- Percentuais dos fatores de valorização
    fv_orientacao.percentual_valorizacao as percentual_orientacao,
    fv_pavimento.percentual_valorizacao as percentual_pavimento,
    fv_vista.percentual_valorizacao as percentual_vista,
    fv_diferencial.percentual_valorizacao as percentual_diferencial,
    fv_bloco.percentual_valorizacao as percentual_bloco,
    
    -- Valores finais dos fatores de valorização
    vuc.valor_unidade_orientacao,
    vuc.valor_unidade_pavimento,
    vuc.valor_unidade_vista,
    vuc.valor_unidade_diferencial,
    vuc.valor_unidade_bloco as valor_fator_bloco,
    
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
    
    -- Joins opcionais com fatores de valorização
    LEFT JOIN fator_valorizacao fv_orientacao ON pp.id = fv_orientacao.parametro_precificacao_id 
        AND fv_orientacao.tipo_fator = 'Orientacao Solar' 
        AND fv_orientacao.valor_referencia = u.orientacao_solar
        
    LEFT JOIN fator_valorizacao fv_pavimento ON pp.id = fv_pavimento.parametro_precificacao_id 
        AND fv_pavimento.tipo_fator = 'Pavimento' 
        AND fv_pavimento.valor_referencia = u.pavimento::text
        
    LEFT JOIN fator_valorizacao fv_vista ON pp.id = fv_vista.parametro_precificacao_id 
        AND fv_vista.tipo_fator = 'Vista' 
        AND fv_vista.valor_referencia = u.vista
        
    LEFT JOIN fator_valorizacao fv_diferencial ON pp.id = fv_diferencial.parametro_precificacao_id 
        AND fv_diferencial.tipo_fator = 'Diferencial' 
        AND fv_diferencial.valor_referencia = u.diferencial
        
    LEFT JOIN fator_valorizacao fv_bloco ON pp.id = fv_bloco.parametro_precificacao_id 
        AND fv_bloco.tipo_fator = 'Bloco' 
        AND fv_bloco.valor_referencia = u.bloco

ORDER BY 
    e.nome,
    c.nome,
    u.bloco,
    u.pavimento,
    u.nome;

-- Adiciona comentário à view
COMMENT ON VIEW vw_detalhamento_calculo IS 'View que apresenta o detalhamento completo do cálculo de valores para cada unidade em cada cenário, incluindo identificadores de empreendimento e cenário para filtros precisos';

COMMIT;
