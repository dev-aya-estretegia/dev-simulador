import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EmpreendimentoDashboard } from "@/components/empreendimentos/empreendimento-dashboard"

interface EmpreendimentoDashboardPageProps {
  params: {
    id: string
  }
}

export default async function EmpreendimentoDashboardPage({ params }: EmpreendimentoDashboardPageProps) {
  const supabase = createClient()
  // Corrigido: usando o nome da tabela em minúsculas
  const { data: empreendimento, error } = await supabase.from("empreendimento").select("*").eq("id", params.id).single()

  if (error || !empreendimento) {
    notFound()
  }

  return (
    <main className="container mx-auto py-8">
      <EmpreendimentoDashboard empreendimento={empreendimento} />
    </main>
  )
}
