import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CenarioForm } from "@/components/cenarios/cenario-form"
import { Breadcrumb } from "@/components/shared/breadcrumb"

export default async function NovoCenarioPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Obter o ID do empreendimento da query string, se existir
  const empreendimentoId = searchParams.empreendimento
    ? Number.parseInt(searchParams.empreendimento as string, 10)
    : undefined

  const supabase = createClient()

  // Se temos um ID de empreendimento, verificar se ele existe
  if (empreendimentoId) {
    const { data: empreendimento, error } = await supabase
      .from("empreendimento")
      .select("id, nome")
      .eq("id", empreendimentoId)
      .single()

    if (error || !empreendimento) {
      console.error("Erro ao buscar empreendimento:", error)
      redirect("/cenarios")
    }

    // Definir os itens do breadcrumb
    const breadcrumbItems = [
      { label: "Empreendimentos", href: "/empreendimentos" },
      { label: empreendimento.nome, href: `/empreendimentos/${empreendimentoId}` },
      { label: "Cenários", href: `/cenarios?empreendimento=${empreendimentoId}` },
      { label: "Novo Cenário" },
    ]

    return (
      <div className="container mx-auto py-8">
        <Breadcrumb items={breadcrumbItems} />
        <CenarioForm empreendimentoId={empreendimentoId} />
      </div>
    )
  }

  // Se não temos um ID de empreendimento, buscar todos os empreendimentos para o usuário selecionar
  const { data: empreendimentos, error } = await supabase.from("empreendimento").select("id, nome").order("nome")

  if (error) {
    console.error("Erro ao buscar empreendimentos:", error)
  }

  // Definir os itens do breadcrumb
  const breadcrumbItems = [{ label: "Cenários", href: "/cenarios" }, { label: "Novo Cenário" }]

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb items={breadcrumbItems} />
      <CenarioForm empreendimentos={empreendimentos || []} />
    </div>
  )
}
