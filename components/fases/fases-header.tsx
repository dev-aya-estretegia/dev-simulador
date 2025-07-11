"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/shared/breadcrumb"

type Props = {
  cenario: {
    id: number | string
    nome: string
    empreendimento_id: number | string
    empreendimento?: {
      id: number | string
      nome: string
    }
  }
  onCreateFase: () => void
}

export function FasesHeader({ cenario, onCreateFase }: Props) {
  const breadcrumbItems = [
    { label: "Início", href: "/" },
    { label: "Cenários", href: "/cenarios" },
    {
      label: cenario.nome,
      href: `/cenarios/${cenario.id}`,
    },
    { label: "Fases de Venda", href: `/cenarios/${cenario.id}/fases` },
  ]

  return (
    <div className="flex flex-col space-y-4">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fases de Venda</h1>
          <p className="text-muted-foreground">Gerencie as fases de venda para o cenário {cenario.nome}</p>
        </div>
        <Button onClick={onCreateFase}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Fase
        </Button>
      </div>
    </div>
  )
}
