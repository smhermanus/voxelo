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

  // If they have the voxeloRole metadata but no DB row yet, send them somewhere safe
  if (!agent) redirect("/sign-in");

  return agent;
}
