"use client"

import { createClient } from "@supabase/supabase-js"
import { useState } from "react"

// Cria um cliente Supabase para o lado do cliente
const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Variáveis de ambiente do Supabase não configuradas")
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Singleton para evitar múltiplas instâncias
let browserClient: ReturnType<typeof createBrowserClient> | null = null

export function useSupabase() {
  const [supabase] = useState(() => {
    if (!browserClient) {
      browserClient = createBrowserClient()
    }
    return browserClient
  })

  return { supabase }
}
