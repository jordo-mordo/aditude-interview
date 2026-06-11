"use client"

import Link from "next/link"
import { useFetch } from "@/lib/useFetch"
import { OrganizationSummary } from "@/lib/types"
import { LoadingState } from "@/components/ui/Spinner"
import { ErrorMessage } from "@/components/ui/ErrorMessage"

export default function HomePage() {
  const { data: organizations, loading, error, refetch } = useFetch<OrganizationSummary[]>("/api/organizations")

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Organizations</h1>
        <p className="text-sm text-slate-500">Select an organization to manage its publishers and users.</p>
      </header>

      {loading && <LoadingState label="Loading organizations" />}

      {error && !loading && <ErrorMessage message={error} onRetry={refetch} />}

      {organizations && !loading && (
        organizations.length === 0 ? (
          <p className="text-sm text-slate-500">No organizations yet.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
              <li key={org.id}>
                <Link
                  href={`/organizations/${org.id}`}
                  className="block rounded-lg border border-slate-200 p-4 transition hover:border-slate-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <h2 className="font-semibold text-slate-900">{org.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {org._count.publishers} publisher{org._count.publishers === 1 ? "" : "s"} ·{" "}
                    {org._count.memberships} member{org._count.memberships === 1 ? "" : "s"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  )
}
