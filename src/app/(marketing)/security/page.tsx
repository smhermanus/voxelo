import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security — Voxelo",
  description: "How Voxelo protects your data and infrastructure, including encryption, access controls, and POPIA compliance.",
};

export default function SecurityPage() {
  return (
    <>
      <div className="sp-hero">
        <div className="wrap">
          <Link href="/home" className="sp-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to home
          </Link>
          <p className="eyebrow">Trust &amp; Safety</p>
          <h1>Security</h1>
          <p>How we keep your data — and your callers&rsquo; data — safe.</p>
          <p className="sp-meta">Last reviewed: 1 June 2026</p>
        </div>
      </div>

      <div className="sp-body">
        <div className="wrap">
          <div className="sp-prose">

            <div className="sp-callout">
              Security is a first-class concern at Voxelo. Our platform handles sensitive caller conversations, so we apply layered defences at every level of the stack.
            </div>

            <h2>Infrastructure</h2>
            <p>All production infrastructure runs on <strong>South African-hosted servers</strong> (Xneelo), keeping your data within the Republic of South Africa and subject to POPIA. Our architecture uses separate compute and storage environments per tenant — no data co-mingling between customers.</p>
            <ul>
              <li>Physical data centres with 24/7 security, CCTV, and biometric access.</li>
              <li>Automated daily backups with 30-day point-in-time recovery.</li>
              <li>99.9% uptime SLA with automatic failover.</li>
              <li>DDoS protection and rate limiting at the network edge.</li>
            </ul>

            <h2>Encryption</h2>
            <ul>
              <li><strong>In transit:</strong> TLS 1.3 for all API, dashboard, and telephony traffic. Older TLS versions and RC4 are disabled.</li>
              <li><strong>At rest:</strong> AES-256 encryption for call recordings, transcripts, and all database backups.</li>
              <li><strong>Key management:</strong> Encryption keys are rotated quarterly and stored separately from encrypted data.</li>
            </ul>

            <h2>Access Controls</h2>
            <ul>
              <li>Role-based access control (RBAC) within each tenant &mdash; Owner, Admin, and Member roles.</li>
              <li>Multi-factor authentication (MFA) enforced for all Voxelo staff accounts.</li>
              <li>Staff access to production systems is logged, time-limited, and requires approval.</li>
              <li>Principle of least privilege: engineers only have access to systems required for their role.</li>
              <li>All access to tenant data by Voxelo staff is logged with reason, reviewer, and timestamp.</li>
            </ul>

            <h2>Call Recording Security</h2>
            <p>Call recordings are encrypted at rest and stored in isolated per-tenant storage buckets. Access is restricted to the tenant&rsquo;s authorised users. Pre-signed, time-limited URLs are used for playback — recordings are never served from a public URL. Tenants can configure automatic deletion after a set retention period (default: 90 days).</p>

            <h2>Application Security</h2>
            <ul>
              <li>All API endpoints are authenticated using short-lived JWT tokens via Clerk.</li>
              <li>Input validation and Zod schema enforcement on all external data (webhooks, forms, API).</li>
              <li>SQL injection protection via Prisma ORM parameterised queries.</li>
              <li>CSRF protection on all state-changing requests.</li>
              <li>Dependency scanning with automated alerts for known CVEs.</li>
              <li>Automated SAST scanning on every pull request.</li>
            </ul>

            <h2>POPIA Compliance</h2>
            <p>We have appointed an Information Officer as required by POPIA. Our data handling practices, sub-processor agreements, retention schedules, and breach notification procedures are designed to meet POPIA requirements. See our <Link href="/privacy">Privacy Policy</Link> and <Link href="/dpa">Data Processing Agreement</Link> for full details.</p>

            <h2>Incident Response</h2>
            <p>In the event of a confirmed data breach:</p>
            <ol>
              <li>We will contain the incident within 4 hours of discovery.</li>
              <li>We will notify affected tenants within 72 hours.</li>
              <li>We will report to the Information Regulator within 72 hours if the breach meets the threshold for mandatory reporting under POPIA.</li>
              <li>We will provide a full post-incident report within 14 days.</li>
            </ol>

            <h2>Penetration Testing</h2>
            <p>We conduct annual penetration testing by an independent third party. Results are remediated on a risk-prioritised basis. A summary report is available to Enterprise customers on request under NDA.</p>

            <h2>Responsible Disclosure</h2>
            <p>If you discover a security vulnerability in our platform, please report it responsibly to <a href="mailto:security@voxelo.co.za">security@voxelo.co.za</a>. We will acknowledge receipt within 2 business days, investigate promptly, and keep you informed. We do not take legal action against researchers who act in good faith.</p>
            <p>Please do not access, modify, or exfiltrate customer data as part of testing.</p>

          </div>
        </div>
      </div>
    </>
  );
}
