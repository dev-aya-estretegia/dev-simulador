"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import type { PostgrestError } from "@supabase/supabase-js"

interface CalculoValorInicialResult {
  valor_unidade_inicial: number
}

interface UseCalculoValorInicialResult {
  calcularValorInicial: (unidadeId: number, cenarioId: number) => Promise<number>
  isLoading: boolean
  error: PostgrestError | Error | null
}

export function useCalculoValorInicial(): UseCalculoValorInicialResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<PostgrestError | Error | null>(null)

  async function calcularValorInicial(unidadeId: number, cenarioId: number): Promise<number> {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.rpc<CalculoValorInicialResult>("fn_calcular_valor_inicial_unidade", {
        p_unidade_id: unidadeId,
        p_cenario_id: cenarioId,
      })

      if (error) {
        setError(error)
        return 0
      }

      return data?.valor_unidade_inicial || 0
    } catch (err) {
      const error = err as Error
      setError(error)
      console.error("Erro ao calcular valor inicial:", error)
      return 0
    } finally {
      setIsLoading(false)
    }
  }

  return {
    calcularValorInicial,
    isLoading,
    error,
  }
}
