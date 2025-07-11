"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal, X } from "lucide-react"

export function EmpreendimentosFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [busca, setBusca] = useState(searchParams.get("busca") || "")
  const [ordenacao, setOrdenacao] = useState(searchParams.get("ordenacao") || "nome-asc")
  const [filtrosAvancados, setFiltrosAvancados] = useState(false)

  function aplicarFiltros() {
    const params = new URLSearchParams()
    if (busca) params.set("busca", busca)
    if (ordenacao) params.set("ordenacao", ordenacao)

    router.push(`/empreendimentos?${params.toString()}`)
  }

  function limparFiltros() {
    setBusca("")
    setOrdenacao("nome-asc")
    router.push("/empreendimentos")
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar empreendimentos..."
            className="pl-9"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && aplicarFiltros()}
          />
          {busca && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
              onClick={() => {
                setBusca("")
                aplicarFiltros()
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Limpar busca</span>
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Select
            value={ordenacao}
            onValueChange={(value) => {
              setOrdenacao(value)
              setTimeout(aplicarFiltros, 0)
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nome-asc">Nome (A-Z)</SelectItem>
              <SelectItem value="nome-desc">Nome (Z-A)</SelectItem>
              <SelectItem value="data-asc">Data de lançamento (antiga)</SelectItem>
              <SelectItem value="data-desc">Data de lançamento (recente)</SelectItem>
              <SelectItem value="vgv-asc">VGV (menor)</SelectItem>
              <SelectItem value="vgv-desc">VGV (maior)</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setFiltrosAvancados(!filtrosAvancados)}
            className={filtrosAvancados ? "bg-primary/10" : ""}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Filtros avançados</span>
          </Button>
          {(busca || ordenacao !== "nome-asc") && (
            <Button variant="ghost" onClick={limparFiltros}>
              Limpar filtros
            </Button>
          )}
        </div>
      </div>

      {filtrosAvancados && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 border rounded-md bg-card/50">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select defaultValue="todos">
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="lancamento">Em lançamento</SelectItem>
                <SelectItem value="construcao">Em construção</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cidade</label>
            <Select defaultValue="todas">
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="sao-paulo">São Paulo</SelectItem>
                <SelectItem value="rio-de-janeiro">Rio de Janeiro</SelectItem>
                <SelectItem value="belo-horizonte">Belo Horizonte</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">VGV Mínimo</label>
            <Input type="number" placeholder="R$ 0,00" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">VGV Máximo</label>
            <Input type="number" placeholder="R$ 0,00" />
          </div>
          <div className="col-span-full flex justify-end gap-2">
            <Button variant="outline" onClick={() => setFiltrosAvancados(false)}>
              Cancelar
            </Button>
            <Button onClick={aplicarFiltros}>Aplicar Filtros</Button>
          </div>
        </div>
      )}
    </div>
  )
}
