"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Edit, Home, Calculator, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatPercentage } from "@/lib/utils"

interface UnidadeDetalhesProps {
  unidade: any
  detalhamentoCalculo?: any
}

export function UnidadeDetalhes({ unidade, detalhamentoCalculo }: UnidadeDetalhesProps) {
  const [activeTab, setActiveTab] = useState("geral")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/unidades?cenario=${unidade.cenario_id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              {unidade.unidade_nome}
            </h1>
            <p className="text-muted-foreground flex items-center gap-1 mt-1">
              Empreendimento: {unidade.empreendimento_nome} | Cenário: {unidade.cenario_nome}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link
              href={`/unidades/${unidade.unidade_id}/editar?cenario=${unidade.cenario_id}`}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:grid-cols-none md:auto-cols-auto">
          <TabsTrigger value="geral">Informações Gerais</TabsTrigger>
          <TabsTrigger value="valores">Valores</TabsTrigger>
          <TabsTrigger value="detalhamento">Detalhamento do Cálculo</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Características da Unidade
              </CardTitle>
              <CardDescription>Informações básicas sobre a unidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Identificação</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Nome:</span>
                    <span>{unidade.unidade_nome}</span>
                    <span className="text-muted-foreground">Tipologia:</span>
                    <span>
                      <Badge
                        variant="outline"
                        className={
                          unidade.tipologia === "Apartamento"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : unidade.tipologia === "Studio"
                              ? "bg-secondary/10 text-secondary border-secondary/20"
                              : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        }
                      >
                        {unidade.tipologia}
                      </Badge>
                    </span>
                    <span className="text-muted-foreground">Pavimento:</span>
                    <span>{unidade.pavimento}</span>
                    <span className="text-muted-foreground">Bloco:</span>
                    <span>{unidade.bloco}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Áreas</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Área Privativa:</span>
                    <span>{unidade.area_privativa} m²</span>
                    <span className="text-muted-foreground">Área Garden:</span>
                    <span>{unidade.area_garden ? `${unidade.area_garden} m²` : "N/A"}</span>
                    <span className="text-muted-foreground">Área Total:</span>
                    <span>{unidade.area_privativa + (unidade.area_garden || 0)} m²</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Características</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Orientação Solar:</span>
                    <span>{unidade.orientacao_solar}</span>
                    <span className="text-muted-foreground">Vista:</span>
                    <span>{unidade.vista || "N/A"}</span>
                    <span className="text-muted-foreground">Diferencial:</span>
                    <span>{unidade.diferencial || "N/A"}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Itens Adicionais</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-card border border-border rounded-lg p-3 text-center">
                    <span className="text-muted-foreground text-xs">Vagas Simples</span>
                    <p className="text-xl font-semibold">{unidade.qtd_vaga_simples}</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-3 text-center">
                    <span className="text-muted-foreground text-xs">Vagas Duplas</span>
                    <p className="text-xl font-semibold">{unidade.qtd_vaga_duplas}</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-3 text-center">
                    <span className="text-muted-foreground text-xs">Vagas Moto</span>
                    <p className="text-xl font-semibold">{unidade.qtd_vaga_moto}</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-3 text-center">
                    <span className="text-muted-foreground text-xs">Hobby Boxes</span>
                    <p className="text-xl font-semibold">{unidade.qtd_hobby_boxes}</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-3 text-center">
                    <span className="text-muted-foreground text-xs">Suítes</span>
                    <p className="text-xl font-semibold">{unidade.qtd_suite}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="valores" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Valores da Unidade
              </CardTitle>
              <CardDescription>Valores calculados para esta unidade no cenário {unidade.cenario_nome}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <span className="text-muted-foreground text-sm">Valor Inicial</span>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(unidade.valor_unidade_inicial)}</p>
                    <span className="text-xs text-muted-foreground">
                      Valor base calculado com os parâmetros do cenário
                    </span>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-4">
                    <span className="text-muted-foreground text-sm">Valor de Venda</span>
                    <p className="text-2xl font-bold text-primary">{formatCurrency(unidade.valor_unidade_venda)}</p>
                    <span className="text-xs text-muted-foreground">
                      {unidade.fase_unidade_venda
                        ? `Valor na fase ${unidade.fase_unidade_venda}`
                        : "Valor final sem alocação em fase"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Valores por Fase</h3>
                  <div className="space-y-2">
                    {unidade.valor_unidade_fase_1 !== null && (
                      <div className="flex justify-between items-center p-2 border-b border-border">
                        <span className="font-medium">Fase 1</span>
                        <span className={unidade.fase_unidade_venda === "Fase 1" ? "text-primary font-bold" : ""}>
                          {formatCurrency(unidade.valor_unidade_fase_1)}
                        </span>
                      </div>
                    )}
                    {unidade.valor_unidade_fase_2 !== null && (
                      <div className="flex justify-between items-center p-2 border-b border-border">
                        <span className="font-medium">Fase 2</span>
                        <span className={unidade.fase_unidade_venda === "Fase 2" ? "text-primary font-bold" : ""}>
                          {formatCurrency(unidade.valor_unidade_fase_2)}
                        </span>
                      </div>
                    )}
                    {unidade.valor_unidade_fase_3 !== null && (
                      <div className="flex justify-between items-center p-2 border-b border-border">
                        <span className="font-medium">Fase 3</span>
                        <span className={unidade.fase_unidade_venda === "Fase 3" ? "text-primary font-bold" : ""}>
                          {formatCurrency(unidade.valor_unidade_fase_3)}
                        </span>
                      </div>
                    )}
                    {unidade.valor_unidade_fase_4 !== null && (
                      <div className="flex justify-between items-center p-2 border-b border-border">
                        <span className="font-medium">Fase 4</span>
                        <span className={unidade.fase_unidade_venda === "Fase 4" ? "text-primary font-bold" : ""}>
                          {formatCurrency(unidade.valor_unidade_fase_4)}
                        </span>
                      </div>
                    )}
                    {unidade.valor_unidade_fase_5 !== null && (
                      <div className="flex justify-between items-center p-2 border-b border-border">
                        <span className="font-medium">Fase 5</span>
                        <span className={unidade.fase_unidade_venda === "Fase 5" ? "text-primary font-bold" : ""}>
                          {formatCurrency(unidade.valor_unidade_fase_5)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-primary/10 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Fase Atual:</span>
                      <span className="font-bold">{unidade.fase_unidade_venda || "Não alocada"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detalhamento" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Detalhamento do Cálculo
              </CardTitle>
              <CardDescription>Detalhamento dos cálculos aplicados a esta unidade</CardDescription>
            </CardHeader>
            <CardContent>
              {detalhamentoCalculo ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Cálculo do Valor Base</h3>
                    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">Área Privativa:</span>
                        <span>{detalhamentoCalculo.area_privativa} m²</span>
                        <span className="text-muted-foreground">Valor do m² ({detalhamentoCalculo.tipologia}):</span>
                        <span>{formatCurrency(detalhamentoCalculo.valor_m2_tipologia)}</span>
                        <span className="text-muted-foreground">Valor Área Privativa:</span>
                        <span>{formatCurrency(detalhamentoCalculo.valor_area_privativa_calculado)}</span>
                      </div>

                      {detalhamentoCalculo.area_garden && (
                        <>
                          <Separator />
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Área Garden:</span>
                            <span>{detalhamentoCalculo.area_garden} m²</span>
                            <span className="text-muted-foreground">Valor do m² Garden:</span>
                            <span>{formatCurrency(detalhamentoCalculo.valor_m2_garden)}</span>
                            <span className="text-muted-foreground">Valor Garden:</span>
                            <span>{formatCurrency(detalhamentoCalculo.valor_garden_calculado)}</span>
                          </div>
                        </>
                      )}

                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Valor Base Total:</span>
                        <span className="font-bold text-primary">
                          {formatCurrency(detalhamentoCalculo.valor_unidade_base)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Itens Adicionais</h3>
                    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-muted-foreground">Item</span>
                        <span className="text-muted-foreground">Quantidade</span>
                        <span className="text-muted-foreground">Valor</span>

                        <span>Vagas Simples</span>
                        <span>{detalhamentoCalculo.qtd_vaga_simples}</span>
                        <span>{formatCurrency(detalhamentoCalculo.valor_vagas_simples)}</span>

                        <span>Vagas Duplas</span>
                        <span>{detalhamentoCalculo.qtd_vaga_duplas}</span>
                        <span>{formatCurrency(detalhamentoCalculo.valor_vagas_duplas)}</span>

                        <span>Vagas Moto</span>
                        <span>{detalhamentoCalculo.qtd_vaga_moto}</span>
                        <span>{formatCurrency(detalhamentoCalculo.valor_vagas_moto)}</span>

                        <span>Hobby Boxes</span>
                        <span>{detalhamentoCalculo.qtd_hobby_boxes}</span>
                        <span>{formatCurrency(detalhamentoCalculo.valor_hobby_boxes)}</span>

                        <span>Suítes</span>
                        <span>{detalhamentoCalculo.qtd_suite}</span>
                        <span>{formatCurrency(detalhamentoCalculo.valor_suites)}</span>
                      </div>

                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Valor Adicionais Total:</span>
                        <span className="font-bold text-primary">
                          {formatCurrency(detalhamentoCalculo.valor_unidade_adicionais)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Fatores de Valorização</h3>
                    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-muted-foreground">Fator</span>
                        <span className="text-muted-foreground">Percentual</span>
                        <span className="text-muted-foreground">Valor</span>

                        <span>Orientação Solar ({detalhamentoCalculo.orientacao_solar})</span>
                        <span>{formatPercentage(detalhamentoCalculo.percentual_orientacao)}</span>
                        <span>{formatCurrency(detalhamentoCalculo.valor_unidade_orientacao)}</span>

                        <span>Pavimento ({detalhamentoCalculo.pavimento})</span>
                        <span>{formatPercentage(detalhamentoCalculo.percentual_pavimento)}</span>
                        <span>{formatCurrency(detalhamentoCalculo.valor_unidade_pavimento)}</span>

                        {detalhamentoCalculo.vista && (
                          <>
                            <span>Vista ({detalhamentoCalculo.vista})</span>
                            <span>{formatPercentage(detalhamentoCalculo.percentual_vista)}</span>
                            <span>{formatCurrency(detalhamentoCalculo.valor_unidade_vista)}</span>
                          </>
                        )}

                        {detalhamentoCalculo.diferencial && (
                          <>
                            <span>Diferencial ({detalhamentoCalculo.diferencial})</span>
                            <span>{formatPercentage(detalhamentoCalculo.percentual_diferencial)}</span>
                            <span>{formatCurrency(detalhamentoCalculo.valor_unidade_diferencial)}</span>
                          </>
                        )}

                        <span>Bloco ({detalhamentoCalculo.bloco})</span>
                        <span>{formatPercentage(detalhamentoCalculo.percentual_bloco)}</span>
                        <span>{formatCurrency(detalhamentoCalculo.valor_unidade_bloco)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/10 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Valor Inicial</span>
                        <p className="text-xl font-bold">{formatCurrency(detalhamentoCalculo.valor_unidade_inicial)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Valor de Venda</span>
                        <p className="text-xl font-bold">{formatCurrency(detalhamentoCalculo.valor_unidade_venda)}</p>
                      </div>
                      {detalhamentoCalculo.reajuste_total > 0 && (
                        <div className="col-span-2">
                          <span className="text-sm text-muted-foreground">Reajuste Total</span>
                          <p className="text-xl font-bold text-primary">
                            {formatPercentage(detalhamentoCalculo.reajuste_total)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Detalhamento do cálculo não disponível para esta unidade.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
