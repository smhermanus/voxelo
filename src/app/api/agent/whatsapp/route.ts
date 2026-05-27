import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendWhatsApp } from "@/lib/notifications";

const schema = z.object({
  recipientPhone: z.string().min(5).max(30),
  message: z.string().min(1).max(1600),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }
  const { recipientPhone, message } = parsed.data;

  await sendWhatsApp(recipientPhone, message);

  return NextResponse.json({ success: true });
}
