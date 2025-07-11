import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, Plus } from "lucide-react"

export function EmpreendimentosEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-primary/10 p-3 mb-4">
        <Building2 className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">Nenhum empreendimento encontrado</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Você ainda não possui empreendimentos cadastrados ou nenhum empreendimento corresponde aos filtros aplicados.
      </p>
      <Button asChild>
        <Link href="/empreendimentos/novo" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Cadastrar Empreendimento
        </Link>
      </Button>
    </div>
  )
}
