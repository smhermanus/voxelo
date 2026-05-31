import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateSignature, verifyWithPayFast, parseFormBody } from "@/lib/payfast";

const SANDBOX = process.env.PAYFAST_SANDBOX === "true";
const PASSPHRASE = process.env.PAYFAST_PASSPHRASE ?? null;

/** Returns the first day of the month for a given date (UTC). */
function startOfMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const params = parseFormBody(raw);

  // ── 1. Signature validation ────────────────────────────────────────────────
  if (!validateSignature(params, PASSPHRASE)) {
    console.warn("[PayFast] Signature mismatch — rejecting ITN");
    return new NextResponse("Invalid signature", { status: 400 });
  }

  // ── 2. Server-to-server verification ──────────────────────────────────────
  const valid = await verifyWithPayFast(params, SANDBOX);
  if (!valid) {
    console.warn("[PayFast] Server-side verification failed — rejecting ITN");
    return new NextResponse("Verification failed", { status: 400 });
  }

  // ── 3. Only process COMPLETE payments ─────────────────────────────────────
  if (params.payment_status !== "COMPLETE") {
    console.log(`[PayFast] Ignoring status: ${params.payment_status}`);
    return new NextResponse("OK", { status: 200 });
  }

  const pfPaymentId  = params.pf_payment_id  ?? "";
  const grossAmount  = parseFloat(params.amount_gross ?? "0");
  const tenantId     = params.custom_str1 ?? null; // set by us when creating payment

  if (!pfPaymentId) {
    return new NextResponse("Missing pf_payment_id", { status: 400 });
  }

  // ── 4. Idempotency — skip if already stored ────────────────────────────────
  const existing = await prisma.payFastPayment.findUnique({
    where: { pfPaymentId },
  });
  if (existing) {
    console.log(`[PayFast] Duplicate ITN for ${pfPaymentId} — skipping`);
    return new NextResponse("OK", { status: 200 });
  }

  // ── 5. Find tenant ─────────────────────────────────────────────────────────
  let resolvedTenantId: string | null = null;

  if (tenantId) {
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (tenant) resolvedTenantId = tenant.id;
  }

  if (!resolvedTenantId && params.email_address) {
    const tenant = await prisma.tenant.findFirst({
      where: { ownerEmail: params.email_address },
    });
    if (tenant) resolvedTenantId = tenant.id;
  }

  // ── 6. Store payment ───────────────────────────────────────────────────────
  const payment = await prisma.payFastPayment.create({
    data: {
      pfPaymentId,
      tenantId:      resolvedTenantId,
      amount:        grossAmount,
      itemName:      params.item_name ?? null,
      paymentStatus: params.payment_status,
      billingDate:   new Date(),
      rawPayload:    params as Record<string, string>,
    },
  });

  console.log(`[PayFast] Payment stored: ${payment.id} (R${grossAmount})`);

  // ── 7. Auto-create commission if tenant has an attributed agent ────────────
  if (resolvedTenantId) {
    const attribution = await prisma.tenantAttribution.findUnique({
      where:   { tenantId: resolvedTenantId },
      include: { agent: true },
    });

    if (attribution?.agent.commissionEnabled) {
      const rate             = attribution.agent.commissionRate;
      const commissionAmount = grossAmount * Number(rate);
      const month            = startOfMonth(new Date());

      await prisma.commission.create({
        data: {
          agentId:          attribution.agentId,
          tenantId:         resolvedTenantId,
          paymentId:        payment.id,
          grossAmount,
          commissionRate:   rate,
          commissionAmount,
          month,
          status:           "PENDING",
        },
      });

      console.log(
        `[PayFast] Commission created: R${commissionAmount.toFixed(2)} ` +
        `(${Number(rate) * 100}%) for agent ${attribution.agentId}`
      );
    }
  }

  return new NextResponse("OK", { status: 200 });
}
