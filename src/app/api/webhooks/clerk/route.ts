import { headers } from "next/headers";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set — skipping webhook verification");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.text();

  // Verify signature using svix (npm install svix)
  let evt: {
    type: string;
    data: Record<string, unknown>;
  };

  try {
    // Dynamic import so the app still compiles if svix isn't installed yet
    const { Webhook } = await import("svix");
    const wh = new Webhook(WEBHOOK_SECRET);
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as typeof evt;
  } catch (err) {
    console.error("Clerk webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // Handle organization.created -> create Tenant row
  if (evt.type === "organization.created") {
    const data = evt.data as {
      id: string;
      name: string;
      created_by?: string;
    };

    const existing = await prisma.tenant.findUnique({
      where: { clerkOrgId: data.id },
    });

    if (!existing) {
      await prisma.tenant.create({
        data: {
          clerkOrgId: data.id,
          name: data.name ?? "New Business",
          // Placeholder phone until provisioned in A2; must be unique
          phoneNumber: `pending-${data.id}`,
          ownerEmail: "",
        },
      });
      console.log(`Tenant created for Clerk org: ${data.id} (${data.name})`);
    }
  }

  // Handle organizationMembership.created -> create User row
  if (evt.type === "organizationMembership.created") {
    const data = evt.data as {
      organization: { id: string };
      public_user_data: { user_id: string };
      role: string;
    };

    const tenant = await prisma.tenant.findUnique({
      where: { clerkOrgId: data.organization.id },
    });

    if (tenant) {
      await prisma.user.upsert({
        where: { clerkUserId: data.public_user_data.user_id },
        update: { role: data.role, tenantId: tenant.id },
        create: {
          clerkUserId: data.public_user_data.user_id,
          tenantId: tenant.id,
          role: data.role,
        },
      });
    }
  }

  return new Response("OK", { status: 200 });
}
