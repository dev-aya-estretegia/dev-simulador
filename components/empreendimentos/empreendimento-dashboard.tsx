"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { ArrowLeft, Building2, Calendar, MapPin, BarChart3, PieChart, TrendingUp, Download } from "lucide-react"
import { BarChart } from "@/components/charts/bar-chart"
import { PieChart as PieChartComponent } from "@/components/charts/pie-chart"
import { IndicadorNumerico } from "@/components/charts/indicador-numerico"
import type { Empreendimento } from "@/types/database"

interface EmpreendimentoDashboardProps {
  empreendimento: Empreendimento
}

export function EmpreendimentoDashboard({ empreendimento }: EmpreendimentoDashboardProps) {
  const [activeTab, setActiveTab] = useState("visao-geral")

  // Dados de exemplo para os gráficos
  const dadosVGVPorTipologia = [
    { name: "Apartamento", value: 65 },
    { name: "Studio", value: 25 },
    { name: "Comercial", value: 10 },
  ]

  const dadosVGVPorFase = [
    { name: "Fase 1", value: 25000000 },
    { name: "Fase 2", value: 35000000 },
    { name: "Fase 3", value: 45000000 },
  ]

  const dadosVelocidadeVendas = [
    { date: new Date("2023-01-01"), value: 5 },
    { date: new Date("2023-02-01"), value: 8 },
    { date: new Date("2023-03-01"), value: 12 },
    { date: new Date("2023-04-01"), value: 10 },
    { date: new Date("2023-05-01"), value: 15 },
    { date: new Date("2023-06-01"), value: 20 },
  ]

  // Calcular o VGV líquido
  const vgvLiquido = empreendimento.vgv_alvo * (1 - empreendimento.percentual_permuta / 100)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/empreendimentos">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              {empreendimento.nome}
            </h1>
            <p className="text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {empreendimento.endereco}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
          <Button asChild size="sm" className="h-9">
            <Link href={`/empreendimentos/${empreendimento.id}`}>Visualizar Detalhes</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <IndicadorNumerico
          titulo="VGV Bruto"
          valor={empreendimento.vgv_alvo}
          formatador={formatCurrency}
          descricao="Valor Geral de Vendas alvo"
          icone={<BarChart3 className="h-4 w-4" />}
        />

        <IndicadorNumerico
          titulo="VGV Líquido"
          valor={vgvLiquido}
          formatador={formatCurrency}
          descricao={`Após ${empreendimento.percentual_permuta}% de permuta`}
          icone={<TrendingUp className="h-4 w-4" />}
        />

        <IndicadorNumerico
          titulo="Cronograma"
          valor={Math.round(
            ((new Date().getTime() - new Date(empreendimento.data_lancamento).getTime()) /
              (new Date(empreendimento.data_entrega).getTime() - new Date(empreendimento.data_lancamento).getTime())) *
              100,
          )}
          formatador={(valor) => `${valor}%`}
          descricao={`Lançamento: ${new Date(empreendimento.data_lancamento).toLocaleDateString("pt-BR")}`}
          icone={<Calendar className="h-4 w-4" />}
          tendencia={
            new Date() < new Date(empreendimento.data_lancamento)
              ? "neutra"
              : new Date() > new Date(empreendimento.data_entrega)
                ? "positiva"
                : "neutra"
          }
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-none md:auto-cols-auto">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="cenarios">Cenários</TabsTrigger>
          <TabsTrigger value="unidades">Unidades</TabsTrigger>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  VGV por Tipologia
                </CardTitle>
                <CardDescription>Distribuição do VGV por tipo de unidade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <PieChartComponent data={dadosVGVPorTipologia} height={300} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  VGV por Fase
                </CardTitle>
                <CardDescription>Distribuição do VGV por fase de vendas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart data={dadosVGVPorFase} height={300} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumo do Empreendimento</CardTitle>
              <CardDescription>Informações gerais sobre o empreendimento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Informações Básicas</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Nome:</span>
                    <span>{empreendimento.nome}</span>
                    <span className="text-muted-foreground">Endereço:</span>
                    <span>{empreendimento.endereco}</span>
                    <span className="text-muted-foreground">Cidade/UF:</span>
                    <span>
                      {empreendimento.cidade}/{empreendimento.estado}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Financeiro</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">VGV Alvo:</span>
                    <span>{formatCurrency(empreendimento.vgv_alvo)}</span>
                    <span className="text-muted-foreground">Permuta:</span>
                    <span>{formatPercentage(empreendimento.percentual_permuta)}</span>
                    <span className="text-muted-foreground">VGV Líquido:</span>
                    <span>{formatCurrency(vgvLiquido)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Cronograma</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Lançamento:</span>
                    <span>{new Date(empreendimento.data_lancamento).toLocaleDateString("pt-BR")}</span>
                    <span className="text-muted-foreground">Entrega:</span>
                    <span>{new Date(empreendimento.data_entrega).toLocaleDateString("pt-BR")}</span>
                    <span className="text-muted-foreground">Duração:</span>
                    <span>
                      {Math.round(
                        (new Date(empreendimento.data_entrega).getTime() -
                          new Date(empreendimento.data_lancamento).getTime()) /
                          (1000 * 60 * 60 * 24 * 30),
                      )}{" "}
                      meses
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cenarios" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cenários de Precificação</CardTitle>
              <CardDescription>Comparativo entre diferentes cenários de precificação</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Nenhum cenário cadastrado para este empreendimento.
              </p>
              <div className="flex justify-center">
                <Button asChild>
                  <Link href={`/cenarios/novo?empreendimento=${empreendimento.id}`}>Criar Novo Cenário</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unidades" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Unidades do Empreendimento</CardTitle>
              <CardDescription>Visão geral das unidades disponíveis</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Nenhuma unidade cadastrada para este empreendimento.
              </p>
              <div className="flex justify-center">
                <Button asChild>
                  <Link href={`/empreendimentos/${empreendimento.id}/unidades/novo`}>Cadastrar Unidades</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendas" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Vendas</CardTitle>
              <CardDescription>Velocidade de vendas e projeções</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Dados de vendas não disponíveis. Crie um cenário e aloque unidades para visualizar análises de vendas.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
