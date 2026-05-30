import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Voxelo",
  description: "How Voxelo collects, uses, and protects your personal information in line with POPIA.",
};

export default function PrivacyPage() {
  return (
    <>
      <div className="sp-hero">
        <div className="wrap">
          <Link href="/home" className="sp-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to home
          </Link>
          <p className="eyebrow">Legal</p>
          <h1>Privacy Policy</h1>
          <p>How we collect, use, and protect your personal information.</p>
          <p className="sp-meta">Last updated: 1 June 2026 · Effective: 1 June 2026</p>
        </div>
      </div>

      <div className="sp-body">
        <div className="wrap">
          <div className="sp-prose">

            <h2>1. Who We Are</h2>
            <p>Voxelo (Pty) Ltd (&ldquo;<strong>Voxelo</strong>&rdquo;, &ldquo;<strong>we</strong>&rdquo;, &ldquo;<strong>us</strong>&rdquo;) operates an AI-powered receptionist platform that handles voice calls, chat, and messaging on behalf of businesses. Our registered office is in South Africa. This policy explains how we process personal information in accordance with the <strong>Protection of Personal Information Act, 2013 (POPIA)</strong>.</p>
            <p>Our Information Officer can be reached at <a href="mailto:privacy@voxelo.co.za">privacy@voxelo.co.za</a>.</p>

            <h2>2. Information We Collect</h2>
            <h3>From business customers (tenants)</h3>
            <ul>
              <li>Account details: name, work email address, company name, phone number.</li>
              <li>Billing details: billing address, VAT number. Card data is processed by PayFast — we never store raw card numbers.</li>
              <li>Configuration data: business name, hours, greeting scripts, call routing rules.</li>
              <li>Usage data: call volumes, session logs, feature usage, support tickets.</li>
            </ul>
            <h3>From callers and end-users of our customers&rsquo; AI agents</h3>
            <ul>
              <li>Voice recordings and transcripts of calls, if recording is enabled by the business.</li>
              <li>Chat messages and WhatsApp conversation history.</li>
              <li>Caller CLI (phone number), if provided by the telephony carrier.</li>
              <li>Any personal information shared voluntarily during the conversation (name, booking details, etc.).</li>
            </ul>
            <h3>Automatically collected</h3>
            <ul>
              <li>IP addresses, browser type, and device identifiers when you visit our website or dashboard.</li>
              <li>Cookies and similar technologies (see Section 8).</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <ul>
              <li>To provide and operate the Voxelo platform and AI agent services.</li>
              <li>To process payments and manage your subscription.</li>
              <li>To send service notifications, invoices, and essential communications.</li>
              <li>To improve accuracy and safety of our AI models (using anonymised or aggregated data only, unless you have opted in to full-data training).</li>
              <li>To comply with legal obligations including POPIA, tax law, and lawful requests from authorities.</li>
              <li>To detect and prevent fraud, abuse, and security incidents.</li>
            </ul>
            <div className="sp-callout">We do <strong>not</strong> sell your personal information to third parties. We do not use caller data for advertising or marketing unrelated to your account.</div>

            <h2>4. Data Storage and Location</h2>
            <p>All customer and caller data is stored on <strong>South African-based infrastructure</strong> (currently Xneelo). Data is encrypted at rest using AES-256 and in transit using TLS 1.3. This means your data remains within the Republic of South Africa and subject to POPIA.</p>
            <p>Certain third-party sub-processors (see Section 5) may process data outside South Africa. Where this occurs, we apply appropriate safeguards including standard contractual clauses and Data Processing Agreements.</p>

            <h2>5. Sub-processors</h2>
            <p>We share data with the following categories of sub-processors to deliver our service:</p>
            <ul>
              <li><strong>Twilio</strong> — telephony and WhatsApp message routing.</li>
              <li><strong>Deepgram</strong> — speech-to-text transcription (en-ZA).</li>
              <li><strong>OpenAI</strong> — large language model inference (GPT-4o-mini).</li>
              <li><strong>ElevenLabs</strong> — text-to-speech voice synthesis.</li>
              <li><strong>PayFast</strong> — payment processing (South African gateway).</li>
              <li><strong>Clerk</strong> — authentication and identity management.</li>
            </ul>
            <p>A full sub-processor list is available on request at <a href="mailto:privacy@voxelo.co.za">privacy@voxelo.co.za</a>.</p>

            <h2>6. Your Rights Under POPIA</h2>
            <p>As a data subject under POPIA you have the right to:</p>
            <ul>
              <li><strong>Access</strong> — request a copy of personal information we hold about you.</li>
              <li><strong>Correction</strong> — request correction of inaccurate or incomplete information.</li>
              <li><strong>Deletion</strong> — request deletion of your personal information, subject to legal retention requirements.</li>
              <li><strong>Objection</strong> — object to processing based on legitimate interests.</li>
              <li><strong>Restriction</strong> — request that we restrict processing in certain circumstances.</li>
              <li><strong>Complaint</strong> — lodge a complaint with the <a href="https://www.justice.gov.za/inforeg/" target="_blank" rel="noopener noreferrer">Information Regulator of South Africa</a>.</li>
            </ul>
            <p>To exercise any of these rights, contact <a href="mailto:privacy@voxelo.co.za">privacy@voxelo.co.za</a>. We will respond within 30 days.</p>

            <h2>7. Data Retention</h2>
            <p>We retain account data for as long as your subscription is active, plus a minimum of 3 years for financial records as required by South African tax law. Call recordings and transcripts are retained for the period set by the business customer in their dashboard (default: 90 days). You may request earlier deletion at any time.</p>

            <h2>8. Cookies</h2>
            <p>Our website uses essential cookies required for authentication and security, and optional analytics cookies (PostHog, anonymised). You may disable non-essential cookies via your browser settings. We do not use third-party advertising cookies.</p>

            <h2>9. Changes to This Policy</h2>
            <p>We may update this policy from time to time. We will notify active subscribers by email at least 14 days before material changes take effect. Continued use of the service after that date constitutes acceptance.</p>

            <h2>10. Contact</h2>
            <p>Questions about this policy? Contact our Information Officer at <a href="mailto:privacy@voxelo.co.za">privacy@voxelo.co.za</a> or visit our <Link href="/contact">Contact page</Link>.</p>

          </div>
        </div>
      </div>
    </>
  );
}
