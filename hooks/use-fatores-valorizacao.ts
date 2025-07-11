"use client"

import { useState } from "react"
import { useSupabaseQuery } from "./use-supabase-query"
import { supabase } from "@/lib/supabase/client"
import type { FatorValorizacao } from "@/types/database"
import { useToast } from "@/components/ui/use-toast"

export function useFatoresValorizacao(parametroPrecificacaoId?: number) {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateProgress, setUpdateProgress] = useState(0)

  // Buscar fatores de valorização para um parâmetro de precificação específico
  const { data, isLoading, error, mutate } = useSupabaseQuery<FatorValorizacao[]>(() => {
    if (!parametroPrecificacaoId) return null
    return supabase
      .from("fator_valorizacao")
      .select("*")
      .eq("parametro_precificacao_id", parametroPrecificacaoId)
      .order("tipo_fator")
      .order("valor_referencia")
  }, [parametroPrecificacaoId])

  // Adicionar log para verificar os fatores recebidos
  console.log("Fatores recebidos do banco:", data)

  // Atualizar um fator de valorização
  const updateFator = async (fatorId: number, fator: Partial<FatorValorizacao>) => {
    if (!parametroPrecificacaoId) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o fator. Parâmetro não encontrado.",
        variant: "destructive",
      })
      return false
    }

    try {
      setIsUpdating(true)
      // Simulação de progresso para feedback ao usuário durante o recálculo
      const progressInterval = setInterval(() => {
        setUpdateProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 5
        })
      }, 200)

      // Log para depuração
      console.log("Atualizando fator com ID", fatorId, "com valores:", fator)

      const { error } = await supabase
        .from("fator_valorizacao")
        .update(fator)
        .eq("id", fatorId)
        .eq("parametro_precificacao_id", parametroPrecificacaoId)

      clearInterval(progressInterval)
      setUpdateProgress(100)

      if (error) {
        console.error("Erro na atualização do fator:", error)
        throw error
      }

      // Aguardar um pouco para simular o tempo de processamento das triggers
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Fator atualizado",
        description: "O fator de valorização foi atualizado e os valores recalculados.",
      })

      mutate()
      return true
    } catch (error) {
      console.error("Erro ao atualizar fator:", error)
      toast({
        title: "Erro ao atualizar fator",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      })
      return false
    } finally {
      setIsUpdating(false)
      setUpdateProgress(0)
    }
  }

  // Criar um novo fator de valorização
  const createFator = async (fator: Omit<FatorValorizacao, "id" | "created_at" | "updated_at">) => {
    if (!parametroPrecificacaoId) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o fator. Parâmetro não encontrado.",
        variant: "destructive",
      })
      return false
    }

    try {
      setIsUpdating(true)

      const { data: newData, error } = await supabase
        .from("fator_valorizacao")
        .insert({ ...fator, parametro_precificacao_id: parametroPrecificacaoId })
        .select()

      if (error) throw error

      toast({
        title: "Fator criado",
        description: "O fator de valorização foi criado com sucesso.",
      })

      mutate([...(data || []), ...newData])
      return true
    } catch (error) {
      console.error("Erro ao criar fator:", error)
      toast({
        title: "Erro ao criar fator",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      })
      return false
    } finally {
      setIsUpdating(false)
    }
  }

  // Excluir um fator de valorização
  const deleteFator = async (fatorId: number) => {
    try {
      setIsUpdating(true)

      const { error } = await supabase
        .from("fator_valorizacao")
        .delete()
        .eq("id", fatorId)
        .eq("parametro_precificacao_id", parametroPrecificacaoId)

      if (error) throw error

      toast({
        title: "Fator excluído",
        description: "O fator de valorização foi excluído com sucesso.",
      })

      mutate(data?.filter((f) => f.id !== fatorId) || [])
      return true
    } catch (error) {
      console.error("Erro ao excluir fator:", error)
      toast({
        title: "Erro ao excluir fator",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      })
      return false
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    fatores: data || [],
    isLoading,
    error,
    isUpdating,
    updateProgress,
    updateFator,
    createFator,
    deleteFator,
  }
}
