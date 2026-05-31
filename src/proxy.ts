import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",                  // Root — page component handles auth-based redirect
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/home(.*)",          // Public landing page
  "/faq(.*)",           // Client-facing FAQ (public)
  "/about(.*)",         // Company pages
  "/careers(.*)",
  "/blog(.*)",
  "/contact(.*)",
  "/privacy(.*)",       // Legal pages
  "/terms(.*)",
  "/security(.*)",
  "/dpa(.*)",
  "/ref(.*)",                // Referral links — must work for unauthenticated visitors
  "/api/webhooks(.*)",       // Clerk + future inbound webhooks
  "/api/agent(.*)",          // Called by ElevenLabs/LiveKit agent servers
  "/api/twilio(.*)",         // Twilio voice/status webhooks (Track B)
  "/api/elevenlabs/tts(.*)", // Public demo TTS — key is server-side only
  "/api/debug-auth",         // Temporary auth diagnostics
]);

const isOrgSelectionRoute  = createRouteMatcher(["/org-selection(.*)"]);
const isSuperAdminRoute    = createRouteMatcher(["/super-admin(.*)"]);
const isAgentPortalRoute   = createRouteMatcher(["/agent-portal(.*)"]);

type VoxeloRole = "super_admin" | "agent";

/**
 * Handles all Clerk metadata formats:
 *   "super_admin"           — single role (recommended)
 *   "super_admin, agent"    — comma-separated string
 *   ["super_admin","agent"] — array value
 * Returns highest-privilege role found, or null.
 */
function getVoxeloRole(sessionClaims: Record<string, unknown> | null | undefined): VoxeloRole | null {
  const meta = sessionClaims?.publicMetadata as { voxeloRole?: string | string[] } | undefined;
  const raw  = meta?.voxeloRole;
  if (!raw) return null;

  // Normalise to an array of trimmed strings
  const roles: string[] = Array.isArray(raw)
    ? raw.map((r) => r.trim())
    : raw.split(",").map((r) => r.trim());

  if (roles.includes("super_admin")) return "super_admin";
  if (roles.includes("agent"))       return "agent";
  return null;
}

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId, sessionClaims } = await auth();

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect non-public routes — redirects to sign-in if not authenticated
  if (!userId) {
    await auth.protect();
  }

  const voxeloRole = getVoxeloRole(sessionClaims as Record<string, unknown>);

  // ── Super-admin portal ──────────────────────────────────────────────────────
  if (isSuperAdminRoute(req)) {
    if (voxeloRole !== "super_admin") {
      // If they also have an org, send to tenant dashboard; otherwise sign-in
      return NextResponse.redirect(new URL(orgId ? "/dashboard" : "/sign-in", req.url));
    }
    return NextResponse.next(); // staff — no org context required
  }

  // ── Agent portal ────────────────────────────────────────────────────────────
  if (isAgentPortalRoute(req)) {
    if (voxeloRole !== "agent" && voxeloRole !== "super_admin") {
      return NextResponse.redirect(new URL(orgId ? "/dashboard" : "/sign-in", req.url));
    }
    return NextResponse.next(); // staff — no org context required
  }

  // ── Tenant routes ───────────────────────────────────────────────────────────
  // Allow org selection page
  if (isOrgSelectionRoute(req)) {
    return NextResponse.next();
  }

  // Staff users don't need an org — send them to their portal if they land here
  if (voxeloRole === "super_admin") {
    return NextResponse.redirect(new URL("/super-admin", req.url));
  }
  if (voxeloRole === "agent") {
    return NextResponse.redirect(new URL("/agent-portal", req.url));
  }

  // Tenant users must have an org selected
  if (userId && !orgId) {
    return NextResponse.redirect(new URL("/org-selection", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};