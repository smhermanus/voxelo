"use client";

import { useEffect, useRef, useState } from "react";
import { SignIn } from "@clerk/nextjs";

export function SignInModal() {
  const [open, setOpen]   = useState(false);
  const overlayRef        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-sign-in", handler);
    return () => window.removeEventListener("open-sign-in", handler);
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

  return (
    <div
      className={`modal-overlay${open ? " open" : ""}`}
      ref={overlayRef}
      onClick={handleOverlay}
      aria-hidden={!open}
    >
      <div className="signin-wrap" role="dialog" aria-modal="true">
        <button className="signin-close" aria-label="Close" onClick={close}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <SignIn
          routing="hash"
          fallbackRedirectUrl="/dashboard"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}

export function openSignIn() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-sign-in"));
  }
}
