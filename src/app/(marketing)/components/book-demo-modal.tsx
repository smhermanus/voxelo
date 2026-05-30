"use client";

import { useEffect, useRef, useState } from "react";

const INDUSTRIES = [
  "Retail & E-commerce",
  "Insurance",
  "Healthcare",
  "Banking & Fintech",
  "Telecom",
  "Travel & Hospitality",
  "Real Estate",
  "SaaS & Tech Support",
  "Other",
];

const VOLUMES = ["Under 500", "500 – 2,000", "2,000 – 5,000", "5,000+"];

interface FormData {
  name: string;
  email: string;
  company: string;
  industry: string;
  volume: string;
  message: string;
}

const EMPTY: FormData = {
  name: "", email: "", company: "",
  industry: INDUSTRIES[0], volume: VOLUMES[0], message: "",
};

export function BookDemoModal() {
  const [open, setOpen]       = useState(false);
  const [done, setDone]       = useState(false);
  const [data, setData]       = useState<FormData>(EMPTY);
  const [busy, setBusy]       = useState(false);
  const overlayRef            = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => { setOpen(true); setDone(false); setData(EMPTY); };
    window.addEventListener("open-demo-form", handler);
    return () => window.removeEventListener("open-demo-form", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  const handleOverlay = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) close();
  };

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setData((d) => ({ ...d, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name || !data.email || !data.company) return;
    setBusy(true);
    setTimeout(() => { setBusy(false); setDone(true); }, 1200);
  };

  return (
    <div
      className={`modal-overlay${open ? " open" : ""}`}
      ref={overlayRef}
      onClick={handleOverlay}
      aria-hidden={!open}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="formTitle">
        <button className="modal-close" aria-label="Close" onClick={close}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {!done ? (
          <div id="formBody">
            <span className="eyebrow">Book a demo</span>
            <h3 id="formTitle">See Voxelo answer your real customer questions.</h3>
            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="lf_name">Full name</label>
                <input
                  id="lf_name" required placeholder="Mara Velasquez"
                  value={data.name} onChange={set("name")}
                />
              </div>
              <div className="row2">
                <div className="field">
                  <label htmlFor="lf_email">Work email</label>
                  <input
                    id="lf_email" type="email" required placeholder="you@company.com"
                    value={data.email} onChange={set("email")}
                  />
                </div>
                <div className="field">
                  <label htmlFor="lf_company">Company</label>
                  <input
                    id="lf_company" required placeholder="Company name"
                    value={data.company} onChange={set("company")}
                  />
                </div>
              </div>
              <div className="row2">
                <div className="field">
                  <label htmlFor="lf_industry">Industry</label>
                  <select id="lf_industry" value={data.industry} onChange={set("industry")}>
                    {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="lf_volume">Monthly call volume</label>
                  <select id="lf_volume" value={data.volume} onChange={set("volume")}>
                    {VOLUMES.map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="lf_msg">
                  Anything we should know?{" "}
                  <span style={{ fontWeight: 400, color: "var(--g-400)" }}>(optional)</span>
                </label>
                <textarea
                  id="lf_msg" rows={3} placeholder="Tell us about your support setup…"
                  value={data.message} onChange={set("message")}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%" }}
                disabled={busy}
              >
                {busy ? "Sending…" : "Request access"}
              </button>
              <p className="form-fine">No spam. A human replies within one business day.</p>
            </form>
          </div>
        ) : (
          <div className="modal-success">
            <div className="succ-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m4 13 5 5L20 7" />
              </svg>
            </div>
            <h3>You&apos;re in, {data.name.split(" ")[0]}!</h3>
            <p>
              Thanks — our team will reach out within one business day. Prefer email?{" "}
              <a href="mailto:info@voxelo.co.za" style={{ color: "var(--accent)", fontWeight: 600 }}>
                info@voxelo.co.za
              </a>
            </p>
            <button className="btn btn-ghost" onClick={close}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

export function openDemoForm() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-demo-form"));
  }
}
