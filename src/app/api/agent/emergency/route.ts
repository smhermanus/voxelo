import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendWhatsApp, sendOwnerEmail } from "@/lib/notifications";

const DEMO_TENANT_PHONE = process.env.DEMO_TENANT_PHONE ?? "+27218022999";

const schema = z.object({
  callerPhone: z.string().min(5).max(30),
  issue: z.string().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }
  const { callerPhone, issue } = parsed.data;

  const tenant = await prisma.tenant.findUnique({
    where: { phoneNumber: DEMO_TENANT_PHONE },
  });
  if (!tenant) return NextResponse.json({ error: "Demo tenant not found" }, { status: 404 });

  await prisma.message.create({
    data: {
      tenantId: tenant.id,
      callerName: "EMERGENCY",
      callerPhone,
      message: `🚨 EMERGENCY: ${issue}`,
    },
  });

  const ownerPhone = process.env.OWNER_WHATSAPP;
  if (ownerPhone) {
    await sendWhatsApp(
      ownerPhone,
      `🚨 EMERGENCY from ${callerPhone}:\n\n${issue}\n\nCall them back IMMEDIATELY.`,
    );
  }
  await sendOwnerEmail(
    tenant.ownerEmail,
    "🚨 EMERGENCY via AI Receptionist",
    `Caller: ${callerPhone}\n\nIssue: ${issue}\n\nCall them back IMMEDIATELY.`,
  );

  return NextResponse.json({ success: true });
}
