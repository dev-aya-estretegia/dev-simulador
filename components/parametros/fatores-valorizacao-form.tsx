"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Info, Loader2, Plus, Trash } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { Cenario, ParametroPrecificacao, FatorValorizacao } from "@/types/database"

interface FatoresValorizacaoFormProps {
  cenario: Cenario
  parametros: ParametroPrecificacao | null
  fatores: FatorValorizacao[]
}

const fatorFormSchema = z.object({
  tipo_fator: z.enum(["Orientacao Solar", "Pavimento", "Vista", "Bloco", "Diferencial"]),
  valor_referencia: z.string().min(1, "Valor de referência é obrigatório"),
  percentual_valorizacao: z.coerce.number().min(-100, "Valor mínimo é -100%").max(100, "Valor máximo é 100%"),
})

type FatorFormValues = z.infer<typeof fatorFormSchema>

export function FatoresValorizacaoForm({ cenario, parametros, fatores }: FatoresValorizacaoFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [fatorParaExcluir, setFatorParaExcluir] = useState<number | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const defaultValues: FatorFormValues = {
    tipo_fator: "Orientacao Solar",
    valor_referencia: "",
    percentual_valorizacao: 0,
  }

  const form = useForm<FatorFormValues>({
    resolver: zodResolver(fatorFormSchema),
    defaultValues,
  })

  async function onSubmit(values: FatorFormValues) {
    if (!parametros) {
      toast({
        title: "Erro",
        description: "É necessário configurar os parâmetros base antes de adicionar fatores de valorização.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("Iniciando processo de adição/atualização de fator")

      // Verificar se já existe um fator com o mesmo tipo e valor de referência
      const { data: existingFatores, error: queryError } = await supabase
        .from("fator_valorizacao")
        .select("id")
        .eq("parametro_precificacao_id", parametros.id)
        .eq("tipo_fator", values.tipo_fator)
        .eq("valor_referencia", values.valor_referencia)

      if (queryError) {
        console.error("Erro ao verificar fator existente:", queryError)
        throw queryError
      }

      console.log("Resultado da verificação:", existingFatores)

      if (existingFatores && existingFatores.length > 0) {
        // Se o fator já existe, atualize-o
        const existingFatorId = existingFatores[0].id
        console.log("Atualizando fator existente com ID:", existingFatorId)

        const { error: updateError } = await supabase
          .from("fator_valorizacao")
          .update({
            percentual_valorizacao: values.percentual_valorizacao,
          })
          .eq("id", existingFatorId)

        if (updateError) {
          console.error("Erro ao atualizar fator:", updateError)
          throw updateError
        }

        toast({
          title: "Fator atualizado",
          description: "O fator de valorização foi atualizado com sucesso.",
        })
      } else {
        // SOLUÇÃO: Obter o próximo ID manualmente antes de inserir
        console.log("Buscando o maior ID existente na tabela fator_valorizacao")
        const { data: maxIdResult, error: maxIdError } = await supabase
          .from("fator_valorizacao")
          .select("id")
          .order("id", { ascending: false })
          .limit(1)
          .single()

        if (maxIdError && maxIdError.code !== "PGRST116") {
          // PGRST116 é o código para "nenhum resultado encontrado"
          console.error("Erro ao buscar o maior ID:", maxIdError)
          throw maxIdError
        }

        // Determinar o próximo ID
        const nextId = maxIdResult ? maxIdResult.id + 1 : 1
        console.log("Próximo ID a ser usado:", nextId)

        // Inserir com ID explícito
        console.log("Inserindo novo fator com valores:", {
          id: nextId,
          parametro_precificacao_id: parametros.id,
          tipo_fator: values.tipo_fator,
          valor_referencia: values.valor_referencia,
          percentual_valorizacao: values.percentual_valorizacao,
        })

        const { error: insertError } = await supabase.from("fator_valorizacao").insert({
          id: nextId, // Especificar o ID explicitamente
          parametro_precificacao_id: parametros.id,
          tipo_fator: values.tipo_fator,
          valor_referencia: values.valor_referencia,
          percentual_valorizacao: values.percentual_valorizacao,
        })

        if (insertError) {
          console.error("Erro detalhado ao inserir fator:", insertError)
          throw insertError
        }

        toast({
          title: "Fator adicionado",
          description: "O fator de valorização foi adicionado com sucesso.",
        })
      }

      // Limpar o formulário
      form.reset(defaultValues)

      // Recarregar a página para mostrar o novo fator
      router.refresh()
    } catch (error) {
      console.error("Erro ao processar fator:", error)
      toast({
        title: "Erro",
        description:
          error instanceof Error ? `Erro: ${error.message}` : "Ocorreu um erro ao processar o fator de valorização.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function excluirFator(id: number) {
    setIsLoading(true)

    try {
      const { error } = await supabase.from("fator_valorizacao").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Fator excluído",
        description: "O fator de valorização foi excluído com sucesso.",
      })

      // Recarregar a página para atualizar a lista
      router.refresh()
    } catch (error) {
      console.error("Erro ao excluir fator:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o fator de valorização.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setFatorParaExcluir(null)
    }
  }

  function getTipoFatorLabel(tipo: string) {
    switch (tipo) {
      case "Orientacao Solar":
        return "Orientação Solar"
      case "Pavimento":
        return "Pavimento"
      case "Vista":
        return "Vista"
      case "Bloco":
        return "Bloco"
      case "Diferencial":
        return "Diferencial"
      default:
        return tipo
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Fatores de Valorização</CardTitle>
          <CardDescription>Configure os fatores que valorizam ou desvalorizam as unidades</CardDescription>
        </CardHeader>
        <CardContent>
          {!parametros ? (
            <Alert className="mb-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Parâmetros não configurados</AlertTitle>
              <AlertDescription>
                É necessário configurar os parâmetros base antes de adicionar fatores de valorização.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>
                Adicionar, alterar ou remover fatores de valorização irá recalcular o preço de todas as unidades
                afetadas.
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="tipo_fator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Fator</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!parametros || isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Orientacao Solar">Orientação Solar</SelectItem>
                          <SelectItem value="Pavimento">Pavimento</SelectItem>
                          <SelectItem value="Vista">Vista</SelectItem>
                          <SelectItem value="Bloco">Bloco</SelectItem>
                          <SelectItem value="Diferencial">Diferencial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Categoria do fator de valorização</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valor_referencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor de Referência</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Norte, 10º andar, Mar..."
                          {...field}
                          disabled={!parametros || isLoading}
                        />
                      </FormControl>
                      <FormDescription>Identificação do fator (ex: Norte, 10º andar)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="percentual_valorizacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percentual de Valorização (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="-100"
                          max="100"
                          {...field}
                          disabled={!parametros || isLoading}
                        />
                      </FormControl>
                      <FormDescription>Percentual de valorização ou desvalorização</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={!parametros || isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Adicionar Fator
              </Button>
            </form>
          </Form>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Fatores Cadastrados</h3>

            {fatores.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor de Referência</TableHead>
                    <TableHead>Percentual</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fatores.map((fator) => (
                    <TableRow key={fator.id}>
                      <TableCell>{getTipoFatorLabel(fator.tipo_fator)}</TableCell>
                      <TableCell>{fator.valor_referencia}</TableCell>
                      <TableCell>{fator.percentual_valorizacao}%</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setFatorParaExcluir(fator.id)}
                          disabled={isLoading}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center py-4 text-muted-foreground">Nenhum fator de valorização cadastrado.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={fatorParaExcluir !== null}
        onOpenChange={() => setFatorParaExcluir(null)}
        title="Confirmar exclusão"
        description="Excluir este fator de valorização irá recalcular o valor de todas as unidades afetadas. Esta operação não pode ser desfeita. Deseja continuar?"
        actionLabel="Excluir"
        actionVariant="destructive"
        onAction={() => fatorParaExcluir && excluirFator(fatorParaExcluir)}
      />
    </>
  )
}
