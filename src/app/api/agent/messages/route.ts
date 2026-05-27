import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendWhatsApp, sendOwnerEmail } from "@/lib/notifications";

const DEMO_TENANT_PHONE = process.env.DEMO_TENANT_PHONE ?? "+27218022999";

const schema = z.object({
  callerName: z.string().min(1).max(200),
  callerPhone: z.string().min(5).max(30),
  message: z.string().min(1).max(5000),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }
  const { callerName, callerPhone, message } = parsed.data;

  const tenant = await prisma.tenant.findUnique({
    where: { phoneNumber: DEMO_TENANT_PHONE },
  });
  if (!tenant) return NextResponse.json({ error: "Demo tenant not found" }, { status: 404 });

  const record = await prisma.message.create({
    data: { tenantId: tenant.id, callerName, callerPhone, message },
  });

  const ownerPhone = process.env.OWNER_WHATSAPP;
  if (ownerPhone) {
    await sendWhatsApp(
      ownerPhone,
      `📞 New message from ${callerName} (${callerPhone}):\n\n${message}`,
    );
  }
  await sendOwnerEmail(
    tenant.ownerEmail,
    "New message via AI Receptionist",
    `From: ${callerName} (${callerPhone})\n\n${message}`,
  );

  return NextResponse.json({ success: true, id: record.id });
}
