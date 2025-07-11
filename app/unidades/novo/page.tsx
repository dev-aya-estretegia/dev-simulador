import { createClient } from "@/lib/supabase/server"
import { UnidadeForm } from "@/components/unidades/unidade-form"
import { redirect } from "next/navigation"

export default async function NovaUnidadePage() {
  const supabase = createClient()

  // Obter empreendimentos para o select
  const { data: empreendimentos } = await supabase.from("empreendimento").select("id, nome").order("nome")

  // Obter cenários para o select
  const { data: cenarios } = await supabase.from("CENARIO").select("id, nome, empreendimento_id").order("nome")

  async function handleSubmit(formData: FormData) {
    "use server"

    const supabase = createClient()

    const nome = formData.get("nome") as string
    const empreendimentoId = Number(formData.get("empreendimento_id"))
    const tipologia = formData.get("tipologia") as string
    const pavimento = Number(formData.get("pavimento"))
    const bloco = formData.get("bloco") as string
    const areaPrivativa = Number(formData.get("area_privativa"))
    const areaGarden = formData.get("area_garden") ? Number(formData.get("area_garden")) : null
    const orientacaoSolar = formData.get("orientacao_solar") as string
    const vista = formData.get("vista") as string || null
    const diferencial = formData.get("diferencial") as string || null
    const qtdVagaSimples = Number(formData.get("qtd_vaga_simples") || 0)
    const qtdVagaDuplas = Number(formData.get("qtd_vaga_duplas") || 0)
    const qtdVagaMoto = Number(formData.get("qtd_vaga_moto") || 0)
    const qtdHobbyBoxes = Number(formData.get("qtd_hobby_boxes") || 0)
    const qtdSuite = Number(formData.get("qtd_suite") || 0)

    // Inserir a unidade
    const { data, error } = await supabase
      .from("UNIDADE")
      .insert({
        nome,
        empreendimento_id: empreendimentoId,
        tipologia,
        pavimento,
        bloco,
        area_privativa: areaPrivativa,
        area_garden: areaGarden,
        orientacao_solar: orientacaoSolar,
        vista,
        diferencial,
        qtd_vaga_simples: qtdVagaSimples,
        qtd_vaga_duplas: qtdVagaDuplas,
        qtd_vaga_moto: qtdVagaMoto,
        qtd_hobby_boxes: qtdHobbyBoxes,
        qtd_suite: qtdSuite,
      })
      .select()

    if (error) {
      console.error("Erro ao cadastrar unidade:", error)
      throw new Error("Erro ao cadastrar unidade")
    }

    // Redirecionar para a página de unidades
    redirect("/unidades")
  }

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Nova Unidade</h1>
      <UnidadeForm
        empreendimentos={empreendimentos || []}
        cenarios={cenarios || []}
        handleSubmit={handleSubmit}
      />
    </main>
  )
}
