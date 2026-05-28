import Link from "next/link";
import type { Metadata } from "next";
import {
  PhoneCall, MessageSquare, Calendar, Zap, Shield, Clock,
  ArrowRight, Download, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "AI Receptionist for South African Businesses",
  description:
    "Voxelo answers every call 24/7, takes messages, books appointments, and handles emergencies — all in South African English.",
};

const features = [
  {
    icon: PhoneCall,
    title: "Answers every call",
    description:
      "24/7, no hold music, no voicemail. Every caller is answered instantly — even during load-shedding.",
  },
  {
    icon: MessageSquare,
    title: "Takes messages",
    description:
      "Captures caller name, number, and message. Delivers them to you instantly via WhatsApp and email.",
  },
  {
    icon: Calendar,
    title: "Books appointments",
    description:
      "Collects all booking details and saves them to your dashboard. You confirm, done.",
  },
  {
    icon: Zap,
    title: "Handles emergencies",
    description:
      "Detects urgency, shifts tone, and alerts you immediately. Never miss a burst pipe at 2am.",
  },
  {
    icon: Shield,
    title: "POPIA compliant",
    description:
      "SA-hosted infrastructure, encrypted data, caller consent on recording. Built for the local market.",
  },
  {
    icon: Clock,
    title: "Live in 15 minutes",
    description:
      "Keep your existing number. Forward calls to us. Your AI receptionist is live in minutes — no hardware, no tech visits.",
  },
];

const highlights = [
  "Works through load-shedding",
  "South African English & accents",
  "WhatsApp + phone + email",
  "Month-to-month, no lock-in",
  "POPIA compliant",
  "Rand billing via PayFast",
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-b from-blue-50 to-white py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-100/60 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <Badge variant="secondary" className="mb-4 text-xs font-medium">
            Built for South Africa
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            Never miss a call.
            <span className="text-blue-600"> Ever.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Voxelo is an AI receptionist that answers every call in your business&apos;s name, 24 hours
            a day. It takes messages, books appointments, and escalates emergencies — all in
            natural South African English.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/sign-up">
                Start free trial <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href="/faq">Read the FAQ</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {highlights.map((h) => (
              <span key={h} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-blue-500 shrink-0" />
                {h}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Everything a receptionist does — without the cost
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              One subscription. Unlimited calls. Works across phone and WhatsApp.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                    <f.icon className="size-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SA-specific callout */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            The only missed call is one you chose to miss
          </h2>
          <p className="mt-4 text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Your AI receptionist lives in the cloud — not in your office. So it keeps
            answering calls even when the power is out, when your staff are on lunch,
            or when it&apos;s 11pm on a Sunday.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link href="/sign-up">
                Get started — free trial <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white">
              <Link href="/faq">Have questions? Read the FAQ</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ / Download CTA */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-8 flex flex-col gap-4">
                <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <MessageSquare className="size-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Frequently Asked Questions</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Everything you need to know about setup, pricing, security, and how the AI works.
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-auto pt-2">
                  <Button asChild>
                    <Link href="/faq">Read the FAQ <ArrowRight className="ml-2 size-4" /></Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href="/documents/FAQ-Client-Facing.pdf" download>
                      <Download className="mr-1.5 size-3.5" /> Download PDF
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-8 flex flex-col gap-4">
                <div className="size-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <PhoneCall className="size-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Talk to us</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Want a free demo call? We&apos;ll set up a live demo with your own business details
                    so you can hear it in action before you commit.
                  </p>
                </div>
                <div className="mt-auto pt-2">
                  <Button asChild variant="outline">
                    <Link href="mailto:info@voxelo.co.za">
                      Get in touch <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
