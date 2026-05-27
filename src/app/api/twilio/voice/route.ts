import { NextResponse } from "next/server";
import twilio from "twilio";
 
export async function POST() {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();
 
  // TRACK B ONLY — this route is used when LiveKit handles the call.
  // In Track A (ElevenLabs demo), Twilio's webhook points directly to ElevenLabs
  // and this endpoint is never called. See agent/elevenlabs/A2-telephony-setup.md.
  twiml.say(
    { voice: "Polly.Joanna" },
    "Hello, this is Joe's Plumbing AI assistant. " +
    "We're connecting you now, please hold."
  );
  twiml.pause({ length: 1 });
 
  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
