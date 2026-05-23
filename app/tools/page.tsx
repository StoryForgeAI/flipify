"use client";

import { Search } from "lucide-react";
import { PageHeader, ToolCard } from "@/components/ui";
import { tools } from "@/lib/data";
import { useState } from "react";

export default function ToolsPage() {
  const [query, setQuery] = useState("");
  const filteredTools = tools.filter((tool) =>
    `${tool.title} ${tool.description}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main>
      <PageHeader
        eyebrow="Tools"
        title="AI resale tools"
        description="Search the exact five core tools powering Flipify workflows."
      />
      <section className="px-5 py-8 sm:px-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools"
            className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-royal focus:ring-4 focus:ring-blue-50"
          />
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.title} tool={tool} />
          ))}
        </div>
      </section>
    </main>
  );
}
