"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Clock } from "lucide-react"

interface ParametrosHistoricoProps {
  cenarioId: number
}

export function ParametrosHistorico({ cenarioId }: ParametrosHistoricoProps) {
  // Dados de exemplo para o histórico
  const historicoAlteracoes = [
    {
      id: 1,
      data: new Date(2023, 5, 15, 14, 30),
      usuario: "João Silva",
      tipo: "Parâmetro Base",
      campo: "valor_m2_apartamento",
      valorAnterior: 8500,
      valorNovo: 9000,
    },
    {
      id: 2,
      data: new Date(2023, 5, 15, 14, 32),
      usuario: "João Silva",
      tipo: "Parâmetro Base",
      campo: "valor_m2_studio",
      valorAnterior: 9200,
      valorNovo: 9800,
    },
    {
      id: 3,
      data: new Date(2023, 6, 2, 10, 15),
      usuario: "Maria Oliveira",
      tipo: "Fator Valorização",
      campo: "Orientação Solar - Norte",
      valorAnterior: "5%",
      valorNovo: "8%",
    },
    {
      id: 4,
      data: new Date(2023, 6, 10, 16, 45),
      usuario: "Carlos Mendes",
      tipo: "Parâmetro Base",
      campo: "valor_vaga_dupla",
      valorAnterior: 80000,
      valorNovo: 85000,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Alterações</CardTitle>
        <CardDescription>Registro de todas as alterações nos parâmetros de precificação</CardDescription>
      </CardHeader>
      <CardContent>
        {historicoAlteracoes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Campo</TableHead>
                <TableHead>Valor Anterior</TableHead>
                <TableHead>Valor Novo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historicoAlteracoes.map((alteracao) => (
                <TableRow key={alteracao.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{alteracao.data.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>{alteracao.usuario}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        alteracao.tipo === "Parâmetro Base"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          : "bg-purple-500/10 text-purple-500 border-purple-500/20"
                      }
                    >
                      {alteracao.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>{alteracao.campo}</TableCell>
                  <TableCell>
                    {typeof alteracao.valorAnterior === "number"
                      ? formatCurrency(alteracao.valorAnterior)
                      : alteracao.valorAnterior}
                  </TableCell>
                  <TableCell>
                    {typeof alteracao.valorNovo === "number"
                      ? formatCurrency(alteracao.valorNovo)
                      : alteracao.valorNovo}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center py-8 text-muted-foreground">Nenhuma alteração registrada para este cenário.</p>
        )}
      </CardContent>
    </Card>
  )
}
