-- Script para inserir o empreendimento Cota 365
-- Dados fornecidos pelo usuário

BEGIN;

-- Inserir o empreendimento Cota 365
INSERT INTO empreendimento (
    nome,
    descricao,
    endereco,
    cidade,
    estado,
    data_lancamento,
    vgv_bruto_alvo,
    percentual_permuta,
    empresa,
    vgv_liquido_alvo
) VALUES (
    'Cota 365',
    'Empreendimento Misto',
    'Rua Afonso Pena, Canto',
    'Florianópolis',
    'SC',
    '2025-08-01',
    127200000,
    11.88,
    'COTA Empreendimentos',
    12000000
);

-- Verificar a inserção
SELECT 
    'EMPREENDIMENTO INSERIDO' as status,
    id,
    nome,
    descricao,
    cidade,
    estado,
    data_lancamento,
    vgv_bruto_alvo,
    percentual_permuta,
    empresa,
    vgv_liquido_alvo
FROM empreendimento 
WHERE nome = 'Cota 365';

-- Calcular e comparar VGV líquido
SELECT 
    'VALIDAÇÃO VGV' as status,
    vgv_bruto_alvo,
    percentual_permuta,
    vgv_liquido_alvo as vgv_liquido_informado,
    (vgv_bruto_alvo * (1 - percentual_permuta / 100)) as vgv_liquido_calculado,
    (vgv_liquido_alvo - (vgv_bruto_alvo * (1 - percentual_permuta / 100))) as diferenca
FROM empreendimento 
WHERE nome = 'Cota 365';

COMMIT;
