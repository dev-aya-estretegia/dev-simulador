"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface UnidadesDetalhamentoTableProps {
  detalhamento: any[]
}

export function UnidadesDetalhamentoTable({ detalhamento }: UnidadesDetalhamentoTableProps) {
  if (detalhamento.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Nenhum detalhamento de cálculo disponível.</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Resumo */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>Total de unidades: {detalhamento.length}</span>
        <span>
          VGV Total:{" "}
          {formatCurrency(detalhamento.reduce((sum, item) => sum + Number(item.valor_unidade_inicial || 0), 0))}
        </span>
        <span>
          Valor médio:{" "}
          {formatCurrency(
            detalhamento.reduce((sum, item) => sum + Number(item.valor_unidade_inicial || 0), 0) / detalhamento.length,
          )}
        </span>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Unidade</TableHead>
              <TableHead>Tipologia</TableHead>
              <TableHead>Área Privativa (m²)</TableHead>
              <TableHead>Área Garden (m²)</TableHead>
              <TableHead>Valor m² Tipologia</TableHead>
              <TableHead>Valor Base</TableHead>
              <TableHead>Fatores de Valorização</TableHead>
              <TableHead>Adicionais</TableHead>
              <TableHead className="min-w-[140px]">Valor Final</TableHead>
              <TableHead>Cenário</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detalhamento.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold">{item.unidade}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.bloco && `Bloco ${item.bloco}`}
                      {item.pavimento && ` • ${item.pavimento}º Pav`}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.tipologia}</Badge>
                </TableCell>
                <TableCell>{Number(item.area_privativa).toFixed(2)}</TableCell>
                <TableCell>{Number(item.area_garden || 0).toFixed(2)}</TableCell>
                <TableCell>{formatCurrency(Number(item.valor_m2_tipologia || 0))}</TableCell>
                <TableCell>{formatCurrency(Number(item.valor_unidade_base || 0))}</TableCell>
                <TableCell>
                  <div className="space-y-1 text-xs">
                    {Number(item.percentual_orientacao || 0) !== 0 && (
                      <div>Orientação: {formatPercentage(Number(item.percentual_orientacao))}</div>
                    )}
                    {Number(item.percentual_pavimento || 0) !== 0 && (
                      <div>Pavimento: {formatPercentage(Number(item.percentual_pavimento))}</div>
                    )}
                    {Number(item.percentual_vista || 0) !== 0 && (
                      <div>Vista: {formatPercentage(Number(item.percentual_vista))}</div>
                    )}
                    {Number(item.percentual_diferencial || 0) !== 0 && (
                      <div>Diferencial: {formatPercentage(Number(item.percentual_diferencial))}</div>
                    )}
                    {Number(item.percentual_bloco || 0) !== 0 && (
                      <div>Bloco: {formatPercentage(Number(item.percentual_bloco))}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-xs">
                    {Number(item.valor_vagas_simples || 0) > 0 && (
                      <div>Vagas: {formatCurrency(Number(item.valor_vagas_simples))}</div>
                    )}
                    {Number(item.valor_vagas_duplas || 0) > 0 && (
                      <div>V. Duplas: {formatCurrency(Number(item.valor_vagas_duplas))}</div>
                    )}
                    {Number(item.valor_hobby_boxes_total || 0) > 0 && (
                      <div>Hobby Box: {formatCurrency(Number(item.valor_hobby_boxes_total))}</div>
                    )}
                    {Number(item.valor_suites_total || 0) > 0 && (
                      <div>Suítes: {formatCurrency(Number(item.valor_suites_total))}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-green-600">
                  {formatCurrency(Number(item.valor_unidade_inicial || 0))}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.cenario}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
