"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface PieChartProps {
  data: { name: string; value: number; color?: string }[]
  height?: number
  width?: number
  dataKey?: string
  nameKey?: string
  colors?: string[]
  showLegend?: boolean
  showTooltip?: boolean
  showLabels?: boolean
}

export function PieChart({
  data = [], // Valor padrão para evitar undefined
  height = 400,
  width = 600,
  dataKey = "value",
  nameKey = "name",
  colors = ["#17c442", "#34ff67", "#5fff87", "#8bffa8", "#c3ffd2", "#eefff2"],
  showLegend = true,
  showTooltip = true,
  showLabels = true,
}: PieChartProps) {
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
    const margin = { top: 20, right: 30, bottom: 40, left: 30 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom
    const radius = Math.min(innerWidth, innerHeight) / 2

    // Criar SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)

    // Criar escala de cores
    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d[nameKey] || d.name))
      .range(data.map((d, i) => d.color || colors[i % colors.length]))

    // Criar gerador de pie
    const pie = d3
      .pie<any>()
      .value((d) => d[dataKey] || d.value)
      .sort(null)

    // Criar arcos
    const arc = d3.arc<any>().innerRadius(0).outerRadius(radius)

    const arcLabel = d3
      .arc<any>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.6)

    // Criar tooltip
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

    // Adicionar arcos
    const arcs = svg
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data[nameKey] || d.data.name))
      .attr("stroke", "#1a1a1a")
      .attr("stroke-width", 1)
      .style("transition", "opacity 0.3s")

    // Adicionar eventos de hover
    if (showTooltip) {
      arcs
        .on("mouseover", function (event, d) {
          d3.select(this).attr("opacity", 0.8)
          tooltip.transition().duration(200).style("opacity", 0.9)

          const percent = (
            ((d.data[dataKey] || d.data.value) * 100) /
            d3.sum(data, (d) => d[dataKey] || d.value)
          ).toFixed(1)
          tooltip
            .html(
              `${d.data[nameKey] || d.data.name}: ${new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(d.data[dataKey] || d.data.value)} (${percent}%)`,
            )
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px")
        })
        .on("mouseout", function () {
          d3.select(this).attr("opacity", 1)
          tooltip.transition().duration(500).style("opacity", 0)
        })
    }

    // Adicionar labels
    if (showLabels) {
      svg
        .selectAll("text")
        .data(pie(data))
        .enter()
        .append("text")
        .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("fill", "#f7faf7")
        .style("font-size", "12px")
        .text((d) => {
          const percent = (
            ((d.data[dataKey] || d.data.value) * 100) /
            d3.sum(data, (d) => d[dataKey] || d.value)
          ).toFixed(0)
          return percent > 5 ? `${percent}%` : ""
        })
    }

    // Adicionar legenda
    if (showLegend) {
      const legend = svg
        .selectAll(".legend")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(${radius + 20}, ${-radius + i * 20})`)

      legend
        .append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", (d, i) => d.color || colors[i % colors.length])

      legend
        .append("text")
        .attr("x", 20)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .attr("fill", "#f7faf7")
        .style("font-size", "12px")
        .text((d) => d[nameKey] || d.name)
    }

    return () => {
      tooltip.remove()
    }
  }, [data, height, width, dataKey, nameKey, colors, showLegend, showTooltip, showLabels])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  )
}
