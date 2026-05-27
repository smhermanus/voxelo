---
trigger: always_on
description: Core project rules for the AI Receptionist SaaS platform. Always active.
---

# AI Receptionist SaaS — Core Rules

You are an expert full-stack engineer working on a multi-tenant AI Receptionist
SaaS platform for the South African market. Follow these rules on EVERY task.

## Tech Stack (do not deviate without being asked)
- Framework: Next.js 15 (App Router) + React 19
- Language: TypeScript (strict mode). No plain JS files.
- Styling: Tailwind CSS + shadcn/ui components only. No other UI libraries.
- Database: PostgreSQL + Prisma ORM. All DB access goes through Prisma.
- API layer: tRPC for type-safe internal APIs. REST only for external webhooks (Twilio, WhatsApp).
- Auth + multi-tenancy: Clerk (Organizations = tenants).
- Voice agent: TWO-TRACK. DEMO uses the ElevenLabs Agents platform (dashboard-driven, fast).
  PRODUCTION migrates to LiveKit Agents (Python worker) for the provider abstraction + self-hosting.
  Check IMPLEMENTATION-PLAN.md for which track the current task belongs to before building.
- STT: Deepgram Nova-3 (language en-ZA). LLM: GPT-4o-mini. TTS: via abstraction layer (default ElevenLabs v3 Conversational).
- Background jobs: BullMQ + Redis.
- Telephony: Twilio Programmable Voice (SIP -> LiveKit).
- Messaging: official WhatsApp Business API (Twilio or Meta Cloud API) + Nodemailer/Resend for email.
- Payments: PayFast (ZAR). Hosting target: Xneelo (app) + HOSTAFRICA GPU (Phase 2 self-hosted voice).

## Non-negotiable Architectural Rules
1. VOICE PROVIDER ABSTRACTION: Never call a TTS provider SDK directly from agent logic.
   Always go through the `voice_provider` abstraction so providers can be swapped via env var.
   (Applies to the PRODUCTION/LiveKit track. In the DEMO track, voice is handled by the ElevenLabs
   Agents platform via dashboard config, so this rule activates once you build the Python agent.)
2. MULTI-TENANT ISOLATION: Every tenant-scoped table MUST have a `tenantId` column.
   Every query MUST filter by the current tenant. Never return cross-tenant data. When writing
   any Prisma query on a tenant-scoped model, include `where: { tenantId }` — no exceptions.
3. NO SECRETS IN CODE: All keys/credentials come from environment variables. Never hardcode.
   Never log secrets. Never commit `.env`.
4. WHATSAPP COMPLIANCE: The product is an "AI receptionist for a business" (AI auxiliary to the
   real service) — NOT a general-purpose chatbot. Each tenant connects their OWN WhatsApp Business
   account. Use only the official WhatsApp Business API. Never unofficial/reverse-engineered libs.
5. POPIA: Personal data (call recordings, transcripts, caller info) is sensitive. Encrypt at rest,
   TLS in transit, support deletion/export, and never expose one caller's data to another.
6. READ-ONLY for external DB integrations: any future customer-database lookup tool must use a
   read-only connection and return only whitelisted fields. Never write to a customer's DB.

## Coding Conventions
- Use `async/await`, never `.then()` chains.
- Validate all external input (webhooks, forms) with Zod schemas before use.
- Prefer server components; mark client components with `"use client"` only when needed.
- Co-locate features under `src/features/<feature>/` (components, hooks, server logic).
- Name files kebab-case; React components PascalCase; functions/vars camelCase.
- Every API route and tRPC procedure handles errors explicitly and returns typed results.
- Keep functions small and single-purpose. Add a short comment only where intent isn't obvious.
- NEVER use localStorage/sessionStorage assumptions in server code.

## Working Style (how you behave as my agent)
- Work in SMALL STEPS. Implement ONE task from the implementation plan at a time, then stop and
  summarise what you changed and how to test it. Do not run ahead multiple phases.
- Before editing, briefly state your plan (files you'll touch). After editing, list changed files.
- If a step is ambiguous or a decision is needed, ASK me rather than guessing.
- If something conflicts with these rules, flag it instead of silently working around it.
- Prefer editing existing files over creating duplicates. Check what exists first.
- When you finish a task, tell me exactly how to test it (command to run, what to expect).
- Reference `IMPLEMENTATION-PLAN.md` for the build sequence and `ARCHITECTURE.md` for the "why".
