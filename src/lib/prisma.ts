import { PrismaClient } from "@prisma/client"

// Reuse a single PrismaClient across hot-reloads in dev.
// Without this, Next.js would spin up a new client on every reload and exhaust DB connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
