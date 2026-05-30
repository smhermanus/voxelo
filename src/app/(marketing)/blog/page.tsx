import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Voxelo",
  description: "Insights on AI receptionists, POPIA, voice technology, and running a smarter South African business.",
};

const POSTS = [
  {
    slug: "#",
    cat: "Industry",
    title: "How AI receptionists cut missed calls by 40% for South African SMEs",
    excerpt: "A missed call is worth more than most business owners realise. We analysed 6 months of call data across 120 tenants to understand what happens when every call is answered.",
    date: "22 May 2026",
    icon: '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
  },
  {
    slug: "#",
    cat: "Compliance",
    title: "POPIA and AI voice agents: what South African businesses need to know",
    excerpt: "Can an AI agent legally answer calls on behalf of your business? What disclosures do you need to make? We break down the POPIA requirements in plain English.",
    date: "14 May 2026",
    icon: '<path d="M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7z"/>',
  },
  {
    slug: "#",
    cat: "Operations",
    title: "Load-shedding-proof your front desk: why cloud beats landlines",
    excerpt: "Stage 6 load-shedding. Your office is dark. Your phone is dead. Your competitor answers. Here is how to make sure that never happens to you again.",
    date: "6 May 2026",
    icon: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  },
  {
    slug: "#",
    cat: "Product",
    title: "WhatsApp Business API + AI: how Vox sends confirmations mid-call",
    excerpt: "A caller says &ldquo;WhatsApp me the address&rdquo; and the message lands before they hang up. Here is the technical story behind how that works.",
    date: "28 Apr 2026",
    icon: '<path d="M5 6h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H10l-4 3v-3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>',
  },
  {
    slug: "#",
    cat: "Industry",
    title: "The hidden cost of hold music: what South African callers really think",
    excerpt: "We surveyed 500 South African consumers on their experiences with business phone systems. The results are uncomfortable reading for any business that uses hold queues.",
    date: "19 Apr 2026",
    icon: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 2"/>',
  },
  {
    slug: "#",
    cat: "Product",
    title: "Setting up your AI agent in 15 minutes: a step-by-step walkthrough",
    excerpt: "We filmed a real onboarding session — from account creation to live calls — with a Cape Town physiotherapy practice. Here is exactly what we did.",
    date: "10 Apr 2026",
    icon: '<path d="M4 18V9m5 9V5m5 13v-6m5 6V8"/>',
  },
];

export default function BlogPage() {
  return (
    <>
      <div className="sp-hero">
        <div className="wrap">
          <p className="eyebrow">Blog</p>
          <h1>Insights &amp; Updates</h1>
          <p>AI receptionists, POPIA, voice tech, and building a better-run South African business.</p>
        </div>
      </div>

      <div className="wrap" style={{ paddingBottom: 100 }}>
        <div className="blog-grid">
          {POSTS.map((post) => (
            <Link key={post.title} href={post.slug} className="blog-card" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
              <div className="blog-card-img">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4">
                  <g dangerouslySetInnerHTML={{ __html: post.icon }} />
                </svg>
              </div>
              <div className="blog-card-body">
                <span className="cat">{post.cat}</span>
                <h3>{post.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                <span className="date">{post.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
