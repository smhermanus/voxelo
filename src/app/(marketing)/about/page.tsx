import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Voxelo",
  description: "Voxelo builds AI receptionists for South African businesses — answering every call, 24/7, in the customer's own language.",
};

export default function AboutPage() {
  return (
    <>
      <div className="sp-hero">
        <div className="wrap">
          <Link href="/home" className="sp-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to home
          </Link>
          <p className="eyebrow">Company</p>
          <h1>Built for South African business.</h1>
          <p>Voxelo gives every business a 24/7 AI receptionist that never misses a call, handles load-shedding without blinking, and speaks to your customers the way they expect to be spoken to.</p>
        </div>
      </div>

      <div className="sp-body">
        <div className="wrap">
          <div className="sp-prose">

            <h2>Our Mission</h2>
            <p>A missed call is a missed opportunity. For the small law firm that can&rsquo;t afford a full-time receptionist, the medical practice that gets 80 calls before 9 am, or the plumbing company whose phone rings at 2 am during an emergency — every unanswered call costs real money and real trust.</p>
            <p>Voxelo exists to make enterprise-grade AI reception accessible to every South African business, not just the corporates with large contact-centre budgets. We believe that a sole trader in Polokwane deserves the same always-on, always-professional front desk as a JSE-listed company.</p>

            <h2>Why South Africa, Why Now</h2>
            <p>South Africa has 3.5 million small and medium businesses. Most of them handle customer communications with a single phone line and whoever is free to answer it. Load-shedding makes this worse — if the power is out, the phone is out, and the call goes unanswered.</p>
            <p>Voxelo runs in the cloud, so it answers calls through load-shedding, over holidays, and at 3 am on a Sunday. It is POPIA-compliant by design, hosted on South African infrastructure, and tuned to understand South African English accents and conversational patterns.</p>

            <h2>The Technology</h2>
            <p>Our AI agents combine three specialised models working in real time:</p>
            <ul>
              <li><strong>Speech recognition</strong> — Deepgram Nova-3 tuned for South African English (en-ZA), handling accents from Cape Town to Limpopo.</li>
              <li><strong>Language understanding</strong> — GPT-4o-mini determines intent, generates contextually accurate responses, and knows when to escalate to a human.</li>
              <li><strong>Voice synthesis</strong> — ElevenLabs Conversational v3 produces natural, warm speech that sounds like a real person, not a 1990s IVR.</li>
            </ul>
            <p>The entire stack is abstracted through a provider layer, so we can swap components as better models emerge — without tenants noticing any disruption.</p>

          </div>

          <div className="about-values">
            <div className="about-val">
              <div className="ic">
                <svg viewBox="0 0 24 24"><path d="M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7z"/></svg>
              </div>
              <h3>Privacy first</h3>
              <p>POPIA compliance is not a checkbox. Caller data stays in South Africa, encrypted, with retention controls you set.</p>
            </div>
            <div className="about-val">
              <div className="ic">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <h3>Reliability over hype</h3>
              <p>We promise 99.9% uptime, honest AI disclaimers, and human escalation when the AI reaches its limits.</p>
            </div>
            <div className="about-val">
              <div className="ic">
                <svg viewBox="0 0 24 24"><path d="M5 6h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H10l-4 3v-3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/></svg>
              </div>
              <h3>Simple by design</h3>
              <p>15-minute setup. No hardware. No IT department. Your existing number, your existing phone — just improved.</p>
            </div>
          </div>

          <div className="sp-prose" style={{ marginTop: 48 }}>
            <h2>Get in Touch</h2>
            <p>We are a small, focused team and we love talking to the businesses we serve. Whether you want a demo, have a question, or just want to tell us about your reception nightmares — we want to hear from you.</p>
            <p>
              <Link href="/contact" className="btn btn-primary" style={{ textDecoration: "none" }}>Contact us</Link>
              {" "}
              <Link href="/careers" style={{ marginLeft: 16, color: "var(--accent)" }}>We&rsquo;re hiring &rarr;</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
