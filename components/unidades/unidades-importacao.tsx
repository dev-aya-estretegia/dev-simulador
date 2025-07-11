"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Download, Upload, AlertCircle, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { importarUnidadesAction } from "@/app/unidades/importar/actions"

interface UnidadesImportacaoProps {
  empreendimentos: { id: number; nome: string }[]
}

const unidadeSchema = z.object({
  nome: z.string().min(1, "O nome da unidade é obrigatório"),
  tipologia: z.enum(["Apartamento", "Studio", "Comercial"], {
    errorMap: () => ({ message: "Tipologia inválida. Deve ser Apartamento, Studio ou Comercial" }),
  }),
  area_privativa: z.coerce.number().positive("A área privativa deve ser maior que zero"),
  area_garden: z.coerce.number().min(0, "Área garden não pode ser negativa").optional().nullable(),
  pavimento: z.coerce.number().int("O pavimento deve ser um número inteiro"),
  bloco: z.string().min(1, "O bloco é obrigatório"),
  orientacao_solar: z.enum(["Norte", "Sul", "Leste", "Oeste", "Nordeste", "Noroeste", "Sudeste", "Sudoeste"], {
    errorMap: () => ({ message: "Orientação solar inválida" }),
  }),
  vista: z.string().optional().nullable(),
  diferencial: z.string().optional().nullable(),
  qtd_vaga_simples: z.coerce.number().int().min(0, "Não pode ser negativo").default(0),
  qtd_vaga_duplas: z.coerce.number().int().min(0, "Não pode ser negativo").default(0),
  qtd_vaga_moto: z.coerce.number().int().min(0, "Não pode ser negativo").default(0),
  qtd_hobby_boxes: z.coerce.number().int().min(0, "Não pode ser negativo").default(0),
  qtd_suite: z.coerce.number().int().min(0, "Não pode ser negativo").default(0),
})

type UnidadeImportacao = z.infer<typeof unidadeSchema>

export function UnidadesImportacao({ empreendimentos }: UnidadesImportacaoProps) {
  const router = useRouter()
  const [empreendimentoId, setEmpreendimentoId] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)
  const [unidades, setUnidades] = useState<UnidadeImportacao[]>([])
  const [errosValidacao, setErrosValidacao] = useState<Record<number, string[]>>({})
  const [isProcessando, setIsProcessando] = useState(false)
  const [isImportando, setIsImportando] = useState(false)
  const [progresso, setProgresso] = useState(0)

  async function processarArquivo(file: File) {
    setIsProcessando(true)
    setUnidades([])
    setErrosValidacao({})

    try {
      const XLSX = await import("xlsx")
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: "array" })
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: null })

          if (jsonData.length <= 1) throw new Error("Arquivo vazio ou sem dados válidos")

          const headers = jsonData[0] as string[]
          const unidadesMapeadas: UnidadeImportacao[] = []
          const erros: Record<number, string[]> = {}

          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[]
            if (!row || row.every((cell) => cell === null)) continue

            const unidadeData: Record<string, any> = {}
            headers.forEach((header, index) => {
              unidadeData[header] = row[index]
            })

            const validationResult = unidadeSchema.safeParse(unidadeData)
            if (validationResult.success) {
              unidadesMapeadas.push(validationResult.data)
            } else {
              erros[i + 1] = validationResult.error.errors.map((e) => `${e.path.join(".") || "geral"}: ${e.message}`)
            }
          }

          setUnidades(unidadesMapeadas)
          setErrosValidacao(erros)

          if (Object.keys(erros).length > 0) {
            toast({
              title: "Erros de validação",
              description: `Foram encontrados erros em ${Object.keys(erros).length} linhas. Corrija-os antes de importar.`,
              variant: "destructive",
            })
          } else if (unidadesMapeadas.length > 0) {
            toast({
              title: "Arquivo processado com sucesso",
              description: `${unidadesMapeadas.length} unidades prontas para importação.`,
            })
          }
        } catch (error) {
          toast({
            title: "Erro ao processar arquivo",
            description: error instanceof Error ? error.message : "Erro desconhecido",
            variant: "destructive",
          })
        } finally {
          setIsProcessando(false)
        }
      }
      reader.readAsArrayBuffer(file)
    } catch (error) {
      toast({
        title: "Erro ao carregar dependências",
        description: "Não foi possível carregar as bibliotecas necessárias para a leitura do arquivo.",
        variant: "destructive",
      })
      setIsProcessando(false)
    }
  }

  async function importarUnidades() {
    if (!empreendimentoId || unidades.length === 0) {
      toast({
        title: "Dados incompletos",
        description: "Selecione um empreendimento e processe um arquivo com unidades válidas.",
        variant: "destructive",
      })
      return
    }

    setIsImportando(true)
    setProgresso(10)

    // Chama a Server Action para executar a lógica de importação no servidor.
    const result = await importarUnidadesAction(Number(empreendimentoId), unidades)

    setIsImportando(false)

    // Trata o resultado retornado pela Server Action.
    if (!result.success) {
      console.error("Erro retornado pela Server Action:", result.error)
      toast({
        title: `Erro ao importar a unidade: ${result.error?.unitName || "Desconhecida"}`,
        description: `O servidor retornou um erro: ${result.error?.message || "Erro desconhecido."}`,
        variant: "destructive",
      })
      setProgresso(0)
      return
    }

    setProgresso(100)
    toast({
      title: "Importação Concluída",
      description: `${result.successCount} unidades foram importadas com sucesso.`,
    })

    setTimeout(() => {
      router.push(`/empreendimentos/${empreendimentoId}`)
      router.refresh()
    }, 2000)
  }

  function baixarModelo() {
    try {
      const headers = [
        "nome",
        "tipologia",
        "area_privativa",
        "area_garden",
        "pavimento",
        "bloco",
        "orientacao_solar",
        "vista",
        "diferencial",
        "qtd_vaga_simples",
        "qtd_vaga_duplas",
        "qtd_vaga_moto",
        "qtd_hobby_boxes",
        "qtd_suite",
      ]
      const exampleData = [
        ["Apto 101", "Apartamento", 75.5, null, 1, "A", "Norte", "Parque", null, 1, 0, 0, 0, 2],
        ["Studio 201", "Studio", 35.8, null, 2, "B", "Leste", null, "Piso elevado", 1, 0, 0, 0, 0],
      ]
      import("xlsx").then((XLSX) => {
        const ws = XLSX.utils.aoa_to_sheet([headers, ...exampleData])
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Unidades")
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
        const blob = new Blob([wbout], { type: "application/octet-stream" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "modelo_importacao_unidades.xlsx"
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }, 0)
      })
    } catch (error) {
      toast({
        title: "Erro ao baixar modelo",
        description: "Não foi possível gerar o arquivo modelo.",
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
          <h2 className="text-xl font-semibold">Importação em Lote</h2>
          <p className="text-sm text-muted-foreground">
            Importe múltiplas unidades de uma só vez usando um arquivo CSV ou Excel
          </p>
        </div>
        <Button variant="outline" onClick={baixarModelo} className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Baixar Modelo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Configurações de Importação</CardTitle>
          <CardDescription>Selecione o empreendimento para o qual deseja importar as unidades.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Empreendimento</label>
            <Select
              value={empreendimentoId}
              onValueChange={setEmpreendimentoId}
              disabled={isProcessando || isImportando}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um empreendimento" />
              </SelectTrigger>
              <SelectContent>
                {empreendimentos.map((empreendimento) => (
                  <SelectItem key={empreendimento.id} value={empreendimento.id.toString()}>
                    {empreendimento.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Upload e Validação do Arquivo</CardTitle>
          <CardDescription>Envie o arquivo e verifique se os dados estão corretos antes de importar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Arquivo de Importação (.xlsx, .csv)</label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0]
                  if (selectedFile) {
                    setFile(selectedFile)
                    processarArquivo(selectedFile)
                  }
                }}
                disabled={isProcessando || isImportando || !empreendimentoId}
                className="flex-1"
              />
            </div>
          </div>

          {isImportando && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso da importação</span>
                <span>{progresso}%</span>
              </div>
              <Progress value={progresso} className="h-2" />
            </div>
          )}

          {Object.keys(errosValidacao).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erros de validação encontrados</AlertTitle>
              <AlertDescription>
                Corrija os erros no arquivo e envie-o novamente. Veja a prévia de erros abaixo.
              </AlertDescription>
            </Alert>
          )}

          {unidades.length > 0 && Object.keys(errosValidacao).length === 0 && (
            <Alert variant="default" className="bg-primary/10 text-primary border-primary/20">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Arquivo válido!</AlertTitle>
              <AlertDescription>{unidades.length} unidades prontas para importação.</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={importarUnidades}
            disabled={
              !empreendimentoId ||
              unidades.length === 0 ||
              Object.keys(errosValidacao).length > 0 ||
              isProcessando ||
              isImportando
            }
            className="gap-2"
          >
            {isImportando ? (
              <>
                <Upload className="h-4 w-4 animate-pulse" />
                Importando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Importar {unidades.length} Unidades
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {(unidades.length > 0 || Object.keys(errosValidacao).length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>3. Prévia dos Dados</CardTitle>
            <CardDescription>Revise os dados validados e os erros encontrados no arquivo.</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(errosValidacao).length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Erros de Validação</h3>
                <div className="rounded-md border max-h-60 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Linha</TableHead>
                        <TableHead>Erros</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(errosValidacao).map(([linha, erros]) => (
                        <TableRow key={linha}>
                          <TableCell className="font-medium">Linha {linha}</TableCell>
                          <TableCell>
                            <ul className="list-disc pl-4 space-y-1">
                              {erros.map((erro, index) => (
                                <li key={index} className="text-destructive text-sm">
                                  {erro}
                                </li>
                              ))}
                            </ul>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
            {unidades.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Unidades Válidas</h3>
                <div className="rounded-md border max-h-60 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipologia</TableHead>
                        <TableHead>Área (m²)</TableHead>
                        <TableHead>Pavimento</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unidades.map((unidade, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{unidade.nome}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{unidade.tipologia}</Badge>
                          </TableCell>
                          <TableCell>{unidade.area_privativa} m²</TableCell>
                          <TableCell>{unidade.pavimento}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
