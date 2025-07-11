"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"

/**
 * Componente provedor para o React Query.
 * Ele garante que uma única instância do QueryClient seja criada e
 * disponibilizada para todos os componentes filhos na árvore de componentes.
 *
 * @param {object} props - As propriedades do componente.
 * @param {ReactNode} props.children - Os componentes filhos que terão acesso ao QueryClient.
 * @returns {JSX.Element} O provedor do QueryClient envolvendo os filhos.
 */
export function ReactQueryProvider({ children }: { children: ReactNode }) {
  // Usamos useState para garantir que o QueryClient seja criado apenas uma vez,
  // na primeira renderização do componente no lado do cliente.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Evita que o React Query refaça a busca de dados automaticamente
            // quando a janela do navegador ganha foco.
            refetchOnWindowFocus: false,
            // Define um tempo de 5 minutos antes de considerar os dados como "stale" (obsoletos).
            staleTime: 1000 * 60 * 5,
          },
        },
      }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
