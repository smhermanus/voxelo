import { currentUser, auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/** Temporary debug route — remove before shipping to customers */
export async function GET() {
  if (process.env.NODE_ENV === "production" && !process.env.DEBUG_AUTH) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { userId, orgId } = await auth();
  const user = await currentUser();

  return NextResponse.json({
    userId,
    orgId,
    // From JWT (often null — publicMetadata not in default Clerk JWT)
    jwtPublicMetadata: null,
    // From currentUser() — always has live metadata (this is what the app uses)
    publicMetadata: user?.publicMetadata ?? null,
    voxeloRole:     user?.publicMetadata?.voxeloRole ?? null,
  });
}
