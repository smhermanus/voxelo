"use client";

import { openDemoForm } from "./book-demo-modal";

export function CtaBookDemo() {
  return (
    <button
      className="btn btn-lg"
      onClick={openDemoForm}
      style={{ background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,.5)" }}
    >
      Book a demo
    </button>
  );
}
