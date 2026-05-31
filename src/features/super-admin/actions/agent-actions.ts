"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/voxelo-auth";

function generateReferralCode(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 6);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${slug}${rand}`;
}

const agentSchema = z.object({
  name:              z.string().min(2).max(80),
  email:             z.string().email(),
  clerkUserId:       z.string().min(1),
  commissionRate:    z.number().min(0).max(1),
  fixedSalary:       z.number().min(0),
  commissionEnabled: z.boolean(),
});

export async function createAgent(input: z.infer<typeof agentSchema>) {
  await requireSuperAdmin();
  const data = agentSchema.parse(input);

  const referralCode = generateReferralCode(data.name);

  const agent = await prisma.voxeloStaff.create({
    data: {
      ...data,
      role:         "AGENT",
      referralCode,
    },
  });

  revalidatePath("/super-admin/agents");
  return agent;
}

const updateSchema = agentSchema.partial().extend({ id: z.string() });

export async function updateAgent(input: z.infer<typeof updateSchema>) {
  await requireSuperAdmin();
  const { id, ...data } = updateSchema.parse(input);

  const agent = await prisma.voxeloStaff.update({
    where: { id },
    data,
  });

  revalidatePath("/super-admin/agents");
  return agent;
}

export async function toggleAgentActive(id: string) {
  await requireSuperAdmin();

  const agent = await prisma.voxeloStaff.findUniqueOrThrow({ where: { id } });
  await prisma.voxeloStaff.update({
    where: { id },
    data:  { isActive: !agent.isActive },
  });

  revalidatePath("/super-admin/agents");
}

export async function regenerateReferralCode(id: string) {
  await requireSuperAdmin();

  const agent = await prisma.voxeloStaff.findUniqueOrThrow({
    where: { id },
    select: { name: true },
  });

  const referralCode = generateReferralCode(agent.name);
  await prisma.voxeloStaff.update({ where: { id }, data: { referralCode } });

  revalidatePath("/super-admin/agents");
  return referralCode;
}
