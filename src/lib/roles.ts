// Single source of truth for all role and permission values.
// The DB stores these as plain strings (SQLite has no native enum support),
// so this file is where we enforce the allowed values at the TypeScript level.

export type SystemRole = "USER" | "ADMIN"
export type OrgRole = "OWNER" | "ADMIN" | "MEMBER"
export type PublisherPermission = "VIEW" | "EDIT" | "PUBLISH" | "MANAGE_USERS"

export const SYSTEM_ROLES: SystemRole[] = ["USER", "ADMIN"]
export const ORG_ROLES: OrgRole[] = ["OWNER", "ADMIN", "MEMBER"]
export const PUBLISHER_PERMISSIONS: PublisherPermission[] = ["VIEW", "EDIT", "PUBLISH", "MANAGE_USERS"]
