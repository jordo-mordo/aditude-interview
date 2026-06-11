// POST helper that surfaces the server's `error` message on a non-2xx response,
// so forms can show a clear, specific message (e.g. the 409 "already exists" cases).
export async function postJson<T = unknown>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(data?.error ?? `Request failed (${res.status})`)
  }
  return data as T
}
