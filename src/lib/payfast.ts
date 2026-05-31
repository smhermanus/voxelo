import crypto from "crypto";

export interface PayFastITN {
  m_payment_id:   string;
  pf_payment_id:  string;
  payment_status: string;  // COMPLETE | CANCELLED | FAILED
  item_name:      string;
  amount_gross:   string;
  amount_fee:     string;
  amount_net:     string;
  email_address:  string;
  merchant_id:    string;
  signature:      string;
  // Custom fields we populate when creating a payment
  custom_str1?: string;  // tenantId (internal Prisma ID)
  custom_str2?: string;  // reserved
  [key: string]: string | undefined;
}

/**
 * Builds the PayFast signature from ITN params.
 * Excludes the `signature` field itself, sorts keys, URL-encodes values.
 */
function buildSignatureString(
  params: Record<string, string | undefined>,
  passphrase: string | null
): string {
  const entries = Object.entries(params)
    .filter(([key, val]) => key !== "signature" && val !== undefined && val !== "")
    .map(([key, val]) => [key, val as string]);

  const paramString = entries
    .map(([key, val]) => `${key}=${encodeURIComponent(val).replace(/%20/g, "+")}`)
    .join("&");

  if (passphrase) {
    return `${paramString}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`;
  }
  return paramString;
}

/** Computes MD5 signature and compares with the one from PayFast. */
export function validateSignature(
  params: Record<string, string | undefined>,
  passphrase: string | null
): boolean {
  const sigString = buildSignatureString(params, passphrase);
  const computed  = crypto.createHash("md5").update(sigString).digest("hex");
  return computed === params.signature;
}

/**
 * Server-to-server verification with PayFast.
 * Returns true if PayFast confirms the transaction is valid.
 */
export async function verifyWithPayFast(
  params: Record<string, string | undefined>,
  sandbox: boolean
): Promise<boolean> {
  const base = sandbox
    ? "https://sandbox.payfast.co.za"
    : "https://www.payfast.co.za";

  const body = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
    .join("&");

  try {
    const res = await fetch(`${base}/eng/query/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const text = await res.text();
    return text.trim() === "VALID";
  } catch {
    return false;
  }
}

/** Parses a URL-encoded form body into a flat Record. */
export function parseFormBody(raw: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const pair of raw.split("&")) {
    const idx = pair.indexOf("=");
    if (idx === -1) continue;
    const key = decodeURIComponent(pair.slice(0, idx).replace(/\+/g, " "));
    const val = decodeURIComponent(pair.slice(idx + 1).replace(/\+/g, " "));
    result[key] = val;
  }
  return result;
}
