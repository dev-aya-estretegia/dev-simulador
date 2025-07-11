"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

export interface DetalhamentoCalculo {
  unidade_id: number
  empreendimento_id: number
  cenario_id: number

  unidade: string
  tipologia: string
  area_privativa: number
  area_garden: number | null
  orientacao_solar: string | null
  pavimento: number | null
  vista: string | null
  diferencial: string | null
  unidade_bloco: string | null

  qtd_vaga_simples: number | null
  qtd_vaga_duplas: number | null
  qtd_vaga_moto: number | null
  qtd_hobby_boxes: number | null
  qtd_suite: number | null

  cenario_nome: string
  cenario_descricao: string | null

  empreendimento_id_ref: number
  empreendimento_nome: string

  // Valores unitários dos parâmetros de precificação
  valor_area_privativa_apartamento: number | null
  valor_area_privativa_studio: number | null
  valor_area_privativa_comercial: number | null
  valor_m2_area_garden: number | null
  valor_unitario_vaga_simples: number | null
  valor_unitario_vaga_dupla: number | null
  valor_unitario_vaga_moto: number | null
  valor_unitario_hobby_boxes: number | null
  valor_unitario_suite: number | null

  // Valores calculados
  valor_area_privativa_calculado: number
  valor_garden_calculado: number
  valor_unidade_base: number

  // Totais para cada tipo de adicional
  valor_total_vagas_simples: number | null
  valor_total_vagas_duplas: number | null
  valor_total_vagas_moto: number | null
  valor_total_hobby_boxes: number | null
  valor_total_suites: number | null

  // Valor Total de Adicionais
  valor_unidade_adicionais: number

  // Percentuais dos Fatores de Valorização
  percentual_orientacao: number | null
  percentual_pavimento: number | null
  percentual_vista: number | null
  percentual_diferencial: number | null
  percentual_bloco: number | null

  // Valores Finais dos Fatores de Valorização
  valor_unidade_orientacao: number | null
  valor_unidade_pavimento: number | null
  valor_unidade_vista: number | null
  valor_unidade_diferencial: number | null
  valor_fator_bloco: number | null

  // Valor Inicial Final da Unidade
  valor_unidade_inicial: number

  // Informações de fase
  fase_unidade_venda: string | null
  valor_unidade_venda: number
}

export function useDetalhamentoCalculo(empreendimentoId?: number | null, cenarioId?: number | null) {
  const [detalhamentos, setDetalhamentos] = useState<DetalhamentoCalculo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only fetch if both empreendimentoId and cenarioId are present
    if (!empreendimentoId || !cenarioId) {
      setDetalhamentos([])
      setLoading(false)
      setError(null)
      return
    }

    async function fetchDetalhamentos() {
      try {
        setLoading(true)
        setError(null)

        console.log("🔍 Buscando detalhamentos para:", { empreendimentoId, cenarioId })

        let query = supabase.from("vw_detalhamento_calculo").select("*")

        // Filtros precisos usando as colunas de identificação
        query = query.eq("empreendimento_id", empreendimentoId)
        query = query.eq("cenario_id", cenarioId)

        // Ordenação melhorada
        query = query
          .order("unidade_bloco", { ascending: true, nullsFirst: false })
          .order("pavimento", { ascending: true, nullsFirst: false })
          .order("unidade", { ascending: true })

        const { data, error: queryError } = await query

        if (queryError) {
          console.error("❌ Erro na consulta Supabase (vw_detalhamento_calculo):", queryError)
          throw queryError
        }

        console.log("✅ Dados retornados da view:", data?.length, "registros")

        // Log detalhado dos primeiros registros para debug
        if (data && data.length > 0) {
          console.log("🔍 Amostra dos dados (primeiros 3 registros):")
          data.slice(0, 3).forEach((item, index) => {
            console.log(`Registro ${index + 1}:`, {
              unidade: item.unidade,
              orientacao_solar: item.orientacao_solar,
              percentual_orientacao: item.percentual_orientacao,
              valor_unidade_orientacao: item.valor_unidade_orientacao,
              vista: item.vista,
              percentual_vista: item.percentual_vista,
              valor_unidade_vista: item.valor_unidade_vista,
              diferencial: item.diferencial,
              percentual_diferencial: item.percentual_diferencial,
              valor_unidade_diferencial: item.valor_unidade_diferencial,
              unidade_bloco: item.unidade_bloco,
              percentual_bloco: item.percentual_bloco,
              valor_fator_bloco: item.valor_fator_bloco,
              pavimento: item.pavimento,
              percentual_pavimento: item.percentual_pavimento,
              valor_unidade_pavimento: item.valor_unidade_pavimento,
            })
          })
        }

        setDetalhamentos(data || [])
      } catch (err: any) {
        console.error("❌ Erro ao buscar detalhamento do cálculo:", err)
        setError(err.message || "Erro ao buscar detalhamento do cálculo")
        setDetalhamentos([])
      } finally {
        setLoading(false)
      }
    }

    fetchDetalhamentos()
  }, [empreendimentoId, cenarioId])

  return { detalhamentos, loading, error }
}
