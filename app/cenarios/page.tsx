import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Metadata } from "next"
import { CenariosClientPage } from "@/components/cenarios/cenarios-client-page"
import { formatarMoeda } from "@/lib/utils"
import { BarChart3, LineChart, PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Cenários | Simulador AYA",
  description: "Gerencie os cenários de precificação para seus empreendimentos",
}

export default async function CenariosPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()

  // Obter o ID do empreendimento da query string
  const empreendimentoId = searchParams.empreendimento
    ? Number.parseInt(searchParams.empreendimento as string, 10)
    : undefined

  try {
    // Buscar cenários e empreendimentos em uma única consulta
    let query = supabase.from("cenario").select(`
        id, 
        nome, 
        descricao, 
        empreendimento_id,
        empreendimento:empreendimento_id (id, nome)
      `)

    // Filtrar por empreendimento se o ID estiver presente
    if (empreendimentoId) {
      query = query.eq("empreendimento_id", empreendimentoId)
    }

    const { data: cenarios, error } = await query.order("nome")

    if (error) {
      console.error("Erro ao buscar cenários:", error)
      return <CenariosClientPage empreendimentoId={empreendimentoId} />
    }

    // Buscar dados adicionais da view vw_dashboard_cenario
    const { data: dashboardData, error: dashboardError } = await supabase
      .from("vw_dashboard_cenario")
      .select("id, vgv_final_projetado, diferenca_percentual, total_unidades")

    if (dashboardError) {
      console.error("Erro ao buscar dados do dashboard:", dashboardError)
    }

    // Criar um mapa dos dados do dashboard para fácil acesso
    const dashboardMap = new Map()
    if (dashboardData && !dashboardError) {
      dashboardData.forEach((item) => {
        dashboardMap.set(item.id, item)
      })
    }

    // Buscar o nome do empreendimento se estiver filtrando por um empreendimento específico
    let empreendimentoNome = ""
    let empreendimentoDetalhes = null
    if (empreendimentoId) {
      const { data: empreendimento } = await supabase
        .from("empreendimento")
        .select("*")
        .eq("id", empreendimentoId)
        .single()

      if (empreendimento) {
        empreendimentoNome = empreendimento.nome
        empreendimentoDetalhes = empreendimento
      }
    }

    // Formatar os dados dos cenários
    const cenariosFormatados =
      cenarios?.map((cenario) => {
        const dashboardInfo = dashboardMap.get(cenario.id)
        return {
          id: cenario.id,
          nome: cenario.nome,
          descricao: cenario.descricao,
          vgv_projetado: dashboardInfo?.vgv_final_projetado || null,
          diferenca_percentual: dashboardInfo?.diferenca_percentual || 0,
          total_unidades: dashboardInfo?.total_unidades || 0,
          empreendimento_id: cenario.empreendimento_id,
          empreendimento_nome: cenario.empreendimento?.nome || "Desconhecido",
        }
      }) || []

    // Definir os itens do breadcrumb
    const breadcrumbItems = empreendimentoId
      ? [
          { label: "Empreendimentos", href: "/empreendimentos" },
          { label: empreendimentoNome, href: `/empreendimentos/${empreendimentoId}` },
          { label: "Cenários" },
        ]
      : [{ label: "Cenários" }]

    return (
      <div className="container mx-auto py-8">
        {/* Breadcrumb e cabeçalho omitidos para brevidade */}

        {/* Detalhes do empreendimento omitidos para brevidade */}

        {cenariosFormatados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cenariosFormatados.map((cenario) => (
              <Card key={cenario.id} className="border-border bg-card hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{cenario.nome}</CardTitle>
                    <LineChart className="h-5 w-5 text-primary" />
                  </div>
                  {!empreendimentoId && (
                    <CardDescription>
                      Empreendimento:{" "}
                      <Link href={`/empreendimentos/${cenario.empreendimento_id}`} className="hover:underline">
                        {cenario.empreendimento_nome}
                      </Link>
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3 py-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">VGV Projetado:</span>
                      <span className="font-medium">
                        {cenario.vgv_projetado ? formatarMoeda(cenario.vgv_projetado) : "Não calculado"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Unidades:</span>
                      <span className="font-medium">{cenario.total_unidades}</span>
                    </div>
                    {cenario.diferenca_percentual !== 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Incremento:</span>
                        <span
                          className={`font-medium ${cenario.diferenca_percentual > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {cenario.diferenca_percentual > 0 ? "+" : ""}
                          {cenario.diferenca_percentual.toFixed(2)}%
                        </span>
                      </div>
                    )}
                  </div>
                  {cenario.descricao && (
                    <div className="mt-2 text-sm text-muted-foreground line-clamp-2">{cenario.descricao}</div>
                  )}
                </CardContent>
                <CardFooter className="flex gap-2 pt-2">
                  <Button asChild className="w-full">
                    <Link href={`/cenarios/${cenario.id}`}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Visualizar
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Nenhum cenário encontrado</h3>
            <p className="text-muted-foreground mb-6">
              {empreendimentoId
                ? "Este empreendimento ainda não possui cenários de precificação."
                : "Não há cenários cadastrados no sistema."}
            </p>
            <Button asChild>
              <Link href={empreendimentoId ? `/cenarios/novo?empreendimento=${empreendimentoId}` : "/cenarios/novo"}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Criar Primeiro Cenário
              </Link>
            </Button>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Erro não tratado:", error)
    return <CenariosClientPage empreendimentoId={empreendimentoId} />
  }
}
