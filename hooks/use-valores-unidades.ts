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
  pavimento: number | null
  bloco: string | null
  tipologia: string
  area_privativa: number
  area_garden: number | null
  qtd_vaga_simples: number | null
  qtd_vaga_duplas: number | null
  qtd_vaga_moto: number | null
  qtd_hobby_boxes: number | null
  qtd_suite: number | null
  orientacao_solar: string | null
  vista: string | null
  diferencial: string | null
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
  cenario_id: number
  cenario_nome: string
  cenario_descricao: string | null
  empreendimento_nome: string
  // Propriedades calculadas para valor por m²
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

        console.log("Buscando dados para:", { empreendimentoId, cenarioId })

        // Primeiro, verificar se o cenário pertence ao empreendimento selecionado
        const { data: cenarioData, error: cenarioError } = await supabase
          .from("cenario")
          .select("id, nome, empreendimento_id")
          .eq("id", cenarioId)
          .eq("empreendimento_id", empreendimentoId)
          .single()

        if (cenarioError || !cenarioData) {
          console.error("Cenário não pertence ao empreendimento selecionado:", cenarioError)
          setValoresUnidades([])
          setFases([])
          return
        }

        console.log("Cenário encontrado:", cenarioData)

        // Buscar as fases do cenário
        const { data: fasesData, error: fasesError } = await supabase
          .from("fase_venda")
          .select("id, nome, ordem")
          .eq("cenario_id", cenarioId)
          .order("ordem", { ascending: true })

        if (fasesError) {
          console.error("Erro ao buscar fases:", fasesError)
          throw fasesError
        }

        console.log("Fases encontradas:", fasesData)
        setFases(fasesData || [])

        // Buscar os valores das unidades usando a view vw_unidades_por_cenario
        const { data: valoresData, error: valoresError } = await supabase
          .from("vw_unidades_por_cenario")
          .select(`
            unidade_id,
            unidade_nome,
            pavimento,
            bloco,
            tipologia,
            area_privativa,
            area_garden,
            qtd_vaga_simples,
            qtd_vaga_duplas,
            qtd_vaga_moto,
            qtd_hobby_boxes,
            qtd_suite,
            orientacao_solar,
            vista,
            diferencial,
            valor_unidade_inicial,
            valor_unidade_fase_1,
            valor_unidade_fase_2,
            valor_unidade_fase_3,
            valor_unidade_fase_4,
            valor_unidade_fase_5,
            fase_unidade_venda,
            valor_unidade_venda,
            cenario_id,
            cenario_nome,
            cenario_descricao,
            empreendimento_nome
          `)
          .eq("cenario_id", cenarioId)
          .order("pavimento", { ascending: true })
          .order("bloco", { ascending: true })
          .order("unidade_nome", { ascending: true })

        if (valoresError) {
          console.error("Erro ao buscar valores das unidades:", valoresError)
          throw valoresError
        }

        console.log("Valores das unidades encontrados:", valoresData?.length || 0, "registros")
        if (valoresData && valoresData.length > 0) {
          console.log("Primeira unidade (campos disponíveis):", Object.keys(valoresData[0]))
          console.log("Primeira unidade (dados):", valoresData[0])
        }

        // Processar os dados para garantir compatibilidade com a interface
        const processedData = (valoresData || []).map((unidade) => ({
          unidade_id: unidade.unidade_id,
          unidade_nome: unidade.unidade_nome,
          pavimento: unidade.pavimento,
          bloco: unidade.bloco,
          tipologia: unidade.tipologia,
          area_privativa: unidade.area_privativa,
          area_garden: unidade.area_garden,
          qtd_vaga_simples: unidade.qtd_vaga_simples,
          qtd_vaga_duplas: unidade.qtd_vaga_duplas,
          qtd_vaga_moto: unidade.qtd_vaga_moto,
          qtd_hobby_boxes: unidade.qtd_hobby_boxes,
          qtd_suite: unidade.qtd_suite,
          orientacao_solar: unidade.orientacao_solar,
          vista: unidade.vista,
          diferencial: unidade.diferencial,
          valor_unidade_inicial: unidade.valor_unidade_inicial,
          valor_unidade_fase_1: unidade.valor_unidade_fase_1,
          valor_unidade_fase_2: unidade.valor_unidade_fase_2,
          valor_unidade_fase_3: unidade.valor_unidade_fase_3,
          valor_unidade_fase_4: unidade.valor_unidade_fase_4,
          valor_unidade_fase_5: unidade.valor_unidade_fase_5,
          valor_unidade_fase_6: null, // vw_unidades_por_cenario só vai até fase 5
          valor_unidade_fase_7: null,
          valor_unidade_fase_8: null,
          valor_unidade_fase_9: null,
          valor_unidade_fase_10: null,
          fase_unidade_venda: unidade.fase_unidade_venda,
          valor_unidade_venda: unidade.valor_unidade_venda,
          cenario_id: unidade.cenario_id,
          cenario_nome: unidade.cenario_nome,
          cenario_descricao: unidade.cenario_descricao,
          empreendimento_nome: unidade.empreendimento_nome,
          // Calcular valores por m²
          valor_m2_inicial: unidade.area_privativa > 0 ? unidade.valor_unidade_inicial / unidade.area_privativa : 0,
          valor_m2_fase_1:
            unidade.area_privativa > 0 && unidade.valor_unidade_fase_1
              ? unidade.valor_unidade_fase_1 / unidade.area_privativa
              : null,
          valor_m2_fase_2:
            unidade.area_privativa > 0 && unidade.valor_unidade_fase_2
              ? unidade.valor_unidade_fase_2 / unidade.area_privativa
              : null,
          valor_m2_fase_3:
            unidade.area_privativa > 0 && unidade.valor_unidade_fase_3
              ? unidade.valor_unidade_fase_3 / unidade.area_privativa
              : null,
          valor_m2_fase_4:
            unidade.area_privativa > 0 && unidade.valor_unidade_fase_4
              ? unidade.valor_unidade_fase_4 / unidade.area_privativa
              : null,
          valor_m2_fase_5:
            unidade.area_privativa > 0 && unidade.valor_unidade_fase_5
              ? unidade.valor_unidade_fase_5 / unidade.area_privativa
              : null,
          valor_m2_fase_6: null,
          valor_m2_fase_7: null,
          valor_m2_fase_8: null,
          valor_m2_fase_9: null,
          valor_m2_fase_10: null,
          valor_m2_venda:
            unidade.area_privativa > 0 && unidade.valor_unidade_venda
              ? unidade.valor_unidade_venda / unidade.area_privativa
              : null,
        }))

        console.log("Dados processados:", processedData.length, "unidades")
        setValoresUnidades(processedData)
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
