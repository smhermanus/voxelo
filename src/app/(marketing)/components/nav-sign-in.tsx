"use client";

import { openSignIn } from "./sign-in-modal";

export function NavSignIn() {
  return (
    <button className="btn btn-ghost" onClick={openSignIn}>
      Sign in
    </button>
  );
}
