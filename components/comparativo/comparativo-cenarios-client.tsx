"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useSupabaseQuery } from "@/hooks/use-supabase-query"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface ComparativoCenarios {
  empreendimento: string
  cenario_1: string
  vgv_cenario_1: number
  valor_m2_cenario_1: number
  cenario_2: string
  vgv_cenario_2: number
  valor_m2_cenario_2: number
  diferenca_vgv: number
  diferenca_percentual: number
}

export function ComparativoCenariosClient() {
  const [empreendimentoSelecionado, setEmpreendimentoSelecionado] = useState<string>("todos")

  const {
    data: comparativos,
    isLoading,
    error,
  } = useSupabaseQuery<ComparativoCenarios[]>({
    queryKey: ["comparativo-cenarios"],
    queryFn: async (supabase) => {
      const { data, error } = await supabase
        .from("vw_comparativo_cenarios")
        .select("*")
        .order("empreendimento")
        .order("cenario_1")

      if (error) throw error
      return data || []
    },
  })

  const empreendimentos = Array.from(new Set(comparativos?.map((c) => c.empreendimento) || []))

  const comparativosFiltrados =
    comparativos?.filter(
      (c) => empreendimentoSelecionado === "todos" || c.empreendimento === empreendimentoSelecionado,
    ) || []

  const getTrendIcon = (diferenca: number) => {
    if (diferenca > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (diferenca < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getTrendColor = (diferenca: number) => {
    if (diferenca > 0) return "text-green-600"
    if (diferenca < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getBadgeVariant = (diferenca: number) => {
    if (diferenca > 5) return "default" // Verde para ganhos significativos
    if (diferenca < -5) return "destructive" // Vermelho para perdas significativas
    return "secondary" // Cinza para diferenças pequenas
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-600">Erro ao carregar dados: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  if (!comparativos || comparativos.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600">
            Nenhum comparativo disponível. É necessário ter pelo menos 2 cenários por empreendimento.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Selecione um empreendimento para filtrar as comparações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Empreendimento</label>
              <Select value={empreendimentoSelecionado} onValueChange={setEmpreendimentoSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um empreendimento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os empreendimentos</SelectItem>
                  {empreendimentos.map((emp) => (
                    <SelectItem key={emp} value={emp}>
                      {emp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparativos */}
      <div className="grid gap-4">
        {comparativosFiltrados.map((comp, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{comp.empreendimento}</CardTitle>
                  <CardDescription>
                    Comparação: {comp.cenario_1} vs {comp.cenario_2}
                  </CardDescription>
                </div>
                <Badge variant={getBadgeVariant(comp.diferenca_percentual)}>
                  {comp.diferenca_percentual > 0 ? "+" : ""}
                  {comp.diferenca_percentual.toFixed(1)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Cenário 1 */}
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-600">{comp.cenario_1}</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">VGV:</span>
                      <span className="font-medium">{formatCurrency(comp.vgv_cenario_1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Valor/m²:</span>
                      <span className="font-medium">{formatCurrency(comp.valor_m2_cenario_1)}</span>
                    </div>
                  </div>
                </div>

                {/* Cenário 2 */}
                <div className="space-y-2">
                  <h4 className="font-medium text-green-600">{comp.cenario_2}</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">VGV:</span>
                      <span className="font-medium">{formatCurrency(comp.vgv_cenario_2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Valor/m²:</span>
                      <span className="font-medium">{formatCurrency(comp.valor_m2_cenario_2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diferenças */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(comp.diferenca_vgv)}
                    <span className="text-sm font-medium">Diferença no VGV:</span>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${getTrendColor(comp.diferenca_vgv)}`}>
                      {comp.diferenca_vgv > 0 ? "+" : ""}
                      {formatCurrency(comp.diferenca_vgv)}
                    </div>
                    <div className={`text-sm ${getTrendColor(comp.diferenca_percentual)}`}>
                      ({comp.diferenca_percentual > 0 ? "+" : ""}
                      {comp.diferenca_percentual.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {comparativosFiltrados.length === 0 && empreendimentoSelecionado !== "todos" && (
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600">Nenhum comparativo encontrado para o empreendimento selecionado.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
