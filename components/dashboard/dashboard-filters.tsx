"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Target } from "lucide-react"

interface Empreendimento {
  id: number
  nome: string
}

interface CenarioOption {
  id: number
  nome: string
  empreendimento_id: number
}

interface DashboardFiltersProps {
  empreendimentos: Empreendimento[]
  cenarios: CenarioOption[]
  selectedEmpreendimento: number | null
  selectedCenario: number | null
  onEmpreendimentoChange: (empreendimentoId: number) => void
  onCenarioChange: (cenarioId: number) => void
  loading?: boolean
}

export function DashboardFilters({
  empreendimentos,
  cenarios,
  selectedEmpreendimento,
  selectedCenario,
  onEmpreendimentoChange,
  onCenarioChange,
  loading = false,
}: DashboardFiltersProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Filtros do Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filtro de Empreendimento */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Empreendimento
            </label>
            <Select
              value={selectedEmpreendimento?.toString() || ""}
              onValueChange={(value) => onEmpreendimentoChange(Number.parseInt(value))}
              disabled={loading || empreendimentos.length === 0}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Selecione um empreendimento" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {empreendimentos.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id.toString()} className="text-white hover:bg-gray-600">
                    {emp.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro de Cenário */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Cenário
            </label>
            <Select
              value={selectedCenario?.toString() || ""}
              onValueChange={(value) => onCenarioChange(Number.parseInt(value))}
              disabled={loading || cenarios.length === 0 || !selectedEmpreendimento}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Selecione um cenário" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {cenarios.map((cenario) => (
                  <SelectItem key={cenario.id} value={cenario.id.toString()} className="text-white hover:bg-gray-600">
                    {cenario.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="mt-4 text-sm text-gray-400">
          {loading && <p>Carregando dados...</p>}
          {!loading && empreendimentos.length === 0 && (
            <p>Nenhum empreendimento encontrado. Cadastre empreendimentos para visualizar o dashboard.</p>
          )}
          {!loading && selectedEmpreendimento && cenarios.length === 0 && (
            <p>Nenhum cenário encontrado para este empreendimento. Cadastre cenários para visualizar os dados.</p>
          )}
          {!loading && selectedEmpreendimento && selectedCenario && (
            <p>
              Exibindo dados do cenário selecionado. Total de {cenarios.length} cenário(s) disponível(is) para este
              empreendimento.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
