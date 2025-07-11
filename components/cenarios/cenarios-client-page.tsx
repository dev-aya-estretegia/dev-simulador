"use client"

import { CenariosEmpty } from "./cenarios-empty"
import { CenariosHeader } from "./cenarios-header"
import { CenariosFilters } from "./cenarios-filters"

interface CenariosClientPageProps {
  empreendimentoId?: number
}

export function CenariosClientPage({ empreendimentoId }: CenariosClientPageProps) {
  return (
    <div className="container mx-auto py-8">
      <CenariosHeader empreendimentoId={empreendimentoId} />
      <CenariosFilters />
      <CenariosEmpty empreendimentoId={empreendimentoId} />
    </div>
  )
}
