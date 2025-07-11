"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { HistoricoAlteracoes } from "@/components/shared/historico-alteracoes"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Empreendimento } from "@/types/database"

// Schema de validação usando Zod v3 syntax
const empreendimentoSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  descricao: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  empresa: z.string().optional(),
  endereco: z.string().min(5, "O endereço deve ter pelo menos 5 caracteres"),
  cidade: z.string().min(2, "A cidade deve ter pelo menos 2 caracteres"),
  estado: z.string().length(2, "O estado deve ter 2 caracteres"),
  data_lancamento: z.string().refine((data) => !isNaN(Date.parse(data)), {
    message: "Data de lançamento inválida",
  }),
  vgv_bruto_alvo: z.coerce.number().positive("O VGV alvo deve ser um valor positivo"),
  percentual_permuta: z.coerce
    .number()
    .min(0, "O percentual de permuta deve ser maior ou igual a 0")
    .max(100, "O percentual de permuta deve ser menor ou igual a 100"),
  vgv_liquido_alvo: z.coerce.number().optional(),
})

type EmpreendimentoFormValues = z.infer<typeof empreendimentoSchema>

interface EmpreendimentoFormProps {
  empreendimento?: Empreendimento
}

export function EmpreendimentoForm({ empreendimento }: EmpreendimentoFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("dados")

  const isEdicao = !!empreendimento

  const form = useForm<EmpreendimentoFormValues>({
    resolver: zodResolver(empreendimentoSchema),
    defaultValues: {
      nome: empreendimento?.nome || "",
      descricao: empreendimento?.descricao || "",
      empresa: empreendimento?.empresa || "",
      endereco: empreendimento?.endereco || "",
      cidade: empreendimento?.cidade || "",
      estado: empreendimento?.estado || "",
      data_lancamento: empreendimento?.data_lancamento
        ? new Date(empreendimento.data_lancamento).toISOString().split("T")[0]
        : "",
      vgv_bruto_alvo: empreendimento?.vgv_bruto_alvo || 0,
      percentual_permuta: empreendimento?.percentual_permuta || 0,
      vgv_liquido_alvo: empreendimento?.vgv_liquido_alvo || 0,
    },
  })

  // Função para calcular o VGV líquido (VGV bruto - percentual de permuta)
  const calcularVgvLiquido = (vgvBruto: number, percentualPermuta: number): number => {
    return vgvBruto * (1 - percentualPermuta / 100)
  }

  async function onSubmit(values: EmpreendimentoFormValues) {
    setIsSubmitting(true)

    try {
      // Calculando o VGV líquido automaticamente
      const vgvLiquido = calcularVgvLiquido(values.vgv_bruto_alvo, values.percentual_permuta)

      // Preparando os dados para envio
      const dadosParaEnviar = {
        ...values,
        vgv_liquido_alvo: vgvLiquido,
      }

      console.log("Valores sendo enviados:", dadosParaEnviar)

      if (isEdicao) {
        // Atualizar empreendimento existente
        const { error } = await supabase.from("empreendimento").update(dadosParaEnviar).eq("id", empreendimento.id)

        if (error) throw error

        toast({
          title: "Empreendimento atualizado",
          description: "O empreendimento foi atualizado com sucesso.",
        })
      } else {
        // Criar novo empreendimento
        const { error } = await supabase.from("empreendimento").insert(dadosParaEnviar)

        if (error) throw error

        toast({
          title: "Empreendimento criado",
          description: "O empreendimento foi criado com sucesso.",
        })
      }

      // Redirecionar para a lista de empreendimentos
      router.push("/empreendimentos")
      router.refresh()
    } catch (error: any) {
      console.error("Erro ao salvar empreendimento:", error)
      toast({
        title: "Erro ao salvar",
        description: `Ocorreu um erro ao salvar o empreendimento: ${error?.message || "Erro desconhecido"}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/empreendimentos">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white">
            {isEdicao ? `Editando: ${empreendimento.nome}` : "Novo Empreendimento"}
          </h2>
          <p className="text-sm text-white">
            {isEdicao
              ? "Atualize as informações do empreendimento conforme necessário"
              : "Preencha os dados para criar um novo empreendimento"}
          </p>
        </div>
        <Button type="submit" form="empreendimento-form" disabled={isSubmitting} className="gap-2">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-none md:auto-cols-auto">
          <TabsTrigger value="dados">Dados Gerais</TabsTrigger>
          {isEdicao && <TabsTrigger value="historico">Histórico de Alterações</TabsTrigger>}
        </TabsList>

        <TabsContent value="dados" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form id="empreendimento-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Nome do Empreendimento</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Residencial Jardim das Flores"
                              className="placeholder-white text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="empresa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Empresa</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Construtora ABC"
                              className="placeholder-white text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="vgv_bruto_alvo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">VGV Bruto Alvo (R$)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" className="placeholder-white text-white" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="percentual_permuta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Permuta (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" className="placeholder-white text-white" {...field} />
                          </FormControl>
                          <FormDescription className="text-white">
                            O VGV Líquido será calculado automaticamente
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva o empreendimento..."
                            className="min-h-[100px] placeholder-white text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Localização</h3>

                    <FormField
                      control={form.control}
                      name="endereco"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Endereço Completo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Rua, número, bairro..."
                              className="placeholder-white text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="cidade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Cidade</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: São Paulo" className="placeholder-white text-white" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="estado"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Estado (UF)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ex: SP"
                                maxLength={2}
                                className="placeholder-white text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Cronograma</h3>

                    <FormField
                      control={form.control}
                      name="data_lancamento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Data de Lançamento</FormLabel>
                          <FormControl>
                            <Input type="date" className="placeholder-white text-white" {...field} />
                          </FormControl>
                          <FormDescription className="text-white">
                            Data prevista para o lançamento do empreendimento
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {isEdicao && (
          <TabsContent value="historico" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <HistoricoAlteracoes
                  entidade="EMPREENDIMENTO"
                  entidadeId={empreendimento.id}
                  titulo="Histórico de Alterações do Empreendimento"
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

export default EmpreendimentoForm
