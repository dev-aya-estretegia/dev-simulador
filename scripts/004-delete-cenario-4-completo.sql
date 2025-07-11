-- Script para deletar completamente o cenário ID 4 e todos os dados relacionados
-- Ordem de exclusão respeitando as dependências das foreign keys

BEGIN;

-- 1. Deletar valores das unidades nas fases (se existirem)
DELETE FROM valor_unidades_fase 
WHERE cenario_id = 4;

-- 2. Deletar valores das unidades no cenário
DELETE FROM valor_unidades_cenario 
WHERE cenario_id = 4;

-- 3. Deletar fatores de valorização relacionados aos parâmetros do cenário
DELETE FROM fator_valorizacao 
WHERE parametro_precificacao_id IN (
    SELECT id FROM parametro_precificacao WHERE cenario_id = 4
);

-- 4. Deletar fases de venda do cenário (se existirem)
DELETE FROM fase_venda 
WHERE cenario_id = 4;

-- 5. Deletar parâmetros de precificação do cenário
DELETE FROM parametro_precificacao 
WHERE cenario_id = 4;

-- 6. Finalmente, deletar o cenário
DELETE FROM cenario 
WHERE id = 4;

-- Verificar se a exclusão foi bem-sucedida
SELECT 
    'Cenário deletado com sucesso' as status,
    (SELECT COUNT(*) FROM cenario WHERE id = 4) as cenarios_restantes,
    (SELECT COUNT(*) FROM parametro_precificacao WHERE cenario_id = 4) as parametros_restantes,
    (SELECT COUNT(*) FROM fator_valorizacao WHERE parametro_precificacao_id IN (
        SELECT id FROM parametro_precificacao WHERE cenario_id = 4
    )) as fatores_restantes,
    (SELECT COUNT(*) FROM valor_unidades_cenario WHERE cenario_id = 4) as valores_unidades_restantes;

COMMIT;
