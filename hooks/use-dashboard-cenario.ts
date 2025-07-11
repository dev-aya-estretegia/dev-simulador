"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

// Adicionar os campos necessários para os novos cards na interface DashboardCenario
export interface DashboardCenario {
  id: number
  nome: string
  descricao: string | null
  vgv_inicial_projetado: number | null
  vgv_final_projetado: number | null
  diferenca_percentual: number | null
  total_unidades: number | null
  unidades_fase_1: number | null
  vgv_fase_1: number | null
  unidades_fase_2: number | null
  vgv_fase_2: number | null
  unidades_fase_3: number | null
  vgv_fase_3: number | null
  unidades_fase_4: number | null
  vgv_fase_4: number | null
  unidades_fase_5: number | null
  vgv_fase_5: number | null
  unidades_fase_6: number | null
  vgv_fase_6: number | null
  unidades_fase_7: number | null
  vgv_fase_7: number | null
  unidades_fase_8: number | null
  vgv_fase_8: number | null
  unidades_fase_9: number | null
  vgv_fase_9: number | null
  unidades_fase_10: number | null
  vgv_fase_10: number | null
  vgv_apartamentos: number | null
  vgv_studios: number | null
  vgv_comercial: number | null
  valor_medio_m2_geral: number | null
  valor_medio_m2_apartamentos: number | null
  valor_medio_m2_studios: number | null
  valor_medio_m2_comercial: number | null
  meta_vgv: number | null
  percentual_permuta: number | null
}

export interface Empreendimento {
  id: number
  nome: string
}

// Adicionar interface para dados do empreendimento
export interface EmpreendimentoData {
  id: number
  nome: string
  vgv_bruto_alvo: number | null
  percentual_permuta: number | null
  vgv_liquido_alvo: number | null
}

export interface CenarioOption {
  id: number
  nome: string
  empreendimento_id: number
}

// Modificar a função useDashboardCenario para incluir os dados do empreendimento
export function useDashboardCenario(empreendimentoIdProp?: number, cenarioIdProp?: number) {
  const [empreendimentos, setEmpreendimentos] = useState<Empreendimento[]>([])
  const [cenarios, setCenarios] = useState<CenarioOption[]>([])
  const [selectedEmpreendimento, setSelectedEmpreendimento] = useState<number | null>(empreendimentoIdProp || null)
  const [selectedCenario, setSelectedCenario] = useState<number | null>(cenarioIdProp || null)
  const [dashboardData, setDashboardData] = useState<DashboardCenario | null>(null)
  const [empreendimentoData, setEmpreendimentoData] = useState<EmpreendimentoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Adicionar useEffect para buscar dados do empreendimento selecionado
  useEffect(() => {
    async function fetchEmpreendimentoData() {
      if (!selectedEmpreendimento) {
        setEmpreendimentoData(null)
        return
      }

      try {
        const { data, error } = await supabase
          .from("empreendimento")
          .select("id, nome, vgv_bruto_alvo, percentual_permuta, vgv_liquido_alvo")
          .eq("id", selectedEmpreendimento)
          .single()

        if (error) throw error
        setEmpreendimentoData(data)
      } catch (err) {
        console.error("Erro ao buscar dados do empreendimento:", err)
        setError(err instanceof Error ? err.message : "Erro ao buscar dados do empreendimento")
      }
    }

    fetchEmpreendimentoData()
  }, [selectedEmpreendimento])

  // Buscar empreendimentos
  useEffect(() => {
    async function fetchEmpreendimentos() {
      try {
        const { data, error } = await supabase.from("empreendimento").select("id, nome").order("nome")

        if (error) throw error
        setEmpreendimentos(data || [])

        // Selecionar primeiro empreendimento automaticamente se não houver um selecionado
        if (!selectedEmpreendimento && data && data.length > 0) {
          setSelectedEmpreendimento(data[0].id)
        }
      } catch (err) {
        console.error("Erro ao buscar empreendimentos:", err)
        setError(err instanceof Error ? err.message : "Erro ao buscar empreendimentos")
      }
    }

    fetchEmpreendimentos()
  }, [selectedEmpreendimento])

  // Buscar cenários quando empreendimento muda
  useEffect(() => {
    async function fetchCenarios() {
      if (!selectedEmpreendimento) {
        setCenarios([])
        setSelectedCenario(null)
        return
      }

      try {
        const { data, error } = await supabase
          .from("cenario")
          .select("id, nome, empreendimento_id")
          .eq("empreendimento_id", selectedEmpreendimento)
          .order("nome")

        if (error) throw error
        setCenarios(data || [])

        // Selecionar primeiro cenário automaticamente se não houver um selecionado
        if ((!selectedCenario || !data?.some((c) => c.id === selectedCenario)) && data && data.length > 0) {
          setSelectedCenario(data[0].id)
        } else if (data && data.length === 0) {
          setSelectedCenario(null)
        }
      } catch (err) {
        console.error("Erro ao buscar cenários:", err)
        setError(err instanceof Error ? err.message : "Erro ao buscar cenários")
      }
    }

    fetchCenarios()
  }, [selectedEmpreendimento, selectedCenario])

  // Buscar dados do dashboard quando cenário muda
  useEffect(() => {
    async function fetchDashboardData() {
      if (!selectedCenario) {
        setDashboardData(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from("vw_dashboard_cenario")
          .select("*")
          .eq("id", selectedCenario)
          .single()

        if (error) throw error
        setDashboardData(data)
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err)
        setError(err instanceof Error ? err.message : "Erro ao buscar dados do dashboard")
        setDashboardData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [selectedCenario])

  // Funções para obter dados dos gráficos com cores AYA
  const getVGVPorTipologia = () => {
    if (!dashboardData) return []

    // Cores da paleta AYA
    const ayaColors = ["#17c442", "#34ff67", "#5fff87", "#8bffa8", "#c3ffd2", "#eefff2"]

    return [
      {
        name: "Apartamentos",
        value: dashboardData.vgv_apartamentos || 0,
        color: ayaColors[0],
      },
      {
        name: "Studios",
        value: dashboardData.vgv_studios || 0,
        color: ayaColors[1],
      },
      {
        name: "Comercial",
        value: dashboardData.vgv_comercial || 0,
        color: ayaColors[2],
      },
    ].filter((item) => item.value > 0)
  }

  const getVGVPorFase = () => {
    if (!dashboardData) return []

    const fases = []
    for (let i = 1; i <= 10; i++) {
      const vgvFase = dashboardData[`vgv_fase_${i}` as keyof DashboardCenario] as number
      const unidadesFase = dashboardData[`unidades_fase_${i}` as keyof DashboardCenario] as number

      if (vgvFase && vgvFase > 0) {
        fases.push({
          name: `Fase ${i}`,
          vgv: vgvFase,
          unidades: unidadesFase || 0,
        })
      }
    }
    return fases
  }

  const getValoresMediosPorTipologia = () => {
    if (!dashboardData) return []

    return [
      {
        name: "Apartamentos",
        valor: dashboardData.valor_medio_m2_apartamentos || 0,
      },
      {
        name: "Studios",
        valor: dashboardData.valor_medio_m2_studios || 0,
      },
      {
        name: "Comercial",
        valor: dashboardData.valor_medio_m2_comercial || 0,
      },
    ].filter((item) => item.valor > 0)
  }

  const getUnidadesPorFase = () => {
    if (!dashboardData) return []

    const fases = []
    for (let i = 1; i <= 10; i++) {
      const unidadesFase = dashboardData[`unidades_fase_${i}` as keyof DashboardCenario] as number

      if (unidadesFase && unidadesFase > 0) {
        fases.push({
          name: `Fase ${i}`,
          unidades: unidadesFase,
        })
      }
    }
    return fases
  }

  // No return, adicionar empreendimentoData
  return {
    // Estados
    empreendimentos,
    cenarios,
    selectedEmpreendimento,
    selectedCenario,
    dashboardData,
    empreendimentoData,
    loading,
    error,

    // Ações
    setSelectedEmpreendimento,
    setSelectedCenario,

    // Dados para gráficos
    charts: {
      vgvPorTipologia: getVGVPorTipologia(),
      vgvPorFase: getVGVPorFase(),
      valoresMediosPorTipologia: getValoresMediosPorTipologia(),
      unidadesPorFase: getUnidadesPorFase(),
    },
  }
}
