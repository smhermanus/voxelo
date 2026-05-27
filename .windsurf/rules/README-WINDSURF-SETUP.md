# How to Use These Files in Windsurf (Cascade)

These files turn your Windsurf agent into a disciplined, context-aware co-developer that
understands the whole AI Receptionist project and builds it step by step.

## What each file is

| File | Where it goes | Purpose |
|---|---|---|
| `.windsurf/rules/00-project-rules.md` | repo root | Always-on rules: stack, guardrails, working style |
| `.windsurf/rules/10-python-agent-rules.md` | repo root | Rules that activate only in `agent/**` |
| `ARCHITECTURE.md` | repo root | The "why" behind decisions (agent reads for context) |
| `IMPLEMENTATION-PLAN.md` | repo root | The step-by-step build roadmap you drive task by task |

## Installation (2 minutes)
1. Copy the `.windsurf/` folder into the ROOT of your project (same level as `package.json`).
2. Copy `ARCHITECTURE.md` and `IMPLEMENTATION-PLAN.md` into the root too.
3. In Windsurf, open the project. The rules in `.windsurf/rules/` load automatically.
4. (Optional) Open Windsurf Settings -> Rules to confirm they're detected.

## How rules work
- `trigger: always_on` -> injected into Cascade's context on every message. Keep these tight.
- `trigger: glob` with `globs: agent/**` -> only active when working on files in `agent/`.
- Windsurf recommends keeping each rules file focused and under ~6,000 characters so it
  doesn't crowd out the context window. These are well within that.

## How to actually build, day to day
Talk to Cascade in terms of the plan. Examples:

- "Read IMPLEMENTATION-PLAN.md and ARCHITECTURE.md, then do Phase 1, Task 1.1."
- "Task 1.1 works. Tick it and do 1.2."
- "Before you code Task 2.5, tell me your plan and which files you'll create."
- "That broke X. Fix it without violating the abstraction rule."

Because the rules tell Cascade to work one task at a time, stop, and tell you how to test,
you stay in control instead of getting a giant unreviewable dump of code.

## Your exact starting point (based on where you are now)
Foundation is done (Clerk auth, Prisma DB, dashboard shell). You're building the DEMO first
using ElevenLabs Agents, then migrating to production/LiveKit later. The plan reflects this as
Track A (demo) and Track B (production).

Best first prompt to paste into Cascade:
> "Read ARCHITECTURE.md and IMPLEMENTATION-PLAN.md. My foundation (auth, DB, dashboard shell)
>  is done. Run the Quick Verification pass (V.1-V.3) against my actual code, fix anything
>  missing, then stop and report. After that we'll start Track A, Task A1."

Then proceed task by task: "Do Track A, Task A3", etc.

## Keeping it current
Voice AI changes monthly. When something new lands (a new TTS model, a Meta policy tweak):
- Update `ARCHITECTURE.md` with the decision.
- If it's a permanent standard, add a line to `00-project-rules.md`.
- The implementation plan stays stable; only the abstraction's default provider changes.

## Pro tips
- Keep `IMPLEMENTATION-PLAN.md` checkboxes updated — it becomes your living progress tracker
  and gives Cascade an accurate picture of what's done.
- If Cascade ever drifts (wrong stack, skips tenant filtering, hardcodes a key), point it back:
  "Re-read 00-project-rules.md — you violated rule 2 (tenant isolation)."
- Commit these files to git so the whole team (and future-you) shares the same guardrails.
