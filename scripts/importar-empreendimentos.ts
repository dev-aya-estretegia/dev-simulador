// Script para importação em lote de empreendimentos
// Execute este script após configurar o arquivo CSV

import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"
import * as path from "path"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface EmpreendimentoCSV {
  nome: string
  descricao: string
  empresa: string
  endereco: string
  cidade: string
  estado: string
  data_lancamento: string
  vgv_bruto_alvo: number
  percentual_permuta: number
}

async function importarEmpreendimentos() {
  try {
    // Lê o arquivo CSV
    const csvPath = path.join(process.cwd(), "modelo_importacao_empreendimentos.csv")
    const csvContent = fs.readFileSync(csvPath, "utf-8")

    // Parse simples do CSV (para produção, use uma biblioteca como csv-parser)
    const lines = csvContent.split("\n").filter((line) => line.trim())
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, ""))

    const empreendimentos: EmpreendimentoCSV[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.replace(/"/g, ""))
      const empreendimento: any = {}

      headers.forEach((header, index) => {
        let value: any = values[index]

        // Conversão de tipos
        if (header === "vgv_bruto_alvo" || header === "percentual_permuta") {
          value = Number.parseFloat(value)
        }

        empreendimento[header] = value
      })

      // Calcula o VGV líquido automaticamente
      empreendimento.vgv_liquido_alvo = empreendimento.vgv_bruto_alvo * (1 - empreendimento.percentual_permuta / 100)

      empreendimentos.push(empreendimento)
    }

    console.log(`Importando ${empreendimentos.length} empreendimentos...`)

    // Insere no banco de dados
    const { data, error } = await supabase.from("empreendimento").insert(empreendimentos).select()

    if (error) {
      console.error("Erro ao importar empreendimentos:", error)
      return
    }

    console.log("✅ Empreendimentos importados com sucesso!")
    console.log(
      "IDs criados:",
      data?.map((e) => ({ id: e.id, nome: e.nome })),
    )
  } catch (error) {
    console.error("Erro durante a importação:", error)
  }
}

// Executa a importação
importarEmpreendimentos()
