import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CenarioDetalhes } from "@/components/cenarios/cenario-detalhes"

export default async function CenarioPage({
  params,
}: {
  params: { id: string }
}) {
  console.log("Renderizando página de cenário com ID:", params.id)

  try {
    // Verificar se o ID é válido
    if (!params.id || isNaN(Number(params.id))) {
      console.error("ID de cenário inválido:", params.id)
      return (
        <div className="container mx-auto py-8">
          <Card>
            <CardHeader>
              <CardTitle>ID de cenário inválido</CardTitle>
            </CardHeader>
            <CardContent>
              <p>O ID do cenário fornecido não é válido.</p>
              <Button asChild className="mt-4">
                <Link href="/cenarios">Voltar para Cenários</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    const cenarioId = Number(params.id)
    const supabase = createClient()

    // Buscar dados do cenário
    const { data: cenario, error: cenarioError } = await supabase
      .from("cenario")
      .select("id, nome, descricao, empreendimento_id")
      .eq("id", cenarioId)
      .single()

    if (cenarioError) {
      console.error("Erro ao buscar cenário:", cenarioError)
      return (
        <div className="container mx-auto py-8">
          <Card>
            <CardHeader>
              <CardTitle>Erro ao carregar cenário</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Não foi possível carregar os detalhes do cenário. Erro: {cenarioError.message}</p>
              <Button asChild className="mt-4">
                <Link href="/cenarios">Voltar para Cenários</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    if (!cenario) {
      console.error("Cenário não encontrado")
      notFound()
    }

    // Buscar dados do empreendimento
    const { data: empreendimento, error: empreendimentoError } = await supabase
      .from("empreendimento")
      .select("id, nome, endereco")
      .eq("id", cenario.empreendimento_id)
      .single()

    if (empreendimentoError) {
      console.error("Erro ao buscar empreendimento:", empreendimentoError)
      return (
        <div className="container mx-auto py-8">
          <Card>
            <CardHeader>
              <CardTitle>Erro ao carregar empreendimento</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Não foi possível carregar os detalhes do empreendimento. Erro: {empreendimentoError.message}</p>
              <Button asChild className="mt-4">
                <Link href="/cenarios">Voltar para Cenários</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    // Buscar dados da view dashboard_cenario - CORRIGIDO: removido .single()
    const { data: dashboardDataArray, error: dashboardError } = await supabase
      .from("vw_dashboard_cenario")
      .select("*")
      .eq("cenario_id", cenarioId) // Usando cenario_id em vez de id

    let dashboardData = null
    if (dashboardError) {
      console.error("Erro ao buscar dados do dashboard:", dashboardError)
    } else if (dashboardDataArray && dashboardDataArray.length > 0) {
      // Pegar o primeiro resultado se houver múltiplos
      dashboardData = dashboardDataArray[0]
      console.log("Dados do dashboard encontrados:", dashboardData)
    } else {
      console.log("Nenhum dado de dashboard encontrado para o cenário:", cenarioId)
    }

    // Buscar dados de tipologias
    const { data: unidadesPorTipologia, error: tipologiasError } = await supabase
      .from("valor_unidades_cenario")
      .select(`
        unidade_id,
        valor_unidade_venda,
        unidade:unidade_id (
          tipologia,
          area_privativa
        )
      `)
      .eq("cenario_id", cenarioId)

    if (tipologiasError) {
      console.error("Erro ao buscar dados de tipologias:", tipologiasError)
    }

    // Processar dados de tipologias
    const tipologiasMap = new Map()
    let totalVGV = 0
    let totalUnidades = 0

    if (unidadesPorTipologia) {
      unidadesPorTipologia.forEach((item) => {
        const tipologia = item.unidade?.tipologia || "Desconhecido"
        const valorVenda = item.valor_unidade_venda || 0
        const areaPrivativa = item.unidade?.area_privativa || 0

        totalVGV += valorVenda
        totalUnidades += 1

        if (!tipologiasMap.has(tipologia)) {
          tipologiasMap.set(tipologia, {
            tipologia,
            qtd_unidades: 0,
            vgv_tipologia: 0,
            area_total: 0,
          })
        }

        const tipologiaInfo = tipologiasMap.get(tipologia)
        tipologiaInfo.qtd_unidades += 1
        tipologiaInfo.vgv_tipologia += valorVenda
        tipologiaInfo.area_total += areaPrivativa
      })
    }

    // Calcular percentuais e valores médios
    const tipologiasProcessadas = Array.from(tipologiasMap.values()).map((tipologia) => ({
      tipologia: tipologia.tipologia,
      qtd_unidades: tipologia.qtd_unidades,
      vgv_tipologia: tipologia.vgv_tipologia,
      percentual_do_total: totalVGV > 0 ? tipologia.vgv_tipologia / totalVGV : 0,
      valor_medio_m2: tipologia.area_total > 0 ? tipologia.vgv_tipologia / tipologia.area_total : 0,
    }))

    // Buscar fases do cenário
    const { data: fases, error: fasesError } = await supabase
      .from("fase_venda")
      .select("id, nome, ordem")
      .eq("cenario_id", cenarioId)
      .order("ordem")

    if (fasesError) {
      console.error("Erro ao buscar fases:", fasesError)
    }

    // Buscar unidades alocadas por fase
    const { data: unidadesFases, error: unidadesFasesError } = await supabase
      .from("valor_unidades_cenario")
      .select(`
        fase_unidade_venda,
        valor_unidade_venda
      `)
      .eq("cenario_id", cenarioId)

    if (unidadesFasesError) {
      console.error("Erro ao buscar unidades por fase:", unidadesFasesError)
    }

    // Processar dados de fases
    const fasesMap = new Map()

    // Inicializar o mapa com todas as fases
    if (fases) {
      fases.forEach((fase) => {
        fasesMap.set(fase.nome, {
          fase_nome: fase.nome,
          qtd_unidades: 0,
          vgv_fase: 0,
        })
      })
    }

    // Calcular VGV e quantidade de unidades por fase
    if (unidadesFases) {
      unidadesFases.forEach((unidade) => {
        if (unidade.fase_unidade_venda && fasesMap.has(unidade.fase_unidade_venda)) {
          const fase = fasesMap.get(unidade.fase_unidade_venda)
          fase.vgv_fase += unidade.valor_unidade_venda || 0
          fase.qtd_unidades += 1
        }
      })
    }

    // Calcular percentuais
    const fasesProcessadas = Array.from(fasesMap.values()).map((fase) => ({
      fase_nome: fase.fase_nome,
      qtd_unidades: fase.qtd_unidades,
      vgv_fase: fase.vgv_fase,
      percentual_do_total: totalVGV > 0 ? fase.vgv_fase / totalVGV : 0,
    }))

    // Se não temos dados suficientes, usar valores padrão
    const empreendimentoFormatado = empreendimento || {
      id: cenario.empreendimento_id,
      nome: "Empreendimento não encontrado",
      endereco: "Endereço não disponível",
    }

    return (
      <CenarioDetalhes
        cenario={cenario}
        empreendimento={empreendimentoFormatado}
        dashboardData={dashboardData || undefined}
        unidadesPorTipologia={tipologiasProcessadas}
        vgvPorFase={fasesProcessadas}
      />
    )
  } catch (error) {
    console.error("Erro não tratado:", error)
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Erro inesperado</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Ocorreu um erro inesperado ao carregar o cenário.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Detalhes: {error instanceof Error ? error.message : "Erro desconhecido"}
            </p>
            <Button asChild className="mt-4">
              <Link href="/cenarios">Voltar para Cenários</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
}
