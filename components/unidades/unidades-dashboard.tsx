"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DetalhamentoCalculoTable } from "@/components/dashboard/detalhamento-calculo-table"
import { useDetalhamentoCalculo } from "@/hooks/use-detalhamento-calculo"
import { supabase } from "@/lib/supabase/client"
import { Building, Layers } from "lucide-react"

interface Empreendimento {
  id: number
  nome: string
}

interface Cenario {
  id: number
  nome: string
  empreendimento_id: number
}

interface UnidadesDashboardProps {
  initialEmpreendimentoId?: number
  initialCenarioId?: number
}

export function UnidadesDashboard({ initialEmpreendimentoId, initialCenarioId }: UnidadesDashboardProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [empreendimentos, setEmpreendimentos] = useState<Empreendimento[]>([])
  const [cenarios, setCenarios] = useState<Cenario[]>([])

  const [selectedEmpreendimentoId, setSelectedEmpreendimentoId] = useState<number | undefined>(initialEmpreendimentoId)
  const [selectedCenarioId, setSelectedCenarioId] = useState<number | undefined>(initialCenarioId)
  const [isLoadingFilters, setIsLoadingFilters] = useState(true)

  useEffect(() => {
    const spEmpreendimentoId = searchParams.get("empreendimento")
    const spCenarioId = searchParams.get("cenario")

    const currentEmpId = initialEmpreendimentoId ?? (spEmpreendimentoId ? Number(spEmpreendimentoId) : undefined)
    const currentCenId = initialCenarioId ?? (spCenarioId ? Number(spCenarioId) : undefined)

    setSelectedEmpreendimentoId(currentEmpId)
    setSelectedCenarioId(currentCenId)
  }, [searchParams, initialEmpreendimentoId, initialCenarioId])

  useEffect(() => {
    async function fetchEmpreendimentos() {
      setIsLoadingFilters(true)
      const { data, error } = await supabase.from("empreendimento").select("id, nome").order("nome")
      if (data) setEmpreendimentos(data)
      if (error) console.error("Error fetching empreendimentos:", error.message)
      setIsLoadingFilters(false)
    }
    fetchEmpreendimentos()
  }, [])

  useEffect(() => {
    async function fetchCenarios() {
      if (selectedEmpreendimentoId) {
        setIsLoadingFilters(true)
        const { data, error } = await supabase
          .from("cenario")
          .select("id, nome, empreendimento_id")
          .eq("empreendimento_id", selectedEmpreendimentoId)
          .order("nome")
        if (data) setCenarios(data)
        else setCenarios([])
        if (error) console.error("Error fetching cenarios:", error.message)
        setIsLoadingFilters(false)
      } else {
        setCenarios([])
        setIsLoadingFilters(false)
      }
    }
    fetchCenarios()
  }, [selectedEmpreendimentoId])

  const updateURLParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (selectedEmpreendimentoId) {
      params.set("empreendimento", selectedEmpreendimentoId.toString())
    } else {
      params.delete("empreendimento")
    }
    if (selectedCenarioId) {
      params.set("cenario", selectedCenarioId.toString())
    } else {
      params.delete("cenario")
    }
    router.replace(`/unidades/dashboard?${params.toString()}`, { scroll: false })
  }, [selectedEmpreendimentoId, selectedCenarioId, router, searchParams])

  useEffect(() => {
    updateURLParams()
  }, [selectedEmpreendimentoId, selectedCenarioId, updateURLParams])

  const handleEmpreendimentoChange = (value: string) => {
    const id = value ? Number(value) : undefined
    setSelectedEmpreendimentoId(id)
    setSelectedCenarioId(undefined) // Reset cenario when empreendimento changes
    if (!id) setCenarios([])
  }

  const handleCenarioChange = (value: string) => {
    const id = value ? Number(value) : undefined
    setSelectedCenarioId(id)
  }

  const {
    detalhamentos,
    loading: loadingTableData,
    error: tableError,
  } = useDetalhamentoCalculo(selectedEmpreendimentoId, selectedCenarioId)

  const showTable = !!(selectedEmpreendimentoId && selectedCenarioId)

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white">Filtros</CardTitle>
          <CardDescription className="text-gray-400">
            Selecione o empreendimento e o cenário para ver o detalhamento.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4 p-4">
          <div>
            <label htmlFor="empreendimento-select" className="block text-sm font-medium text-gray-300 mb-1">
              <Building className="inline-block h-4 w-4 mr-1 text-gray-400" /> Empreendimento
            </label>
            <Select
              value={selectedEmpreendimentoId?.toString() ?? ""}
              onValueChange={handleEmpreendimentoChange}
              disabled={isLoadingFilters}
            >
              <SelectTrigger id="empreendimento-select" className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                <SelectItem value="" className="text-gray-400">
                  Nenhum
                </SelectItem>
                {empreendimentos.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id.toString()}>
                    {emp.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="cenario-select" className="block text-sm font-medium text-gray-300 mb-1">
              <Layers className="inline-block h-4 w-4 mr-1 text-gray-400" /> Cenário
            </label>
            <Select
              value={selectedCenarioId?.toString() ?? ""}
              onValueChange={handleCenarioChange}
              disabled={isLoadingFilters || !selectedEmpreendimentoId || cenarios.length === 0}
            >
              <SelectTrigger id="cenario-select" className="bg-gray-700 border-gray-600 text-white">
                <SelectValue
                  placeholder={!selectedEmpreendimentoId ? "Selecione um empreendimento primeiro" : "Selecione..."}
                />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                <SelectItem value="" className="text-gray-400">
                  Nenhum
                </SelectItem>
                {cenarios.map((cen) => (
                  <SelectItem key={cen.id} value={cen.id.toString()}>
                    {cen.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {showTable ? (
        <DetalhamentoCalculoTable detalhamentos={detalhamentos} loading={loadingTableData} error={tableError} />
      ) : (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-10 text-center">
            <p className="text-gray-400">
              {isLoadingFilters
                ? "Carregando filtros..."
                : "Por favor, selecione um empreendimento e um cenário para visualizar o detalhamento do cálculo."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
