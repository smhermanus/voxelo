# IMPLEMENTATION-PLAN.md — AI Receptionist SaaS

This is the build roadmap. Work through it ONE TASK AT A TIME. After each task, stop,
summarise changed files, and tell me how to test. Do not skip ahead.

How to use with me (the developer):
- I will say e.g. "Do TRACK A, Task A3". You implement only that task.
- Tick the box `[x]` when a task is verified working.
- If a task's preconditions aren't met, say so and propose the right next task.

Legend: [ ] = not started, [~] = in progress, [x] = done & verified.

---

## >>> YOU ARE HERE <<<
- Foundation is DONE: auth (Clerk), database (Prisma/PostgreSQL), and the dashboard shell
  are working. Phases marked below as [x] reflect that.
- Current goal: build the DEMO first (single tenant "Joe's Plumbing Cape Town"), then later
  follow the PRODUCTION track. The voice pipeline is NOT built yet — that is the immediate focus.
- VOICE DECISION FOR DEMO: use the **ElevenLabs Agents platform** (fast, WhatsApp built in).
  Migrate to **LiveKit Agents** later for production (provider abstraction + self-hosted voice).
  See ARCHITECTURE.md "Voice: two-track approach".

START HERE: Track A (demo). Do the Quick Verification pass, then Task A1.

---

## ALREADY DONE (verify quickly, then move on)
- [x] 0.1-0.5 Project setup: Next.js 15 + TS + Tailwind + shadcn, deps installed, `.env.example`,
      `.env` gitignored. (If anything here is actually missing, flag it.)
- [x] 1.1-1.3 Prisma schema + migration + Prisma singleton; Clerk auth + middleware + sign-in/up.
- [x] 1.5-1.6 Dashboard shell layout with sidebar nav; tRPC wired with a health procedure.

### Quick verification pass (do this ONCE before Track A)
- [x] V.1 Schema has all required models (Tenant+clerkOrgId, User, Call, Message, Appointment,
      KnowledgeBase, Setting). All tenant-scoped models have tenantId + indexes. DB pushed + client regenerated.
- [x] V.2 Clerk webhook at /api/webhooks/clerk handles organization.created -> Tenant row and
      organizationMembership.created -> User row. svix installed. Middleware updated.
      Still needed: add CLERK_WEBHOOK_SECRET to .env.local + register endpoint in Clerk dashboard.
- [x] V.3 Demo tenant "Joe's Plumbing Cape Town" in prisma/seed.ts — correct.

---

# ===== TRACK A: THE DEMO (ElevenLabs Agents, single tenant) =====
Goal: a phone number a client can call live, plus a dashboard showing calls/messages/bookings,
plus a WhatsApp channel. Hardcode ONE tenant. Deploy to Vercel. Target: ~10 working days.

## A1 — ElevenLabs Agent setup (dashboard, low code)
- [x] A1.1 Create an ElevenLabs account; in Agents, create "Joe's Plumbing Receptionist".
- [x] A1.2 Set TTS model to V3 Conversational (Expressive Mode on by default). Pick a voice.
- [x] A1.3 System prompt -> agent/elevenlabs/system-prompt.md (paste into ElevenLabs dashboard).
- [x] A1.4 Knowledge base -> agent/elevenlabs/knowledge-base.md (upload/paste into ElevenLabs).
- [x] A1.5 Tested in ElevenLabs playground — converses naturally. DONE.

## A2 — Phone number + telephony (Path C friendly)
- [x] A2.1 Twilio +27218022999 provisioned. DEMO_TENANT_PHONE env var added.
- [x] A2.2 ElevenLabs webhook configured on Twilio number with xi-api-key. Live call verified.
      /api/twilio/* added to public routes in src/proxy.ts.
- [x] A2.3 Path C call-forwarding story + SA carrier codes in A2-telephony-setup.md.

## A3 — Connect agent actions to your app (webhooks/tools)
- [~] A3.1 Tool config guide written -> agent/elevenlabs/A3-tools-setup.md. Dashboard setup pending.
- [x] A3.2 All three endpoints Zod-validated, DEMO_TENANT_PHONE env var, emergency notifications added.
      Demo tenant re-seeded with correct phone +27218022999.
- [ ] A3.3 Verify: on a call, "leave a message for Joe" -> a Message row appears in the DB.

## A4 — Notifications (the WOW moment)
- [ ] A4.1 `src/lib/notifications.ts`: sendWhatsApp (Twilio WhatsApp sandbox for demo) + sendEmail (Resend).
- [ ] A4.2 Fire notifications from the agent endpoints (message/appointment/emergency).
- [ ] A4.3 Verify: leave a message by phone -> WhatsApp lands on the owner's phone within seconds.

## A5 — Appointment booking
- [ ] A5.1 Integrate Cal.com (free) for availability + booking.
- [ ] A5.2 create_appointment writes to DB + books in Cal.com + sends confirmation to caller.
- [ ] A5.3 Verify: book by phone -> appears in Cal.com + dashboard + confirmation sent.

## A6 — Dashboard with real data (single tenant)
- [ ] A6.1 tRPC routers: calls.list/todayStats, messages.list/unreadCount, appointments.upcoming.
      Even in the demo, filter by the demo tenant's id (good habit for production).
- [ ] A6.2 Metric cards + recent calls table (click row -> transcript as chat bubbles).
- [ ] A6.3 Messages inbox + Appointments view. Loading skeletons + realistic empty states.
- [ ] A6.4 Verify: actions from real calls show up live in the dashboard.

## A7 — WhatsApp channel (ElevenLabs native) + "send mid-call"
- [ ] A7.1 LAYER 1 (notifications) already works from A4.
- [ ] A7.2 LAYER 2: connect ElevenLabs WhatsApp integration; assign the agent; set an explicit
      end-of-conversation message (avoid silent timeout).
- [ ] A7.3 Add the "send WhatsApp mid-call" tool + a system-prompt rule for when to use it.
- [ ] A7.4 COMPLIANCE: demo uses Joe's OWN WhatsApp Business account; frame as "AI receptionist",
      never a general chatbot. Note this in the README.
- [ ] A7.5 Verify: WhatsApp the business -> same agent answers; on a call, "WhatsApp me that quote"
      arrives mid-call.

## A8 — Settings + after-hours (demo-level)
- [ ] A8.1 Settings page (read/write the demo tenant): greeting, voice, hours, FAQ, transfer numbers.
- [ ] A8.2 After-hours behaviour in the agent prompt/config: outside hours -> messages + emergencies only.
- [ ] A8.3 Verify: change a setting -> agent behaviour changes on the next call.

## A9 — Deploy + rehearse
- [ ] A9.1 Deploy the Next.js app to Vercel; set all env vars; update ElevenLabs/Twilio webhook URLs.
- [ ] A9.2 Rehearse the 5 demo calls: FAQ, message, booking, emergency (tone shift), frustrated
      customer (Expressive Mode), plus the phone->WhatsApp handoff.
- [ ] A9.3 Pre-demo checklist pass (functional + backups + recordings). Demo ready.

### DEMO DONE. Pitch it, get the signature, then start Track B.

---

# ===== TRACK B: PRODUCTION MIGRATION (multi-tenant + LiveKit) =====
Only start after the client signs. Each task says how it relates to the demo you already built.

## B1 — Voice migration to LiveKit (replaces ElevenLabs orchestration)
- [ ] B1.1 Create `agent/` Python worker (venv + livekit-agents[openai,deepgram,elevenlabs,
      cartesia,silero,turn-detector]). See `.windsurf/rules/10-python-agent-rules.md`.
- [ ] B1.2 Build `agent/voice_provider.py` ABSTRACTION (get_tts by VOICE_PROVIDER env:
      elevenlabs default = eleven_v3_conversational; cartesia fallback; chatterbox stub).
- [ ] B1.3 Build `agent/main.py`: Deepgram nova-3 (en-ZA) + gpt-4o-mini + get_tts() + Silero VAD
      + multilingual turn detector. Reuse the SAME system prompt from the demo.
- [ ] B1.4 LiveKit Cloud project + SIP inbound trunk; connect Twilio SIP. Move the agent tools to
      POST the same `/api/agent/*` endpoints you already built in Track A (they don't change).
- [ ] B1.5 Verify parity: a call behaves the same as the demo, now via LiveKit.

## B2 — Multi-tenancy hardening
- [ ] B2.1 Replace the hardcoded demo tenant with tenant resolution by inbound phone number.
- [ ] B2.2 Audit EVERY Prisma query for `tenantId` filtering. Add a test proving cross-tenant
      access fails. (Demo code already filtered by tenant id, so this is mostly verification.)
- [ ] B2.3 Tenant config (greeting, hours, FAQ, voice) loaded per call from DB, not hardcoded.

## B3 — Self-service onboarding (Tier 1, ~15 min)
- [ ] B3.1 Wizard: business info, hours, FAQ, transfer numbers, voice selection.
- [ ] B3.2 Phone via call-forwarding (Path C): provision a Twilio number programmatically;
      show carrier forwarding codes; "test now" confirmation.
- [ ] B3.3 Optional Tier 1 RAG: ingest pasted text/URL into vectors for FAQ answering.

## B4 — Knowledge base RAG (Tier 2)
- [ ] B4.1 Upload PDF/DOCX -> extract -> chunk -> embed -> store (pgvector or hosted).
- [ ] B4.2 Agent FAQ uses RAG retrieval; low confidence -> offer human/escalate.

## B5 — Admin portal + billing + compliance
- [ ] B5.1 Super-admin: manage tenants, usage, billing status, system health.
- [ ] B5.2 PayFast subscriptions (ZAR) + plans + usage add-ons + invoices.
- [ ] B5.3 POPIA: consent on recording, export + deletion tools, retention policy, encryption.
- [ ] B5.4 Monitoring: Sentry + PostHog; structured logs (no secrets).

## B6 — Hosting migration + cost optimisation
- [ ] B6.1 Move app from Vercel to Xneelo (Nginx, PM2, PostgreSQL, Redis); deploy Python agent.
- [ ] B6.2 (Cost optimisation) Stand up self-hosted Chatterbox Turbo on HOSTAFRICA GPU behind the
      voice abstraction; set VOICE_PROVIDER=chatterbox; keep ElevenLabs as fallback.
- [ ] B6.3 Tier 3 database integrations (charged separately): read-only function API + identity
      verification + audit logging. Guardrails mandatory.

---

## Definition of Done (every task)
1. Code compiles, types pass, lint clean.
2. Follows all rules in `.windsurf/rules/` (abstraction, tenant isolation, no secrets, compliance).
3. You told me exactly how to test it and what to expect.
4. Changed files listed. Box ticked when I confirm it works.

## Notes on the two-track design
- Track A intentionally uses ElevenLabs Agents to reach a demo fast. The `/api/agent/*` endpoints,
  Prisma models, dashboard, notifications, and Cal.com work are REUSED unchanged in production.
- Track B swaps ONLY the voice orchestration (ElevenLabs -> LiveKit) and adds multi-tenancy,
  onboarding, billing, and self-hosting. Nothing from Track A is wasted.
