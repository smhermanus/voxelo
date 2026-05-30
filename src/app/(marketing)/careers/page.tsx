import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers — Voxelo",
  description: "Join Voxelo and help build the future of business communication for South Africa.",
};

const ROLES = [
  {
    title: "AI/ML Engineer",
    dept: "Engineering",
    location: "Remote · SA",
    type: "Full-time",
    desc: "Own the voice pipeline — speech recognition, LLM orchestration, TTS, and the LiveKit agent layer. Python + TypeScript. Experience with real-time audio processing required.",
  },
  {
    title: "Full-Stack Engineer (Next.js)",
    dept: "Engineering",
    location: "Remote · SA",
    type: "Full-time",
    desc: "Build the tenant dashboard and public platform. Next.js 15 App Router, tRPC, Prisma, Tailwind. You care about performance, accessibility, and clean abstractions.",
  },
  {
    title: "Sales Executive — SME",
    dept: "Sales",
    location: "Cape Town or Joburg",
    type: "Full-time",
    desc: "Own a territory of South African SMEs across healthcare, legal, and retail. You understand the challenges of small business owners and can demo the product confidently.",
  },
  {
    title: "Customer Success Manager",
    dept: "Customer Success",
    location: "Remote · SA",
    type: "Full-time",
    desc: "Own the post-onboarding journey. Help tenants set up their agents, resolve issues, and expand usage. You are empathetic, organised, and love digging into data.",
  },
];

export default function CareersPage() {
  return (
    <>
      <div className="sp-hero">
        <div className="wrap">
          <Link href="/home" className="sp-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to home
          </Link>
          <p className="eyebrow">Careers</p>
          <h1>Help us answer every call.</h1>
          <p>We are a small team solving a big problem for South African businesses. Remote-first, fast-moving, and serious about craft.</p>
        </div>
      </div>

      <div className="sp-body">
        <div className="wrap">
          <div className="sp-prose">
            <h2>Why Voxelo</h2>
            <p>We are building infrastructure that will handle millions of customer conversations for South African businesses — from the sole trader in Durban to the multi-branch medical group in Gauteng. The market is large, under-served, and ready.</p>
            <p>We move quickly, keep the team lean, and give people real ownership over their domains. Everyone talks to customers. Everyone ships.</p>

            <h2>Benefits</h2>
            <ul>
              <li><strong>Remote-first</strong> — work from anywhere in South Africa (or the world, for engineering roles).</li>
              <li><strong>Flexible hours</strong> — we care about output, not attendance.</li>
              <li><strong>Equipment budget</strong> — R15,000 home-office setup allowance.</li>
              <li><strong>Learning budget</strong> — R8,000/year for courses, books, and conferences.</li>
              <li><strong>Equity</strong> — meaningful option grants for early hires.</li>
              <li><strong>Medical aid contribution</strong> — 50% of Discovery or Momentum premium.</li>
            </ul>
          </div>

          <h2 style={{ fontSize: 21, margin: "44px 0 20px" }}>Open Roles</h2>
          {ROLES.map((role) => (
            <div key={role.title} className="role-card">
              <div>
                <h3>{role.title}</h3>
                <div className="tags">
                  <span className="tag">{role.dept}</span>
                  <span className="tag">{role.location}</span>
                  <span className="tag">{role.type}</span>
                </div>
                <p style={{ fontSize: 14.5, color: "var(--ink-soft)", margin: "10px 0 0", maxWidth: "60ch" }}>{role.desc}</p>
              </div>
              <a
                href={`mailto:careers@voxelo.co.za?subject=Application: ${role.title}`}
                className="btn btn-ghost apply-btn"
              >
                Apply
              </a>
            </div>
          ))}

          <div className="sp-prose" style={{ marginTop: 48 }}>
            <h2>Don&rsquo;t see your role?</h2>
            <p>We are always interested in exceptional people. Send your CV and a short note on what you would build to <a href="mailto:careers@voxelo.co.za">careers@voxelo.co.za</a>.</p>
          </div>
        </div>
      </div>
    </>
  );
}
