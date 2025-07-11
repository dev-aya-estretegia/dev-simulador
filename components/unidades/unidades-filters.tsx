"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal, X } from "lucide-react"

interface UnidadesFiltersProps {
  empreendimentos: { id: number; nome: string }[]
  cenarios: { id: number; nome: string; empreendimento_id: number }[]
  cenarioSelecionado?: string
  empreendimentoSelecionado?: string
  blocos: { value: string; label: string }[]
  pavimentos: { value: string; label: string }[]
  filtros: {
    tipologia?: string
    busca?: string
    ordenacao?: string
  }
}

export function UnidadesFilters({
  empreendimentos,
  cenarios,
  cenarioSelecionado,
  empreendimentoSelecionado,
  blocos,
  pavimentos,
  filtros,
}: UnidadesFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [busca, setBusca] = useState(filtros.busca || searchParams.get("busca") || "")
  const [empreendimentoId, setEmpreendimentoId] = useState<string>(
    empreendimentoSelecionado || searchParams.get("empreendimento") || "0",
  )
  const [cenarioId, setCenarioId] = useState<string>(cenarioSelecionado || searchParams.get("cenario") || "0")
  const [tipologia, setTipologia] = useState(filtros.tipologia || searchParams.get("tipologia") || "0")
  const [pavimento, setPavimento] = useState(searchParams.get("pavimento") || "0")
  const [bloco, setBloco] = useState(searchParams.get("bloco") || "0")
  const [ordenacao, setOrdenacao] = useState(filtros.ordenacao || searchParams.get("ordenacao") || "pavimento-asc")
  const [filtrosAvancados, setFiltrosAvancados] = useState(false)

  // Filtrar cenários pelo empreendimento selecionado
  const cenariosFiltrados =
    empreendimentoId && empreendimentoId !== "0"
      ? cenarios.filter((c) => c.empreendimento_id === Number(empreendimentoId))
      : cenarios

  // Atualizar cenário quando o empreendimento mudar
  useEffect(() => {
    if (empreendimentoId && cenarioId && cenarioId !== "0") {
      const cenarioAtual = cenarios.find((c) => c.id === Number(cenarioId))
      if (cenarioAtual && cenarioAtual.empreendimento_id !== Number(empreendimentoId)) {
        setCenarioId("0")
      }
    }
  }, [empreendimentoId, cenarioId, cenarios])

  function aplicarFiltros() {
    const params = new URLSearchParams()
    if (busca) params.set("busca", busca)
    if (empreendimentoId !== "0") params.set("empreendimento", empreendimentoId)
    if (cenarioId !== "0") params.set("cenario", cenarioId)
    if (tipologia !== "0") params.set("tipologia", tipologia)
    if (pavimento !== "0") params.set("pavimento", pavimento)
    if (bloco !== "0") params.set("bloco", bloco)
    if (ordenacao !== "pavimento-asc") params.set("ordenacao", ordenacao)

    router.push(`/unidades?${params.toString()}`)
  }

  function limparFiltros() {
    setBusca("")
    setEmpreendimentoId("0")
    setCenarioId("0")
    setTipologia("0")
    setPavimento("0")
    setBloco("0")
    setOrdenacao("pavimento-asc")
    router.push("/unidades")
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar unidades..."
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
            value={empreendimentoId}
            onValueChange={(value) => {
              setEmpreendimentoId(value)
              setTimeout(aplicarFiltros, 0)
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Empreendimento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Todos</SelectItem>
              {empreendimentos.map((empreendimento) => (
                <SelectItem key={empreendimento.id} value={empreendimento.id.toString()}>
                  {empreendimento.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={cenarioId}
            onValueChange={(value) => {
              setCenarioId(value)
              setTimeout(aplicarFiltros, 0)
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Cenário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Todos</SelectItem>
              {cenariosFiltrados.map((cenario) => (
                <SelectItem key={cenario.id} value={cenario.id.toString()}>
                  {cenario.nome}
                </SelectItem>
              ))}
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

          {(busca ||
            empreendimentoId !== "0" ||
            cenarioId !== "0" ||
            tipologia !== "0" ||
            pavimento !== "0" ||
            bloco !== "0" ||
            ordenacao !== "pavimento-asc") && (
            <Button variant="ghost" onClick={limparFiltros}>
              Limpar filtros
            </Button>
          )}
        </div>
      </div>

      {filtrosAvancados && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 border rounded-md bg-card/50">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipologia</label>
            <Select
              value={tipologia}
              onValueChange={(value) => {
                setTipologia(value)
                setTimeout(aplicarFiltros, 0)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Todas</SelectItem>
                <SelectItem value="Apartamento">Apartamento</SelectItem>
                <SelectItem value="Studio">Studio</SelectItem>
                <SelectItem value="Comercial">Comercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Pavimento</label>
            <Select
              value={pavimento}
              onValueChange={(value) => {
                setPavimento(value)
                setTimeout(aplicarFiltros, 0)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Todos</SelectItem>
                {pavimentos.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Bloco</label>
            <Select
              value={bloco}
              onValueChange={(value) => {
                setBloco(value)
                setTimeout(aplicarFiltros, 0)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Todos</SelectItem>
                {blocos.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Ordenação</label>
            <Select
              value={ordenacao}
              onValueChange={(value) => {
                setOrdenacao(value)
                setTimeout(aplicarFiltros, 0)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pavimento-asc">Pavimento (crescente)</SelectItem>
                <SelectItem value="pavimento-desc">Pavimento (decrescente)</SelectItem>
                <SelectItem value="nome-asc">Nome (A-Z)</SelectItem>
                <SelectItem value="nome-desc">Nome (Z-A)</SelectItem>
                <SelectItem value="valor-asc">Valor (menor)</SelectItem>
                <SelectItem value="valor-desc">Valor (maior)</SelectItem>
                <SelectItem value="area-asc">Área (menor)</SelectItem>
                <SelectItem value="area-desc">Área (maior)</SelectItem>
              </SelectContent>
            </Select>
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
