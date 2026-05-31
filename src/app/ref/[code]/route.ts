import { NextRequest, NextResponse } from "next/server";

// 30-day cookie so attribution persists even if they sign up later
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  if (!code || !/^[a-zA-Z0-9_-]+$/.test(code)) {
    return NextResponse.redirect(new URL("/home", _req.url));
  }

  const response = NextResponse.redirect(new URL("/home", _req.url));
  response.cookies.set("vox_ref", code, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return response;
}
