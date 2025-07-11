import { createClient } from "@/lib/supabase/server"
import { UnidadesDashboard } from "@/components/unidades/unidades-dashboard" // Corrected path if it's directly in components

export default async function UnidadesDashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()

  const cenarioIdParam = searchParams.cenario
  const empreendimentoIdParam = searchParams.empreendimento

  const initialCenarioId = cenarioIdParam ? Number(cenarioIdParam) : undefined
  const initialEmpreendimentoId = empreendimentoIdParam ? Number(empreendimentoIdParam) : undefined

  let pageTitle = "Dashboard de Detalhamento de Cálculo"
  let cenarioNome = ""
  let empreendimentoNome = ""

  if (initialEmpreendimentoId) {
    const { data: empData } = await supabase
      .from("empreendimento")
      .select("nome")
      .eq("id", initialEmpreendimentoId)
      .single()
    if (empData) {
      empreendimentoNome = empData.nome
      pageTitle = `${empreendimentoNome} - Detalhamento`
    }
  }

  if (initialCenarioId) {
    const { data: cenData } = await supabase.from("cenario").select("nome").eq("id", initialCenarioId).single()
    if (cenData) {
      cenarioNome = cenData.nome
      if (empreendimentoNome) {
        pageTitle = `${empreendimentoNome} / ${cenarioNome} - Detalhamento`
      } else {
        pageTitle = `${cenarioNome} - Detalhamento`
      }
    }
  }

  return (
    <main className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-100">{pageTitle}</h1>
      <UnidadesDashboard initialEmpreendimentoId={initialEmpreendimentoId} initialCenarioId={initialCenarioId} />
    </main>
  )
}
