import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendWhatsApp, sendOwnerEmail } from "@/lib/notifications";

const DEMO_TENANT_PHONE = process.env.DEMO_TENANT_PHONE ?? "+27218022999";

const schema = z.object({
  callerName: z.string().min(1).max(200),
  callerPhone: z.string().min(5).max(30),
  startTime: z.string().min(1),  // ISO datetime string e.g. "2025-06-01T10:00:00+02:00"
  notes: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }
  const { callerName, callerPhone, startTime, notes } = parsed.data;

  const tenant = await prisma.tenant.findUnique({
    where: { phoneNumber: DEMO_TENANT_PHONE },
  });
  if (!tenant) return NextResponse.json({ error: "Demo tenant not found" }, { status: 404 });

  const appointment = await prisma.appointment.create({
    data: {
      tenantId: tenant.id,
      callerName,
      callerPhone,
      startTime: new Date(startTime),
      notes: notes ?? null,
    },
  });

  if (process.env.CALCOM_API_KEY && process.env.CALCOM_EVENT_TYPE_ID) {
    await fetch("https://api.cal.com/v1/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CALCOM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventTypeId: parseInt(process.env.CALCOM_EVENT_TYPE_ID),
        start: startTime,
        responses: {
          name: callerName,
          email: `${callerPhone.replace(/\s+/g, "")}@phone.demo`,
          notes: notes,
        },
        timeZone: "Africa/Johannesburg",
        language: "en",
      }),
    }).catch(() => {});
  }

  const ownerPhone = process.env.OWNER_WHATSAPP;
  const apptDate = new Date(startTime).toLocaleString("en-ZA", {
    timeZone: "Africa/Johannesburg",
    dateStyle: "medium",
    timeStyle: "short",
  });
  if (ownerPhone) {
    await sendWhatsApp(
      ownerPhone,
      `📅 New appointment booked!\n\n${callerName} (${callerPhone})\n🗓 ${apptDate}\n📝 ${notes ?? "No notes"}`,
    );
  }
  await sendOwnerEmail(
    tenant.ownerEmail,
    "New appointment via AI Receptionist",
    `Client: ${callerName} (${callerPhone})\nDate: ${apptDate}\nNotes: ${notes ?? "None"}`,
  );

  return NextResponse.json({ success: true, id: appointment.id });
}
