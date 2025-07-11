import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart } from "@/components/charts/bar-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { IndicadorNumerico } from "@/components/charts/indicador-numerico"

export default async function AnalisesPage() {
  const supabase = createClient()
  const { data: cenarios, error } = await supabase
    .from("CENARIO")
    .select("*, EMPREENDIMENTO(nome)")
    .eq("status", "Ativo")
    .order("nome")

  if (error) {
    console.error("Erro ao buscar cenários:", error)
  }

  return (
    <main className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Análises</h1>
        <Button asChild>
          <Link href="/cenarios">Gerenciar Cenários</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {cenarios?.map((cenario) => (
          <Card key={cenario.id} className="border-border bg-card">
            <CardHeader>
              <CardTitle>
                {cenario.nome} - {cenario.EMPREENDIMENTO.nome}
              </CardTitle>
              <CardDescription>Análise de indicadores e métricas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <IndicadorNumerico
                  titulo="VGV Projetado"
                  valor={cenario.vgv_projetado || 0}
                  formatador={(valor) => `R$ ${valor.toLocaleString("pt-BR")}`}
                  descricao="Valor Geral de Vendas projetado"
                />
                <IndicadorNumerico
                  titulo="Diferença %"
                  valor={10.5} // Exemplo - seria obtido da view
                  formatador={(valor) => `${valor.toFixed(2)}%`}
                  descricao="Aumento em relação ao valor inicial"
                  tendencia="positiva"
                />
                <IndicadorNumerico
                  titulo="Total de Unidades"
                  valor={120} // Exemplo - seria obtido da view
                  formatador={(valor) => valor.toString()}
                  descricao="Número total de unidades"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">VGV por Tipologia</h3>
                  <PieChart
                    data={[
                      { name: "Apartamento", value: 65 },
                      { name: "Studio", value: 25 },
                      { name: "Comercial", value: 10 },
                    ]}
                    height={300}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">VGV por Fase</h3>
                  <BarChart
                    data={[
                      { name: "Fase 1", value: 25000000 },
                      { name: "Fase 2", value: 35000000 },
                      { name: "Fase 3", value: 45000000 },
                    ]}
                    height={300}
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button asChild>
                  <Link href={`/analises/${cenario.id}`}>Ver Análise Detalhada</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {cenarios?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Nenhum cenário ativo encontrado</p>
            <Button asChild>
              <Link href="/cenarios/novo">Criar Novo Cenário</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
