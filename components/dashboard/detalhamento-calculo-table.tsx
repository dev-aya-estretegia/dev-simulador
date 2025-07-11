"use client"

import React, { useRef, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Search, Building2, Layers, Download, Calculator, FileText, Percent, AlertCircle } from "lucide-react"
import type { DetalhamentoCalculo } from "@/hooks/use-detalhamento-calculo"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

interface DetalhamentoCalculoTableProps {
  detalhamentos: DetalhamentoCalculo[]
  loading: boolean
  error: string | null
}

export function DetalhamentoCalculoTable({
  detalhamentos = [],
  loading = false,
  error = null,
}: DetalhamentoCalculoTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [tipologiaFilter, setTipologiaFilter] = useState<string>("todas")
  const [blocoFilter, setBlocoFilter] = useState<string>("todos")
  const tableRef = useRef<HTMLDivElement>(null)

  const safeDetalhamentos = Array.isArray(detalhamentos) ? detalhamentos : []
  const tipologias = ["todas", ...new Set(safeDetalhamentos.map((d) => d.tipologia || ""))]
  const blocos = ["todos", ...new Set(safeDetalhamentos.map((d) => d.unidade_bloco).filter(Boolean) as string[])]

  const filteredDetalhamentos = safeDetalhamentos.filter((detalhamento) => {
    const matchesSearch = (detalhamento.unidade || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipologia = tipologiaFilter === "todas" || detalhamento.tipologia === tipologiaFilter
    const matchesBloco = blocoFilter === "todos" || detalhamento.unidade_bloco === blocoFilter
    return matchesSearch && matchesTipologia && matchesBloco
  })

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "-"
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatArea = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "-"
    return `${value.toFixed(2)} m²`
  }

  const formatPercent = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "-"
    if (value === 0) return "0.00%"
    return `${value.toFixed(2)}%`
  }

  const formatQuantidade = (value: number | null | undefined) => {
    if (value === null || value === undefined || value === 0) return "-"
    return value.toString()
  }

  const exportToCSV = () => {
    const headers = [
      "Empreendimento",
      "Cenário",
      "Unidade",
      "Bloco",
      "Pavimento",
      "Tipologia",
      "Área Privativa (m²)",
      "Valor Área Privativa",
      "Área Garden (m²)",
      "Valor Garden",
      "Valor Unidade Base",
      "Qtd Vagas Simples",
      "Valor Unit. Vaga Simples",
      "Valor Total Vagas Simples",
      "Qtd Vagas Duplas",
      "Valor Unit. Vaga Dupla",
      "Valor Total Vagas Duplas",
      "Qtd Vagas Moto",
      "Valor Unit. Vaga Moto",
      "Valor Total Vagas Moto",
      "Qtd Hobby Boxes",
      "Valor Unit. Hobby Box",
      "Valor Total Hobby Boxes",
      "Qtd Suítes",
      "Valor Unit. Suíte",
      "Valor Total Suítes",
      "Valor Total Adicionais",
      "Orientação Solar",
      "Percentual Orientação Solar",
      "Valor Fator Orientação Solar",
      "Percentual Pavimento",
      "Valor Fator Pavimento",
      "Vista",
      "Percentual Vista",
      "Valor Fator Vista",
      "Diferencial",
      "Percentual Diferencial",
      "Valor Fator Diferencial",
      "Percentual Bloco",
      "Valor Fator Bloco",
      "Valor Unidade Inicial",
    ]

    const csvData = filteredDetalhamentos.map((d) => [
      d.empreendimento_nome || "",
      d.cenario_nome || "",
      d.unidade || "",
      d.unidade_bloco || "-",
      d.pavimento?.toString() || "-",
      d.tipologia || "",
      (d.area_privativa || 0).toFixed(2),
      (d.valor_area_privativa_calculado || 0).toFixed(2),
      (d.area_garden || 0).toFixed(2),
      (d.valor_garden_calculado || 0).toFixed(2),
      (d.valor_unidade_base || 0).toFixed(2),
      d.qtd_vaga_simples || 0,
      (d.valor_unitario_vaga_simples || 0).toFixed(2),
      (d.valor_total_vagas_simples || 0).toFixed(2),
      d.qtd_vaga_duplas || 0,
      (d.valor_unitario_vaga_dupla || 0).toFixed(2),
      (d.valor_total_vagas_duplas || 0).toFixed(2),
      d.qtd_vaga_moto || 0,
      (d.valor_unitario_vaga_moto || 0).toFixed(2),
      (d.valor_total_vagas_moto || 0).toFixed(2),
      d.qtd_hobby_boxes || 0,
      (d.valor_unitario_hobby_boxes || 0).toFixed(2),
      (d.valor_total_hobby_boxes || 0).toFixed(2),
      d.qtd_suite || 0,
      (d.valor_unitario_suite || 0).toFixed(2),
      (d.valor_total_suites || 0).toFixed(2),
      (d.valor_unidade_adicionais || 0).toFixed(2),
      d.orientacao_solar || "-",
      (d.percentual_orientacao || 0).toFixed(2),
      (d.valor_unidade_orientacao || 0).toFixed(2),
      (d.percentual_pavimento || 0).toFixed(2),
      (d.valor_unidade_pavimento || 0).toFixed(2),
      d.vista || "-",
      (d.percentual_vista || 0).toFixed(2),
      (d.valor_unidade_vista || 0).toFixed(2),
      d.diferencial || "-",
      (d.percentual_diferencial || 0).toFixed(2),
      (d.valor_unidade_diferencial || 0).toFixed(2),
      (d.percentual_bloco || 0).toFixed(2),
      (d.valor_fator_bloco || 0).toFixed(2),
      (d.valor_unidade_inicial || 0).toFixed(2),
    ])

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")
    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `detalhamento-calculo-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a3" })
    const primaryColor = "#17c442"
    const darkColor = "#1c1f24"
    const lightColor = "#ffffff"
    const baseFontSize = 6

    const addHeader = (docPdf: jsPDF, cenarioNome?: string, empreendimentoNome?: string) => {
      docPdf.setFillColor(darkColor)
      docPdf.rect(0, 0, docPdf.internal.pageSize.width, 20, "F")
      docPdf.setTextColor(primaryColor)
      docPdf.setFont("helvetica", "bold")
      docPdf.setFontSize(16)
      docPdf.text("Simulador AYA - Detalhamento do Cálculo", 15, 10)
      docPdf.setTextColor(lightColor)
      docPdf.setFontSize(9)
      const dataAtual = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      docPdf.text(`Exportado em: ${dataAtual}`, 15, 16)
      let infoText = ""
      if (empreendimentoNome) infoText += `Empreendimento: ${empreendimentoNome}`
      if (cenarioNome) infoText += `${empreendimentoNome ? " | " : ""}Cenário: ${cenarioNome}`
      docPdf.text(infoText, docPdf.internal.pageSize.width - 15, 10, { align: "right" })
    }

    const addFooter = (docPdf: jsPDF, pageNumber: number, totalPages: number) => {
      docPdf.setFillColor(darkColor)
      docPdf.rect(0, docPdf.internal.pageSize.height - 10, docPdf.internal.pageSize.width, 10, "F")
      docPdf.setTextColor(lightColor)
      docPdf.setFontSize(8)
      docPdf.text(
        "© AYA Estratégia Imobiliária",
        docPdf.internal.pageSize.width / 2,
        docPdf.internal.pageSize.height - 4,
        { align: "center" },
      )
      docPdf.text(
        `Página ${pageNumber} de ${totalPages}`,
        docPdf.internal.pageSize.width - 15,
        docPdf.internal.pageSize.height - 4,
        { align: "right" },
      )
    }

    const cenarioNome = safeDetalhamentos.length > 0 ? safeDetalhamentos[0].cenario_nome : "N/A"
    const empreendimentoNome = safeDetalhamentos.length > 0 ? safeDetalhamentos[0].empreendimento_nome : "N/A"

    const groupedByBloco = filteredDetalhamentos.reduce(
      (acc, d) => {
        const blocoKey = d.unidade_bloco || "Sem Bloco"
        if (!acc[blocoKey]) acc[blocoKey] = []
        acc[blocoKey].push(d)
        return acc
      },
      {} as Record<string, DetalhamentoCalculo[]>,
    )

    let globalPageNumber = 0
    const totalPagesEstimate =
      Object.values(groupedByBloco).reduce((sum, unidades) => sum + Math.ceil(unidades.length / 15), 0) || 1

    Object.entries(groupedByBloco).forEach(([blocoKey, unidadesBloco]) => {
      const sortedUnidadesBloco = unidadesBloco.sort((a, b) =>
        (a.pavimento || 0) === (b.pavimento || 0)
          ? (a.unidade || "").localeCompare(b.unidade || "")
          : (a.pavimento || 0) - (b.pavimento || 0),
      )

      const itemsPerPage = 15
      for (let i = 0; i < sortedUnidadesBloco.length; i += itemsPerPage) {
        globalPageNumber++
        if (globalPageNumber > 1) doc.addPage("a3", "landscape")
        addHeader(doc, cenarioNome, empreendimentoNome)

        const pageUnidades = sortedUnidadesBloco.slice(i, i + itemsPerPage)
        const head = [
          [
            { content: "Unidade", styles: { halign: "center" } },
            { content: "Tipologia", styles: { halign: "center" } },
            { content: "Área Priv. (m²)", styles: { halign: "right" } },
            { content: "Valor Base", styles: { halign: "right", fontStyle: "bold" } },
            { content: "Vagas", styles: { halign: "center" } },
            { content: "Valor Vagas", styles: { halign: "right" } },
            { content: "Hobby B.", styles: { halign: "center" } },
            { content: "Valor Hobby B.", styles: { halign: "right" } },
            { content: "Suítes", styles: { halign: "center" } },
            { content: "Valor Suítes", styles: { halign: "right" } },
            { content: "Total Adicionais", styles: { halign: "right", fontStyle: "bold" } },
            { content: "Orientação", styles: { halign: "center" } },
            { content: "% Orient.", styles: { halign: "right" } },
            { content: "Valor Orient.", styles: { halign: "right" } },
            { content: "Pavimento", styles: { halign: "center" } },
            { content: "% Pav.", styles: { halign: "right" } },
            { content: "Valor Pav.", styles: { halign: "right" } },
            { content: "Vista", styles: { halign: "center" } },
            { content: "% Vista", styles: { halign: "right" } },
            { content: "Valor Vista", styles: { halign: "right" } },
            { content: "Valor Inicial", styles: { halign: "right", fontStyle: "bold", textColor: [23, 196, 66] } },
          ],
        ]

        const body = pageUnidades.map((d) => [
          `${d.unidade}\n${d.unidade_bloco ? "Bl." + d.unidade_bloco : ""} ${d.pavimento ? "Pav." + d.pavimento : ""}`,
          d.tipologia,
          formatArea(d.area_privativa).replace(" m²", ""),
          formatCurrency(d.valor_unidade_base).replace("R$", ""),
          `${d.qtd_vaga_simples || 0}S ${d.qtd_vaga_duplas || 0}D ${d.qtd_vaga_moto || 0}M`,
          formatCurrency(
            (d.valor_total_vagas_simples || 0) + (d.valor_total_vagas_duplas || 0) + (d.valor_total_vagas_moto || 0),
          ).replace("R$", ""),
          formatQuantidade(d.qtd_hobby_boxes),
          formatCurrency(d.valor_total_hobby_boxes).replace("R$", ""),
          formatQuantidade(d.qtd_suite),
          formatCurrency(d.valor_total_suites).replace("R$", ""),
          formatCurrency(d.valor_unidade_adicionais).replace("R$", ""),
          d.orientacao_solar || "-",
          formatPercent(d.percentual_orientacao).replace("%", ""),
          formatCurrency(d.valor_unidade_orientacao).replace("R$", ""),
          d.pavimento?.toString() || "-",
          formatPercent(d.percentual_pavimento).replace("%", ""),
          formatCurrency(d.valor_unidade_pavimento).replace("R$", ""),
          d.vista || "-",
          formatPercent(d.percentual_vista).replace("%", ""),
          formatCurrency(d.valor_unidade_vista).replace("R$", ""),
          formatCurrency(d.valor_unidade_inicial).replace("R$", ""),
        ])

        autoTable(doc, {
          head: head,
          body: body,
          startY: 22,
          theme: "grid",
          styles: { fontSize: baseFontSize, cellPadding: 0.8, overflow: "linebreak", minCellHeight: 5 },
          headStyles: {
            fillColor: darkColor,
            textColor: lightColor,
            fontStyle: "bold",
            fontSize: baseFontSize - 0.5,
            halign: "center",
          },
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 15 },
            2: { cellWidth: 15, halign: "right" },
            3: { cellWidth: 18, halign: "right" },
            4: { cellWidth: 15, halign: "center" },
            5: { cellWidth: 15, halign: "right" },
            6: { cellWidth: 12, halign: "center" },
            7: { cellWidth: 15, halign: "right" },
            8: { cellWidth: 12, halign: "center" },
            9: { cellWidth: 15, halign: "right" },
            10: { cellWidth: 18, halign: "right" },
            11: { cellWidth: 18 },
            12: { cellWidth: 10, halign: "right" },
            13: { cellWidth: 15, halign: "right" },
            14: { cellWidth: 12, halign: "center" },
            15: { cellWidth: 10, halign: "right" },
            16: { cellWidth: 15, halign: "right" },
            17: { cellWidth: 15 },
            18: { cellWidth: 10, halign: "right" },
            19: { cellWidth: 15, halign: "right" },
            20: { cellWidth: 20, halign: "right" },
          },
          margin: { top: 22, right: 5, bottom: 12, left: 5 },
          tableWidth: "auto",
        })

        addFooter(doc, globalPageNumber, totalPagesEstimate)
      }
    })

    doc.save(`detalhamento-calculo-aya-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  const groupedDetalhamentos: Record<string, Record<number, DetalhamentoCalculo[]>> = {}
  filteredDetalhamentos.forEach((detalhamento) => {
    const bloco = detalhamento.unidade_bloco || "Sem Bloco"
    const pavimento = detalhamento.pavimento || 0
    if (!groupedDetalhamentos[bloco]) groupedDetalhamentos[bloco] = {}
    if (!groupedDetalhamentos[bloco][pavimento]) groupedDetalhamentos[bloco][pavimento] = []
    groupedDetalhamentos[bloco][pavimento].push(detalhamento)
  })

  if (error && !loading) {
    return (
      <Card className="bg-destructive/10 border-destructive/30">
        <CardContent className="p-6 text-center text-destructive-foreground">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <p className="text-lg font-semibold">Erro ao carregar dados</p>
          <p className="text-sm">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-foreground flex items-center gap-2 text-xl">
            <Calculator className="h-5 w-5 text-primary" />
            Detalhamento do Cálculo por Unidade
            {safeDetalhamentos.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({safeDetalhamentos[0].empreendimento_nome} - {safeDetalhamentos[0].cenario_nome})
              </span>
            )}
          </CardTitle>
          <div className="flex gap-2 self-end md:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="border-muted hover:bg-muted/50 bg-transparent"
              disabled={loading || filteredDetalhamentos.length === 0}
            >
              <Download className="h-4 w-4 mr-2" /> CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPDF}
              className="border-muted hover:bg-muted/50 bg-transparent"
              disabled={loading || filteredDetalhamentos.length === 0}
            >
              <FileText className="h-4 w-4 mr-2" /> PDF
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar unidade..."
              className="pl-8 bg-input border-border focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={tipologiaFilter} onValueChange={setTipologiaFilter}>
            <SelectTrigger className="bg-input border-border focus:ring-primary">
              <SelectValue placeholder="Filtrar por tipologia" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground">
              {tipologias.map((t) => (
                <SelectItem key={t} value={t} className="hover:bg-muted focus:bg-muted">
                  {t === "todas" ? "Todas Tipologias" : t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={blocoFilter} onValueChange={setBlocoFilter}>
            <SelectTrigger className="bg-input border-border focus:ring-primary">
              <SelectValue placeholder="Filtrar por bloco" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground">
              {blocos.map((b) => (
                <SelectItem key={b} value={b} className="hover:bg-muted focus:bg-muted">
                  {b === "todos" ? "Todos Blocos" : b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-b-md border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-[#24292e] hover:bg-[#2a3035]">
                  <TableHead className="text-primary sticky left-0 bg-[#24292e] z-20 px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Unidade
                  </TableHead>
                  <TableHead className="text-foreground/90 px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Tipologia
                  </TableHead>
                  <TableHead className="text-foreground/90 text-right px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Área Priv.
                  </TableHead>
                  <TableHead className="text-foreground/90 text-right px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Área Garden
                  </TableHead>
                  <TableHead className="text-foreground/90 text-right bg-muted/30 px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Valor Base
                  </TableHead>
                  <TableHead className="text-foreground/90 text-center px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Vagas (S/D/M)
                  </TableHead>
                  <TableHead className="text-foreground/90 text-right px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Valor Vagas
                  </TableHead>
                  <TableHead className="text-foreground/90 text-center px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Hobby Box
                  </TableHead>
                  <TableHead className="text-foreground/90 text-right px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Valor Hobby Box
                  </TableHead>
                  <TableHead className="text-foreground/90 text-center px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Suítes
                  </TableHead>
                  <TableHead className="text-foreground/90 text-right px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Valor Suítes
                  </TableHead>
                  <TableHead className="text-foreground/90 text-right bg-muted/30 px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Total Adicionais
                  </TableHead>
                  <TableHead className="text-foreground/90 px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Orient. Solar
                  </TableHead>
                  <TableHead className="text-secondary text-right px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    <Percent size={10} className="inline-block mr-0.5" />
                    Orient.
                  </TableHead>
                  <TableHead className="text-foreground/70 text-right px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Valor Orient.
                  </TableHead>
                  <TableHead className="text-foreground/90 text-center px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Pavim.
                  </TableHead>
                  <TableHead className="text-secondary text-right px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    <Percent size={10} className="inline-block mr-0.5" />
                    Pavim.
                  </TableHead>
                  <TableHead className="text-foreground/70 text-right px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Valor Pavim.
                  </TableHead>
                  <TableHead className="text-foreground/90 px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Vista
                  </TableHead>
                  <TableHead className="text-secondary text-right px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    <Percent size={10} className="inline-block mr-0.5" />
                    Vista
                  </TableHead>
                  <TableHead className="text-foreground/70 text-right px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Valor Vista
                  </TableHead>
                  <TableHead className="text-foreground/90 px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Diferencial
                  </TableHead>
                  <TableHead className="text-secondary text-right px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    <Percent size={10} className="inline-block mr-0.5" />
                    Difer.
                  </TableHead>
                  <TableHead className="text-foreground/70 text-right px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Valor Difer.
                  </TableHead>
                  <TableHead className="text-foreground/90 px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Bloco (Fator)
                  </TableHead>
                  <TableHead className="text-secondary text-right px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    <Percent size={10} className="inline-block mr-0.5" />
                    Bloco
                  </TableHead>
                  <TableHead className="text-foreground/70 text-right px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Valor Bloco
                  </TableHead>
                  <TableHead className="text-white sticky right-0 bg-green-600 z-20 px-3 py-2.5 text-xs font-semibold whitespace-nowrap">
                    Valor Inicial
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={`skeleton-row-${i}`} className="border-b border-border/30">
                      {Array.from({ length: 28 }).map((_, c) => (
                        <TableCell key={`skeleton-cell-${i}-${c}`} className="px-3 py-2">
                          <Skeleton className="h-5 w-full bg-muted/50" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredDetalhamentos.length === 0 ? (
                  <TableRow className="border-b border-border/30">
                    <TableCell colSpan={28} className="text-center text-muted-foreground py-8">
                      Nenhum detalhamento encontrado para os filtros selecionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  Object.entries(groupedDetalhamentos).map(([bloco, pavimentos]) => (
                    <React.Fragment key={bloco}>
                      <TableRow className="bg-primary/5 hover:bg-primary/10 border-y-2 border-primary/20">
                        <TableCell colSpan={28} className="py-2 px-3 sticky left-0 bg-primary/5 z-10">
                          <div className="flex items-center gap-2 font-semibold text-xs text-primary">
                            <Building2 className="h-3.5 w-3.5" />
                            Bloco: {bloco}
                          </div>
                        </TableCell>
                      </TableRow>
                      {Object.entries(pavimentos)
                        .sort((a, b) => Number(a[0]) - Number(b[0]))
                        .map(([pavNum, unidades]) => (
                          <React.Fragment key={`${bloco}-${pavNum}`}>
                            <TableRow className="bg-muted/10 hover:bg-muted/20 border-b border-border/30">
                              <TableCell colSpan={28} className="py-1.5 px-3 sticky left-0 bg-muted/10 z-10">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground ml-4">
                                  <Layers className="h-3.5 w-3.5" />
                                  Pavimento: {pavNum === "0" ? "Térreo/Outros" : pavNum}
                                </div>
                              </TableCell>
                            </TableRow>
                            {unidades.map((d, idx) => (
                              <TableRow
                                key={`${d.unidade}-${idx}`}
                                className="border-b border-border/30 hover:bg-muted/20 group"
                              >
                                <TableCell className="text-primary font-medium whitespace-nowrap sticky left-0 bg-card group-hover:bg-muted/20 z-10 px-3 py-2 text-xs">
                                  {d.unidade}
                                </TableCell>
                                <TableCell className="text-foreground/80 whitespace-nowrap px-3 py-2 text-xs">
                                  {d.tipologia}
                                </TableCell>
                                <TableCell className="text-foreground/80 whitespace-nowrap text-right px-3 py-2 text-xs">
                                  {formatArea(d.area_privativa)}
                                </TableCell>
                                <TableCell className="text-foreground/80 whitespace-nowrap text-right px-3 py-2 text-xs">
                                  {formatArea(d.area_garden)}
                                </TableCell>
                                <TableCell className="text-foreground/90 bg-muted/10 group-hover:bg-muted/20 font-medium whitespace-nowrap text-right px-3 py-2 text-xs">
                                  {formatCurrency(d.valor_unidade_base)}
                                </TableCell>
                                <TableCell className="text-foreground/80 whitespace-nowrap text-center px-3 py-2 text-xs">{`${d.qtd_vaga_simples || 0}S / ${d.qtd_vaga_duplas || 0}D / ${d.qtd_vaga_moto || 0}M`}</TableCell>
                                <TableCell className="text-foreground/80 whitespace-nowrap text-right px-3 py-2 text-xs">
                                  {formatCurrency(
                                    (d.valor_total_vagas_simples || 0) +
                                      (d.valor_total_vagas_duplas || 0) +
                                      (d.valor_total_vagas_moto || 0),
                                  )}
                                </TableCell>
                                <TableCell className="text-foreground/80 whitespace-nowrap text-center px-3 py-2 text-xs">
                                  {formatQuantidade(d.qtd_hobby_boxes)}
                                </TableCell>
                                <TableCell className="text-foreground/80 whitespace-nowrap text-right px-3 py-2 text-xs">
                                  {formatCurrency(d.valor_total_hobby_boxes)}
                                </TableCell>
                                <TableCell className="text-foreground/80 whitespace-nowrap text-center px-3 py-2 text-xs">
                                  {formatQuantidade(d.qtd_suite)}
                                </TableCell>
                                <TableCell className="text-foreground/80 whitespace-nowrap text-right px-3 py-2 text-xs">
                                  {formatCurrency(d.valor_total_suites)}
                                </TableCell>
                                <TableCell className="text-foreground/90 bg-muted/10 group-hover:bg-muted/20 font-medium whitespace-nowrap text-right px-3 py-2 text-xs">
                                  {formatCurrency(d.valor_unidade_adicionais)}
                                </TableCell>
                                <TableCell className="text-foreground/80 whitespace-nowrap px-3 py-2 text-xs">
                                  {d.orientacao_solar || "-"}
                                </TableCell>
                                <TableCell className="text-secondary whitespace-nowrap text-right px-3 py-2 text-xs">
                                  {formatPercent(d.percentual_orientacao)}
                                </TableCell>
                                <TableCell className="text-foreground/70 whitespace-nowrap text-right px-3 py-2 text-xs">
                                  {formatCurrency(d.valor_unidade_orientacao)}
                                </TableCell>
                                <TableCell className="text-foreground/80 whitespace-nowrap text-center px-3 py-2 text-xs">
                                  {d.pavimento?.toString() || "-"}
                                </TableCell>
                                <TableCell className="text-secondary whitespace-nowrap text-right px-3 py-2 text-xs">
                                  {formatPercent(d.percentual_pavimento)}
                                </TableCell>
                                <TableCell className="text-foreground/70 whitespace-nowrap text-right px-3 py-2 text-xs">
                                  {formatCurrency(d.valor_unidade_pavimento)}
                                </TableCell>
                                <TableCell className="text-foreground/80 whitespace-nowrap px-3 py-2 text-xs">
                                  {d.vista || "-"}
                                </TableCell>
                                <TableCell className="text-secondary whitespace-nowrap text-right px-3 py-2 text-xs">
                                  {formatPercent(d.percentual_vista)}
                                </TableCell>
                                <TableCell className="text-foreground/70 whitespace-nowrap text-right px-3 py-2 text-xs">
                                  {formatCurrency(d.valor_unidade_vista)}
                                </TableCell>
                                <TableCell className="text-foreground/80 whitespace-nowrap px-3 py-2 text-xs">
                                  {d.diferencial || "-"}
                                </TableCell>
                                <TableCell className="text-secondary whitespace-nowrap text-right px-3 py-2 text-xs">
                                  {formatPercent(d.percentual_diferencial)}
                                </TableCell>
                                <TableCell className="text-foreground/70 whitespace-nowrap text-right px-3 py-2 text-xs">
                                  {formatCurrency(d.valor_unidade_diferencial)}
                                </TableCell>
                                <TableCell className="text-foreground/80 whitespace-nowrap px-3 py-2 text-xs">
                                  {d.unidade_bloco || "-"}
                                </TableCell>
                                <TableCell className="text-secondary whitespace-nowrap text-right px-3 py-2 text-xs">
                                  {formatPercent(d.percentual_bloco)}
                                </TableCell>
                                <TableCell className="text-foreground/70 whitespace-nowrap text-right px-3 py-2 text-xs">
                                  {formatCurrency(d.valor_fator_bloco)}
                                </TableCell>
                                <TableCell className="text-white font-semibold whitespace-nowrap sticky right-0 bg-green-600 group-hover:bg-green-700 z-10 px-3 py-2 text-xs">
                                  {formatCurrency(d.valor_unidade_inicial)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </React.Fragment>
                        ))}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="mt-4 px-4 pb-4 text-xs text-muted-foreground">
          {!loading && (
            <p>
              Exibindo {filteredDetalhamentos.length} de {safeDetalhamentos.length}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
