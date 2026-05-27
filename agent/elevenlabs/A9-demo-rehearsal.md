# A9 — Demo Rehearsal Guide
## Joe's Plumbing AI Receptionist — Client Pitch Demo

---

## A9.1 — Pre-Deployment Checklist

### Vercel env vars — confirm ALL of these are set
| Variable | What it does | Check |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Must start with `pk_live_` (not `pk_test_`) | [ ] |
| `CLERK_SECRET_KEY` | Clerk production secret | [ ] |
| `CLERK_WEBHOOK_SECRET` | Svix signature verification | [ ] |
| `DATABASE_URL` | Neon pooled connection string | [ ] |
| `APP_URL` | `https://www.voxelo.co.za` | [ ] |
| `DEMO_TENANT_PHONE` | `+27218022999` | [ ] |
| `TWILIO_ACCOUNT_SID` | Twilio credentials | [ ] |
| `TWILIO_AUTH_TOKEN` | Twilio credentials | [ ] |
| `TWILIO_PHONE_NUMBER` | `+27218022999` | [ ] |
| `TWILIO_WHATSAPP_FROM` | `whatsapp:+14155238886` (sandbox) | [ ] |
| `OWNER_WHATSAPP` | Your personal number e.g. `+27812807278` | [ ] |
| `RESEND_API_KEY` | Resend email API key | [ ] |
| `EMAIL_FROM` | `info@voxelo.co.za` | [ ] |

### ElevenLabs tool URLs — must use www
All 4 tools must point to `https://www.voxelo.co.za/...` (NOT `https://voxelo.co.za/...`):
- `take_message` → `https://www.voxelo.co.za/api/agent/messages` [ ]
- `create_appointment` → `https://www.voxelo.co.za/api/agent/appointment` [ ]
- `escalate_emergency` → `https://www.voxelo.co.za/api/agent/emergency` [ ]
- `send_whatsapp` → `https://www.voxelo.co.za/api/agent/whatsapp` [ ]

### System prompt — paste latest version
- [ ] Paste full content of `agent/elevenlabs/system-prompt.md` into ElevenLabs agent

### Quick smoke tests (run before the demo day)
```powershell
# Message endpoint
Invoke-RestMethod -Method POST -Uri "https://www.voxelo.co.za/api/agent/messages" `
  -ContentType "application/json" `
  -Body '{"callerName":"Pre-demo test","callerPhone":"+27821234567","message":"System check"}'

# Appointment endpoint
Invoke-RestMethod -Method POST -Uri "https://www.voxelo.co.za/api/agent/appointment" `
  -ContentType "application/json" `
  -Body '{"callerName":"Pre-demo test","callerPhone":"+27821234567","startTime":"2026-06-10T10:00:00+02:00","notes":"System check"}'
```
Both should return `{ "success": true, "id": "..." }`.

---

## A9.2 — The 5 Demo Calls

> Run these in order. Each demonstrates a different capability.
> Have the dashboard open on a second screen — ideally on a TV or large monitor.

### Call 1 — FAQ (30 seconds)
**What it proves:** The agent knows the business inside out, 24/7.

**Script:**
1. Call `+27 21 802 2999`
2. Say: *"Hi, what's your callout fee and what areas do you cover?"*
3. Agent answers: R450, Greater Cape Town, Atlantic Seaboard, Southern Suburbs, etc.
4. Say: *"Do you work on Sundays?"*
5. Agent: "We're closed on Sundays, but for emergencies we're available 24/7."

**Talking point for client:** *"No staff needed, no hold music, instant answer at 2am."*

---

### Call 2 — Message for Joe (60 seconds)
**What it proves:** Caller intent captured → DB → notification to owner. The WOW moment.

**Script:**
1. Call the number
2. Say: *"Hi, I'd like to leave a message for Joe please."*
3. Agent collects name and phone → read back → confirm
4. Hang up

**Immediately show the client:**
- Dashboard → Messages → message appears in real time ✅
- WhatsApp notification arrives on your phone ✅
- Email arrives in your inbox ✅

**Talking point:** *"Every message, captured and delivered instantly. Nothing falls through the cracks."*

---

### Call 3 — Emergency (45 seconds)
**What it proves:** Tone shift, urgency, instant escalation.

**Script:**
1. Call the number
2. Say (with urgency): *"Hello! My pipe just burst, there's water everywhere, I don't know what to do!"*
3. Agent immediately shifts tone: *"I hear you — our emergency team is available right now. First, what's your address?"*
4. Give an address and phone number

**Immediately show:**
- WhatsApp emergency alert: "🚨 EMERGENCY from..." on your phone ✅
- Emergency email notification ✅

**Talking point:** *"Compare that to being put on hold at midnight. The agent never panics, never misses a detail."*

---

### Call 4 — Booking (90 seconds)
**What it proves:** Full appointment workflow with DB capture.

**Script:**
1. Call the number
2. Say: *"I need a plumber to come look at my geyser — it's making a noise and not heating properly."*
3. Agent classifies as booking → collects: name, phone, address, problem, preferred date + time
4. Confirm: *"Tomorrow, 10am, 15 Main Road, Claremont"*
5. Agent confirms and calls `create_appointment`

**Show on dashboard:**
- Appointments page → new row appears ✅
- WhatsApp notification: "📅 New appointment booked!" ✅

**Talking point:** *"No back-and-forth on WhatsApp, no missed calls, no double-bookings."*

---

### Call 5 — WhatsApp mid-call handoff (60 seconds)
**What it proves:** Omnichannel — the agent bridges voice and messaging seamlessly.

**Script:**
1. Call the number
2. Say: *"What does a geyser replacement cost? And can you WhatsApp me the pricing?"*
3. Agent answers the FAQ question
4. Agent asks for your WhatsApp number → you give it
5. Agent calls `send_whatsapp` → message arrives on your phone during the call

**Show:**
- WhatsApp message arrives while you're still on the call ✅

**Talking point:** *"The same agent works across phone and WhatsApp. One voice, everywhere."*

---

## A9.3 — Pre-Demo Day Checklist

### 24 hours before
- [ ] Run all 5 demo calls yourself — fix anything that breaks
- [ ] Check dashboard loads cleanly on the demo device (laptop / TV)
- [ ] Clear old test messages from Messages table so the demo is clean
  → Prisma Studio → Message table → delete DiagTest/LiveTest rows
- [ ] Verify WhatsApp notifications land within 5 seconds
- [ ] Confirm the Twilio number is active (call it once)
- [ ] Check Vercel deployment is on the latest commit

### Day of demo
- [ ] Phone fully charged (you're using it live)
- [ ] Personal WhatsApp notifications turned ON (not on silent)
- [ ] Dashboard open on a large screen at `/dashboard`
- [ ] Second tab open at `/messages`
- [ ] Demo environment labelled: "voxelo.co.za — Joe's Plumbing AI Receptionist"

### If something breaks mid-demo
- **Agent doesn't answer:** Check Twilio → ElevenLabs webhook URL is correct
- **Tool doesn't fire:** Remind the audience "tools are real-time webhooks" → show the DB entry in Prisma Studio as backup proof
- **WhatsApp late:** Twilio sandbox can be slow — say "arriving now" and show the email instead
- **Dashboard blank:** Local dev server `npm run dev` as backup

### After the demo
- [ ] Walk through the dashboard with the client — let them see the real data from their demo calls
- [ ] Show the Settings page — explain how they'd customise it for their business
- [ ] Explain the migration to their own WhatsApp Business number (production)
- [ ] Present pricing + Track B roadmap (multi-tenancy, self-hosted voice, etc.)

---

## The pitch in one sentence

> *"Every missed call is a lost job. This AI receptionist answers every call, captures every lead,
> books every appointment, and escalates every emergency — even at 2am on a Sunday."*
