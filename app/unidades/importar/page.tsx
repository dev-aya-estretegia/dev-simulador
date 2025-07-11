import { createClient } from "@/lib/supabase/server"
import { UnidadesImportacao } from "@/components/unidades/unidades-importacao"
import { redirect } from "next/navigation"

export default async function ImportarUnidadesPage() {
  const supabase = createClient()

  const { data: empreendimentos, error } = await supabase
    .from("empreendimento")
    .select("id, nome")
    .order("nome", { ascending: true })

  if (error) {
    console.error("Erro ao buscar empreendimentos:", error)
    // Lidar com o erro, talvez redirecionar ou mostrar uma mensagem
    redirect("/empreendimentos")
  }

  return <UnidadesImportacao empreendimentos={empreendimentos || []} />
}
