"use client"

import { useState } from "react"
import Link from "next/link"
import { useFetch } from "@/lib/useFetch"
import { OrganizationDetail } from "@/lib/types"
import { canManageUsers } from "@/lib/roles"
import { initials, avatarGradient } from "@/lib/format"
import { LoadingState } from "@/components/ui/Spinner"
import { Collapsible } from "@/components/ui/Collapsible"
import { PublisherIcon } from "@/components/ui/PublisherIcon"
import { TAG_LABELS } from "@/lib/tags"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { Badge, roleTone } from "@/components/ui/Badge"
import { CreatePublisherForm } from "@/components/CreatePublisherForm"
import { AddUserForm } from "@/components/AddUserForm"

export default function OrganizationDetailPage({ params }: { params: { id: string } }) {
  const { data: org, loading, error, status, refetch } = useFetch<OrganizationDetail>(
    `/api/organizations/${params.id}`
  )
  const [showPublisherForm, setShowPublisherForm] = useState(false)
  const [showUserForm, setShowUserForm] = useState(false)

  return (
    <div className="space-y-8">
      <Link href="/" className="btn-ghost -ml-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        Back to organizations
      </Link>

      {loading && <LoadingState label="Loading organization" />}

      {error && !loading && (
        status === 404 ? (
          <div className="card flex flex-col items-center gap-2 py-16 text-center">
            <p className="font-medium text-slate-700">Organization not found</p>
            <Link href="/" className="text-sm font-medium text-indigo-600 hover:underline">
              Return to dashboard
            </Link>
          </div>
        ) : (
          <ErrorMessage message={error} onRetry={refetch} />
        )
      )}

      {org && !loading && (
        <>
          {/* Header / metadata */}
          <header className="card flex animate-fade-in-up items-center gap-4 p-6">
            <span className={`avatar h-14 w-14 text-lg ${avatarGradient(org.id)}`}>{initials(org.name)}</span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{org.name}</h1>
              <p className="mt-1 text-sm text-slate-500">
                {org.publishers.length} publisher{org.publishers.length === 1 ? "" : "s"} ·{" "}
                {org.members.length} member{org.members.length === 1 ? "" : "s"} · Created{" "}
                {new Date(org.createdAt).toLocaleDateString()}
              </p>
            </div>
          </header>

          {/* Publishers */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Publishers <span className="text-slate-400">({org.publishers.length})</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowPublisherForm((v) => !v)}
                aria-expanded={showPublisherForm}
                className={showPublisherForm ? "btn-secondary" : "btn-primary"}
              >
                {showPublisherForm ? "Close" : "New publisher"}
              </button>
            </div>

            <Collapsible open={showPublisherForm}>
              <CreatePublisherForm
                orgId={org.id}
                onCreated={() => {
                  setShowPublisherForm(false)
                  refetch()
                }}
                onCancel={() => setShowPublisherForm(false)}
              />
            </Collapsible>

            {org.publishers.length === 0 ? (
              <p className="text-sm text-slate-500">No publishers yet.</p>
            ) : (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {org.publishers.map((pub, i) => (
                  <li
                    key={pub.id}
                    className="card flex animate-fade-in-up items-center gap-3 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <PublisherIcon tag={pub.tag} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{pub.name}</p>
                      <p className="text-xs text-slate-400">{TAG_LABELS[pub.tag]}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Members */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Members <span className="text-slate-400">({org.members.length})</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowUserForm((v) => !v)}
                aria-expanded={showUserForm}
                className={showUserForm ? "btn-secondary" : "btn-primary"}
              >
                {showUserForm ? "Close" : "Add user"}
              </button>
            </div>

            <Collapsible open={showUserForm}>
              <AddUserForm
                orgId={org.id}
                publishers={org.publishers}
                onCreated={() => {
                  setShowUserForm(false)
                  refetch()
                }}
                onCancel={() => setShowUserForm(false)}
              />
            </Collapsible>

            {org.members.length === 0 ? (
              <p className="text-sm text-slate-500">No members yet.</p>
            ) : (
              <ul className="space-y-3">
                {org.members.map((member, i) => (
                  <li
                    key={member.membershipId}
                    className="card animate-fade-in-up p-5 transition duration-200 hover:shadow-md"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`avatar h-10 w-10 text-sm ${avatarGradient(member.user.id)}`}>
                        {initials(member.user.name)}
                      </span>
                      <div className="mr-auto">
                        <p className="font-semibold text-slate-900">{member.user.name}</p>
                        <p className="text-sm text-slate-500">{member.user.email}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge tone={roleTone(member.user.systemRole)}>System: {member.user.systemRole}</Badge>
                        <Badge tone={roleTone(member.role)}>Org: {member.role}</Badge>
                        {canManageUsers(member.role) && <Badge tone="amber">Can manage users</Badge>}
                      </div>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Publisher access
                      </p>
                      {member.publisherAccess.length === 0 ? (
                        <p className="mt-1.5 text-sm text-slate-500">No publisher access in this organization.</p>
                      ) : (
                        <ul className="mt-2 space-y-2">
                          {member.publisherAccess.map((access) => (
                            <li key={access.publisherId} className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-medium text-slate-700">{access.publisherName}</span>
                              <span className="text-slate-300">·</span>
                              {access.permissions.map((perm) => (
                                <Badge key={perm} tone={roleTone(perm)}>
                                  {perm}
                                </Badge>
                              ))}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}
