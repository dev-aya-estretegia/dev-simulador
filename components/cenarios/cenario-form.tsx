"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface Empreendimento {
  id: number
  nome: string
}

interface CenarioFormProps {
  empreendimentoId?: number
  empreendimentos?: Empreendimento[]
}

export function CenarioForm({ empreendimentoId, empreendimentos = [] }: CenarioFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [selectedEmpreendimentoId, setSelectedEmpreendimentoId] = useState<number | undefined>(empreendimentoId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe um nome para o cenário.",
        variant: "destructive",
      })
      return
    }

    if (!selectedEmpreendimentoId) {
      toast({
        title: "Empreendimento obrigatório",
        description: "Por favor, selecione um empreendimento para o cenário.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Usar o método de inserção direta em vez da função RPC para diagnóstico
      const { data, error } = await supabase
        .from("cenario")
        .insert({
          nome: nome,
          descricao: descricao,
          empreendimento_id: selectedEmpreendimentoId,
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Cenário criado com sucesso",
        description: `O cenário "${nome}" foi criado.`,
      })

      // Redirecionar para a página do cenário recém-criado
      router.push(`/cenarios/${data.id}`)
    } catch (error: any) {
      console.error("Erro ao criar cenário:", error)
      toast({
        title: "Erro ao criar cenário",
        description: error.message || "Ocorreu um erro ao criar o cenário.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto bg-[#1c1f24] text-white">
      <CardHeader>
        <CardTitle>Novo Cenário</CardTitle>
        <CardDescription className="text-gray-400">
          Crie um novo cenário de precificação para o empreendimento.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {!empreendimentoId && empreendimentos.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="empreendimento">Empreendimento</Label>
              <Select
                value={selectedEmpreendimentoId?.toString()}
                onValueChange={(value) => setSelectedEmpreendimentoId(Number(value))}
              >
                <SelectTrigger id="empreendimento" className="bg-[#2a2d35] border-gray-700">
                  <SelectValue placeholder="Selecione um empreendimento" />
                </SelectTrigger>
                <SelectContent className="bg-[#2a2d35] border-gray-700 text-white">
                  {empreendimentos.map((empreendimento) => (
                    <SelectItem key={empreendimento.id} value={empreendimento.id.toString()}>
                      {empreendimento.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Cenário</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Cenário Base"
              required
              className="bg-[#2a2d35] border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o objetivo deste cenário..."
              rows={4}
              className="bg-[#2a2d35] border-gray-700"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-gray-700 text-white hover:bg-gray-700"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
            {isLoading ? "Criando..." : "Criar Cenário"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
