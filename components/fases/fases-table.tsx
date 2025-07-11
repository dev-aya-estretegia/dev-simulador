"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog"
import { Edit, MoreHorizontal, Trash2, Users } from "lucide-react"
import { type Fase, useFaseOperations } from "@/hooks/use-fases"
import { formatCurrency } from "@/lib/utils"

type Props = {
  fases: Fase[]
  onEditFase: (faseId: number) => void
  onAllocateUnits: (faseId: number) => void
  onFasesChange: () => void
}

export function FasesTable({ fases, onEditFase, onAllocateUnits, onFasesChange }: Props) {
  const { excluirFase, isLoading } = useFaseOperations()
  const [faseToDelete, setFaseToDelete] = useState<number | null>(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const handleDeleteClick = (faseId: number) => {
    setFaseToDelete(faseId)
    setShowDeleteConfirmation(true)
  }

  const handleDeleteConfirm = async () => {
    if (faseToDelete) {
      await excluirFase(faseToDelete)
      setShowDeleteConfirmation(false)
      setFaseToDelete(null)
      onFasesChange()
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false)
    setFaseToDelete(null)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Ordem</TableHead>
              <TableHead>Reajuste</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Fim</TableHead>
              <TableHead>Unidades</TableHead>
              <TableHead>VGV</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fases.map((fase) => (
              <TableRow key={fase.id || fase.fase_id}>
                <TableCell className="font-medium">{fase.nome}</TableCell>
                <TableCell>{fase.ordem}</TableCell>
                <TableCell>{fase.percentual_reajuste}%</TableCell>
                <TableCell>{formatDate(fase.data_inicio)}</TableCell>
                <TableCell>{formatDate(fase.data_fim)}</TableCell>
                <TableCell>{fase.qtd_unidades || 0}</TableCell>
                <TableCell>{formatCurrency(fase.vgv_fase || 0)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditFase(fase.id || fase.fase_id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAllocateUnits(fase.id || fase.fase_id)}>
                        <Users className="mr-2 h-4 w-4" />
                        Alocar Unidades
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(fase.id || fase.fase_id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmationDialog
        open={showDeleteConfirmation}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Excluir Fase"
        description="Tem certeza que deseja excluir esta fase? Esta ação não pode ser desfeita e afetará os valores de todas as unidades não alocadas."
        confirmText="Excluir"
        cancelText="Cancelar"
        isLoading={isLoading}
      />
    </>
  )
}
