"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownAZ, ArrowUpZA, FilterX } from "lucide-react"

interface CenariosFiltersProps {
  status: "Ativo" | "Inativo" | "Arquivado" | undefined
  setStatus: (status: "Ativo" | "Inativo" | "Arquivado" | undefined) => void
  ordenarPor: string
  setOrdenarPor: (ordenarPor: string) => void
  ordem: "asc" | "desc"
  setOrdem: (ordem: "asc" | "desc") => void
}

export function CenariosFilters({
  status,
  setStatus,
  ordenarPor,
  setOrdenarPor,
  ordem,
  setOrdem,
}: CenariosFiltersProps) {
  const limparFiltros = () => {
    setStatus(undefined)
    setOrdenarPor("nome")
    setOrdem("asc")
  }

  const toggleOrdem = () => {
    setOrdem(ordem === "asc" ? "desc" : "asc")
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Select
          value={status || "Todos os status"}
          onValueChange={(value) =>
            setStatus(value === "Todos os status" ? undefined : (value as "Ativo" | "Inativo" | "Arquivado"))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos os status">Todos os status</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Inativo">Inativo</SelectItem>
            <SelectItem value="Arquivado">Arquivado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={ordenarPor} onValueChange={setOrdenarPor}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nome">Nome</SelectItem>
            <SelectItem value="data_criacao">Data de Criação</SelectItem>
            <SelectItem value="vgv_projetado">VGV Projetado</SelectItem>
            <SelectItem value="diferenca_percentual">Diferença %</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" onClick={toggleOrdem}>
          {ordem === "asc" ? <ArrowUpZA className="h-4 w-4" /> : <ArrowDownAZ className="h-4 w-4" />}
        </Button>

        {(status || ordenarPor !== "nome" || ordem !== "asc") && (
          <Button variant="ghost" size="sm" onClick={limparFiltros}>
            <FilterX className="mr-2 h-4 w-4" />
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  )
}
