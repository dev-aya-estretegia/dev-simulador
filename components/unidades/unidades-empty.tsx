import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Plus, Upload } from "lucide-react"

export function UnidadesEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-primary/10 p-3 mb-4">
        <Home className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">Nenhuma unidade encontrada</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Você ainda não possui unidades cadastradas ou nenhuma unidade corresponde aos filtros aplicados.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button asChild>
          <Link href="/unidades/novo" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Cadastrar Unidade
          </Link>
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Importar Unidades
        </Button>
      </div>
    </div>
  )
}
