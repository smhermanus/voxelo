import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const DEMO_TENANT_PHONE = "+27600000000";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const tenant = await prisma.tenant.findUnique({
    where: { phoneNumber: DEMO_TENANT_PHONE },
  });
  if (!tenant) return NextResponse.json({ error: "No tenant" }, { status: 404 });

  await prisma.message.create({
    data: {
      tenantId: tenant.id,
      callerName: "EMERGENCY",
      callerPhone: body.callerPhone ?? "unknown",
      message: `🚨 EMERGENCY: ${body.issue ?? "No details provided"}`,
    },
  });

  console.error("[EMERGENCY]", body);
  return NextResponse.json({ success: true });
}
