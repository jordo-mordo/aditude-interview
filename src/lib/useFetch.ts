"use client"

import { useCallback, useEffect, useState } from "react"

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
  /** HTTP status of the last response, useful for distinguishing 404 from other errors */
  status: number | null
  refetch: () => void
}

// Small client-side GET hook giving consistent loading / error / refetch behavior.
// Used by both the dashboard and the org detail page.
export function useFetch<T>(url: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url)
      setStatus(res.status)
      const body = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(body?.error ?? `Request failed (${res.status})`)
      }
      setData(body as T)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, status, refetch: load }
}
