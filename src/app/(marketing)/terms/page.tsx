import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Voxelo",
  description: "Terms and conditions governing use of the Voxelo AI receptionist platform.",
};

export default function TermsPage() {
  return (
    <>
      <div className="sp-hero">
        <div className="wrap">
          <Link href="/home" className="sp-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to home
          </Link>
          <p className="eyebrow">Legal</p>
          <h1>Terms of Service</h1>
          <p>The rules that govern your use of the Voxelo platform.</p>
          <p className="sp-meta">Last updated: 1 June 2026 · Governing law: Republic of South Africa</p>
        </div>
      </div>

      <div className="sp-body">
        <div className="wrap">
          <div className="sp-prose">

            <h2>1. Acceptance</h2>
            <p>By creating an account or using the Voxelo platform you agree to these Terms of Service (&ldquo;Terms&rdquo;). If you are accepting on behalf of a company, you represent that you have authority to bind that company. If you do not agree, do not use the service.</p>

            <h2>2. The Service</h2>
            <p>Voxelo provides a cloud-based AI receptionist platform that answers voice calls, chat messages, and email on behalf of subscriber businesses (&ldquo;Tenants&rdquo;). The service includes voice synthesis, speech recognition, large-language-model inference, WhatsApp Business API access, and a management dashboard.</p>
            <p>We reserve the right to modify, suspend, or discontinue any feature of the service at any time with reasonable notice. We will not make material reductions to core functionality without at least 30 days&rsquo; notice.</p>

            <h2>3. Account Registration</h2>
            <ul>
              <li>You must provide accurate and complete registration information.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must be at least 18 years of age and legally able to enter into contracts in South Africa.</li>
              <li>Each account represents a single Tenant. Sub-accounts for team members are permitted within a single Tenant.</li>
            </ul>

            <h2>4. Subscriptions and Payment</h2>
            <p>Subscriptions are billed monthly or annually in South African Rand (ZAR) or US Dollars (USD) as selected at checkout. Payments are processed via PayFast (ZAR) or Stripe (USD). All prices exclude VAT.</p>
            <ul>
              <li><strong>Monthly plans</strong> renew automatically on the same day each month.</li>
              <li><strong>Annual plans</strong> are invoiced in full at the start of each annual term.</li>
              <li><strong>Overage charges</strong> for minutes exceeding your plan allowance are billed in arrears.</li>
              <li>Invoices unpaid after 14 days may result in service suspension.</li>
            </ul>

            <h2>5. Free Trial</h2>
            <p>New accounts may access a free trial period of 7&ndash;14 days as advertised at sign-up. No credit card is required for the trial. At trial end, you must select a paid plan to continue using the service. Trial accounts are subject to usage limits.</p>

            <h2>6. Acceptable Use</h2>
            <p>You may not use Voxelo to:</p>
            <ul>
              <li>Engage in unsolicited marketing calls or SMS spam.</li>
              <li>Impersonate individuals, organisations, or government bodies without their consent.</li>
              <li>Process calls in jurisdictions where AI voice agents are prohibited without appropriate disclosure.</li>
              <li>Store or transmit unlawful, defamatory, or fraudulent content.</li>
              <li>Attempt to reverse-engineer, decompile, or extract our AI models.</li>
              <li>Resell or sublicense access to the platform without written permission.</li>
            </ul>

            <h2>7. Call Recording and Compliance</h2>
            <p>If you enable call recording, you are responsible for complying with the <strong>Regulation of Interception of Communications and Provision of Communication-Related Information Act, 2002 (RICA)</strong> and any other applicable law. Voxelo provides a configurable caller disclosure announcement; it is your responsibility to ensure it is appropriate for your jurisdiction and use case.</p>

            <h2>8. AI Accuracy Disclaimer</h2>
            <p>Voxelo&rsquo;s AI agents are designed to be helpful and accurate, but they are not infallible. We do not warrant that the AI will always provide correct, complete, or up-to-date information. You should not rely solely on the AI for safety-critical, medical, legal, or financial decisions. Voxelo accepts no liability for damages arising from inaccurate AI responses.</p>

            <h2>9. Intellectual Property</h2>
            <p>You retain ownership of your business data, call recordings, and configuration content. You grant Voxelo a limited licence to use this data to provide the service. Voxelo retains all rights to its platform, models, and software. Feedback you provide may be used to improve the service.</p>

            <h2>10. Cancellation and Termination</h2>
            <p>You may cancel your subscription at any time from the dashboard. Cancellation takes effect at the end of the current billing period; no partial refunds are issued for unused time. Upon termination, your data is retained for 30 days then deleted, unless a longer retention period is required by law. You may export your data at any time before deletion.</p>
            <p>We may terminate your account immediately for material breach of these Terms, including Acceptable Use violations.</p>

            <h2>11. Limitation of Liability</h2>
            <p>To the maximum extent permitted by South African law, Voxelo&rsquo;s total liability for any claim arising from these Terms is limited to the amount you paid in the 3 months preceding the claim. We are not liable for indirect, incidental, or consequential damages.</p>

            <h2>12. Governing Law</h2>
            <p>These Terms are governed by the laws of the Republic of South Africa. Any disputes shall be subject to the exclusive jurisdiction of the courts of the Western Cape High Court, Cape Town.</p>

            <h2>13. Contact</h2>
            <p>Questions about these Terms? Email <a href="mailto:legal@voxelo.co.za">legal@voxelo.co.za</a> or visit our <Link href="/contact">Contact page</Link>.</p>

          </div>
        </div>
      </div>
    </>
  );
}
