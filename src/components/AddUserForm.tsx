"use client"

import { useState } from "react"
import { postJson } from "@/lib/api"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { SYSTEM_ROLES, ORG_ROLES, PUBLISHER_PERMISSIONS, PublisherPermission } from "@/lib/roles"
import { PublisherDTO } from "@/lib/types"

// Inline form to create a user, add them to the org, and grant publisher permissions.
// `publishers` is the current org's publishers — the only ones a user can be granted access to.
export function AddUserForm({
  orgId,
  publishers,
  onCreated,
  onCancel,
}: {
  orgId: string
  publishers: PublisherDTO[]
  onCreated: () => void
  onCancel: () => void
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [systemRole, setSystemRole] = useState<string>("USER")
  const [orgRole, setOrgRole] = useState<string>("MEMBER")
  // publisherId -> set of selected permissions
  const [access, setAccess] = useState<Record<string, Set<PublisherPermission>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function togglePublisher(publisherId: string, checked: boolean) {
    setAccess((prev) => {
      const next = { ...prev }
      if (checked) {
        next[publisherId] = new Set<PublisherPermission>(["VIEW"]) // default to VIEW when first granted
      } else {
        delete next[publisherId]
      }
      return next
    })
  }

  function togglePermission(publisherId: string, permission: PublisherPermission, checked: boolean) {
    setAccess((prev) => {
      const current = new Set(prev[publisherId] ?? [])
      if (checked) current.add(permission)
      else current.delete(permission)
      return { ...prev, [publisherId]: current }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const publisherAccess = Object.entries(access)
      .filter(([, perms]) => perms.size > 0)
      .map(([publisherId, perms]) => ({ publisherId, permissions: Array.from(perms) }))

    try {
      await postJson(`/api/organizations/${orgId}/users`, {
        name,
        email,
        password: password || undefined,
        systemRole,
        orgRole,
        publisherAccess,
      })
      onCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add user")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-md border border-slate-200 bg-slate-50 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="user-name" className="block text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            id="user-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label htmlFor="user-email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="user-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div>
          <label htmlFor="user-password" className="block text-sm font-medium text-slate-700">
            Password <span className="text-slate-400">(optional)</span>
          </label>
          <input
            id="user-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            placeholder="Min 8 characters"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="user-system-role" className="block text-sm font-medium text-slate-700">
              System role
            </label>
            <select
              id="user-system-role"
              value={systemRole}
              onChange={(e) => setSystemRole(e.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            >
              {SYSTEM_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="user-org-role" className="block text-sm font-medium text-slate-700">
              Org role
            </label>
            <select
              id="user-org-role"
              value={orgRole}
              onChange={(e) => setOrgRole(e.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            >
              {ORG_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <fieldset className="rounded border border-slate-200 bg-white p-3">
        <legend className="px-1 text-sm font-medium text-slate-700">Publisher access</legend>
        {publishers.length === 0 ? (
          <p className="text-sm text-slate-500">This organization has no publishers yet.</p>
        ) : (
          <ul className="space-y-2">
            {publishers.map((pub) => {
              const selected = access[pub.id]
              const isChecked = selected !== undefined
              return (
                <li key={pub.id} className="rounded border border-slate-100 p-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => togglePublisher(pub.id, e.target.checked)}
                    />
                    {pub.name}
                  </label>
                  {isChecked && (
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 pl-6">
                      {PUBLISHER_PERMISSIONS.map((perm) => (
                        <label key={perm} className="flex items-center gap-1.5 text-sm text-slate-600">
                          <input
                            type="checkbox"
                            checked={selected.has(perm)}
                            onChange={(e) => togglePermission(pub.id, perm, e.target.checked)}
                          />
                          {perm}
                        </label>
                      ))}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </fieldset>

      {error && <ErrorMessage message={error} />}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? "Adding…" : "Add user"}
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
