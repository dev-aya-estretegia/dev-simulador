"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, ArrowLeft, Edit, BarChart3, Home } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"

interface EmpreendimentoDetalhesProps {
  empreendimento: any
}

export function EmpreendimentoDetalhes({ empreendimento }: EmpreendimentoDetalhesProps) {
  const [activeTab, setActiveTab] = useState("geral")

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/empreendimentos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{empreendimento.nome}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/empreendimentos/${empreendimento.id}/editar`} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/empreendimentos/${empreendimento.id}/dashboard`} className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="cronograma">Cronograma</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Informações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Nome</h3>
                  <p className="text-foreground">{empreendimento.nome}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Empresa</h3>
                  <p className="text-foreground">{empreendimento.empresa || "Não informado"}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Descrição</h3>
                <p className="text-foreground whitespace-pre-wrap">{empreendimento.descricao || "Sem descrição"}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Endereço</h3>
                <p className="text-foreground">{empreendimento.endereco}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Cidade</h3>
                  <p className="text-foreground">{empreendimento.cidade || "Não informado"}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Estado</h3>
                  <p className="text-foreground">{empreendimento.estado || "Não informado"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Informações Financeiras
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">VGV Bruto Alvo</h3>
                  <p className="text-foreground text-lg font-semibold text-primary">
                    {formatCurrency(empreendimento.vgv_bruto_alvo || 0)}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">VGV Líquido Alvo</h3>
                  <p className="text-foreground text-lg font-semibold text-primary">
                    {formatCurrency(empreendimento.vgv_liquido_alvo || 0)}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Percentual de Permuta</h3>
                  <p className="text-foreground text-lg font-semibold">{empreendimento.percentual_permuta || 0}%</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Valor de Permuta</h3>
                  <p className="text-foreground text-lg font-semibold">
                    {formatCurrency(
                      ((empreendimento.vgv_bruto_alvo || 0) * (empreendimento.percentual_permuta || 0)) / 100,
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cronograma" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Cronograma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Data de Lançamento</h3>
                  <p className="text-foreground text-lg">
                    {new Date(empreendimento.data_lancamento).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Data de Entrega</h3>
                  <p className="text-foreground text-lg">
                    {new Date(empreendimento.data_entrega).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Duração do Projeto</h3>
                <p className="text-foreground text-lg">
                  {Math.ceil(
                    (new Date(empreendimento.data_entrega).getTime() -
                      new Date(empreendimento.data_lancamento).getTime()) /
                      (1000 * 60 * 60 * 24 * 30),
                  )}{" "}
                  meses
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
