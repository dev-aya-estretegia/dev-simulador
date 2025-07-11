import { EmpreendimentoForm } from "@/components/empreendimentos/empreendimento-form"
import { Breadcrumb } from "@/components/shared/breadcrumb"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NovoEmpreendimentoPage() {
  return (
    <main className="container mx-auto py-8">
      <div className="mb-6">
        <Breadcrumb>
          <Breadcrumb.Item href="/">Início</Breadcrumb.Item>
          <Breadcrumb.Item href="/empreendimentos">Empreendimentos</Breadcrumb.Item>
          <Breadcrumb.Item>Novo Empreendimento</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/empreendimentos">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Novo Empreendimento</h1>
      </div>

      <EmpreendimentoForm />
    </main>
  )
}
