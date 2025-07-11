"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { useCalculoValorInicial } from "@/hooks"
import { Loader2, Save, ArrowLeft, Calculator } from 'lucide-react'
import type { Unidade, ValorUnidadesCenario } from "@/types/database"

const unidadeSchema = z.object({
  empreendimento_id: z.coerce.number({
    required_error: "Selecione um empreendimento",
  }),
  cenario_id: z.coerce.number({
    required_error: "Selecione um cenário",
  }),
  nome: z.string().min(1, "O nome da unidade é obrigatório"),
  tipologia: z.enum(["Apartamento", "Studio", "Comercial"], {
    required_error: "Selecione uma tipologia",
  }),
  area_privativa: z.coerce.number().positive("A área privativa deve ser maior que zero"),
  area_garden: z.coerce.number().optional(),
  pavimento: z.coerce.number().int("O pavimento deve ser um número inteiro"),
  bloco: z.string().min(1, "O bloco é obrigatório"),
  orientacao_solar: z.enum(["Norte", "Sul", "Leste", "Oeste", "Nordeste", "Noroeste", "Sudeste", "Sudoeste"], {
    required_error: "Selecione uma orientação solar",
  }),
  vista: z.string().optional(),
  diferencial: z.string().optional(),
  qtd_vaga_simples: z.coerce.number().int().min(0, "Não pode ser negativo"),
  qtd_vaga_duplas: z.coerce.number().int().min(0, "Não pode ser negativo"),
  qtd_vaga_moto: z.coerce.number().int().min(0, "Não pode ser negativo"),
  qtd_hobby_boxes: z.coerce.number().int().min(0, "Não pode ser negativo"),
  qtd_suite: z.coerce.number().int().min(0, "Não pode ser negativo"),
})

type UnidadeFormValues = z.infer<typeof unidadeSchema>

interface UnidadeFormProps {
  unidade?: Unidade
  valorUnidadeCenario?: ValorUnidadesCenario
  empreendimentos: { id: number; nome: string }[]
  cenarios: { id: number; nome: string; empreendimento_id: number }[]
  empreendimentoId?: number
  cenarioId?: number
  isEdicao?: boolean
}

export function UnidadeForm({
  unidade,
  valorUnidadeCenario,
  empreendimentos,
  cenarios,
  empreendimentoId,
  cenarioId,
  isEdicao = false,
}: UnidadeFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("dados")
  const [cenariosFiltrados, setCenariosFiltrados] = useState(cenarios)
  const { calcularValorInicial, isLoading: isCalculando } = useCalculoValorInicial()
  const [valorCalculado, setValorCalculado] = useState<number | null>(null)

  // Filtrar cenários pelo empreendimento selecionado
  useEffect(() => {
    if (empreendimentoId) {
      setCenariosFiltrados(cenarios.filter((c) => c.empreendimento_id === empreendimentoId))
    } else {
      setCenariosFiltrados(cenarios)
    }
  }, [empreendimentoId, cenarios])

  const form = useForm<UnidadeFormValues>({
    resolver: zodResolver(unidadeSchema),
    defaultValues: {
      empreendimento_id: empreendimentoId || unidade?.empreendimento_id || 0,
      cenario_id: cenarioId || 0,
      nome: unidade?.nome || "",
      tipologia: unidade?.tipologia || undefined,
      area_privativa: unidade?.area_privativa || 0,
      area_garden: unidade?.area_garden || 0,
      pavimento: unidade?.pavimento || 0,
      bloco: unidade?.bloco || "",
      orientacao_solar: unidade?.orientacao_solar || undefined,
      vista: unidade?.vista || "",
      diferencial: unidade?.diferencial || "",
      qtd_vaga_simples: unidade?.qtd_vaga_simples || 0,
      qtd_vaga_duplas: unidade?.qtd_vaga_duplas || 0,
      qtd_vaga_moto: unidade?.qtd_vaga_moto || 0,
      qtd_hobby_boxes: unidade?.qtd_hobby_boxes || 0,
      qtd_suite: unidade?.qtd_suite || 0,
    },
  })

  // Observar mudanças no empreendimento selecionado
  const watchEmpreendimentoId = form.watch("empreendimento_id")
  useEffect(() => {
    if (watchEmpreendimentoId) {
      const cenariosFiltrados = cenarios.filter((c) => c.empreendimento_id === watchEmpreendimentoId)
      setCenariosFiltrados(cenariosFiltrados)

      // Se o cenário atual não pertence ao empreendimento selecionado, limpar o campo
      const cenarioAtual = form.getValues("cenario_id")
      if (cenarioAtual && !cenariosFiltrados.some((c) => c.id === cenarioAtual)) {
        form.setValue("cenario_id", 0)
      }
    }
  }, [watchEmpreendimentoId, cenarios, form])

  async function onSubmit(values: UnidadeFormValues) {
    setIsSubmitting(true)

    try {
      if (isEdicao && unidade) {
        // Atualizar unidade existente
        const { error } = await supabase
          .from("UNIDADE")
          .update({
            nome: values.nome,
            tipologia: values.tipologia,
            area_privativa: values.area_privativa,
            area_garden: values.area_garden || null,
            pavimento: values.pavimento,
            bloco: values.bloco,
            orientacao_solar: values.orientacao_solar,
            vista: values.vista || null,
            diferencial: values.diferencial || null,
            qtd_vaga_simples: values.qtd_vaga_simples,
            qtd_vaga_duplas: values.qtd_vaga_duplas,
            qtd_vaga_moto: values.qtd_vaga_moto,
            qtd_hobby_boxes: values.qtd_hobby_boxes,
            qtd_suite: values.qtd_suite,
          })
          .eq("id", unidade.id)

        if (error) throw error

        // A trigger fn_trg_after_unidade_update irá recalcular os valores automaticamente

        toast({
          title: "Unidade atualizada",
          description: "A unidade foi atualizada com sucesso.",
        })
      } else {
        // Criar nova unidade
        const { data: novaUnidade, error } = await supabase
          .from("UNIDADE")
          .insert({
            empreendimento_id: values.empreendimento_id,
            nome: values.nome,
            tipologia: values.tipologia,
            area_privativa: values.area_privativa,
            area_garden: values.area_garden || null,
            pavimento: values.pavimento,
            bloco: values.bloco,
            orientacao_solar: values.orientacao_solar,
            vista: values.vista || null,
            diferencial: values.diferencial || null,
            qtd_vaga_simples: values.qtd_vaga_simples,
            qtd_vaga_duplas: values.qtd_vaga_duplas,
            qtd_vaga_moto: values.qtd_vaga_moto,
            qtd_hobby_boxes: values.qtd_hobby_boxes,
            qtd_suite: values.qtd_suite,
          })
          .select("id")
          .single()

        if (error) throw error

        if (novaUnidade && values.cenario_id) {
          // Calcular valor inicial para o cenário selecionado
          await calcularValorInicial(novaUnidade.id, values.cenario_id)
        }

        toast({
          title: "Unidade criada",
          description: "A unidade foi criada com sucesso.",
        })
      }

      // Redirecionar para a lista de unidades
      router.push(`/unidades?cenario=${values.cenario_id}`)
      router.refresh()
    } catch (error) {
      console.error("Erro ao salvar unidade:", error)
      toast({
        title: "Erro ao salvar",
        description: `Ocorreu um erro ao salvar a unidade: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCalcularValor() {
    if (!unidade?.id) return

    const cenarioId = form.getValues("cenario_id")
    if (!cenarioId) {
      toast({
        title: "Cenário não selecionado",
        description: "Selecione um cenário para calcular o valor.",
        variant: "destructive",
      })
      return
    }

    try {
      const valor = await calcularValorInicial(unidade.id, cenarioId)
      setValorCalculado(valor)

      toast({
        title: "Valor calculado",
        description: `O valor inicial da unidade foi calculado com sucesso.`,
      })
    } catch (error) {
      console.error("Erro ao calcular valor:", error)
      toast({
        title: "Erro ao calcular valor",
        description: `Ocorreu um erro ao calcular o valor da unidade: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/unidades">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{isEdicao ? `Editando: ${unidade?.nome}` : "Nova Unidade"}</h2>
          <p className="text-sm text-muted-foreground">
            {isEdicao
              ? "Atualize as informações da unidade conforme necessário"
              : "Preencha os dados para criar uma nova unidade"}
          </p>
        </div>
        <Button type="submit" form="unidade-form" disabled={isSubmitting} className="gap-2">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-none md:auto-cols-auto">
          <TabsTrigger value="dados">Dados Gerais</TabsTrigger>
          <TabsTrigger value="adicionais">Itens Adicionais</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form id="unidade-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="dados" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="empreendimento_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Empreendimento</FormLabel>
                          <Select
                            disabled={isEdicao}
                            onValueChange={(value) => field.onChange(Number(value))}
                            value={field.value ? field.value.toString() : undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um empreendimento" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {empreendimentos.map((empreendimento) => (
                                <SelectItem key={empreendimento.id} value={empreendimento.id.toString()}>
                                  {empreendimento.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {isEdicao
                              ? "O empreendimento não pode ser alterado após a criação"
                              : "Selecione o empreendimento ao qual esta unidade pertence"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cenario_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cenário</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(Number(value))}
                            value={field.value ? field.value.toString() : undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um cenário" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cenariosFiltrados.map((cenario) => (
                                <SelectItem key={cenario.id} value={cenario.id.toString()}>
                                  {cenario.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>Selecione o cenário para calcular o valor da unidade</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Unidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Apto 101" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tipologia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipologia</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma tipologia" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Apartamento">Apartamento</SelectItem>
                              <SelectItem value="Studio">Studio</SelectItem>
                              <SelectItem value="Comercial">Comercial</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <FormField
                      control={form.control}
                      name="area_privativa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Área Privativa (m²)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="area_garden"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Área Garden (m²)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Opcional"
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormDescription>Deixe em branco se não houver área garden</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pavimento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pavimento</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <FormField
                      control={form.control}
                      name="bloco"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bloco</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: A" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="orientacao_solar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Orientação Solar</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma orientação" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Norte">Norte</SelectItem>
                              <SelectItem value="Sul">Sul</SelectItem>
                              <SelectItem value="Leste">Leste</SelectItem>
                              <SelectItem value="Oeste">Oeste</SelectItem>
                              <SelectItem value="Nordeste">Nordeste</SelectItem>
                              <SelectItem value="Noroeste">Noroeste</SelectItem>
                              <SelectItem value="Sudeste">Sudeste</SelectItem>
                              <SelectItem value="Sudoeste">Sudoeste</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormField
                      control={form.control}
                      name="vista"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vista</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Mar, Parque, etc. (opcional)"
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value || undefined)}
                            />
                          </FormControl>
                          <FormDescription>Deixe em branco se não houver vista especial</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="diferencial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Diferencial</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Cobertura, Térreo, etc. (opcional)"
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value || undefined)}
                            />
                          </FormControl>
                          <FormDescription>Deixe em branco se não houver diferencial</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="adicionais" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="qtd_vaga_simples"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vagas Simples</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="qtd_vaga_duplas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vagas Duplas</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="qtd_vaga_moto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vagas Moto</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <FormField
                      control={form.control}
                      name="qtd_hobby_boxes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hobby Boxes</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="qtd_suite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Suítes</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {isEdicao && unidade && (
                    <div className="mt-6">
                      <Separator className="my-4" />
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium">Calcular Valor</h3>
                          <p className="text-sm text-muted-foreground">
                            Recalcule o valor da unidade para o cenário selecionado
                          </p>
                        </div>
                        <Button type="button" onClick={handleCalcularValor} disabled={isCalculando} className="gap-2">
                          {isCalculando ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Calculator className="h-4 w-4" />
                          )}
                          Calcular Valor
                        </Button>
                      </div>

                      {valorCalculado !== null && (
                        <div className="mt-4 p-4 bg-primary/10 rounded-md">
                          <p className="text-sm font-medium">Valor Calculado:</p>
                          <p className="text-xl font-bold text-primary">
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                              valorCalculado,
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}
