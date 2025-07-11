import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface IndicadorNumericoProps {
  titulo: string
  valor: number
  formatador?: (valor: number) => string
  icone?: ReactNode
  corIcone?: string
  descricao?: string
}

export function IndicadorNumerico({
  titulo,
  valor = 0, // Valor padrão para evitar undefined
  formatador = (valor) => valor.toString(),
  icone,
  corIcone = "text-primary",
  descricao,
}: IndicadorNumericoProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{titulo}</h3>
          {icone && <div className={`${corIcone}`}>{icone}</div>}
        </div>
        <div className="text-2xl font-bold">{formatador(valor)}</div>
        {descricao && <p className="text-xs text-muted-foreground mt-1">{descricao}</p>}
      </CardContent>
    </Card>
  )
}
