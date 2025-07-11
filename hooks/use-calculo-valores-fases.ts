"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import type { PostgrestError } from "@supabase/supabase-js"

interface CalculoValoresFasesResult {
  fase_1: number
  fase_2: number
  fase_3: number
  fase_4: number
  fase_5: number
  fase_6: number
  fase_7: number
  fase_8: number
  fase_9: number
  fase_10: number
}

interface UseCalculoValoresFasesResult {
  calcularValoresFases: (unidadeId: number, cenarioId: number) => Promise<CalculoValoresFasesResult | null>
  isLoading: boolean
  error: PostgrestError | Error | null
}

export function useCalculoValoresFases(): UseCalculoValoresFasesResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<PostgrestError | Error | null>(null)

  async function calcularValoresFases(unidadeId: number, cenarioId: number): Promise<CalculoValoresFasesResult | null> {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.rpc<CalculoValoresFasesResult>("fn_calcular_valores_fases", {
        p_unidade_id: unidadeId,
        p_cenario_id: cenarioId,
      })

      if (error) {
        setError(error)
        return null
      }

      return data
    } catch (err) {
      const error = err as Error
      setError(error)
      console.error("Erro ao calcular valores das fases:", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    calcularValoresFases,
    isLoading,
    error,
  }
}
