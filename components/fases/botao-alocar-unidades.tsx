"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlocacaoUnidadesModal } from "./alocacao-unidades-modal"
import { Users } from "lucide-react"

interface BotaoAlocarUnidadesProps {
  faseId: number
  cenarioId: number
  onSuccess?: () => void
}

export function BotaoAlocarUnidades({ faseId, cenarioId, onSuccess }: BotaoAlocarUnidadesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess()
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1">
        <Users className="h-4 w-4" />
        <span>Alocar Unidades</span>
      </Button>

      <AlocacaoUnidadesModal
        faseId={faseId}
        cenarioId={cenarioId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  )
}
