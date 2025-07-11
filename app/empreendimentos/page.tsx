import { createClient } from "@/lib/supabase/server"
import { EmpreendimentosHeader } from "@/components/empreendimentos/empreendimentos-header"
import { EmpreendimentosFilters } from "@/components/empreendimentos/empreendimentos-filters"
import { EmpreendimentosList } from "@/components/empreendimentos/empreendimentos-list"
import { EmpreendimentosEmpty } from "@/components/empreendimentos/empreendimentos-empty"
import { EmpreendimentosSkeleton } from "@/components/empreendimentos/empreendimentos-skeleton"
import { Suspense } from "react"

export default async function EmpreendimentosPage() {
  const supabase = createClient()

  // Corrigido: usando o nome da tabela em minúsculas
  const { data: empreendimentos, error } = await supabase.from("empreendimento").select("*").order("nome")

  if (error) {
    console.error("Erro ao buscar empreendimentos:", error)
  }

  return (
    <main className="container mx-auto py-8 bg-black text-white">
      <EmpreendimentosHeader />
      <EmpreendimentosFilters />
      <Suspense fallback={<EmpreendimentosSkeleton />}>
        {empreendimentos && empreendimentos.length > 0 ? (
          <EmpreendimentosList empreendimentos={empreendimentos} />
        ) : (
          <EmpreendimentosEmpty />
        )}
      </Suspense>
    </main>
  )
}
