import Link from "next/link";
import "./landing.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/app/(marketing)/components/theme-toggle";
import { VoiceWave } from "@/app/(marketing)/components/voice-wave";
import { VoxFab } from "@/app/(marketing)/components/vox-fab";
import { BookDemoModal } from "@/app/(marketing)/components/book-demo-modal";
import { NavBookDemo } from "@/app/(marketing)/components/nav-book-demo";
import { NavSignIn } from "@/app/(marketing)/components/nav-sign-in";
import { SignInModal } from "@/app/(marketing)/components/sign-in-modal";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="vox-page">
        {/* ── Sticky nav ── */}
        <nav className="vox-nav" id="nav">
          <div className="wrap nav-inner">
            <Link href="/home" className="brand" aria-label="Voxelo home">
              <VoiceWave size={34} />
              <span className="wm">
                V<span className="x">o</span>xelo
              </span>
            </Link>

            <div className="nav-links">
              <Link href="/home#demo">Live demo</Link>
              <Link href="/home#how">How it works</Link>
              <Link href="/home#features">Features</Link>
              <Link href="/home#pricing">Pricing</Link>
              <Link href="/faq">FAQ</Link>
            </div>

            <div className="nav-cta">
              <ThemeToggle />
              <NavSignIn />
              <NavBookDemo />
            </div>
          </div>
        </nav>

        <main>{children}</main>

        {/* ── Site footer ── */}
        <footer className="vox-footer">
          <div className="wrap">
            <div className="foot-grid">
              <div className="foot-brand">
                <div className="wm">
                  <VoiceWave variant="rev" size={30} />
                  Voxelo
                </div>
                <p>AI agents that handle every customer conversation — built to drop into any industry.</p>
              </div>
              <div className="foot-col">
                <h4>Product</h4>
                <Link href="/home#demo">Live demo</Link>
                <Link href="/home#features">Features</Link>
                <Link href="/home#pricing">Pricing</Link>
                <Link href="/home#how">How it works</Link>
                <Link href="/faq">FAQ</Link>
              </div>
              <div className="foot-col">
                <h4>Company</h4>
                <Link href="/about">About</Link>
                <Link href="/careers">Careers</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/contact">Contact</Link>
              </div>
              <div className="foot-col">
                <h4>Legal</h4>
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
                <Link href="/security">Security</Link>
                <Link href="/dpa">DPA</Link>
              </div>
            </div>
            <div className="foot-bottom">
              <span>&copy; {new Date().getFullYear()} VOXELO, INC.</span>
              <span>info@voxelo.co.za</span>
            </div>
          </div>
        </footer>

        {/* ── Sticky chat FAB ── */}
        <VoxFab />

        {/* ── Book a demo modal (listens for open-demo-form event) ── */}
        <BookDemoModal />
        {/* ── Sign-in modal (listens for open-sign-in event) ── */}
        <SignInModal />
      </div>
    </ThemeProvider>
  );
}
