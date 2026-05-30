import Link from "next/link";
import type { Metadata } from "next";
import { CtaBookDemo } from "@/app/(marketing)/components/cta-book-demo";

export const metadata: Metadata = {
  title: "Contact — Voxelo",
  description: "Get in touch with the Voxelo team. We reply within one business day.",
};

export default function ContactPage() {
  return (
    <>
      <div className="sp-hero">
        <div className="wrap">
          <Link href="/home" className="sp-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to home
          </Link>
          <p className="eyebrow">Contact</p>
          <h1>We&rsquo;d love to hear from you.</h1>
          <p>Whether you want to see a demo, have a billing question, or just want to chat about AI receptionists — we reply within one business day.</p>
        </div>
      </div>

      <div className="sp-body">
        <div className="wrap">

          <div className="contact-grid">
            {/* Left — contact details */}
            <div>
              <div className="contact-item">
                <div className="ic">
                  <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <h3>General enquiries</h3>
                  <p><a href="mailto:info@voxelo.co.za">info@voxelo.co.za</a></p>
                </div>
              </div>

              <div className="contact-item">
                <div className="ic">
                  <svg viewBox="0 0 24 24"><path d="M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7z"/></svg>
                </div>
                <div>
                  <h3>Privacy &amp; legal</h3>
                  <p><a href="mailto:legal@voxelo.co.za">legal@voxelo.co.za</a></p>
                </div>
              </div>

              <div className="contact-item">
                <div className="ic">
                  <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <h3>Location</h3>
                  <p>Remote-first · South Africa</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="ic">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <div>
                  <h3>Support hours</h3>
                  <p>Monday – Friday, 08:00 – 18:00 SAST</p>
                  <p style={{ marginTop: 4 }}>Your AI agent answers 24/7 regardless of our hours.</p>
                </div>
              </div>
            </div>

            {/* Right — quick actions */}
            <div>
              <div style={{ background: "var(--accent)", borderRadius: 22, padding: "40px 36px", color: "#fff" }}>
                <h2 style={{ fontSize: 26, color: "#fff", marginBottom: 12 }}>Book a demo</h2>
                <p style={{ color: "rgba(255,255,255,.85)", fontSize: 16, marginBottom: 28 }}>
                  See Voxelo answer your real customer questions in a 20-minute walkthrough. No slides — just the live agent.
                </p>
                <CtaBookDemo />
              </div>

              <div style={{ marginTop: 20, background: "var(--paper-2)", border: "1px solid var(--line)", borderRadius: 22, padding: "32px 36px" }}>
                <h2 style={{ fontSize: 20, marginBottom: 10 }}>Already a customer?</h2>
                <p style={{ color: "var(--ink-soft)", fontSize: 15, marginBottom: 20 }}>
                  For support, log into your dashboard and use the in-app help, or email us at <a href="mailto:support@voxelo.co.za" style={{ color: "var(--accent)" }}>support@voxelo.co.za</a>.
                </p>
                <Link href="/sign-in" className="btn btn-ghost" style={{ textDecoration: "none" }}>
                  Go to dashboard
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
