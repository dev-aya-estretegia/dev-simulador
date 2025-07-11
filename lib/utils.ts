import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata um valor numérico para moeda brasileira (BRL)
 * @param value - Valor a ser formatado
 * @param options - Opções de formatação
 * @returns String formatada como moeda brasileira
 */
export function formatCurrency(
  value: number | null | undefined,
  options?: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  },
) {
  if (value === null || value === undefined) return "R$ 0,00"

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(value)
}

/**
 * Alias para formatCurrency - mantém compatibilidade com código existente
 * @param valor - Valor a ser formatado
 * @param options - Opções de formatação
 * @returns String formatada como moeda brasileira
 */
export function formatarMoeda(
  valor: number | null | undefined,
  options?: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  },
) {
  return formatCurrency(valor, options)
}

/**
 * Formata um valor numérico como percentual
 * @param value - Valor a ser formatado
 * @param decimals - Número de casas decimais
 * @returns String formatada como percentual
 */
export function formatPercentage(value: number | null | undefined, decimals = 1) {
  if (value === null || value === undefined) return "0,0%"
  return `${value.toFixed(decimals).replace(".", ",")}%`
}

/**
 * Alias para formatPercentage - mantém compatibilidade com código existente
 * @param valor - Valor a ser formatado
 * @param decimals - Número de casas decimais
 * @returns String formatada como percentual
 */
export function formatarPercentual(valor: number | null | undefined, decimals = 1) {
  return formatPercentage(valor, decimals)
}

/**
 * Formata um valor numérico com separadores de milhar e casas decimais
 * @param value - Valor a ser formatado
 * @param options - Opções de formatação
 * @returns String formatada com separadores de milhar e casas decimais
 */
export function formatNumber(
  value: number | null | undefined,
  options?: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  },
) {
  if (value === null || value === undefined) return "0"

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(value)
}
