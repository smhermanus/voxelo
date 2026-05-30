import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Voxelo",
  description:
    "Frequently asked questions about the Voxelo AI receptionist — setup, pricing, security, and how it works.",
};

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    badge: "Setup",
    chipClass: "chip-setup",
    items: [
      {
        q: "How does the setup process work?",
        a: "Setting up your AI receptionist is quick and completely online. You create your account, then follow a simple guided wizard that walks you through everything: your business name, how you'd like your AI to greet callers, your business hours, which numbers to transfer calls to, and your frequently asked questions. You then choose a voice for your receptionist, point your existing business number to the platform, make a quick test call, and you're live. Most businesses are up and running in about 15 minutes.",
      },
      {
        q: "How long does it take before my AI receptionist is answering calls?",
        a: "For most businesses, about 15 minutes from start to finish. If you have a larger knowledge base — for example a stack of PDFs or documents you'd like your AI to learn from — we can have you fully set up within one working day. More advanced setups, such as connecting your AI to your own customer database, take longer and are arranged separately.",
      },
      {
        q: "Do you need to come to my business to set it up?",
        a: "No. Everything is done remotely and online. There's no installation, no technician visit, and no hardware to fit. You set up your AI receptionist from your computer or phone wherever you are, and our team is available by video call if you'd like a hand.",
      },
      {
        q: "Do I need any special equipment?",
        a: "None at all. There's nothing to buy and nothing to install. You keep your existing phone, your existing number, and your existing setup. The AI receptionist works entirely behind the scenes — all you do is forward your calls to it.",
      },
      {
        q: "Can I keep my existing phone number?",
        a: "Yes, and this is the recommended option. You keep your current number and simply forward your calls to your AI receptionist. Your customers carry on calling the same number they always have — nothing changes for them, except your phone now gets answered every single time. If you'd prefer a brand-new dedicated number instead, we can arrange one, though that takes a few business days for regulatory approval.",
      },
    ],
  },
  {
    id: "how-it-works",
    title: "How It Works",
    badge: "Capability",
    chipClass: "chip-capability",
    items: [
      {
        q: "What can the AI receptionist actually do?",
        a: "Your AI receptionist answers every call instantly, 24 hours a day. It greets callers in your business's name, understands why they're calling, answers common questions about your services, hours, pricing and location, takes messages, books appointments straight into your calendar, screens out spam and sales calls, and transfers urgent or important calls to the right person. After hours, it keeps working — taking messages, handling emergencies, and sending you a summary the next morning.",
      },
      {
        q: "What happens if the AI can't answer a question?",
        a: "Your AI is designed to know its limits. If a caller asks something it isn't sure about, it won't guess or make something up. Instead, it gracefully offers to take a message, or transfers the caller to a real person on your team. You decide in your settings how these situations are handled — for example, which calls should always go through to a human. You're always in control.",
      },
      {
        q: "Can it handle South African accents and the way we speak?",
        a: "Yes. The AI is specifically set up to understand South African English and a range of local accents. It speaks naturally and conversationally, and it can adapt its tone — staying calm and reassuring with a stressed caller, and warm and friendly with a routine enquiry.",
      },
      {
        q: "Will callers know they're talking to an AI?",
        a: "That's up to you. The voice is natural and lifelike, and many callers won't realise. You can choose to have your receptionist introduce itself as a virtual assistant, or simply greet callers in your business's name. The choice of voice, greeting, and tone is yours to configure.",
      },
      {
        q: "Can it send messages on WhatsApp?",
        a: "Yes. Your AI can send WhatsApp messages — for example, a booking confirmation, a quote, or directions — and it can even do this during a phone call. A caller can say \"WhatsApp me that\" and the message arrives while they're still on the line. Customers can also message your business on WhatsApp directly and chat with the same AI receptionist.",
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing & Plans",
    badge: "Pricing",
    chipClass: "chip-pricing",
    items: [
      {
        q: "How much does it cost?",
        a: "Pricing is on a simple monthly subscription, with different plans depending on the size of your business and the features you need. There are no setup fees for the standard self-service plan, and you can start with a free trial to experience it before committing. Speak to us for current plan pricing tailored to your needs.",
      },
      {
        q: "Are there any hidden costs?",
        a: "No. Your monthly subscription covers your AI receptionist. The only optional extras are add-ons you choose yourself — for example a dedicated new phone number, or a custom integration with your own systems. These are always quoted upfront, with no surprises.",
      },
      {
        q: "Is there a free trial?",
        a: "Yes. You can try your AI receptionist before you commit, so you can hear it in action and see how it handles your calls. Get in touch to set one up.",
      },
      {
        q: "Can I cancel any time?",
        a: "Yes. The standard plan is month-to-month with no long lock-in contract. You can cancel whenever you like, and if you decide to leave, your call forwarding simply points back to your own phone as before. Your data can be exported or deleted on request.",
      },
    ],
  },
  {
    id: "data-security",
    title: "Your Data & Security",
    badge: "Security",
    chipClass: "chip-security",
    items: [
      {
        q: "Is my data safe and POPIA compliant?",
        a: "Yes. Protecting your information and your customers' information is a top priority. All data is encrypted, stored securely on South African-based infrastructure, and handled in line with the Protection of Personal Information Act (POPIA). You can request a copy of your data or have it deleted at any time.",
      },
      {
        q: "Where is my data stored?",
        a: "Your data is hosted on secure South African-based servers. This keeps your information within the country's borders, supports POPIA compliance, and means faster, more reliable performance for you and your callers.",
      },
      {
        q: "Are calls recorded?",
        a: "Calls can be recorded and transcribed so you have a record of every conversation, with a searchable history in your dashboard. Callers are informed that calls are recorded, in line with privacy regulations. You control how long recordings are kept.",
      },
      {
        q: "Who can access my information?",
        a: "Only you and the team members you invite. Your data is kept completely separate from every other business on the platform. No other customer can ever see your calls, messages, or information.",
      },
    ],
  },
  {
    id: "reliability",
    title: "Reliability",
    badge: "Uptime",
    chipClass: "chip-uptime",
    items: [
      {
        q: "What happens during load-shedding?",
        a: "Your AI receptionist lives in the cloud, not in your office, so it keeps answering calls even when your power is out. As long as your calls are being forwarded, your virtual receptionist carries on working through load-shedding — which is exactly when a missed call is most likely. Worth knowing: if load-shedding affects your own landline or office equipment, you can set your number to forward to the AI automatically when your line is unreachable, so you never miss a call even when the lights are off.",
      },
      {
        q: "Is it really available 24/7?",
        a: "Yes. Your AI receptionist never sleeps, never takes a lunch break, and never calls in sick. It answers every call, day or night, weekends and public holidays included. After hours it takes messages and handles emergencies according to your instructions, then sends you a summary in the morning.",
      },
      {
        q: "What if a call comes in while another is already in progress?",
        a: "Unlike a human receptionist who can only handle one call at a time, your AI can answer many calls simultaneously. Every caller gets answered instantly — no engaged tone, no holding, no voicemail.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      {/* ── Hero ── */}
      <div className="faq-hero">
        <div className="wrap">
          <Link
            href="/home"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--ink-soft)", marginBottom: 24, textDecoration: "none" }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to home
          </Link>

          <p className="eyebrow">FAQ</p>
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about getting your AI receptionist up and running.</p>

          <a href="/documents/FAQ-Client-Facing.pdf" download className="faq-dl-btn">
            <svg viewBox="0 0 24 24">
              <path d="M12 3v13M5 16l7 7 7-7" />
              <path d="M4 20h16" />
            </svg>
            Download PDF
          </a>
        </div>
      </div>

      <div className="wrap" style={{ paddingBottom: 100 }}>
        {/* Quick nav chips */}
        <nav className="faq-chips" aria-label="Jump to section">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={`faq-chip ${s.chipClass}`}>
              {s.title}
            </a>
          ))}
        </nav>

        {/* Sections */}
        {sections.map((section) => (
          <div key={section.id} id={section.id} className="faq-section">
            <div className="faq-sec-head">
              <h2>{section.title}</h2>
              <span className={`faq-chip ${section.chipClass}`} style={{ fontSize: 12, padding: "4px 12px" }}>
                {section.badge}
              </span>
            </div>
            <div className="faq-items">
              {section.items.map((item, i) => (
                <details key={i}>
                  <summary>{item.q}</summary>
                  <div className="faq-body">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="faq-cta">
          <h2>Still have questions?</h2>
          <p>
            We&apos;re happy to help. Get in touch and we&apos;ll walk you through how Voxelo
            could work for your business.
          </p>
          <div className="faq-cta-btns">
            <a href="mailto:info@voxelo.co.za" className="btn btn-lg btn-onwhite">
              Get in touch
            </a>
            <Link href="/sign-up" className="btn btn-lg btn-outwhite">
              Start free trial
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
