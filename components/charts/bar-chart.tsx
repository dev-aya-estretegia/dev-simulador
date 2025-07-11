"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface BarChartProps {
  data: { name: string; value: number }[]
  height?: number
  width?: number
  xAxisKey?: string
  yAxisKey?: string
  showTooltip?: boolean
  showGrid?: boolean
  formatYAxis?: (value: number) => string
  formatValue?: (value: number) => string
  barColor?: string
}

export function BarChart({
  data = [],
  height = 400,
  width = 600,
  xAxisKey = "name",
  yAxisKey = "value",
  showTooltip = true,
  showGrid = true,
  formatYAxis = (value) => (value !== undefined && value !== null ? value.toString() : ""),
  formatValue = (value) => new Intl.NumberFormat("pt-BR").format(value),
  barColor = "#17c442",
}: BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Verificar se data é undefined ou vazio
    if (!data || data.length === 0) {
      // Limpar SVG anterior
      d3.select(svgRef.current).selectAll("*").remove()

      // Adicionar mensagem de "Sem dados"
      const svg = d3.select(svgRef.current).attr("width", width).attr("height", height)

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "#f7faf7")
        .text("Sem dados disponíveis")

      return
    }

    // Limpar SVG anterior
    d3.select(svgRef.current).selectAll("*").remove()

    // Configurar dimensões com margens otimizadas para usar todo o espaço
    const margin = { top: 20, right: 20, bottom: 40, left: 80 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Criar escalas com padding reduzido para melhor distribuição
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d[xAxisKey] || d.name))
      .range([0, innerWidth])
      .padding(0.1) // Reduzido de 0.3 para 0.1

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[yAxisKey] || d.value) || 0])
      .nice()
      .range([innerHeight, 0])

    // Criar SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Criar tooltip dinâmico
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#1c1f24")
      .style("color", "#f7faf7")
      .style("padding", "8px 12px")
      .style("border-radius", "6px")
      .style("border", "1px solid #374151")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000")
      .style("box-shadow", "0 4px 6px -1px rgba(0, 0, 0, 0.1)")

    // Adicionar eixos
    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("fill", "#f7faf7")
      .style("text-anchor", "middle")

    svg
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => formatYAxis(d as number)),
      )
      .selectAll("text")
      .attr("fill", "#f7faf7")

    // Adicionar barras com interatividade
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d[xAxisKey] || d.name) || 0)
      .attr("y", (d) => y(d[yAxisKey] || d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d[yAxisKey] || d.value))
      .attr("fill", barColor)
      .attr("rx", 4)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        // Mudar cor da barra
        d3.select(this).attr("fill", "#34ff67")

        // Mostrar tooltip usando a função de formatação fornecida
        const value = d[yAxisKey] !== undefined ? d[yAxisKey] : d.value
        const formattedValue = formatValue(value)
        const name = d[xAxisKey] || d.name

        tooltip.style("visibility", "visible").html(`<strong>${name}</strong><br/>${formattedValue}`)
      })
      .on("mousemove", (event) => {
        // Mover tooltip com o mouse
        tooltip.style("top", event.pageY - 10 + "px").style("left", event.pageX + 10 + "px")
      })
      .on("mouseout", function () {
        // Restaurar cor original
        d3.select(this).attr("fill", barColor)

        // Esconder tooltip
        tooltip.style("visibility", "hidden")
      })

    // Estilizar linhas de grade e eixos
    svg.selectAll(".domain").attr("stroke", "#374151")
    svg.selectAll("line").attr("stroke", "#374151")

    // Cleanup function para remover tooltip quando componente desmonta
    return () => {
      d3.selectAll(".d3-tooltip").remove()
    }
  }, [data, height, width, xAxisKey, yAxisKey, showTooltip, showGrid, formatYAxis, formatValue, barColor])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  )
}
