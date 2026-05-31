"use server";

import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

/**
 * Called once when a tenant's dashboard loads.
 * If a `vox_ref` cookie is present and the tenant has no attribution yet,
 * creates a TenantAttribution linking them to the referring agent.
 */
export async function attributeReferral(): Promise<void> {
  const cookieStore = await cookies();
  const refCode = cookieStore.get("vox_ref")?.value;
  if (!refCode) return;

  const { orgId } = await auth();
  if (!orgId) return;

  const tenant = await prisma.tenant.findUnique({
    where: { clerkOrgId: orgId },
    select: { id: true, attribution: true },
  });

  if (!tenant || tenant.attribution) return; // already attributed

  const agent = await prisma.voxeloStaff.findUnique({
    where: { referralCode: refCode },
    select: { id: true, isActive: true },
  });

  if (!agent?.isActive) return;

  await prisma.tenantAttribution.create({
    data: {
      tenantId:    tenant.id,
      agentId:     agent.id,
      referralCode: refCode,
    },
  });

  // Clear the cookie so it only fires once
  cookieStore.delete("vox_ref");
}
