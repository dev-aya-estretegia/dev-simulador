-- =====================================================
-- Script para inserir todas as unidades do empreendimento ID=1
-- Baseado nos dados do CSV fornecido
-- =====================================================

-- Verificar se o empreendimento existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM empreendimento WHERE id = 1) THEN
        RAISE EXCEPTION 'Empreendimento com ID=1 não existe. Execute primeiro o script de criação do empreendimento.';
    END IF;
END $$;

-- Inserir todas as unidades
INSERT INTO unidade (
    empreendimento_id,
    nome,
    tipologia,
    area_privativa,
    area_garden,
    pavimento,
    bloco,
    orientacao_solar,
    vista,
    diferencial,
    qtd_vaga_simples,
    qtd_vaga_duplas,
    qtd_vaga_moto,
    qtd_hobby_boxes,
    qtd_suite
) VALUES
-- Lojas (Pavimento 0 e 1)
(1, 'Loja 01', 'Comercial', 103.56, NULL, 0, 'A', 'Sudeste', NULL, NULL, 2, 0, 0, 0, 0),
(1, 'Loja 02', 'Comercial', 255.87, NULL, 1, 'A', 'Sudeste', NULL, NULL, 1, 0, 0, 0, 0),
(1, 'Loja 03', 'Comercial', 49.08, NULL, 1, 'A', 'Sudeste', NULL, NULL, 1, 0, 0, 0, 0),
(1, 'Loja 04', 'Comercial', 72.7, NULL, 1, 'A', 'Sudeste', NULL, NULL, 1, 0, 0, 0, 0),

-- Pavimento 2
(1, 'Unidade 201', 'Apartamento', 72.34, 39.08, 2, 'A', 'Norte', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 202', 'Apartamento', 72.34, 10.38, 2, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 203', 'Apartamento', 57.87, NULL, 2, 'A', 'Nordeste', NULL, NULL, 0, 1, 0, 1, 2),
(1, 'Unidade 204', 'Studio', 29.44, NULL, 2, 'A', 'Oeste', NULL, NULL, 0, 0, 0, 0, 0),
(1, 'Unidade 205', 'Studio', 29.44, NULL, 2, 'A', 'Oeste', NULL, NULL, 0, 0, 0, 0, 0),
(1, 'Unidade 206', 'Studio', 30.38, 23.14, 2, 'A', 'Nordeste', NULL, NULL, 0, 0, 0, 0, 0),
(1, 'Unidade 207', 'Studio', 30.38, 23.16, 2, 'A', 'Nordeste', NULL, NULL, 0, 0, 0, 0, 0),
(1, 'Unidade 208', 'Studio', 29.21, NULL, 2, 'A', 'Sudoeste', NULL, NULL, 0, 0, 0, 0, 0),
(1, 'Unidade 209', 'Apartamento', 57.87, 50, 2, 'A', 'Nordeste', NULL, NULL, 0, 1, 0, 1, 2),
(1, 'Unidade 210', 'Studio', 29.44, NULL, 2, 'A', 'Sudoeste', NULL, NULL, 0, 0, 0, 0, 0),
(1, 'Unidade 211', 'Apartamento', 72.34, 39.08, 2, 'A', 'Leste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 212', 'Apartamento', 72.34, NULL, 2, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 213', 'Studio', 29.4, NULL, 2, 'A', 'Sul', NULL, NULL, 0, 0, 0, 0, 0),
(1, 'Unidade 214', 'Studio', 29.24, NULL, 2, 'A', 'Noroeste', NULL, NULL, 0, 0, 0, 0, 0),
(1, 'Unidade 215', 'Apartamento', 68.4, NULL, 2, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 216', 'Studio', 39.11, 17.74, 2, 'A', 'Noroeste', NULL, NULL, 0, 0, 0, 0, 1),

-- Pavimento 3
(1, 'Unidade 301', 'Apartamento', 72.34, NULL, 3, 'A', 'Norte', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 302', 'Apartamento', 72.34, NULL, 3, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 303', 'Apartamento', 69.41, NULL, 3, 'A', 'Nordeste', NULL, NULL, 0, 1, 0, 1, 2),
(1, 'Unidade 304', 'Studio', 29.44, NULL, 3, 'A', 'Oeste', NULL, NULL, 0, 0, 0, 0, 0),
(1, 'Unidade 305', 'Studio', 29.44, NULL, 3, 'A', 'Oeste', NULL, NULL, 0, 0, 0, 0, 0),
(1, 'Unidade 306', 'Studio', 30.38, NULL, 3, 'A', 'Nordeste', NULL, NULL, 0, 0, 0, 0, 0),
(1, 'Unidade 307', 'Studio', 30.38, NULL, 3, 'A', 'Nordeste', NULL, NULL, 0, 0, 0, 0, 0),
(1, 'Unidade 308', 'Studio', 29.91, NULL, 3, 'A', 'Sudoeste', NULL, NULL, 0, 0, 0, 0, 0),
(1, 'Unidade 309', 'Apartamento', 69.41, NULL, 3, 'A', 'Nordeste', NULL, NULL, 0, 1, 0, 1, 2),
(1, 'Unidade 310', 'Studio', 29.44, NULL, 3, 'A', 'Sudoeste', NULL, NULL, 0, 0, 0, 0, 0),
(1, 'Unidade 311', 'Apartamento', 72.34, NULL, 3, 'A', 'Leste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 312', 'Apartamento', 72.34, NULL, 3, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 313', 'Studio', 29.4, NULL, 3, 'A', 'Sul', NULL, NULL, 0, 0, 0, 0, 0),
(1, 'Unidade 314', 'Studio', 29.24, NULL, 3, 'A', 'Noroeste', NULL, NULL, 0, 0, 0, 0, 0),
(1, 'Unidade 315', 'Apartamento', 68.4, NULL, 3, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 316', 'Apartamento', 68.4, NULL, 3, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 1),

-- Pavimento 4
(1, 'Unidade 401', 'Apartamento', 72.34, NULL, 4, 'A', 'Norte', NULL, NULL, 0, 1, 0, 1, 1),
(1, 'Unidade 402', 'Apartamento', 72.34, NULL, 4, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 403', 'Apartamento', 69.41, NULL, 4, 'A', 'Nordeste', NULL, NULL, 1, 0, 0, 1, 2),
(1, 'Unidade 404', 'Studio', 29.44, NULL, 4, 'A', 'Oeste', NULL, NULL, 0, 0, 0, 0, 0),
(1, 'Unidade 405', 'Studio', 29.44, NULL, 4, 'A', 'Oeste', NULL, NULL, 0, 0, 0, 0, 0),
(1, 'Unidade 406', 'Studio', 30.38, NULL, 4, 'A', 'Nordeste', NULL, NULL, 0, 0, 0, 0, 0),
(1, 'Unidade 407', 'Studio', 30.38, NULL, 4, 'A', 'Nordeste', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 408', 'Studio', 29.91, NULL, 4, 'A', 'Sudoeste', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 409', 'Apartamento', 69.41, NULL, 4, 'A', 'Nordeste', NULL, NULL, 0, 1, 0, 1, 2),
(1, 'Unidade 410', 'Studio', 29.44, NULL, 4, 'A', 'Sudoeste', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 411', 'Apartamento', 72.34, NULL, 4, 'A', 'Leste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 412', 'Apartamento', 72.34, NULL, 4, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 413', 'Studio', 29.4, NULL, 4, 'A', 'Sul', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 414', 'Studio', 29.24, NULL, 4, 'A', 'Noroeste', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 415', 'Apartamento', 68.4, NULL, 4, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 416', 'Apartamento', 68.4, NULL, 4, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 1),

-- Pavimento 5
(1, 'Unidade 501', 'Apartamento', 72.34, NULL, 5, 'A', 'Norte', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 502', 'Apartamento', 72.34, NULL, 5, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 503', 'Apartamento', 69.41, NULL, 5, 'A', 'Nordeste', NULL, NULL, 0, 1, 0, 1, 2),
(1, 'Unidade 504', 'Studio', 29.44, NULL, 5, 'A', 'Oeste', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 505', 'Studio', 29.44, NULL, 5, 'A', 'Oeste', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 506', 'Studio', 30.38, NULL, 5, 'A', 'Nordeste', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 507', 'Studio', 30.38, NULL, 5, 'A', 'Nordeste', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 508', 'Studio', 29.91, NULL, 5, 'A', 'Sudoeste', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 509', 'Apartamento', 69.41, NULL, 5, 'A', 'Nordeste', NULL, NULL, 0, 1, 0, 1, 2),
(1, 'Unidade 510', 'Studio', 29.44, NULL, 5, 'A', 'Sudoeste', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 511', 'Apartamento', 72.34, NULL, 5, 'A', 'Leste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 512', 'Apartamento', 72.34, NULL, 5, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 513', 'Studio', 29.4, NULL, 5, 'A', 'Sul', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 514', 'Studio', 29.24, NULL, 5, 'A', 'Noroeste', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 515', 'Apartamento', 68.4, NULL, 5, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 516', 'Apartamento', 68.4, NULL, 5, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 1),

-- Pavimento 6
(1, 'Unidade 601', 'Apartamento', 72.34, NULL, 6, 'A', 'Norte', 'Vista privilegiada', NULL, 0, 1, 0, 1, 1),
(1, 'Unidade 602', 'Apartamento', 72.34, NULL, 6, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 603', 'Apartamento', 69.41, NULL, 6, 'A', 'Nordeste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 2),
(1, 'Unidade 604', 'Studio', 29.44, NULL, 6, 'A', 'Oeste', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 605', 'Studio', 29.44, NULL, 6, 'A', 'Oeste', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 606', 'Studio', 30.38, NULL, 6, 'A', 'Nordeste', 'Vista privilegiada', NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 607', 'Studio', 30.38, NULL, 6, 'A', 'Nordeste', 'Vista privilegiada', NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 608', 'Studio', 29.91, NULL, 6, 'A', 'Sudoeste', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 609', 'Apartamento', 69.41, NULL, 6, 'A', 'Nordeste', NULL, NULL, 0, 1, 0, 1, 2),
(1, 'Unidade 610', 'Studio', 29.44, NULL, 6, 'A', 'Sudoeste', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 611', 'Apartamento', 72.34, NULL, 6, 'A', 'Leste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 612', 'Apartamento', 72.34, NULL, 6, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 613', 'Studio', 29.4, NULL, 6, 'A', 'Sul', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 614', 'Studio', 29.24, NULL, 6, 'A', 'Noroeste', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 615', 'Apartamento', 68.4, NULL, 6, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 616', 'Apartamento', 68.4, NULL, 6, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 1),

-- Pavimento 7
(1, 'Unidade 701', 'Apartamento', 72.34, NULL, 7, 'A', 'Norte', 'Vista privilegiada', NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 702', 'Apartamento', 72.34, NULL, 7, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 703', 'Apartamento', 69.41, NULL, 7, 'A', 'Nordeste', 'Vista privilegiada', NULL, 1, 0, 1, 1, 2),
(1, 'Unidade 704', 'Studio', 29.44, NULL, 7, 'A', 'Oeste', NULL, NULL, 0, 0, 0, 1, 0),
(1, 'Unidade 705', 'Studio', 29.44, NULL, 7, 'A', 'Oeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 706', 'Studio', 30.38, NULL, 7, 'A', 'Nordeste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 707', 'Studio', 30.38, NULL, 7, 'A', 'Nordeste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 708', 'Studio', 29.91, NULL, 7, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 709', 'Apartamento', 69.41, NULL, 7, 'A', 'Nordeste', NULL, NULL, 0, 1, 1, 1, 2),
(1, 'Unidade 710', 'Studio', 29.44, NULL, 7, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 711', 'Apartamento', 72.34, NULL, 7, 'A', 'Leste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 712', 'Apartamento', 72.34, NULL, 7, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 713', 'Studio', 29.4, NULL, 7, 'A', 'Sul', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 714', 'Studio', 29.24, NULL, 7, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 715', 'Apartamento', 68.4, NULL, 7, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 716', 'Apartamento', 68.4, NULL, 7, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 1),

-- Pavimento 8
(1, 'Unidade 801', 'Apartamento', 72.34, NULL, 8, 'A', 'Norte', 'Vista privilegiada', NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 802', 'Apartamento', 72.34, NULL, 8, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 803', 'Apartamento', 69.41, NULL, 8, 'A', 'Nordeste', 'Vista privilegiada', NULL, 0, 1, 1, 1, 2),
(1, 'Unidade 804', 'Studio', 29.44, NULL, 8, 'A', 'Oeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 805', 'Studio', 29.44, NULL, 8, 'A', 'Oeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 806', 'Studio', 30.38, NULL, 8, 'A', 'Nordeste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 807', 'Studio', 30.38, NULL, 8, 'A', 'Nordeste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 808', 'Studio', 29.91, NULL, 8, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 809', 'Apartamento', 69.41, NULL, 8, 'A', 'Nordeste', NULL, NULL, 0, 1, 0, 1, 2),
(1, 'Unidade 810', 'Studio', 29.44, NULL, 8, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 811', 'Apartamento', 72.34, NULL, 8, 'A', 'Leste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 812', 'Apartamento', 72.34, NULL, 8, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 813', 'Studio', 29.4, NULL, 8, 'A', 'Sul', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 814', 'Studio', 29.24, NULL, 8, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 815', 'Apartamento', 68.4, NULL, 8, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 816', 'Apartamento', 68.4, NULL, 8, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 1),

-- Pavimento 9
(1, 'Unidade 901', 'Apartamento', 72.34, NULL, 9, 'A', 'Norte', 'Vista privilegiada', NULL, 0, 1, 0, 1, 1),
(1, 'Unidade 902', 'Apartamento', 72.34, NULL, 9, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 903', 'Apartamento', 69.41, NULL, 9, 'A', 'Nordeste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 2),
(1, 'Unidade 904', 'Studio', 29.44, NULL, 9, 'A', 'Oeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 905', 'Studio', 29.44, NULL, 9, 'A', 'Oeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 906', 'Studio', 30.38, NULL, 9, 'A', 'Nordeste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 907', 'Studio', 30.38, NULL, 9, 'A', 'Nordeste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 908', 'Studio', 29.91, NULL, 9, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 909', 'Apartamento', 69.41, NULL, 9, 'A', 'Nordeste', NULL, NULL, 0, 1, 0, 1, 2),
(1, 'Unidade 910', 'Studio', 29.44, NULL, 9, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 911', 'Apartamento', 72.34, NULL, 9, 'A', 'Leste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 912', 'Apartamento', 72.34, NULL, 9, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 913', 'Studio', 29.4, NULL, 9, 'A', 'Sul', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 914', 'Studio', 29.24, NULL, 9, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 915', 'Apartamento', 68.4, NULL, 9, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 916', 'Apartamento', 68.4, NULL, 9, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 1),

-- Pavimento 10
(1, 'Unidade 1001', 'Apartamento', 72.34, NULL, 10, 'A', 'Norte', 'Vista privilegiada', NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 1002', 'Apartamento', 72.34, NULL, 10, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 1003', 'Apartamento', 69.41, NULL, 10, 'A', 'Nordeste', 'Vista privilegiada', NULL, 0, 1, 1, 1, 2),
(1, 'Unidade 1004', 'Studio', 29.44, NULL, 10, 'A', 'Oeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1005', 'Studio', 29.44, NULL, 10, 'A', 'Oeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1006', 'Studio', 30.38, NULL, 10, 'A', 'Nordeste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1007', 'Studio', 30.38, NULL, 10, 'A', 'Nordeste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1008', 'Studio', 29.91, NULL, 10, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1009', 'Apartamento', 69.41, NULL, 10, 'A', 'Nordeste', NULL, NULL, 0, 1, 1, 1, 2),
(1, 'Unidade 1010', 'Studio', 29.44, NULL, 10, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1011', 'Apartamento', 72.34, NULL, 10, 'A', 'Leste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 1012', 'Apartamento', 72.34, NULL, 10, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 1013', 'Studio', 29.4, NULL, 10, 'A', 'Sul', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1014', 'Studio', 29.24, NULL, 10, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1015', 'Apartamento', 68.4, NULL, 10, 'A', 'Sudoeste', NULL, NULL, 1, 0, 1, 1, 1),
(1, 'Unidade 1016', 'Apartamento', 68.4, NULL, 10, 'A', 'Noroeste', NULL, NULL, 1, 0, 1, 1, 1),

-- Pavimento 11
(1, 'Unidade 1101', 'Apartamento', 72.34, NULL, 11, 'A', 'Norte', 'Vista privilegiada', NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 1102', 'Apartamento', 72.34, NULL, 11, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 1103', 'Apartamento', 69.41, NULL, 11, 'A', 'Nordeste', 'Vista privilegiada', NULL, 0, 1, 1, 1, 2),
(1, 'Unidade 1104', 'Studio', 29.44, NULL, 11, 'A', 'Oeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1105', 'Studio', 29.44, NULL, 11, 'A', 'Oeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1106', 'Studio', 30.38, NULL, 11, 'A', 'Nordeste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1107', 'Studio', 30.38, NULL, 11, 'A', 'Nordeste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1108', 'Studio', 29.91, NULL, 11, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1109', 'Apartamento', 69.41, NULL, 11, 'A', 'Nordeste', NULL, NULL, 0, 1, 1, 1, 2),
(1, 'Unidade 1110', 'Studio', 29.44, NULL, 11, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1111', 'Apartamento', 72.34, NULL, 11, 'A', 'Leste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 1112', 'Apartamento', 72.34, NULL, 11, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 1113', 'Studio', 29.4, NULL, 11, 'A', 'Sul', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1114', 'Studio', 29.24, NULL, 11, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1115', 'Apartamento', 68.4, NULL, 11, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 1116', 'Apartamento', 68.4, NULL, 11, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 1),

-- Pavimento 12 (Cobertura)
(1, 'Unidade 1201', 'Apartamento', 72.34, NULL, 12, 'A', 'Norte', 'Vista privilegiada', NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 1202', 'Apartamento', 72.34, NULL, 12, 'A', 'Noroeste', NULL, NULL, 1, 0, 1, 1, 1),
(1, 'Unidade 1203', 'Apartamento', 69.41, NULL, 12, 'A', 'Nordeste', 'Vista privilegiada', NULL, 0, 1, 1, 1, 2),
(1, 'Unidade 1204', 'Studio', 29.44, NULL, 12, 'A', 'Oeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1205', 'Studio', 29.44, NULL, 12, 'A', 'Oeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1206', 'Studio', 30.38, NULL, 12, 'A', 'Nordeste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1207', 'Studio', 30.38, NULL, 12, 'A', 'Nordeste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1208', 'Studio', 29.91, NULL, 12, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1209', 'Apartamento', 69.41, NULL, 12, 'A', 'Nordeste', NULL, NULL, 0, 1, 1, 1, 2),
(1, 'Unidade 1210', 'Studio', 29.44, NULL, 12, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1211', 'Apartamento', 72.34, NULL, 12, 'A', 'Leste', 'Vista privilegiada', NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 1212', 'Apartamento', 72.34, NULL, 12, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 1213', 'Studio', 29.4, NULL, 12, 'A', 'Sul', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1214', 'Studio', 29.24, NULL, 12, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 0),
(1, 'Unidade 1215', 'Apartamento', 68.4, NULL, 12, 'A', 'Sudoeste', NULL, NULL, 1, 0, 0, 1, 1),
(1, 'Unidade 1216', 'Apartamento', 68.4, NULL, 12, 'A', 'Noroeste', NULL, NULL, 1, 0, 0, 1, 1);

-- Verificar quantas unidades foram inseridas
SELECT 
    'Total de unidades inseridas:' as resultado,
    COUNT(*) as quantidade
FROM unidade 
WHERE empreendimento_id = 1;

-- Resumo por tipologia
SELECT 
    tipologia,
    COUNT(*) as quantidade,
    ROUND(AVG(area_privativa), 2) as area_media,
    SUM(area_privativa) as area_total
FROM unidade 
WHERE empreendimento_id = 1
GROUP BY tipologia
ORDER BY tipologia;

-- Resumo por pavimento
SELECT 
    pavimento,
    COUNT(*) as quantidade_unidades,
    COUNT(CASE WHEN tipologia = 'Comercial' THEN 1 END) as comerciais,
    COUNT(CASE WHEN tipologia = 'Apartamento' THEN 1 END) as apartamentos,
    COUNT(CASE WHEN tipologia = 'Studio' THEN 1 END) as studios
FROM unidade 
WHERE empreendimento_id = 1
GROUP BY pavimento
ORDER BY pavimento;

-- Verificar unidades com vista privilegiada
SELECT 
    'Unidades com vista privilegiada:' as resultado,
    COUNT(*) as quantidade
FROM unidade 
WHERE empreendimento_id = 1 
AND vista IS NOT NULL;

-- Verificar unidades com garden
SELECT 
    'Unidades com garden:' as resultado,
    COUNT(*) as quantidade
FROM unidade 
WHERE empreendimento_id = 1 
AND area_garden IS NOT NULL;

COMMIT;

-- Mensagem final
SELECT '✅ Script executado com sucesso! Todas as unidades foram inseridas no empreendimento ID=1.' as status;
