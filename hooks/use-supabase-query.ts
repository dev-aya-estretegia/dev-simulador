"use client"

import { useQuery, type UseQueryOptions, type QueryKey } from "@tanstack/react-query"

/**
 * A custom hook to wrap @tanstack/react-query's useQuery for Supabase calls.
 * @param queryKey The key for the query.
 * @param queryFn A function that returns a promise resolving to the data. It should throw on error.
 * @param options React Query options.
 */
export function useSupabaseQuery<TQueryFnData = unknown, TError = Error, TData = TQueryFnData>(
  queryKey: QueryKey,
  queryFn: () => Promise<TQueryFnData>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, "queryKey" | "queryFn">,
) {
  return useQuery<TQueryFnData, TError, TData>({
    queryKey,
    queryFn,
    ...options,
  })
}
