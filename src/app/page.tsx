"use client"

import Link from "next/link"
import { useFetch } from "@/lib/useFetch"
import { OrganizationSummary } from "@/lib/types"
import { initials, avatarGradient } from "@/lib/format"
import { LoadingState } from "@/components/ui/Spinner"
import { ErrorMessage } from "@/components/ui/ErrorMessage"

export default function HomePage() {
  const { data: organizations, loading, error, refetch } = useFetch<OrganizationSummary[]>("/api/organizations")

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Organizations</h1>
        <p className="text-slate-500">Select an organization to manage its publishers and users.</p>
      </header>

      {loading && <LoadingState label="Loading organizations" />}

      {error && !loading && <ErrorMessage message={error} onRetry={refetch} />}

      {organizations && !loading && (
        organizations.length === 0 ? (
          <div className="card flex flex-col items-center gap-1 py-16 text-center">
            <p className="font-medium text-slate-700">No organizations yet</p>
            <p className="text-sm text-slate-500">Once organizations are created they will appear here.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org, i) => (
              <li key={org.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <Link
                  href={`/organizations/${org.id}`}
                  className="card group flex h-full flex-col gap-5 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                >
                  <div className="flex items-start justify-between">
                    <span className={`avatar h-11 w-11 text-sm ${avatarGradient(org.id)} transition duration-200 group-hover:scale-105`}>
                      {initials(org.name)}
                    </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">{org.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {org._count.publishers} publisher{org._count.publishers === 1 ? "" : "s"} ·{" "}
                      {org._count.memberships} member{org._count.memberships === 1 ? "" : "s"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  )
}
