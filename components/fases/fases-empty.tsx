"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

type Props = {
  onCreateFase: () => void
}

export function FasesEmpty({ onCreateFase }: Props) {
  return (
    <div className="flex h-[400px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <h3 className="mt-4 text-lg font-semibold">Nenhuma fase cadastrada</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Este cenário ainda não possui fases de venda cadastradas. Crie a primeira fase para começar a alocar unidades.
        </p>
        <Button onClick={onCreateFase}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Fase
        </Button>
      </div>
    </div>
  )
}
