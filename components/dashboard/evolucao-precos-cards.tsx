"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { EvolucaoPrecosFilters } from "./evolucao-precos-filters"
import {
  Building2,
  MapPin,
  Car,
  Home,
  Eye,
  Sun,
  Layers,
  Square,
  TreePine,
  AlertCircle,
  Box,
  BedDouble,
} from "lucide-react"

interface ValorUnidade {
  unidade_id: number
  unidade_nome: string
  pavimento: number | null
  bloco: string | null
  tipologia: string
  area_privativa: number
  area_garden: number | null
  qtd_vaga_simples: number | null
  qtd_vaga_duplas: number | null
  qtd_vaga_moto: number | null
  qtd_hobby_boxes: number | null
  qtd_suite: number | null
  orientacao_solar: string | null
  vista: string | null
  diferencial?: string | null
  valor_unidade_inicial: number
  valor_unidade_fase_1: number | null
  valor_unidade_fase_2: number | null
  valor_unidade_fase_3: number | null
  valor_unidade_fase_4: number | null
  valor_unidade_fase_5: number | null
  valor_unidade_fase_6: number | null
  valor_unidade_fase_7: number | null
  valor_unidade_fase_8: number | null
  valor_unidade_fase_9: number | null
  valor_unidade_fase_10: number | null
  fase_unidade_venda: string | null
  valor_unidade_venda: number | null
  cenario_id: number
  cenario_nome: string
  empreendimento_nome: string
  // Valores por m²
  valor_m2_inicial: number
  valor_m2_fase_1: number | null
  valor_m2_fase_2: number | null
  valor_m2_fase_3: number | null
  valor_m2_fase_4: number | null
  valor_m2_fase_5: number | null
  valor_m2_fase_6: number | null
  valor_m2_fase_7: number | null
  valor_m2_fase_8: number | null
  valor_m2_fase_9: number | null
  valor_m2_fase_10: number | null
  valor_m2_venda: number | null
}

interface Fase {
  id: number
  nome: string
  percentual_reajuste: number
  ordem: number
}

interface EvolucaoPrecosCardsProps {
  valoresUnidades: ValorUnidade[]
  fases: Fase[]
  loading: boolean
}

export function EvolucaoPrecosCards({ valoresUnidades = [], fases = [], loading }: EvolucaoPrecosCardsProps) {
  const [selectedTipologias, setSelectedTipologias] = useState<string[]>([])
  const [selectedPavimentos, setSelectedPavimentos] = useState<number[]>([])
  const [selectedTerminacoes, setSelectedTerminacoes] = useState<string[]>([])

  // Função para formatar moeda
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "R$ 0,00"
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

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

  // Função para obter valor de uma fase específica
  const getValorFase = (unidade: ValorUnidade, ordem: number) => {
    const fieldName = `valor_unidade_fase_${ordem}` as keyof ValorUnidade
    return unidade[fieldName] as number | null
  }

  // Função para obter valor por m² de uma fase específica
  const getValorM2Fase = (unidade: ValorUnidade, ordem: number) => {
    const fieldName = `valor_m2_fase_${ordem}` as keyof ValorUnidade
    return unidade[fieldName] as number | null
  }

  // Função para obter todas as fases com valores da view vw_unidades_por_cenario
  const getAllFasesWithValues = (unidade: ValorUnidade) => {
    const fasesComValores = []

    // Adicionar valor inicial
    fasesComValores.push({
      nome: "Valor Inicial",
      valor: unidade.valor_unidade_inicial,
      valorM2: unidade.valor_m2_inicial,
      isVendida: false,
    })

    // Adicionar fases ordenadas baseadas nos dados da view
    const fasesOrdenadas = [...fases].sort((a, b) => a.ordem - b.ordem)

    fasesOrdenadas.forEach((fase) => {
      const valorFase = getValorFase(unidade, fase.ordem)
      const valorM2Fase = getValorM2Fase(unidade, fase.ordem)

      fasesComValores.push({
        nome: fase.nome,
        valor: valorFase,
        valorM2: valorM2Fase,
        isVendida: unidade.fase_unidade_venda === fase.nome,
      })
    })

    return fasesComValores
  }

  // Filtrar unidades baseado nos filtros selecionados
  const unidadesFiltradas = useMemo(() => {
    let filtered = valoresUnidades

    // Filtrar por tipologia
    if (selectedTipologias.length > 0) {
      filtered = filtered.filter((unidade) => selectedTipologias.includes(unidade.tipologia))
    }

    // Filtrar por pavimento
    if (selectedPavimentos.length > 0) {
      filtered = filtered.filter((unidade) => selectedPavimentos.includes(unidade.pavimento))
    }

    // Filtrar por terminação do nome
    if (selectedTerminacoes.length > 0) {
      filtered = filtered.filter((unidade) => {
        const terminacao = extrairTerminacao(unidade.unidade_nome)
        return terminacao && selectedTerminacoes.includes(terminacao)
      })
    }

    return filtered
  }, [valoresUnidades, selectedTipologias, selectedPavimentos, selectedTerminacoes])

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <Skeleton className="h-6 w-48 bg-gray-700" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 bg-gray-700" />
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-gray-700" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 bg-gray-700" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!valoresUnidades || valoresUnidades.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-gray-400">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-600" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma unidade encontrada</h3>
            <p>Selecione um empreendimento e cenário para visualizar a evolução de preços das unidades.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <EvolucaoPrecosFilters
        valoresUnidades={valoresUnidades}
        selectedTipologias={selectedTipologias}
        selectedPavimentos={selectedPavimentos}
        selectedTerminacoes={selectedTerminacoes}
        onTipologiasChange={setSelectedTipologias}
        onPavimentosChange={setSelectedPavimentos}
        onTerminacoesChange={setSelectedTerminacoes}
      />

      {/* Resultado dos filtros */}
      {unidadesFiltradas.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center text-gray-400">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma unidade encontrada</h3>
              <p>Nenhuma unidade atende aos filtros selecionados. Tente ajustar os filtros.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Contador de resultados */}
          <div className="text-sm text-gray-400 mb-4">
            Exibindo {unidadesFiltradas.length} de {valoresUnidades.length} unidades
          </div>

          {/* Cards das unidades */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {unidadesFiltradas.map((unidade) => {
              const totalVagas =
                (unidade.qtd_vaga_simples || 0) + (unidade.qtd_vaga_duplas || 0) + (unidade.qtd_vaga_moto || 0)
              const vagasDescription = [
                unidade.qtd_vaga_simples && `${unidade.qtd_vaga_simples} simples`,
                unidade.qtd_vaga_duplas && `${unidade.qtd_vaga_duplas} dupla${unidade.qtd_vaga_duplas > 1 ? "s" : ""}`,
                unidade.qtd_vaga_moto && `${unidade.qtd_vaga_moto} moto`,
              ]
                .filter(Boolean)
                .join(", ")

              return (
                <Card key={unidade.unidade_id} className="bg-gray-800 border-gray-700 h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        {unidade.unidade_nome}
                      </CardTitle>
                      {unidade.fase_unidade_venda && (
                        <Badge className="bg-green-600 text-white">{unidade.fase_unidade_venda}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      {/* Detalhes da Unidade - Consultando diretamente da view vw_unidades_por_cenario */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-300 border-b border-gray-600 pb-2">
                          Detalhes da Unidade
                        </h4>
                        <div className="space-y-3">
                          {/* Nome da Unidade */}
                          <div className="flex items-center gap-2 text-sm">
                            <Home className="h-4 w-4 text-primary" />
                            <span className="text-gray-400">Nome:</span>
                            <span className="text-white font-medium">{unidade.unidade_nome}</span>
                          </div>

                          {/* Tipologia */}
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="h-4 w-4 text-primary" />
                            <span className="text-gray-400">Tipologia:</span>
                            <Badge variant="outline" className="text-white border-gray-600">
                              {unidade.tipologia}
                            </Badge>
                          </div>

                          {/* Pavimento e Bloco */}
                          <div className="flex items-center gap-2 text-sm">
                            <Layers className="h-4 w-4 text-primary" />
                            <span className="text-gray-400">Localização:</span>
                            <span className="text-white">
                              Pavimento {unidade.pavimento || 0}
                              {unidade.bloco && ` - Bloco ${unidade.bloco}`}
                            </span>
                          </div>

                          {/* Área Privativa */}
                          <div className="flex items-center gap-2 text-sm">
                            <Square className="h-4 w-4 text-primary" />
                            <span className="text-gray-400">Área Privativa:</span>
                            <span className="text-white font-medium">{unidade.area_privativa}m²</span>
                          </div>

                          {/* Área Garden (se existir) */}
                          {unidade.area_garden && unidade.area_garden > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                              <TreePine className="h-4 w-4 text-green-400" />
                              <span className="text-gray-400">Área Garden:</span>
                              <span className="text-white font-medium">{unidade.area_garden}m²</span>
                            </div>
                          )}

                          {/* Vagas Simples */}
                          {(unidade.qtd_vaga_simples || 0) > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                              <Car className="h-4 w-4 text-primary" />
                              <span className="text-gray-400">Vagas Simples:</span>
                              <span className="text-white font-medium">{unidade.qtd_vaga_simples}</span>
                            </div>
                          )}

                          {/* Vagas Duplas */}
                          {(unidade.qtd_vaga_duplas || 0) > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                              <Car className="h-4 w-4 text-blue-400" />
                              <span className="text-gray-400">Vagas Duplas:</span>
                              <span className="text-white font-medium">{unidade.qtd_vaga_duplas}</span>
                            </div>
                          )}

                          {/* Vagas Moto */}
                          {(unidade.qtd_vaga_moto || 0) > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                              <Car className="h-4 w-4 text-orange-400" />
                              <span className="text-gray-400">Vagas Moto:</span>
                              <span className="text-white font-medium">{unidade.qtd_vaga_moto}</span>
                            </div>
                          )}

                          {/* Total de Vagas (resumo) */}
                          {totalVagas > 0 && (
                            <div className="flex items-start gap-2 text-sm">
                              <Car className="h-4 w-4 text-primary mt-0.5" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-400">Total de Vagas:</span>
                                  <span className="text-white font-medium">
                                    {totalVagas} {totalVagas === 1 ? "vaga" : "vagas"}
                                  </span>
                                </div>
                                {vagasDescription && (
                                  <div className="text-xs text-gray-500 mt-1">({vagasDescription})</div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Hobby Boxes */}
                          <div className="flex items-center gap-2 text-sm">
                            <Box className="h-4 w-4 text-primary" />
                            <span className="text-gray-400">Hobby Boxes:</span>
                            <span className="text-white font-medium">{unidade.qtd_hobby_boxes || 0}</span>
                          </div>

                          {/* Suítes */}
                          <div className="flex items-center gap-2 text-sm">
                            <BedDouble className="h-4 w-4 text-primary" />
                            <span className="text-gray-400">Suítes:</span>
                            <span className="text-white font-medium">{unidade.qtd_suite || 0}</span>
                          </div>

                          {/* Orientação Solar */}
                          {unidade.orientacao_solar && (
                            <div className="flex items-center gap-2 text-sm">
                              <Sun className="h-4 w-4 text-yellow-400" />
                              <span className="text-gray-400">Orientação Solar:</span>
                              <span className="text-white">{unidade.orientacao_solar}</span>
                            </div>
                          )}

                          {/* Vista */}
                          {unidade.vista && (
                            <div className="flex items-center gap-2 text-sm">
                              <Eye className="h-4 w-4 text-blue-400" />
                              <span className="text-gray-400">Vista:</span>
                              <span className="text-white">{unidade.vista}</span>
                            </div>
                          )}

                          {/* Diferencial */}
                          {unidade.diferencial && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-purple-400" />
                              <span className="text-gray-400">Diferencial:</span>
                              <span className="text-white">{unidade.diferencial}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Valores por Fase - Usando dados da view vw_unidades_por_cenario */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-gray-300 border-b border-gray-600 pb-2">
                          Valores por Fase
                        </h4>
                        <div className="space-y-2">
                          {getAllFasesWithValues(unidade).map((fase, index) => (
                            <div
                              key={index}
                              className={`flex flex-col p-3 rounded text-sm transition-colors ${
                                fase.isVendida
                                  ? "bg-green-900/30 border border-green-600 text-green-400"
                                  : "text-gray-300 hover:bg-gray-700/50"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{fase.nome}</span>
                                <span className="font-mono text-base">
                                  {fase.valor !== null ? formatCurrency(fase.valor) : "N/A"}
                                </span>
                              </div>
                              {/* Valor por m² */}
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Valor por m²:</span>
                                <span className="text-xs font-mono text-primary">
                                  {fase.valorM2 !== null ? formatCurrency(fase.valorM2) + "/m²" : "N/A"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Resumo do valor atual */}
                        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                          <div className="text-center">
                            <div className="text-xs text-gray-400 mb-1">Valor Atual</div>
                            <div className="text-lg font-bold text-primary">
                              {formatCurrency(unidade.valor_unidade_venda)}
                            </div>
                            <div className="text-xs text-primary mt-1">
                              {unidade.valor_m2_venda ? formatCurrency(unidade.valor_m2_venda) + "/m²" : "N/A"}
                            </div>
                            {unidade.fase_unidade_venda && (
                              <div className="text-xs text-gray-400 mt-1">Alocada na {unidade.fase_unidade_venda}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
