"use client"

import { useState } from "react"
import { useSupabaseQuery } from "./use-supabase-query"
import { supabase } from "@/lib/supabase/client"
import type { ParametroPrecificacao } from "@/types/database"
import { useToast } from "@/components/ui/use-toast"

export function useParametrosPrecificacao(cenarioId?: number) {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateProgress, setUpdateProgress] = useState(0)

  // Buscar parâmetros de precificação para um cenário específico
  const { data, isLoading, error, mutate } = useSupabaseQuery<ParametroPrecificacao>(() => {
    if (!cenarioId) return null
    return supabase.from("parametro_precificacao").select("*").eq("cenario_id", cenarioId).single()
  }, [cenarioId])

  // Adicionar um log para depuração
  console.log("Dados dos parâmetros recebidos:", data)

  // Atualizar parâmetros de precificação
  const updateParametros = async (parametros: Partial<ParametroPrecificacao>) => {
    if (!cenarioId || !data?.id) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os parâmetros. Cenário não encontrado.",
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
      console.log("Atualizando parâmetros com:", parametros)

      // Removida a propriedade updated_at
      const { error } = await supabase
        .from("parametro_precificacao")
        .update(parametros)
        .eq("id", data.id)
        .eq("cenario_id", cenarioId)

      clearInterval(progressInterval)
      setUpdateProgress(100)

      if (error) {
        console.error("Erro na atualização:", error)
        throw error
      }

      // Aguardar um pouco para simular o tempo de processamento das triggers
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Parâmetros atualizados",
        description: "Os valores das unidades foram recalculados com sucesso.",
      })

      mutate()
      return true
    } catch (error) {
      console.error("Erro ao atualizar parâmetros:", error)
      toast({
        title: "Erro ao atualizar parâmetros",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      })
      return false
    } finally {
      setIsUpdating(false)
      setUpdateProgress(0)
    }
  }

  // Criar parâmetros de precificação para um novo cenário
  const createParametros = async (parametros: Omit<ParametroPrecificacao, "id">) => {
    if (!cenarioId) {
      toast({
        title: "Erro",
        description: "Não foi possível criar os parâmetros. Cenário não encontrado.",
        variant: "destructive",
      })
      return false
    }

    try {
      setIsUpdating(true)

      const { data: newData, error } = await supabase
        .from("parametro_precificacao")
        .insert({ ...parametros, cenario_id: cenarioId })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Parâmetros criados",
        description: "Os parâmetros de precificação foram criados com sucesso.",
      })

      mutate(newData)
      return true
    } catch (error) {
      console.error("Erro ao criar parâmetros:", error)
      toast({
        title: "Erro ao criar parâmetros",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      })
      return false
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    parametros: data,
    isLoading,
    error,
    isUpdating,
    updateProgress,
    updateParametros,
    createParametros,
  }
}
