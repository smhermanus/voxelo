"use client";

import { useCallback, useRef, useState } from "react";
import { VoiceWave } from "./voice-wave";

interface Message {
  role: "bot" | "user";
  text: string;
}

const GREET =
  "Hi! I'm Vox 👋 I can explain how Voxelo works, walk you through pricing, or get you set up with a demo. What would you like to know?";

const QUICK = ["How does pricing work?", "Which industries?", "Book a demo"];

const ANSWERS: Record<string, string> = {
  "How does pricing work?":
    "Pricing is tiered monthly plans with included minutes, starting at R899/$39/mo (Starter). You only pay a small per-minute overage if you exceed your allowance. Every plan includes a free 7–14 day trial.",
  "Which industries?":
    "Voxelo agents are ready for retail, insurance, healthcare, banking, telecom, travel, real estate, and SaaS — each with industry-specific knowledge and tone. Any industry with customer support needs is a fit.",
  "Book a demo":
    "Great choice! Click 'Book a demo' in the nav or head to our sign-up page to start a free trial. You can have your first agent live in under an hour.",
};

export function VoxFab() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollBottom = useCallback(() => {
    if (logRef.current)
      logRef.current.scrollTop = logRef.current.scrollHeight;
  }, []);

  const openPanel = () => {
    setOpen(true);
    if (!started) {
      setStarted(true);
      setMessages([{ role: "bot", text: GREET }]);
    }
    setTimeout(() => inputRef.current?.focus(), 250);
  };

  const closePanel = () => setOpen(false);

  const send = useCallback(
    (text: string) => {
      const t = text.trim();
      if (!t || busy) return;
      setBusy(true);
      setInput("");
      setMessages((m) => [...m, { role: "user", text: t }]);
      setTimeout(() => {
        const reply =
          ANSWERS[t] ??
          "That's a great question! For a full answer, our team is ready to help — tap 'Book a demo' or head to /sign-up to start your free trial.";
        setMessages((m) => [...m, { role: "bot", text: reply }]);
        setBusy(false);
        scrollBottom();
        inputRef.current?.focus();
      }, 700 + Math.random() * 300);
    },
    [busy, scrollBottom],
  );

  return (
    <>
      {/* FAB button */}
      <button
        className={`vox-fab${open ? " hidden" : ""}`}
        aria-label="Chat with Vox"
        onClick={openPanel}
      >
        <VoiceWave variant="iris" size={30} />
        <span className="fab-label">Chat with Vox</span>
        <span className="fab-dot" />
      </button>

      {/* Chat panel */}
      <div
        className={`vox-panel${open ? " open" : ""}`}
        role="dialog"
        aria-label="Chat with Vox"
      >
        {/* Header */}
        <div className="vox-phead">
          <div className="av">
            <VoiceWave variant="iris" size={24} />
          </div>
          <div>
            <div className="who">Vox</div>
            <div className="st">
              <span className="dot-live" /> Voxelo assistant · online
            </div>
          </div>
          <button className="close" aria-label="Close" onClick={closePanel}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="vox-plog" ref={logRef}>
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.text}
            </div>
          ))}
          {busy && (
            <div className="typing">
              <span /><span /><span />
            </div>
          )}
        </div>

        {/* Quick replies */}
        <div className="vox-quick">
          {QUICK.map((q) => (
            <button key={q} onClick={() => send(q)} disabled={busy}>
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="vox-pinput">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about Voxelo…"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send(input);
            }}
          />
          <button
            className="send-btn"
            aria-label="Send"
            disabled={busy || !input.trim()}
            onClick={() => send(input)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
