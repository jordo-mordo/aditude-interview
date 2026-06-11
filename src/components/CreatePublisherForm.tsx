"use client"

import { useState } from "react"
import { postJson } from "@/lib/api"
import { ErrorMessage } from "@/components/ui/ErrorMessage"

// Inline form to create a publisher in an org. Calls onCreated() so the page can refetch.
export function CreatePublisherForm({
  orgId,
  onCreated,
  onCancel,
}: {
  orgId: string
  onCreated: () => void
  onCancel: () => void
}) {
  const [name, setName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await postJson(`/api/organizations/${orgId}/publishers`, { name })
      setName("")
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create publisher")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4">
      <div>
        <label htmlFor="publisher-name" className="block text-sm font-medium text-slate-700">
          Publisher name
        </label>
        <input
          id="publisher-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create publisher"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
