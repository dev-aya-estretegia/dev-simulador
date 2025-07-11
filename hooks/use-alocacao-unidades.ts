"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"

type Unidade = {
  unidade_id: number
  nome: string
  bloco: string
  pavimento: number
  tipologia: string
  area_privativa: number
  valor_inicial: number
  valor_na_fase: number
  fase_alocada: string | null
}

export function useAlocacaoUnidades() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Buscar unidades disponíveis para alocação em uma fase
  const buscarUnidadesDisponiveis = async (cenarioId: number, faseId: number): Promise<Unidade[]> => {
    setIsLoading(true)
    try {
      console.log(`Buscando unidades disponíveis para cenário ID: ${cenarioId}, fase ID: ${faseId}`)
      const supabase = createClientComponentClient()

      // Primeiro, obtemos o nome da fase
      const { data: faseData, error: faseError } = await supabase
        .from("fase_venda")
        .select("nome, cenario_id")
        .eq("id", faseId)
        .single()

      if (faseError) {
        console.error("Erro ao buscar fase:", faseError)
        throw new Error(`Erro ao buscar fase: ${faseError.message}`)
      }

      console.log(`Fase encontrada: ${faseData.nome}, pertence ao cenário: ${faseData.cenario_id}`)

      // Verificar se a fase pertence ao cenário informado
      if (faseData.cenario_id !== cenarioId) {
        console.warn(
          `Alerta: A fase ${faseId} pertence ao cenário ${faseData.cenario_id}, mas foi solicitado para o cenário ${cenarioId}`,
        )
      }

      // Agora, buscamos as unidades disponíveis usando a função RPC
      const { data, error } = await supabase.rpc("fn_buscar_unidades_disponiveis_para_fase", {
        p_cenario_id: cenarioId,
        p_fase_id: faseId,
      })

      if (error) {
        console.error("Erro na chamada RPC:", error)
        throw new Error(`Erro ao buscar unidades disponíveis: ${error.message}`)
      }

      console.log(`Unidades disponíveis encontradas: ${data?.length || 0}`)
      return data || []
    } catch (error) {
      console.error("Erro ao buscar unidades disponíveis:", error)
      toast({
        title: "Erro ao buscar unidades",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      })
      return []
    } finally {
      setIsLoading(false)
    }
  }

  // Buscar unidades já alocadas em uma fase
  const buscarUnidadesAlocadas = async (cenarioId: number, faseId: number): Promise<Unidade[]> => {
    setIsLoading(true)
    try {
      console.log(`Buscando unidades alocadas para cenário ID: ${cenarioId}, fase ID: ${faseId}`)
      const supabase = createClientComponentClient()

      // Primeiro, obtemos o nome da fase
      const { data: faseData, error: faseError } = await supabase
        .from("fase_venda")
        .select("nome, cenario_id")
        .eq("id", faseId)
        .single()

      if (faseError) {
        console.error("Erro ao buscar fase:", faseError)
        throw new Error(`Erro ao buscar fase: ${faseError.message}`)
      }

      console.log(`Fase encontrada: ${faseData.nome}, pertence ao cenário: ${faseData.cenario_id}`)

      // Verificar se a fase pertence ao cenário informado
      if (faseData.cenario_id !== cenarioId) {
        console.warn(
          `Alerta: A fase ${faseId} pertence ao cenário ${faseData.cenario_id}, mas foi solicitado para o cenário ${cenarioId}`,
        )
        // Usar o cenário correto da fase
        cenarioId = faseData.cenario_id
      }

      // Agora, buscamos as unidades alocadas usando a função RPC
      const { data, error } = await supabase.rpc("fn_buscar_unidades_alocadas_na_fase", {
        p_cenario_id: cenarioId,
        p_fase_id: faseId,
      })

      if (error) {
        console.error("Erro na chamada RPC:", error)
        throw new Error(`Erro ao buscar unidades alocadas: ${error.message}`)
      }

      console.log(`Unidades alocadas encontradas: ${data?.length || 0}`)
      return data || []
    } catch (error) {
      console.error("Erro ao buscar unidades alocadas:", error)
      toast({
        title: "Erro ao buscar unidades",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      })
      return []
    } finally {
      setIsLoading(false)
    }
  }

  // Alocar unidades a uma fase
  const alocarUnidades = async (faseId: number, unidadesIds: number[]): Promise<boolean> => {
    setIsLoading(true)
    try {
      const supabase = createClientComponentClient()

      const { data, error } = await supabase.rpc("fn_alocar_unidades_fase", {
        p_fase_id: faseId,
        p_unidades_ids: unidadesIds,
      })

      if (error) throw new Error(`Erro ao alocar unidades: ${error.message}`)

      toast({
        title: "Unidades alocadas com sucesso",
        description: `${unidadesIds.length} unidade(s) foram alocadas à fase.`,
      })

      return true
    } catch (error) {
      console.error("Erro ao alocar unidades:", error)
      toast({
        title: "Erro ao alocar unidades",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Desalocar unidades de uma fase
  const desalocarUnidades = async (faseId: number, unidadesIds: number[]): Promise<boolean> => {
    setIsLoading(true)
    try {
      const supabase = createClientComponentClient()

      const { data, error } = await supabase.rpc("fn_desalocar_unidades_fase", {
        p_fase_id: faseId,
        p_unidades_ids: unidadesIds,
      })

      if (error) throw new Error(`Erro ao desalocar unidades: ${error.message}`)

      toast({
        title: "Unidades desalocadas com sucesso",
        description: `${unidadesIds.length} unidade(s) foram desalocadas da fase.`,
      })

      return true
    } catch (error) {
      console.error("Erro ao desalocar unidades:", error)
      toast({
        title: "Erro ao desalocar unidades",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    buscarUnidadesDisponiveis,
    buscarUnidadesAlocadas,
    alocarUnidades,
    desalocarUnidades,
    isLoading,
  }
}
