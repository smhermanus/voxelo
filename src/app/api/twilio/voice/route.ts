import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
 
export async function POST(req: NextRequest) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();
 
  // Temporary placeholder — we'll replace with LiveKit on Day 4
  twiml.say(
    { voice: "Polly.Joanna" },
    "Hello, this is Stanton's Plumbing AI assistant. " +
    "We're connecting you to our intelligent system, please hold."
  );
  twiml.pause({ length: 1 });
 
  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
