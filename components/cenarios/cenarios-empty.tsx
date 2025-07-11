import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CenariosEmptyProps {
  empreendimentoId?: number
}

export function CenariosEmpty({ empreendimentoId }: CenariosEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h2 className="text-xl font-semibold mb-2">Nenhum cenário encontrado</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {empreendimentoId
          ? "Você ainda não criou nenhum cenário para este empreendimento. Crie seu primeiro cenário para começar a simular diferentes estratégias de precificação."
          : "Você ainda não criou nenhum cenário. Crie seu primeiro cenário para começar a simular diferentes estratégias de precificação."}
      </p>
      <Button asChild>
        <Link href={empreendimentoId ? `/cenarios/novo?empreendimento=${empreendimentoId}` : "/cenarios/novo"}>
          Criar Primeiro Cenário
        </Link>
      </Button>
    </div>
  )
}
