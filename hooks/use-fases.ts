"use client"

import { useSupabaseQuery } from "@/hooks/use-supabase-query"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

// Tipo para representar uma fase de venda
export type Fase = {
  id?: number
  fase_id?: number
  cenario_id: number
  nome: string
  percentual_reajuste: number
  descricao?: string | null
  ordem: number
  data_inicio?: string | null
  data_fim?: string | null
  qtd_unidades?: number
  vgv_fase?: number
  percentual_do_total?: number
  created_at?: string
  updated_at?: string
}

// Hook para buscar todas as fases de um cenário
export function useFases(cenarioId: number) {
  const queryFn = async (): Promise<Fase[]> => {
    const { data, error } = await supabase
      .from("vw_resumo_fases")
      .select("*")
      .eq("cenario_id", cenarioId)
      .order("ordem")

    if (error) {
      console.error("Erro ao buscar fases:", error)
      throw new Error(error.message)
    }

    return (data || []).map((fase) => ({
      id: fase.fase_id,
      fase_id: fase.fase_id,
      cenario_id: fase.cenario_id,
      nome: fase.nome,
      percentual_reajuste: fase.percentual_reajuste,
      descricao: fase.descricao,
      ordem: fase.ordem,
      data_inicio: fase.data_inicio,
      data_fim: fase.data_fim,
      qtd_unidades: fase.qtd_unidades || 0,
      vgv_fase: fase.vgv_fase || 0,
      percentual_do_total: fase.percentual_do_total || 0,
    }))
  }

  return useSupabaseQuery(["fases", cenarioId], queryFn, {
    enabled: !!cenarioId && !isNaN(cenarioId),
  })
}

// Hook para buscar uma fase específica
export function useFase(faseId: number | null) {
  const queryFn = async (): Promise<Fase | null> => {
    if (faseId === null || isNaN(faseId)) {
      return null
    }

    const { data, error } = await supabase.from("fase_venda").select("*").eq("id", faseId).single()

    if (error) {
      if (error.code === "PGRST116") {
        // Row not found, which is a valid state (e.g., for a new form)
        return null
      }
      console.error("Erro ao buscar fase:", error)
      throw new Error(error.message)
    }

    return data
      ? {
          id: data.id,
          fase_id: data.id,
          cenario_id: data.cenario_id,
          nome: data.nome,
          percentual_reajuste: data.percentual_reajuste,
          descricao: data.descricao,
          ordem: data.ordem,
          data_inicio: data.data_inicio,
          data_fim: data.data_fim,
        }
      : null
  }

  return useSupabaseQuery(["fase", faseId], queryFn, {
    enabled: faseId !== null && !isNaN(faseId),
  })
}

// Hook para criar, atualizar e excluir fases
export function useFaseOperations() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const invalidateFasesQueries = (cenarioId: number) => {
    queryClient.invalidateQueries({ queryKey: ["fases", cenarioId] })
    queryClient.invalidateQueries({ queryKey: ["indicadores-cenario", cenarioId] })
  }

  // Função para criar uma nova fase
  const criarFase = async (
    fase: Omit<Fase, "id" | "fase_id" | "qtd_unidades" | "vgv_fase" | "percentual_do_total">,
  ) => {
    setIsLoading(true)
    try {
      // Verificar se já existe uma fase com o mesmo nome para este cenário
      const { data: fasesMesmoNome, error: errorNome } = await supabase
        .from("fase_venda")
        .select("nome")
        .eq("cenario_id", fase.cenario_id)
        .eq("nome", fase.nome)

      if (errorNome) {
        console.error("Erro ao verificar nomes existentes:", errorNome)
      } else if (fasesMesmoNome && fasesMesmoNome.length > 0) {
        throw new Error(`Já existe uma fase com o nome "${fase.nome}" neste cenário`)
      }

      // Verificar se já existe uma fase com a mesma ordem para este cenário
      const { data: fasesMesmaOrdem, error: errorOrdem } = await supabase
        .from("fase_venda")
        .select("ordem")
        .eq("cenario_id", fase.cenario_id)
        .eq("ordem", fase.ordem)

      if (errorOrdem) {
        console.error("Erro ao verificar ordens existentes:", errorOrdem)
      } else if (fasesMesmaOrdem && fasesMesmaOrdem.length > 0) {
        throw new Error(`Já existe uma fase com a ordem ${fase.ordem} neste cenário`)
      }

      // Inserir diretamente na tabela fase_venda. O trigger cuidará do resto.
      const { data, error } = await supabase
        .from("fase_venda")
        .insert({
          cenario_id: fase.cenario_id,
          nome: fase.nome,
          percentual_reajuste: fase.percentual_reajuste,
          descricao: fase.descricao,
          ordem: fase.ordem,
          data_inicio: fase.data_inicio,
          data_fim: fase.data_fim,
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Erro ao criar fase: ${error.message}`)
      }

      toast({
        title: "Fase criada com sucesso",
        description: "A fase foi criada e os valores das unidades foram recalculados.",
      })

      invalidateFasesQueries(fase.cenario_id)
      return data
    } catch (error) {
      console.error("Erro ao criar fase:", error)
      toast({
        title: "Erro ao criar fase",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Função para atualizar uma fase existente
  const atualizarFase = async (fase: Partial<Fase> & { id: number }) => {
    setIsLoading(true)
    try {
      // Verificar se já existe outra fase com o mesmo nome para este cenário
      if (fase.nome && fase.cenario_id) {
        const { data: fasesMesmoNome, error: errorNome } = await supabase
          .from("fase_venda")
          .select("id, nome")
          .eq("cenario_id", fase.cenario_id)
          .eq("nome", fase.nome)
          .neq("id", fase.id)

        if (errorNome) {
          console.error("Erro ao verificar nomes existentes:", errorNome)
        } else if (fasesMesmoNome && fasesMesmoNome.length > 0) {
          throw new Error(`Já existe outra fase com o nome "${fase.nome}" neste cenário`)
        }
      }

      // Verificar se já existe outra fase com a mesma ordem para este cenário
      if (fase.ordem && fase.cenario_id) {
        const { data: fasesMesmaOrdem, error: errorOrdem } = await supabase
          .from("fase_venda")
          .select("id, ordem")
          .eq("cenario_id", fase.cenario_id)
          .eq("ordem", fase.ordem)
          .neq("id", fase.id)

        if (errorOrdem) {
          console.error("Erro ao verificar ordens existentes:", errorOrdem)
        } else if (fasesMesmaOrdem && fasesMesmaOrdem.length > 0) {
          throw new Error(`Já existe outra fase com a ordem ${fase.ordem} neste cenário`)
        }
      }

      const { data, error } = await supabase
        .from("fase_venda")
        .update({
          nome: fase.nome,
          percentual_reajuste: fase.percentual_reajuste,
          descricao: fase.descricao,
          ordem: fase.ordem,
          data_inicio: fase.data_inicio,
          data_fim: fase.data_fim,
        })
        .eq("id", fase.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Erro ao atualizar fase: ${error.message}`)
      }

      toast({
        title: "Fase atualizada com sucesso",
        description: "A fase foi atualizada e os valores das unidades foram recalculados.",
      })

      if (fase.cenario_id) {
        invalidateFasesQueries(fase.cenario_id)
      }
      return data
    } catch (error) {
      toast({
        title: "Erro ao atualizar fase",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Função para excluir uma fase
  const excluirFase = async (faseId: number, cenarioId: number) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("fase_venda").delete().eq("id", faseId)

      if (error) {
        throw new Error(`Erro ao excluir fase: ${error.message}`)
      }

      toast({
        title: "Fase excluída com sucesso",
        description: "A fase foi excluída e os valores das unidades foram recalculados.",
      })

      invalidateFasesQueries(cenarioId)
      return true
    } catch (error) {
      toast({
        title: "Erro ao excluir fase",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    criarFase,
    atualizarFase,
    excluirFase,
    isLoading,
  }
}

// Hook para análise de faseamento
export function useAnaliseFaseamento(cenarioId: number) {
  return useSupabaseQuery(() => {
    if (!cenarioId) return { data: [], error: null }

    // Tentar buscar da view vw_analise_faseamento se ela existir
    return supabase
      .from("vw_resumo_fases") // Usando vw_resumo_fases como fallback
      .select("*")
      .eq("cenario_id", cenarioId)
      .order("ordem")
      .then(({ data, error }) => {
        if (error) {
          console.error("Erro ao buscar análise de faseamento:", error)
          return { data: [], error }
        }
        return { data, error: null }
      })
  }, [cenarioId])
}
