"use client"

import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"

// Tipo para representar um cenário
export type Cenario = {
  id: number
  nome: string
  descricao?: string | null
  empreendimento_id: number
  empreendimento?: {
    id: number
    nome: string
    endereco?: string | null
    vgv_bruto_alvo?: number | null
    vgv_liquido_alvo?: number | null
  }
}

// Hook para buscar todos os cenários
export function useCenarios() {
  const queryKey = ["cenarios"]

  const queryFn = async (): Promise<Cenario[]> => {
    const { data, error } = await supabase
      .from("cenario")
      .select(
        `
        *,
        empreendimento:empreendimento_id (
          id, nome, endereco, vgv_bruto_alvo, vgv_liquido_alvo
        )
      `,
      )
      .order("id")

    if (error) {
      console.error("Erro ao buscar cenários:", error)
      throw error
    }

    return data || []
  }

  return useQuery({ queryKey, queryFn })
}

// Hook para buscar um cenário específico
export function useCenario(cenarioId: number) {
  const queryKey = ["cenario", cenarioId]

  const queryFn = async (): Promise<Cenario | null> => {
    const { data, error } = await supabase
      .from("cenario")
      .select(
        `
        *,
        empreendimento:empreendimento_id (
          id, nome, endereco, vgv_bruto_alvo, vgv_liquido_alvo
        )
      `,
      )
      .eq("id", cenarioId)
      .single()

    if (error) {
      // O código 'PGRST116' significa 'nenhuma linha encontrada', o que não é um erro neste caso.
      if (error.code === "PGRST116") {
        return null
      }
      console.error(`Erro ao buscar cenário ${cenarioId}:`, error)
      throw error
    }

    return data
  }

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!cenarioId, // Executa a query apenas se o cenarioId for válido
  })
}

// Hook para operações de cenário (criar, atualizar, excluir)
export function useCenarioOperations() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Função para criar um novo cenário
  const criarCenario = async (cenario: Omit<Cenario, "id">) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.rpc("fn_criar_cenario", {
        p_nome: cenario.nome,
        p_descricao: cenario.descricao,
        p_empreendimento_id: cenario.empreendimento_id,
      })

      if (error) throw error

      toast({
        title: "Cenário criado com sucesso",
        description: `O cenário "${cenario.nome}" foi criado.`,
      })

      return data && data.length > 0 ? data[0] : null
    } catch (error: any) {
      toast({
        title: "Erro ao criar cenário",
        description: error.message,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Função para atualizar um cenário existente
  const atualizarCenario = async (cenario: Cenario) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.rpc("fn_atualizar_cenario", {
        p_id: cenario.id,
        p_nome: cenario.nome,
        p_descricao: cenario.descricao,
        p_empreendimento_id: cenario.empreendimento_id,
      })

      if (error) throw error

      toast({
        title: "Cenário atualizado com sucesso",
        description: `O cenário "${cenario.nome}" foi atualizado.`,
      })

      return data && data.length > 0 ? data[0] : null
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar cenário",
        description: error.message,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Função para excluir um cenário
  const excluirCenario = async (cenarioId: number) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("cenario").delete().eq("id", cenarioId)

      if (error) throw error

      toast({
        title: "Cenário excluído com sucesso",
        description: "O cenário foi excluído permanentemente.",
      })

      return true
    } catch (error: any) {
      toast({
        title: "Erro ao excluir cenário",
        description: error.message,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    criarCenario,
    atualizarCenario,
    excluirCenario,
    isLoading,
  }
}
