import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/** Temporary debug route — remove before shipping to customers */
export async function GET() {
  if (process.env.NODE_ENV === "production" && !process.env.DEBUG_AUTH) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { userId, orgId, sessionClaims } = await auth();

  return NextResponse.json({
    userId,
    orgId,
    publicMetadata: (sessionClaims?.publicMetadata ?? null),
    voxeloRole:     (sessionClaims?.publicMetadata as Record<string,unknown> | null)?.voxeloRole ?? null,
  });
}
