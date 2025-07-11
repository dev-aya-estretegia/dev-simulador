"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Building2, MoreVertical, Edit, Trash, Eye, BarChart3, Home, LineChart } from "lucide-react"
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog"
import { useState } from "react"
import type { Empreendimento } from "@/types/database"

interface EmpreendimentosListProps {
  empreendimentos: Empreendimento[]
}

export function EmpreendimentosList({ empreendimentos }: EmpreendimentosListProps) {
  const [empreendimentoParaExcluir, setEmpreendimentoParaExcluir] = useState<number | null>(null)

  function getStatusBadge(dataLancamento: string, dataEntrega: string) {
    const hoje = new Date()
    const lancamento = new Date(dataLancamento)
    const entrega = new Date(dataEntrega)

    if (hoje < lancamento) {
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          Pré-lançamento
        </Badge>
      )
    } else if (hoje >= lancamento && hoje <= entrega) {
      return (
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          Em construção
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
          Concluído
        </Badge>
      )
    }
  }

  async function excluirEmpreendimento(id: number) {
    // Implementar lógica de exclusão
    console.log(`Excluindo empreendimento ${id}`)
    // Após excluir, recarregar a página
    window.location.reload()
    setEmpreendimentoParaExcluir(null)
  }

  if (!empreendimentos?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Nenhum empreendimento encontrado</p>
        <Button asChild>
          <Link href="/empreendimentos/novo">Cadastrar Empreendimento</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {empreendimentos.map((empreendimento) => (
          <Card
            key={empreendimento.id}
            className="border-border bg-card overflow-hidden transition-all hover:shadow-md hover:shadow-primary/10"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">{empreendimento.nome}</CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/empreendimentos/${empreendimento.id}`} className="flex items-center cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Visualizar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/empreendimentos/${empreendimento.id}/editar`}
                        className="flex items-center cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/empreendimentos/${empreendimento.id}/dashboard`}
                        className="flex items-center cursor-pointer"
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/unidades?empreendimento=${empreendimento.id}`}
                        className="flex items-center cursor-pointer"
                      >
                        <Home className="mr-2 h-4 w-4" />
                        <span>Unidades</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/cenarios?empreendimento=${empreendimento.id}`}
                        className="flex items-center cursor-pointer"
                      >
                        <LineChart className="mr-2 h-4 w-4" />
                        <span>Cenários</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={() => setEmpreendimentoParaExcluir(empreendimento.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Excluir</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2">
                <CardDescription className="flex-1">{empreendimento.endereco}</CardDescription>
                {getStatusBadge(empreendimento.data_lancamento, empreendimento.data_entrega)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VGV Bruto:</span>
                  <span className="text-primary">{formatCurrency(empreendimento.vgv_bruto_alvo)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VGV Alvo:</span>
                  <span className="text-primary">{formatCurrency(empreendimento.vgv_liquido_alvo)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Permuta:</span>
                  <span className="text-primary">{empreendimento.percentual_permuta}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lançamento:</span>
                  <span className="text-primary">
                    {new Date(empreendimento.data_lancamento).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <Button
                  asChild
                  className="mt-4 w-full bg-primary text-foreground hover:bg-primary/90 transition-colors"
                >
                  <Link
                    href={`/empreendimentos/${empreendimento.id}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4 text-white" />
                    <span className="text-white">Visualizar</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="mt-2 w-full border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                >
                  <Link
                    href={`/unidades?empreendimento=${empreendimento.id}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    <span>Gerenciar Unidades</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="mt-2 w-full border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                >
                  <Link
                    href={`/cenarios?empreendimento=${empreendimento.id}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <LineChart className="h-4 w-4" />
                    <span>Cenários</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmationDialog
        open={empreendimentoParaExcluir !== null}
        onOpenChange={() => setEmpreendimentoParaExcluir(null)}
        title="Excluir empreendimento"
        description="Tem certeza que deseja excluir este empreendimento? Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos."
        actionLabel="Excluir"
        actionVariant="destructive"
        onAction={() => empreendimentoParaExcluir && excluirEmpreendimento(empreendimentoParaExcluir)}
      />
    </>
  )
}
