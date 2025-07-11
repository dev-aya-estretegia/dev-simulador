"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import type { PostgrestError } from "@supabase/supabase-js"

interface IndicadoresCenarioResult {
  vgv_inicial: number
  vgv_final: number
  diferenca_percentual: number
}

interface UseIndicadoresCenarioResult {
  calcularIndicadores: (cenarioId: number) => Promise<IndicadoresCenarioResult | null>
  isLoading: boolean
  error: PostgrestError | Error | null
}

export function useIndicadoresCenario(): UseIndicadoresCenarioResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<PostgrestError | Error | null>(null)

  async function calcularIndicadores(cenarioId: number): Promise<IndicadoresCenarioResult | null> {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.rpc<IndicadoresCenarioResult>("fn_calcular_indicadores_cenario", {
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
      console.error("Erro ao calcular indicadores do cenário:", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    calcularIndicadores,
    isLoading,
    error,
  }
}
