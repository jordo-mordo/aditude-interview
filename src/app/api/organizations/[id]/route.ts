import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/organizations/[id] — full org detail for the org page:
// metadata, its publishers, and its members (users) with the publisher access
// + permissions they hold *within this org*.
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: params.id },
      include: {
        publishers: { orderBy: { name: "asc" } },
        memberships: {
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              include: {
                // only the access for publishers belonging to *this* org
                publisherAccess: {
                  where: { publisher: { orgId: params.id } },
                  include: {
                    publisher: { select: { id: true, name: true } },
                    permissions: { select: { permission: true } },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Reshape into a clean DTO — notably this drops the user's passwordHash so it is never returned.
    const result = {
      id: org.id,
      name: org.name,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
      publishers: org.publishers.map((p) => ({
        id: p.id,
        name: p.name,
        createdAt: p.createdAt,
      })),
      members: org.memberships.map((m) => ({
        membershipId: m.id,
        role: m.role,
        user: {
          id: m.user.id,
          name: m.user.name,
          email: m.user.email,
          systemRole: m.user.systemRole,
        },
        publisherAccess: m.user.publisherAccess.map((a) => ({
          publisherId: a.publisher.id,
          publisherName: a.publisher.name,
          permissions: a.permissions.map((p) => p.permission),
        })),
      })),
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error(`GET /api/organizations/${params.id} failed:`, err)
    return NextResponse.json({ error: "Failed to load organization" }, { status: 500 })
  }
}
