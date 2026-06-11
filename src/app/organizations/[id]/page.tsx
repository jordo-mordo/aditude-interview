"use client"

import { useState } from "react"
import Link from "next/link"
import { useFetch } from "@/lib/useFetch"
import { OrganizationDetail } from "@/lib/types"
import { LoadingState } from "@/components/ui/Spinner"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { Badge, roleTone } from "@/components/ui/Badge"
import { canManageUsers } from "@/lib/roles"
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
      <Link href="/" className="inline-block text-sm text-slate-500 hover:text-slate-700">
        ← Back to organizations
      </Link>

      {loading && <LoadingState label="Loading organization" />}

      {error && !loading && (
        status === 404 ? (
          <div className="space-y-2">
            <p className="text-slate-700">Organization not found.</p>
            <Link href="/" className="text-sm text-blue-600 hover:underline">
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
          <header className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">{org.name}</h1>
            <p className="text-sm text-slate-500">
              {org.publishers.length} publisher{org.publishers.length === 1 ? "" : "s"} ·{" "}
              {org.members.length} member{org.members.length === 1 ? "" : "s"} · Created{" "}
              {new Date(org.createdAt).toLocaleDateString()}
            </p>
          </header>

          {/* Publishers */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Publishers</h2>
              <button
                type="button"
                onClick={() => setShowPublisherForm((v) => !v)}
                aria-expanded={showPublisherForm}
                className="rounded border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {showPublisherForm ? "Close" : "New publisher"}
              </button>
            </div>

            {showPublisherForm && (
              <CreatePublisherForm
                orgId={org.id}
                onCreated={() => {
                  setShowPublisherForm(false)
                  refetch()
                }}
                onCancel={() => setShowPublisherForm(false)}
              />
            )}

            {org.publishers.length === 0 ? (
              <p className="text-sm text-slate-500">No publishers yet.</p>
            ) : (
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {org.publishers.map((pub) => (
                  <li key={pub.id} className="rounded border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800">
                    {pub.name}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Members */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Members</h2>
              <button
                type="button"
                onClick={() => setShowUserForm((v) => !v)}
                aria-expanded={showUserForm}
                className="rounded border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {showUserForm ? "Close" : "Add user"}
              </button>
            </div>

            {showUserForm && (
              <AddUserForm
                orgId={org.id}
                publishers={org.publishers}
                onCreated={() => {
                  setShowUserForm(false)
                  refetch()
                }}
                onCancel={() => setShowUserForm(false)}
              />
            )}

            {org.members.length === 0 ? (
              <p className="text-sm text-slate-500">No members yet.</p>
            ) : (
              <ul className="space-y-3">
                {org.members.map((member) => (
                  <li key={member.membershipId} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900">{member.user.name}</span>
                      <span className="text-sm text-slate-500">{member.user.email}</span>
                      <Badge tone={roleTone(member.user.systemRole)}>System: {member.user.systemRole}</Badge>
                      <Badge tone={roleTone(member.role)}>Org: {member.role}</Badge>
                      {canManageUsers(member.role) && <Badge tone="amber">Can manage users</Badge>}
                    </div>

                    <div className="mt-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Publisher access
                      </p>
                      {member.publisherAccess.length === 0 ? (
                        <p className="mt-1 text-sm text-slate-500">No publisher access in this organization.</p>
                      ) : (
                        <ul className="mt-1 space-y-1.5">
                          {member.publisherAccess.map((access) => (
                            <li key={access.publisherId} className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-medium text-slate-700">{access.publisherName}:</span>
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
