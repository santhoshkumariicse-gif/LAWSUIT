import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export type Role = "USER" | "LAWYER" | "ENTERPRISE_ADMIN" | "SYSTEM_ADMIN";

const roleHierarchy: Record<Role, number> = {
  USER: 1,
  LAWYER: 2,
  ENTERPRISE_ADMIN: 3,
  SYSTEM_ADMIN: 4,
};

/**
 * Get the current authenticated user's session safely.
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Check if the user has a specific exact role.
 */
export async function hasRole(role: Role): Promise<boolean> {
  const session = await getSession();
  return (session?.user as any)?.role === role;
}

/**
 * Check if the user has a role greater than or equal to the required role.
 * (e.g. isAtLeast("LAWYER") returns true for LAWYER, ENTERPRISE_ADMIN, SYSTEM_ADMIN)
 */
export async function isAtLeast(minimumRole: Role): Promise<boolean> {
  const session = await getSession();
  if (!(session?.user as any)?.role) return false;

  const userRole = (session?.user as any).role as Role;
  return roleHierarchy[userRole] >= roleHierarchy[minimumRole];
}

/**
 * Utility to strictly guard API routes from privilege escalation.
 * Throws an error if the user does not meet the minimum role.
 */
export async function enforceRole(minimumRole: Role) {
  const authorized = await isAtLeast(minimumRole);
  if (!authorized) {
    throw new Error(`Forbidden: Requires at least ${minimumRole} privileges.`);
  }
}
