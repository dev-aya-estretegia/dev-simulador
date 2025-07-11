import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CenariosHeaderProps {
  empreendimentoId?: number
}

export function CenariosHeader({ empreendimentoId }: CenariosHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">{empreendimentoId ? "Cenários do Empreendimento" : "Todos os Cenários"}</h1>
        <p className="text-muted-foreground">
          {empreendimentoId
            ? "Gerencie os cenários de precificação para este empreendimento"
            : "Gerencie os cenários de precificação para seus empreendimentos"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {empreendimentoId && (
          <Button variant="outline" asChild>
            <Link href="/empreendimentos">Voltar para Empreendimentos</Link>
          </Button>
        )}
        <Button asChild>
          <Link href={empreendimentoId ? `/cenarios/novo?empreendimento=${empreendimentoId}` : "/cenarios/novo"}>
            Novo Cenário
          </Link>
        </Button>
      </div>
    </div>
  )
}
