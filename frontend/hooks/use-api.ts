"use client"

import useSWR from 'swr'
import api from '@/lib/api'

const fetcher = (url: string) => api.get(url).then(res => res.data)

export function useApi<T = any>(url: string | null, options?: any) {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    ...options
  })

  return {
    data,
    isLoading,
    isError: error,
    mutate
  }
}

