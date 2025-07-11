"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

// Schema de validação Zod, que será usado no servidor como uma camada extra de segurança.
const unidadeSchema = z.object({
  nome: z.string().min(1, "O nome da unidade é obrigatório"),
  tipologia: z.enum(["Apartamento", "Studio", "Comercial"]),
  area_privativa: z.coerce.number().positive(),
  area_garden: z.coerce.number().min(0).optional().nullable(),
  pavimento: z.coerce.number().int(),
  bloco: z.string().min(1),
  orientacao_solar: z.enum(["Norte", "Sul", "Leste", "Oeste", "Nordeste", "Noroeste", "Sudeste", "Sudoeste"]),
  vista: z.string().optional().nullable(),
  diferencial: z.string().optional().nullable(),
  qtd_vaga_simples: z.coerce.number().int().min(0).default(0),
  qtd_vaga_duplas: z.coerce.number().int().min(0).default(0),
  qtd_vaga_moto: z.coerce.number().int().min(0).default(0),
  qtd_hobby_boxes: z.coerce.number().int().min(0).default(0),
  qtd_suite: z.coerce.number().int().min(0).default(0),
})

type UnidadeParaInserir = z.infer<typeof unidadeSchema>

// Define a estrutura do objeto de retorno da ação.
interface ActionResult {
  success: boolean
  error?: {
    message: string
    details?: string
    unitName?: string
  }
  successCount?: number
}

export async function importarUnidadesAction(
  empreendimentoId: number,
  unidades: UnidadeParaInserir[],
): Promise<ActionResult> {
  const supabase = createClient()

  if (!empreendimentoId || !unidades || unidades.length === 0) {
    return { success: false, error: { message: "Dados inválidos fornecidos para a importação." } }
  }

  let unidadesImportadasComSucesso = 0

  for (const unidade of unidades) {
    const unidadeParaInserir = {
      empreendimento_id: empreendimentoId,
      ...unidade,
    }

    // Lógica de inserção e tratamento de erro corrigida
    const { error } = await supabase.from("UNIDADE").insert(unidadeParaInserir)

    // **A CORREÇÃO DEFINITIVA**:
    // Em vez de usar try/catch, verificamos diretamente o objeto de erro retornado.
    // Isso evita o problema de serialização do erro no runtime da Server Action.
    if (error) {
      console.error(
        `[Server Action] Erro de Banco de Dados ao importar a unidade "${unidade.nome}":`,
        JSON.stringify(error, null, 2),
      )
      // Retornamos um objeto de falha claro e detalhado.
      return {
        success: false,
        error: {
          message: error.message,
          details: error.details || "Não há detalhes adicionais do banco de dados.",
          unitName: unidade.nome,
        },
      }
    }

    unidadesImportadasComSucesso++
  }

  // Se todas as unidades forem inseridas com sucesso.
  return { success: true, successCount: unidadesImportadasComSucesso }
}
