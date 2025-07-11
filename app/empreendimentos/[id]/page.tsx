import { createClient } from "@/lib/supabase/server"
import { EmpreendimentoDetalhes } from "@/components/empreendimentos/empreendimento-detalhes"
import { notFound } from "next/navigation"

export default async function EmpreendimentoPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: empreendimento, error } = await supabase.from("empreendimento").select("*").eq("id", params.id).single()

  if (error || !empreendimento) {
    console.error("Erro ao buscar empreendimento:", error)
    notFound()
  }

  return (
    <div className="container py-6 space-y-6">
      <EmpreendimentoDetalhes empreendimento={empreendimento} />
    </div>
  )
}
