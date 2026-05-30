"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { VoiceWave } from "./voice-wave";
import { openDemoForm } from "./book-demo-modal";

const WORDS = ["retail", "banking", "healthcare", "travel", "insurance", "telecom"];

export function HeroSection() {
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 220);
    }, 2200);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <header className="vox-hero" id="top">
      <div className="wrap hero-grid">
        {/* ── Copy ── */}
        <div className="hero-copy">
          <span className="hero-badge">
            <span className="dot-live" />
            Live agents · Built for South Africa · 24/7
          </span>
          <h1>
            The AI agent that runs your{" "}
            <span className="rot-wrap">
              <span
                className="rot"
                style={{
                  transition: "opacity .22s ease, transform .22s ease",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateY(-8px)",
                  display: "inline-block",
                }}
              >
                {WORDS[wordIdx]}
              </span>
            </span>{" "}
            support.
          </h1>
          <p className="hero-sub">
            Voxelo resolves customer conversations across chat, voice, and email
            — instantly, in your tone, for any industry.
          </p>
          <div className="hero-actions">
            <Link href="#demo" className="btn btn-primary btn-lg">
              Talk to an agent now
            </Link>
            <button className="btn btn-ghost btn-lg" onClick={openDemoForm}>
              Book a demo
            </button>
          </div>
          <div className="hero-trust">
            <div className="avatars">
              <span>LG</span>
              <span>HM</span>
              <span>AB</span>
              <span>+</span>
            </div>
            Trusted by support teams handling millions of conversations.
          </div>
        </div>

        {/* ── Visual ── */}
        <div className="hero-visual">
          <div className="hero-orb">
            <VoiceWave variant="iris" animated size={180} />
          </div>

          <div className="hero-float f1">
            <span className="ic">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m4 13 4 4 12-12" />
              </svg>
            </span>
            <span>
              <span className="k">Resolution rate</span>
              <span className="v">94%</span>
            </span>
          </div>

          <div className="hero-float f2">
            <span className="ic">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4l3 2" />
              </svg>
            </span>
            <span>
              <span className="k">Avg. reply</span>
              <span className="v">0.8s</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
