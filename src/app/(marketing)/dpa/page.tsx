import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Processing Agreement — Voxelo",
  description: "Voxelo's Data Processing Agreement (DPA) governing the processing of personal data on behalf of customers.",
};

export default function DpaPage() {
  return (
    <>
      <div className="sp-hero">
        <div className="wrap">
          <Link href="/home" className="sp-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to home
          </Link>
          <p className="eyebrow">Legal</p>
          <h1>Data Processing Agreement</h1>
          <p>This DPA governs how Voxelo processes personal data on your behalf as a data processor under POPIA.</p>
          <p className="sp-meta">Last updated: 1 June 2026</p>
        </div>
      </div>

      <div className="sp-body">
        <div className="wrap">
          <div className="sp-prose">

            <div className="sp-callout">
              This Data Processing Agreement (&ldquo;DPA&rdquo;) forms part of the Voxelo <Link href="/terms">Terms of Service</Link> between you (&ldquo;Controller&rdquo;) and Voxelo (Pty) Ltd (&ldquo;Processor&rdquo;). By using the Voxelo platform you agree to this DPA.
            </div>

            <h2>1. Definitions</h2>
            <ul>
              <li><strong>Controller</strong> — the Tenant (business customer) who determines the purposes and means of processing personal data via the Voxelo platform.</li>
              <li><strong>Processor</strong> — Voxelo (Pty) Ltd, which processes personal data on behalf of the Controller.</li>
              <li><strong>Data Subject</strong> — callers, website visitors, or customers of the Controller whose personal data is processed.</li>
              <li><strong>Personal Information / Personal Data</strong> — as defined in POPIA: information relating to an identifiable, living natural person.</li>
              <li><strong>Processing</strong> — any operation performed on personal data, including collection, storage, transmission, and deletion.</li>
            </ul>

            <h2>2. Processing Description</h2>
            <h3>Subject matter</h3>
            <p>Voxelo processes personal data to operate the AI receptionist service on behalf of the Controller, including answering voice calls, handling chat and WhatsApp messages, generating transcripts, and routing communications.</p>
            <h3>Duration</h3>
            <p>Processing continues for the duration of the Controller&rsquo;s subscription and for up to 30 days after termination (for data retrieval), after which data is deleted.</p>
            <h3>Categories of data subjects</h3>
            <p>Callers, chat users, WhatsApp contacts, and any individual who contacts the Controller via channels routed through Voxelo.</p>
            <h3>Types of personal data processed</h3>
            <ul>
              <li>Voice recordings and transcripts.</li>
              <li>Chat and WhatsApp message content.</li>
              <li>Caller phone numbers (CLI), if provided by the carrier.</li>
              <li>Names, booking details, and other information shared voluntarily by data subjects.</li>
              <li>IP addresses and device identifiers (dashboard and web widget only).</li>
            </ul>

            <h2>3. Processor Obligations</h2>
            <p>Voxelo shall:</p>
            <ul>
              <li>Process personal data only on documented instructions from the Controller (as configured in the dashboard or as required by applicable law).</li>
              <li>Ensure that personnel authorised to process personal data are bound by confidentiality obligations.</li>
              <li>Implement and maintain appropriate technical and organisational security measures (see <Link href="/security">Security page</Link>).</li>
              <li>Notify the Controller without undue delay upon becoming aware of a personal data breach affecting Controller data.</li>
              <li>Delete or return all personal data upon termination of the agreement, at the Controller&rsquo;s choice.</li>
              <li>Make available all information necessary to demonstrate compliance and support audits.</li>
            </ul>

            <h2>4. Controller Obligations</h2>
            <p>The Controller warrants that:</p>
            <ul>
              <li>It has a lawful basis for processing personal data via the Voxelo platform.</li>
              <li>Data subjects have been given appropriate disclosure that their calls may be handled by an AI agent, and (if recording is enabled) that calls are recorded.</li>
              <li>It has implemented caller consent mechanisms where required by RICA and POPIA.</li>
              <li>It will not instruct Voxelo to process data in a manner that would violate applicable law.</li>
            </ul>

            <h2>5. Sub-processors</h2>
            <p>The Controller grants Voxelo a general authorisation to engage the following categories of sub-processor:</p>
            <ul>
              <li><strong>Twilio Inc.</strong> — voice call routing, SMS, and WhatsApp Business API.</li>
              <li><strong>Deepgram Inc.</strong> — automatic speech recognition / transcription.</li>
              <li><strong>OpenAI LLC</strong> — large language model inference.</li>
              <li><strong>ElevenLabs Inc.</strong> — text-to-speech voice synthesis.</li>
              <li><strong>Clerk Inc.</strong> — authentication and user identity.</li>
              <li><strong>Xneelo (Pty) Ltd</strong> — primary hosting infrastructure (South Africa).</li>
            </ul>
            <p>Voxelo will notify the Controller at least 30 days before adding or replacing a sub-processor. If the Controller objects on reasonable grounds, Voxelo will use reasonable efforts to make an alternative arrangement or permit termination without penalty.</p>

            <h2>6. International Data Transfers</h2>
            <p>Primary data storage is in South Africa. Some sub-processors (e.g., Twilio, Deepgram, OpenAI) may process data outside South Africa. Voxelo enters into Data Processing Agreements with all such sub-processors that include appropriate safeguards equivalent to those required by POPIA, including standard contractual clauses where applicable.</p>

            <h2>7. Audit Rights</h2>
            <p>Enterprise customers may request, no more than once per 12-month period, a summary of Voxelo&rsquo;s security audit results or, with 30 days&rsquo; notice and reasonable cost reimbursement, an on-site audit. Voxelo may satisfy audit requests by providing its most recent third-party audit reports under NDA.</p>

            <h2>8. Governing Law</h2>
            <p>This DPA is governed by the laws of the Republic of South Africa and POPIA. Disputes shall be resolved under the same jurisdiction as the <Link href="/terms">Terms of Service</Link>.</p>

            <h2>9. Contact</h2>
            <p>DPA enquiries: <a href="mailto:legal@voxelo.co.za">legal@voxelo.co.za</a></p>

          </div>
        </div>
      </div>
    </>
  );
}
