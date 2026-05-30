import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/app/(marketing)/components/hero-section";
import { DemoSection } from "@/app/(marketing)/components/demo-section";
import { PricingSection } from "@/app/(marketing)/components/pricing-section";
import { CtaBookDemo } from "@/app/(marketing)/components/cta-book-demo";

export const metadata: Metadata = {
  title: "AI agents that handle every conversation",
  description:
    "Voxelo resolves customer conversations across chat, voice, and email — instantly, in your tone, for any industry.",
};

const FEATURES = [
  {
    icon: '<path d="M5 6h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H10l-4 3v-3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>',
    title: "Omnichannel",
    desc: "Chat, voice, and email handled by one agent with a single shared memory of the customer.",
  },
  {
    icon: '<circle cx="12" cy="8" r="3.2"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    title: "Seamless handoff",
    desc: "When it's truly human work, Vox routes to the right person with full context — no repeating.",
  },
  {
    icon: '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
    title: "Answers every call",
    desc: "24/7, no hold music, no voicemail. no extra teams/costs. Every caller answers instantly in 30+ languages.",
  },
  {
    icon: '<circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"/>',
    title: "Live in 15 minutes",
    desc: "Keep your existing number. Forward calls to us. No hardware, no tech visits.",
  },
  {
    icon: '<path d="M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7z"/>',
    title: "Secure & POPIA compliant",
    desc: "SA-hosted infrastructure, SOC 2, GDPR, and PII redaction built in. Encrypted data, caller consent on recording.",
  },
  {
    icon: '<path d="M12 4v3m0 10v3m8-8h-3M7 12H4m13.5-5.5-2 2m-7 7-2 2m11 0-2-2m-7-7-2-2"/><circle cx="12" cy="12" r="3"/>',
    title: "Takes action",
    desc: "Delivers messages via WhatsApp and email instantly, books appointments, updates records through your tools, and more.",
  },
];

const STATS = [
  { v: "100%",  l: "SA Hosted" },
  { v: "15min", l: "setup time" },
  { v: "0",  l: "missed calls" },
  { v: "24/7", l: "always on, every time zone" },
];

const INTEGRATIONS = [
  "Zendesk", "Salesforce", "Shopify", "Intercom", "Slack",
  "Twilio", "HubSpot", "Stripe", "Freshdesk", "Notion",
];

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="strip">
        <div className="wrap strip-inner">
          <span className="strip-label">Powering support for</span>
          <div className="strip-logos">
            <span>Lumen&nbsp;Goods</span>
            <span>Harbor&nbsp;Mutual</span>
            <span>Arc&nbsp;Bank</span>
            <span>Nova&nbsp;Mobile</span>
            <span>Wander</span>
            <span>Meridian</span>
          </div>
        </div>
      </section>

      <DemoSection />

      <section className="section" id="how">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">How it works</p>
            <h2>Live in days, not quarters.</h2>
          </div>
          <div className="steps">
            <div className="step">
              <span className="n">STEP 01</span>
              <h3>Connect your knowledge</h3>
              <p>Point Voxelo at your help center, docs, and past tickets. It learns your products, policies, and edge cases in minutes.</p>
              <div className="bar" />
            </div>
            <div className="step">
              <span className="n">STEP 02</span>
              <h3>Tune the voice</h3>
              <p>Set the tone, guardrails, and escalation rules. Vox sounds like your brand — never robotic, never off-script.</p>
              <div className="bar" />
            </div>
            <div className="step">
              <span className="n">STEP 03</span>
              <h3>Deploy everywhere</h3>
              <p>Drop the widget on your site, route your phone line, and connect email. One agent across every channel.</p>
              <div className="bar" />
            </div>
          </div>
        </div>
      </section>

      <section
        className="section"
        id="features"
        style={{ background: "var(--paper-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
      >
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">Capabilities</p>
            <h2>Everything a great agent does — at machine scale.</h2>
          </div>
          <div className="feat-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feat">
                <span className="ic">
                  <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: f.icon }} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section vox-stats">
        <div className="wrap">
          <div className="stats-grid">
            {STATS.map((s) => (
              <div key={s.l} className="stat">
                <div className="v">{s.v}</div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section vox-integrations">
        <div className="wrap">
          <div
            className="section-head"
            style={{ textAlign: "center", margin: "0 auto 44px" }}
          >
            <p className="eyebrow" style={{ justifyContent: "center" }}>
              Integrations
            </p>
            <h2>Plugs into the stack you already run.</h2>
          </div>
          <div className="int-grid">
            {INTEGRATIONS.map((name) => (
              <div key={name} className="int-chip">
                <span className="d" />
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />

      <section className="section cta-band" id="cta">
        <div className="wrap cta-inner">
          <h2>Ready to hand off the busywork?</h2>
          <p>See Voxelo answer your real customer questions in a 20-minute demo.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="#demo" className="btn btn-onink btn-lg">
              Talk to an agent
            </Link>
            <CtaBookDemo />
          </div>
        </div>
      </section>

    </>
  );
}
