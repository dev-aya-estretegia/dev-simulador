import { createClient } from "@/lib/supabase/server"
import { UnidadesClientPage } from "@/components/unidades/unidades-client-page"
import { Suspense } from "react"
import { UnidadesSkeleton } from "@/components/unidades/unidades-skeleton"

export default async function UnidadesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()

  // Obter parâmetros da URL
  const empreendimentoId = searchParams.empreendimento as string
  const cenarioId = searchParams.cenario as string
  const tipologia = searchParams.tipologia as string
  const busca = searchParams.busca as string
  const ordenacao = (searchParams.ordenacao as string) || "pavimento-asc"

  // Obter empreendimentos para o filtro
  const { data: empreendimentos } = await supabase.from("EMPREENDIMENTO").select("id, nome").order("nome")

  // Obter cenários para o filtro (filtrar por empreendimento se selecionado)
  let cenariosQuery = supabase.from("CENARIO").select("id, nome, empreendimento_id").order("nome")
  if (empreendimentoId) {
    cenariosQuery = cenariosQuery.eq("empreendimento_id", Number.parseInt(empreendimentoId))
  }
  const { data: cenarios } = await cenariosQuery

  // Construir a consulta para vw_unidades_por_cenario
  let unidadesQuery = supabase.from("vw_unidades_por_cenario").select("*")

  // Aplicar filtros usando IDs diretamente na view
  if (empreendimentoId) {
    unidadesQuery = unidadesQuery.eq("empreendimento_id", Number.parseInt(empreendimentoId))
  }

  if (cenarioId) {
    unidadesQuery = unidadesQuery.eq("cenario_id", Number.parseInt(cenarioId))
  }

  if (tipologia && tipologia !== "0") {
    unidadesQuery = unidadesQuery.eq("tipologia", tipologia)
  }

  const { data: unidades, error: unidadesError } = await unidadesQuery

  if (unidadesError) {
    console.error("Erro ao buscar unidades:", unidadesError)
  }

  // Filtrar por busca (se houver)
  let unidadesFiltradas = unidades || []
  if (busca) {
    const buscaLower = busca.toLowerCase()
    unidadesFiltradas = unidadesFiltradas.filter(
      (u) =>
        u.unidade_nome.toLowerCase().includes(buscaLower) ||
        u.bloco.toLowerCase().includes(buscaLower) ||
        (u.tipologia && u.tipologia.toLowerCase().includes(buscaLower)),
    )
  }

  // Verificar se há unidades
  const temUnidades = unidadesFiltradas.length > 0

  // Obter lista de blocos e pavimentos para os filtros
  const blocos = unidadesFiltradas
    ? [...new Set(unidadesFiltradas.map((u) => u.bloco))]
        .filter(Boolean)
        .sort()
        .map((bloco) => ({ value: bloco, label: bloco }))
    : []

  const pavimentos = unidadesFiltradas
    ? [...new Set(unidadesFiltradas.map((u) => u.pavimento))]
        .sort((a, b) => a - b)
        .map((pavimento) => ({ value: pavimento.toString(), label: `${pavimento}º Pavimento` }))
    : []

  return (
    <main className="container mx-auto py-8 bg-black text-white">
      <Suspense fallback={<UnidadesSkeleton />}>
        <UnidadesClientPage
          empreendimentos={empreendimentos || []}
          cenarios={cenarios || []}
          cenarioSelecionado={cenarioId}
          empreendimentoSelecionado={empreendimentoId}
          unidades={unidadesFiltradas}
          temUnidades={temUnidades}
          blocos={blocos}
          pavimentos={pavimentos}
          filtros={{
            tipologia,
            busca,
            ordenacao,
          }}
        />
      </Suspense>
    </main>
  )
}
