"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useSupabase } from "@/hooks/use-supabase"
import { formatCurrency } from "@/lib/utils"
import { BotaoAlocarUnidades } from "./botao-alocar-unidades"
import { Edit, Trash2 } from "lucide-react"

interface ListaFasesProps {
  cenarioId: number
  onEditFase?: (faseId: number) => void
  onDeleteFase?: (faseId: number) => void
}

interface Fase {
  id: number
  nome: string
  ordem: number
  percentual_reajuste: number
  data_inicio: string
  data_fim: string
  descricao: string
  total_unidades: number
  valor_total: number
}

export function ListaFases({ cenarioId, onEditFase, onDeleteFase }: ListaFasesProps) {
  const [fases, setFases] = useState<Fase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { supabase } = useSupabase()
  const { toast } = useToast()

  const carregarFases = async () => {
    setIsLoading(true)
    try {
      // Buscar fases do cenário
      const { data, error } = await supabase
        .from("fase_venda")
        .select(`
          id, nome, ordem, percentual_reajuste, data_inicio, data_fim, descricao
        `)
        .eq("cenario_id", cenarioId)
        .order("ordem")

      if (error) {
        console.error("Erro ao buscar fases:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as fases.",
          variant: "destructive",
        })
        return
      }

      // Para cada fase, buscar estatísticas de unidades
      const fasesComEstatisticas = await Promise.all(
        (data || []).map(async (fase) => {
          // Buscar unidades alocadas na fase
          const { data: unidades, error: errorUnidades } = await supabase.rpc("fn_buscar_unidades_alocadas_na_fase", {
            p_fase_id: fase.id,
            p_cenario_id: cenarioId,
          })

          if (errorUnidades) {
            console.error("Erro ao buscar unidades da fase:", errorUnidades)
            return {
              ...fase,
              total_unidades: 0,
              valor_total: 0,
            }
          }

          // Calcular estatísticas
          const total_unidades = unidades?.length || 0
          const valor_total = unidades?.reduce((sum, u) => sum + (u.valor_unidade_na_fase || 0), 0) || 0

          return {
            ...fase,
            total_unidades,
            valor_total,
          }
        }),
      )

      setFases(fasesComEstatisticas)
    } catch (error) {
      console.error("Erro ao carregar fases:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar as fases.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (cenarioId) {
      carregarFases()
    }
  }, [cenarioId])

  const handleAlocacaoSuccess = () => {
    carregarFases()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Fases de Venda</h2>
        <Button variant="default" size="sm" onClick={() => onEditFase && onEditFase(0)}>
          Nova Fase
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center p-8">Carregando fases...</div>
      ) : fases.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Nenhuma fase cadastrada para este cenário.</p>
            <Button variant="outline" className="mt-4" onClick={() => onEditFase && onEditFase(0)}>
              Adicionar Fase
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fases.map((fase) => (
            <Card key={fase.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{fase.nome}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">Ordem: {fase.ordem}</Badge>
                      <Badge variant="default">Reajuste: {fase.percentual_reajuste}%</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEditFase && onEditFase(fase.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDeleteFase && onDeleteFase(fase.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Início</p>
                    <p className="font-medium">
                      {fase.data_inicio ? new Date(fase.data_inicio).toLocaleDateString() : "Não definido"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fim</p>
                    <p className="font-medium">
                      {fase.data_fim ? new Date(fase.data_fim).toLocaleDateString() : "Não definido"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Unidades Alocadas</p>
                    <p className="font-medium">{fase.total_unidades}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Valor Total</p>
                    <p className="font-medium">{formatCurrency(fase.valor_total)}</p>
                  </div>
                </div>

                {fase.descricao && (
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground">Descrição</p>
                    <p className="text-sm">{fase.descricao}</p>
                  </div>
                )}

                <div className="flex justify-end">
                  <BotaoAlocarUnidades faseId={fase.id} cenarioId={cenarioId} onSuccess={handleAlocacaoSuccess} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
