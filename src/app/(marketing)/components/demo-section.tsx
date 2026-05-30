"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { VoiceWave } from "./voice-wave";

interface Industry {
  id: string;
  name: string;
  tag: string;
  icon: string;
  greet: string;
  quick: string[];
  responses: Record<string, string>;
  fallback: string;
}

const INDUSTRIES: Industry[] = [
  {
    id: "retail",
    name: "Lumen Goods",
    tag: "Retail & E-commerce",
    icon: '<path d="M4 7h16l-1.5 12.5a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5z"/><path d="M8.5 7a3.5 3.5 0 0 1 7 0"/>',
    greet: "Hi! I'm Vox, your Lumen Goods assistant. I can track orders, start returns, or help you find something. What's up?",
    quick: ["Where's my order?", "Start a return", "Do you ship internationally?"],
    responses: {
      "Where's my order?": "Your order #LG-84920 is on its way — it left our Cape Town warehouse this morning and is expected by Thursday. I'll send a tracking link to your email now.",
      "Start a return": "No problem! I've initiated return #RET-2047 for your recent order. You'll get a prepaid label via email within the hour. Can I help with anything else?",
      "Do you ship internationally?": "We ship to 34 countries including the US, UK, Germany, and all of Africa. Standard international delivery is 5–10 business days. Would you like a shipping quote?",
    },
    fallback: "Happy to help! For personalised order assistance our team is standing by. Is there anything else I can check for you?",
  },
  {
    id: "insurance",
    name: "Harbor Mutual",
    tag: "Insurance",
    icon: '<path d="M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7z"/><path d="m9 12 2 2 4-4"/>',
    greet: "Hello, I'm Vox at Harbor Mutual. I can help you file a claim, get a quote, or understand your coverage. How can I help today?",
    quick: ["File a claim", "Get a car quote", "What does my policy cover?"],
    responses: {
      "File a claim": "I've opened claim #HM-30812 for you. A claims specialist will call you within 2 hours. In the meantime, please take photos of any damage — they speed up approval significantly.",
      "Get a car quote": "For a 2022 Toyota Corolla in Johannesburg, our comprehensive cover starts at R1,240/month. That includes roadside assist and a R5,000 excess. Want me to refine the quote?",
      "What does my policy cover?": "Your Harbor Gold policy covers comprehensive vehicle damage, third-party liability up to R5M, theft, and natural disasters. Medical expenses up to R50,000 are also included.",
    },
    fallback: "I can help with that. To access your specific policy details I'd need to verify your account first — but our team can assist right away. Shall I transfer you?",
  },
  {
    id: "health",
    name: "Meridian Health",
    tag: "Healthcare",
    icon: '<path d="M12 5v14M5 12h14"/><circle cx="12" cy="12" r="9"/>',
    greet: "Hi, I'm Vox with Meridian Health. I can book appointments, help with prescriptions, or point you to the right care. What do you need?",
    quick: ["Book an appointment", "Refill a prescription", "Find a doctor near me"],
    responses: {
      "Book an appointment": "I have Dr. Nkosi available tomorrow at 10:00 AM or 2:30 PM at our Sandton branch. Which works better for you? I can confirm it right now.",
      "Refill a prescription": "I can see your Metformin prescription is due for renewal. I've sent a refill request to Dr. Patel — it should be ready for collection at Clicks Rosebank by tomorrow afternoon.",
      "Find a doctor near me": "There are 3 Meridian Health GPs within 5km of your registered address. Dr. Chen in Fourways has the next available slot — tomorrow at 08:30. Shall I book it?",
    },
    fallback: "I understand. For clinical questions I'd recommend speaking directly with one of our doctors. I can book you an appointment in the next 2 minutes — would that help?",
  },
  {
    id: "telecom",
    name: "Nova Mobile",
    tag: "Telecom",
    icon: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    greet: "Hey, I'm Vox from Nova Mobile. I can fix connection issues, explain your bill, or upgrade your plan. What's going on?",
    quick: ["My internet is down", "Explain my bill", "Upgrade my plan"],
    responses: {
      "My internet is down": "I can see your line in Johannesburg North is part of an outage affecting about 340 customers — our engineers have been on it since 06:30 and estimate a fix by 11:00 AM. I'll text you the moment you're back online.",
      "Explain my bill": "Your bill this month is R649. That's your Unlimited 100Mbps plan (R599) plus a once-off R50 SIM replacement fee. Everything else is the same as usual. Want me to email you the full itemised breakdown?",
      "Upgrade my plan": "You're on the 50Mbps Home plan at R449/mo. Upgrading to 100Mbps costs R599/mo with no installation fee since your line already supports it. Want me to activate that upgrade now?",
    },
    fallback: "I can look into that right now! If it's a technical issue, let me run a line diagnostic — or I can connect you to a specialist in under a minute. Which would you prefer?",
  },
  {
    id: "bank",
    name: "Arc Bank",
    tag: "Banking & Fintech",
    icon: '<path d="M3 10 12 4l9 6"/><path d="M5 10v8m4-8v8m6-8v8m4-8v8M3 21h18"/>',
    greet: "Hi, I'm Vox at Arc Bank. I can check balances, flag suspicious charges, or help with transfers — securely. How can I help?",
    quick: ["Check my balance", "I see a suspicious charge", "Send a payment"],
    responses: {
      "Check my balance": "Your Arc Cheque account balance is R24,847.50 as of this morning. Your savings account holds R103,200.00. Is there a specific transaction you'd like to review?",
      "I see a suspicious charge": "I can see a R1,299 charge from 'DIGMKT-EU' on the 14th — does that look unfamiliar? I can freeze that merchant category and open a dispute immediately. Shall I proceed?",
      "Send a payment": "To send a payment I'll need to verify your identity first — I've sent a one-time PIN to your registered phone number. Once confirmed, I can process any transfer up to R50,000 instantly.",
    },
    fallback: "For your security, sensitive account actions require identity verification. I can initiate that process now — it takes about 30 seconds. Would you like to proceed?",
  },
  {
    id: "travel",
    name: "Wander",
    tag: "Travel & Hospitality",
    icon: '<path d="M2 12h20M2 12l4-7 3 7M22 12l-4 7-3-7"/><path d="M9 12l3-9 3 9"/>',
    greet: "Hi! I'm Vox from Wander. I can change flights, book hotels, or rescue a tight itinerary. Where are we headed?",
    quick: ["Change my flight", "Book a hotel", "Cancel a reservation"],
    responses: {
      "Change my flight": "Your JNB→CPT flight on the 22nd has 4 available alternatives. The 14:35 with FlySafair is the cheapest change fee at R280. Want me to switch you over now?",
      "Book a hotel": "For Cape Town V&A Waterfront, the Radisson Blu has availability from R2,100/night with free cancellation. The Protea Fire & Ice is R1,450/night. Which would you prefer?",
      "Cancel a reservation": "I can cancel your Durban hotel booking (REF: WDR-9021) — it's fully refundable until midnight tonight. The R4,800 will be back in your account within 3 business days. Confirm?",
    },
    fallback: "On it! For complex itinerary changes I can loop in one of our travel specialists in under a minute. Would that help, or is there something specific I can check right now?",
  },
  {
    id: "realestate",
    name: "Keystone Realty",
    tag: "Real Estate",
    icon: '<path d="M3 11 12 4l9 7"/><path d="M5 10v9h14v-9"/><path d="M10 19v-5h4v5"/>',
    greet: "Hi, I'm Vox at Keystone Realty. I can book viewings, pull up listing details, or give you a quick home valuation. What are you after?",
    quick: ["Book a viewing", "What's my home worth?", "Show 2-bed listings"],
    responses: {
      "Book a viewing": "I have 3 slots for the Sandton property tomorrow: 09:00, 13:00, or 16:30 — all with agent Priya Naidoo. Which works for you? I can confirm and send a calendar invite in 30 seconds.",
      "What's my home worth?": "Based on recent comparable sales in your suburb, homes like yours are going for R2.1M–R2.4M right now. I can book a free, no-obligation formal valuation — would next week work?",
      "Show 2-bed listings": "I've got 7 two-bedroom listings in your search area, from R1.2M to R2.8M. The top-rated is a 2-bed garden apartment in Bryanston at R1.75M — shall I pull up the full details?",
    },
    fallback: "Happy to help! Let me pull up the most relevant listings or connect you with one of our agents who knows the area well. What's your preferred location?",
  },
  {
    id: "saas",
    name: "Stacklane",
    tag: "SaaS & Tech Support",
    icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m8.5 10-2 2 2 2"/><path d="m14 10 2 2-2 2"/>',
    greet: "Hey, I'm Vox from Stacklane support. I can reset access, sort out billing, or troubleshoot an issue. What's going on?",
    quick: ["Reset my password", "Upgrade my plan", "Report a bug"],
    responses: {
      "Reset my password": "Done — I've sent a password reset link to the email on your account. It expires in 15 minutes. If you don't see it, check your spam folder or let me know and I'll resend.",
      "Upgrade my plan": "You're currently on the Starter plan ($39/mo). Upgrading to Growth ($89/mo) unlocks 3 user seats, API access, and advanced analytics. Want me to process that upgrade?",
      "Report a bug": "Thanks for letting us know. I've logged ticket #STK-7741 for the issue you described. Our engineering team will investigate within 4 hours. I'll email you updates automatically.",
    },
    fallback: "I can help with that! Share more details and I can either resolve this right now or escalate to our engineering team with full context. What would you prefer?",
  },
];

type Mode = "chat" | "call";
interface Message { role: "bot" | "user"; text: string; }
interface Caption { label: string; text: string; }

export function DemoSection() {
  const [activeId, setActiveId]   = useState(INDUSTRIES[0].id);
  const [messages, setMessages]   = useState<Message[]>([{ role: "bot", text: INDUSTRIES[0].greet }]);
  const [input, setInput]         = useState("");
  const [busy, setBusy]           = useState(false);
  const [mode, setMode]           = useState<Mode>("chat");
  const [callSecs, setCallSecs]   = useState(0);
  const [caption, setCaption]     = useState<Caption>({ label: "", text: "" });
  const [speaking, setSpeaking]   = useState(false);
  const [muted, setMuted]         = useState(false);
  const [listening, setListening] = useState(false);

  const logRef      = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const callSecsRef = useRef(0);
  const mutedRef    = useRef(false);
  const recogRef    = useRef<unknown>(null);

  useEffect(() => { mutedRef.current = muted; }, [muted]);

  const active = INDUSTRIES.find((i) => i.id === activeId) ?? INDUSTRIES[0];

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopSpeak = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined") return;
    const fallbackMs = Math.min(6000, 1200 + text.length * 32);
    if (!window.speechSynthesis || mutedRef.current) {
      setSpeaking(true);
      setTimeout(() => setSpeaking(false), fallbackMs);
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const loadAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find((v) => /en[-_]US/i.test(v.lang) && /female|samantha|google us/i.test(v.name)) ||
        voices.find((v) => /en[-_]/i.test(v.lang)) ||
        voices[0] ||
        null;
      if (preferred) u.voice = preferred;
      u.rate = 1.04;
      u.pitch = 1.02;
      u.onstart = () => setSpeaking(true);
      u.onend   = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    };
    if (window.speechSynthesis.getVoices().length > 0) {
      loadAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => { loadAndSpeak(); };
    }
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    callSecsRef.current = 0;
    setCallSecs(0);
    timerRef.current = setInterval(() => {
      callSecsRef.current += 1;
      setCallSecs(callSecsRef.current);
    }, 1000);
  }, []);

  const startCall = useCallback((ind: Industry) => {
    stopSpeak();
    startTimer();
    setCaption({ label: "Vox", text: ind.greet });
    speak(ind.greet);
  }, [stopSpeak, startTimer, speak]);

  const stopCall = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopSpeak();
  }, [stopSpeak]);

  const handleSelect = useCallback((id: string) => {
    if (busy) return;
    const ind = INDUSTRIES.find((i) => i.id === id) ?? INDUSTRIES[0];
    setActiveId(id);
    setMessages([{ role: "bot", text: ind.greet }]);
    if (mode === "call") startCall(ind);
  }, [busy, mode, startCall]);

  const handleSetMode = useCallback((m: Mode) => {
    if (m === mode) return;
    setMode(m);
    if (m === "call") {
      const ind = INDUSTRIES.find((i) => i.id === activeId) ?? INDUSTRIES[0];
      startCall(ind);
    } else {
      stopCall();
    }
  }, [mode, activeId, startCall, stopCall]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    setInput("");
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setTimeout(() => {
      const ind = INDUSTRIES.find((i) => i.id === activeId) ?? INDUSTRIES[0];
      const response = ind.responses[trimmed] ?? ind.fallback;
      setMessages((m) => [...m, { role: "bot", text: response }]);
      setBusy(false);
      inputRef.current?.focus();
    }, 900 + Math.random() * 400);
  }, [activeId, busy]);

  const callSay = useCallback((text: string) => {
    if (busy) return;
    setBusy(true);
    stopSpeak();
    setCaption({ label: "You said", text });
    setTimeout(() => {
      setCaption({ label: "Vox is thinking", text: "● ● ●" });
      setTimeout(() => {
        const ind = INDUSTRIES.find((i) => i.id === activeId) ?? INDUSTRIES[0];
        const response = ind.responses[text] ?? ind.fallback;
        setCaption({ label: "Vox", text: response });
        speak(response);
        setBusy(false);
      }, 800 + Math.random() * 400);
    }, 400);
  }, [activeId, busy, stopSpeak, speak]);

  const handleMic = useCallback(() => {
    if (busy) return;
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SR: (new () => unknown) | undefined = win.SpeechRecognition ?? win.webkitSpeechRecognition;
    if (!SR) {
      setCaption({ label: "Heads up", text: "Your browser can't capture mic input here — tap a phrase below to talk to Vox." });
      return;
    }
    if (listening) {
      (recogRef.current as { stop: () => void } | null)?.stop();
      return;
    }
    stopSpeak();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recog: any = new (SR as new () => unknown)();
    recog.lang = "en-US";
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.onresult = (e: { results: { [n: number]: { [n: number]: { transcript: string } } } }) => {
      const t = e.results[0][0].transcript;
      setListening(false);
      recogRef.current = null;
      callSay(t);
    };
    recog.onend  = () => { setListening(false); recogRef.current = null; };
    recog.onerror = () => { setListening(false); recogRef.current = null; };
    try {
      recog.start();
      recogRef.current = recog;
      setListening(true);
    } catch {
      setListening(false);
    }
  }, [busy, listening, stopSpeak, callSay]);

  const handleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    if (next) stopSpeak();
  }, [muted, stopSpeak]);

  const mm = String(Math.floor(callSecs / 60)).padStart(2, "0");
  const ss = String(callSecs % 60).padStart(2, "0");

  return (
    <section className="section vox-demo" id="demo">
      <div className="wrap">
        <div className="demo-head">
          <p className="eyebrow">Live demo</p>
          <h2>Pick an industry. Talk to its agent.</h2>
          <p>
            These agents are really thinking — powered live. Choose a business, then{" "}
            <b>chat</b> or tap <b>Call</b> to hear Vox answer out loud.
          </p>
        </div>

        <div className="demo-layout">
          {/* Industry selector */}
          <div className="ind-list">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind.id}
                className={`ind-btn${ind.id === activeId ? " active" : ""}`}
                onClick={() => handleSelect(ind.id)}
              >
                <span className="ico-box">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    dangerouslySetInnerHTML={{ __html: ind.icon }}
                  />
                </span>
                <span className="meta">
                  <span className="t">{ind.name}</span>
                  <span className="s">{ind.tag}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Phone mockup */}
          <div className="demo-stage">
            <div className="phone">
              <div className="screen">

                {/* Screen header */}
                <div className="scr-head">
                  <div className="scr-avatar">
                    <VoiceWave variant="iris" size={25} />
                  </div>
                  <div>
                    <div className="who">{active.name}</div>
                    <div className="sub">
                      <span className="dot-live" /> Vox · AI agent
                    </div>
                  </div>
                  <div className="seg">
                    <button
                      className={mode === "chat" ? "on" : ""}
                      onClick={() => handleSetMode("chat")}
                    >
                      Chat
                    </button>
                    <button
                      className={mode === "call" ? "on" : ""}
                      onClick={() => handleSetMode("call")}
                    >
                      Call
                    </button>
                  </div>
                </div>

                {/* CHAT VIEW */}
                <div className={`chat-view${mode === "call" ? " off" : ""}`}>
                  <div className="chat-log" ref={logRef}>
                    {messages.map((m, i) => (
                      <div key={i} className={`msg ${m.role}`}>
                        {m.text}
                      </div>
                    ))}
                    {busy && mode === "chat" && (
                      <div className="typing">
                        <span /><span /><span />
                      </div>
                    )}
                  </div>

                  <div className="quick">
                    {active.quick.map((q) => (
                      <button key={q} onClick={() => sendMessage(q)} disabled={busy}>
                        {q}
                      </button>
                    ))}
                  </div>

                  <div className="chat-input">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Type a message…"
                      autoComplete="off"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") sendMessage(input); }}
                    />
                    <button
                      className="send-btn"
                      aria-label="Send"
                      disabled={busy || !input.trim()}
                      onClick={() => sendMessage(input)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* CALL VIEW */}
                <div className={`call-view${mode === "call" ? " on" : ""}`}>
                  <div className="call-top">
                    <div className="nm">{active.name}</div>
                    <div className="tm">{mm}:{ss}</div>
                  </div>

                  <div className={`call-orb${speaking ? " speaking" : ""}`}>
                    <span className="ring r1" />
                    <span className="ring r2" />
                    <span className="ring r3" />
                    <div className="call-disc">
                      <VoiceWave variant="iris" animated={speaking} size={76} />
                    </div>
                  </div>

                  <div className="call-caption">
                    {caption.text && (
                      <>
                        <span className="lbl">{caption.label}</span>
                        {caption.text}
                      </>
                    )}
                  </div>

                  <div className="call-quick">
                    {active.quick.map((q) => (
                      <button key={q} onClick={() => callSay(q)} disabled={busy}>
                        {q}
                      </button>
                    ))}
                  </div>

                  <div className="call-controls">
                    <button
                      className={`call-ctrl mic${listening ? " listening" : ""}`}
                      aria-label={listening ? "Stop listening" : "Speak"}
                      onClick={handleMic}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="3" width="6" height="11" rx="3" />
                        <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                      </svg>
                    </button>

                    <button
                      className="call-ctrl end"
                      aria-label="End call"
                      onClick={() => handleSetMode("chat")}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 9.5C7 5 17 5 22 9.5l-2.5 3-3.5-1v-2.5a13 13 0 0 0-8 0V12l-3.5 1z" />
                      </svg>
                    </button>

                    <button
                      className="call-ctrl"
                      aria-label={muted ? "Unmute" : "Mute"}
                      onClick={handleMute}
                    >
                      {muted ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 5 6 9H2v6h4l5 4z" />
                          <path d="m23 9-6 6M17 9l6 6" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 5 6 9H2v6h4l5 4z" />
                          <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="call-hint">
                    Vox speaks aloud · tap a phrase or the mic to reply
                  </div>
                </div>

              </div>
            </div>

            <p className="demo-disclaimer">
              <b>This is a live demo.</b> Vox uses realistic, industry-specific scripted responses
              to show how it handles real conversations. Voice plays through your browser.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
