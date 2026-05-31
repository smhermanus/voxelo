import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

/** Fetches the VoxeloStaff row for the currently signed-in agent. */
export async function getCurrentAgent() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const agent = await prisma.voxeloStaff.findUnique({
    where: { clerkUserId: userId },
  });

  // Role is set in Clerk but no VoxeloStaff DB record yet — admin needs to add them
  if (!agent) redirect("/agent-portal/setup");

  return agent;
}
