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


export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect non-public routes — redirects to sign-in if not authenticated
  if (!userId) {
    await auth.protect();
  }

  // ── Super-admin portal ──────────────────────────────────────────────────────
  // Role authorisation is handled server-side in the layout via currentUser().
  if (isSuperAdminRoute(req)) {
    if (!userId) return NextResponse.redirect(new URL("/sign-in", req.url));
    return NextResponse.next();
  }

  // ── Agent portal ────────────────────────────────────────────────────────────
  if (isAgentPortalRoute(req)) {
    if (!userId) return NextResponse.redirect(new URL("/sign-in", req.url));
    return NextResponse.next();
  }

  // ── Tenant routes ───────────────────────────────────────────────────────────
  // Allow org selection page
  if (isOrgSelectionRoute(req)) {
    return NextResponse.next();
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