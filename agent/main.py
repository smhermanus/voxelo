import os
import requests
from dotenv import load_dotenv
from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.agents.llm import function_tool
from livekit.plugins import openai, deepgram, elevenlabs, silero
from livekit.plugins.turn_detector.multilingual import MultilingualModel

load_dotenv()

NEXTJS = os.environ["NEXTJS_API_URL"]

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
        requests.post(f"{NEXTJS}/api/agent/messages", json={
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
        """Escalate an urgent plumbing emergency.
        Call this when the caller mentions burst pipes, flooding, or any major leak.

        Args:
            caller_phone: The caller's phone number
            issue: Brief description of the emergency
        """
        requests.post(f"{NEXTJS}/api/agent/emergency", json={
            "callerPhone": caller_phone,
            "issue": issue,
        })
        return "Emergency escalated. I'm connecting you to Joe now."


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
