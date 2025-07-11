import { Suspense } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ComparativoCenariosClient } from "@/components/comparativo/comparativo-cenarios-client"

export default function ComparativoCenariosPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Comparativo de Cenários</h1>
            <p className="text-muted-foreground mt-1">
              Análise comparativa entre diferentes estratégias de precificação
            </p>
          </div>
        </div>

        {/* Content */}
        <Suspense fallback={<div>Carregando...</div>}>
          <ComparativoCenariosClient />
        </Suspense>
      </div>
    </div>
  )
}
