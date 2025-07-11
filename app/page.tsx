import Link from "next/link"
import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="border-b border-border/40 bg-black backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">AYA</span>
              <span className="text-xl font-medium text-foreground">Simulador</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/empreendimentos" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Empreendimentos
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-8 md:py-12 space-y-6 bg-black text-white">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
            Dashboard <span className="text-primary">AYA</span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Análise estratégica e indicadores de performance dos cenários de precificação
          </p>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="container pb-12 md:pb-24 bg-black text-white flex-1">
        <DashboardOverview />
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-black backdrop-blur supports-[backdrop-filter]:bg-black/60 mt-auto">
        <div className="container flex h-14 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AYA Simulador. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground">Versão 1.0.0</p>
        </div>
      </footer>
    </div>
  )
}
