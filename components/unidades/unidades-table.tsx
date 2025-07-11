"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { Eye, Edit, MoreVertical, Calculator, Trash } from "lucide-react"
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog"
import { supabase } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"

interface UnidadesTableProps {
  unidades: any[]
  onSelecaoChange: (ids: string[]) => void
  selectedUnidades: string[]
}

export function UnidadesTable({ unidades, onSelecaoChange, selectedUnidades }: UnidadesTableProps) {
  const [unidadeParaExcluir, setUnidadeParaExcluir] = useState<string | null>(null)

  function toggleSelectAll() {
    if (selectedUnidades.length === unidades.length) {
      onSelecaoChange([])
    } else {
      onSelecaoChange(unidades.map((u) => u.unidade_nome))
    }
  }

  function toggleSelectUnidade(unidadeNome: string) {
    if (selectedUnidades.includes(unidadeNome)) {
      onSelecaoChange(selectedUnidades.filter((id) => id !== unidadeNome))
    } else {
      onSelecaoChange([...selectedUnidades, unidadeNome])
    }
  }

  async function excluirUnidade(unidadeNome: string) {
    try {
      // Aqui precisamos obter o ID da unidade a partir do nome
      const { data: unidade, error: findError } = await supabase
        .from("UNIDADE")
        .select("id")
        .eq("nome", unidadeNome)
        .single()

      if (findError) throw findError

      const { error } = await supabase.from("UNIDADE").delete().eq("id", unidade.id)

      if (error) throw error

      toast({
        title: "Unidade excluída",
        description: "A unidade foi excluída com sucesso.",
      })

      // Atualizar a lista (recarregar a página)
      window.location.reload()
    } catch (error) {
      console.error("Erro ao excluir unidade:", error)
      toast({
        title: "Erro ao excluir unidade",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setUnidadeParaExcluir(null)
    }
  }

  async function recalcularValor(unidadeNome: string, cenarioNome: string) {
    try {
      // Aqui precisamos obter os IDs da unidade e do cenário a partir dos nomes
      const { data: unidade, error: findUnidadeError } = await supabase
        .from("UNIDADE")
        .select("id")
        .eq("nome", unidadeNome)
        .single()

      if (findUnidadeError) throw findUnidadeError

      const { data: cenario, error: findCenarioError } = await supabase
        .from("CENARIO")
        .select("id")
        .eq("nome", cenarioNome)
        .single()

      if (findCenarioError) throw findCenarioError

      const { error } = await supabase.rpc("fn_calcular_valor_inicial_unidade", {
        p_unidade_id: unidade.id,
        p_cenario_id: cenario.id,
      })

      if (error) throw error

      toast({
        title: "Valor recalculado",
        description: "O valor da unidade foi recalculado com sucesso.",
      })

      // Atualizar a lista (recarregar a página)
      window.location.reload()
    } catch (error) {
      console.error("Erro ao recalcular valor:", error)
      toast({
        title: "Erro ao recalcular valor",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedUnidades.length === unidades.length && unidades.length > 0}
                onCheckedChange={toggleSelectAll}
                aria-label="Selecionar todas as unidades"
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Pavimento</TableHead>
            <TableHead>Bloco</TableHead>
            <TableHead>Tipologia</TableHead>
            <TableHead>Área Privativa</TableHead>
            <TableHead>Área Garden</TableHead>
            <TableHead>Vagas Simples</TableHead>
            <TableHead>Vagas Duplas</TableHead>
            <TableHead>Vagas Moto</TableHead>
            <TableHead>Hobby Boxes</TableHead>
            <TableHead>Suítes</TableHead>
            <TableHead>Orientação Solar</TableHead>
            <TableHead>Vista</TableHead>
            <TableHead>Diferencial</TableHead>
            <TableHead>Valor Inicial</TableHead>
            <TableHead>Fase 1</TableHead>
            <TableHead>Fase 2</TableHead>
            <TableHead>Fase 3</TableHead>
            <TableHead>Fase 4</TableHead>
            <TableHead>Fase 5</TableHead>
            <TableHead>Fase Alocada</TableHead>
            <TableHead>Valor Venda</TableHead>
            <TableHead>Cenário</TableHead>
            <TableHead>Empreendimento</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {unidades.map((unidade) => (
            <TableRow key={unidade.unidade_id || unidade.unidade_nome}>
              <TableCell>
                <Checkbox
                  checked={selectedUnidades.includes(unidade.unidade_nome)}
                  onCheckedChange={() => toggleSelectUnidade(unidade.unidade_nome)}
                  aria-label={`Selecionar unidade ${unidade.unidade_nome}`}
                />
              </TableCell>
              <TableCell>{unidade.unidade_id}</TableCell>
              <TableCell className="font-medium">{unidade.unidade_nome}</TableCell>
              <TableCell>{unidade.pavimento}</TableCell>
              <TableCell>{unidade.bloco}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    unidade.tipologia === "Apartamento"
                      ? "bg-primary/10 text-primary border-primary/20"
                      : unidade.tipologia === "Studio"
                        ? "bg-secondary/10 text-secondary border-secondary/20"
                        : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  }
                >
                  {unidade.tipologia}
                </Badge>
              </TableCell>
              <TableCell>{Number(unidade.area_privativa).toFixed(2)}</TableCell>
              <TableCell>{Number(unidade.area_garden || 0).toFixed(2)}</TableCell>
              <TableCell>{unidade.qtd_vaga_simples}</TableCell>
              <TableCell>{unidade.qtd_vaga_duplas}</TableCell>
              <TableCell>{unidade.qtd_vaga_moto}</TableCell>
              <TableCell>{unidade.qtd_hobby_boxes}</TableCell>
              <TableCell>{unidade.qtd_suite}</TableCell>
              <TableCell>{unidade.orientacao_solar}</TableCell>
              <TableCell>{unidade.vista}</TableCell>
              <TableCell>{unidade.diferencial}</TableCell>
              <TableCell>{formatCurrency(Number(unidade.valor_unidade_inicial))}</TableCell>
              <TableCell>{formatCurrency(Number(unidade.valor_unidade_fase_1 || 0))}</TableCell>
              <TableCell>{formatCurrency(Number(unidade.valor_unidade_fase_2 || 0))}</TableCell>
              <TableCell>{formatCurrency(Number(unidade.valor_unidade_fase_3 || 0))}</TableCell>
              <TableCell>{formatCurrency(Number(unidade.valor_unidade_fase_4 || 0))}</TableCell>
              <TableCell>{formatCurrency(Number(unidade.valor_unidade_fase_5 || 0))}</TableCell>
              <TableCell>
                {unidade.fase_unidade_venda ? (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {unidade.fase_unidade_venda}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">Não alocada</span>
                )}
              </TableCell>
              <TableCell>{formatCurrency(Number(unidade.valor_unidade_venda))}</TableCell>
              <TableCell>{unidade.cenario_nome}</TableCell>
              <TableCell>{unidade.empreendimento_nome}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/unidades/${unidade.unidade_nome}?cenario=${unidade.cenario_nome}`}
                        className="flex items-center cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Visualizar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/unidades/${unidade.unidade_nome}/editar?cenario=${unidade.cenario_nome}`}
                        className="flex items-center cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => recalcularValor(unidade.unidade_nome, unidade.cenario_nome)}
                      className="flex items-center cursor-pointer"
                    >
                      <Calculator className="mr-2 h-4 w-4" />
                      <span>Recalcular Valor</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setUnidadeParaExcluir(unidade.unidade_nome)}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Excluir</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmationDialog
        open={unidadeParaExcluir !== null}
        onOpenChange={() => setUnidadeParaExcluir(null)}
        title="Excluir unidade"
        description="Tem certeza que deseja excluir esta unidade? Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos."
        actionLabel="Excluir"
        actionVariant="destructive"
        onAction={() => unidadeParaExcluir && excluirUnidade(unidadeParaExcluir)}
      />
    </div>
  )
}
