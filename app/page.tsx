import Link from "next/link";
import { Check, CirclePlay, HelpCircle, Sparkles, Zap } from "lucide-react";
import { Logo } from "@/components/logo";
import { LandingCta } from "@/components/landing-cta";

const faqs = [
  {
    question: "What marketplaces does Flipify help with?",
    answer: "Flipify is designed around fashion resale workflows for eBay-first clothing sellers and high-margin marketplace flips."
  },
  {
    question: "Can I use it before buying inventory?",
    answer: "Yes. The finder workflow helps you estimate demand, trust, pricing, and resale margin before you commit money to an item."
  },
  {
    question: "Does Flipify replace manual product research?",
    answer: "It speeds up the repetitive research, listing, pricing, and content work while keeping the final decision in your hands."
  },
  {
    question: "Is the generated content editable?",
    answer: "Every title, description, hashtag set, price, video prompt, and caption block in the workflow is editable before export."
  }
];

const plans = [
  {
    name: "Free",
    price: "€0",
    features: ["10 AI scans", "Basic listing copy", "Starter inventory hub"]
  },
  {
    name: "Pro",
    price: "€19/mo",
    featured: true,
    features: ["Unlimited scan drafts", "Video content pipeline", "Profit intelligence", "Studio backgrounds"]
  },
  {
    name: "Elite",
    price: "€49/mo",
    features: ["Team workflows", "One-click social posting", "Advanced supplier signals", "Priority exports"]
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm font-semibold text-slate-600 transition hover:text-ink sm:block">
            Login
          </Link>
          <LandingCta compact showIcon={false}>Start Free</LandingCta>
        </div>
      </header>

      <section className="glass-grid border-y border-white/10 bg-slate-950">
        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-sm font-bold text-royal">
              <Sparkles className="h-4 w-4" />
              The AI Reselling OS
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              The AI Reselling Operating System
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Don&apos;t just browse. Flip. Scan marketplaces, generate viral content, and launch your automated clothing resell empire.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LandingCta />
              <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-ink transition hover:border-slate-300 hover:shadow-sm">
                <CirclePlay className="h-4 w-4 text-royal" />
                Watch Demo
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/10 p-4 shadow-soft">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">Live Deal Score</p>
                <h2 className="text-xl font-semibold text-white">Marketplace scan result</h2>
              </div>
              <Zap className="h-5 w-5 text-royal" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Brand", "Vintage Adidas Track Jacket"],
                ["Market Value", "€45"],
                ["Found Price", "€12"],
                ["Estimated Profit", "+€25"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-slate-950 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-5">
              <div>
                <p className="text-sm font-bold text-emerald-700">Deal Score</p>
                <p className="text-sm text-emerald-700">High-margin flip detected</p>
              </div>
              <div className="grid h-24 w-24 place-items-center rounded-full bg-emerald-500 text-center text-2xl font-black text-white shadow-lg shadow-emerald-200">
                94/100
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wide text-royal">Pricing</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight">Scale from side hustle to resale engine.</h2>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-lg border p-6 ${plan.featured ? "border-blue-300/30 bg-blue-400/15 shadow-soft" : "border-white/10 bg-white/10"}`}>
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-4 text-4xl font-bold">{plan.price}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-950">
        <div className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
          <h2 className="text-4xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-lg border border-white/10 bg-white/10 p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold">
                  {faq.question}
                  <HelpCircle className="h-5 w-5 text-royal transition group-open:rotate-45" />
                </summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 text-sm text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between">
        <Logo />
        <p>© 2026 Flipify. Built for sharper fashion resellers.</p>
      </footer>
    </main>
  );
}
