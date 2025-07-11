"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Trash } from "lucide-react"

interface UnidadesExclusaoLoteProps {
  unidadesIds: number[]
  onSuccess?: () => void
}

export function UnidadesExclusaoLote({ unidadesIds, onSuccess }: UnidadesExclusaoLoteProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isExcluindo, setIsExcluindo] = useState(false)

  async function excluirUnidades() {
    if (unidadesIds.length === 0) return

    setIsExcluindo(true)

    try {
      // Excluir unidades
      const { error } = await supabase.from("UNIDADE").delete().in("id", unidadesIds)

      if (error) throw error

      toast({
        title: "Unidades excluídas",
        description: `${unidadesIds.length} unidades foram excluídas com sucesso.`,
      })

      // Fechar o diálogo
      setOpen(false)

      // Callback de sucesso
      if (onSuccess) {
        onSuccess()
      }

      // Atualizar a página
      router.refresh()
    } catch (error) {
      console.error("Erro ao excluir unidades:", error)
      toast({
        title: "Erro ao excluir unidades",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setIsExcluindo(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={() => setOpen(true)}
        disabled={unidadesIds.length === 0}
      >
        <Trash className="h-4 w-4 mr-2" />
        Excluir Selecionadas ({unidadesIds.length})
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Unidades</DialogTitle>
            <DialogDescription>
              Você está prestes a excluir {unidadesIds.length} unidades. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Todas as informações associadas a estas unidades serão permanentemente removidas, incluindo:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground space-y-1">
              <li>Valores calculados em todos os cenários</li>
              <li>Alocações em fases</li>
              <li>Histórico de alterações</li>
            </ul>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isExcluindo}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={excluirUnidades} disabled={isExcluindo} className="gap-2">
              {isExcluindo ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash className="h-4 w-4" />
                  Excluir {unidadesIds.length} Unidades
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
