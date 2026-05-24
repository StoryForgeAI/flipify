"use client";

import Link from "next/link";
import { ArrowRight, Crown, Sparkles, TrendingUp, Zap } from "lucide-react";
import { ToolCard } from "@/components/ui";
import { tools } from "@/lib/data";
import { useUser } from "@/components/user-provider";

export default function HomePage() {
  const { credits, subscription } = useUser();

  return (
    <main>
      <section className="border-b border-slate-200 bg-white px-5 py-8 sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-ink">Hey aiwithtomx!</h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-royal">
                <Crown className="h-3.5 w-3.5" />
                {subscription} Member
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Your AI resale cockpit is ready for today&apos;s flips. Use tools for quick wins, save credits for higher-value AI actions, and export polished listings to Etsy.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/templates" className="inline-flex items-center justify-center gap-2 rounded-lg bg-royal px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-blue-700">
                Launch workflow
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-ink transition hover:border-blue-200 hover:shadow-sm">
                View inventory
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-royal">Free credits</p>
                <p className="text-4xl font-black text-ink">{credits}</p>
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-full bg-royal text-white shadow-soft">
                <Zap className="h-7 w-7" />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white p-3">
                <Sparkles className="h-4 w-4 text-royal" />
                <p className="mt-2 text-sm font-bold text-ink">1-2 tool tries</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <p className="mt-2 text-sm font-bold text-ink">Templates need Pro</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-5 py-8 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.title} tool={tool} />
          ))}
        </div>
      </section>
    </main>
  );
}
