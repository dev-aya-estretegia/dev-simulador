"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileUp, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { UnidadesExclusaoLote } from "@/components/unidades/unidades-exclusao-lote"

interface UnidadesHeaderProps {
  unidadesSelecionadas: number[]
  onLimparSelecao: () => void
}

export function UnidadesHeader({ unidadesSelecionadas, onLimparSelecao }: UnidadesHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold">Unidades</h1>
        <p className="text-muted-foreground mt-1">Gerencie as unidades dos empreendimentos</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" className="h-9" asChild>
          <Link href="/unidades/importar">
            <FileUp className="h-4 w-4 mr-2" />
            Importar
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="h-9">
          <Trash2 className="h-4 w-4 mr-2" />
          Exportar
        </Button>

        {unidadesSelecionadas.length > 0 && (
          <UnidadesExclusaoLote unidadesIds={unidadesSelecionadas} onSuccess={onLimparSelecao} />
        )}

        <Button asChild>
          <Link href="/unidades/novo" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Nova Unidade
          </Link>
        </Button>
      </div>
    </div>
  )
}
