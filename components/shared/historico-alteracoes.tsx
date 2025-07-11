"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, User } from "lucide-react"

interface Alteracao {
  id: number
  entidade: string
  entidade_id: number
  campo: string
  valor_anterior: string
  valor_novo: string
  usuario: string
  data_alteracao: string
}

interface HistoricoAlteracoesProps {
  entidade: string
  entidadeId: number
  titulo?: string
  limite?: number
}

export function HistoricoAlteracoes({
  entidade,
  entidadeId,
  titulo = "Histórico de Alterações",
  limite = 10,
}: HistoricoAlteracoesProps) {
  const [alteracoes, setAlteracoes] = useState<Alteracao[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function carregarHistorico() {
      setIsLoading(true)
      setError(null)

      try {
        // Simulação de chamada à API - em um ambiente real, isso seria uma tabela no Supabase
        // Aqui estamos apenas simulando dados para demonstração
        setTimeout(() => {
          const alteracoesSimuladas: Alteracao[] = [
            {
              id: 1,
              entidade,
              entidade_id: entidadeId,
              campo: "nome",
              valor_anterior: "Residencial Antigo",
              valor_novo: "Residencial Jardim das Flores",
              usuario: "João Silva",
              data_alteracao: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 dias atrás
            },
            {
              id: 2,
              entidade,
              entidade_id: entidadeId,
              campo: "vgv_alvo",
              valor_anterior: "15000000",
              valor_novo: "18000000",
              usuario: "Maria Oliveira",
              data_alteracao: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 dias atrás
            },
            {
              id: 3,
              entidade,
              entidade_id: entidadeId,
              campo: "data_entrega",
              valor_anterior: "2024-06-30",
              valor_novo: "2024-12-15",
              usuario: "Carlos Mendes",
              data_alteracao: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 dias atrás
            },
          ]

          setAlteracoes(alteracoesSimuladas)
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        console.error("Erro ao carregar histórico:", err)
        setError("Não foi possível carregar o histórico de alterações.")
        setIsLoading(false)
      }
    }

    carregarHistorico()
  }, [entidade, entidadeId])

  function formatarCampo(campo: string): string {
    const mapeamento: Record<string, string> = {
      nome: "Nome",
      descricao: "Descrição",
      endereco: "Endereço",
      vgv_alvo: "VGV Alvo",
      percentual_permuta: "Percentual de Permuta",
      data_lancamento: "Data de Lançamento",
      data_entrega: "Data de Entrega",
    }

    return mapeamento[campo] || campo
  }

  function formatarValor(campo: string, valor: string): string {
    if (campo === "vgv_alvo") {
      return `R$ ${Number.parseFloat(valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    }

    if (campo === "percentual_permuta") {
      return `${valor}%`
    }

    if (campo === "data_lancamento" || campo === "data_entrega") {
      return new Date(valor).toLocaleDateString("pt-BR")
    }

    return valor
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{titulo}</h3>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 text-center text-muted-foreground">{error}</div>
      ) : alteracoes.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">Nenhuma alteração registrada.</div>
      ) : (
        <div className="space-y-6">
          {alteracoes.map((alteracao) => (
            <div key={alteracao.id} className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium">{alteracao.usuario}</p>
                <p className="text-sm">
                  Alterou <span className="font-medium">{formatarCampo(alteracao.campo)}</span> de{" "}
                  <span className="text-muted-foreground">
                    {formatarValor(alteracao.campo, alteracao.valor_anterior)}
                  </span>{" "}
                  para <span className="font-medium">{formatarValor(alteracao.campo, alteracao.valor_novo)}</span>
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(alteracao.data_alteracao).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
