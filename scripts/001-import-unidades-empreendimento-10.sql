-- Script para importação em lote de unidades para o empreendimento com id = 10.
-- Este script reflete fielmente os dados do arquivo CSV fornecido.
-- Copie e cole este conteúdo no SQL Editor do Supabase para executar.

-- Inicia uma transação para garantir a integridade dos dados.
-- Se qualquer comando falhar, toda a operação será desfeita (ROLLBACK).
BEGIN;

-- Inserção das 18 unidades a partir do arquivo CSV: modelo_importacao_unidades_simulador_aya(Unidades) (3).csv
INSERT INTO "UNIDADE" (empreendimento_id, nome, tipologia, area_privativa, area_garden, pavimento, bloco, orientacao_solar, vista, diferencial, qtd_vaga_simples, qtd_vaga_duplas, qtd_vaga_moto, qtd_hobby_boxes, qtd_suite) VALUES
(10, 'Unidade 1216', 'Apartamento', 68.4, 0, 12, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(10, 'Unidade 1215', 'Apartamento', 68.4, 0, 12, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(10, 'Unidade 1214', 'Apartamento', 68.4, 0, 12, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(10, 'Unidade 1213', 'Apartamento', 68.4, 0, 12, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(10, 'Unidade 1212', 'Apartamento', 68.4, 0, 12, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(10, 'Unidade 1211', 'Apartamento', 68.4, 0, 12, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(10, 'Unidade 1210', 'Apartamento', 68.4, 0, 12, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(10, 'Unidade 1209', 'Apartamento', 68.4, 0, 12, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(10, 'Unidade 1208', 'Apartamento', 68.4, 0, 12, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(10, 'Unidade 1207', 'Apartamento', 68.4, 0, 12, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(10, 'Unidade 1206', 'Apartamento', 68.4, 0, 12, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(10, 'Unidade 1205', 'Apartamento', 68.4, 0, 12, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(10, 'Unidade 1204', 'Apartamento', 68.4, 0, 12, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(10, 'Unidade 1203', 'Apartamento', 68.4, 0, 12, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(10, 'Unidade 1202', 'Apartamento', 68.4, 0, 12, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(10, 'Unidade 1201', 'Apartamento', 68.4, 0, 12, 'A', 'Noroeste', 'Não', 'não', 1, 0, 0, 1, 1),
(10, 'Loja 01', 'Comercial', 100, 0, 1, 'A', 'Norte', 'Sim', 'sim', 0, 0, 0, 0, 0),
(10, 'Loja 02', 'Comercial', 120.5, 0, 1, 'A', 'Norte', 'Sim', 'sim', 0, 0, 0, 0, 0);

-- Confirma a transação, aplicando todas as inserções ao banco de dados.
COMMIT;
