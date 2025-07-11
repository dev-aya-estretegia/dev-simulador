import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ParametrosCenarioClientPage } from "@/components/parametros/parametros-cenario-client-page"

export default async function ParametrosCenarioPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const cenarioId = Number.parseInt(params.id)

  if (isNaN(cenarioId)) {
    redirect("/cenarios")
  }

  // Buscar o cenário
  const { data: cenario, error: cenarioError } = await supabase
    .from("cenario")
    .select("*, empreendimento:empreendimento_id(*)")
    .eq("id", cenarioId)
    .single()

  if (cenarioError || !cenario) {
    console.error("Erro ao buscar cenário:", cenarioError)
    redirect("/cenarios")
  }

  // Buscar os parâmetros de precificação do cenário
  const { data: parametros, error: parametrosError } = await supabase
    .from("parametro_precificacao")
    .select("*")
    .eq("cenario_id", cenarioId)
    .single()

  if (parametrosError && parametrosError.code !== "PGRST116") {
    console.error("Erro ao buscar parâmetros:", parametrosError)
  }

  // Buscar os fatores de valorização, se existirem parâmetros
  let fatores = []
  if (parametros) {
    const { data: fatoresData, error: fatoresError } = await supabase
      .from("fator_valorizacao")
      .select("*")
      .eq("parametro_precificacao_id", parametros.id)
      .order("tipo_fator", { ascending: true })
      .order("valor_referencia", { ascending: true })

    if (fatoresError) {
      console.error("Erro ao buscar fatores:", fatoresError)
    } else {
      fatores = fatoresData || []
    }
  }

  return (
    <main className="container mx-auto py-8">
      <ParametrosCenarioClientPage
        cenario={cenario}
        empreendimento={cenario.empreendimento}
        parametros={parametros || null}
        fatores={fatores}
      />
    </main>
  )
}
