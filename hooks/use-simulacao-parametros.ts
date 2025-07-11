"use client"

import { useState } from "react"
import type { ParametroPrecificacao, FatorValorizacao } from "@/types/database"
import { useToast } from "@/components/ui/use-toast"

interface SimulacaoResult {
  vgv_atual: number
  vgv_simulado: number
  diferenca_percentual: number
  valor_medio_m2_atual: number
  valor_medio_m2_simulado: number
}

export function useSimulacaoParametros(cenarioId?: number) {
  const { toast } = useToast()
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationResult, setSimulationResult] = useState<SimulacaoResult | null>(null)

  // Simular alterações nos parâmetros sem salvar
  const simularAlteracoes = async (
    parametros: Partial<ParametroPrecificacao>,
    fatores?: Partial<FatorValorizacao>[],
  ) => {
    if (!cenarioId) {
      toast({
        title: "Erro",
        description: "Não foi possível realizar a simulação. Cenário não encontrado.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSimulating(true)

      // Em um ambiente real, chamaríamos uma função RPC do Supabase
      // que faria a simulação no banco de dados sem persistir as alterações
      // Para este MVP, vamos simular o resultado

      // Simulação de chamada à API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Dados simulados para demonstração
      const resultado: SimulacaoResult = {
        vgv_atual: 15000000,
        vgv_simulado: 16500000,
        diferenca_percentual: 10,
        valor_medio_m2_atual: 8500,
        valor_medio_m2_simulado: 9350,
      }

      setSimulationResult(resultado)
      return resultado
    } catch (error) {
      console.error("Erro ao simular alterações:", error)
      toast({
        title: "Erro na simulação",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setIsSimulating(false)
    }
  }

  // Limpar resultados da simulação
  const limparSimulacao = () => {
    setSimulationResult(null)
  }

  return {
    isSimulating,
    simulationResult,
    simularAlteracoes,
    limparSimulacao,
  }
}
