"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Calculator, Info } from "lucide-react"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import type { Cenario, ParametroPrecificacao } from "@/types/database"

interface SimulacaoParametrosProps {
  cenario: Cenario
  parametros: ParametroPrecificacao | null
}

const simulacaoFormSchema = z.object({
  valor_m2_apartamento: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero"),
  valor_m2_studio: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero"),
  valor_m2_comercial: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero"),
  percentual_ajuste_vagas: z.coerce.number().min(-100, "Valor mínimo é -100%").max(100, "Valor máximo é 100%"),
  percentual_ajuste_diferenciais: z.coerce.number().min(-100, "Valor mínimo é -100%").max(100, "Valor máximo é 100%"),
})

type SimulacaoFormValues = z.infer<typeof simulacaoFormSchema>

export function SimulacaoParametros({ cenario, parametros }: SimulacaoParametrosProps) {
  const [simulacaoResultado, setSimulacaoResultado] = useState<any>(null)

  const defaultValues: SimulacaoFormValues = {
    valor_m2_apartamento: parametros?.valor_m2_apartamento || 0,
    valor_m2_studio: parametros?.valor_m2_studio || 0,
    valor_m2_comercial: parametros?.valor_m2_comercial || 0,
    percentual_ajuste_vagas: 0,
    percentual_ajuste_diferenciais: 0,
  }

  const form = useForm<SimulacaoFormValues>({
    resolver: zodResolver(simulacaoFormSchema),
    defaultValues,
  })

  function onSubmit(values: SimulacaoFormValues) {
    // Simulação simplificada - em um cenário real, isso seria calculado com base nas unidades reais
    const vgvAtual = cenario.vgv_total || 0

    // Calcular o impacto dos novos valores
    const fatorM2 =
      (values.valor_m2_apartamento / (parametros?.valor_m2_apartamento || 1)) * 0.6 +
      (values.valor_m2_studio / (parametros?.valor_m2_studio || 1)) * 0.3 +
      (values.valor_m2_comercial / (parametros?.valor_m2_comercial || 1)) * 0.1

    const fatorVagas = 1 + values.percentual_ajuste_vagas / 100
    const fatorDiferenciais = 1 + values.percentual_ajuste_diferenciais / 100

    // Estimar o novo VGV
    const novoVGV = vgvAtual * fatorM2 * (0.8 + 0.2 * fatorVagas) * (0.9 + 0.1 * fatorDiferenciais)

    // Calcular a diferença
    const diferenca = novoVGV - vgvAtual
    const percentualDiferenca = (diferenca / vgvAtual) * 100

    setSimulacaoResultado({
      vgvAtual,
      novoVGV,
      diferenca,
      percentualDiferenca,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulação de Alterações</CardTitle>
        <CardDescription>Simule o impacto de alterações nos parâmetros de precificação</CardDescription>
      </CardHeader>
      <CardContent>
        {!parametros ? (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Parâmetros não configurados</AlertTitle>
            <AlertDescription>
              É necessário configurar os parâmetros base antes de realizar simulações.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Simulação</AlertTitle>
            <AlertDescription>
              Esta é uma simulação aproximada do impacto das alterações no VGV total do cenário. Os valores reais podem
              variar de acordo com as características específicas das unidades.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Valores por m²</h3>

                <FormField
                  control={form.control}
                  name="valor_m2_apartamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor m² - Apartamento</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} disabled={!parametros} />
                      </FormControl>
                      <FormDescription>
                        Valor atual: {formatCurrency(parametros?.valor_m2_apartamento || 0)}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valor_m2_studio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor m² - Studio</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} disabled={!parametros} />
                      </FormControl>
                      <FormDescription>Valor atual: {formatCurrency(parametros?.valor_m2_studio || 0)}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valor_m2_comercial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor m² - Comercial</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" {...field} disabled={!parametros} />
                      </FormControl>
                      <FormDescription>
                        Valor atual: {formatCurrency(parametros?.valor_m2_comercial || 0)}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Ajustes Percentuais</h3>

                <FormField
                  control={form.control}
                  name="percentual_ajuste_vagas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ajuste em Vagas (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" min="-100" max="100" {...field} disabled={!parametros} />
                      </FormControl>
                      <FormDescription>Percentual de ajuste no valor de todas as vagas</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="percentual_ajuste_diferenciais"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ajuste em Diferenciais (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" min="-100" max="100" {...field} disabled={!parametros} />
                      </FormControl>
                      <FormDescription>Percentual de ajuste nos valores de suítes, hobby box, etc.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-6">
                  <Button type="submit" disabled={!parametros}>
                    <Calculator className="mr-2 h-4 w-4" />
                    Simular Impacto
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>

        {simulacaoResultado && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Resultado da Simulação</h3>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Métrica</TableHead>
                  <TableHead>Valor Atual</TableHead>
                  <TableHead>Valor Simulado</TableHead>
                  <TableHead>Diferença</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">VGV Total</TableCell>
                  <TableCell>{formatCurrency(simulacaoResultado.vgvAtual)}</TableCell>
                  <TableCell>{formatCurrency(simulacaoResultado.novoVGV)}</TableCell>
                  <TableCell className={simulacaoResultado.diferenca >= 0 ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(simulacaoResultado.diferenca)} (
                    {formatPercentage(simulacaoResultado.percentualDiferenca)})
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Alert className="mt-4" variant={simulacaoResultado.diferenca >= 0 ? "default" : "destructive"}>
              <Info className="h-4 w-4" />
              <AlertTitle>Análise do Impacto</AlertTitle>
              <AlertDescription>
                {simulacaoResultado.diferenca >= 0
                  ? `As alterações simuladas resultariam em um aumento de ${formatCurrency(simulacaoResultado.diferenca)} (${formatPercentage(simulacaoResultado.percentualDiferenca)}) no VGV total do cenário.`
                  : `As alterações simuladas resultariam em uma redução de ${formatCurrency(Math.abs(simulacaoResultado.diferenca))} (${formatPercentage(Math.abs(simulacaoResultado.percentualDiferenca))}) no VGV total do cenário.`}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
