import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ParametrosClientPage } from "@/components/parametros/parametros-client-page"

export default async function ParametrosPage({
  searchParams,
}: {
  searchParams: { empreendimento_id?: string }
}) {
  const supabase = createClient()
  const empreendimentoId = searchParams.empreendimento_id ? Number.parseInt(searchParams.empreendimento_id) : null

  if (!empreendimentoId) {
    redirect("/empreendimentos")
  }

  // Buscar o empreendimento
  const { data: empreendimento, error: empreendimentoError } = await supabase
    .from("empreendimento")
    .select("*")
    .eq("id", empreendimentoId)
    .single()

  if (empreendimentoError || !empreendimento) {
    console.error("Erro ao buscar empreendimento:", empreendimentoError)
    redirect("/empreendimentos")
  }

  // Buscar os cenários do empreendimento
  const { data: cenarios, error: cenariosError } = await supabase
    .from("cenario")
    .select("*")
    .eq("empreendimento_id", empreendimentoId)
    .order("created_at", { ascending: false })

  if (cenariosError) {
    console.error("Erro ao buscar cenários:", cenariosError)
  }

  // Buscar os parâmetros de precificação para cada cenário
  const cenarioIds = cenarios?.map((cenario) => cenario.id) || []
  let parametros = []

  if (cenarioIds.length > 0) {
    const { data: parametrosData, error: parametrosError } = await supabase
      .from("parametro_precificacao")
      .select("*")
      .in("cenario_id", cenarioIds)

    if (parametrosError) {
      console.error("Erro ao buscar parâmetros:", parametrosError)
    } else {
      parametros = parametrosData || []

      // Atualizar a propriedade tem_parametros em cada cenário
      cenarios?.forEach((cenario) => {
        cenario.tem_parametros = parametros.some((p) => p.cenario_id === cenario.id)
      })
    }
  }

  // Buscar os fatores de valorização para cada parâmetro
  const parametroIds = parametros.map((p) => p.id)
  let fatores = []

  if (parametroIds.length > 0) {
    const { data: fatoresData, error: fatoresError } = await supabase
      .from("fator_valorizacao")
      .select("*")
      .in("parametro_precificacao_id", parametroIds)

    if (fatoresError) {
      console.error("Erro ao buscar fatores de valorização:", fatoresError)
    } else {
      fatores = fatoresData || []
    }
  }

  return (
    <main className="container mx-auto py-8">
      <ParametrosClientPage
        empreendimento={empreendimento}
        cenarios={cenarios || []}
        parametros={parametros}
        fatores={fatores}
      />
    </main>
  )
}
