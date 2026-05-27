# A3 — ElevenLabs Agent Tools Setup
# Configure these three server tools in the ElevenLabs agent dashboard.
# Each tool calls one of the /api/agent/* REST endpoints in your Next.js app.
#
# For local testing: use ngrok to expose localhost
#   npx ngrok http 3000
#   Base URL = https://xxxx.ngrok-free.app
#
# For production (Vercel): Base URL = https://your-app.vercel.app
# ─────────────────────────────────────────────────────────────────────────

In ElevenLabs: open "Joe's Plumbing Receptionist" → Tools tab → "+ Add Tool" → "Webhook"

---

## Tool 1 — take_message

**Name:** `take_message`
**Description (shown to LLM):**
  Save a message from the caller for Joe. Use this when the caller wants to leave a message,
  cannot reach Joe, or does not want to book an appointment.

**Method:** POST
**URL:** `https://YOUR_BASE_URL/api/agent/messages`

**Request body (JSON):**
```json
{
  "callerName": "{{callerName}}",
  "callerPhone": "{{callerPhone}}",
  "message": "{{message}}"
}
```

**Parameters to define in ElevenLabs:**
| Name        | Type   | Required | Description                                     |
|-------------|--------|----------|-------------------------------------------------|
| callerName  | string | yes      | Full name of the caller                         |
| callerPhone | string | yes      | Caller's phone number                           |
| message     | string | yes      | The complete message to pass on to Joe          |

**Expected response:** `{ "success": true, "id": "..." }`

---

## Tool 2 — create_appointment

**Name:** `create_appointment`
**Description (shown to LLM):**
  Book a plumbing appointment for the caller. Use this when the caller confirms they want
  a plumber to come to their property. Always collect name, phone, address (put in notes),
  problem description (put in notes), and preferred date/time before calling this tool.

**Method:** POST
**URL:** `https://YOUR_BASE_URL/api/agent/appointment`

**Request body (JSON):**
```json
{
  "callerName": "{{callerName}}",
  "callerPhone": "{{callerPhone}}",
  "startTime": "{{startTime}}",
  "notes": "{{notes}}"
}
```

**Parameters to define in ElevenLabs:**
| Name        | Type   | Required | Description                                                          |
|-------------|--------|----------|----------------------------------------------------------------------|
| callerName  | string | yes      | Full name of the caller                                              |
| callerPhone | string | yes      | Caller's phone number                                                |
| startTime   | string | yes      | Appointment date and time as ISO 8601 e.g. 2025-06-01T10:00:00+02:00|
| notes       | string | no       | Address and description of the plumbing issue                        |

**Expected response:** `{ "success": true, "id": "..." }`

---

## Tool 3 — escalate_emergency

**Name:** `escalate_emergency`
**Description (shown to LLM):**
  Escalate an urgent plumbing emergency to Joe immediately. Use this when the caller mentions
  burst pipes, active flooding, sewage overflow, geyser explosion, or any situation requiring
  urgent on-site attendance. Always get the caller's phone number first.

**Method:** POST
**URL:** `https://YOUR_BASE_URL/api/agent/emergency`

**Request body (JSON):**
```json
{
  "callerPhone": "{{callerPhone}}",
  "issue": "{{issue}}"
}
```

**Parameters to define in ElevenLabs:**
| Name        | Type   | Required | Description                               |
|-------------|--------|----------|-------------------------------------------|
| callerPhone | string | yes      | Caller's phone number                     |
| issue       | string | yes      | Brief description of the emergency        |

**Expected response:** `{ "success": true }`

---

## Testing (A3.3 verification)

### Option A — ngrok local test
1. Start your Next.js dev server: `npm run dev`
2. In a second terminal: `npx ngrok http 3000`
3. Copy the ngrok HTTPS URL and replace YOUR_BASE_URL in all three tools
4. Call the Twilio number → say "I'd like to leave a message for Joe"
5. After the call: check your DB
   In Prisma Studio: `npx prisma studio` → open the Message table
   You should see a new row with the caller's name and message.

### Option B — curl smoke test (without a phone call)
Run these from your terminal to verify each endpoint works:

```powershell
# Message
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/agent/messages" `
  -ContentType "application/json" `
  -Body '{"callerName":"Test Caller","callerPhone":"+27821234567","message":"Please call me back about a leaking pipe."}'

# Appointment
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/agent/appointment" `
  -ContentType "application/json" `
  -Body '{"callerName":"Test Caller","callerPhone":"+27821234567","startTime":"2025-06-10T10:00:00+02:00","notes":"Blocked drain at 12 Main Road, Rondebosch"}'

# Emergency
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/agent/emergency" `
  -ContentType "application/json" `
  -Body '{"callerPhone":"+27821234567","issue":"Burst pipe flooding the kitchen"}'
```

All three should return `{ "success": true, "id": "..." }`.
Check the Messages and Appointments tables in Prisma Studio to confirm rows were created.


```powershell
# Message
Invoke-RestMethod -Method POST -Uri "https://voxelo.co.za/api/agent/messages" `
  -ContentType "application/json" `
  -Body '{"callerName":"Test Caller","callerPhone":"+27821234567","message":"Please call me back about a leaking pipe."}'

# Appointment
Invoke-RestMethod -Method POST -Uri "https://voxelo.co.za/api/agent/appointment" `
  -ContentType "application/json" `
  -Body '{"callerName":"Test Caller","callerPhone":"+27821234567","startTime":"2025-06-10T10:00:00+02:00","notes":"Blocked drain at 12 Main Road, Rondebosch"}'

# Emergency
Invoke-RestMethod -Method POST -Uri "https://voxelo.co.za/api/agent/emergency" `
  -ContentType "application/json" `
  -Body '{"callerPhone":"+27821234567","issue":"Burst pipe flooding the kitchen"}'


```