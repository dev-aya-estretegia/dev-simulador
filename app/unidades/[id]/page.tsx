import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UnidadeDetalhes } from "@/components/unidades/unidade-detalhes"

interface UnidadePageProps {
  params: {
    id: string
  }
  searchParams: {
    cenario?: string
  }
}

export default async function UnidadePage({ params, searchParams }: UnidadePageProps) {
  const supabase = createClient()

  // Verificar se o cenário foi fornecido
  if (!searchParams.cenario) {
    return notFound()
  }

  const unidadeId = Number(params.id)
  const cenarioId = Number(searchParams.cenario)

  // Buscar detalhes da unidade
  const { data: unidade, error } = await supabase
    .from("vw_unidades_por_cenario")
    .select("*")
    .eq("unidade_id", unidadeId)
    .eq("cenario_id", cenarioId)
    .single()

  if (error || !unidade) {
    console.error("Erro ao buscar unidade:", error)
    return notFound()
  }

  // Buscar detalhamento do cálculo
  const { data: detalhamentoCalculo, error: erroDetalhamento } = await supabase
    .from("vw_detalhamento_calculo")
    .select("*")
    .eq("unidade", unidadeId)
    .eq("cenario", cenarioId)
    .single()

  if (erroDetalhamento) {
    console.error("Erro ao buscar detalhamento do cálculo:", erroDetalhamento)
  }

  return (
    <main className="container mx-auto py-8">
      <UnidadeDetalhes unidade={unidade} detalhamentoCalculo={detalhamentoCalculo || undefined} />
    </main>
  )
}
