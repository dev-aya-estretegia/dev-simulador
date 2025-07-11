"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"

interface ParametrosEmptyProps {
  empreendimentoId: number
}

export function ParametrosEmpty({ empreendimentoId }: ParametrosEmptyProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parâmetros por Cenário</CardTitle>
        <CardDescription>Nenhum cenário encontrado para este empreendimento</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          Para configurar parâmetros de precificação, primeiro crie um cenário para este empreendimento.
        </p>
        <Button asChild>
          <Link href={`/cenarios/novo?empreendimento=${empreendimentoId}`}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Criar Novo Cenário
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
