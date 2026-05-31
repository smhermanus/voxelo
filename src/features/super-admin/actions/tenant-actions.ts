"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/voxelo-auth";

export async function assignAttribution(tenantId: string, agentId: string) {
  await requireSuperAdmin();
  z.string().parse(tenantId);
  z.string().parse(agentId);

  await prisma.tenantAttribution.upsert({
    where:  { tenantId },
    create: { tenantId, agentId },
    update: { agentId },
  });

  revalidatePath("/super-admin/tenants");
}

export async function removeAttribution(tenantId: string) {
  await requireSuperAdmin();

  await prisma.tenantAttribution.deleteMany({ where: { tenantId } });

  revalidatePath("/super-admin/tenants");
}
