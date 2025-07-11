"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb } from "@/components/shared/breadcrumb"
import { ArrowLeft, Building2, Sliders } from "lucide-react"
import { ParametrosHeader } from "@/components/parametros/parametros-header"
import { ParametrosEmpty } from "@/components/parametros/parametros-empty"
import { ParametrosTable } from "@/components/parametros/parametros-table"
import type { Empreendimento, Cenario } from "@/types/database"

interface ParametrosClientPageProps {
  empreendimento: Empreendimento
  cenarios: Cenario[]
}

export function ParametrosClientPage({ empreendimento, cenarios }: ParametrosClientPageProps) {
  const [activeTab, setActiveTab] = useState<string>("visao-geral")

  const breadcrumbItems = [
    { label: "Empreendimentos", href: "/empreendimentos" },
    { label: empreendimento.nome, href: `/empreendimentos/${empreendimento.id}` },
    { label: "Parâmetros de Precificação", href: `/parametros?empreendimento=${empreendimento.id}` },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/empreendimentos/${empreendimento.id}`}>
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
                <Sliders className="h-3 w-3" />
                Parâmetros de Precificação
              </p>
            </div>
          </div>
          <ParametrosHeader empreendimentoId={empreendimento.id} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-none md:auto-cols-auto">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="cenarios">Cenários</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros de Precificação</CardTitle>
              <CardDescription>
                Configure os parâmetros base e fatores de valorização para precificação das unidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Os parâmetros de precificação são utilizados para calcular o valor inicial das unidades, com base em
                características como tipologia, área, pavimento, orientação solar, entre outros fatores.
              </p>
              <p className="text-muted-foreground mb-4">
                Cada cenário pode ter seus próprios parâmetros, permitindo simular diferentes estratégias de
                precificação para o mesmo empreendimento.
              </p>
              <div className="flex flex-col gap-4 mt-6">
                <h3 className="text-lg font-medium">Principais configurações:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Valores base por m² para cada tipologia (apartamento, studio, comercial)</li>
                  <li>Valores para itens adicionais (vagas, hobby box, suítes)</li>
                  <li>Fatores de valorização por orientação solar, pavimento, vista e outros diferenciais</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cenarios" className="mt-4">
          {cenarios.length > 0 ? (
            <ParametrosTable cenarios={cenarios} empreendimentoId={empreendimento.id} />
          ) : (
            <ParametrosEmpty empreendimentoId={empreendimento.id} />
          )}
        </TabsContent>

        <TabsContent value="historico" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Alterações</CardTitle>
              <CardDescription>Registro de todas as alterações nos parâmetros de precificação</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                O histórico de alterações será implementado em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
