"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/voxelo-auth";

export async function approveCommission(id: string) {
  await requireSuperAdmin();

  await prisma.commission.update({
    where: { id, status: "PENDING" },
    data:  { status: "APPROVED" },
  });

  revalidatePath("/super-admin/commissions");
}

export async function markCommissionPaid(id: string) {
  await requireSuperAdmin();

  await prisma.commission.update({
    where: { id, status: "APPROVED" },
    data:  { status: "PAID", paidAt: new Date() },
  });

  revalidatePath("/super-admin/commissions");
}

export async function bulkApproveCommissions(ids: string[]) {
  await requireSuperAdmin();
  z.array(z.string()).parse(ids);

  await prisma.commission.updateMany({
    where: { id: { in: ids }, status: "PENDING" },
    data:  { status: "APPROVED" },
  });

  revalidatePath("/super-admin/commissions");
}

export async function bulkMarkPaid(ids: string[]) {
  await requireSuperAdmin();
  z.array(z.string()).parse(ids);

  await prisma.commission.updateMany({
    where: { id: { in: ids }, status: "APPROVED" },
    data:  { status: "PAID", paidAt: new Date() },
  });

  revalidatePath("/super-admin/commissions");
}

export async function addCommissionNote(id: string, notes: string) {
  await requireSuperAdmin();

  await prisma.commission.update({
    where: { id },
    data:  { notes: z.string().max(500).parse(notes) },
  });

  revalidatePath("/super-admin/commissions");
}
