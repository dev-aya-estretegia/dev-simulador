"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog"
import { AlertCircle, Info, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { Cenario, ParametroPrecificacao } from "@/types/database"

interface ParametrosFormProps {
  cenario: Cenario
  parametros: ParametroPrecificacao | null
}

const parametrosFormSchema = z.object({
  valor_area_privativa_apartamento: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero"),
  valor_area_privativa_studio: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero"),
  valor_area_privativa_comercial: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero"),
  valor_vaga_simples: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero"),
  valor_vaga_dupla: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero"),
  valor_vaga_moto: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero"),
  valor_hobby_boxes: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero"),
  valor_area_garden: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero"),
  valor_suite: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero"),
  nome: z.string().optional(),
  descricao: z.string().optional(),
})

type ParametrosFormValues = z.infer<typeof parametrosFormSchema>

export function ParametrosForm({ cenario, parametros }: ParametrosFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formValues, setFormValues] = useState<ParametrosFormValues | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const defaultValues: ParametrosFormValues = parametros
    ? {
        valor_area_privativa_apartamento: parametros.valor_area_privativa_apartamento,
        valor_area_privativa_studio: parametros.valor_area_privativa_studio,
        valor_area_privativa_comercial: parametros.valor_area_privativa_comercial,
        valor_vaga_simples: parametros.valor_vaga_simples,
        valor_vaga_dupla: parametros.valor_vaga_dupla,
        valor_vaga_moto: parametros.valor_vaga_moto,
        valor_hobby_boxes: parametros.valor_hobby_boxes,
        valor_area_garden: parametros.valor_area_garden,
        valor_suite: parametros.valor_suite,
        nome: parametros.nome || "",
        descricao: parametros.descricao || "",
      }
    : {
        valor_area_privativa_apartamento: 0,
        valor_area_privativa_studio: 0,
        valor_area_privativa_comercial: 0,
        valor_vaga_simples: 0,
        valor_vaga_dupla: 0,
        valor_vaga_moto: 0,
        valor_hobby_boxes: 0,
        valor_area_garden: 0,
        valor_suite: 0,
        nome: "Parâmetros padrão",
        descricao: "Configuração inicial de parâmetros",
      }

  const form = useForm<ParametrosFormValues>({
    resolver: zodResolver(parametrosFormSchema),
    defaultValues,
  })

  async function onSubmit(values: ParametrosFormValues) {
    setFormValues(values)

    // Se já existem parâmetros, mostrar confirmação antes de atualizar
    if (parametros) {
      setShowConfirmation(true)
      return
    }

    // Se não existem parâmetros, criar novos
    await saveParametros(values)
  }

  async function saveParametros(values: ParametrosFormValues) {
    setIsLoading(true)

    try {
      // Primeiro, verificar se existem unidades para este cenário
      const { data: unidades, error: unidadesError } = await supabase
        .from("unidade")
        .select("id, empreendimento_id")
        .eq("empreendimento_id", cenario.empreendimento_id)

      if (unidadesError) {
        throw new Error(`Erro ao verificar unidades: ${unidadesError.message}`)
      }

      if (!unidades || unidades.length === 0) {
        toast({
          title: "Atenção",
          description:
            "Este empreendimento não possui unidades cadastradas. Cadastre as unidades antes de configurar os parâmetros.",
          variant: "destructive",
        })
        return
      }

      if (parametros) {
        // Para atualização, primeiro desabilitar triggers temporariamente
        await supabase
          .rpc("sql", {
            query: "ALTER TABLE parametro_precificacao DISABLE TRIGGER ALL",
          })
          .then(() => {
            console.log("Triggers desabilitados temporariamente")
          })
          .catch(() => {
            console.log("Não foi possível desabilitar triggers, continuando...")
          })

        // Atualizar parâmetros existentes
        const { error: updateError } = await supabase
          .from("parametro_precificacao")
          .update(values)
          .eq("id", parametros.id)

        if (updateError) {
          throw new Error(`Erro ao atualizar parâmetros: ${updateError.message}`)
        }

        // Reabilitar triggers
        await supabase
          .rpc("sql", {
            query: "ALTER TABLE parametro_precificacao ENABLE TRIGGER ALL",
          })
          .then(() => {
            console.log("Triggers reabilitados")
          })
          .catch(() => {
            console.log("Não foi possível reabilitar triggers")
          })

        // Agora recalcular valores manualmente de forma segura
        await recalcularValoresManualmente(cenario.id, parametros.id, unidades)

        toast({
          title: "Parâmetros atualizados",
          description: "Os parâmetros de precificação foram atualizados com sucesso.",
        })
      } else {
        // Criar novos parâmetros
        const { data: newParametros, error: insertError } = await supabase
          .from("parametro_precificacao")
          .insert({
            ...values,
            cenario_id: cenario.id,
          })
          .select()
          .single()

        if (insertError) {
          throw new Error(`Erro ao criar parâmetros: ${insertError.message}`)
        }

        // Após criar parâmetros, inicializar valores das unidades manualmente
        await inicializarValoresManualmente(cenario.id, newParametros.id, unidades)

        toast({
          title: "Parâmetros criados",
          description: "Os parâmetros de precificação foram criados com sucesso.",
        })
      }

      // Recarregar a página para mostrar os novos valores
      router.refresh()
    } catch (error) {
      console.error("Erro ao salvar parâmetros:", error)
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido"
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowConfirmation(false)
    }
  }

  async function inicializarValoresManualmente(cenarioId: number, parametrosId: number, unidades: any[]) {
    // Primeiro, verificar se já existem registros
    const { data: existingValues } = await supabase
      .from("valor_unidades_cenario")
      .select("unidade_id")
      .eq("cenario_id", cenarioId)

    const existingUnidadeIds = existingValues?.map((v) => v.unidade_id) || []

    // Inserir apenas para unidades que não têm valores ainda
    const unidadesParaInserir = unidades.filter((u) => !existingUnidadeIds.includes(u.id))

    if (unidadesParaInserir.length > 0) {
      const valoresUnidades = unidadesParaInserir.map((unidade) => ({
        cenario_id: cenarioId,
        unidade_id: unidade.id,
        valor_unidade_inicial: 0,
        valor_unidade_venda: 0,
        valor_unidade_base: 0,
        valor_unidade_adicionais: 0,
        valor_unidade_orientacao: 0,
        valor_unidade_pavimento: 0,
        valor_unidade_vista: 0,
        valor_unidade_bloco: 0,
        valor_unidade_diferencial: 0,
        fase_unidade_venda: null,
      }))

      const { error: valoresError } = await supabase.from("valor_unidades_cenario").insert(valoresUnidades)

      if (valoresError) {
        throw new Error(`Erro ao inicializar valores das unidades: ${valoresError.message}`)
      }
    }

    // Agora calcular valores reais
    await recalcularValoresManualmente(cenarioId, parametrosId, unidades)
  }

  async function recalcularValoresManualmente(cenarioId: number, parametrosId: number, unidades: any[]) {
    // Buscar parâmetros
    const { data: parametros, error: paramError } = await supabase
      .from("parametro_precificacao")
      .select("*")
      .eq("id", parametrosId)
      .single()

    if (paramError || !parametros) {
      console.error("Erro ao buscar parâmetros:", paramError)
      return
    }

    // Para cada unidade, calcular e atualizar valores
    for (const unidade of unidades) {
      // Buscar dados completos da unidade
      const { data: unidadeCompleta, error: unidadeError } = await supabase
        .from("unidade")
        .select("*")
        .eq("id", unidade.id)
        .single()

      if (unidadeError || !unidadeCompleta) {
        console.error(`Erro ao buscar unidade ${unidade.id}:`, unidadeError)
        continue
      }

      // Calcular valor base
      let valorBase = 0
      const areaPrivativa = unidadeCompleta.area_privativa || 0
      const areaGarden = unidadeCompleta.area_garden || 0

      switch (unidadeCompleta.tipologia) {
        case "Apartamento":
          valorBase = areaPrivativa * (parametros.valor_area_privativa_apartamento || 0)
          break
        case "Studio":
          valorBase = areaPrivativa * (parametros.valor_area_privativa_studio || 0)
          break
        case "Comercial":
          valorBase = areaPrivativa * (parametros.valor_area_privativa_comercial || 0)
          break
        default:
          valorBase = 0
      }

      // Adicionar valor do garden
      valorBase += areaGarden * (parametros.valor_area_garden || 0)

      // Calcular valor dos adicionais
      const valorAdicionais =
        (unidadeCompleta.qtd_vaga_simples || 0) * (parametros.valor_vaga_simples || 0) +
        (unidadeCompleta.qtd_vaga_duplas || 0) * (parametros.valor_vaga_dupla || 0) +
        (unidadeCompleta.qtd_vaga_moto || 0) * (parametros.valor_vaga_moto || 0) +
        (unidadeCompleta.qtd_hobby_boxes || 0) * (parametros.valor_hobby_boxes || 0) +
        (unidadeCompleta.qtd_suite || 0) * (parametros.valor_suite || 0)

      // Valor inicial = base + adicionais
      const valorInicial = valorBase + valorAdicionais

      // Atualizar ou inserir valores
      const { error: updateError } = await supabase.from("valor_unidades_cenario").upsert(
        {
          cenario_id: cenarioId,
          unidade_id: unidade.id,
          valor_unidade_base: valorBase,
          valor_unidade_adicionais: valorAdicionais,
          valor_unidade_inicial: valorInicial,
          valor_unidade_venda: valorInicial, // Por enquanto, igual ao inicial
          valor_unidade_orientacao: 0, // Será calculado pelos fatores de valorização
          valor_unidade_pavimento: 0,
          valor_unidade_vista: 0,
          valor_unidade_bloco: 0,
          valor_unidade_diferencial: 0,
        },
        {
          onConflict: "cenario_id,unidade_id",
        },
      )

      if (updateError) {
        console.error(`Erro ao atualizar valores da unidade ${unidade.id}:`, updateError)
      }
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Valores Base</CardTitle>
          <CardDescription>Configure os valores base para cálculo do preço das unidades</CardDescription>
        </CardHeader>
        <CardContent>
          {parametros ? (
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>
                Alterar estes valores irá recalcular o preço de todas as unidades deste cenário. Esta operação pode
                levar alguns segundos.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="mb-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Parâmetros não configurados</AlertTitle>
              <AlertDescription>
                Este cenário ainda não possui parâmetros de precificação configurados. Preencha os valores abaixo para
                criar.
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Valores por m²</h3>

                  <FormField
                    control={form.control}
                    name="valor_area_privativa_apartamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor m² - Apartamento</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormDescription>Valor base por m² para apartamentos</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="valor_area_privativa_studio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor m² - Studio</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormDescription>Valor base por m² para studios</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="valor_area_privativa_comercial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor m² - Comercial</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormDescription>Valor base por m² para unidades comerciais</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Valores de Vagas</h3>

                  <FormField
                    control={form.control}
                    name="valor_vaga_simples"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor - Vaga Simples</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormDescription>Valor adicional por vaga simples</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="valor_vaga_dupla"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor - Vaga Dupla</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormDescription>Valor adicional por vaga dupla</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="valor_vaga_moto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor - Vaga Moto</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormDescription>Valor adicional por vaga de moto</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Outros Valores</h3>

                  <FormField
                    control={form.control}
                    name="valor_hobby_boxes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor - Hobby Box</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormDescription>Valor adicional por hobby box</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="valor_area_garden"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor m² - Garden</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormDescription>Valor por m² de área de garden</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="valor_suite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor - Suíte</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormDescription>Valor adicional por suíte</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <CardFooter className="px-0 pb-0">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {parametros ? "Atualizar Parâmetros" : "Criar Parâmetros"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        title="Confirmar alteração de parâmetros"
        description="Alterar os parâmetros de precificação irá recalcular o valor de todas as unidades deste cenário. Esta operação pode levar alguns segundos. Deseja continuar?"
        actionLabel="Confirmar"
        onAction={() => formValues && saveParametros(formValues)}
      />
    </>
  )
}
