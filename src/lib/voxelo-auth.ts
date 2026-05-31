import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type VoxeloRole = "super_admin" | "agent";

/**
 * Parses voxeloRole from a raw metadata value.
 * Handles: "super_admin" | "agent" | "super_admin, agent" | string[]
 */
function parseRole(raw: unknown): VoxeloRole | null {
  if (!raw) return null;

  const roles: string[] = Array.isArray(raw)
    ? (raw as string[]).map((r) => String(r).trim())
    : String(raw).split(",").map((r) => r.trim());

  if (roles.includes("super_admin")) return "super_admin";
  if (roles.includes("agent"))       return "agent";
  return null;
}

/**
 * Reads voxeloRole from Clerk publicMetadata via currentUser().
 * Uses the live API — not the JWT — so it always reflects the latest metadata.
 */
export async function getVoxeloRole(): Promise<VoxeloRole | null> {
  const user = await currentUser();
  if (!user) return null;
  return parseRole(user.publicMetadata?.voxeloRole);
}

/**
 * Server-component guard for super-admin pages/layouts.
 * Redirects to /sign-in or /dashboard if not authorised.
 */
export async function requireSuperAdmin(): Promise<void> {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const role = parseRole(user.publicMetadata?.voxeloRole);
  if (role !== "super_admin") redirect("/dashboard");
}

/**
 * Server-component guard for agent-portal pages/layouts.
 * Allows both agents and super admins.
 */
export async function requireAgent(): Promise<void> {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const role = parseRole(user.publicMetadata?.voxeloRole);
  if (role !== "agent" && role !== "super_admin") redirect("/dashboard");
}
