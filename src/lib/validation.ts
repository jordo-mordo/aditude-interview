import { SYSTEM_ROLES, ORG_ROLES, PUBLISHER_PERMISSIONS, SystemRole, OrgRole, PublisherPermission } from "./roles"

export type ValidationError = Record<string, string>

// --- Input types ---

export interface CreatePublisherInput {
  name: string
}

export interface PublisherAccessInput {
  publisherId: string
  permissions: PublisherPermission[]
}

export interface CreateUserInput {
  email: string
  name: string
  password?: string
  systemRole: SystemRole
  orgRole: OrgRole
  publisherAccess: PublisherAccessInput[]
}

// --- Validators ---
// Each returns an errors object; empty means valid.

export function validateCreatePublisher(body: unknown): { input?: CreatePublisherInput; errors?: ValidationError } {
  const errors: ValidationError = {}
  if (!body || typeof body !== "object") return { errors: { _: "Request body must be a JSON object" } }
  const b = body as Record<string, unknown>

  if (typeof b.name !== "string" || b.name.trim().length === 0) {
    errors.name = "Publisher name is required"
  }

  if (Object.keys(errors).length > 0) return { errors }
  return { input: { name: (b.name as string).trim() } }
}

export function validateCreateUser(body: unknown): { input?: CreateUserInput; errors?: ValidationError } {
  const errors: ValidationError = {}
  if (!body || typeof body !== "object") return { errors: { _: "Request body must be a JSON object" } }
  const b = body as Record<string, unknown>

  if (typeof b.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) {
    errors.email = "A valid email address is required"
  }
  if (typeof b.name !== "string" || b.name.trim().length === 0) {
    errors.name = "Name is required"
  }
  if (b.password !== undefined && (typeof b.password !== "string" || b.password.length < 8)) {
    errors.password = "Password must be at least 8 characters"
  }

  const systemRole: SystemRole = (SYSTEM_ROLES as readonly string[]).includes(b.systemRole as string)
    ? (b.systemRole as SystemRole)
    : "USER"

  const orgRole: OrgRole = (ORG_ROLES as readonly string[]).includes(b.orgRole as string)
    ? (b.orgRole as OrgRole)
    : "MEMBER"

  const publisherAccess: PublisherAccessInput[] = []
  if (b.publisherAccess !== undefined) {
    if (!Array.isArray(b.publisherAccess)) {
      errors.publisherAccess = "publisherAccess must be an array"
    } else {
      for (let i = 0; i < b.publisherAccess.length; i++) {
        const grant = b.publisherAccess[i] as Record<string, unknown>
        if (typeof grant.publisherId !== "string" || grant.publisherId.trim().length === 0) {
          errors[`publisherAccess[${i}].publisherId`] = "publisherId is required"
          continue
        }
        if (!Array.isArray(grant.permissions) || grant.permissions.length === 0) {
          errors[`publisherAccess[${i}].permissions`] = "At least one permission is required"
          continue
        }
        const invalid = (grant.permissions as unknown[]).filter(
          (p) => !(PUBLISHER_PERMISSIONS as readonly string[]).includes(p as string)
        )
        if (invalid.length > 0) {
          errors[`publisherAccess[${i}].permissions`] = `Invalid permissions: ${invalid.join(", ")}`
          continue
        }
        publisherAccess.push({
          publisherId: grant.publisherId as string,
          permissions: grant.permissions as PublisherPermission[],
        })
      }
    }
  }

  if (Object.keys(errors).length > 0) return { errors }
  return {
    input: {
      email: (b.email as string).trim().toLowerCase(),
      name: (b.name as string).trim(),
      password: b.password as string | undefined,
      systemRole,
      orgRole,
      publisherAccess,
    },
  }
}
