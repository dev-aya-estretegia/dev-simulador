"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart } from "@/components/charts/pie-chart"
import { BarChart } from "@/components/charts/bar-chart"
import { DashboardFilters } from "./dashboard-filters"
import { ValoresUnidadesTable } from "./valores-unidades-table"
import { useDashboardCenario } from "@/hooks/use-dashboard-cenario"
import { useValoresUnidades } from "@/hooks/use-valores-unidades"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  Building2,
  Calculator,
  PieChartIcon,
  BarChart3,
  Table,
  FileText,
  Target,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  PercentIcon,
} from "lucide-react"
import { useDetalhamentoCalculo } from "@/hooks/use-detalhamento-calculo"
import { DetalhamentoCalculoTable } from "./detalhamento-calculo-table"
import { Button } from "@/components/ui/button"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { EvolucaoPrecosCards } from "./evolucao-precos-cards"
import { LineChartIcon } from "lucide-react"

export function DashboardOverview() {
  const {
    empreendimentos = [],
    cenarios = [],
    selectedEmpreendimento,
    selectedCenario,
    dashboardData,
    empreendimentoData,
    loading,
    error,
    setSelectedEmpreendimento,
    setSelectedCenario,
    charts,
  } = useDashboardCenario()

  const {
    valoresUnidades = [],
    fases = [],
    loading: loadingValores,
    error: errorValores,
  } = useValoresUnidades(selectedEmpreendimento, selectedCenario)

  // CORREÇÃO: Usar ambos os IDs para filtragem mais precisa
  const {
    detalhamentos = [],
    loading: loadingDetalhamento,
    error: errorDetalhamento,
  } = useDetalhamentoCalculo(selectedEmpreendimento, selectedCenario)

  // Função para formatar moeda
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "R$ 0,00"
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Função para formatar percentual
  const formatPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "0,0%"
    return `${value.toFixed(1)}%`
  }

  // Função para formatar percentual com 3 casas decimais
  const formatPercentage3Decimals = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "0,000%"
    return `${value.toFixed(3).replace(".", ",")} %`
  }

  // Função para formatar percentual com todas as casas decimais
  const formatExactPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "0%"
    return `${value}%`
  }

  // Cálculos para os novos cards
  const metaVGVLiquido = empreendimentoData?.vgv_liquido_alvo || 0
  const percentualPermuta = empreendimentoData?.percentual_permuta || 0
  const fatorLiquido = 1 - percentualPermuta / 100

  // Cálculo dos valores líquidos (descontando permuta)
  const vgvInicialProjetadoLiquido = dashboardData?.vgv_inicial_projetado
    ? dashboardData.vgv_inicial_projetado * fatorLiquido
    : 0

  const vgvFinalProjetadoLiquido = dashboardData?.vgv_final_projetado
    ? dashboardData.vgv_final_projetado * fatorLiquido
    : 0

  // Cálculo do comparativo entre VGV Final Projetado Líquido e Meta de VGV Líquido
  const metaVGVLiquidoCalculado =
    empreendimentoData?.vgv_bruto_alvo && empreendimentoData?.percentual_permuta
      ? empreendimentoData.vgv_bruto_alvo * (1 - empreendimentoData.percentual_permuta / 100)
      : empreendimentoData?.vgv_liquido_alvo || 0

  const comparativoMetaVGV = vgvFinalProjetadoLiquido - metaVGVLiquidoCalculado

  // Função para exportar o dashboard para PDF
  const exportDashboardToPDF = () => {
    // Criar nova instância do jsPDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Configurar cores e estilos
    const primaryColor = "#17c442"
    const darkColor = "#1c1f24"
    const lightColor = "#ffffff"

    // Adicionar cabeçalho
    doc.setFillColor(darkColor)
    doc.rect(0, 0, doc.internal.pageSize.width, 20, "F")

    // Logo e título
    doc.setTextColor(primaryColor)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.text("Simulador de VGV - AYA Estratégia Imobiliária", 15, 8)

    // Data de exportação
    doc.setTextColor(lightColor)
    doc.setFontSize(8)
    const dataAtual = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    doc.text(`Exportado em: ${dataAtual}`, 15, 14)

    // Informações do cenário e empreendimento
    const empreendimentoNome = empreendimentos.find((e) => e.id === selectedEmpreendimento)?.nome || ""
    const cenarioNome = cenarios.find((c) => c.id === selectedCenario)?.nome || ""

    let infoText = "Dashboard Geral"
    if (empreendimentoNome) infoText += ` | Empreendimento: ${empreendimentoNome}`
    if (cenarioNome) infoText += ` | Cenário: ${cenarioNome}`

    doc.text(infoText, doc.internal.pageSize.width - 15, 14, { align: "right" })

    // Posição inicial para o conteúdo
    let yPos = 30

    // Título da seção Indicadores
    doc.setTextColor(primaryColor)
    doc.setFontSize(16)
    doc.text("Indicadores Principais", 15, yPos)
    yPos += 10

    // Tabela de indicadores principais (atualizada com os novos indicadores)
    const indicadoresData = [
      [
        "Meta de VGV Líquido",
        `${formatCurrency(empreendimentoData?.vgv_liquido_alvo)} (${formatCurrency(empreendimentoData?.vgv_bruto_alvo)} - ${formatExactPercentage(empreendimentoData?.percentual_permuta)} de permuta)`,
        "VGV Inicial Projetado Líquido",
        formatCurrency(vgvInicialProjetadoLiquido),
      ],
      [
        "VGV Final Projetado Líquido",
        formatCurrency(vgvFinalProjetadoLiquido),
        "Meta de VGV",
        formatPercentage3Decimals(comparativoMetaVGV),
      ],
    ]

    // Usar autoTable com callback para obter a posição final
    autoTable(doc, {
      startY: yPos,
      body: indicadoresData,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 5,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { fontStyle: "bold", fillColor: [240, 240, 240] },
        1: { halign: "right" },
        2: { fontStyle: "bold", fillColor: [240, 240, 240] },
        3: { halign: "right" },
      },
      margin: { left: 15, right: 15 },
      didDrawPage: (data) => {
        yPos = data.cursor.y + 15 // Atualizar a posição Y com espaçamento
      },
    })

    // Verificar se precisamos adicionar uma nova página
    if (yPos > 180) {
      doc.addPage()
      yPos = 30
    }

    // Título da seção VGV por Tipologia
    doc.setTextColor(primaryColor)
    doc.setFontSize(14)
    doc.text("VGV por Tipologia", 15, yPos)
    yPos += 8

    // Tabela de VGV por Tipologia
    if (charts?.vgvPorTipologia && charts.vgvPorTipologia.length > 0) {
      const vgvTipologiaData = charts.vgvPorTipologia.map((item) => [
        item.name || "Sem nome",
        formatCurrency(item.value),
        item.percentage !== undefined && item.percentage !== null ? `${item.percentage.toFixed(1)}%` : "0.0%",
      ])

      autoTable(doc, {
        startY: yPos,
        head: [["Tipologia", "VGV", "Percentual"]],
        body: vgvTipologiaData,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 4,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: darkColor,
          textColor: lightColor,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { fontStyle: "bold" },
          1: { halign: "right" },
          2: { halign: "right" },
        },
        margin: { left: 15, right: 15 },
        didDrawPage: (data) => {
          yPos = data.cursor.y + 15 // Atualizar a posição Y com espaçamento
        },
      })
    } else {
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(10)
      doc.text("Nenhum dado disponível", 15, yPos)
      yPos += 10
    }

    // Verificar se precisamos adicionar uma nova página
    if (yPos > 180) {
      doc.addPage()
      yPos = 30
    }

    // Título da seção VGV por Fase
    doc.setTextColor(primaryColor)
    doc.setFontSize(14)
    doc.text("VGV por Fase de Venda", 15, yPos)
    yPos += 8

    // Tabela de VGV por Fase
    if (charts?.vgvPorFase && charts.vgvPorFase.length > 0) {
      const vgvFaseData = charts.vgvPorFase.map((item) => [
        item.name || "Sem nome",
        formatCurrency(item.vgv),
        (item.unidades || 0).toString(),
        formatCurrency(item.unidades ? item.vgv / item.unidades : 0),
      ])

      autoTable(doc, {
        startY: yPos,
        head: [["Fase", "VGV", "Unidades", "Média por Unidade"]],
        body: vgvFaseData,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 4,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: darkColor,
          textColor: lightColor,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { fontStyle: "bold" },
          1: { halign: "right" },
          2: { halign: "right" },
          3: { halign: "right" },
        },
        margin: { left: 15, right: 15 },
        didDrawPage: (data) => {
          yPos = data.cursor.y + 15 // Atualizar a posição Y com espaçamento
        },
      })
    } else {
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(10)
      doc.text("Nenhum dado disponível", 15, yPos)
      yPos += 10
    }

    // Verificar se precisamos adicionar uma nova página
    if (yPos > 180) {
      doc.addPage()
      yPos = 30
    }

    // Título da seção Valor Médio/m² por Tipologia
    doc.setTextColor(primaryColor)
    doc.setFontSize(14)
    doc.text("Valor Médio/m² por Tipologia", 15, yPos)
    yPos += 8

    // Tabela de Valor Médio/m² por Tipologia
    if (charts?.valoresMediosPorTipologia && charts.valoresMediosPorTipologia.length > 0) {
      const valoresMediosData = charts.valoresMediosPorTipologia.map((item) => [
        item.name || "Sem nome",
        formatCurrency(item.valor),
      ])

      autoTable(doc, {
        startY: yPos,
        head: [["Tipologia", "Valor Médio/m²"]],
        body: valoresMediosData,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 4,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: darkColor,
          textColor: lightColor,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { fontStyle: "bold" },
          1: { halign: "right" },
        },
        margin: { left: 15, right: 15 },
      })
    } else {
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(10)
      doc.text("Nenhum dado disponível", 15, yPos)
    }

    // Adicionar rodapé em todas as páginas
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      const pageHeight = doc.internal.pageSize.height

      // Adicionar número de página
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 20, pageHeight - 15, { align: "right" })

      // Adicionar rodapé
      doc.setFillColor(darkColor)
      doc.rect(0, pageHeight - 10, doc.internal.pageSize.width, 10, "F")

      doc.setTextColor(lightColor)
      doc.setFontSize(8)
      doc.text("© AYA Estratégia Imobiliária - Simulador de VGV", doc.internal.pageSize.width / 2, pageHeight - 4, {
        align: "center",
      })
    }

    // Salvar o PDF
    doc.save(`dashboard-geral-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  if (error) {
    return (
      <div className="space-y-6">
        <DashboardFilters
          empreendimentos={empreendimentos}
          cenarios={cenarios}
          selectedEmpreendimento={selectedEmpreendimento}
          selectedCenario={selectedCenario}
          onEmpreendimentoChange={setSelectedEmpreendimento}
          onCenarioChange={setSelectedCenario}
          loading={loading}
        />
        <Card className="bg-red-900/20 border-red-800">
          <CardContent className="flex items-center gap-2 p-6">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-400">{typeof error === "string" ? error : "Erro ao carregar dados"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <DashboardFilters
        empreendimentos={empreendimentos}
        cenarios={cenarios}
        selectedEmpreendimento={selectedEmpreendimento}
        selectedCenario={selectedCenario}
        onEmpreendimentoChange={setSelectedEmpreendimento}
        onCenarioChange={setSelectedCenario}
        loading={loading}
      />

      {/* Tabs para alternar entre visões */}
      <Tabs defaultValue="dashboard-geral" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-gray-800 border-gray-700 mb-6">
          <TabsTrigger
            value="dashboard-geral"
            className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
          >
            <PieChartIcon className="h-4 w-4 mr-2" />
            Dashboard Geral
          </TabsTrigger>
          <TabsTrigger
            value="valores-unidades"
            className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
          >
            <Table className="h-4 w-4 mr-2" />
            Valor das Unidades
          </TabsTrigger>
          <TabsTrigger
            value="detalhamento-calculo"
            className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Detalhamento Cálculo
          </TabsTrigger>
          <TabsTrigger
            value="evolucao-precos"
            className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
          >
            <LineChartIcon className="h-4 w-4 mr-2" />
            Evolução de Preços
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo da Tab Dashboard Geral */}
        <TabsContent value="dashboard-geral">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={exportDashboardToPDF}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              disabled={loading || !dashboardData}
            >
              <FileText className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>

          {/* Indicadores Principais (Atualizados) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Meta de VGV Líquido */}
            <Card style={{ backgroundColor: "#1c1f24" }} className="border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Meta de VGV Líquido</CardTitle>
                <Target className="h-4 w-4 text-[#17c442]" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-32 bg-gray-700" />
                ) : (
                  <div className="text-2xl font-bold text-white currency">
                    {formatCurrency(
                      empreendimentoData?.vgv_bruto_alvo && empreendimentoData?.percentual_permuta
                        ? empreendimentoData.vgv_bruto_alvo * (1 - empreendimentoData.percentual_permuta / 100)
                        : empreendimentoData?.vgv_liquido_alvo || 0,
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {formatCurrency(empreendimentoData?.vgv_bruto_alvo)} -{" "}
                  {formatExactPercentage(empreendimentoData?.percentual_permuta)} de permuta
                </p>
              </CardContent>
            </Card>

            {/* Card 2: VGV Inicial Projetado Líquido */}
            <Card style={{ backgroundColor: "#1c1f24" }} className="border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">VGV Inicial Projetado Líquido</CardTitle>
                <ArrowUpDown className="h-4 w-4 text-[#17c442]" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-32 bg-gray-700" />
                ) : (
                  <div className="text-2xl font-bold text-white currency">
                    {formatCurrency(vgvInicialProjetadoLiquido)}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Valor inicial descontando {formatExactPercentage(percentualPermuta)} de permuta
                </p>
              </CardContent>
            </Card>

            {/* Card 3: VGV Final Projetado Líquido */}
            <Card style={{ backgroundColor: "#1c1f24" }} className="border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">VGV Final Projetado Líquido</CardTitle>
                <ArrowUp className="h-4 w-4 text-[#17c442]" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-32 bg-gray-700" />
                ) : (
                  <div className="text-2xl font-bold text-white currency">
                    {formatCurrency(vgvFinalProjetadoLiquido)}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Valor final descontando {formatExactPercentage(percentualPermuta)} de permuta
                </p>
              </CardContent>
            </Card>

            {/* Card 4: Meta de VGV (Comparativo) */}
            <Card style={{ backgroundColor: "#1c1f24" }} className="border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Meta de VGV</CardTitle>
                <PercentIcon className="h-4 w-4 text-[#17c442]" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-24 bg-gray-700" />
                ) : (
                  <div className="text-2xl font-bold flex items-center">
                    {comparativoMetaVGV >= 0 ? (
                      <>
                        <span className="text-green-500 flex items-center">
                          +{formatCurrency(comparativoMetaVGV)}
                          <ArrowUp className="h-5 w-5 ml-1 text-green-500" />
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-red-500 flex items-center">
                          {formatCurrency(comparativoMetaVGV)}
                          <ArrowDown className="h-5 w-5 ml-1 text-red-500" />
                        </span>
                      </>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">Diferença: VGV Final Líquido - Meta</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* VGV por Tipologia */}
            <Card style={{ backgroundColor: "#1c1f24" }} className="border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-[#17c442]" />
                  VGV por Tipologia
                </CardTitle>
                <p className="text-sm text-gray-400">Distribuição do VGV por tipo de unidade</p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[250px] w-full bg-gray-700" />
                ) : charts?.vgvPorTipologia && charts.vgvPorTipologia.length > 0 ? (
                  <PieChart
                    data={charts.vgvPorTipologia}
                    height={250}
                    width={500}
                    showLegend={true}
                    showTooltip={true}
                    showLabels={true}
                  />
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-gray-400">Nenhum dado disponível</div>
                )}
              </CardContent>
            </Card>

            {/* VGV por Fase de Venda */}
            <Card style={{ backgroundColor: "#1c1f24" }} className="border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#17c442]" />
                  VGV por Fase de Venda
                </CardTitle>
                <p className="text-sm text-gray-400">Distribuição do VGV por fase de lançamento</p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[250px] w-full bg-gray-700" />
                ) : charts?.vgvPorFase && charts.vgvPorFase.length > 0 ? (
                  <BarChart
                    data={charts.vgvPorFase.map((item) => ({
                      name: item.name,
                      value: item.vgv,
                    }))}
                    height={250}
                    xAxisKey="name"
                    yAxisKey="value"
                    color="#17c442"
                    formatValue={(value) =>
                      new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(value)
                    }
                  />
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-gray-400">Nenhum dado disponível</div>
                )}
              </CardContent>
            </Card>

            {/* Unidades por Fase */}
            <Card style={{ backgroundColor: "#1c1f24" }} className="border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#17c442]" />
                  Unidades por Fase
                </CardTitle>
                <p className="text-sm text-gray-400">Distribuição de unidades por fase de venda</p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[250px] w-full bg-gray-700" />
                ) : charts?.unidadesPorFase && charts.unidadesPorFase.length > 0 ? (
                  <BarChart
                    data={charts.unidadesPorFase.map((item) => ({
                      name: item.name,
                      value: item.unidades,
                    }))}
                    height={250}
                    xAxisKey="name"
                    yAxisKey="value"
                    color="#17c442"
                    formatValue={(value) => `${value} unidades`}
                  />
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-gray-400">Nenhum dado disponível</div>
                )}
              </CardContent>
            </Card>

            {/* Valor Médio/m² por Tipologia */}
            <Card style={{ backgroundColor: "#1c1f24" }} className="border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[#17c442]" />
                  Valor Médio/m² por Tipologia
                </CardTitle>
                <p className="text-sm text-gray-400">Comparação de valores por tipo de unidade</p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[250px] w-full bg-gray-700" />
                ) : charts?.valoresMediosPorTipologia && charts.valoresMediosPorTipologia.length > 0 ? (
                  <BarChart
                    data={charts.valoresMediosPorTipologia.map((item) => ({
                      name: item.name,
                      value: item.valor,
                    }))}
                    height={250}
                    xAxisKey="name"
                    yAxisKey="value"
                    color="#17c442"
                    formatValue={(value) =>
                      new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(value)
                    }
                  />
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-gray-400">Nenhum dado disponível</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conteúdo da Tab Valores das Unidades */}
        <TabsContent value="valores-unidades">
          <ValoresUnidadesTable
            valoresUnidades={valoresUnidades}
            fases={fases}
            loading={loadingValores}
            error={errorValores}
          />
        </TabsContent>

        {/* Conteúdo da Tab Detalhamento Cálculo */}
        <TabsContent value="detalhamento-calculo">
          <DetalhamentoCalculoTable
            detalhamentos={detalhamentos}
            loading={loadingDetalhamento}
            error={errorDetalhamento}
          />
        </TabsContent>

        {/* Conteúdo da Tab Evolução de Preços */}
        <TabsContent value="evolucao-precos">
          <EvolucaoPrecosCards valoresUnidades={valoresUnidades} fases={fases} loading={loadingValores} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
