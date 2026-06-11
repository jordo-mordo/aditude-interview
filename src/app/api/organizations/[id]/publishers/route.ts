import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { validateCreatePublisher } from "@/lib/validation"

// POST /api/organizations/[id]/publishers — create a publisher inside the org
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const org = await prisma.organization.findUnique({ where: { id: params.id } })
    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    const body = await req.json().catch(() => null)
    const { input, errors } = validateCreatePublisher(body)
    if (errors) {
      return NextResponse.json({ error: "Invalid request", details: errors }, { status: 400 })
    }

    const publisher = await prisma.publisher.create({
      data: { name: input!.name, orgId: params.id },
    })
    return NextResponse.json(publisher, { status: 201 })
  } catch (err) {
    // P2002 = unique constraint violation → the @@unique([orgId, name]) on Publisher
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { error: "A publisher with that name already exists in this organization" },
        { status: 409 }
      )
    }
    console.error(`POST /api/organizations/${params.id}/publishers failed:`, err)
    return NextResponse.json({ error: "Failed to create publisher" }, { status: 500 })
  }
}
