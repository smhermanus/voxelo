import Link from "next/link";
import type { Metadata } from "next";
import {
  PhoneCall, MessageSquare, Calendar, Zap, Shield, Clock,
  ArrowRight, Download, CheckCircle2, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "AI Receptionist for South African Businesses",
  description:
    "Voxelo answers every call 24/7, takes messages, books appointments, and handles emergencies — all in South African English.",
};

const features = [
  {
    icon: PhoneCall,
    title: "Answers every call",
    description: "24/7, no hold music, no voicemail. Every caller answered instantly — even during load-shedding.",
    gradient: "from-blue-500/20 to-indigo-500/10",
    iconColor: "text-blue-400",
  },
  {
    icon: MessageSquare,
    title: "Takes messages",
    description: "Captures name, number, and message. Delivers via WhatsApp and email instantly.",
    gradient: "from-violet-500/20 to-purple-500/10",
    iconColor: "text-violet-400",
  },
  {
    icon: Calendar,
    title: "Books appointments",
    description: "Collects all booking details, saves to your dashboard. You confirm — done.",
    gradient: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-400",
  },
  {
    icon: Zap,
    title: "Handles emergencies",
    description: "Detects urgency, shifts tone, alerts you immediately. Never miss a burst pipe at 2am.",
    gradient: "from-orange-500/20 to-red-500/10",
    iconColor: "text-orange-400",
  },
  {
    icon: Shield,
    title: "POPIA compliant",
    description: "SA-hosted infrastructure, encrypted data, caller consent on recording.",
    gradient: "from-sky-500/20 to-cyan-500/10",
    iconColor: "text-sky-400",
  },
  {
    icon: Clock,
    title: "Live in 15 minutes",
    description: "Keep your existing number. Forward calls to us. No hardware, no tech visits.",
    gradient: "from-pink-500/20 to-rose-500/10",
    iconColor: "text-pink-400",
  },
];

const stats = [
  { value: "24/7", label: "Always answering" },
  { value: "15 min", label: "Setup time" },
  { value: "0", label: "Missed calls" },
  { value: "100%", label: "SA-hosted" },
];

const highlights = [
  "Works through load-shedding",
  "SA English & accents",
  "WhatsApp + phone + email",
  "No lock-in contract",
];

export default function HomePage() {
  return (
    <>
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-15px); }
        }
        @keyframes shimmer-text {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 12px rgba(99,102,241,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 11s ease-in-out infinite; }
        .animate-float-fast { animation: float-slow 6s ease-in-out infinite reverse; }
        .hero-text-1 { animation: fade-up 0.7s ease both; }
        .hero-text-2 { animation: fade-up 0.7s 0.15s ease both; }
        .hero-text-3 { animation: fade-up 0.7s 0.3s ease both; }
        .hero-text-4 { animation: fade-up 0.7s 0.45s ease both; }
        .hero-text-5 { animation: fade-up 0.7s 0.6s ease both; }
        .gradient-headline {
          background: linear-gradient(135deg, #fff 0%, #a5b4fc 40%, #818cf8 60%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-text 4s linear infinite;
        }
        .card-hover {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -12px rgba(0,0,0,0.4);
        }
        .glow-btn {
          animation: pulse-ring 2.5s ease-in-out infinite;
        }
      `}</style>

      <div className="flex flex-col bg-[#050816]">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Ambient orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="animate-float-slow absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px]" />
            <div className="animate-float-medium absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[120px]" />
            <div className="animate-float-fast absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
          </div>

          {/* Subtle grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-28 sm:py-36 text-center w-full">

            {/* Badge */}
            <div className="hero-text-1 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-8">
              <Sparkles className="size-3.5" />
              Built for South Africa
            </div>

            {/* Headline */}
            <h1 className="hero-text-2 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              <span className="gradient-headline">Never miss</span>
              <br />
              <span className="text-white">a call. Ever.</span>
            </h1>

            {/* Sub */}
            <p className="hero-text-3 mt-6 text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
              Voxelo is an AI receptionist that answers every call in your business&apos;s name,
              24 hours a day — in natural South African English.
            </p>

            {/* CTA */}
            <div className="hero-text-4 mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="glow-btn w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 shadow-lg shadow-indigo-500/30"
              >
                <Link href="/sign-up">
                  Start free trial <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="w-full sm:w-auto border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
              >
                <Link href="/faq">Read the FAQ</Link>
              </Button>
            </div>

            {/* Trust pills */}
            <div className="hero-text-5 mt-10 flex flex-wrap justify-center gap-3">
              {highlights.map((h) => (
                <span
                  key={h}
                  className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-400"
                >
                  <CheckCircle2 className="size-3.5 text-indigo-400 shrink-0" />
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-[#050816] to-transparent pointer-events-none" />
        </section>

        {/* ── STATS ────────────────────────────────────────────────── */}
        <section className="relative bg-[#050816] py-12 border-y border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl sm:text-4xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-xs text-slate-500 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────── */}
        <section className="relative bg-[#07091c] py-20 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Everything a receptionist does —{" "}
                <span className="text-indigo-400">without the cost</span>
              </h2>
              <p className="mt-3 text-slate-400 max-w-lg mx-auto">
                One subscription. Unlimited calls. Works across phone and WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f) => (
                <div
                  key={f.title}
                  className={`card-hover relative rounded-2xl border border-white/8 bg-linear-to-br ${f.gradient} bg-white/3 p-6 backdrop-blur-sm`}
                >
                  <div className={`size-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${f.iconColor}`}>
                    <f.icon className="size-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-white mb-1.5">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOAD-SHEDDING CALLOUT ─────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#050816] py-20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-indigo-600/15 blur-[80px] rounded-full" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">
              South Africa first
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
              The only missed call is one<br className="hidden sm:block" /> you chose to miss
            </h2>
            <p className="mt-5 text-slate-400 max-w-lg mx-auto leading-relaxed">
              Your AI receptionist lives in the cloud — not in your office. It keeps answering
              through load-shedding, lunch breaks, and 11pm on a Sunday.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25">
                <Link href="/sign-up">
                  Get started — free trial <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="w-full sm:w-auto border border-white/10 text-slate-300 hover:text-white hover:bg-white/5">
                <Link href="/faq">Have questions? Read the FAQ</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── FAQ + CONTACT ─────────────────────────────────────────── */}
        <section className="bg-[#07091c] py-16 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="card-hover rounded-2xl border border-white/8 bg-white/3 p-8 flex flex-col gap-4">
              <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <MessageSquare className="size-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Frequently Asked Questions</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Setup, pricing, data security, and how it all works.
                </p>
              </div>
              <div className="flex items-center gap-3 mt-auto pt-2">
                <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-500">
                  <Link href="/faq">Read the FAQ <ArrowRight className="ml-2 size-3.5" /></Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-white border border-white/10">
                  <a href="/documents/FAQ-Client-Facing.pdf" download>
                    <Download className="mr-1.5 size-3.5" /> PDF
                  </a>
                </Button>
              </div>
            </div>

            <div className="card-hover rounded-2xl border border-white/8 bg-white/3 p-8 flex flex-col gap-4">
              <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <PhoneCall className="size-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Talk to us</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Want a free demo? We&apos;ll set it up with your own business details so you hear
                  it before you commit.
                </p>
              </div>
              <div className="mt-auto pt-2">
                <Button asChild variant="ghost" size="sm" className="border border-white/10 text-slate-300 hover:text-white hover:bg-white/5">
                  <Link href="mailto:info@voxelo.co.za">
                    Get in touch <ArrowRight className="ml-2 size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
