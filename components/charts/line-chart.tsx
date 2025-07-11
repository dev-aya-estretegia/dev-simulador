"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface LineChartProps {
  data: { name: string; value: number }[]
  height?: number
  width?: number
  xAxisKey?: string
  yAxisKey?: string
  showTooltip?: boolean
  showGrid?: boolean
  lineColor?: string
}

export function LineChart({
  data = [], // Valor padrão para evitar undefined
  height = 400,
  width = 600,
  xAxisKey = "name",
  yAxisKey = "value",
  showTooltip = true,
  showGrid = true,
  lineColor = "#4f46e5",
}: LineChartProps) {
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

    // Configurar dimensões
    const margin = { top: 20, right: 30, bottom: 40, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Criar escalas
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d[xAxisKey] || d.name))
      .range([0, innerWidth])
      .padding(0.3)

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

    // Adicionar eixos
    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("fill", "#f7faf7")
      .style("text-anchor", "middle")

    svg.append("g").call(d3.axisLeft(y).ticks(5)).selectAll("text").attr("fill", "#f7faf7")

    // Adicionar linhas de grade
    if (showGrid) {
      svg
        .append("g")
        .attr("class", "grid")
        .call(
          d3
            .axisLeft(y)
            .ticks(5)
            .tickSize(-innerWidth)
            .tickFormat(() => ""),
        )
        .selectAll("line")
        .attr("stroke", "#2a2a2a")
        .attr("stroke-opacity", 0.3)

      svg.selectAll(".grid .domain").attr("stroke", "none")
    }

    // Criar gerador de linha
    const line = d3
      .line<any>()
      .x((d) => (x(d[xAxisKey] || d.name) || 0) + x.bandwidth() / 2)
      .y((d) => y(d[yAxisKey] || d.value))
      .curve(d3.curveMonotoneX)

    // Adicionar linha
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 2)
      .attr("d", line)

    // Adicionar pontos
    const dots = svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => (x(d[xAxisKey] || d.name) || 0) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d[yAxisKey] || d.value))
      .attr("r", 4)
      .attr("fill", "#fff")
      .attr("stroke", lineColor)
      .attr("stroke-width", 2)

    // Adicionar tooltip
    if (showTooltip) {
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("padding", "8px")
        .style("background", "#333")
        .style("color", "#fff")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("z-index", 100)

      dots
        .on("mouseover", function (event, d) {
          d3.select(this).attr("r", 6)
          tooltip.transition().duration(200).style("opacity", 0.9)
          tooltip
            .html(`${d[xAxisKey] || d.name}: ${d[yAxisKey] || d.value}`)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px")
        })
        .on("mouseout", function () {
          d3.select(this).attr("r", 4)
          tooltip.transition().duration(500).style("opacity", 0)
        })

      return () => {
        tooltip.remove()
      }
    }
  }, [data, height, width, xAxisKey, yAxisKey, showTooltip, showGrid, lineColor])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  )
}
