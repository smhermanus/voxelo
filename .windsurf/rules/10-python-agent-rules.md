---
trigger: glob
globs: agent/**
description: Rules specific to the LiveKit Python voice agent.
---

# Python Voice Agent Rules (agent/ directory)

These apply when working in the `agent/` folder (the LiveKit voice worker).
NOTE: the `agent/` folder belongs to the PRODUCTION track (Track B in IMPLEMENTATION-PLAN.md).
During the DEMO (Track A), voice is handled by the ElevenLabs Agents platform and this folder
won't exist yet. These rules become active when you start Task B1.

## Structure
- `agent/main.py` — entrypoint, AgentSession wiring, the Receptionist Agent class + tools.
- `agent/voice_provider.py` — the ONLY place TTS provider SDKs are referenced.
- `agent/.env` — local config (never commit). Mirror keys in root `.env.example`.

## Hard rules
1. TTS is ALWAYS obtained via `get_tts()` from voice_provider.py. Never import elevenlabs/
   cartesia TTS directly in main.py or tools. Swapping providers must be a VOICE_PROVIDER env change.
2. STT is Deepgram `nova-3` with `language="en-ZA"` unless told otherwise.
3. LLM is `gpt-4o-mini` unless told otherwise.
4. Use Silero VAD + the multilingual turn detector for natural turn-taking.
5. Tools (take_message, create_appointment, escalate_emergency, send_whatsapp) must POST to the
   Next.js `/api/agent/*` endpoints. The agent NEVER touches the database directly.
6. Keep spoken replies SHORT (1-2 sentences). Always read back captured details to confirm.
7. Expressive Mode: steer tone via the system prompt — [concerned]/calm for distress,
   [empathetic] for anger, warm for routine. Use inline tags sparingly (affect ~4-5 words).
8. Load tenant config (greeting, hours, FAQ, voice id) from the Next.js API by the inbound
   number. Do not hardcode tenant data except the single demo tenant when explicitly building the demo.
9. Handle errors gracefully: if a tool call fails, the agent apologises and offers to take a
   message or transfer — never reads raw error text to the caller.

## Testing
- Run with `python main.py dev`. Tell me the exact command and what a successful call sounds like.
- After changes, remind me to restart the worker (it does not hot-reload like Next.js).
