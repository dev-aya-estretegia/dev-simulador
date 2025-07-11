import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UnidadeForm } from "@/components/unidades/unidade-form"

interface EditarUnidadePageProps {
  params: {
    id: string
  }
  searchParams: {
    cenario?: string
  }
}

export default async function EditarUnidadePage({ params, searchParams }: EditarUnidadePageProps) {
  const supabase = createClient()

  // Verificar se o cenário foi fornecido
  if (!searchParams.cenario) {
    return notFound()
  }

  const unidadeId = Number(params.id)
  const cenarioId = Number(searchParams.cenario)

  // Buscar unidade
  const { data: unidade, error } = await supabase.from("UNIDADE").select("*").eq("id", unidadeId).single()

  if (error || !unidade) {
    console.error("Erro ao buscar unidade:", error)
    return notFound()
  }

  // Obter empreendimentos para o select
  const { data: empreendimentos } = await supabase.from("empreendimento").select("id, nome").order("nome")

  // Obter cenários para o select
  const { data: cenarios } = await supabase.from("CENARIO").select("id, nome, empreendimento_id").order("nome")

  // Buscar valores da unidade no cenário
  const { data: valorUnidadeCenario } = await supabase
    .from("VALOR_UNIDADES_CENARIO")
    .select("*")
    .eq("unidade_id", unidadeId)
    .eq("cenario_id", cenarioId)
    .single()

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Editar Unidade</h1>
      <UnidadeForm
        unidade={unidade}
        valorUnidadeCenario={valorUnidadeCenario}
        empreendimentos={empreendimentos || []}
        cenarios={cenarios || []}
        empreendimentoId={unidade.empreendimento_id}
        cenarioId={cenarioId}
        isEdicao={true}
      />
    </main>
  )
}
