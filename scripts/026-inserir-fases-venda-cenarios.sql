-- =====================================================
-- SCRIPT: Inserir Fases de Venda para Cenários
-- DESCRIÇÃO: Insere as fases de venda para os cenários 1, 2 e 3
-- DATA: 2025-01-11
-- =====================================================

-- Verificar se os cenários existem antes de inserir as fases
DO $$
BEGIN
    -- Verificar cenários
    IF NOT EXISTS (SELECT 1 FROM CENARIO WHERE id IN (1, 2, 3)) THEN
        RAISE EXCEPTION 'Um ou mais cenários (1, 2, 3) não existem. Execute primeiro os scripts de criação dos cenários.';
    END IF;
    
    RAISE NOTICE 'Cenários verificados. Iniciando inserção das fases de venda...';
END $$;

-- Limpar fases existentes para os cenários (se houver)
DELETE FROM FASE_VENDA WHERE cenario_id IN (1, 2, 3);

-- =====================================================
-- INSERIR FASES PARA CENÁRIO 1
-- =====================================================

INSERT INTO FASE_VENDA (
    cenario_id, 
    nome, 
    percentual_reajuste, 
    descricao, 
    ordem, 
    data_inicio, 
    data_fim
) VALUES
-- Cenário 1 - Fases (corrigindo data_fim da Fase 6 para 2026-08-31)
(1, 'Fase 1', 0.00, 'Fase de venda para Investidores', 1, '2025-08-01', '2025-10-31'),
(1, 'Fase 2', 3.00, 'Segunda Fase de Vendas', 2, '2025-11-01', '2025-12-31'),
(1, 'Fase 3', 3.00, 'Terceira Fase de Vendas', 3, '2026-01-01', '2026-02-28'),
(1, 'Fase 4', 3.00, 'Quarta Fase de Vendas', 4, '2026-03-01', '2026-04-30'),
(1, 'Fase 5', 2.00, 'Quinta Fase de Vendas', 5, '2026-05-01', '2026-06-30'),
(1, 'Fase 6', 0.00, 'Sexta Fase de Vendas', 6, '2026-07-01', '2026-08-31');

-- =====================================================
-- INSERIR FASES PARA CENÁRIO 2
-- =====================================================

INSERT INTO FASE_VENDA (
    cenario_id, 
    nome, 
    percentual_reajuste, 
    descricao, 
    ordem, 
    data_inicio, 
    data_fim
) VALUES
-- Cenário 2 - Fases (corrigindo data_fim da Fase 6 para 2026-08-31)
(2, 'Fase 1', 0.00, 'Fase de venda para Investidores', 1, '2025-08-01', '2025-10-31'),
(2, 'Fase 2', 10.00, 'Segunda Fase de Vendas', 2, '2025-11-01', '2025-12-31'),
(2, 'Fase 3', 3.00, 'Terceira Fase de Vendas', 3, '2026-01-01', '2026-02-28'),
(2, 'Fase 4', 3.00, 'Quarta Fase de Vendas', 4, '2026-03-01', '2026-04-30'),
(2, 'Fase 5', 2.00, 'Quinta Fase de Vendas', 5, '2026-05-01', '2026-06-30'),
(2, 'Fase 6', 0.00, 'Sexta Fase de Vendas', 6, '2026-07-01', '2026-08-31');

-- =====================================================
-- INSERIR FASES PARA CENÁRIO 3
-- =====================================================

INSERT INTO FASE_VENDA (
    cenario_id, 
    nome, 
    percentual_reajuste, 
    descricao, 
    ordem, 
    data_inicio, 
    data_fim
) VALUES
-- Cenário 3 - Fases (corrigindo data_fim da Fase 6 para 2026-08-31)
(3, 'Fase 1', 0.00, 'Fase de venda para Investidores', 1, '2025-08-01', '2025-10-31'),
(3, 'Fase 2', 5.00, 'Segunda Fase de Vendas', 2, '2025-11-01', '2025-12-31'),
(3, 'Fase 3', 3.00, 'Terceira Fase de Vendas', 3, '2026-01-01', '2026-02-28'),
(3, 'Fase 4', 3.00, 'Quarta Fase de Vendas', 4, '2026-03-01', '2026-04-30'),
(3, 'Fase 5', 2.00, 'Quinta Fase de Vendas', 5, '2026-05-01', '2026-06-30'),
(3, 'Fase 6', 0.00, 'Sexta Fase de Vendas', 6, '2026-07-01', '2026-08-31');

-- =====================================================
-- VERIFICAÇÕES E RELATÓRIOS
-- =====================================================

-- Verificar inserção das fases
SELECT 
    'RESUMO GERAL DAS FASES INSERIDAS' as relatorio;

SELECT 
    cenario_id,
    COUNT(*) as total_fases,
    MIN(data_inicio) as primeira_data,
    MAX(data_fim) as ultima_data,
    SUM(percentual_reajuste) as soma_reajustes
FROM FASE_VENDA 
WHERE cenario_id IN (1, 2, 3)
GROUP BY cenario_id
ORDER BY cenario_id;

-- Detalhamento por cenário
SELECT 
    'DETALHAMENTO POR CENÁRIO' as relatorio;

SELECT 
    cenario_id,
    nome,
    percentual_reajuste,
    descricao,
    ordem,
    data_inicio,
    data_fim,
    (data_fim - data_inicio) as duracao_dias
FROM FASE_VENDA 
WHERE cenario_id IN (1, 2, 3)
ORDER BY cenario_id, ordem;

-- Análise de reajustes por cenário
SELECT 
    'ANÁLISE DE REAJUSTES POR CENÁRIO' as relatorio;

SELECT 
    cenario_id,
    'Cenário ' || cenario_id as nome_cenario,
    ROUND(AVG(percentual_reajuste), 2) as reajuste_medio,
    MAX(percentual_reajuste) as maior_reajuste,
    MIN(percentual_reajuste) as menor_reajuste,
    COUNT(CASE WHEN percentual_reajuste > 0 THEN 1 END) as fases_com_reajuste
FROM FASE_VENDA 
WHERE cenario_id IN (1, 2, 3)
GROUP BY cenario_id
ORDER BY cenario_id;

-- Verificar sequência de datas
SELECT 
    'VERIFICAÇÃO DE SEQUÊNCIA DE DATAS' as relatorio;

SELECT 
    cenario_id,
    nome,
    data_inicio,
    data_fim,
    LAG(data_fim) OVER (PARTITION BY cenario_id ORDER BY ordem) as data_fim_anterior,
    CASE 
        WHEN LAG(data_fim) OVER (PARTITION BY cenario_id ORDER BY ordem) IS NULL THEN 'Primeira fase'
        WHEN data_inicio > LAG(data_fim) OVER (PARTITION BY cenario_id ORDER BY ordem) THEN 'Gap entre fases'
        WHEN data_inicio = LAG(data_fim) OVER (PARTITION BY cenario_id ORDER BY ordem) + INTERVAL '1 day' THEN 'Sequência correta'
        ELSE 'Sobreposição ou inconsistência'
    END as status_sequencia
FROM FASE_VENDA 
WHERE cenario_id IN (1, 2, 3)
ORDER BY cenario_id, ordem;

-- Análise comparativa entre cenários
SELECT 
    'ANÁLISE COMPARATIVA ENTRE CENÁRIOS' as relatorio;

SELECT 
    ordem,
    nome,
    MAX(CASE WHEN cenario_id = 1 THEN percentual_reajuste END) as cenario_1_reajuste,
    MAX(CASE WHEN cenario_id = 2 THEN percentual_reajuste END) as cenario_2_reajuste,
    MAX(CASE WHEN cenario_id = 3 THEN percentual_reajuste END) as cenario_3_reajuste,
    MAX(CASE WHEN cenario_id = 2 THEN percentual_reajuste END) - 
    MAX(CASE WHEN cenario_id = 1 THEN percentual_reajuste END) as diferenca_2_vs_1,
    MAX(CASE WHEN cenario_id = 3 THEN percentual_reajuste END) - 
    MAX(CASE WHEN cenario_id = 1 THEN percentual_reajuste END) as diferenca_3_vs_1
FROM FASE_VENDA 
WHERE cenario_id IN (1, 2, 3)
GROUP BY ordem, nome
ORDER BY ordem;

-- Reajustes acumulados por cenário
SELECT 
    'REAJUSTES ACUMULADOS POR CENÁRIO' as relatorio;

WITH reajustes_acumulados AS (
    SELECT 
        cenario_id,
        nome,
        ordem,
        percentual_reajuste,
        SUM(percentual_reajuste) OVER (
            PARTITION BY cenario_id 
            ORDER BY ordem 
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) as reajuste_acumulado
    FROM FASE_VENDA 
    WHERE cenario_id IN (1, 2, 3)
)
SELECT 
    cenario_id,
    nome,
    percentual_reajuste || '%' as reajuste_fase,
    ROUND(reajuste_acumulado, 2) || '%' as reajuste_acumulado_total
FROM reajustes_acumulados
ORDER BY cenario_id, ordem;

-- Mensagem de conclusão
DO $$
BEGIN
    RAISE NOTICE '✅ INSERÇÃO DE FASES CONCLUÍDA COM SUCESSO!';
    RAISE NOTICE '📊 Total de 18 fases inseridas (6 fases × 3 cenários)';
    RAISE NOTICE '🎯 Cenário 1: Estratégia Conservadora (reajustes moderados)';
    RAISE NOTICE '🚀 Cenário 2: Estratégia Agressiva (reajuste alto na Fase 2: 10%%)';
    RAISE NOTICE '⚖️ Cenário 3: Estratégia Moderada (reajuste médio na Fase 2: 5%%)';
    RAISE NOTICE '📅 Período: Agosto/2025 a Agosto/2026';
    RAISE NOTICE '🔧 Correção aplicada: data_fim da Fase 6 corrigida para 2026-08-31';
END $$;
