"use client"

import { useState } from "react"
import { useCenario } from "@/hooks/use-cenarios"
import { useFases } from "@/hooks/use-fases"
import { FasesHeader } from "./fases-header"
import { FasesTable } from "./fases-table"
import { FasesEmpty } from "./fases-empty"
import { FaseForm } from "./fase-form"
import { AlocacaoUnidadesForm } from "./alocacao-unidades-form"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type Props = {
  cenarioId: number
}

export function FasesClientPage({ cenarioId }: Props) {
  const { data: cenario, isLoading: isLoadingCenario, error: cenarioError } = useCenario(cenarioId)
  const { data: fases, isLoading: isLoadingFases, error: fasesError, refetch } = useFases(cenarioId)
  const [showFaseForm, setShowFaseForm] = useState(false)
  const [showAlocacaoForm, setShowAlocacaoForm] = useState(false)
  const [faseToEdit, setFaseToEdit] = useState<number | null>(null)
  const [faseToAllocate, setFaseToAllocate] = useState<number | null>(null)

  const handleCreateFase = () => {
    setFaseToEdit(null)
    setShowFaseForm(true)
  }

  const handleEditFase = (faseId: number) => {
    setFaseToEdit(faseId)
    setShowFaseForm(true)
  }

  const handleAllocateUnits = (faseId: number) => {
    setFaseToAllocate(faseId)
    setShowAlocacaoForm(true)
  }

  const handleFormClose = () => {
    setShowFaseForm(false)
    setFaseToEdit(null)
    refetch()
  }

  const handleAlocacaoClose = () => {
    setShowAlocacaoForm(false)
    setFaseToAllocate(null)
    refetch()
  }

  if (isLoadingCenario || isLoadingFases) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (cenarioError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar cenário</AlertTitle>
        <AlertDescription>
          Ocorreu um erro ao carregar o cenário. Por favor, tente novamente.
          <br />
          <br />
          Detalhes: {cenarioError.message}
        </AlertDescription>
      </Alert>
    )
  }

  if (!cenario) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Cenário não encontrado</AlertTitle>
        <AlertDescription>O cenário solicitado não foi encontrado. Verifique se o ID está correto.</AlertDescription>
      </Alert>
    )
  }

  if (fasesError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar fases</AlertTitle>
        <AlertDescription>
          Ocorreu um erro ao carregar as fases deste cenário. Por favor, tente novamente.
          <br />
          <br />
          Detalhes: {fasesError.message}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <FasesHeader cenario={cenario} onCreateFase={handleCreateFase} />

      {!fases || fases.length === 0 ? (
        <FasesEmpty onCreateFase={handleCreateFase} />
      ) : (
        <FasesTable
          fases={fases}
          onEditFase={handleEditFase}
          onAllocateUnits={handleAllocateUnits}
          onFasesChange={refetch}
        />
      )}

      {showFaseForm && (
        <FaseForm cenarioId={cenarioId} faseId={faseToEdit} open={showFaseForm} onClose={handleFormClose} />
      )}

      {showAlocacaoForm && faseToAllocate && (
        <AlocacaoUnidadesForm
          cenarioId={cenarioId}
          faseId={faseToAllocate}
          open={showAlocacaoForm}
          onClose={handleAlocacaoClose}
        />
      )}
    </div>
  )
}
