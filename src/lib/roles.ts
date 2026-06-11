// Single source of truth for all role and permission values.
// The DB stores these as plain strings (SQLite has no native enum support),
// so this file enforces the allowed values at the TypeScript level and feeds zod.

export const SYSTEM_ROLES = ["USER", "ADMIN"] as const
export const ORG_ROLES = ["OWNER", "ADMIN", "MEMBER"] as const
export const PUBLISHER_PERMISSIONS = ["VIEW", "EDIT", "PUBLISH", "MANAGE_USERS"] as const

export type SystemRole = (typeof SYSTEM_ROLES)[number]
export type OrgRole = (typeof ORG_ROLES)[number]
export type PublisherPermission = (typeof PUBLISHER_PERMISSIONS)[number]
