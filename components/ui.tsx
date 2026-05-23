"use client";

import { ArrowRight } from "lucide-react";
import { Tool } from "@/lib/data";
import { cn } from "@/lib/utils";
import { getCreditCost } from "@/lib/credits";
import { useState } from "react";
import { useUser } from "@/components/user-provider";

export function PageHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-5 py-8 sm:px-8 xl:flex-row xl:items-end xl:justify-between">
      <div>
        {eyebrow ? <p className="text-sm font-bold uppercase tracking-wide text-royal">{eyebrow}</p> : null}
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const { email, setCredits, spendLocalCredits } = useUser();
  const [status, setStatus] = useState("Ready");
  const cost = getCreditCost(tool.action);

  const runTool = async () => {
    setStatus("Running AI...");
    try {
      const response = await fetch("/api/ai/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          action: tool.action,
          prompt: `${tool.title}: ${tool.description}`
        })
      });
      const data = (await response.json()) as { credits?: number; error?: string };
      if (!response.ok) {
        setStatus(data.error || "Not enough credits");
        return;
      }
      if (typeof data.credits === "number") {
        setCredits(data.credits);
      }
      setStatus(`${cost} credits spent`);
    } catch {
      setStatus(spendLocalCredits(cost) ? `${cost} preview credits spent` : "Not enough credits");
    }
  };

  return (
    <div className="group flex min-h-64 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-soft">
      <div className={cn("grid h-12 w-12 place-items-center rounded-lg", tool.accent)}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-ink">{tool.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{tool.description}</p>
      <div className="mt-5 inline-flex w-fit items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black text-royal">
        {cost} credits
      </div>
      <p className="mt-2 text-xs font-semibold text-slate-500">{status}</p>
      <button
        onClick={runTool}
        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-royal"
      >
        Try Now
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </button>
    </div>
  );
}

export function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}
