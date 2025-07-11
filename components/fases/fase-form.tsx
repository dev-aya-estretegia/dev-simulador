"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { useFase, useFaseOperations } from "@/hooks/use-fases"

type Props = {
  cenarioId: number
  faseId: number | null
  open: boolean
  onClose: () => void
}

export function FaseForm({ cenarioId, faseId, open, onClose }: Props) {
  const { data: faseExistente, isLoading: isLoadingFase } = useFase(faseId)
  const { criarFase, atualizarFase, isLoading: isSubmitting } = useFaseOperations()

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [ordem, setOrdem] = useState(1)
  const [percentualReajuste, setPercentualReajuste] = useState(0)
  const [dataInicio, setDataInicio] = useState<Date | null>(null)
  const [dataFim, setDataFim] = useState<Date | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (faseId && faseExistente) {
      setNome(faseExistente.nome || "")
      setDescricao(faseExistente.descricao || "")
      setOrdem(faseExistente.ordem || 1)
      setPercentualReajuste(faseExistente.percentual_reajuste || 0)
      setDataInicio(faseExistente.data_inicio ? new Date(faseExistente.data_inicio) : null)
      setDataFim(faseExistente.data_fim ? new Date(faseExistente.data_fim) : null)
    } else {
      // Reset form for new phase
      setNome("")
      setDescricao("")
      setOrdem(1)
      setPercentualReajuste(0)
      setDataInicio(null)
      setDataFim(null)
      setErrors({})
    }
  }, [faseExistente, faseId])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!nome.trim()) {
      newErrors.nome = "O nome da fase é obrigatório"
    }

    if (ordem <= 0) {
      newErrors.ordem = "A ordem deve ser um número positivo"
    }

    if (percentualReajuste < 0) {
      newErrors.percentualReajuste = "O percentual de reajuste não pode ser negativo"
    }

    if (dataInicio && dataFim && dataInicio > dataFim) {
      newErrors.dataFim = "A data de fim deve ser posterior à data de início"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const faseData = {
        nome,
        descricao,
        ordem,
        percentual_reajuste: percentualReajuste,
        data_inicio: dataInicio ? format(dataInicio, "yyyy-MM-dd") : null,
        data_fim: dataFim ? format(dataFim, "yyyy-MM-dd") : null,
      }

      if (faseId) {
        await atualizarFase({ id: faseId, cenario_id: cenarioId, ...faseData })
      } else {
        await criarFase({ cenario_id: cenarioId, ...faseData })
      }
      onClose()
    } catch (error) {
      // Error is handled by the hook's toast
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{faseId ? "Editar Fase" : "Nova Fase"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Fase</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Lançamento"
                disabled={isLoadingFase || isSubmitting}
              />
              {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ordem">Ordem</Label>
              <Input
                id="ordem"
                type="number"
                min="1"
                value={ordem}
                onChange={(e) => setOrdem(Number.parseInt(e.target.value, 10) || 1)}
                disabled={isLoadingFase || isSubmitting}
              />
              {errors.ordem && <p className="text-sm text-red-500">{errors.ordem}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="percentualReajuste">Percentual de Reajuste (%)</Label>
            <Input
              id="percentualReajuste"
              type="number"
              step="0.01"
              min="0"
              value={percentualReajuste}
              onChange={(e) => setPercentualReajuste(Number.parseFloat(e.target.value) || 0)}
              disabled={isLoadingFase || isSubmitting}
            />
            {errors.percentualReajuste && <p className="text-sm text-red-500">{errors.percentualReajuste}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data de Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={dataInicio ? format(dataInicio, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const date = e.target.value ? new Date(`${e.target.value}T00:00:00`) : null
                  setDataInicio(date)
                }}
                disabled={isLoadingFase || isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFim">Data de Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={dataFim ? format(dataFim, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const date = e.target.value ? new Date(`${e.target.value}T00:00:00`) : null
                  setDataFim(date)
                }}
                disabled={isLoadingFase || isSubmitting}
              />
              {errors.dataFim && <p className="text-sm text-red-500">{errors.dataFim}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição opcional da fase"
              disabled={isLoadingFase || isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoadingFase || isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
