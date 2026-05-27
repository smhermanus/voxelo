# ARCHITECTURE.md — AI Receptionist SaaS

This document gives the agent (and any human) the reasoning behind the design.
Read this before making architectural decisions so choices stay consistent.

## What we're building
A multi-tenant SaaS where South African businesses get an AI voice receptionist that
answers calls 24/7, detects intent, takes messages, books appointments, answers FAQs,
screens/escalates calls, handles after-hours, and now also operates on WhatsApp.
Our client resells this to businesses (plumbers, dentists, law firms, etc.).

## The call pipeline (real-time)
```
Caller -> Twilio number -> SIP -> LiveKit room -> Python agent
  Agent pipeline:  Deepgram Nova-3 (STT)  ->  GPT-4o-mini (LLM)  ->  TTS (abstraction)
  Tools the LLM can call -> POST to Next.js REST endpoints -> Prisma -> PostgreSQL
  Notifications (BullMQ/Redis) -> WhatsApp / email / CRM webhook
  Recording + transcript -> stored, with offsite backup
```

## Voice: two-track approach (IMPORTANT)
We deliberately use a different voice approach for the demo vs production:
- DEMO (Track A): ElevenLabs Agents platform. Dashboard-driven, WhatsApp built in, working
  receptionist in ~1 day. Best for getting a live demo in front of the client fast.
- PRODUCTION (Track B): migrate to LiveKit Agents (Python worker). Gives us the voice provider
  abstraction and the option to self-host Chatterbox Turbo to kill per-minute costs at scale.
- What carries over UNCHANGED from demo to production: the `/api/agent/*` REST endpoints, all
  Prisma models, the dashboard, notifications, and Cal.com booking. Only the voice ORCHESTRATION
  is swapped, plus multi-tenancy/onboarding/billing are added. Nothing from the demo is wasted.

## Why these choices
- LiveKit Agents for PRODUCTION (not raw Twilio Media Streams): it handles WebRTC transport, turn
  detection, and barge-in (interruption) for us. Same framework that powers ChatGPT voice mode.
- Voice Provider Abstraction: voice AI changes monthly (ElevenLabs v3 Expressive Mode, Cartesia
  Sonic, Inworld, self-hosted Chatterbox). We must swap providers via config, not rewrites.
  Default is ElevenLabs v3 Conversational (Expressive Mode). Fallback: Cartesia. Phase 2: Chatterbox.
- Deepgram Nova-3 for STT: best South African English accent handling available.
- GPT-4o-mini: best price/performance for intent detection + short conversational replies.
- Clerk Organizations for multi-tenancy: each org = one tenant business, with built-in team/roles.
- Prisma row-level isolation via tenantId: cost-effective multi-tenancy that scales to hundreds
  of tenants on one DB before we need to shard.
- Xneelo hosting (app) + HOSTAFRICA GPU (self-hosted voice in Phase 2): ZAR billing, SA data
  residency for POPIA, low latency to SA callers, fixed predictable cost.

## Two-layer WhatsApp architecture (important)
- LAYER 1 — Notifications (system -> business owner): official WhatsApp Business API, INDEPENDENT
  of the voice vendor. Must keep working even if we swap voice providers.
- LAYER 2 — Conversational (customer <-> AI): ElevenLabs Agents WhatsApp integration, same agent
  brain as phone. Supports "send WhatsApp mid phone-call" as a tool.
- Never collapse both layers into one vendor — that recreates the lock-in we're avoiding.

## Compliance posture (sell this, don't hide it)
- POPIA: SA data residency, encryption, consent on recording, deletion/export tooling.
- Meta WhatsApp policy (15 Jan 2026): we are "AI auxiliary to a real business service" = PERMITTED.
  Each tenant uses their OWN WhatsApp Business account. Never market as a general-purpose chatbot.

## Onboarding tiers (informs feature design)
- Tier 1 self-service (~15 min): wizard collects business info, hours, FAQ text, transfer numbers,
  voice. Phone via call-forwarding (Path C) so no waiting on ICASA Regulatory Bundle.
- Tier 2 assisted (~1 day): ingest PDF/DOCX knowledge base into RAG.
- Tier 3 database integration (1-4 weeks, charged separately): read-only function-calling API with
  identity verification + audit logging. Guardrails are mandatory.

## Phone provisioning reality (South Africa)
- Path C (default): keep existing number, forward to a Twilio number we provision instantly.
  No ICASA Regulatory Bundle wait. Enables the 15-minute promise.
- Path A: new +27 number via Twilio — needs Regulatory Bundle (3-10 business days).
- Path B: port existing number — 2-6 weeks. Advanced/enterprise only.
- While A/B are pending, give the tenant temporary Path-C forwarding so they're live immediately.

## Environments
- Demo: single hardcoded tenant ("Joe's Plumbing CPT"), ElevenLabs managed voice, deploy to Vercel.
- Production: full multi-tenant, Xneelo + HOSTAFRICA, PayFast billing, self-hosted Chatterbox option.
