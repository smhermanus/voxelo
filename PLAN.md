STEP-BY-STEP DEMO BUILD GUIDE
────────────────────────────────────────
AI Receptionist SaaS Platform
From Empty Folder to Live Phone Demo in 10 Working Days

Stack: Next.js 15 + LiveKit Agents + Twilio + ElevenLabs + Deepgram + GPT-4o
Hosting: Local development → Vercel + Xneelo (production-style demo)

Date: 30 March 2026
 
Overview & Demo Goals
This guide walks you through building a complete, production-quality AI Receptionist demo in 10 working days. By the end, you will be able to give your client a phone number to call live during the meeting, and demonstrate every key feature of the planned SaaS platform: AI-powered call answering, intent detection, message taking, appointment booking, FAQ answering, and a tenant dashboard.

What this demo proves
It is a single-tenant working prototype that demonstrates the full call flow with one hardcoded business (e.g. “Joe’s Plumbing Cape Town”). It is not multi-tenant SaaS yet — that is what the full project builds. The demo answers the question: “Can you actually build this?”

Demo strategy: managed services first
We use ElevenLabs + Deepgram + OpenAI for the demo, NOT self-hosted Chatterbox. This is intentional. The demo focuses on the product experience; self-hosting is a Phase 2 cost-optimisation. Trying to set up a GPU server in 10 days would risk the entire demo for marginal benefit.

Do You Need a GPU Server for the Demo?
Short answer: No. Here’s the breakdown:

Question	Answer
Can the Xneelo dedicated server run the demo?	Yes — the application logic, database, and dashboard run perfectly on Xneelo or even on Vercel/local for the demo. You do NOT need a GPU.
Can the Xneelo server run Chatterbox TTS?	No — Xneelo TruServ has no GPU. Chatterbox on CPU is 5–10x slower than real-time and unusable for live calls.
Do I need to provision a GPU server now?	No — use ElevenLabs API for the demo. GPU server is for production self-hosting, which happens in Phase 2 of the full build.
Where should I host the demo?	Recommended: Local development for Days 1–9, then deploy to Vercel for the client meeting on Day 10. This is the fastest path.
What about the Xneelo server?	Skip it for the demo. Provision it only when the client signs and the full build kicks off. This avoids a R3,500 monthly cost while pitching.

Prerequisites — Before Day 1
Before starting, make sure you have the following installed and accounts ready. This typically takes 2–3 hours.

Software to Install Locally
•	Node.js 22 LTS (https://nodejs.org)
•	Python 3.11+ (for LiveKit Agents SDK — https://python.org)
•	Git (https://git-scm.com)
•	VS Code or Cursor (https://cursor.com — strongly recommended for AI-assisted dev)
•	PostgreSQL 16 (or use Neon.tech / Supabase free tier instead)
•	ngrok (https://ngrok.com — essential for receiving Twilio webhooks during local development)

Accounts to Sign Up For (All Free Tiers Sufficient)
Service	Purpose	Free Tier	Sign Up URL
Twilio	Phone number + call routing	$15 trial credit (~750 demo minutes)	twilio.com
LiveKit Cloud	Voice agent orchestration (WebRTC)	Generous free tier	cloud.livekit.io
OpenAI	GPT-4o LLM for intent + responses	Pay-as-you-go (~$5 covers demo)	platform.openai.com
Deepgram	Speech-to-text (SA accent support)	$200 free credit	deepgram.com
ElevenLabs	Text-to-speech (voice synthesis)	10K chars/month free	elevenlabs.io
Clerk	Auth + multi-tenancy	Free up to 10K MAU	clerk.com
Neon	PostgreSQL database (serverless)	Generous free tier	neon.tech
Vercel	Demo deployment	Free hobby tier	vercel.com
GitHub	Code repository	Free	github.com
Cal.com	Calendar booking integration	Free self-hosted or hosted tier	cal.com

Total demo cost in API spend
If you use free tiers efficiently, the entire 10-day build will cost under R200 (~$10) in API spend. Twilio takes ~$5 for testing calls, OpenAI takes ~$3 for LLM calls during development, the rest fits in free tiers.

Day 1: Project Foundation
Goal: A running Next.js project with database, authentication, and the basic dashboard layout.

Step 1.1 — Create the Next.js Project
Open your terminal and run:
npx create-next-app@latest ai-receptionist-demo \
  --typescript --tailwind --app --src-dir --import-alias "@/*"
 
cd ai-receptionist-demo
git init
git add .
git commit -m "Initial commit"

Step 1.2 — Install Core Dependencies
# Database & ORM
npm install prisma @prisma/client
npx prisma init
 
# Auth
npm install @clerk/nextjs
 
# UI components (shadcn/ui)
npx shadcn@latest init -d
npx shadcn@latest add button card input label textarea \
  dialog dropdown-menu table badge tabs
 
# Form handling & validation
npm install react-hook-form zod @hookform/resolvers
 
# tRPC for type-safe API
npm install @trpc/server @trpc/client @trpc/react-query \
  @trpc/next @tanstack/react-query
 
# Utilities
npm install date-fns lucide-react clsx tailwind-merge

Step 1.3 — Set Up the Database
Create your Neon database (free at neon.tech), copy the connection string, and add it to .env:
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require"

Replace prisma/schema.prisma with the demo schema:
generator client {
  provider = "prisma-client-js"
}
 
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
 
model Tenant {
  id            String   @id @default(cuid())
  name          String
  phoneNumber   String   @unique  // Twilio number
  greeting      String   @default("Hello, thank you for calling.")
  businessHours Json?    // {mon: {open: "08:00", close: "17:00"}, ...}
  voiceId       String   @default("21m00Tcm4TlvDq8ikWAM")
  faqContent    String?  @db.Text
  ownerEmail    String
  createdAt     DateTime @default(now())
 
  calls         Call[]
  messages      Message[]
  appointments  Appointment[]
}
 
model Call {
  id          String   @id @default(cuid())
  tenantId    String
  callerPhone String
  callerName  String?
  intent      String?  // booking, message, faq, etc.
  transcript  Json?    // array of {role, text, timestamp}
  duration    Int?     // seconds
  recordingUrl String?
  status      String   @default("active") // active, completed, transferred
  createdAt   DateTime @default(now())
 
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
}
 
model Message {
  id          String   @id @default(cuid())
  tenantId    String
  callerName  String
  callerPhone String
  message     String   @db.Text
  delivered   Boolean  @default(false)
  createdAt   DateTime @default(now())
 
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
}
 
model Appointment {
  id          String   @id @default(cuid())
  tenantId    String
  callerName  String
  callerPhone String
  startTime   DateTime
  duration    Int      @default(30) // minutes
  notes       String?
  status      String   @default("confirmed")
  createdAt   DateTime @default(now())
 
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
}

Run the migration:
npx prisma migrate dev --name init
npx prisma generate

Step 1.4 — Set Up Clerk Authentication
Create a Clerk app at clerk.com, copy the API keys to .env.local:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

Wrap your app with ClerkProvider in src/app/layout.tsx, add middleware for protected routes (src/middleware.ts), and create sign-in/sign-up pages. Follow Clerk’s Next.js quickstart — it takes 15 minutes.

Step 1.5 — Seed the Demo Tenant
Create prisma/seed.ts:
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
 
async function main() {
  await prisma.tenant.upsert({
    where: { phoneNumber: "+27600000000" }, // your Twilio number
    update: {},
    create: {
      name: "Joe's Plumbing Cape Town",
      phoneNumber: "+27600000000",
      greeting: "Hello, thanks for calling Joe's Plumbing. " +
        "I'm Joe's AI assistant. How can I help you today?",
      businessHours: {
        mon: { open: "08:00", close: "17:00" },
        tue: { open: "08:00", close: "17:00" },
        wed: { open: "08:00", close: "17:00" },
        thu: { open: "08:00", close: "17:00" },
        fri: { open: "08:00", close: "17:00" },
        sat: { open: "09:00", close: "13:00" },
        sun: null,
      },
      faqContent: `
        Joe's Plumbing - Cape Town's trusted plumbing service since 2010.
        Services: Burst pipes, geyser repair/replacement, blocked drains,
                  leak detection, bathroom installations, emergency callouts.
        Pricing: Standard callout R450. Emergency after-hours R750.
        Service area: Greater Cape Town including Atlantic Seaboard,
                      Southern Suburbs, Northern Suburbs.
        Emergency: For burst pipes or flooding, we have a 24/7 emergency line.
      `,
      ownerEmail: "joe@example.com",
    },
  });
  console.log("Demo tenant seeded.");
}
 
main().finally(() => prisma.$disconnect());

Add to package.json:
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
Then run:
npm install -D tsx
npx prisma db seed

Day 2: Dashboard Skeleton
Goal: A clean dashboard with sidebar navigation, ready to populate with real data on later days.

Step 2.1 — Build the Layout
Create src/app/(dashboard)/layout.tsx with a sidebar containing nav items: Dashboard, Calls, Messages, Appointments, Settings. Use shadcn/ui components and lucide-react icons (PhoneCall, MessageSquare, Calendar, Settings, LayoutDashboard).

Key principle: keep it visually polished. Use Tailwind’s slate/zinc palette, generous whitespace, clear typography. The client will judge the entire platform by what they see.

Step 2.2 — Build the Dashboard Pages (Empty Shells)
•	/dashboard — overview with 4 metric cards (Today’s Calls, Messages, Upcoming Appointments, Avg Call Duration)
•	/dashboard/calls — table of recent calls with caller, intent, duration, transcript-on-click
•	/dashboard/messages — list of messages with caller details and read/unread status
•	/dashboard/appointments — calendar view of upcoming bookings
•	/dashboard/settings — form to configure greeting, voice, FAQ, business hours

Populate them with mock/seed data initially. Real data hooks come on Days 3–7.

Step 2.3 — Set Up tRPC
Create src/server/trpc.ts, src/server/routers/, and src/app/api/trpc/[trpc]/route.ts following the tRPC Next.js App Router setup. Define routers for: tenant, calls, messages, appointments. This gives you end-to-end type safety — critical for moving fast.

Day 3: Twilio Phone Number + ngrok
Goal: A SA phone number that, when called, hits your local Next.js development server.

Step 3.1 — Get a Twilio Phone Number
1.	Sign up at twilio.com (use the $15 trial credit).
2.	Verify your personal SA number for outbound calls (trial accounts can only call verified numbers).
3.	Buy a phone number: Phone Numbers → Buy a number. Search for South Africa numbers (+27). Cost: ~$1/month.
4.	If SA numbers aren’t available on trial, buy a US number (+1) — it works identically for the demo. You can swap to SA later.

Step 3.2 — Install Twilio SDK
npm install twilio

Add to .env.local:
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+27600000000

Step 3.3 — Set Up ngrok for Webhooks
Twilio webhooks need to reach your local dev server. ngrok creates a public URL that tunnels to localhost.
# Install ngrok globally (or download binary)
npm install -g ngrok
 
# In one terminal:
npm run dev  # Next.js on localhost:3000
 
# In another terminal:
ngrok http 3000
Copy the https forwarding URL (something like https://abc123.ngrok-free.app). This becomes your Twilio webhook target.

Step 3.4 — Create the Voice Webhook
Create src/app/api/twilio/voice/route.ts:
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
 
export async function POST(req: NextRequest) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();
 
  // Temporary placeholder — we'll replace with LiveKit on Day 4
  twiml.say(
    { voice: "Polly.Ayanda" },
    "Hello, this is Joe's Plumbing AI assistant. " +
    "We're connecting you to our intelligent system, please hold."
  );
  twiml.pause({ length: 1 });
 
  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}

Step 3.5 — Configure Twilio to Hit Your Webhook
5.	Twilio Console → Phone Numbers → Manage → Active Numbers → click your number.
6.	Under Voice Configuration:
•	A call comes in → Webhook
•	URL: https://YOUR-NGROK-URL.ngrok-free.app/api/twilio/voice
•	HTTP: POST
7.	Save.
8.	Call your Twilio number from your phone. You should hear the placeholder message. 🎉

Milestone reached
If you can call the Twilio number and hear the AI voice, the foundation works. The hardest part of the demo is connecting Twilio to your code — you’ve done it.

Day 4: LiveKit Voice Agent (The Brain)
Goal: Replace the placeholder TwiML with a real LiveKit voice agent that uses Deepgram (STT) + GPT-4o (LLM) + ElevenLabs (TTS).

Why LiveKit?
LiveKit Agents handles the hard parts of voice AI: WebRTC audio transport, turn detection (knowing when the caller stops talking), barge-in (allowing interruption), and streaming the STT → LLM → TTS pipeline. It is the same framework used by ChatGPT Voice mode and is open-source.

Step 4.1 — Set Up LiveKit Cloud
9.	Sign up at cloud.livekit.io
10.	Create a project — name it “ai-receptionist-demo”
11.	Get your LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET from Settings → Keys
12.	Configure SIP integration: Telephony → SIP Trunks → Create Inbound Trunk. LiveKit will provide a SIP URI.

Step 4.2 — Connect Twilio to LiveKit via SIP
In Twilio Console, create a SIP Trunk that forwards calls from your phone number to LiveKit’s SIP URI. LiveKit’s docs have an exact step-by-step guide at docs.livekit.io/sip/quickstarts/configuring-twilio-trunk — follow it.

After this, calls to your Twilio number flow: caller → Twilio → SIP → LiveKit room → your Python agent.

Step 4.3 — Create the Python Agent
Create a separate folder agent/ in your project root:
cd ai-receptionist-demo
mkdir agent && cd agent
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
 
pip install "livekit-agents[openai,deepgram,elevenlabs,silero,turn-detector]" \
  python-dotenv requests

Create agent/.env:
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=APIxxxxx
LIVEKIT_API_SECRET=xxxxx
OPENAI_API_KEY=sk-xxxxx
DEEPGRAM_API_KEY=xxxxx
ELEVENLABS_API_KEY=xxxxx
NEXTJS_API_URL=https://YOUR-NGROK-URL.ngrok-free.app

Create agent/main.py:
import os, requests
from dotenv import load_dotenv
from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import openai, deepgram, elevenlabs, silero
from livekit.plugins.turn_detector.multilingual import MultilingualModel
 
load_dotenv()
 
NEXTJS = os.environ["NEXTJS_API_URL"]
 
# Tenant config will normally come from your DB.
# For the demo, we hardcode Joe's Plumbing.
TENANT_INSTRUCTIONS = """
You are the AI receptionist for Joe's Plumbing in Cape Town.
 
About the business:
- Family-run plumbing business since 2010
- Services: burst pipes, geyser repair/replacement, blocked drains,
  leak detection, bathroom installations
- Standard callout: R450. Emergency after-hours: R750
- Service area: Greater Cape Town
- Hours: Mon-Fri 08:00-17:00, Sat 09:00-13:00, closed Sunday
- Emergency line available 24/7 for burst pipes or flooding
 
Your job:
1. Greet the caller warmly, identify yourself as Joe's AI assistant
2. Listen carefully and detect what they need:
   - BOOKING: schedule a plumber visit
   - MESSAGE: leave a message for Joe
   - FAQ: answer questions about services, hours, pricing, area
   - EMERGENCY: burst pipe, flooding — escalate immediately
3. For BOOKING: collect name, phone, address, issue, preferred time.
   Use the create_appointment tool.
4. For MESSAGE: collect name, phone, message. Use the take_message tool.
5. For FAQ: answer using only the info above.
6. For EMERGENCY: tell them you're connecting them now and use the
   escalate_emergency tool.
 
Speak naturally, warmly, conversationally. Use SA English ("howzit",
"sharp", "lekker") only if the caller uses them first. Keep responses
SHORT — one or two sentences max. Confirm details by repeating them back.
"""
 
class Receptionist(Agent):
    def __init__(self):
        super().__init__(instructions=TENANT_INSTRUCTIONS)
 
    async def on_function_call(self, name, args):
        # Tool calls forward to your Next.js API
        if name == "take_message":
            requests.post(f"{NEXTJS}/api/agent/message", json=args)
            return "Message saved successfully."
        if name == "create_appointment":
            requests.post(f"{NEXTJS}/api/agent/appointment", json=args)
            return "Appointment booked successfully."
        if name == "escalate_emergency":
            requests.post(f"{NEXTJS}/api/agent/emergency", json=args)
            return "Emergency escalated. Connecting now."
        return "Done."
 
async def entrypoint(ctx: agents.JobContext):
    await ctx.connect()
 
    session = AgentSession(
        stt=deepgram.STT(model="nova-3", language="en-ZA"),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=elevenlabs.TTS(voice_id="21m00Tcm4TlvDq8ikWAM"),  # Rachel
        vad=silero.VAD.load(),
        turn_detection=MultilingualModel(),
    )
 
    await session.start(
        room=ctx.room,
        agent=Receptionist(),
        room_input_options=RoomInputOptions(),
    )
    await session.generate_reply(
        instructions="Greet the caller as Joe's Plumbing AI assistant."
    )
 
if __name__ == "__main__":
    agents.cli.run_app(agents.WorkerOptions(entrypoint_fnc=entrypoint))

Run the agent in a third terminal:
cd agent
source .venv/bin/activate
python main.py dev

Step 4.4 — Test the Full Loop
Call your Twilio number again. This time you should hear the LiveKit-powered AI receptionist greeting you in a natural ElevenLabs voice. Try saying:
•	“Hi, I have a burst pipe” → should trigger emergency escalation
•	“What are your hours?” → should answer from FAQ
•	“Can I book a plumber for tomorrow?” → should start booking flow

If something goes wrong
99% of issues are: (1) wrong API key in .env, (2) Twilio SIP trunk misconfigured, (3) ngrok URL changed and Twilio webhook stale. Check the LiveKit Cloud dashboard — you can see live call logs there.

Day 5: Tool Calls — Saving Messages & Appointments
Goal: When the agent collects a message or appointment, save it to the database via your Next.js API.

Step 5.1 — Define the Tool Functions
Update agent/main.py to expose tools the LLM can call. Add this to the Receptionist class:
from livekit.agents.llm import function_tool
 
class Receptionist(Agent):
    def __init__(self):
        super().__init__(instructions=TENANT_INSTRUCTIONS)
 
    @function_tool()
    async def take_message(
        self,
        caller_name: str,
        caller_phone: str,
        message: str,
    ):
        """Save a message from the caller for the business owner.
 
        Args:
            caller_name: The caller's full name
            caller_phone: The caller's phone number
            message: The full message content
        """
        requests.post(f"{NEXTJS}/api/agent/message", json={
            "callerName": caller_name,
            "callerPhone": caller_phone,
            "message": message,
        })
        return f"Message saved. {caller_name}, Joe will get back to you shortly."
 
    @function_tool()
    async def create_appointment(
        self,
        caller_name: str,
        caller_phone: str,
        date_iso: str,
        time_24h: str,
        issue: str,
    ):
        """Book a plumbing appointment.
 
        Args:
            caller_name: Customer name
            caller_phone: Contact number
            date_iso: Date as YYYY-MM-DD
            time_24h: Time as HH:MM (24h format)
            issue: Brief description of the problem
        """
        requests.post(f"{NEXTJS}/api/agent/appointment", json={
            "callerName": caller_name,
            "callerPhone": caller_phone,
            "startTime": f"{date_iso}T{time_24h}:00+02:00",
            "notes": issue,
        })
        return f"Appointment booked for {caller_name} on {date_iso} at {time_24h}."
 
    @function_tool()
    async def escalate_emergency(self, caller_phone: str, issue: str):
        """Escalate an urgent plumbing emergency. Call when caller mentions
        burst pipes, flooding, or any major leak."""
        requests.post(f"{NEXTJS}/api/agent/emergency", json={
            "callerPhone": caller_phone,
            "issue": issue,
        })
        return "Emergency escalated. I'm connecting you to Joe now."

Step 5.2 — Build the Next.js API Endpoints
Create src/app/api/agent/message/route.ts:
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
 
const prisma = new PrismaClient();
const DEMO_TENANT_PHONE = "+27600000000";
 
export async function POST(req: NextRequest) {
  const body = await req.json();
  const tenant = await prisma.tenant.findUnique({
    where: { phoneNumber: DEMO_TENANT_PHONE },
  });
  if (!tenant) return NextResponse.json({ error: "No tenant" }, { status: 404 });
 
  const message = await prisma.message.create({
    data: {
      tenantId: tenant.id,
      callerName: body.callerName,
      callerPhone: body.callerPhone,
      message: body.message,
    },
  });
 
  // (Day 6) Trigger WhatsApp notification to business owner
  return NextResponse.json({ success: true, id: message.id });
}

Repeat for /api/agent/appointment and /api/agent/emergency.

Step 5.3 — Test End-to-End
Call the number again. Try: “Hi, this is John on 0821234567. I want to leave a message that my geyser is leaking and I need a callback tomorrow.” The agent should call take_message, and you should see the message appear in your Prisma Studio (npx prisma studio) and on /dashboard/messages.

Day 6: WhatsApp + Email Notifications
Goal: When a message is taken, notify the business owner via WhatsApp and email.

Step 6.1 — Twilio WhatsApp Sandbox
For the demo, use the Twilio WhatsApp Sandbox (free, no Meta business verification needed):
13.	Twilio Console → Messaging → Try it out → Send a WhatsApp message.
14.	WhatsApp the join code (e.g., “join happy-elephant”) to the sandbox number from your phone.
15.	You can now send WhatsApp messages to your number for free during testing.

Step 6.2 — Notification Service
Create src/lib/notifications.ts:
import twilio from "twilio";
 
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);
 
export async function sendWhatsApp(to: string, body: string) {
  return client.messages.create({
    from: "whatsapp:+14155238886", // Twilio sandbox number
    to: `whatsapp:${to}`,
    body,
  });
}
 
export async function sendOwnerEmail(to: string, subject: string, body: string) {
  // For demo: use Resend (resend.com) free tier - 100 emails/day
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "demo@yourdomain.com",
      to,
      subject,
      text: body,
    }),
  });
  return res.json();
}

Wire it into the message endpoint after saving to DB:
await sendWhatsApp(
  process.env.OWNER_WHATSAPP!,
  `📞 New message from ${body.callerName} (${body.callerPhone}):\n\n${body.message}`
);
await sendOwnerEmail(
  tenant.ownerEmail,
  "New message via AI Receptionist",
  `From: ${body.callerName} (${body.callerPhone})\n\n${body.message}`
);

Now when you leave a demo message, the WhatsApp notification arrives on your phone within seconds. This is the most impressive part of the demo — the client immediately understands the value.

Day 7: Calendar Booking Integration
Goal: When the agent books an appointment, it appears in a real Google Calendar.

Step 7.1 — The Easy Path: Cal.com
Cal.com is open source and has a clean API. For the demo:
16.	Sign up at cal.com (free)
17.	Create an event type “Plumbing Callout (30 min)”
18.	Get your API key from Settings → Developer → API Keys
19.	Use their API to create bookings programmatically

Add to .env.local:
CALCOM_API_KEY=cal_xxxxx
CALCOM_EVENT_TYPE_ID=12345

Update src/app/api/agent/appointment/route.ts:
// After saving to DB, also book in Cal.com:
const calRes = await fetch("https://api.cal.com/v1/bookings", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.CALCOM_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    eventTypeId: parseInt(process.env.CALCOM_EVENT_TYPE_ID!),
    start: body.startTime,
    responses: {
      name: body.callerName,
      email: `${body.callerPhone}@phone.demo`, // placeholder
      notes: body.notes,
    },
    timeZone: "Africa/Johannesburg",
    language: "en",
  }),
});

Cal.com automatically sends confirmation emails and SMS reminders — a huge win for the demo.

Day 8: Dashboard with Real Data
Goal: Replace mock data with live database queries. Make it look polished.

Step 8.1 — Wire Up tRPC Queries
In src/server/routers/calls.ts:
import { z } from "zod";
import { router, protectedProcedure } from "@/server/trpc";
 
export const callsRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().default(20) }))
    .query(async ({ input, ctx }) => {
      return ctx.prisma.call.findMany({
        take: input.limit,
        orderBy: { createdAt: "desc" },
      });
    }),
 
  todayStats: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const calls = await ctx.prisma.call.count({
      where: { createdAt: { gte: today } },
    });
    return { count: calls };
  }),
});

Step 8.2 — Build the Dashboard Cards
In src/app/(dashboard)/dashboard/page.tsx:
"use client";
import { trpc } from "@/lib/trpc";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PhoneCall, MessageSquare, Calendar, Clock } from "lucide-react";
 
export default function DashboardPage() {
  const { data: stats } = trpc.calls.todayStats.useQuery();
  const { data: messages } = trpc.messages.unreadCount.useQuery();
  const { data: appointments } = trpc.appointments.upcomingCount.useQuery();
 
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <MetricCard icon={PhoneCall} title="Calls Today" value={stats?.count ?? 0} />
        <MetricCard icon={MessageSquare} title="Unread Messages" value={messages ?? 0} />
        <MetricCard icon={Calendar} title="Upcoming" value={appointments ?? 0} />
        <MetricCard icon={Clock} title="Avg Duration" value="2:34" />
      </div>
      {/* Recent calls table below */}
    </div>
  );
}

Step 8.3 — Polish the UI
•	Use a clean, modern colour scheme (slate + a single accent like blue or emerald)
•	Add loading skeletons (shadcn has a Skeleton component) so the dashboard never looks empty
•	Add empty states with helpful illustrations or icons (“No calls yet — try calling +27 60 000 0000”)
•	Show transcripts as nicely formatted chat bubbles when a call row is clicked
•	Add a top bar with the demo tenant name and a “Call demo number now” button that shows the Twilio number prominently

Critical demo polish tip
The dashboard is what the client looks at while you describe the system. Spend half a day making it look genuinely beautiful. This is where AI tools like Cursor or v0.dev shine — they can iterate on UI faster than you can describe it.

Day 9: Settings Page + After-Hours Logic
Goal: A settings page where the business owner can configure greeting, voice, hours, FAQ. Plus, the agent should behave differently after hours.

Step 9.1 — Settings Form
Build a tabbed settings page:
•	General — Business name, greeting, time zone
•	Voice — Dropdown of ElevenLabs voices, preview button (plays a sample)
•	Hours — Day-by-day open/close with toggle for closed
•	FAQ — Big textarea for business info (in production this would be RAG-indexed)
•	Notifications — Owner phone (WhatsApp), email, escalation phone

Use react-hook-form + zod for validation. Save via tRPC mutation. The agent reads this config from the DB on each call.

Step 9.2 — After-Hours Detection
In agent/main.py, before starting the session, check if the business is currently open:
from datetime import datetime
import pytz
 
def is_business_open(business_hours: dict) -> bool:
    sa_now = datetime.now(pytz.timezone("Africa/Johannesburg"))
    day_key = ["mon","tue","wed","thu","fri","sat","sun"][sa_now.weekday()]
    today = business_hours.get(day_key)
    if not today:
        return False
    open_t = datetime.strptime(today["open"], "%H:%M").time()
    close_t = datetime.strptime(today["close"], "%H:%M").time()
    return open_t <= sa_now.time() <= close_t
 
# Then conditionally adjust the agent's instructions:
if not is_business_open(tenant_config["businessHours"]):
    instructions += "\n\nIMPORTANT: It is currently after hours. " \
        "Only handle: emergencies (escalate immediately) and message-taking. " \
        "Politely tell callers we'll respond first thing in the morning."

Day 10: Deployment, Testing & Demo Rehearsal
Goal: Production-deployed demo ready for the client meeting tomorrow.

Step 10.1 — Deploy Next.js to Vercel
20.	Push your code to GitHub: git push -u origin main
21.	Go to vercel.com → New Project → Import your repo
22.	Set environment variables (all the ones from .env.local) in Vercel project settings
23.	Deploy — Vercel gives you https://ai-receptionist-demo.vercel.app
24.	Update Twilio webhook URL from ngrok to your Vercel URL
25.	Update NEXTJS_API_URL in your Python agent’s .env

Step 10.2 — Deploy the Python Agent
LiveKit Cloud can host your agent for you (easiest):
# Install LiveKit CLI
brew install livekit-cli  # or download binary
 
# Authenticate
lk cloud auth
 
# From the agent/ folder:
lk agent create
lk agent deploy
Alternatively, deploy the Python agent to a small VPS (DigitalOcean droplet at $4/month or use Railway). Either works.

Step 10.3 — Demo Rehearsal Script
Practice these 4 calls until each takes 60–90 seconds and goes smoothly. Make sure each one demonstrates a different feature.

Call 1: FAQ — Business Hours
•	“Hi, what time are you open on Saturdays?”
•	Show: AI answers from FAQ, hangs up cleanly
•	Show on dashboard: call appears with intent=FAQ, transcript visible

Call 2: Message Taking
•	“Hi, this is Sarah on 0825551234. Could you tell Joe my kitchen sink is blocked and I need someone to come look at it tomorrow morning?”
•	Show: AI confirms details by repeating them back
•	Show on owner phone: WhatsApp message arrives within 5 seconds — this is the WOW moment
•	Show on dashboard: message in inbox

Call 3: Appointment Booking
•	“Hi, I’d like to book a plumber for tomorrow at 10am. My name is David, number 0837778888, my geyser is leaking.”
•	Show: AI checks calendar, confirms slot, books it
•	Show in Cal.com: appointment appears, confirmation email sent
•	Show on dashboard: appointment in calendar view

Call 4: Emergency Escalation
•	“HELP, I have a burst pipe and water is everywhere!”
•	Show: AI detects urgency, says “Connecting you to Joe now”
•	Show on owner phone: emergency WhatsApp arrives, ringing your phone

Step 10.4 — Demo Day Setup
•	Bring two phones: one to make the demo calls from, one as the “owner’s phone” receiving WhatsApp notifications
•	Have the dashboard open on your laptop, full screen, projected if possible
•	Have Cal.com open in another tab to show the booking landing
•	Have a backup demo recording (screen + audio) in case wifi or APIs misbehave
•	Pre-call the agent yourself an hour before to make sure everything works (avoids cold start surprises)

Pre-Demo Checklist (Day 10 Evening)

Functional checks
☐  Twilio number is live and routes correctly
☐  Agent picks up calls within 2 rings
☐  All 4 demo scenarios run end-to-end
☐  WhatsApp notifications arrive within 10 seconds
☐  Dashboard shows real-time updates
☐  Cal.com bookings work and send confirmations

Polish checks
☐  Dashboard looks professional (no placeholder text, no broken layout)
☐  All sample data is realistic (no “Lorem ipsum”)
☐  Loading states are smooth (no flash of empty state)
☐  Settings page demonstrates configurability
☐  Mobile responsive (client may want to see it on their phone)

Safety nets
☐  Backup recording of all 4 calls saved
☐  Vercel deployment URL bookmarked
☐  Twilio account has at least $5 credit remaining
☐  ElevenLabs has at least 5,000 characters left
☐  OpenAI has at least $3 credit
☐  Phone is fully charged with mobile data backup

Time Estimates Summary

Day	Focus	Hours	Output
1	Project foundation, DB, auth	6–7h	Running Next.js with Clerk auth and Prisma DB
2	Dashboard skeleton, tRPC	6–7h	Empty but well-designed dashboard with all pages
3	Twilio number + ngrok	5–6h	Phone number that hits your local code
4	LiveKit voice agent	8–9h	Working AI receptionist conversation
5	Tool calls (DB writes)	6–7h	Messages and appointments save correctly
6	WhatsApp + email	5–6h	Notifications fire on every event
7	Calendar (Cal.com)	5–6h	Real bookings in Cal.com
8	Dashboard with live data	7–8h	Polished, real-data dashboard
9	Settings + after-hours	6–7h	Configurable agent behaviour
10	Deploy + rehearse	8–9h	Production-ready demo, 4 rehearsed scenarios
	TOTAL	62–72 hours	Full working demo over 10 working days

That equates to roughly 6–7 hours of focused work per day. With AI coding assistance (Cursor, Claude Code, GitHub Copilot), this is realistic. Without AI assistance, expect 12–15 working days for the same scope.

Total Demo Build Cost Breakdown

Item	Cost (ZAR)
API spend during 10-day build (all free tiers)	R 0–R 200
Twilio phone number ($1/mo, 1 month)	~R 20
Vercel hosting (free tier sufficient)	R 0
Domain (optional, .co.za on HostAfrica)	R 49 once-off
LiveKit Cloud (free tier covers demo)	R 0
Neon PostgreSQL (free tier)	R 0
Clerk Auth (free tier)	R 0
TOTAL OUT-OF-POCKET	Under R 270
	
Your time (60–70 hours @ self-rate)	Variable

If charging the client a separate “demo deposit” fee, R10,000–R15,000 is reasonable. Apply it as a credit against the full project quote if they sign. This filters out tyre-kickers and partly covers your time.

What This Demo Proves to the Client

•	The complete call pipeline works end-to-end — not just slides and promises
•	South African phone numbers, English accent recognition, local timezone all functional
•	WhatsApp integration is real and working — not vapourware
•	The dashboard concept is real and beautiful — not a Figma mockup
•	You can build this — the client’s biggest unspoken concern is now answered
•	Pricing reasoning becomes credible — R200K is justified by what they’ve seen working

After the demo, the natural next step is signing the full project agreement, paying the 30% deposit (R60,000), and starting Phase 1 of the production build.

What Comes Next: Demo → Production
Once the client signs, the gap from demo to production-ready SaaS includes:

•	Multi-tenancy: Replace hardcoded tenant with proper tenant isolation per Twilio number
•	Tenant onboarding wizard: Self-service signup, voice configuration, FAQ upload
•	Self-hosted Chatterbox TTS on HOSTAFRICA GPU (Phase 2 cost optimisation)
•	Move infrastructure from Vercel to Xneelo dedicated server
•	PayFast billing integration with subscription plans
•	Admin / super-admin portal for managing all tenants
•	RAG-based FAQ system (vector embeddings, accurate answers)
•	Production POPIA compliance: data residency, retention, consent flows
•	Full test suite, CI/CD, monitoring (Sentry + PostHog)
•	Documentation, onboarding videos, support processes

All of this is captured in the main project quote (10–12 weeks, R200,000). The demo is a focused 10-day sprint to prove the concept and earn the engagement.

Final Notes

Use AI coding assistance throughout
Cursor or Claude Code can write 70% of this code if you describe each step clearly. Don’t fight it — lean into it. The 10-day timeline assumes you’re using AI assistance heavily. Ask the AI: “Given my Prisma schema, generate the tRPC router for messages with create, list, and markRead procedures.”

Most common failure point
Twilio → LiveKit SIP integration. Budget half a day for this. Follow LiveKit’s official Twilio guide step-by-step. If stuck, the LiveKit Slack community responds within an hour.

You’ve got this
This stack is well-documented and battle-tested. The hardest part isn’t the technology — it’s discipline (sticking to demo scope without scope-creeping into production features). When in doubt, ask: “Does this make the live demo call better?” If not, defer it.

