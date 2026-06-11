// Single source of truth for all role and permission values.
// The DB stores these as plain strings (SQLite has no native enum support),
// so this file enforces the allowed values at the TypeScript level.

export const SYSTEM_ROLES = ["USER", "ADMIN"] as const
export const ORG_ROLES = ["OWNER", "ADMIN", "MEMBER"] as const
// Publisher permissions cover content actions only. The ability to manage users is
// NOT a publisher permission — it's a coarse org-admin capability derived from the
// org role (see canManageUsers below), so a low-level MEMBER can never be granted it.
export const PUBLISHER_PERMISSIONS = ["VIEW", "EDIT", "PUBLISH"] as const

export type SystemRole = (typeof SYSTEM_ROLES)[number]
export type OrgRole = (typeof ORG_ROLES)[number]
export type PublisherPermission = (typeof PUBLISHER_PERMISSIONS)[number]

// Managing users within an org is assumed for OWNER/ADMIN org roles (and any system ADMIN,
// who overrides everything). Derived rather than stored.
export function canManageUsers(orgRole: OrgRole): boolean {
  return orgRole === "OWNER" || orgRole === "ADMIN"
}
