-- Script para testar a view corrigida
-- Verificar se os percentuais estão sendo retornados corretamente

BEGIN;

-- Teste básico da view
SELECT 
    unidade,
    empreendimento_nome,
    cenario_nome,
    orientacao_solar,
    percentual_orientacao,
    valor_unidade_orientacao,
    pavimento,
    percentual_pavimento,
    valor_unidade_pavimento,
    vista,
    percentual_vista,
    valor_unidade_vista,
    diferencial,
    percentual_diferencial,
    valor_unidade_diferencial,
    unidade_bloco,
    percentual_bloco,
    valor_fator_bloco
FROM vw_detalhamento_calculo
WHERE empreendimento_id = 10 -- Ajuste conforme necessário
  AND cenario_id = 3 -- Ajuste conforme necessário
ORDER BY unidade_bloco, pavimento, unidade
LIMIT 10;

-- Verificar se existem fatores de valorização para o cenário
SELECT DISTINCT 
    pp.id as parametro_id,
    pp.cenario_id,
    fv.tipo_fator,
    fv.valor_referencia,
    fv.percentual_valorizacao
FROM parametro_precificacao pp
LEFT JOIN fator_valorizacao fv ON pp.id = fv.parametro_precificacao_id
WHERE pp.cenario_id = 3 -- Ajuste conforme necessário
ORDER BY fv.tipo_fator, fv.valor_referencia;

COMMIT;
