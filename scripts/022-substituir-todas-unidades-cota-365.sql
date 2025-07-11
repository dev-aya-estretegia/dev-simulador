-- Script para substituir completamente todos os registros da tabela UNIDADE
-- pelos dados fornecidos no CSV para o empreendimento Cota 365 (ID = 2)
-- 
-- ATENÇÃO: Este script irá DELETAR todos os registros existentes na tabela UNIDADE
-- e inserir os novos dados fornecidos.
--
-- Execute este script no SQL Editor do Supabase

BEGIN;

-- 1. Primeiro, limpar completamente a tabela UNIDADE
-- Isso irá remover todos os registros existentes
DELETE FROM "UNIDADE";

-- 2. Resetar a sequência do ID para começar do 1 novamente
ALTER SEQUENCE "UNIDADE_id_seq" RESTART WITH 1;

-- 3. Inserir todos os novos registros com empreendimento_id = 2
INSERT INTO "UNIDADE" (empreendimento_id, nome, tipologia, area_privativa, area_garden, pavimento, bloco, orientacao_solar, vista, diferencial, qtd_vaga_simples, qtd_vaga_duplas, qtd_vaga_moto, qtd_hobby_boxes, qtd_suite) VALUES
-- Unidades Comerciais (Térreo e 1º Pavimento)
(2, 'Loja 01', 'Comercial', 103.56, 0, 0, 'A', 'Sudeste', 'Não', 'não', 2, 0, 0, 0, 0),
(2, 'Loja 02', 'Comercial', 255.87, 0, 1, 'A', 'Sudeste', 'Não', 'não', 1, 0, 0, 0, 0),
(2, 'Loja 03', 'Comercial', 49.08, 0, 1, 'A', 'Sudeste', 'Não', 'não', 1, 0, 0, 0, 0),
(2, 'Loja 04', 'Comercial', 72.7, 0, 1, 'A', 'Sudeste', 'Não', 'não', 1, 0, 0, 0, 0),

-- 2º Pavimento
(2, 'Unidade 201', 'Apartamento', 72.34, 39.08, 2, 'A', 'Norte', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 202', 'Apartamento', 72.34, 10.38, 2, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 203', 'Apartamento', 57.87, 0, 2, 'A', 'Nordeste', 'Não', 'não', 0, 1, 0, 1, 2),
(2, 'Unidade 204', 'Studio', 29.44, 0, 2, 'A', 'Oeste', 'Não', 'não', 0, 0, 0, 0, 0),
(2, 'Unidade 205', 'Studio', 29.44, 0, 2, 'A', 'Oeste', 'Não', 'não', 0, 0, 0, 0, 0),
(2, 'Unidade 206', 'Studio', 30.38, 23.14, 2, 'A', 'Nordeste', 'Não', 'não', 0, 0, 0, 0, 0),
(2, 'Unidade 207', 'Studio', 30.38, 23.16, 2, 'A', 'Nordeste', 'Não', 'não', 0, 0, 0, 0, 0),
(2, 'Unidade 208', 'Studio', 29.21, 0, 2, 'A', 'Sudoeste', 'Não', 'não', 0, 0, 0, 0, 0),
(2, 'Unidade 209', 'Apartamento', 57.87, 50, 2, 'A', 'Nordeste', 'Não', 'não', 0, 1, 0, 1, 2),
(2, 'Unidade 210', 'Studio', 29.44, 0, 2, 'A', 'Sudoeste', 'Não', 'não', 0, 0, 0, 0, 0),
(2, 'Unidade 211', 'Apartamento', 72.34, 39.08, 2, 'A', 'Leste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 212', 'Apartamento', 72.34, 0, 2, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 213', 'Studio', 29.4, 0, 2, 'A', 'Sul', 'Não', 'não', 0, 0, 0, 0, 0),
(2, 'Unidade 214', 'Studio', 29.24, 0, 2, 'A', 'Noroeste', 'Não', 'não', 0, 0, 0, 0, 0),
(2, 'Unidade 215', 'Apartamento', 68.4, 0, 2, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 216', 'Apartamento', 39.11, 17.74, 2, 'A', 'Noroeste', 'Não', 'não', 0, 0, 0, 0, 1),

-- 3º Pavimento
(2, 'Unidade 301', 'Apartamento', 72.34, 0, 3, 'A', 'Norte', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 302', 'Apartamento', 72.34, 0, 3, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 303', 'Apartamento', 69.41, 0, 3, 'A', 'Nordeste', 'Não', 'não', 0, 1, 0, 1, 2),
(2, 'Unidade 304', 'Studio', 29.44, 0, 3, 'A', 'Oeste', 'Não', 'não', 0, 0, 0, 0, 0),
(2, 'Unidade 305', 'Studio', 29.44, 0, 3, 'A', 'Oeste', 'Não', 'não', 0, 0, 0, 0, 0),
(2, 'Unidade 306', 'Studio', 30.38, 0, 3, 'A', 'Nordeste', 'Não', 'não', 0, 0, 0, 0, 0),
(2, 'Unidade 307', 'Studio', 30.38, 0, 3, 'A', 'Nordeste', 'Não', 'não', 0, 0, 0, 0, 0),
(2, 'Unidade 308', 'Studio', 29.91, 0, 3, 'A', 'Sudoeste', 'Não', 'não', 0, 0, 0, 0, 0),
(2, 'Unidade 309', 'Apartamento', 69.41, 0, 3, 'A', 'Nordeste', 'Não', 'não', 0, 1, 0, 1, 2),
(2, 'Unidade 310', 'Studio', 29.44, 0, 3, 'A', 'Sudoeste', 'Não', 'não', 0, 0, 0, 0, 0),
(2, 'Unidade 311', 'Apartamento', 72.34, 0, 3, 'A', 'Leste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 312', 'Apartamento', 72.34, 0, 3, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 313', 'Studio', 29.4, 0, 3, 'A', 'Sul', 'Não', 'não', 0, 0, 0, 0, 0),
(2, 'Unidade 314', 'Studio', 29.24, 0, 3, 'A', 'Noroeste', 'Não', 'não', 0, 0, 0, 0, 0),
(2, 'Unidade 315', 'Apartamento', 68.4, 0, 3, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 316', 'Apartamento', 68.4, 0, 3, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),

-- 4º Pavimento
(2, 'Unidade 401', 'Apartamento', 72.34, 0, 4, 'A', 'Norte', 'Não', 'não', 0, 1, 0, 1, 1),
(2, 'Unidade 402', 'Apartamento', 72.34, 0, 4, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 403', 'Apartamento', 69.41, 0, 4, 'A', 'Nordeste', 'Não', 'não', 1, 0, 0, 1, 2),
(2, 'Unidade 404', 'Studio', 29.44, 0, 4, 'A', 'Oeste', 'Não', 'não', 0, 0, 0, 0, 0),
(2, 'Unidade 405', 'Studio', 29.44, 0, 4, 'A', 'Oeste', 'Não', 'não', 0, 0, 0, 0, 0),
(2, 'Unidade 406', 'Studio', 30.38, 0, 4, 'A', 'Nordeste', 'Não', 'não', 0, 0, 0, 0, 0),
(2, 'Unidade 407', 'Studio', 30.38, 0, 4, 'A', 'Nordeste', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 408', 'Studio', 29.91, 0, 4, 'A', 'Sudoeste', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 409', 'Apartamento', 69.41, 0, 4, 'A', 'Nordeste', 'Não', 'não', 0, 1, 0, 1, 2),
(2, 'Unidade 410', 'Studio', 29.44, 0, 4, 'A', 'Sudoeste', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 411', 'Apartamento', 72.34, 0, 4, 'A', 'Leste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 412', 'Apartamento', 72.34, 0, 4, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 413', 'Studio', 29.4, 0, 4, 'A', 'Sul', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 414', 'Studio', 29.24, 0, 4, 'A', 'Noroeste', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 415', 'Apartamento', 68.4, 0, 4, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 416', 'Apartamento', 68.4, 0, 4, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),

-- 5º Pavimento
(2, 'Unidade 501', 'Apartamento', 72.34, 0, 5, 'A', 'Norte', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 502', 'Apartamento', 72.34, 0, 5, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 503', 'Apartamento', 69.41, 0, 5, 'A', 'Nordeste', 'Não', 'não', 0, 1, 0, 1, 2),
(2, 'Unidade 504', 'Studio', 29.44, 0, 5, 'A', 'Oeste', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 505', 'Studio', 29.44, 0, 5, 'A', 'Oeste', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 506', 'Studio', 30.38, 0, 5, 'A', 'Nordeste', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 507', 'Studio', 30.38, 0, 5, 'A', 'Nordeste', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 508', 'Studio', 29.91, 0, 5, 'A', 'Sudoeste', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 509', 'Apartamento', 69.41, 0, 5, 'A', 'Nordeste', 'Não', 'não', 0, 1, 0, 1, 2),
(2, 'Unidade 510', 'Studio', 29.44, 0, 5, 'A', 'Sudoeste', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 511', 'Apartamento', 72.34, 0, 5, 'A', 'Leste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 512', 'Apartamento', 72.34, 0, 5, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 513', 'Studio', 29.4, 0, 5, 'A', 'Sul', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 514', 'Studio', 29.24, 0, 5, 'A', 'Noroeste', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 515', 'Apartamento', 68.4, 0, 5, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 516', 'Apartamento', 68.4, 0, 5, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),

-- 6º Pavimento
(2, 'Unidade 601', 'Apartamento', 72.34, 0, 6, 'A', 'Norte', 'Sim', 'não', 0, 1, 0, 1, 1),
(2, 'Unidade 602', 'Apartamento', 72.34, 0, 6, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 603', 'Apartamento', 69.41, 0, 6, 'A', 'Nordeste', 'Sim', 'não', 1, 0, 0, 1, 2),
(2, 'Unidade 604', 'Studio', 29.44, 0, 6, 'A', 'Oeste', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 605', 'Studio', 29.44, 0, 6, 'A', 'Oeste', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 606', 'Studio', 30.38, 0, 6, 'A', 'Nordeste', 'Sim', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 607', 'Studio', 30.38, 0, 6, 'A', 'Nordeste', 'Sim', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 608', 'Studio', 29.91, 0, 6, 'A', 'Sudoeste', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 609', 'Apartamento', 69.41, 0, 6, 'A', 'Nordeste', 'Não', 'não', 0, 1, 0, 1, 2),
(2, 'Unidade 610', 'Studio', 29.44, 0, 6, 'A', 'Sudoeste', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 611', 'Apartamento', 72.34, 0, 6, 'A', 'Leste', 'Sim', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 612', 'Apartamento', 72.34, 0, 6, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 613', 'Studio', 29.4, 0, 6, 'A', 'Sul', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 614', 'Studio', 29.24, 0, 6, 'A', 'Noroeste', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 615', 'Apartamento', 68.4, 0, 6, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 616', 'Apartamento', 68.4, 0, 6, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),

-- 7º Pavimento
(2, 'Unidade 701', 'Apartamento', 72.34, 0, 7, 'A', 'Norte', 'Sim', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 702', 'Apartamento', 72.34, 0, 7, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 703', 'Apartamento', 69.41, 0, 7, 'A', 'Nordeste', 'Sim', 'não', 1, 0, 1, 1, 2),
(2, 'Unidade 704', 'Studio', 29.44, 0, 7, 'A', 'Oeste', 'Não', 'não', 0, 0, 0, 1, 0),
(2, 'Unidade 705', 'Studio', 29.44, 0, 7, 'A', 'Oeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 706', 'Studio', 30.38, 0, 7, 'A', 'Nordeste', 'Sim', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 707', 'Studio', 30.38, 0, 7, 'A', 'Nordeste', 'Sim', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 708', 'Studio', 29.91, 0, 7, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 709', 'Apartamento', 69.41, 0, 7, 'A', 'Nordeste', 'Não', 'não', 0, 1, 1, 1, 2),
(2, 'Unidade 710', 'Studio', 29.44, 0, 7, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 711', 'Apartamento', 72.34, 0, 7, 'A', 'Leste', 'Sim', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 712', 'Apartamento', 72.34, 0, 7, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 713', 'Studio', 29.4, 0, 7, 'A', 'Sul', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 714', 'Studio', 29.24, 0, 7, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 715', 'Apartamento', 68.4, 0, 7, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 716', 'Apartamento', 68.4, 0, 7, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),

-- 8º Pavimento
(2, 'Unidade 801', 'Apartamento', 72.34, 0, 8, 'A', 'Norte', 'Sim', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 802', 'Apartamento', 72.34, 0, 8, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 803', 'Apartamento', 69.41, 0, 8, 'A', 'Nordeste', 'Sim', 'não', 0, 1, 1, 1, 2),
(2, 'Unidade 804', 'Studio', 29.44, 0, 8, 'A', 'Oeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 805', 'Studio', 29.44, 0, 8, 'A', 'Oeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 806', 'Studio', 30.38, 0, 8, 'A', 'Nordeste', 'Sim', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 807', 'Studio', 30.38, 0, 8, 'A', 'Nordeste', 'Sim', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 808', 'Studio', 29.91, 0, 8, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 809', 'Apartamento', 69.41, 0, 8, 'A', 'Nordeste', 'Não', 'não', 0, 1, 0, 1, 2),
(2, 'Unidade 810', 'Studio', 29.44, 0, 8, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 811', 'Apartamento', 72.34, 0, 8, 'A', 'Leste', 'Sim', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 812', 'Apartamento', 72.34, 0, 8, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 813', 'Studio', 29.4, 0, 8, 'A', 'Sul', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 814', 'Studio', 29.24, 0, 8, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 815', 'Apartamento', 68.4, 0, 8, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 816', 'Apartamento', 68.4, 0, 8, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),

-- 9º Pavimento
(2, 'Unidade 901', 'Apartamento', 72.34, 0, 9, 'A', 'Norte', 'Sim', 'não', 0, 1, 0, 1, 1),
(2, 'Unidade 902', 'Apartamento', 72.34, 0, 9, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 903', 'Apartamento', 69.41, 0, 9, 'A', 'Nordeste', 'Sim', 'não', 1, 0, 0, 1, 2),
(2, 'Unidade 904', 'Studio', 29.44, 0, 9, 'A', 'Oeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 905', 'Studio', 29.44, 0, 9, 'A', 'Oeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 906', 'Studio', 30.38, 0, 9, 'A', 'Nordeste', 'Sim', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 907', 'Studio', 30.38, 0, 9, 'A', 'Nordeste', 'Sim', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 908', 'Studio', 29.91, 0, 9, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 909', 'Apartamento', 69.41, 0, 9, 'A', 'Nordeste', 'Não', 'não', 0, 1, 0, 1, 2),
(2, 'Unidade 910', 'Studio', 29.44, 0, 9, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 911', 'Apartamento', 72.34, 0, 9, 'A', 'Leste', 'Sim', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 912', 'Apartamento', 72.34, 0, 9, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 913', 'Studio', 29.4, 0, 9, 'A', 'Sul', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 914', 'Studio', 29.24, 0, 9, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 915', 'Apartamento', 68.4, 0, 9, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 916', 'Apartamento', 68.4, 0, 9, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),

-- 10º Pavimento
(2, 'Unidade 1001', 'Apartamento', 72.34, 0, 10, 'A', 'Norte', 'Sim', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 1002', 'Apartamento', 72.34, 0, 10, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 1003', 'Apartamento', 69.41, 0, 10, 'A', 'Nordeste', 'Sim', 'não', 0, 1, 1, 1, 2),
(2, 'Unidade 1004', 'Studio', 29.44, 0, 10, 'A', 'Oeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1005', 'Studio', 29.44, 0, 10, 'A', 'Oeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1006', 'Studio', 30.38, 0, 10, 'A', 'Nordeste', 'Sim', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1007', 'Studio', 30.38, 0, 10, 'A', 'Nordeste', 'Sim', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1008', 'Studio', 29.91, 0, 10, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1009', 'Apartamento', 69.41, 0, 10, 'A', 'Nordeste', 'Não', 'não', 0, 1, 1, 1, 2),
(2, 'Unidade 1010', 'Studio', 29.44, 0, 10, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1011', 'Apartamento', 72.34, 0, 10, 'A', 'Leste', 'Sim', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 1012', 'Apartamento', 72.34, 0, 10, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 1013', 'Studio', 29.4, 0, 10, 'A', 'Sul', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1014', 'Studio', 29.24, 0, 10, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1015', 'Apartamento', 68.4, 0, 10, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 1, 1, 1),
(2, 'Unidade 1016', 'Apartamento', 68.4, 0, 10, 'A', 'Noroeste', 'Não', 'não', 1, 0, 1, 1, 1),

-- 11º Pavimento
(2, 'Unidade 1101', 'Apartamento', 72.34, 0, 11, 'A', 'Norte', 'Sim', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 1102', 'Apartamento', 72.34, 0, 11, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 1103', 'Apartamento', 69.41, 0, 11, 'A', 'Nordeste', 'Sim', 'não', 0, 1, 1, 1, 2),
(2, 'Unidade 1104', 'Studio', 29.44, 0, 11, 'A', 'Oeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1105', 'Studio', 29.44, 0, 11, 'A', 'Oeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1106', 'Studio', 30.38, 0, 11, 'A', 'Nordeste', 'Sim', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1107', 'Studio', 30.38, 0, 11, 'A', 'Nordeste', 'Sim', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1108', 'Studio', 29.91, 0, 11, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1109', 'Apartamento', 69.41, 0, 11, 'A', 'Nordeste', 'Não', 'não', 0, 1, 1, 1, 2),
(2, 'Unidade 1110', 'Studio', 29.44, 0, 11, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1111', 'Apartamento', 72.34, 0, 11, 'A', 'Leste', 'Sim', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 1112', 'Apartamento', 72.34, 0, 11, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 1113', 'Studio', 29.4, 0, 11, 'A', 'Sul', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1114', 'Studio', 29.24, 0, 11, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1115', 'Apartamento', 68.4, 0, 11, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 1116', 'Apartamento', 68.4, 0, 11, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),

-- 12º Pavimento
(2, 'Unidade 1201', 'Apartamento', 72.34, 0, 12, 'A', 'Norte', 'Sim', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 1202', 'Apartamento', 72.34, 0, 12, 'A', 'Noroeste', 'Não', 'não', 1, 0, 1, 1, 1),
(2, 'Unidade 1203', 'Apartamento', 69.41, 0, 12, 'A', 'Nordeste', 'Sim', 'não', 0, 1, 1, 1, 2),
(2, 'Unidade 1204', 'Studio', 29.44, 0, 12, 'A', 'Oeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1205', 'Studio', 29.44, 0, 12, 'A', 'Oeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1206', 'Studio', 30.38, 0, 12, 'A', 'Nordeste', 'Sim', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1207', 'Studio', 30.38, 0, 12, 'A', 'Nordeste', 'Sim', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1208', 'Studio', 29.91, 0, 12, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1209', 'Apartamento', 69.41, 0, 12, 'A', 'Nordeste', 'Não', 'não', 0, 1, 1, 1, 2),
(2, 'Unidade 1210', 'Studio', 29.44, 0, 12, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1211', 'Apartamento', 72.34, 0, 12, 'A', 'Leste', 'Sim', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 1212', 'Apartamento', 72.34, 0, 12, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 1213', 'Studio', 29.4, 0, 12, 'A', 'Sul', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1214', 'Studio', 29.24, 0, 12, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 0),
(2, 'Unidade 1215', 'Apartamento', 68.4, 0, 12, 'A', 'Sudoeste', 'Não', 'não', 1, 0, 0, 1, 1),
(2, 'Unidade 1216', 'Apartamento', 68.4, 0, 12, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1);

-- Confirma a transação
COMMIT;

-- Verificação final: contar quantas unidades foram inseridas
SELECT 
    COUNT(*) as total_unidades,
    COUNT(CASE WHEN tipologia = 'Apartamento' THEN 1 END) as apartamentos,
    COUNT(CASE WHEN tipologia = 'Studio' THEN 1 END) as studios,
    COUNT(CASE WHEN tipologia = 'Comercial' THEN 1 END) as comerciais
FROM "UNIDADE" 
WHERE empreendimento_id = 2;
