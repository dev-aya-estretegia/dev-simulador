"use client"

import { useUnidades } from "@/hooks"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"

interface UnidadesTableProps {
  cenarioId: number
}

export function UnidadesTable({ cenarioId }: UnidadesTableProps) {
  const { data: unidades, isLoading, error } = useUnidades({ cenarioId })

  if (isLoading) {
    return <div>Carregando unidades...</div>
  }

  if (error) {
    return <div>Erro ao carregar unidades: {error.message}</div>
  }

  if (!unidades?.length) {
    return <div>Nenhuma unidade encontrada para este cenário.</div>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Unidade</TableHead>
            <TableHead>Pavimento</TableHead>
            <TableHead>Bloco</TableHead>
            <TableHead>Tipologia</TableHead>
            <TableHead>Área (m²)</TableHead>
            <TableHead>Valor Inicial</TableHead>
            <TableHead>Fase</TableHead>
            <TableHead>Valor Venda</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {unidades.map((unidade) => (
            <TableRow key={`${unidade.unidade_id}-${unidade.cenario_id}`}>
              <TableCell>{unidade.unidade_nome}</TableCell>
              <TableCell>{unidade.pavimento}</TableCell>
              <TableCell>{unidade.bloco}</TableCell>
              <TableCell>{unidade.tipologia}</TableCell>
              <TableCell>{unidade.area_privativa}</TableCell>
              <TableCell>{formatCurrency(unidade.valor_unidade_inicial)}</TableCell>
              <TableCell>{unidade.fase_unidade_venda || "Não alocada"}</TableCell>
              <TableCell>{formatCurrency(unidade.valor_unidade_venda)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
