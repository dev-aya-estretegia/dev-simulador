"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface ParametrosHeaderProps {
  empreendimentoId: number
}

export function ParametrosHeader({ empreendimentoId }: ParametrosHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <Button asChild>
        <Link href={`/cenarios/novo?empreendimento=${empreendimentoId}`}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo Cenário
        </Link>
      </Button>
    </div>
  )
}
