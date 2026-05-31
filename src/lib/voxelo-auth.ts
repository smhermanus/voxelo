import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type VoxeloRole = "super_admin" | "agent";

/** Reads voxeloRole from Clerk publicMetadata on the current session. */
export async function getVoxeloRole(): Promise<VoxeloRole | null> {
  const { sessionClaims } = await auth();
  const meta = (sessionClaims?.publicMetadata ?? {}) as { voxeloRole?: string };
  const role = meta.voxeloRole;
  if (role === "super_admin" || role === "agent") return role;
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
