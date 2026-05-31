import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// 30-day cookie so attribution persists even if they sign up later
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  if (!code || !/^[a-zA-Z0-9_-]+$/.test(code)) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // If the visitor is already signed in, send them to their dashboard
  // Otherwise send them straight to sign-up so they can create an account
  const { userId } = await auth();
  const destination = userId ? "/dashboard" : "/sign-up";

  const response = NextResponse.redirect(new URL(destination, req.url));

  // Set cookie BEFORE the redirect so attribution is captured immediately
  response.cookies.set("vox_ref", code, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return response;
}
