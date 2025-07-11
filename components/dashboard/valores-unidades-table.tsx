"use client"

import React, { useRef, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Search, Building2, Layers, Download, FileText, Check, ChevronsUpDown, X } from "lucide-react"
import type { FaseVenda } from "@/hooks/use-valores-unidades"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface ValorUnidade {
  unidade_id: number
  unidade_nome: string
  bloco: string | null
  pavimento: number | null
  tipologia: string
  area_privativa: number
  area_garden: number | null
  cenario_id: number
  cenario_nome: string
  valor_unidade_inicial: number
  valor_unidade_fase_1: number | null
  valor_unidade_fase_2: number | null
  valor_unidade_fase_3: number | null
  valor_unidade_fase_4: number | null
  valor_unidade_fase_5: number | null
  valor_unidade_fase_6: number | null
  valor_unidade_fase_7: number | null
  valor_unidade_fase_8: number | null
  valor_unidade_fase_9: number | null
  valor_unidade_fase_10: number | null
  fase_unidade_venda: string | null
  valor_unidade_venda: number | null
  // Novas propriedades para valor por m²
  valor_m2_inicial: number
  valor_m2_fase_1: number | null
  valor_m2_fase_2: number | null
  valor_m2_fase_3: number | null
  valor_m2_fase_4: number | null
  valor_m2_fase_5: number | null
  valor_m2_fase_6: number | null
  valor_m2_fase_7: number | null
  valor_m2_fase_8: number | null
  valor_m2_fase_9: number | null
  valor_m2_fase_10: number | null
  valor_m2_venda: number | null
}

interface ValoresUnidadesTableProps {
  valoresUnidades: ValorUnidade[]
  fases: FaseVenda[]
  loading: boolean
  error: string | null
}

export function ValoresUnidadesTable({
  valoresUnidades = [],
  fases = [],
  loading = false,
  error = null,
}: ValoresUnidadesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [tipologiaFilter, setTipologiaFilter] = useState<string>("todas")
  const [blocoFilter, setBlocoFilter] = useState<string>("todos")
  const [fasesVendaFilter, setFasesVendaFilter] = useState<string[]>([])
  const [openFasesPopover, setOpenFasesPopover] = useState(false)
  const tableRef = useRef<HTMLDivElement>(null)
  const [terminacaoFilter, setTerminacaoFilter] = useState<string>("todas")

  // Garantir que valoresUnidades seja sempre um array
  const safeValoresUnidades = Array.isArray(valoresUnidades) ? valoresUnidades : []
  const safeFases = Array.isArray(fases) ? fases : []

  // Extrair opções únicas para filtros
  const tipologias = ["todas", ...new Set(safeValoresUnidades.map((u) => u.tipologia || ""))]
  const blocos = ["todos", ...new Set(safeValoresUnidades.map((u) => u.bloco).filter(Boolean) as string[])]

  // Função para extrair os dois últimos números do nome da unidade
  const extrairTerminacao = (nomeUnidade: string): string | null => {
    // Buscar por números no final do nome
    const match = nomeUnidade.match(/(\d{2,})$/)
    if (match) {
      const numeros = match[1]
      // Pegar os dois últimos dígitos
      return numeros.slice(-2)
    }
    return null
  }

  // Extrair terminações únicas para filtros
  const terminacoes = [
    "todas",
    ...new Set(safeValoresUnidades.map((u) => extrairTerminacao(u.unidade_nome)).filter(Boolean) as string[]),
  ].sort()

  // Extrair opções únicas para o filtro de fase de venda e ordenar
  const fasesVendaOptions = Array.from(
    new Set(safeValoresUnidades.map((u) => u.fase_unidade_venda).filter(Boolean) as string[]),
  ).sort((a, b) => {
    // Tenta extrair números das strings para ordenação numérica
    const numA = a.match(/\d+/)?.[0]
    const numB = b.match(/\d+/)?.[0]

    if (numA && numB) {
      return Number.parseInt(numA) - Number.parseInt(numB)
    }

    // Se não conseguir extrair números, usa ordenação alfabética
    return a.localeCompare(b)
  })

  // Função para alternar uma fase no filtro
  const toggleFaseVenda = (fase: string) => {
    setFasesVendaFilter((current) => {
      if (current.includes(fase)) {
        return current.filter((f) => f !== fase)
      } else {
        return [...current, fase]
      }
    })
  }

  // Limpar todos os filtros de fase
  const clearFasesFilter = () => {
    setFasesVendaFilter([])
  }

  // Aplicar filtros
  const filteredUnidades = safeValoresUnidades.filter((unidade) => {
    const matchesSearch = (unidade.unidade_nome || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipologia = tipologiaFilter === "todas" || unidade.tipologia === tipologiaFilter
    const matchesBloco = blocoFilter === "todos" || unidade.bloco === blocoFilter

    // Novo filtro de terminação
    const matchesTerminacao =
      terminacaoFilter === "todas" || extrairTerminacao(unidade.unidade_nome) === terminacaoFilter

    // Verifica se a fase da unidade está no array de fases selecionadas ou se nenhuma fase está selecionada
    const matchesFaseVenda =
      fasesVendaFilter.length === 0 ||
      (unidade.fase_unidade_venda && fasesVendaFilter.includes(unidade.fase_unidade_venda))

    return matchesSearch && matchesTipologia && matchesBloco && matchesTerminacao && matchesFaseVenda
  })

  // Formatar valor para exibição
  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return "-"
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Função para obter o valor de uma fase específica
  const getValorFase = (unidade: ValorUnidade, ordem: number) => {
    if (!unidade) return null
    const fieldName = `valor_unidade_fase_${ordem}` as keyof ValorUnidade
    return unidade[fieldName] as number | null
  }

  // Função para obter o valor por m² de uma fase específica
  const getValorM2Fase = (unidade: ValorUnidade, ordem: number) => {
    if (!unidade) return null
    const fieldName = `valor_m2_fase_${ordem}` as keyof ValorUnidade
    return unidade[fieldName] as number | null
  }

  // Exportar para CSV
  const exportToCSV = () => {
    // Cabeçalhos básicos
    const headers = [
      "Unidade",
      "Bloco",
      "Pavimento",
      "Tipologia",
      "Área (m²)",
      "Fase de Venda",
      "Valor Inicial",
      "Valor/m² Inicial",
    ]

    // Adicionar cabeçalhos para cada fase (valor total e valor/m²)
    safeFases.forEach((fase) => {
      headers.push(`${fase.nome} (Total)`)
      headers.push(`${fase.nome} (R$/m²)`)
    })

    // Adicionar cabeçalhos finais
    headers.push("Valor de Venda", "Valor/m² de Venda")

    // Preparar dados
    const csvData = filteredUnidades.map((u) => {
      const row = [
        u.unidade_nome || "",
        u.bloco || "",
        u.pavimento?.toString() || "",
        u.tipologia || "",
        (u.area_privativa || 0).toFixed(2),
        u.fase_unidade_venda || "",
        (u.valor_unidade_inicial || 0).toString(),
        (u.valor_m2_inicial || 0).toString(),
      ]

      // Adicionar valores para cada fase
      safeFases.forEach((fase) => {
        const valorFase = getValorFase(u, fase.ordem)
        const valorM2Fase = getValorM2Fase(u, fase.ordem)
        row.push(valorFase?.toString() || "")
        row.push(valorM2Fase?.toString() || "")
      })

      // Adicionar valores finais
      row.push(u.valor_unidade_venda?.toString() || "")
      row.push(u.valor_m2_venda?.toString() || "")

      return row
    })

    // Criar conteúdo CSV
    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    // Criar e baixar o arquivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `valores-unidades-${new Date().toISOString().split("T")[0]}.csv`)
    link.click()
  }

  // Exportar para PDF
  const exportToPDF = () => {
    // Determinar o formato do PDF com base no número de fases
    // Para muitas fases, usamos A3 para garantir que tudo caiba
    const pdfFormat = safeFases.length > 5 ? "a3" : "a4"

    // Criar nova instância do jsPDF
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: pdfFormat,
    })

    // Configurar cores e estilos
    const primaryColor = "#17c442"
    const darkColor = "#1c1f24"
    const lightColor = "#ffffff"
    const grayColor = "#cccccc"

    // Calcular o tamanho da fonte com base no número de colunas
    // Quanto mais colunas, menor a fonte para garantir que tudo caiba
    const baseFontSize = safeFases.length > 5 ? 6 : safeFases.length > 3 ? 7 : 8

    // Preparar cabeçalhos da tabela - versão compacta para economizar espaço
    const headers = [
      "Unidade",
      "Bloco",
      "Pav.",
      "Tipo",
      "Área",
      "Fase",
      "Valor Inicial",
      ...safeFases.map((f) => (f.nome.length > 8 ? f.nome.substring(0, 8) + "..." : f.nome)),
      "Valor Venda",
    ]

    // Agrupar unidades por bloco e pavimento
    const groupedUnidades: Record<string, Record<number, ValorUnidade[]>> = {}

    filteredUnidades.forEach((unidade) => {
      const bloco = unidade.bloco || "Sem Bloco"
      const pavimento = unidade.pavimento || 0

      if (!groupedUnidades[bloco]) {
        groupedUnidades[bloco] = {}
      }

      if (!groupedUnidades[bloco][pavimento]) {
        groupedUnidades[bloco][pavimento] = []
      }

      groupedUnidades[bloco][pavimento].push(unidade)
    })

    // Função para adicionar cabeçalho em cada página
    const addHeader = (doc: jsPDF, cenarioNome?: string, bloco?: string, pavimento?: string) => {
      // Adicionar cabeçalho
      doc.setFillColor(darkColor)
      doc.rect(0, 0, doc.internal.pageSize.width, 20, "F")

      // Logo e título
      doc.setTextColor(primaryColor)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.text("Simulador de VGV - AYA Estratégia Imobiliária", 15, 8)

      // Data de exportação
      doc.setTextColor(lightColor)
      doc.setFontSize(8)
      const dataAtual = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      doc.text(`Exportado em: ${dataAtual}`, 15, 14)

      // Informações do cenário, bloco e pavimento
      let infoText = ""
      if (cenarioNome) infoText += `Cenário: ${cenarioNome}`
      if (bloco) infoText += ` | Bloco: ${bloco}`
      if (pavimento) infoText += ` | Pavimento: ${pavimento}`

      if (infoText) {
        doc.text(infoText, doc.internal.pageSize.width - 20, 14, { align: "right" })
      }
    }

    // Função para adicionar rodapé em cada página
    const addFooter = (doc: jsPDF, pageNumber: number, totalPages: number) => {
      // Adicionar rodapé
      doc.setFillColor(darkColor)
      doc.rect(0, doc.internal.pageSize.height - 8, doc.internal.pageSize.width, 8, "F")

      doc.setTextColor(lightColor)
      doc.setFontSize(7)
      doc.text(
        "© AYA Estratégia Imobiliária - Simulador de VGV",
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 3,
        { align: "center" },
      )

      // Adicionar número de página
      doc.text(
        `Página ${pageNumber} de ${totalPages}`,
        doc.internal.pageSize.width - 15,
        doc.internal.pageSize.height - 3,
      )
    }

    // Obter o nome do cenário se disponível
    const cenarioNome = safeValoresUnidades.length > 0 ? safeValoresUnidades[0].cenario_nome : undefined

    // Contador de páginas para pré-calcular o total
    let totalPages = 0

    // Primeiro, contar o número total de páginas
    Object.entries(groupedUnidades).forEach(([bloco, pavimentos]) => {
      Object.keys(pavimentos).forEach(() => {
        totalPages++
      })
    })

    // Contador de página atual
    let currentPage = 0

    // Processar cada bloco e pavimento
    Object.entries(groupedUnidades).forEach(([bloco, pavimentos]) => {
      // Ordenar pavimentos em ordem crescente
      const sortedPavimentos = Object.entries(pavimentos).sort((a, b) => Number(a[0]) - Number(b[0]))

      sortedPavimentos.forEach(([pavimento, unidades], pavimentoIndex) => {
        currentPage++

        // Adicionar nova página se não for a primeira
        if (currentPage > 1) {
          doc.addPage()
        }

        // Adicionar cabeçalho na página
        addHeader(doc, cenarioNome, bloco, pavimento)

        // Preparar dados para este pavimento
        const tableData: any[] = []

        // Adicionar unidades do pavimento
        unidades.forEach((unidade) => {
          const row = [
            unidade.unidade_nome || "",
            unidade.bloco || "-",
            unidade.pavimento?.toString() || "-",
            unidade.tipologia || "",
            (unidade.area_privativa || 0).toFixed(1),
            unidade.fase_unidade_venda || "-",
            {
              content: `${formatCurrency(unidade.valor_unidade_inicial).replace("R$", "").trim()}\n${formatCurrency(
                unidade.valor_m2_inicial || 0,
              )
                .replace("R$", "")
                .trim()}/m²`,
              styles: {
                cellPadding: { top: 2, bottom: 2, left: 1, right: 1 },
              },
            },
          ]

          // Adicionar valores para cada fase
          safeFases.forEach((fase) => {
            const valorFase = getValorFase(unidade, fase.ordem)
            const valorM2Fase = getValorM2Fase(unidade, fase.ordem)

            if (valorFase === null) {
              row.push("-")
            } else {
              row.push({
                content: `${formatCurrency(valorFase).replace("R$", "").trim()}\n${
                  valorM2Fase ? formatCurrency(valorM2Fase).replace("R$", "").trim() + "/m²" : "-"
                }`,
                styles: {
                  cellPadding: { top: 2, bottom: 2, left: 1, right: 1 },
                },
              })
            }
          })

          // Adicionar valores finais
          row.push(
            unidade.valor_unidade_venda === null
              ? "-"
              : {
                  content: `${formatCurrency(unidade.valor_unidade_venda).replace("R$", "").trim()}\n${
                    unidade.valor_m2_venda
                      ? formatCurrency(unidade.valor_m2_venda).replace("R$", "").trim() + "/m²"
                      : "-"
                  }`,
                  styles: {
                    cellPadding: { top: 2, bottom: 2, left: 1, right: 1 },
                  },
                },
          )
          tableData.push(row)
        })

        // Calcular a altura disponível para a tabela
        const availableHeight = doc.internal.pageSize.height - 30 // 20px para cabeçalho, 10px para rodapé e margens

        // Gerar tabela no PDF para este pavimento
        autoTable(doc, {
          head: [headers],
          body: tableData,
          startY: 22, // Começar logo abaixo do cabeçalho
          theme: "grid",
          styles: {
            fontSize: baseFontSize,
            cellPadding: 1, // Reduzido para economizar espaço
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
            overflow: "linebreak", // Quebrar linhas longas
            minCellHeight: 8, // Altura mínima para células
          },
          headStyles: {
            fillColor: darkColor,
            textColor: lightColor,
            fontStyle: "bold",
            fontSize: baseFontSize,
          },
          alternateRowStyles: {
            fillColor: [240, 240, 240],
          },
          // Configurar larguras de coluna específicas para otimizar o espaço
          columnStyles: {
            0: { fontStyle: "bold", cellWidth: "auto" }, // Unidade
            1: { cellWidth: 15 }, // Bloco
            2: { cellWidth: 10 }, // Pavimento
            3: { cellWidth: 15 }, // Tipologia
            4: { cellWidth: 12, halign: "right" }, // Área
            5: { cellWidth: 15 }, // Fase de Venda
            6: { cellWidth: "auto", halign: "right" }, // Valor Inicial
            // Colunas de fase serão ajustadas automaticamente
            [6 + safeFases.length + 1]: { cellWidth: "auto", halign: "right" }, // Valor de Venda
          },
          didDrawCell: (data) => {
            // Adicionar cor verde para os valores por m²
            if (data.section === "body" && data.column.index >= 6 && data.cell.text) {
              const text = data.cell.text.toString()
              if (text.includes("/m²")) {
                const lines = text.split("\n")
                if (lines.length > 1) {
                  // Remover o texto original
                  data.cell.text = ""

                  // Adicionar a primeira linha (valor total)
                  doc.setTextColor(0, 0, 0) // Preto
                  doc.setFontSize(baseFontSize)
                  doc.text(lines[0], data.cell.x + data.cell.padding("left"), data.cell.y + 4)

                  // Adicionar a segunda linha (valor por m²) em verde
                  doc.setTextColor(23, 196, 66) // Verde AYA
                  doc.setFontSize(baseFontSize - 1)
                  doc.text(lines[1], data.cell.x + data.cell.padding("left"), data.cell.y + 8)
                }
              }
            }
          },
          // Ajustar a tabela para caber na página
          margin: { top: 22, right: 5, bottom: 10, left: 5 },
          tableWidth: "auto",
        })

        // Adicionar rodapé
        addFooter(doc, currentPage, totalPages)
      })
    })

    // Salvar o PDF
    doc.save(`valores-unidades-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-800">
        <CardContent className="flex items-center gap-2 p-6">
          <p className="text-red-400">{typeof error === "string" ? error : "Ocorreu um erro ao carregar os dados"}</p>
        </CardContent>
      </Card>
    )
  }

  // Agrupar unidades por bloco e pavimento
  const groupedUnidades: Record<string, Record<number, ValorUnidade[]>> = {}

  filteredUnidades.forEach((unidade) => {
    const bloco = unidade.bloco || "Sem Bloco"
    const pavimento = unidade.pavimento || 0

    if (!groupedUnidades[bloco]) {
      groupedUnidades[bloco] = {}
    }

    if (!groupedUnidades[bloco][pavimento]) {
      groupedUnidades[bloco][pavimento] = []
    }

    groupedUnidades[bloco][pavimento].push(unidade)
  })

  return (
    <Card style={{ backgroundColor: "#1c1f24" }} className="border-gray-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#17c442]" />
            Valores das Unidades por Fase
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              disabled={loading || filteredUnidades.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPDF}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              disabled={loading || filteredUnidades.length === 0}
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar unidade..."
              className="pl-8 bg-gray-700 border-gray-600 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={tipologiaFilter} onValueChange={setTipologiaFilter}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Filtrar por tipologia" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {tipologias.map((tipologia) => (
                <SelectItem key={tipologia} value={tipologia} className="text-white hover:bg-gray-600">
                  {tipologia === "todas" ? "Todas as tipologias" : tipologia}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={blocoFilter} onValueChange={setBlocoFilter}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Filtrar por bloco" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {blocos.map((bloco) => (
                <SelectItem key={bloco} value={bloco} className="text-white hover:bg-gray-600">
                  {bloco === "todos" ? "Todos os blocos" : bloco}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={terminacaoFilter} onValueChange={setTerminacaoFilter}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Filtrar por terminação" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {terminacoes.map((terminacao) => (
                <SelectItem key={terminacao} value={terminacao} className="text-white hover:bg-gray-600">
                  {terminacao === "todas" ? "Todas as terminações" : `${terminacao}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filtro de múltiplas fases de venda */}
          <Popover open={openFasesPopover} onOpenChange={setOpenFasesPopover}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openFasesPopover}
                className="justify-between bg-gray-700 border-gray-600 text-white hover:bg-gray-600 w-full"
              >
                {fasesVendaFilter.length > 0 ? (
                  <div className="flex items-center gap-1 overflow-hidden">
                    <span className="truncate">
                      {fasesVendaFilter.length === 1
                        ? fasesVendaFilter[0]
                        : `${fasesVendaFilter.length} fases selecionadas`}
                    </span>
                  </div>
                ) : (
                  "Filtrar por fase de venda"
                )}
                <div className="flex">
                  {fasesVendaFilter.length > 0 && (
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        clearFasesFilter()
                      }}
                      className="h-4 w-4 p-0 mr-1 hover:bg-transparent"
                    >
                      <X className="h-3 w-3 text-gray-400" />
                    </Button>
                  )}
                  <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 bg-gray-800 border-gray-700 text-white">
              <Command className="bg-transparent">
                <CommandInput placeholder="Buscar fase..." className="bg-gray-800 text-white" />
                <CommandList>
                  <CommandEmpty>Nenhuma fase encontrada.</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-60">
                      {fasesVendaOptions.map((fase) => (
                        <CommandItem
                          key={fase}
                          value={fase}
                          onSelect={() => toggleFaseVenda(fase)}
                          className="text-white hover:bg-gray-700"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                fasesVendaFilter.includes(fase) ? "border-[#17c442] bg-[#17c442]" : "border-gray-600"
                              }`}
                            >
                              {fasesVendaFilter.includes(fase) && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <span>{fase}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Badges para fases selecionadas */}
        {fasesVendaFilter.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {fasesVendaFilter.map((fase) => (
              <Badge
                key={fase}
                variant="outline"
                className="bg-[#17c442]/10 text-[#17c442] border-[#17c442]/30 hover:bg-[#17c442]/20"
              >
                {fase}
                <Button
                  variant="ghost"
                  onClick={() => toggleFaseVenda(fase)}
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {fasesVendaFilter.length > 1 && (
              <Button
                variant="ghost"
                onClick={clearFasesFilter}
                className="h-6 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700"
              >
                Limpar todos
              </Button>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="rounded-md border border-gray-700 overflow-hidden" ref={tableRef}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-800 hover:bg-gray-800">
                  <TableHead className="text-gray-300">Unidade</TableHead>
                  <TableHead className="text-gray-300">Bloco</TableHead>
                  <TableHead className="text-gray-300">Pavimento</TableHead>
                  <TableHead className="text-gray-300">Tipologia</TableHead>
                  <TableHead className="text-gray-300">Área (m²)</TableHead>
                  <TableHead className="text-gray-300">Fase de Venda</TableHead>
                  <TableHead className="text-gray-300">Valor Inicial</TableHead>

                  {/* Colunas dinâmicas para cada fase */}
                  {safeFases.map((fase) => (
                    <TableHead key={fase.id} className="text-gray-300">
                      {fase.nome}
                    </TableHead>
                  ))}

                  <TableHead className="text-gray-300">Valor de Venda</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index} className="border-gray-700">
                      {Array.from({ length: 8 + safeFases.length }).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-6 w-full bg-gray-700" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredUnidades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8 + safeFases.length} className="text-center text-gray-400 py-8">
                      Nenhuma unidade encontrada com os filtros selecionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  // Renderizar unidades agrupadas por pavimento (sem o cabeçalho de bloco)
                  Object.entries(groupedUnidades).flatMap(([bloco, pavimentos]) => {
                    // Ordenar pavimentos em ordem crescente
                    const sortedPavimentos = Object.entries(pavimentos).sort((a, b) => Number(a[0]) - Number(b[0]))

                    return sortedPavimentos.map(([pavimento, unidades]) => (
                      <React.Fragment key={`${bloco}-${pavimento}`}>
                        {/* Cabeçalho do Pavimento - Estilo revisado */}
                        <TableRow className="bg-gray-800/80 hover:bg-gray-800/90 border-t border-gray-600">
                          <TableCell colSpan={8 + safeFases.length} className="py-2">
                            <div className="flex items-center gap-2 font-medium text-gray-200">
                              <Layers className="h-4 w-4 text-[#17c442]" />
                              <span>
                                Pavimento {pavimento} - Bloco {bloco}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>

                        {/* Unidades do Pavimento */}
                        {unidades.map((unidade) => (
                          <TableRow key={unidade.unidade_id} className="border-gray-700 hover:bg-gray-800/50">
                            <TableCell className="font-medium text-white">{unidade.unidade_nome}</TableCell>
                            <TableCell className="text-gray-300">{unidade.bloco || "-"}</TableCell>
                            <TableCell className="text-gray-300">{unidade.pavimento || "-"}</TableCell>
                            <TableCell className="text-gray-300">{unidade.tipologia}</TableCell>
                            <TableCell className="text-gray-300">
                              <div className="flex flex-col">
                                <span>{(unidade.area_privativa || 0).toFixed(2)} m²</span>
                                {unidade.area_garden && unidade.area_garden > 0 && (
                                  <span className="text-xs text-[#17c442]">
                                    Garden: {unidade.area_garden.toFixed(2)} m²
                                  </span>
                                )}
                              </div>
                            </TableCell>

                            {/* Destacar a fase de venda quando filtrada */}
                            <TableCell
                              className={`${
                                fasesVendaFilter.includes(unidade.fase_unidade_venda || "")
                                  ? "text-[#17c442] font-medium"
                                  : "text-gray-300"
                              }`}
                            >
                              {unidade.fase_unidade_venda || "-"}
                            </TableCell>

                            {/* Valor Inicial com valor por m² */}
                            <TableCell className="text-gray-300">
                              <div className="flex flex-col">
                                <span>{formatCurrency(unidade.valor_unidade_inicial)}</span>
                                <span className="text-xs text-[#17c442]">
                                  {formatCurrency(unidade.valor_m2_inicial || 0)}/m²
                                </span>
                              </div>
                            </TableCell>

                            {/* Valores para cada fase */}
                            {safeFases.map((fase) => {
                              const valorFase = getValorFase(unidade, fase.ordem)
                              const valorM2Fase = getValorM2Fase(unidade, fase.ordem)

                              return (
                                <TableCell key={fase.id} className="text-gray-300">
                                  {valorFase === null ? (
                                    "-"
                                  ) : (
                                    <div className="flex flex-col">
                                      <span>{formatCurrency(valorFase)}</span>
                                      <span className="text-xs text-[#17c442]">
                                        {valorM2Fase ? `${formatCurrency(valorM2Fase)}/m²` : "-"}
                                      </span>
                                    </div>
                                  )}
                                </TableCell>
                              )
                            })}

                            {/* Valor de Venda com valor por m² */}
                            <TableCell className="text-gray-300">
                              {unidade.valor_unidade_venda === null ? (
                                "-"
                              ) : (
                                <div className="flex flex-col">
                                  <span>{formatCurrency(unidade.valor_unidade_venda)}</span>
                                  <span className="text-xs text-[#17c442]">
                                    {unidade.valor_m2_venda ? `${formatCurrency(unidade.valor_m2_venda)}/m²` : "-"}
                                  </span>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          {!loading && (
            <p>
              Exibindo {filteredUnidades.length} de {safeValoresUnidades.length} unidades
              {searchTerm && ` (filtro: "${searchTerm}")`}
              {tipologiaFilter !== "todas" && ` (tipologia: "${tipologiaFilter}")`}
              {blocoFilter !== "todos" && ` (bloco: "${blocoFilter}")`}
              {terminacaoFilter !== "todas" && ` (terminação: ${terminacaoFilter})`}
              {fasesVendaFilter.length > 0 && ` (fases: ${fasesVendaFilter.join(", ")})`}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
