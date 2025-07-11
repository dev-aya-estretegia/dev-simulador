"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, X, Building, Hash, Target } from "lucide-react"

interface ValorUnidade {
  unidade_id: number
  unidade_nome: string
  tipologia: string
  pavimento: number
  bloco?: string
  area_privativa: number
  area_garden?: number
  qtd_vaga_simples?: number
  qtd_vaga_duplas?: number
  qtd_vaga_moto?: number
  qtd_hobby_boxes?: number
  qtd_suite?: number
  orientacao_solar?: string
  vista?: string
  diferencial?: string
  fase_unidade_venda?: string
  valor_unidade_inicial: number
  valor_unidade_venda: number
  valor_unidade_fase_1?: number
  valor_unidade_fase_2?: number
  valor_unidade_fase_3?: number
  valor_unidade_fase_4?: number
  valor_unidade_fase_5?: number
}

interface EvolucaoPrecosFiltersProps {
  valoresUnidades: ValorUnidade[]
  selectedTipologias: string[]
  selectedPavimentos: number[]
  selectedTerminacoes: string[]
  onTipologiasChange: (tipologias: string[]) => void
  onPavimentosChange: (pavimentos: number[]) => void
  onTerminacoesChange: (terminacoes: string[]) => void
}

export function EvolucaoPrecosFilters({
  valoresUnidades = [],
  selectedTipologias,
  selectedPavimentos,
  selectedTerminacoes,
  onTipologiasChange,
  onPavimentosChange,
  onTerminacoesChange,
}: EvolucaoPrecosFiltersProps) {
  // Função para extrair os dois últimos números do nome da unidade
  const extrairTerminacao = (nomeUnidade: string): string | null => {
    // Buscar por números no final do nome
    const match = nomeUnidade.match(/(\d{2,})$/)
    if (match) {
      const numeros = match[1]
      // Pegar os dois últimos dígitos
      return numeros.slice(-2)
    }
    return null
  }

  // Extrair tipologias únicas com contadores
  const tipologiasDisponiveis = useMemo(() => {
    const tipologiasMap = new Map<string, number>()

    valoresUnidades.forEach((unidade) => {
      if (unidade.tipologia) {
        tipologiasMap.set(unidade.tipologia, (tipologiasMap.get(unidade.tipologia) || 0) + 1)
      }
    })

    return Array.from(tipologiasMap.entries())
      .map(([tipologia, count]) => ({ tipologia, count }))
      .sort((a, b) => a.tipologia.localeCompare(b.tipologia))
  }, [valoresUnidades])

  // Extrair pavimentos únicos com contadores
  const pavimentosDisponiveis = useMemo(() => {
    const pavimentosMap = new Map<number, number>()

    valoresUnidades.forEach((unidade) => {
      if (unidade.pavimento !== null && unidade.pavimento !== undefined) {
        pavimentosMap.set(unidade.pavimento, (pavimentosMap.get(unidade.pavimento) || 0) + 1)
      }
    })

    return Array.from(pavimentosMap.entries())
      .map(([pavimento, count]) => ({ pavimento, count }))
      .sort((a, b) => a.pavimento - b.pavimento)
  }, [valoresUnidades])

  // Extrair terminações únicas com contadores
  const terminacoesDisponiveis = useMemo(() => {
    const terminacoesMap = new Map<string, number>()

    valoresUnidades.forEach((unidade) => {
      const terminacao = extrairTerminacao(unidade.unidade_nome)
      if (terminacao) {
        terminacoesMap.set(terminacao, (terminacoesMap.get(terminacao) || 0) + 1)
      }
    })

    return Array.from(terminacoesMap.entries())
      .map(([terminacao, count]) => ({ terminacao, count }))
      .sort((a, b) => a.terminacao.localeCompare(b.terminacao))
  }, [valoresUnidades])

  // Handlers para tipologias
  const handleTipologiaChange = (tipologia: string, checked: boolean) => {
    if (checked) {
      onTipologiasChange([...selectedTipologias, tipologia])
    } else {
      onTipologiasChange(selectedTipologias.filter((t) => t !== tipologia))
    }
  }

  const handleAllTipologias = () => {
    onTipologiasChange(tipologiasDisponiveis.map((t) => t.tipologia))
  }

  const handleClearTipologias = () => {
    onTipologiasChange([])
  }

  // Handlers para pavimentos
  const handlePavimentoChange = (pavimento: number, checked: boolean) => {
    if (checked) {
      onPavimentosChange([...selectedPavimentos, pavimento])
    } else {
      onPavimentosChange(selectedPavimentos.filter((p) => p !== pavimento))
    }
  }

  const handleAllPavimentos = () => {
    onPavimentosChange(pavimentosDisponiveis.map((p) => p.pavimento))
  }

  const handleClearPavimentos = () => {
    onPavimentosChange([])
  }

  // Handlers para terminações
  const handleTerminacaoChange = (terminacao: string, checked: boolean) => {
    if (checked) {
      onTerminacoesChange([...selectedTerminacoes, terminacao])
    } else {
      onTerminacoesChange(selectedTerminacoes.filter((t) => t !== terminacao))
    }
  }

  const handleAllTerminacoes = () => {
    onTerminacoesChange(terminacoesDisponiveis.map((t) => t.terminacao))
  }

  const handleClearTerminacoes = () => {
    onTerminacoesChange([])
  }

  // Remover filtro individual
  const removeTipologia = (tipologia: string) => {
    onTipologiasChange(selectedTipologias.filter((t) => t !== tipologia))
  }

  const removePavimento = (pavimento: number) => {
    onPavimentosChange(selectedPavimentos.filter((p) => p !== pavimento))
  }

  const removeTerminacao = (terminacao: string) => {
    onTerminacoesChange(selectedTerminacoes.filter((t) => t !== terminacao))
  }

  // Limpar todos os filtros
  const clearAllFilters = () => {
    onTipologiasChange([])
    onPavimentosChange([])
    onTerminacoesChange([])
  }

  const totalFiltrosAtivos = selectedTipologias.length + selectedPavimentos.length + selectedTerminacoes.length

  return (
    <Card className="bg-gray-800 border-gray-700 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Filtros de Unidades
          {totalFiltrosAtivos > 0 && (
            <Badge variant="secondary" className="bg-primary text-white">
              {totalFiltrosAtivos} filtro{totalFiltrosAtivos > 1 ? "s" : ""} ativo{totalFiltrosAtivos > 1 ? "s" : ""}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filtros Ativos */}
        {totalFiltrosAtivos > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-300">Filtros Ativos:</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                Limpar Todos
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedTipologias.map((tipologia) => (
                <Badge
                  key={tipologia}
                  variant="secondary"
                  className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  onClick={() => removeTipologia(tipologia)}
                >
                  {tipologia}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              {selectedPavimentos.map((pavimento) => (
                <Badge
                  key={pavimento}
                  variant="secondary"
                  className="bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  onClick={() => removePavimento(pavimento)}
                >
                  Pavimento {pavimento}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              {selectedTerminacoes.map((terminacao) => (
                <Badge
                  key={terminacao}
                  variant="secondary"
                  className="bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
                  onClick={() => removeTerminacao(terminacao)}
                >
                  Final {terminacao}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Grid de Filtros Reorganizado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filtro por Tipologia */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Tipologia
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAllTipologias}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 text-xs"
                >
                  Todos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearTipologias}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 text-xs"
                >
                  Limpar
                </Button>
              </div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {tipologiasDisponiveis.map(({ tipologia, count }) => (
                <div key={tipologia} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tipologia-${tipologia}`}
                    checked={selectedTipologias.includes(tipologia)}
                    onCheckedChange={(checked) => handleTipologiaChange(tipologia, checked as boolean)}
                    className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label
                    htmlFor={`tipologia-${tipologia}`}
                    className="text-sm text-gray-300 cursor-pointer flex-1 flex items-center justify-between"
                  >
                    <span>{tipologia}</span>
                    <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                      {count}
                    </Badge>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Filtro por Pavimento */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Pavimento
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAllPavimentos}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 text-xs"
                >
                  Todos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearPavimentos}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 text-xs"
                >
                  Limpar
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {pavimentosDisponiveis.map(({ pavimento, count }) => (
                <div key={pavimento} className="flex items-center space-x-2">
                  <Checkbox
                    id={`pavimento-${pavimento}`}
                    checked={selectedPavimentos.includes(pavimento)}
                    onCheckedChange={(checked) => handlePavimentoChange(pavimento, checked as boolean)}
                    className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label
                    htmlFor={`pavimento-${pavimento}`}
                    className="text-sm text-gray-300 cursor-pointer flex-1 flex items-center justify-between"
                  >
                    <span>{pavimento}º</span>
                    <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                      {count}
                    </Badge>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Filtro por Terminação do Nome */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Final do Nome
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAllTerminacoes}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 text-xs"
                >
                  Todos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearTerminacoes}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 text-xs"
                >
                  Limpar
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {terminacoesDisponiveis.map(({ terminacao, count }) => (
                <div key={terminacao} className="flex items-center space-x-2">
                  <Checkbox
                    id={`terminacao-${terminacao}`}
                    checked={selectedTerminacoes.includes(terminacao)}
                    onCheckedChange={(checked) => handleTerminacaoChange(terminacao, checked as boolean)}
                    className="border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label
                    htmlFor={`terminacao-${terminacao}`}
                    className="text-sm text-gray-300 cursor-pointer flex-1 flex items-center justify-between"
                  >
                    <span>**{terminacao}</span>
                    <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                      {count}
                    </Badge>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
