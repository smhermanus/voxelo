import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendWhatsApp, sendOwnerEmail } from "@/lib/notifications";

const DEMO_TENANT_PHONE = "+27600000000";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const tenant = await prisma.tenant.findUnique({
    where: { phoneNumber: DEMO_TENANT_PHONE },
  });
  if (!tenant) return NextResponse.json({ error: "No tenant" }, { status: 404 });

  const message = await prisma.message.create({
    data: {
      tenantId: tenant.id,
      callerName: body.callerName,
      callerPhone: body.callerPhone,
      message: body.message,
    },
  });

  const ownerPhone = process.env.OWNER_WHATSAPP;
  if (ownerPhone) {
    await sendWhatsApp(
      ownerPhone,
      `📞 New message from ${body.callerName} (${body.callerPhone}):\n\n${body.message}`,
    );
  }
  await sendOwnerEmail(
    tenant.ownerEmail,
    "New message via AI Receptionist",
    `From: ${body.callerName} (${body.callerPhone})\n\n${body.message}`,
  );

  return NextResponse.json({ success: true, id: message.id });
}
