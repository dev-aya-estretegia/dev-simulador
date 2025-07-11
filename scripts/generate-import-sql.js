// Este script Node.js é um utilitário para gerar o arquivo SQL acima.
// Ele busca o CSV do URL, analisa os dados e imprime os comandos INSERT.
// Você não precisa executá-lo, pois o SQL já foi gerado, mas ele serve como referência para futuras importações.

import fetch from "node-fetch"

const CSV_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/modelo_importacao_unidades_simulador_aya%28Unidades%29%20%283%29-cXtEoyeGwFqwmPdRxWMmGynw9QYioI.csv"
const EMPREENDIMENTO_ID = 10

// Mapeia os nomes das colunas do CSV para as colunas da tabela UNIDADE
const COLUMN_MAP = [
  "nome",
  "tipologia",
  "area_privativa",
  "area_garden",
  "pavimento",
  "bloco",
  "orientacao_solar",
  "vista",
  "diferencial",
  "qtd_vaga_simples",
  "qtd_vaga_duplas",
  "qtd_vaga_moto",
  "qtd_hobby_boxes",
  "qtd_suite",
]

// Função para escapar apóstrofos em strings SQL
const escapeSqlString = (value) => {
  if (value === null || typeof value === "undefined") {
    return "NULL"
  }
  return `'${value.replace(/'/g, "''")}'`
}

async function generateSqlFromCsv() {
  try {
    console.log(`-- Script para importação em lote de unidades para o empreendimento com id = ${EMPREENDIMENTO_ID}.`)
    console.log("-- Copie e cole este conteúdo no SQL Editor do Supabase para executar.\n")
    console.log("BEGIN;\n")

    const response = await fetch(CSV_URL)
    if (!response.ok) {
      throw new Error(`Erro ao buscar o CSV: ${response.statusText}`)
    }

    const csvText = await response.text()
    const lines = csvText.trim().split(/\r?\n/)
    const header = lines.shift().split(";") // Remove o cabeçalho

    const values = lines
      .map((line) => {
        if (!line) return null
        const data = line.split(";")

        const row = { empreendimento_id: EMPREENDIMENTO_ID }
        COLUMN_MAP.forEach((colName, index) => {
          const value = data[index]
          // Converte para número ou mantém como string
          if (
            [
              "area_privativa",
              "area_garden",
              "pavimento",
              "qtd_vaga_simples",
              "qtd_vaga_duplas",
              "qtd_vaga_moto",
              "qtd_hobby_boxes",
              "qtd_suite",
            ].includes(colName)
          ) {
            row[colName] = Number.parseFloat(value) || 0
          } else {
            row[colName] = value
          }
        })

        return `(${row.empreendimento_id}, ${escapeSqlString(row.nome)}, ${escapeSqlString(row.tipologia)}, ${row.area_privativa}, ${row.area_garden}, ${row.pavimento}, ${escapeSqlString(row.bloco)}, ${escapeSqlString(row.orientacao_solar)}, ${escapeSqlString(row.vista)}, ${escapeSqlString(row.diferencial)}, ${row.qtd_vaga_simples}, ${row.qtd_vaga_duplas}, ${row.qtd_vaga_moto}, ${row.qtd_hobby_boxes}, ${row.qtd_suite})`
      })
      .filter(Boolean)

    console.log(
      'INSERT INTO "UNIDADE" (empreendimento_id, nome, tipologia, area_privativa, area_garden, pavimento, bloco, orientacao_solar, vista, diferencial, qtd_vaga_simples, qtd_vaga_duplas, qtd_vaga_moto, qtd_hobby_boxes, qtd_suite) VALUES',
    )
    console.log(values.join(",\n") + ";\n")

    console.log("COMMIT;")
  } catch (error) {
    console.error("Falha ao gerar o script SQL:", error)
    console.log("\nROLLBACK;") // Em caso de erro, sugere um rollback
  }
}

generateSqlFromCsv()
