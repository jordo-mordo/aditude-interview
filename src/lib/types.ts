import { SystemRole, OrgRole, PublisherPermission } from "./roles"
import { PublisherTag } from "./tags"

// Shapes returned by the Part 2 API routes (src/app/api/organizations/...).
// Kept in sync with the DTOs those handlers build (note: passwordHash is never included).

export interface OrganizationSummary {
  id: string
  name: string
  createdAt: string
  _count: { publishers: number; memberships: number }
}

export interface PublisherDTO {
  id: string
  name: string
  tag: PublisherTag
  createdAt: string
}

export interface PublisherAccessDTO {
  publisherId: string
  publisherName: string
  permissions: PublisherPermission[]
}

export interface MemberDTO {
  membershipId: string
  role: OrgRole
  user: {
    id: string
    name: string
    email: string
    systemRole: SystemRole
  }
  publisherAccess: PublisherAccessDTO[]
}

export interface OrganizationDetail {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  publishers: PublisherDTO[]
  members: MemberDTO[]
}
