"use client"

import { useEmpreendimentos } from "@/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

export function EmpreendimentosList() {
  const { data: empreendimentos, isLoading, error } = useEmpreendimentos()

  if (isLoading) {
    return <div>Carregando empreendimentos...</div>
  }

  if (error) {
    return <div>Erro ao carregar empreendimentos: {error.message}</div>
  }

  if (!empreendimentos?.length) {
    return <div>Nenhum empreendimento encontrado.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {empreendimentos.map((empreendimento) => (
        <Card key={empreendimento.id} className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">{empreendimento.nome}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-muted-foreground">{empreendimento.endereco}</p>
              <p>
                <span className="text-muted-foreground">VGV Alvo:</span>{" "}
                <span className="text-foreground">{formatCurrency(empreendimento.vgv_alvo)}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Lançamento:</span>{" "}
                <span className="text-foreground">
                  {new Date(empreendimento.data_lancamento).toLocaleDateString("pt-BR")}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Entrega:</span>{" "}
                <span className="text-foreground">
                  {new Date(empreendimento.data_entrega).toLocaleDateString("pt-BR")}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
