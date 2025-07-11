"use client"

import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { useSupabase } from "./use-supabase"
import type { SupabaseClient } from "@supabase/supabase-js"

type SupabaseQueryFn<T> = (supabase: SupabaseClient) => Promise<T>

interface UseSupabaseQueryOptions<T> extends Omit<UseQueryOptions<T>, "queryFn"> {
  queryFn: SupabaseQueryFn<T>
}

export function useSupabaseQuery<T>(options: UseSupabaseQueryOptions<T>) {
  const { supabase } = useSupabase()

  return useQuery({
    ...options,
    queryFn: () => options.queryFn(supabase),
  })
}
