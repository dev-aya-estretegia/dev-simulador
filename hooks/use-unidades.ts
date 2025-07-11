"use client"

import { useSupabaseQuery } from "@/hooks/use-supabase-query"
import { supabase } from "@/lib/supabase/client"

interface UseUnidadesOptions {
  cenarioId?: number
  empreendimentoId?: number
  tipologia?: string
  ordenarPor?: string
  ordem?: "asc" | "desc"
}

export function useUnidades(options: UseUnidadesOptions = {}) {
  const { cenarioId, empreendimentoId, tipologia, ordenarPor = "pavimento", ordem = "asc" } = options

  return useSupabaseQuery(async () => {
    // Construir a consulta base usando IDs diretamente
    let query = supabase.from("vw_unidades_por_cenario").select("*")

    // Filtrar por empreendimento ID diretamente
    if (empreendimentoId) {
      query = query.eq("empreendimento_id", empreendimentoId)
    }

    // Filtrar por cenário ID diretamente
    if (cenarioId) {
      query = query.eq("cenario_id", cenarioId)
    }

    // Filtrar por tipologia se especificada
    if (tipologia && tipologia !== "0") {
      query = query.eq("tipologia", tipologia)
    }

    // Aplicar ordenação
    switch (ordenarPor) {
      case "nome":
        query = query.order("unidade_nome", { ascending: ordem === "asc" })
        break
      case "pavimento":
        query = query.order("pavimento", { ascending: ordem === "asc" })
        break
      case "valor":
        query = query.order("valor_unidade_inicial", { ascending: ordem === "asc" })
        break
      case "area":
        query = query.order("area_privativa", { ascending: ordem === "asc" })
        break
      default:
        query = query.order("pavimento", { ascending: ordem === "asc" })
    }

    return query
  }, [cenarioId, empreendimentoId, tipologia, ordenarPor, ordem])
}
