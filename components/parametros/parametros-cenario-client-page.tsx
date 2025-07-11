"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb } from "@/components/shared/breadcrumb"
import { ArrowLeft, Building2, Sliders } from "lucide-react"
import { ParametrosForm } from "@/components/parametros/parametros-form"
import { FatoresValorizacaoForm } from "@/components/parametros/fatores-valorizacao-form"
import type { Empreendimento, Cenario, ParametroPrecificacao, FatorValorizacao } from "@/types/database"

/**
 * Componente cliente para a página de parâmetros de precificação de um cenário.
 *
 * ANÁLISE SISTÊMICA DOS FORMULÁRIOS:
 *
 * 1. Fluxo de dados:
 *    - Os dados são recebidos do servidor via props (cenario, empreendimento, parametros, fatores)
 *    - Os componentes ParametrosForm e FatoresValorizacaoForm gerenciam a edição e envio dos dados
 *    - Cada formulário usa seu próprio hook para interagir com o banco de dados
 *
 * 2. Verificações necessárias:
 *    - Garantir que os nomes dos campos nos formulários correspondam às colunas do banco
 *    - Verificar se a validação dos dados está correta
 *    - Confirmar que os hooks estão enviando os dados no formato esperado pelo banco
 */
interface ParametrosCenarioClientPageProps {
  cenario: Cenario
  empreendimento: Empreendimento
  parametros: ParametroPrecificacao | null
  fatores: FatorValorizacao[]
}

export function ParametrosCenarioClientPage({
  cenario,
  empreendimento,
  parametros,
  fatores,
}: ParametrosCenarioClientPageProps) {
  const [activeTab, setActiveTab] = useState<string>("valores-base")

  const breadcrumbItems = [
    { label: "Empreendimentos", href: "/empreendimentos" },
    { label: empreendimento.nome, href: `/empreendimentos/${empreendimento.id}` },
    { label: "Cenários", href: `/cenarios?empreendimento=${empreendimento.id}` },
    { label: cenario.nome, href: `/cenarios/${cenario.id}` },
    { label: "Parâmetros de Precificação", href: `/cenarios/${cenario.id}/parametros` },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/cenarios/${cenario.id}`}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Voltar</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                {cenario.nome}
              </h1>
              <p className="text-muted-foreground flex items-center gap-1 mt-1">
                <Sliders className="h-3 w-3" />
                Parâmetros de Precificação
              </p>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full border-b rounded-none justify-start">
          <TabsTrigger
            value="valores-base"
            className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Valores Base
          </TabsTrigger>
          <TabsTrigger
            value="fatores"
            className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Fatores de Valorização
          </TabsTrigger>
        </TabsList>

        <TabsContent value="valores-base" className="mt-6 space-y-4">
          <ParametrosForm cenario={cenario} parametros={parametros} />
        </TabsContent>

        <TabsContent value="fatores" className="mt-6 space-y-4">
          <FatoresValorizacaoForm cenario={cenario} parametros={parametros} fatores={fatores} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
