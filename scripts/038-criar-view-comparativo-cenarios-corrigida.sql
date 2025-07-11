-- Remover view existente se houver
DROP VIEW IF EXISTS vw_comparativo_cenarios;

-- Criar view corrigida para comparativo de cenários
CREATE VIEW vw_comparativo_cenarios AS
WITH cenarios_dados AS (
    -- Consolidar dados de cada cenário
    SELECT 
        e.nome as empreendimento,
        c.id as cenario_id,
        c.nome as cenario_nome,
        COALESCE(SUM(vuc.valor_unidade_venda), 0) as vgv_cenario,
        CASE 
            WHEN SUM(u.area_privativa) > 0 
            THEN COALESCE(SUM(vuc.valor_unidade_venda), 0) / SUM(u.area_privativa)
            ELSE 0 
        END as valor_m2_cenario,
        COUNT(vuc.unidade_id) as total_unidades
    FROM cenario c
    JOIN empreendimento e ON c.empreendimento_id = e.id
    LEFT JOIN valor_unidades_cenario vuc ON c.id = vuc.cenario_id
    LEFT JOIN unidade u ON vuc.unidade_id = u.id
    WHERE c.ativo = true
    GROUP BY e.id, e.nome, c.id, c.nome
),
cenarios_ordenados AS (
    -- Ordenar cenários por empreendimento para fazer comparações
    SELECT 
        *,
        ROW_NUMBER() OVER (PARTITION BY empreendimento ORDER BY cenario_id) as rn
    FROM cenarios_dados
    WHERE total_unidades > 0  -- Apenas cenários com unidades
)
-- Criar comparações entre cenários do mesmo empreendimento
SELECT 
    c1.empreendimento,
    c1.cenario_nome as cenario_1,
    c1.vgv_cenario as vgv_cenario_1,
    c1.valor_m2_cenario as valor_m2_cenario_1,
    c2.cenario_nome as cenario_2,
    c2.vgv_cenario as vgv_cenario_2,
    c2.valor_m2_cenario as valor_m2_cenario_2,
    (c2.vgv_cenario - c1.vgv_cenario) as diferenca_vgv,
    CASE 
        WHEN c1.vgv_cenario > 0 
        THEN ((c2.vgv_cenario - c1.vgv_cenario) / c1.vgv_cenario) * 100
        ELSE 0 
    END as diferenca_percentual
FROM cenarios_ordenados c1
JOIN cenarios_ordenados c2 ON c1.empreendimento = c2.empreendimento 
    AND c1.rn < c2.rn  -- Evita duplicações e auto-comparações
ORDER BY c1.empreendimento, c1.cenario_nome, c2.cenario_nome;

-- Verificar se a view foi criada corretamente
SELECT * FROM vw_comparativo_cenarios LIMIT 5;
