import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { validateCreateUser } from "@/lib/validation"

// POST /api/organizations/[id]/users
// Creates a user, adds them to this org with an org role, and grants publisher
// access + permissions — all in one transaction so a partial failure rolls back.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const org = await prisma.organization.findUnique({ where: { id: params.id } })
    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    const body = await req.json().catch(() => null)
    const { input, errors } = validateCreateUser(body)
    if (errors) {
      return NextResponse.json({ error: "Invalid request", details: errors }, { status: 400 })
    }
    const { email, name, password, systemRole, orgRole, publisherAccess } = input!

    // Enforce the cross-table invariant: a user may only be granted access to
    // publishers that belong to *this* org.
    if (publisherAccess.length > 0) {
      const orgPublishers = await prisma.publisher.findMany({
        where: { orgId: params.id },
        select: { id: true },
      })
      const orgPublisherIds = new Set(orgPublishers.map((p) => p.id))
      const invalid = publisherAccess.filter((a) => !orgPublisherIds.has(a.publisherId))
      if (invalid.length > 0) {
        return NextResponse.json(
          { error: "One or more publishers do not belong to this organization" },
          { status: 400 }
        )
      }
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : null

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: { email, name, passwordHash, systemRole },
      })

      await tx.organizationMembership.create({
        data: { userId: created.id, orgId: params.id, role: orgRole },
      })

      for (const grant of publisherAccess) {
        const access = await tx.publisherAccess.create({
          data: { userId: created.id, publisherId: grant.publisherId },
        })
        await tx.publisherPermission.createMany({
          data: grant.permissions.map((permission) => ({ accessId: access.id, permission })),
        })
      }

      return created
    })

    // Never return the passwordHash
    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name, systemRole: user.systemRole },
      { status: 201 }
    )
  } catch (err) {
    // P2002 = unique constraint → email already in use
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { error: "A user with that email already exists" },
        { status: 409 }
      )
    }
    console.error(`POST /api/organizations/${params.id}/users failed:`, err)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
