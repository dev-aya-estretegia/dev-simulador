import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ReactQueryProvider } from "@/components/providers/query-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Simulador AYA",
  description: "Plataforma de modelagem financeira e análise estratégica para empreendimentos imobiliários",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-black text-white min-h-screen flex flex-col`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  )
}
