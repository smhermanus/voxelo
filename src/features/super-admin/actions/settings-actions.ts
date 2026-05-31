"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/voxelo-auth";

const settingsSchema = z.object({
  defaultCommissionRate: z.number().min(0).max(1),
});

export async function updateSettings(input: z.infer<typeof settingsSchema>) {
  await requireSuperAdmin();
  const data = settingsSchema.parse(input);

  await prisma.voxeloSettings.upsert({
    where:  { id: "global" },
    create: { id: "global", ...data },
    update: data,
  });

  revalidatePath("/super-admin/settings");
  revalidatePath("/super-admin/agents");
}
