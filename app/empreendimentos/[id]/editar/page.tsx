import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EmpreendimentoForm } from "@/components/empreendimentos/empreendimento-form"

interface EditarEmpreendimentoPageProps {
  params: {
    id: string
  }
}

export default async function EditarEmpreendimentoPage({ params }: EditarEmpreendimentoPageProps) {
  const supabase = createClient()
  // Corrigido: usando o nome da tabela em minúsculas
  const { data: empreendimento, error } = await supabase.from("empreendimento").select("*").eq("id", params.id).single()

  if (error || !empreendimento) {
    notFound()
  }

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Editar Empreendimento</h1>
      <EmpreendimentoForm empreendimento={empreendimento} />
    </main>
  )
}
