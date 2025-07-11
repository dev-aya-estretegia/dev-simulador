-- ESTRATÉGIA 3: Fluxo de cadastro otimizado
-- Esta abordagem cria um fluxo que minimiza os problemas das triggers

BEGIN;

-- Função para criar um "pacote completo" de empreendimento
CREATE OR REPLACE FUNCTION fn_criar_empreendimento_completo(
    p_nome TEXT,
    p_descricao TEXT,
    p_endereco TEXT,
    p_cidade TEXT,
    p_estado TEXT,
    p_data_lancamento DATE,
    p_vgv_bruto_alvo DECIMAL,
    p_percentual_permuta DECIMAL,
    p_empresa TEXT DEFAULT NULL,
    p_vgv_liquido_alvo DECIMAL DEFAULT NULL
)
RETURNS TABLE(
    empreendimento_id INTEGER,
    cenario_padrao_id INTEGER,
    parametro_padrao_id INTEGER,
    status TEXT
) AS $$
DECLARE
    v_empreendimento_id INTEGER;
    v_cenario_id INTEGER;
    v_parametro_id INTEGER;
    v_vgv_liquido DECIMAL;
BEGIN
    -- Calcular VGV líquido se não fornecido
    IF p_vgv_liquido_alvo IS NULL THEN
        v_vgv_liquido := p_vgv_bruto_alvo * (1 - p_percentual_permuta / 100);
    ELSE
        v_vgv_liquido := p_vgv_liquido_alvo;
    END IF;
    
    -- 1. Criar empreendimento
    INSERT INTO empreendimento (
        nome, descricao, endereco, cidade, estado, 
        data_lancamento, vgv_bruto_alvo, percentual_permuta, 
        empresa, vgv_liquido_alvo
    ) VALUES (
        p_nome, p_descricao, p_endereco, p_cidade, p_estado,
        p_data_lancamento, p_vgv_bruto_alvo, p_percentual_permuta,
        p_empresa, v_vgv_liquido
    ) RETURNING id INTO v_empreendimento_id;
    
    -- 2. Criar cenário padrão
    INSERT INTO cenario (
        empreendimento_id, nome, descricao, data_criacao, status
    ) VALUES (
        v_empreendimento_id, 'Cenário Padrão', 'Cenário inicial do empreendimento', 
        CURRENT_DATE, 'Ativo'
    ) RETURNING id INTO v_cenario_id;
    
    -- 3. Criar parâmetros básicos (valores zerados - serão ajustados depois)
    INSERT INTO parametro_precificacao (
        cenario_id, nome, descricao,
        valor_area_privativa_apartamento, valor_area_privativa_studio, valor_area_privativa_comercial,
        valor_area_garden, valor_vaga_simples, valor_vaga_dupla, valor_vaga_moto,
        valor_hobby_boxes, valor_suite
    ) VALUES (
        v_cenario_id, 'Parâmetros Padrão', 'Parâmetros iniciais - ajustar conforme necessário',
        0, 0, 0, 0, 0, 0, 0, 0, 0
    ) RETURNING id INTO v_parametro_id;
    
    -- Retornar IDs criados
    empreendimento_id := v_empreendimento_id;
    cenario_padrao_id := v_cenario_id;
    parametro_padrao_id := v_parametro_id;
    status := 'CRIADO_COM_SUCESSO';
    RETURN NEXT;
    
EXCEPTION WHEN OTHERS THEN
    empreendimento_id := NULL;
    cenario_padrao_id := NULL;
    parametro_padrao_id := NULL;
    status := 'ERRO: ' || SQLERRM;
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

COMMIT;
