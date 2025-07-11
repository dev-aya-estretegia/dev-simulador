"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Settings2, Edit, Calendar, Building2, DollarSign, Layers, Tag, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BarChart } from "@/components/charts/bar-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { LineChart } from "@/components/charts/line-chart"
import { supabase } from "@/lib/supabase/client"
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useFases } from "@/hooks/use-fases"

export interface CenarioDetalhesProps {
  cenario: {
    id: string | number
    nome: string
    descricao?: string
    empreendimento_id: string | number
  }
  empreendimento: {
    id: string | number
    nome: string
    endereco?: string
    vgv_bruto_alvo?: number
    vgv_liquido_alvo?: number
  }
  dashboardData?: any
  unidadesPorTipologia?: Array<{
    tipologia: string
    qtd_unidades: number
    vgv_tipologia: number
    percentual_do_total: number
    valor_medio_m2: number
  }>
  vgvPorFase?: Array<{
    fase_nome: string
    qtd_unidades: number
    vgv_fase: number
    percentual_do_total: number
  }>
}

// Interface atualizada para corresponder exatamente às colunas do banco de dados
interface ParametroPrecificacao {
  id: number
  cenario_id: number
  nome: string
  descricao?: string
  valor_area_privativa_apartamento: number
  valor_area_privativa_studio: number
  valor_area_privativa_comercial: number
  valor_area_garden: number
  valor_vaga_simples: number
  valor_vaga_dupla: number
  valor_vaga_moto: number
  valor_hobby_boxes: number
  valor_suite: number
  created_at?: string
  updated_at?: string
}

interface FatorValorizacao {
  id: number
  parametro_precificacao_id: number
  tipo_fator: string
  valor_referencia: string
  percentual_valorizacao: number
  created_at?: string
  updated_at?: string
}

export function CenarioDetalhes({
  cenario,
  empreendimento,
  dashboardData,
  unidadesPorTipologia = [],
  vgvPorFase = [],
}: CenarioDetalhesProps) {
  const [loading, setLoading] = useState(false)
  const [temParametros, setTemParametros] = useState(false)
  const [parametros, setParametros] = useState<ParametroPrecificacao | null>(null)
  const [fatores, setFatores] = useState<FatorValorizacao[]>([])
  const [loadingParametros, setLoadingParametros] = useState(false)
  const { data: fases = [], isLoading: loadingFases } = useFases(cenario.id)

  // Verificar se o cenário tem parâmetros de precificação e carregar os dados
  useEffect(() => {
    const carregarParametros = async () => {
      setLoadingParametros(true)
      try {
        // Buscar parâmetros de precificação
        const { data: parametrosData, error: parametrosError } = await supabase
          .from("parametro_precificacao")
          .select("*")
          .eq("cenario_id", cenario.id)
          .single()

        if (parametrosError && parametrosError.code !== "PGRST116") {
          console.error("Erro ao buscar parâmetros:", parametrosError)
        }

        const temParametros = !!parametrosData
        setTemParametros(temParametros)
        setParametros(parametrosData)
        console.log("Parâmetros recebidos do banco:", parametrosData)

        // Se tem parâmetros, buscar fatores de valorização
        if (temParametros && parametrosData) {
          const { data: fatoresData, error: fatoresError } = await supabase
            .from("fator_valorizacao")
            .select("*")
            .eq("parametro_precificacao_id", parametrosData.id)
            .order("tipo_fator", { ascending: true })
            .order("valor_referencia", { ascending: true })

          if (fatoresError) {
            console.error("Erro ao buscar fatores de valorização:", fatoresError)
          } else {
            setFatores(fatoresData || [])
          }
        }
      } catch (error) {
        console.error("Erro ao carregar parâmetros:", error)
      } finally {
        setLoadingParametros(false)
      }
    }

    carregarParametros()
  }, [cenario.id])

  // Preparar dados para os gráficos
  const tipologiaChartData = unidadesPorTipologia.map((item) => ({
    name: item.tipologia,
    value: item.qtd_unidades,
  }))

  // Ensure fases is an array before mapping
  const fasesChartData = Array.isArray(fases)
    ? fases.map((item) => ({
        name: item.nome || "Sem nome",
        value: item.vgv_fase || 0,
      }))
    : []

  // Calcular totais
  const totalUnidades = unidadesPorTipologia.reduce((acc, item) => acc + item.qtd_unidades, 0)
  const totalVGV = unidadesPorTipologia.reduce((acc, item) => acc + item.vgv_tipologia, 0)
  const valorMedioM2 =
    unidadesPorTipologia.reduce((acc, item) => acc + item.valor_medio_m2 * item.qtd_unidades, 0) / totalUnidades || 0

  // Dados para o gráfico de evolução (simulado)
  const evolucaoVendas = [
    { name: "Jan", Vendas: 4 },
    { name: "Fev", Vendas: 7 },
    { name: "Mar", Vendas: 5 },
    { name: "Abr", Vendas: 8 },
    { name: "Mai", Vendas: 12 },
    { name: "Jun", Vendas: 10 },
  ]

  // Dados para o gráfico de status (simulado)
  const statusChartData = [
    { name: "Disponível", value: totalUnidades - Math.floor(totalUnidades * 0.3) },
    { name: "Vendido", value: Math.floor(totalUnidades * 0.3) },
  ]

  // Agrupar fatores por tipo
  const fatoresPorTipo = fatores.reduce(
    (acc, fator) => {
      if (!acc[fator.tipo_fator]) {
        acc[fator.tipo_fator] = []
      }
      acc[fator.tipo_fator].push(fator)
      return acc
    },
    {} as Record<string, FatorValorizacao[]>,
  )

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Não definido</Badge>

    switch (status.toLowerCase()) {
      case "ativo":
        return <Badge className="bg-green-500">Ativo</Badge>
      case "inativo":
        return <Badge className="bg-yellow-500">Inativo</Badge>
      case "arquivado":
        return <Badge className="bg-gray-500">Arquivado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Não definido"
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR })
    } catch (error) {
      return "Data inválida"
    }
  }

  // Função para formatar o nome do tipo de fator
  const formatarTipoFator = (tipo: string) => {
    const tipos: Record<string, string> = {
      orientacao_solar: "Orientação Solar",
      pavimento: "Pavimento",
      vista: "Vista",
      bloco: "Bloco",
      posicao: "Posição",
      diferencial: "Diferencial",
    }
    return tipos[tipo] || tipo.charAt(0).toUpperCase() + tipo.slice(1).replace(/_/g, " ")
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{cenario.nome}</h1>
          <p className="text-muted-foreground">{cenario.descricao || "Sem descrição"}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {empreendimento.nome}
            </Badge>
            {/* Removido o badge de status que dependia da coluna status */}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/cenarios/${cenario.id}/editar`} passHref>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Editar Cenário
            </Button>
          </Link>

          <Link href={`/cenarios/${cenario.id}/parametros`} passHref>
            <Button variant={temParametros ? "outline" : "default"} size="sm">
              <Settings2 className="mr-2 h-4 w-4" />
              {temParametros ? "Editar Parâmetros" : "Configurar Parâmetros"}
            </Button>
          </Link>

          <Link href={`/cenarios/${cenario.id}/fases`} passHref>
            <Button variant="outline" size="sm">
              <Layers className="mr-2 h-4 w-4" />
              Fases de Venda
            </Button>
          </Link>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VGV Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalVGV)}</div>
            <p className="text-xs text-muted-foreground">
              {empreendimento.vgv_bruto_alvo
                ? `${((totalVGV / empreendimento.vgv_bruto_alvo) * 100).toFixed(1)}% do alvo (${formatCurrency(
                    empreendimento.vgv_bruto_alvo,
                  )})`
                : "Sem VGV alvo definido"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unidades</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalUnidades)}</div>
            <p className="text-xs text-muted-foreground">
              {statusChartData[1].value} vendidas · {statusChartData[0].value} disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(valorMedioM2)}/m²</div>
            <p className="text-xs text-muted-foreground">Média ponderada por unidade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Endereço</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-medium">{empreendimento.endereco || "Endereço não disponível"}</div>
            <p className="text-xs text-muted-foreground">Localização do empreendimento</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="visao-geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="tipologias">Tipologias</TabsTrigger>
          <TabsTrigger value="fases">Fases de Venda</TabsTrigger>
          <TabsTrigger value="parametros">Parâmetros</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Distribuição por Tipologia</CardTitle>
                <CardDescription>Quantidade de unidades por tipologia</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <BarChart
                  data={tipologiaChartData}
                  index="name"
                  categories={["value"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `${value} unidades`}
                  showLegend={false}
                  showYAxis={false}
                  height="h-[300px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status das Unidades</CardTitle>
                <CardDescription>Disponíveis vs. Vendidas</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={statusChartData}
                  index="name"
                  category="value"
                  valueFormatter={(value) => `${value} unidades`}
                  colors={["blue", "green"]}
                  height="h-[300px]"
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Evolução de Vendas</CardTitle>
                <CardDescription>Histórico de vendas nos últimos meses</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={evolucaoVendas}
                  index="name"
                  categories={["Vendas"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `${value} unidades`}
                  showLegend={true}
                  showYAxis={true}
                  height="h-[300px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Fases</CardTitle>
                <CardDescription>VGV por fase de venda</CardDescription>
              </CardHeader>
              <CardContent>
                {fasesChartData.length > 0 ? (
                  <BarChart
                    data={fasesChartData}
                    index="name"
                    categories={["value"]}
                    colors={["green"]}
                    valueFormatter={(value) => formatCurrency(value)}
                    showLegend={false}
                    showYAxis={false}
                    height="h-[300px]"
                  />
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    {loadingFases ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                        <p>Carregando fases...</p>
                      </div>
                    ) : (
                      <p>Nenhuma fase encontrada</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tipologias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento por Tipologia</CardTitle>
              <CardDescription>Análise detalhada por tipo de unidade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Tipologia</th>
                      <th className="text-right py-3 px-4">Unidades</th>
                      <th className="text-right py-3 px-4">VGV</th>
                      <th className="text-right py-3 px-4">% do Total</th>
                      <th className="text-right py-3 px-4">Valor Médio/m²</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unidadesPorTipologia.map((tipologia, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{tipologia.tipologia}</td>
                        <td className="text-right py-3 px-4">{formatNumber(tipologia.qtd_unidades)}</td>
                        <td className="text-right py-3 px-4">{formatCurrency(tipologia.vgv_tipologia)}</td>
                        <td className="text-right py-3 px-4">
                          {formatPercentage(tipologia.percentual_do_total * 100)}
                        </td>
                        <td className="text-right py-3 px-4">{formatCurrency(tipologia.valor_medio_m2)}/m²</td>
                      </tr>
                    ))}
                    <tr className="bg-muted/20 font-medium">
                      <td className="py-3 px-4">Total</td>
                      <td className="text-right py-3 px-4">{formatNumber(totalUnidades)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(totalVGV)}</td>
                      <td className="text-right py-3 px-4">100%</td>
                      <td className="text-right py-3 px-4">{formatCurrency(valorMedioM2)}/m²</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de VGV por Tipologia</CardTitle>
                <CardDescription>Participação de cada tipologia no VGV total</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={unidadesPorTipologia.map((item) => ({
                    name: item.tipologia,
                    value: item.vgv_tipologia,
                  }))}
                  index="name"
                  category="value"
                  valueFormatter={(value) => formatCurrency(value)}
                  colors={["blue", "green", "yellow", "red", "purple"]}
                  height="h-[300px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Valor Médio por Tipologia</CardTitle>
                <CardDescription>Comparativo de valores por m²</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={unidadesPorTipologia.map((item) => ({
                    name: item.tipologia,
                    "Valor/m²": item.valor_medio_m2,
                  }))}
                  index="name"
                  categories={["Valor/m²"]}
                  colors={["blue"]}
                  valueFormatter={(value) => formatCurrency(value)}
                  showLegend={false}
                  height="h-[300px]"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento por Fase de Venda</CardTitle>
              <CardDescription>Análise detalhada por fase de comercialização</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingFases ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Carregando Fases</h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-md">
                    Aguarde enquanto carregamos as informações das fases de venda.
                  </p>
                </div>
              ) : Array.isArray(fases) && fases.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Fase</th>
                        <th className="text-right py-3 px-4">Unidades</th>
                        <th className="text-right py-3 px-4">VGV</th>
                        <th className="text-right py-3 px-4">% do Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fases.map((fase, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{fase.nome || "Sem nome"}</td>
                          <td className="text-right py-3 px-4">{formatNumber(fase.qtd_unidades || 0)}</td>
                          <td className="text-right py-3 px-4">{formatCurrency(fase.vgv_fase || 0)}</td>
                          <td className="text-right py-3 px-4">
                            {formatPercentage((fase.percentual_do_total || 0) * 100)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-muted/20 font-medium">
                        <td className="py-3 px-4">Total</td>
                        <td className="text-right py-3 px-4">{formatNumber(totalUnidades)}</td>
                        <td className="text-right py-3 px-4">{formatCurrency(totalVGV)}</td>
                        <td className="text-right py-3 px-4">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Layers className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma fase encontrada</h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-md">
                    Este cenário ainda não possui fases de venda configuradas.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href={`/cenarios/${cenario.id}/fases`} passHref>
                <Button>
                  <Layers className="mr-2 h-4 w-4" />
                  Gerenciar Fases de Venda
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição de VGV por Fase</CardTitle>
              <CardDescription>Participação de cada fase no VGV total</CardDescription>
            </CardHeader>
            <CardContent>
              {Array.isArray(fases) && fases.length > 0 ? (
                <PieChart
                  data={fases.map((item) => ({
                    name: item.nome || "Sem nome",
                    value: item.vgv_fase || 0,
                  }))}
                  index="name"
                  category="value"
                  valueFormatter={(value) => formatCurrency(value)}
                  colors={["blue", "green", "yellow", "red", "purple"]}
                  height="h-[300px]"
                />
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  {loadingFases ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin mb-2" />
                      <p>Carregando fases...</p>
                    </div>
                  ) : (
                    <p>Nenhuma fase encontrada</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parametros" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros de Precificação</CardTitle>
              <CardDescription>
                {temParametros
                  ? "Este cenário possui parâmetros de precificação configurados"
                  : "Este cenário ainda não possui parâmetros de precificação configurados"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingParametros ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ) : temParametros && parametros ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Valores Base</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="text-sm text-muted-foreground">Valor m² Apartamento</div>
                          <div className="text-lg font-medium">
                            {formatCurrency(parametros.valor_area_privativa_apartamento || 0)}
                          </div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="text-sm text-muted-foreground">Valor m² Studio</div>
                          <div className="text-lg font-medium">
                            {formatCurrency(parametros.valor_area_privativa_studio || 0)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="text-sm text-muted-foreground">Valor m² Comercial</div>
                          <div className="text-lg font-medium">
                            {formatCurrency(parametros.valor_area_privativa_comercial || 0)}
                          </div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="text-sm text-muted-foreground">Valor Adicional Suíte</div>
                          <div className="text-lg font-medium">{formatCurrency(parametros.valor_suite || 0)}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="text-sm text-muted-foreground">Vaga Simples</div>
                          <div className="text-lg font-medium">
                            {formatCurrency(parametros.valor_vaga_simples || 0)}
                          </div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="text-sm text-muted-foreground">Vaga Dupla</div>
                          <div className="text-lg font-medium">{formatCurrency(parametros.valor_vaga_dupla || 0)}</div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-md">
                          <div className="text-sm text-muted-foreground">Hobby Box</div>
                          <div className="text-lg font-medium">{formatCurrency(parametros.valor_hobby_boxes || 0)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Fatores de Valorização</h3>
                    {Object.keys(fatoresPorTipo).length > 0 ? (
                      <div className="space-y-4">
                        {Object.entries(fatoresPorTipo).map(([tipo, fatores]) => (
                          <div key={tipo}>
                            <h4 className="text-md font-medium mb-2">{formatarTipoFator(tipo)}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {fatores.map((fator) => (
                                <div key={fator.id} className="bg-muted/30 p-3 rounded-md">
                                  <div className="text-sm text-muted-foreground">{fator.valor_referencia}</div>
                                  <div className="text-lg font-medium">
                                    {fator.percentual_valorizacao >= 0 ? "+" : ""}
                                    {formatPercentage(fator.percentual_valorizacao)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-muted/20 p-4 rounded-md text-center">
                        <p className="text-muted-foreground">Nenhum fator de valorização configurado</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center border-t pt-4">
                    <div className="text-sm text-muted-foreground">
                      Última atualização: {formatDate(parametros.updated_at)}
                    </div>
                    <Link href={`/cenarios/${cenario.id}/parametros`} passHref>
                      <Button>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar Parâmetros
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Settings2 className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Parâmetros não configurados</h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-md">
                    Configure os parâmetros de precificação para calcular automaticamente os valores das unidades deste
                    cenário.
                  </p>
                  <Link href={`/cenarios/${cenario.id}/parametros`} passHref>
                    <Button>
                      <Settings2 className="mr-2 h-4 w-4" />
                      Configurar Parâmetros
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
