"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Tier {
  tier: string;
  bestfor: string;
  featured?: boolean;
  custom?: boolean;
  zar: { price: string; over: string };
  usd: { price: string; over: string };
  mins: string;
  subm: string;
  feats: string[];
  cta?: string;
  formType?: string;
}

const TIERS: Tier[] = [
  {
    tier: "Starter",
    bestfor: "Sole traders & single-location SMEs",
    zar: { price: "R 899", over: "R 1.80" },
    usd: { price: "$39", over: "$0.10" },
    mins: "300 min",
    subm: "≈ 100 calls / mo",
    feats: ["1 concurrent line", "Chat + voice", "Help-center training"],
  },
  {
    tier: "Growth",
    featured: true,
    bestfor: "Busy SMEs · one sales or support line",
    zar: { price: "R 1,799", over: "R 1.50" },
    usd: { price: "$89", over: "$0.08" },
    mins: "750 min",
    subm: "≈ 250 calls / mo",
    feats: ["2 concurrent lines", "Chat, voice & email", "Basic analytics"],
  },
  {
    tier: "Business",
    bestfor: "Multi-role: reception + sales + support",
    zar: { price: "R 3,499", over: "R 1.20" },
    usd: { price: "$179", over: "$0.07" },
    mins: "2,000 min",
    subm: "≈ 650 calls / mo",
    feats: ["Multi-role agents", "CRM integrations", "Priority routing"],
  },
  {
    tier: "Scale / BPO",
    bestfor: "Call-centre overflow · high volume · multi-agent",
    zar: { price: "R 6,999+", over: "R 0.95" },
    usd: { price: "$349+", over: "$0.05" },
    mins: "5,000+ min",
    subm: "High-volume",
    feats: ["5+ concurrent lines", "Multi-agent", "Premium analytics"],
  },
  {
    tier: "Enterprise",
    custom: true,
    bestfor: "Regulated, high-volume & multi-site operations",
    zar: { price: "Custom", over: "Negotiated" },
    usd: { price: "Custom", over: "Negotiated" },
    mins: "Custom + SLA",
    subm: "Dedicated capacity",
    feats: ["Dedicated numbers", "On-prem & SSO", "Custom SLA & DPA"],
    cta: "Contact sales",
    formType: "sales",
  },
];

const CHK_SVG = (
  <svg viewBox="0 0 24 24">
    <path d="m4 13 4 4 12-12" />
  </svg>
);

const PC_GAP = 18;

function perView() {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth >= 980) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

export function PricingSection() {
  const [cur, setCur] = useState<"zar" | "usd">("zar");
  const [pcIndex, setPcIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  const maxIndex = Math.max(0, TIERS.length - perView());

  const layoutCarousel = useCallback(() => {
    if (!viewportRef.current) return;
    const pv = perView();
    const vw = viewportRef.current.clientWidth;
    const cw = (vw - PC_GAP * (pv - 1)) / pv;
    setCardWidth(cw);
    setPcIndex((i) => Math.min(i, Math.max(0, TIERS.length - pv)));
  }, []);

  useEffect(() => {
    layoutCarousel();
    const handler = () => layoutCarousel();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [layoutCarousel]);

  const offset = -(pcIndex * (cardWidth + PC_GAP));

  return (
    <section className="section" id="pricing">
      <div className="wrap">
        <div className="section-head" style={{ textAlign: "center", margin: "0 auto 14px" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            Pricing
          </p>
          <h2>Pay for minutes, not headcount.</h2>
          <p>
            Tiered monthly plans with generous included minutes and a clear
            per-minute overage — predictable for you, scalable for us.
          </p>
        </div>

        {/* Currency toggle */}
        <div style={{ textAlign: "center" }}>
          <div className="price-toggle">
            <button
              className={cur === "zar" ? "on" : ""}
              onClick={() => setCur("zar")}
            >
              <span>🇿🇦</span> ZAR
            </button>
            <button
              className={cur === "usd" ? "on" : ""}
              onClick={() => setCur("usd")}
            >
              <span>🌍</span> USD
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="price-carousel" style={{ marginTop: 42 }}>
          <button
            className="pc-arrow prev"
            aria-label="Previous plans"
            disabled={pcIndex <= 0}
            onClick={() => setPcIndex((i) => Math.max(0, i - 1))}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <div
            className="pc-viewport"
            ref={viewportRef}
            style={{ visibility: cardWidth > 0 ? "visible" : "hidden" }}
          >
            <div
              className="pc-track"
              style={{ transform: `translateX(${offset}px)` }}
            >
              {TIERS.map((t) => {
                const c = t[cur];
                return (
                  <div
                    key={t.tier}
                    className={`price${t.featured ? " featured" : ""}`}
                    style={{ width: cardWidth || undefined }}
                  >
                    {t.featured && <span className="badge">Most popular</span>}
                    <div className="tier">{t.tier}</div>
                    <p className="bestfor">{t.bestfor}</p>
                    <div className="amt">
                      {c.price}
                      {!t.custom && <small> / mo</small>}
                    </div>
                    <div className="annual">
                      {t.custom ? "Tailored to your volume" : "Annual: ~2 months free"}
                    </div>
                    <div className="mins">
                      <span className="m">
                        {t.mins}
                        {!t.custom && " included"}
                      </span>
                      <span className="sub">{t.subm}</span>
                    </div>
                    <div className="over">
                      {t.custom ? (
                        <>
                          Overage <b>negotiated</b>
                        </>
                      ) : (
                        <>
                          then <b>{c.over}</b> / min overage
                        </>
                      )}
                    </div>
                    <ul>
                      {t.feats.map((f) => (
                        <li key={f}>
                          {CHK_SVG}
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/sign-up"
                      className={`btn ${t.featured ? "btn-primary" : "btn-ghost"}`}
                    >
                      {t.cta ?? "Start free trial"}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            className="pc-arrow next"
            aria-label="More plans"
            disabled={pcIndex >= maxIndex}
            onClick={() => setPcIndex((i) => Math.min(maxIndex, i + 1))}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className="pc-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              className={i === pcIndex ? "on" : ""}
              aria-label={`Go to plan group ${i + 1}`}
              onClick={() => setPcIndex(i)}
            />
          ))}
        </div>

        {/* Add-ons + perks */}
        <div className="price-extras">
          <div className="addons">
            <h4>Add-ons (ZAR)</h4>
            <ul>
              <li>
                <span className="dot" />
                <span>
                  Dedicated +27 number — <b>R150–R350/mo</b>
                </span>
              </li>
              <li>
                <span className="dot" />
                <span>
                  CRM / database integration — <b>from R6,000 setup</b>
                </span>
              </li>
              <li>
                <span className="dot" />
                <span>
                  Custom voice clone — <b>R500 once-off</b>
                </span>
              </li>
              <li>
                <span className="dot" />
                <span>
                  Extra concurrent lines — <b>metered</b>
                </span>
              </li>
              <li>
                <span className="dot" />
                <span>
                  Premium analytics — <b>add-on</b>
                </span>
              </li>
            </ul>
          </div>
          <div className="perks">
            <h4>Every plan includes</h4>
            <ul>
              <li>
                <svg viewBox="0 0 24 24">
                  <path d="m4 13 4 4 12-12" />
                </svg>
                <span>
                  <b>Free 7–14 day trial</b> — no card required.
                </span>
              </li>
              <li>
                <svg viewBox="0 0 24 24">
                  <path d="m4 13 4 4 12-12" />
                </svg>
                <span>
                  <b>Annual billing</b> — get ~2 months free.
                </span>
              </li>
              <li>
                <svg viewBox="0 0 24 24">
                  <path d="m4 13 4 4 12-12" />
                </svg>
                <span>Chat, voice &amp; email in one agent.</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="price-fine">
          Indicative recommendations · excl. VAT · final pricing is yours to set.
        </p>
      </div>
    </section>
  );
}
