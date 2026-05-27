# A2 — Phone Number + Telephony Setup
# Track A (ElevenLabs demo). No code changes required — pure dashboard/console work.
# ─────────────────────────────────────────────────────────────────────────
#
# HOW TRACK A TELEPHONY WORKS (important to understand before you start)
#
#   Caller → Twilio number → [Twilio webhook] → ElevenLabs agent
#
# Your Next.js app is NOT in the call path during Track A.
# The /api/twilio/voice route is reserved for Track B (LiveKit).
# ─────────────────────────────────────────────────────────────────────────

---

## A2.1 — Provision a Twilio Phone Number

### Step 1 — Create / log into your Twilio account
Go to https://twilio.com. Use the $15 trial credit — it covers hundreds of demo minutes.

### Step 2 — Verify your personal number (trial accounts only)
Twilio trial accounts can only place calls TO verified numbers.
Go to: Phone Numbers → Verified Caller IDs → Add a Verified Caller ID
Verify your personal SA mobile — you'll use this to make demo test calls.

### Step 3 — Buy a phone number
Go to: Phone Numbers → Manage → Buy a number

Recommended for the demo:
- Search for **United States (+1)** numbers — they are always available on trial accounts
- Filter: Voice capability ✓
- Buy any available number (~$1.15/month, covered by trial credit)

> SA numbers (+27) require a Regulatory Bundle (3–10 business days) — skip for now.
> The demo client never sees the number; only the forwarding story matters (see A2.3).

### Step 4 — Note your Twilio credentials
Copy these to your .env.local:

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
```

---

## A2.2 — Connect the Twilio Number to Your ElevenLabs Agent

ElevenLabs Conversational AI has native Twilio integration — it configures the webhook automatically.

### Option A — Let ElevenLabs configure Twilio (easiest)

1. In ElevenLabs: **Conversational AI** → open "Joe's Plumbing Receptionist" → **Phone** tab
2. Click **"Connect phone number"** → select **"Twilio"**
3. Enter your Twilio Account SID and Auth Token
4. Select the phone number you bought in A2.1
5. ElevenLabs will automatically set the webhook on your Twilio number
6. Click **Save**

### Option B — Manual Twilio webhook configuration

If Option A isn't available in your ElevenLabs plan:

1. In ElevenLabs: **Conversational AI** → your agent → **Phone** tab
   → Copy the **inbound webhook URL** (format: `https://api.elevenlabs.io/v1/convai/twilio/inbound_call`)
   → Note your **Agent ID** from the agent URL or settings

2. In Twilio Console: **Phone Numbers** → **Manage** → **Active Numbers** → click your number
   → Under **Voice Configuration**:
   - "A call comes in": **Webhook**
   - URL: `https://api.elevenlabs.io/v1/convai/twilio/inbound_call?agent_id=agent_5801ksn017v6fgv9f9r3w8qgj539`
   - HTTP Method: **POST**
   → Save

### Verify the connection

Call your Twilio number from your verified phone.
You should hear the ElevenLabs agent greet you within 2–3 seconds.

If it doesn't answer:
- Check the Twilio webhook URL is exactly right (including the agent_id param)
- Check the Twilio number has "Voice" capability enabled
- Check ElevenLabs agent is in "Published" state (not Draft)
- Check Twilio call logs for errors: Monitor → Logs → Calls

---

## A2.3 — The "Path C" Call-Forwarding Pitch (no build required)

This is the narrative you use in the client meeting to explain how any business goes live
in 15 minutes without waiting weeks for number porting.

### The story

> "Your client already has a business number — 021 555 1234 on the wall, on Google, on their
> van. We don't touch that number. Instead, we provision a Twilio number (takes 60 seconds),
> set up the AI receptionist on it, and then they just dial a code on their existing phone to
> forward calls. From that moment, every call to their existing number is answered by the AI.
> Total setup time: 15 minutes. No ICASA paperwork, no porting delays."

### Carrier forwarding codes (SA — memorise these for the demo)

| Carrier       | Activate unconditional forward              | Deactivate         |
|---------------|---------------------------------------------|--------------------|
| Vodacom       | `*21*+27XXXXXXXXXX#` (dial, then call)      | `#21#`             |
| MTN           | `*21*+27XXXXXXXXXX#`                        | `#21#`             |
| Cell C        | `*21*+27XXXXXXXXXX#`                        | `##21#`            |
| Telkom mobile | `*21*+27XXXXXXXXXX#`                        | `#21#`             |
| Telkom landline | Call 10213 or use the Telkom portal       | Same               |

> Replace `+27XXXXXXXXXX` with your Twilio number in international format.
> Example: Twilio number +1 415 555 0100 → dial `*21*+14155550100#` then press call.

### What to show the client during the demo

1. Call your demo Twilio number directly → AI answers (shows it works)
2. Then forward your personal mobile to the Twilio number using `*21*+1XXXXXXXXXX#`
3. Call YOUR personal mobile from a second phone → AI answers (shows the forwarding story)
4. Deactivate: `#21#`

This live demo of the forwarding in real time is the "15-minute setup" proof point.

### Why this matters for the pitch

- No ICASA Regulatory Bundle wait (needed for new +27 numbers — 3 to 10 business days)
- Client never loses their existing number or has to reprint business cards
- Can be live during the meeting itself — strongest possible demo close
- If they later want a dedicated +27 number, we provision it in the background while
  Path C keeps them live (no downtime)
