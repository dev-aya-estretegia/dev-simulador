"use client"

import { useState } from "react"
import { UnidadesHeader } from "@/components/unidades/unidades-header"
import { UnidadesFilters } from "@/components/unidades/unidades-filters"
import { UnidadesTable } from "@/components/unidades/unidades-table"
import { UnidadesEmpty } from "@/components/unidades/unidades-empty"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UnidadesDetalhamentoTable } from "@/components/unidades/unidades-detalhamento-table"
import { useDetalhamentoCalculo } from "@/hooks/use-detalhamento-calculo"

interface UnidadesClientPageProps {
  empreendimentos: { id: number; nome: string }[]
  cenarios: { id: number; nome: string; empreendimento_id: number }[]
  cenarioSelecionado?: string
  empreendimentoSelecionado?: string
  unidades: any[]
  temUnidades: boolean
  blocos: { value: string; label: string }[]
  pavimentos: { value: string; label: string }[]
  filtros: {
    tipologia?: string
    busca?: string
    ordenacao?: string
  }
}

export function UnidadesClientPage({
  empreendimentos,
  cenarios,
  cenarioSelecionado,
  empreendimentoSelecionado,
  unidades,
  temUnidades,
  blocos,
  pavimentos,
  filtros,
}: UnidadesClientPageProps) {
  const [unidadesSelecionadas, setUnidadesSelecionadas] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("unidades")

  // Usar o hook para buscar detalhamento de cálculo
  const empreendimentoIdNum = empreendimentoSelecionado ? Number.parseInt(empreendimentoSelecionado) : null
  const cenarioIdNum = cenarioSelecionado ? Number.parseInt(cenarioSelecionado) : null

  const {
    detalhamentos,
    loading: loadingDetalhamento,
    error: errorDetalhamento,
  } = useDetalhamentoCalculo(empreendimentoIdNum, cenarioIdNum)

  // Filtrar detalhamento por busca e tipologia (se houver)
  let detalhamentoFiltrado = detalhamentos

  if (filtros.busca) {
    const buscaLower = filtros.busca.toLowerCase()
    detalhamentoFiltrado = detalhamentoFiltrado.filter(
      (d) =>
        d.unidade.toLowerCase().includes(buscaLower) ||
        (d.bloco && d.bloco.toLowerCase().includes(buscaLower)) ||
        (d.tipologia && d.tipologia.toLowerCase().includes(buscaLower)),
    )
  }

  if (filtros.tipologia && filtros.tipologia !== "0") {
    detalhamentoFiltrado = detalhamentoFiltrado.filter((d) => d.tipologia === filtros.tipologia)
  }

  function handleLimparSelecao() {
    setUnidadesSelecionadas([])
  }

  return (
    <>
      <UnidadesHeader unidadesSelecionadas={unidadesSelecionadas} onLimparSelecao={handleLimparSelecao} />
      <UnidadesFilters
        empreendimentos={empreendimentos}
        cenarios={cenarios}
        cenarioSelecionado={cenarioSelecionado}
        empreendimentoSelecionado={empreendimentoSelecionado}
        blocos={blocos}
        pavimentos={pavimentos}
        filtros={filtros}
      />

      {temUnidades ? (
        <Tabs defaultValue="unidades" className="mt-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unidades">Unidades</TabsTrigger>
            <TabsTrigger value="detalhamento">
              Detalhamento de Cálculo
              {loadingDetalhamento && " (Carregando...)"}
              {errorDetalhamento && " (Erro)"}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="unidades" className="mt-4">
            <UnidadesTable
              unidades={unidades}
              onSelecaoChange={setUnidadesSelecionadas}
              selectedUnidades={unidadesSelecionadas}
            />
          </TabsContent>
          <TabsContent value="detalhamento" className="mt-4">
            {loadingDetalhamento ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Carregando detalhamento de cálculo...</div>
              </div>
            ) : errorDetalhamento ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-red-500">Erro ao carregar detalhamento: {errorDetalhamento}</div>
              </div>
            ) : detalhamentoFiltrado.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">
                  {empreendimentoSelecionado
                    ? "Nenhum cálculo encontrado para este empreendimento. Verifique se há cenários e parâmetros configurados."
                    : "Selecione um empreendimento para visualizar o detalhamento de cálculo."}
                </div>
              </div>
            ) : (
              <UnidadesDetalhamentoTable detalhamento={detalhamentoFiltrado} />
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <UnidadesEmpty />
      )}
    </>
  )
}
