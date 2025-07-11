"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Sliders } from "lucide-react"
import type { Cenario } from "@/types/database"

interface ParametrosTableProps {
  cenarios: Cenario[]
  empreendimentoId: number
}

export function ParametrosTable({ cenarios, empreendimentoId }: ParametrosTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parâmetros por Cenário</CardTitle>
        <CardDescription>Selecione um cenário para configurar seus parâmetros de precificação</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cenário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Parâmetros</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cenarios.map((cenario) => (
              <TableRow key={cenario.id}>
                <TableCell className="font-medium">{cenario.nome}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      cenario.status === "Ativo"
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : cenario.status === "Rascunho"
                          ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    }
                  >
                    {cenario.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {cenario.tem_parametros ? (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Configurados
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
                      Não configurados
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/cenarios/${cenario.id}/parametros`} prefetch={false}>
                      <Sliders className="h-4 w-4 mr-2" />
                      Configurar
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
