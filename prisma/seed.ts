import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Clear in dependency order to avoid FK violations
  await prisma.publisherPermission.deleteMany()
  await prisma.publisherAccess.deleteMany()
  await prisma.organizationMembership.deleteMany()
  await prisma.publisher.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  // --- Users ---
  const passwordHash = await bcrypt.hash("password123", 10)

  const sysAdmin = await prisma.user.create({
    data: { email: "admin@example.com", name: "System Admin", passwordHash, systemRole: "ADMIN" },
  })
  const alice = await prisma.user.create({
    data: { email: "alice@example.com", name: "Alice Chen", passwordHash },
  })
  const bob = await prisma.user.create({
    data: { email: "bob@example.com", name: "Bob Patel", passwordHash },
  })
  const carol = await prisma.user.create({
    data: { email: "carol@example.com", name: "Carol Nguyen", passwordHash },
  })
  const dave = await prisma.user.create({
    data: { email: "dave@example.com", name: "Dave Kim", passwordHash },
  })
  const eve = await prisma.user.create({
    data: { email: "eve@example.com", name: "Eve Torres", passwordHash },
  })

  // --- Organizations ---
  const mediaGroup = await prisma.organization.create({ data: { name: "Apex Media Group" } })
  const techPress = await prisma.organization.create({ data: { name: "TechPress Inc." } })
  const localNews = await prisma.organization.create({ data: { name: "Local News Network" } })

  // --- Publishers ---
  const [apexDaily, apexWeekly, apexSports] = await Promise.all([
    prisma.publisher.create({ data: { name: "Apex Daily", orgId: mediaGroup.id } }),
    prisma.publisher.create({ data: { name: "Apex Weekly", orgId: mediaGroup.id } }),
    prisma.publisher.create({ data: { name: "Apex Sports", orgId: mediaGroup.id } }),
  ])

  const [techCrunch, devDigest] = await Promise.all([
    prisma.publisher.create({ data: { name: "TechCrunch Beat", orgId: techPress.id } }),
    prisma.publisher.create({ data: { name: "Dev Digest", orgId: techPress.id } }),
  ])

  const [cityBeat] = await Promise.all([
    prisma.publisher.create({ data: { name: "City Beat", orgId: localNews.id } }),
  ])

  // --- Org memberships ---
  await prisma.organizationMembership.createMany({
    data: [
      // Apex Media Group
      { userId: alice.id,    orgId: mediaGroup.id, role: "OWNER" },
      { userId: bob.id,      orgId: mediaGroup.id, role: "ADMIN" },
      { userId: carol.id,    orgId: mediaGroup.id, role: "MEMBER" },
      { userId: sysAdmin.id, orgId: mediaGroup.id, role: "MEMBER" },

      // TechPress
      { userId: bob.id,      orgId: techPress.id, role: "OWNER" },
      { userId: dave.id,     orgId: techPress.id, role: "ADMIN" },
      { userId: eve.id,      orgId: techPress.id, role: "MEMBER" },

      // Local News
      { userId: carol.id,   orgId: localNews.id, role: "OWNER" },
      { userId: eve.id,     orgId: localNews.id, role: "MEMBER" },
    ],
  })

  // --- Publisher access + permissions ---
  // Helper: create access record then attach permissions
  async function grantAccess(
    userId: string,
    publisherId: string,
    permissions: string[]
  ) {
    const access = await prisma.publisherAccess.create({
      data: { userId, publisherId },
    })
    await prisma.publisherPermission.createMany({
      data: permissions.map((permission) => ({ accessId: access.id, permission })),
    })
  }

  // Alice — full control on all Apex publishers
  await grantAccess(alice.id, apexDaily.id,  ["VIEW", "EDIT", "PUBLISH", "MANAGE_USERS"])
  await grantAccess(alice.id, apexWeekly.id, ["VIEW", "EDIT", "PUBLISH", "MANAGE_USERS"])
  await grantAccess(alice.id, apexSports.id, ["VIEW", "EDIT", "PUBLISH", "MANAGE_USERS"])

  // Bob — edit on Apex Daily, full control on TechPress publishers
  await grantAccess(bob.id, apexDaily.id,   ["VIEW", "EDIT"])
  await grantAccess(bob.id, techCrunch.id,  ["VIEW", "EDIT", "PUBLISH", "MANAGE_USERS"])
  await grantAccess(bob.id, devDigest.id,   ["VIEW", "EDIT", "PUBLISH", "MANAGE_USERS"])

  // Carol — view-only on Apex, owns City Beat
  await grantAccess(carol.id, apexDaily.id,  ["VIEW"])
  await grantAccess(carol.id, apexWeekly.id, ["VIEW"])
  await grantAccess(carol.id, cityBeat.id,   ["VIEW", "EDIT", "PUBLISH", "MANAGE_USERS"])

  // Dave — editor on TechPress publishers
  await grantAccess(dave.id, techCrunch.id, ["VIEW", "EDIT", "PUBLISH"])
  await grantAccess(dave.id, devDigest.id,  ["VIEW", "EDIT"])

  // Eve — view + edit on assigned publishers
  await grantAccess(eve.id, techCrunch.id, ["VIEW"])
  await grantAccess(eve.id, cityBeat.id,   ["VIEW", "EDIT"])

  console.log("Seed complete:")
  console.log(`  ${await prisma.organization.count()} organizations`)
  console.log(`  ${await prisma.publisher.count()} publishers`)
  console.log(`  ${await prisma.user.count()} users`)
  console.log(`  ${await prisma.organizationMembership.count()} org memberships`)
  console.log(`  ${await prisma.publisherAccess.count()} publisher access records`)
  console.log(`  ${await prisma.publisherPermission.count()} publisher permissions`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
