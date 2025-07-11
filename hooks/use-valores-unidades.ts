"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

export interface FaseVenda {
  id: number
  nome: string
  ordem: number
}

export interface ValorUnidade {
  unidade_id: number
  unidade_nome: string
  bloco: string | null
  pavimento: number | null
  tipologia: string
  area_privativa: number
  cenario_id: number
  cenario_nome: string
  valor_unidade_inicial: number
  valor_unidade_fase_1: number | null
  valor_unidade_fase_2: number | null
  valor_unidade_fase_3: number | null
  valor_unidade_fase_4: number | null
  valor_unidade_fase_5: number | null
  valor_unidade_fase_6: number | null
  valor_unidade_fase_7: number | null
  valor_unidade_fase_8: number | null
  valor_unidade_fase_9: number | null
  valor_unidade_fase_10: number | null
  fase_unidade_venda: string | null
  valor_unidade_venda: number | null
  // Novas propriedades para valor por m²
  valor_m2_inicial: number
  valor_m2_fase_1: number | null
  valor_m2_fase_2: number | null
  valor_m2_fase_3: number | null
  valor_m2_fase_4: number | null
  valor_m2_fase_5: number | null
  valor_m2_fase_6: number | null
  valor_m2_fase_7: number | null
  valor_m2_fase_8: number | null
  valor_m2_fase_9: number | null
  valor_m2_fase_10: number | null
  valor_m2_venda: number | null
}

export function useValoresUnidades(empreendimentoId: number | null | undefined, cenarioId: number | null | undefined) {
  const [valoresUnidades, setValoresUnidades] = useState<ValorUnidade[]>([])
  const [fases, setFases] = useState<FaseVenda[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchValoresUnidades() {
      // Se não houver empreendimento ou cenário selecionado, limpar dados
      if (!empreendimentoId || !cenarioId) {
        setValoresUnidades([])
        setFases([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Primeiro, verificar se o cenário pertence ao empreendimento selecionado
        const { data: cenarioData, error: cenarioError } = await supabase
          .from("cenario")
          .select("id")
          .eq("id", cenarioId)
          .eq("empreendimento_id", empreendimentoId)
          .single()

        if (cenarioError || !cenarioData) {
          console.error("Cenário não pertence ao empreendimento selecionado")
          setValoresUnidades([])
          setFases([])
          return
        }

        // Buscar as fases do cenário
        const { data: fasesData, error: fasesError } = await supabase
          .from("fase_venda")
          .select("id, nome, ordem")
          .eq("cenario_id", cenarioId)
          .order("ordem", { ascending: true })

        if (fasesError) throw fasesError
        setFases(fasesData || [])

        // Buscar os valores das unidades
        const { data, error } = await supabase
          .from("vw_valores_unidades_completo")
          .select("*")
          .eq("cenario_id", cenarioId)
          .order("bloco", { ascending: true })
          .order("pavimento", { ascending: true })
          .order("unidade_nome", { ascending: true })

        if (error) throw error
        setValoresUnidades(data || [])
      } catch (err: any) {
        console.error("Erro ao buscar valores das unidades:", err)
        setError(err instanceof Error ? err.message : "Erro ao buscar valores das unidades")
        setValoresUnidades([])
        setFases([])
      } finally {
        setLoading(false)
      }
    }

    fetchValoresUnidades()
  }, [empreendimentoId, cenarioId])

  return { valoresUnidades, fases, loading, error }
}
