"use client"

import { useEffect, useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Search, Building } from "lucide-react"
import { useFase } from "@/hooks/use-fases"
import { useAlocacaoUnidades } from "@/hooks/use-alocacao-unidades"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCenario } from "@/hooks/use-cenarios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Unidade = {
  unidade_id: number
  nome: string
  bloco: string
  pavimento: number
  tipologia: string
  area_privativa: number
  valor_inicial: number
  valor_na_fase: number
  fase_alocada: string | null
}

type GroupedUnidades = {
  [key: number]: Unidade[]
}

type Props = {
  cenarioId: number
  faseId: number
  open: boolean
  onClose: () => void
}

export function AlocacaoUnidadesForm({ cenarioId, faseId, open, onClose }: Props) {
  const { fase } = useFase(faseId)
  const { cenario } = useCenario(cenarioId)
  const { buscarUnidadesDisponiveis, buscarUnidadesAlocadas, alocarUnidades, desalocarUnidades, isLoading } =
    useAlocacaoUnidades()

  const [unidadesDisponiveis, setUnidadesDisponiveis] = useState<Unidade[]>([])
  const [unidadesAlocadas, setUnidadesAlocadas] = useState<Unidade[]>([])

  const [selectedUnidadesDisponiveis, setSelectedUnidadesDisponiveis] = useState<Set<number>>(new Set())
  const [selectedUnidadesAlocadas, setSelectedUnidadesAlocadas] = useState<Set<number>>(new Set())

  const [activeTab, setActiveTab] = useState("disponiveis")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTipologia, setFilterTipologia] = useState<string>("todas")
  const [filterPavimento, setFilterPavimento] = useState<string>("todos")

  // Diagnóstico de IDs duplicados
  useEffect(() => {
    if (unidadesDisponiveis.length > 0) {
      const ids = unidadesDisponiveis.map((u) => u.unidade_id)
      const uniqueIds = new Set(ids)
      if (ids.length !== uniqueIds.size) {
        const errorMessage =
          "Erro crítico de dados: IDs de unidades duplicados foram detectados nas unidades disponíveis. A seleção pode não funcionar corretamente."
        console.error(errorMessage, {
          total: ids.length,
          unicos: uniqueIds.size,
          unidades: unidadesDisponiveis,
        })
        setError(errorMessage)
      }
    }
  }, [unidadesDisponiveis])

  useEffect(() => {
    if (unidadesAlocadas.length > 0) {
      const ids = unidadesAlocadas.map((u) => u.unidade_id)
      const uniqueIds = new Set(ids)
      if (ids.length !== uniqueIds.size) {
        const errorMessage =
          "Erro crítico de dados: IDs de unidades duplicados foram detectados nas unidades alocadas. A seleção pode não funcionar corretamente."
        console.error(errorMessage, {
          total: ids.length,
          unicos: uniqueIds.size,
          unidades: unidadesAlocadas,
        })
        setError(errorMessage)
      }
    }
  }, [unidadesAlocadas])

  // Estatísticas
  const estatisticas = useMemo(() => {
    const totalUnidades = unidadesDisponiveis.length + unidadesAlocadas.length
    const valorTotalDisponiveis = unidadesDisponiveis.reduce((sum, u) => sum + u.valor_na_fase, 0)
    const valorTotalAlocadas = unidadesAlocadas.reduce((sum, u) => sum + u.valor_na_fase, 0)
    const percentualAlocado = totalUnidades > 0 ? (unidadesAlocadas.length / totalUnidades) * 100 : 0

    return {
      totalUnidades,
      valorTotalDisponiveis,
      valorTotalAlocadas,
      percentualAlocado,
    }
  }, [unidadesDisponiveis, unidadesAlocadas])

  const applyFilters = (unidades: Unidade[]): Unidade[] => {
    return unidades.filter((u) => {
      const searchMatch = searchTerm
        ? u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.bloco.toLowerCase().includes(searchTerm.toLowerCase())
        : true
      const tipologiaMatch = filterTipologia !== "todas" ? u.tipologia === filterTipologia : true
      const pavimentoMatch = filterPavimento !== "todos" ? u.pavimento === Number(filterPavimento) : true
      return searchMatch && tipologiaMatch && pavimentoMatch
    })
  }

  const filteredUnidadesDisponiveis = useMemo(
    () => applyFilters(unidadesDisponiveis),
    [unidadesDisponiveis, searchTerm, filterTipologia, filterPavimento],
  )
  const filteredUnidadesAlocadas = useMemo(
    () => applyFilters(unidadesAlocadas),
    [unidadesAlocadas, searchTerm, filterTipologia, filterPavimento],
  )

  const groupUnitsByFloor = (unidades: Unidade[]): GroupedUnidades => {
    return unidades.reduce((acc: GroupedUnidades, unidade) => {
      const pavimento = unidade.pavimento
      if (!acc[pavimento]) {
        acc[pavimento] = []
      }
      acc[pavimento].push(unidade)
      return acc
    }, {})
  }

  const groupedUnidadesDisponiveis = useMemo(
    () => groupUnitsByFloor(filteredUnidadesDisponiveis),
    [filteredUnidadesDisponiveis],
  )
  const groupedUnidadesAlocadas = useMemo(() => groupUnitsByFloor(filteredUnidadesAlocadas), [filteredUnidadesAlocadas])

  const pavimentos = useMemo(() => {
    const allPavimentos = [...unidadesDisponiveis, ...unidadesAlocadas].map((u) => u.pavimento)
    return Array.from(new Set(allPavimentos)).sort((a, b) => a - b)
  }, [unidadesDisponiveis, unidadesAlocadas])

  const tipologias = useMemo(() => {
    const allTipologias = [...unidadesDisponiveis, ...unidadesAlocadas].map((u) => u.tipologia)
    return Array.from(new Set(allTipologias)).sort()
  }, [unidadesDisponiveis, unidadesAlocadas])

  useEffect(() => {
    if (open && cenarioId && faseId) {
      loadUnidades()
    }
  }, [open, cenarioId, faseId])

  const loadUnidades = async () => {
    try {
      setError(null)
      const [disponiveis, alocadas] = await Promise.all([
        buscarUnidadesDisponiveis(cenarioId, faseId),
        buscarUnidadesAlocadas(cenarioId, faseId),
      ])
      setUnidadesDisponiveis(disponiveis)
      setUnidadesAlocadas(alocadas)
      setSelectedUnidadesDisponiveis(new Set())
      setSelectedUnidadesAlocadas(new Set())
    } catch (error) {
      console.error("Erro ao carregar unidades:", error)
      setError("Não foi possível carregar as unidades. Por favor, tente novamente.")
    }
  }

  const handleAlocar = async () => {
    if (selectedUnidadesDisponiveis.size === 0) return
    setIsSubmitting(true)
    try {
      setError(null)
      await alocarUnidades(faseId, Array.from(selectedUnidadesDisponiveis))
      await loadUnidades()
      setActiveTab("alocadas")
    } catch (error) {
      console.error("Erro ao alocar unidades:", error)
      setError("Não foi possível alocar as unidades selecionadas.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDesalocar = async () => {
    if (selectedUnidadesAlocadas.size === 0) return
    setIsSubmitting(true)
    try {
      setError(null)
      await desalocarUnidades(faseId, Array.from(selectedUnidadesAlocadas))
      await loadUnidades()
      setActiveTab("disponiveis")
    } catch (error) {
      console.error("Erro ao desalocar unidades:", error)
      setError("Não foi possível desalocar as unidades selecionadas.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleSelection = (unidadeId: number, type: "disponiveis" | "alocadas") => {
    const setSelected = type === "disponiveis" ? setSelectedUnidadesDisponiveis : setSelectedUnidadesAlocadas

    setSelected((prevSelected) => {
      const newSelection = new Set(prevSelected)
      if (newSelection.has(unidadeId)) {
        newSelection.delete(unidadeId)
      } else {
        newSelection.add(unidadeId)
      }
      return newSelection
    })
  }

  const toggleSelectAll = (type: "disponiveis" | "alocadas") => {
    const [filteredUnits, selected, setSelected] =
      type === "disponiveis"
        ? [filteredUnidadesDisponiveis, selectedUnidadesDisponiveis, setSelectedUnidadesDisponiveis]
        : [filteredUnidadesAlocadas, selectedUnidadesAlocadas, setSelectedUnidadesAlocadas]

    if (selected.size === filteredUnits.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filteredUnits.map((u) => u.unidade_id)))
    }
  }

  const renderUnidadesGrid = (groupedUnidades: GroupedUnidades, type: "disponiveis" | "alocadas") => {
    const selectedSet = type === "disponiveis" ? selectedUnidadesDisponiveis : selectedUnidadesAlocadas
    const sortedPavimentos = Object.keys(groupedUnidades)
      .map(Number)
      .sort((a, b) => a - b)

    if (sortedPavimentos.length === 0) {
      return (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground py-10">
          Nenhuma unidade encontrada com os filtros atuais.
        </div>
      )
    }

    return sortedPavimentos.map((pavimento) => (
      <div key={`pavimento-${pavimento}-${type}`} className="mb-4">
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Pavimento {pavimento}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {groupedUnidades[pavimento].map((unidade, index) => {
            const isSelected = selectedSet.has(unidade.unidade_id)
            return (
              <Card
                key={`${unidade.unidade_id}-${index}`}
                onClick={() => toggleSelection(unidade.unidade_id, type)}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50",
                  isSelected ? "border-primary ring-2 ring-primary" : "border-transparent",
                )}
              >
                <CardHeader className="p-2">
                  <CardTitle className="text-sm font-bold">{unidade.nome}</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 text-xs text-muted-foreground">
                  <p>
                    {unidade.tipologia} - {unidade.area_privativa}m²
                  </p>
                  <p className="font-semibold text-foreground">
                    Valor na Fase: {formatCurrency(unidade.valor_na_fase)}
                  </p>
                  <p>Valor Inicial: {formatCurrency(unidade.valor_inicial)}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    ))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-6 w-6" />
            {fase ? `Alocar Unidades - ${fase.nome}` : "Alocar Unidades"}
            {fase && <Badge variant="outline">{formatPercentage(fase.percentual_reajuste)}% de reajuste</Badge>}
          </DialogTitle>
          {cenario && fase && (
            <div className="text-sm text-muted-foreground mt-1">
              Cenário: {cenario.nome} | Empreendimento: {cenario.empreendimento?.nome || ""}
            </div>
          )}
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <div className="text-muted-foreground">Total de Unidades</div>
            <div className="font-medium">{estatisticas.totalUnidades}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Alocadas / %</div>
            <div className="font-medium">
              {unidadesAlocadas.length} ({formatPercentage(estatisticas.percentualAlocado)}%)
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">VGV Alocado</div>
            <div className="font-medium">{formatCurrency(estatisticas.valorTotalAlocadas)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">VGV Disponível</div>
            <div className="font-medium">{formatCurrency(estatisticas.valorTotalDisponiveis)}</div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-2 p-1 border-b">
          <div className="relative flex-1 w-full sm:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou bloco..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={filterTipologia} onValueChange={setFilterTipologia}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Tipologia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas Tipologias</SelectItem>
                {tipologias.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPavimento} onValueChange={setFilterPavimento}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Pavimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos Pavimentos</SelectItem>
                {pavimentos.map((p) => (
                  <SelectItem key={p} value={String(p)}>
                    {p}º Pavimento
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="disponiveis">Disponíveis ({filteredUnidadesDisponiveis.length})</TabsTrigger>
            <TabsTrigger value="alocadas">Alocadas ({filteredUnidadesAlocadas.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="disponiveis" className="flex-grow mt-2">
            <div className="flex justify-between items-center mb-2 px-1">
              <Button variant="outline" size="sm" onClick={() => toggleSelectAll("disponiveis")}>
                {selectedUnidadesDisponiveis.size === filteredUnidadesDisponiveis.length &&
                filteredUnidadesDisponiveis.length > 0
                  ? "Desmarcar Todas"
                  : "Selecionar Todas"}
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm">{selectedUnidadesDisponiveis.size} selecionada(s)</span>
                <Button
                  size="sm"
                  onClick={handleAlocar}
                  disabled={selectedUnidadesDisponiveis.size === 0 || isSubmitting || isLoading}
                >
                  {isSubmitting ? "Alocando..." : "Alocar"}
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[400px] pr-4">
              {renderUnidadesGrid(groupedUnidadesDisponiveis, "disponiveis")}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="alocadas" className="flex-grow mt-2">
            <div className="flex justify-between items-center mb-2 px-1">
              <Button variant="outline" size="sm" onClick={() => toggleSelectAll("alocadas")}>
                {selectedUnidadesAlocadas.size === filteredUnidadesAlocadas.length &&
                filteredUnidadesAlocadas.length > 0
                  ? "Desmarcar Todas"
                  : "Selecionar Todas"}
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm">{selectedUnidadesAlocadas.size} selecionada(s)</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDesalocar}
                  disabled={selectedUnidadesAlocadas.size === 0 || isSubmitting || isLoading}
                >
                  {isSubmitting ? "Desalocando..." : "Desalocar"}
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[400px] pr-4">
              {renderUnidadesGrid(groupedUnidadesAlocadas, "alocadas")}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
