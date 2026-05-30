"use client";

import { openDemoForm } from "./book-demo-modal";

export function NavBookDemo() {
  return (
    <button className="btn btn-primary" onClick={openDemoForm}>
      Book a demo
    </button>
  );
}
