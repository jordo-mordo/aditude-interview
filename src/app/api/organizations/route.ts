import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/organizations — list all orgs for the dashboard switcher
export async function GET() {
  try {
    const organizations = await prisma.organization.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: { select: { publishers: true, memberships: true } },
      },
    })
    return NextResponse.json(organizations)
  } catch (err) {
    console.error("GET /api/organizations failed:", err)
    return NextResponse.json({ error: "Failed to load organizations" }, { status: 500 })
  }
}
