-- Script para investigar os problemas com fatores de valorização
-- e corrigir a view vw_detalhamento_calculo

BEGIN;

-- Primeiro, vamos investigar os dados existentes
-- Verificar os valores únicos de orientação solar nas unidades
SELECT DISTINCT orientacao_solar, COUNT(*) as qtd
FROM unidade 
WHERE orientacao_solar IS NOT NULL
GROUP BY orientacao_solar
ORDER BY orientacao_solar;

-- Verificar os valores de referência para orientação solar nos fatores
SELECT DISTINCT valor_referencia, tipo_fator, COUNT(*) as qtd
FROM fator_valorizacao 
WHERE tipo_fator = 'Orientacao Solar'
GROUP BY valor_referencia, tipo_fator
ORDER BY valor_referencia;

-- Verificar os valores únicos de vista nas unidades
SELECT DISTINCT vista, COUNT(*) as qtd
FROM unidade 
WHERE vista IS NOT NULL
GROUP BY vista
ORDER BY vista;

-- Verificar os valores de referência para vista nos fatores
SELECT DISTINCT valor_referencia, tipo_fator, COUNT(*) as qtd
FROM fator_valorizacao 
WHERE tipo_fator = 'Vista'
GROUP BY valor_referencia, tipo_fator
ORDER BY valor_referencia;

-- Verificar os valores únicos de diferencial nas unidades
SELECT DISTINCT diferencial, COUNT(*) as qtd
FROM unidade 
WHERE diferencial IS NOT NULL
GROUP BY diferencial
ORDER BY diferencial;

-- Verificar os valores de referência para diferencial nos fatores
SELECT DISTINCT valor_referencia, tipo_fator, COUNT(*) as qtd
FROM fator_valorizacao 
WHERE tipo_fator = 'Diferencial'
GROUP BY valor_referencia, tipo_fator
ORDER BY valor_referencia;

-- Verificar os valores únicos de bloco nas unidades
SELECT DISTINCT bloco, COUNT(*) as qtd
FROM unidade 
WHERE bloco IS NOT NULL
GROUP BY bloco
ORDER BY bloco;

-- Verificar os valores de referência para bloco nos fatores
SELECT DISTINCT valor_referencia, tipo_fator, COUNT(*) as qtd
FROM fator_valorizacao 
WHERE tipo_fator = 'Bloco'
GROUP BY valor_referencia, tipo_fator
ORDER BY valor_referencia;

-- Verificar os valores únicos de pavimento nas unidades
SELECT DISTINCT pavimento, COUNT(*) as qtd
FROM unidade 
WHERE pavimento IS NOT NULL
GROUP BY pavimento
ORDER BY pavimento;

-- Verificar os valores de referência para pavimento nos fatores
SELECT DISTINCT valor_referencia, tipo_fator, COUNT(*) as qtd
FROM fator_valorizacao 
WHERE tipo_fator = 'Pavimento'
GROUP BY valor_referencia, tipo_fator
ORDER BY valor_referencia;

COMMIT;
