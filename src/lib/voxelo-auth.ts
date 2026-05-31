import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type VoxeloRole = "super_admin" | "agent";

/**
 * Reads voxeloRole from Clerk publicMetadata.
 * Handles "super_admin", "agent", "super_admin, agent", or array variants.
 */
export async function getVoxeloRole(): Promise<VoxeloRole | null> {
  const { sessionClaims } = await auth();
  const meta = (sessionClaims?.publicMetadata ?? {}) as { voxeloRole?: string | string[] };
  const raw  = meta.voxeloRole;
  if (!raw) return null;

  const roles = Array.isArray(raw)
    ? raw.map((r) => r.trim())
    : raw.split(",").map((r) => r.trim());

  if (roles.includes("super_admin")) return "super_admin";
  if (roles.includes("agent"))       return "agent";
  return null;
}

/**
 * Server-component guard. Call at the top of any super-admin page/layout.
 * Redirects to /dashboard if the user is not a super admin.
 */
export async function requireSuperAdmin(): Promise<void> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const role = await getVoxeloRole();
  if (role !== "super_admin") redirect("/dashboard");
}

/**
 * Server-component guard. Call at the top of any agent-portal page/layout.
 * Both agents AND super admins are allowed.
 */
export async function requireAgent(): Promise<void> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const role = await getVoxeloRole();
  if (role !== "agent" && role !== "super_admin") redirect("/dashboard");
}
