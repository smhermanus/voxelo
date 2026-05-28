# Internal FAQ & Onboarding Reference
## AI Receptionist SaaS — Team Operations Guide

**Audience:** Internal team (sales, onboarding, support). Not for client distribution.
**Purpose:** Consistent answers, accurate technical/operational detail, and sales positioning.

---

## 1. Client Setup Process

**Q: What is the end-to-end process for setting up a client?**

It depends on the onboarding tier. Always identify the tier first.

**Tier 1 — Self-service (the default, ~80% of clients):**
1. Client signs up and creates an account (Clerk auth; their org becomes a tenant).
2. Guided wizard collects: business name, AI greeting, business hours, transfer/escalation numbers, FAQ/services text, voice selection.
3. We provision a Twilio number programmatically (instant — non-+27 number, no regulatory bundle needed).
4. Client activates call forwarding from their existing number to the Twilio number (carrier dial code or telecom portal).
5. Client makes a test call; dashboard confirms the forwarded call landed.
6. Live. ~15 minutes total.

**Tier 2 — Assisted (clients with document knowledge bases or complex routing):**
- Everything in Tier 1, plus: ingest PDF/DOCX into the RAG knowledge base, configure routing rules, run test calls together on a video call.
- ~1 working day.

**Tier 3 — Custom database integration (highest-value clients):**
- Separate scoped engagement. Build a read-only function-calling API to their DB, add caller identity verification, audit logging, adversarial testing, monitored soft launch.
- 1–4 weeks. Quoted and invoiced separately (from R15,000–R25,000+).

**Q: How long does setup take?**
- Tier 1: ~15 minutes. Tier 2: ~1 working day. Tier 3: 1–4 weeks.
- Dedicated +27 number (if requested): 3–10 business days for ICASA Regulatory Bundle approval — but the client goes live immediately via temporary forwarding, and we swap the dedicated number in behind the scenes with no downtime.

**Q: On-site or remote?**
- 100% remote for every tier. No site visits, no hardware. Wizard is browser-based; forwarding is self-activated; Tier 2/3 discovery is over video call + screen share. This is a core scalability advantage — no field team, no travel cost, national (and cross-border) reach.

---

## 2. Phone Number Provisioning (the operational crux)

**Q: What are the three phone paths and when do we use each?**

- **Path C — Call forwarding (DEFAULT).** Client keeps their existing number, forwards to a Twilio number we provision instantly. No ICASA bundle wait. This is what makes the 15-minute promise real. Caller never sees the Twilio number. Use for nearly everyone.
- **Path A — New +27 number via Twilio.** Requires ICASA Regulatory Bundle (CIPC docs, proof of address, director ID, use-case). 3–10 business days. Use only when the client specifically wants a dedicated SA number. Give them Path C forwarding in the meantime so they're live immediately.
- **Path B — Port existing number into Twilio.** 2–6 weeks, requires LOA from current carrier, brief downtime during cutover. Enterprise/advanced only — most SMEs won't accept the disruption.

**Q: What does the Regulatory Bundle need?**
- CIPC company registration (CoR/CK), proof of business address (<3 months old), director/representative ID or passport, use-case description ("AI virtual receptionist for inbound business calls"). We submit on the client's behalf via Twilio — this is a value-add; small businesses don't know how to navigate it.

**Q: Caller ID on transfers?**
- Configure SIP to pass through the original caller's number to staff, not the Twilio number. Verify this during setup — staff want to see who's actually calling.

**Q: Alternative to Twilio for SA numbers?**
- Worth exploring SA telecom resellers (Vox, Webafrica, RSAweb, Internet Solutions) who are ICASA-licensed and can sometimes provision +27 numbers in 24–48h. Trade-off: manual SIP trunk integration. Potential differentiator for clients who need a dedicated SA number fast.

---

## 3. Capability & Quality

**Q: What does the AI do? (feature checklist)**
Answer & greet 24/7; intent detection + routing; urgency detection; message taking with read-back confirmation; multi-channel delivery (SMS/email/WhatsApp); appointment booking (Cal.com / Google Calendar) with confirmations + reminders; FAQ via RAG; call screening (spam, VIP, blocklist); warm transfer with context; no-answer fallback; emergency escalation; after-hours handling; morning summary digest.

**Q: What happens if the AI can't answer?**
- By design it does NOT hallucinate. RAG retrieval with confidence thresholds; below threshold it offers to take a message or transfers to a human. Escalation rules are configurable per tenant. For Tier 3 DB lookups, failed identity verification → no disclosure, offer human/message.

**Q: SA accents?**
- Deepgram Nova-3 STT (en-ZA) for recognition; ElevenLabs v3 Conversational with Expressive Mode for natural, tone-adaptive speech. Always test on real SA English during onboarding; fall back to alternate STT if accuracy is insufficient for a specific client.

**Q: WhatsApp — what's actually supported?**
- Two layers. Layer 1 (notifications: system → owner) via official WhatsApp Business API, independent of voice vendor. Layer 2 (conversational: customer ↔ AI) via ElevenLabs Agents WhatsApp, including "send WhatsApp mid phone-call" tool. COMPLIANCE: each tenant must use their OWN WhatsApp Business account; product is positioned as "AI receptionist" (auxiliary to a real business), never a general-purpose chatbot — this keeps us inside Meta's 15 Jan 2026 policy.

---

## 4. Pricing & Commercial

**Q: How is it priced?**
- Monthly subscription tiers (ZAR via PayFast). Benchmark: BizAI's AI receptionist starts ~R999/mo; their platform tiers run R499–R5,499/mo. Position our hero product (the voice receptionist) competitively. Free trial to convert.
- Tier 3 integrations, dedicated SA numbers, and custom work are separate one-off / add-on fees — never bundle multi-week integration into a R999/mo plan (that's 30+ months to break even).

**Q: Margin reality?**
- At ~50 tenants on R999/mo = ~R50k MRR. Operating cost (hosting + API/voice) roughly R13.5k–21.5k/mo on the hybrid voice model → 57–73% gross margin, improving with scale as hosting/GPU costs stay fixed. 100% ElevenLabs at scale destroys margin — hence the self-hosted Chatterbox path in production.

**Q: Cancellation?**
- Month-to-month standard plan, no long lock-in. On cancellation, forwarding reverts to the client's own phone. Offer data export/deletion (POPIA). Capture churn reason.

---

## 5. Data, Security, Compliance

**Q: POPIA posture?**
- SA data residency (Xneelo Cape Town / HOSTAFRICA JHB), encryption at rest (AES-256) and in transit (TLS 1.3), consent on recording, per-tenant data isolation, export + deletion tooling, configurable retention. Ensure DPAs with ElevenLabs, Twilio, hosting providers.

**Q: Meta WhatsApp policy (15 Jan 2026)?**
- General-purpose AI chatbots are banned; business automation where AI is auxiliary (support, bookings, FAQs, notifications) is permitted. We're compliant because each tenant serves its own customers via its own WABA. Never market as "chat with our AI." Monitor antitrust challenges (Brazil/EU/Italy) but build as if the policy is permanent. Use only official WhatsApp Business API — never unofficial bots.

**Q: Multi-tenant isolation?**
- Every tenant-scoped table has tenantId; every query filters by it. There's a test proving cross-tenant access fails. Never expose one caller's/tenant's data to another — POPIA breach risk.

---

## 6. Reliability & Infrastructure

**Q: Load-shedding answer (and the upsell)?**
- The platform is cloud-hosted, so the AI keeps answering during the client's power outages — provided calls are forwarded. Pitch: configure "forward when unreachable/no-answer" so the AI catches calls precisely when the client's own line is down. This is one of the strongest SA-specific selling points.

**Q: Uptime / our own resilience?**
- Xneelo: dual hot-swap PSU, hardware RAID 5 + BBU, ~99.9% uptime SLA; Cloudflare in front (DDoS, CDN, failover page); daily offsite backups to R2. For production HA, optional second server + load balancer (add-on).

**Q: Concurrent calls?**
- AI handles many simultaneous calls — no engaged tone. Key differentiator vs a human receptionist. (Watch GPU concurrency limits in the self-hosted phase; ElevenLabs scales on their side.)

**Q: Cold starts?**
- Avoid serverless GPU (Modal) for production real-time voice due to 10–30s cold starts. HOSTAFRICA dedicated GPU stays warm. For the demo, ElevenLabs managed = no cold-start concern.

---

## 7. Sales Positioning Cheatsheet

- **Speed:** "AI receptionist live in 15 minutes" (Path C). Competitors run multi-week consultations.
- **Local:** SA-hosted, POPIA-compliant, Rand billing, SA English/accents, WhatsApp-first.
- **Compliance as a weapon:** "POPIA AND WhatsApp-Business-policy compliant" — most competitors don't know about the Jan 2026 policy.
- **Never miss a call:** 24/7, concurrent calls, works through load-shedding.
- **Future-proof:** voice provider abstraction means we adopt the newest/best voice AI via config, not rebuilds.
- **Demo showstoppers:** the instant WhatsApp-on-message moment; the "frustrated customer" tone-shift call; the phone→WhatsApp mid-call handoff.

---

## 8. Known Limitations / Honesty Notes (internal only)

- ElevenLabs v3 Conversational does not preserve professional voice clones yet — use library voices.
- "Send WhatsApp mid-call" tool currently supports body parameters only (no rich attachments yet).
- Tier 3 DB integration is genuinely 1–4 weeks — do not let sales promise "instant" for database lookups.
- Dedicated +27 numbers genuinely take 3–10 business days — set expectations; lead with forwarding.
- Voice AI changes ~monthly — re-verify "best provider" each major build phase; the abstraction layer is the insurance.
