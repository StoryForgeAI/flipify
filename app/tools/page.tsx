"use client";

import { Search, Sparkles } from "lucide-react";
import { ToolCard } from "@/components/ui";
import { tools } from "@/lib/data";
import { useState } from "react";

export default function ToolsPage() {
  const [query, setQuery] = useState("");
  const filteredTools = tools.filter((tool) =>
    `${tool.title} ${tool.description}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-5 py-10 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.35),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.22),transparent_30%)]" />
        <div className="relative max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-400/15 px-3 py-1 text-sm font-black text-blue-100">
            <Sparkles className="h-4 w-4" />
            AI resale engine
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">Choose your AI tool.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Full-screen workspaces for finding products, optimizing Etsy listings, pricing flips, creating content, and styling product photos.
          </p>
          <div className="relative mt-8 max-w-xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tools"
              className="w-full rounded-xl border border-white/10 bg-white/10 py-4 pl-11 pr-4 text-sm text-white outline-none backdrop-blur transition placeholder:text-slate-400 focus:border-blue-300/50 focus:ring-4 focus:ring-blue-400/10"
            />
          </div>
        </div>
      </section>
      <section className="px-5 py-8 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.title} tool={tool} />
          ))}
        </div>
      </section>
    </main>
  );
}
