import { useSupabaseQuery } from "./use-supabase-query"
import { supabase } from "@/lib/supabase/client"

interface DetalhamentoCalculo {
  unidade: string
  cenario: string
  area_privativa: number
  tipologia: string
  area_garden: number | null
  valor_m2_tipologia: number
  valor_area_privativa_calculado: number
  valor_garden_calculado: number | null
  valor_unidade_base: number
  qtd_vaga_simples: number
  valor_vaga_simples: number
  valor_vagas_simples: number
  qtd_vaga_duplas: number
  valor_vaga_dupla: number
  valor_vagas_duplas: number
  qtd_vaga_moto: number
  valor_vaga_moto: number
  valor_vagas_moto: number
  qtd_hobby_boxes: number
  valor_hobby_box: number
  valor_hobby_boxes: number
  qtd_suite: number
  valor_suite: number
  valor_suites: number
  valor_unidade_adicionais: number
  orientacao_solar: string
  valor_unidade_orientacao: number
  percentual_orientacao: number
  pavimento: number
  valor_unidade_pavimento: number
  percentual_pavimento: number
  vista: string | null
  valor_unidade_vista: number | null
  percentual_vista: number | null
  diferencial: string | null
  valor_unidade_diferencial: number | null
  percentual_diferencial: number | null
  bloco: string
  valor_unidade_bloco: number
  percentual_bloco: number
  valor_unidade_inicial: number
  valor_unidade_venda: number
  reajuste_total: number
}

export function useParametros(cenarioId: number, unidadeId?: number) {
  return useSupabaseQuery<DetalhamentoCalculo[]>(() => {
    let query = supabase.from("vw_detalhamento_calculo").select("*").eq("cenario", cenarioId)

    if (unidadeId) {
      query = query.eq("unidade", unidadeId)
    }

    return query
  }, [cenarioId, unidadeId])
}
