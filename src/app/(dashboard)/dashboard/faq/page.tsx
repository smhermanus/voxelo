"use client";

import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sections = [
  {
    id: "setup",
    title: "1. Client Setup Process",
    badge: "Onboarding",
    badgeColor: "bg-blue-100 text-blue-700",
    items: [
      {
        q: "What is the end-to-end process for setting up a client?",
        a: `It depends on the onboarding tier. Always identify the tier first.

Tier 1 — Self-service (~80% of clients): Client signs up → guided wizard (business info, greeting, hours, transfer numbers, FAQ text, voice) → Twilio number provisioned → call forwarding activated → test call → live. ~15 minutes.

Tier 2 — Assisted: Everything in Tier 1 + PDF/DOCX ingested into RAG knowledge base + routing rules configured. ~1 working day.

Tier 3 — Custom database integration: Separate scoped engagement. Read-only function-calling API, caller identity verification, audit logging, adversarial testing, monitored soft launch. 1–4 weeks. Quoted separately (R15,000–R25,000+).`,
      },
      {
        q: "How long does setup take?",
        a: "Tier 1: ~15 minutes. Tier 2: ~1 working day. Tier 3: 1–4 weeks. Dedicated +27 number (if requested): 3–10 business days for ICASA Regulatory Bundle approval — but the client goes live immediately via temporary forwarding, and we swap the dedicated number in behind the scenes with no downtime.",
      },
      {
        q: "On-site or remote?",
        a: "100% remote for every tier. No site visits, no hardware. Wizard is browser-based; forwarding is self-activated; Tier 2/3 discovery is over video call + screen share. This is a core scalability advantage — no field team, no travel cost, national (and cross-border) reach.",
      },
    ],
  },
  {
    id: "numbers",
    title: "2. Phone Number Provisioning",
    badge: "Operations",
    badgeColor: "bg-purple-100 text-purple-700",
    items: [
      {
        q: "What are the three phone paths and when do we use each?",
        a: `Path C — Call forwarding (DEFAULT): Client keeps existing number, forwards to a Twilio number we provision instantly. No ICASA bundle wait. This is what makes the 15-minute promise real. Use for nearly everyone.

Path A — New +27 number via Twilio: Requires ICASA Regulatory Bundle (3–10 business days). Use only when client specifically wants a dedicated SA number. Give them Path C in the meantime.

Path B — Port existing number into Twilio: 2–6 weeks, requires LOA from current carrier, brief downtime. Enterprise/advanced only.`,
      },
      {
        q: "What does the Regulatory Bundle need?",
        a: "CIPC company registration (CoR/CK), proof of business address (<3 months old), director/representative ID or passport, use-case description. We submit on the client's behalf via Twilio — this is a value-add; small businesses don't know how to navigate it.",
      },
      {
        q: "What about Caller ID on transfers?",
        a: "Configure SIP to pass through the original caller's number to staff, not the Twilio number. Verify this during setup — staff want to see who's actually calling.",
      },
      {
        q: "Any alternative to Twilio for SA numbers?",
        a: "Worth exploring SA telecom resellers (Vox, Webafrica, RSAweb, Internet Solutions) who are ICASA-licensed and can sometimes provision +27 numbers in 24–48h. Trade-off: manual SIP trunk integration. Potential differentiator for clients who need a dedicated SA number fast.",
      },
    ],
  },
  {
    id: "capability",
    title: "3. Capability & Quality",
    badge: "Technical",
    badgeColor: "bg-green-100 text-green-700",
    items: [
      {
        q: "What does the AI do? (full feature checklist)",
        a: "Answer & greet 24/7 → intent detection + routing → urgency detection → message taking with read-back confirmation → multi-channel delivery (SMS/email/WhatsApp) → appointment booking with confirmations + reminders → FAQ via RAG → call screening (spam, VIP, blocklist) → warm transfer with context → no-answer fallback → emergency escalation → after-hours handling → morning summary digest.",
      },
      {
        q: "What happens if the AI can't answer?",
        a: "By design it does NOT hallucinate. RAG retrieval with confidence thresholds; below threshold it offers to take a message or transfers to a human. Escalation rules are configurable per tenant. For Tier 3 DB lookups, failed identity verification → no disclosure, offer human/message.",
      },
      {
        q: "How are SA accents handled?",
        a: "Deepgram Nova-3 STT (en-ZA) for recognition; ElevenLabs v3 Conversational with Expressive Mode for natural, tone-adaptive speech. Always test on real SA English during onboarding; fall back to alternate STT if accuracy is insufficient for a specific client.",
      },
      {
        q: "What WhatsApp functionality is actually supported?",
        a: "Two layers. Layer 1 (notifications: system → owner) via official WhatsApp Business API, independent of voice vendor. Layer 2 (conversational: customer ↔ AI) via ElevenLabs Agents WhatsApp, including 'send WhatsApp mid phone-call' tool. COMPLIANCE: each tenant must use their OWN WhatsApp Business account; product is positioned as 'AI receptionist' (auxiliary to a real business), never a general-purpose chatbot — this keeps us inside Meta's 15 Jan 2026 policy.",
      },
    ],
  },
  {
    id: "pricing",
    title: "4. Pricing & Commercial",
    badge: "Commercial",
    badgeColor: "bg-yellow-100 text-yellow-700",
    items: [
      {
        q: "How is it priced?",
        a: "Monthly subscription tiers (ZAR via PayFast). Benchmark: BizAI's AI receptionist starts ~R999/mo; their platform tiers run R499–R5,499/mo. Position our hero product (the voice receptionist) competitively. Free trial to convert. Tier 3 integrations, dedicated SA numbers, and custom work are separate one-off / add-on fees.",
      },
      {
        q: "What's the margin reality?",
        a: "At ~50 tenants on R999/mo = ~R50k MRR. Operating cost (hosting + API/voice) roughly R13.5k–21.5k/mo on the hybrid voice model → 57–73% gross margin, improving with scale as hosting/GPU costs stay fixed. 100% ElevenLabs at scale destroys margin — hence the self-hosted Chatterbox path in production.",
      },
      {
        q: "What's the cancellation policy?",
        a: "Month-to-month standard plan, no long lock-in. On cancellation, forwarding reverts to the client's own phone. Offer data export/deletion (POPIA). Capture churn reason.",
      },
    ],
  },
  {
    id: "compliance",
    title: "5. Data, Security & Compliance",
    badge: "Legal",
    badgeColor: "bg-orange-100 text-orange-700",
    items: [
      {
        q: "What's our POPIA posture?",
        a: "SA data residency (Xneelo Cape Town / HOSTAFRICA JHB), encryption at rest (AES-256) and in transit (TLS 1.3), consent on recording, per-tenant data isolation, export + deletion tooling, configurable retention. Ensure DPAs with ElevenLabs, Twilio, hosting providers.",
      },
      {
        q: "What's the Meta WhatsApp policy we need to comply with?",
        a: "General-purpose AI chatbots are banned (as of 15 Jan 2026); business automation where AI is auxiliary (support, bookings, FAQs, notifications) is permitted. We're compliant because each tenant serves its own customers via its own WABA. Never market as 'chat with our AI.' Monitor antitrust challenges but build as if the policy is permanent. Use only official WhatsApp Business API — never unofficial bots.",
      },
      {
        q: "How does multi-tenant isolation work technically?",
        a: "Every tenant-scoped table has tenantId; every Prisma query filters by it. There's a test proving cross-tenant access fails. Never expose one caller's/tenant's data to another — POPIA breach risk.",
      },
    ],
  },
  {
    id: "infrastructure",
    title: "6. Reliability & Infrastructure",
    badge: "Infra",
    badgeColor: "bg-teal-100 text-teal-700",
    items: [
      {
        q: "What's our load-shedding answer (and the upsell)?",
        a: "The platform is cloud-hosted, so the AI keeps answering during the client's power outages — provided calls are forwarded. Pitch: configure 'forward when unreachable/no-answer' so the AI catches calls precisely when the client's own line is down. This is one of the strongest SA-specific selling points.",
      },
      {
        q: "What's our uptime / resilience story?",
        a: "Xneelo: dual hot-swap PSU, hardware RAID 5 + BBU, ~99.9% uptime SLA; Cloudflare in front (DDoS, CDN, failover page); daily offsite backups to R2. For production HA, optional second server + load balancer (add-on).",
      },
      {
        q: "How many concurrent calls can we handle?",
        a: "AI handles many simultaneous calls — no engaged tone. Key differentiator vs a human receptionist. Watch GPU concurrency limits in the self-hosted phase; ElevenLabs scales on their side.",
      },
      {
        q: "What about cold starts?",
        a: "Avoid serverless GPU (Modal) for production real-time voice due to 10–30s cold starts. HOSTAFRICA dedicated GPU stays warm. For the demo, ElevenLabs managed = no cold-start concern.",
      },
    ],
  },
  {
    id: "sales",
    title: "7. Sales Positioning",
    badge: "Sales",
    badgeColor: "bg-pink-100 text-pink-700",
    items: [
      {
        q: "What are our core positioning points?",
        a: `Speed: "AI receptionist live in 15 minutes" (Path C). Competitors run multi-week consultations.
Local: SA-hosted, POPIA-compliant, Rand billing, SA English/accents, WhatsApp-first.
Compliance as a weapon: "POPIA AND WhatsApp-Business-policy compliant" — most competitors don't know about the Jan 2026 policy.
Never miss a call: 24/7, concurrent calls, works through load-shedding.
Future-proof: voice provider abstraction means we adopt the newest/best voice AI via config, not rebuilds.`,
      },
      {
        q: "What are the demo showstoppers?",
        a: "The instant WhatsApp-on-message moment; the 'frustrated customer' tone-shift call; the phone→WhatsApp mid-call handoff. These three moments consistently trigger the 'wow, I didn't know it could do that' reaction.",
      },
    ],
  },
  {
    id: "limitations",
    title: "8. Known Limitations (Internal Only)",
    badge: "Honesty",
    badgeColor: "bg-red-100 text-red-700",
    items: [
      {
        q: "What do we need to be honest about with clients?",
        a: `• ElevenLabs v3 Conversational does not preserve professional voice clones yet — use library voices.
• "Send WhatsApp mid-call" tool currently supports body parameters only (no rich attachments yet).
• Tier 3 DB integration is genuinely 1–4 weeks — do not let sales promise "instant" for database lookups.
• Dedicated +27 numbers genuinely take 3–10 business days — set expectations; lead with forwarding.
• Voice AI changes ~monthly — re-verify "best provider" each major build phase; the abstraction layer is the insurance.`,
      },
    ],
  },
];

export default function InternalFaqPage() {
  return (
    <div className="flex flex-col min-h-0">
      <PageHeader title="Internal FAQ" />
      <div className="p-6 max-w-4xl space-y-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge variant="destructive" className="text-xs">Internal only</Badge>
              <Badge variant="outline" className="text-xs">Not for client distribution</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Sales, onboarding, and support reference. Consistent answers, accurate technical
              detail, and sales positioning.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="outline" size="sm">
              <a href="/documents/FAQ-Internal.pdf" download>
                <Download className="mr-2 size-4" /> Download PDF
              </a>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/faq" target="_blank">
                <ExternalLink className="mr-2 size-4" /> Client FAQ
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick nav */}
        <div className="flex flex-wrap gap-2 pb-6">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80 ${s.badgeColor}`}
            >
              {s.title.split(". ")[1] ?? s.title}
            </a>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.id} id={section.id} className="scroll-mt-6">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="font-semibold">{section.title}</h2>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${section.badgeColor}`}>
                  {section.badge}
                </span>
              </div>
              <Accordion type="single" collapsible className="border rounded-xl overflow-hidden divide-y">
                {section.items.map((item, i) => (
                  <AccordionItem key={i} value={`${section.id}-${i}`} className="border-0 px-4">
                    <AccordionTrigger className="text-sm font-medium text-left py-3.5 hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 whitespace-pre-line">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
