"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Download, Upload } from "lucide-react"

export function EmpreendimentosHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold">Empreendimentos</h1>
        <p className="text-muted-foreground mt-1">Gerencie seus empreendimentos imobiliários e suas unidades</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" className="h-9">
          <Upload className="h-4 w-4 mr-2" />
          Importar
        </Button>
        <Button variant="outline" size="sm" className="h-9">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
        <Button asChild>
          <Link href="/empreendimentos/novo" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Empreendimento
          </Link>
        </Button>
      </div>
    </div>
  )
}
