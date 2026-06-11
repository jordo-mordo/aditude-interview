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
    <form onSubmit={handleSubmit} className="card space-y-4 p-5">
      <div>
        <label htmlFor="publisher-name" className="label">
          Publisher name
        </label>
        <input
          id="publisher-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          className="input"
        />
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Creating…" : "Create publisher"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  )
}
