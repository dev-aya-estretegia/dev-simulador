"use client"

import { useSupabaseQuery } from "./use-supabase-query"
import { supabase } from "@/lib/supabase/client"
import type { Empreendimento } from "@/types/database"

interface UseEmpreendimentosOptions {
  ordenarPor?: "nome" | "data_lancamento" | "data_entrega" | "vgv_alvo"
  ordem?: "asc" | "desc"
}

export function useEmpreendimentos(options: UseEmpreendimentosOptions = {}) {
  const { ordenarPor = "nome", ordem = "asc" } = options

  return useSupabaseQuery<Empreendimento[]>(() => {
    return supabase
      .from("empreendimento") // Nome da tabela em minúsculas
      .select("*")
      .order(ordenarPor, { ascending: ordem === "asc" })
  }, [ordenarPor, ordem])
}

export function useEmpreendimento(id: number | null) {
  return useSupabaseQuery<Empreendimento>(() => {
    if (!id) return Promise.resolve({ data: null, error: null })
    return supabase.from("empreendimento").select("*").eq("id", id).single() // Nome da tabela em minúsculas
  }, [id])
}
