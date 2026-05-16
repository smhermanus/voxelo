import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEMO_TENANT_PHONE = "+27600000000";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const tenant = await prisma.tenant.findUnique({
    where: { phoneNumber: DEMO_TENANT_PHONE },
  });
  if (!tenant) return NextResponse.json({ error: "No tenant" }, { status: 404 });

  const appointment = await prisma.appointment.create({
    data: {
      tenantId: tenant.id,
      callerName: body.callerName,
      callerPhone: body.callerPhone,
      startTime: new Date(body.startTime),
      notes: body.notes ?? null,
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
        start: body.startTime,
        responses: {
          name: body.callerName,
          email: `${String(body.callerPhone).replace(/\s+/g, "")}@phone.demo`,
          notes: body.notes,
        },
        timeZone: "Africa/Johannesburg",
        language: "en",
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ success: true, id: appointment.id });
}
