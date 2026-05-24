import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Tool } from "@/lib/data";
import { cn } from "@/lib/utils";
import { getCreditCost } from "@/lib/credits";

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
    <div className="flex flex-col gap-4 border-b border-white/10 bg-slate-950 px-5 py-8 text-white sm:px-8 xl:flex-row xl:items-end xl:justify-between">
      <div>
        {eyebrow ? <p className="text-sm font-bold uppercase tracking-wide text-royal">{eyebrow}</p> : null}
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const cost = getCreditCost(tool.action);

  return (
    <Link href={`/tools/${tool.slug}`} className="group relative flex min-h-80 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-5 text-white shadow-soft transition hover:-translate-y-1 hover:border-blue-300/40 hover:shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.35),transparent_34%),radial-gradient(circle_at_90%_10%,rgba(14,165,233,0.2),transparent_30%)] opacity-80" />
      <div className="absolute inset-x-0 top-0 h-1 bg-blue-400 opacity-0 transition group-hover:opacity-100" />
      <div className="flex w-full flex-col">
      <div className={cn("relative grid h-12 w-12 place-items-center rounded-xl bg-white text-royal")}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="relative mt-5 text-xl font-semibold text-white">{tool.title}</h3>
      <p className="relative mt-2 text-sm font-bold text-blue-200">{tool.promise}</p>
      <p className="relative mt-3 flex-1 text-sm leading-6 text-slate-300">{tool.description}</p>
      <div className="relative mt-5 inline-flex w-fit items-center rounded-full border border-blue-300/30 bg-blue-400/20 px-3 py-1 text-xs font-black text-blue-100">
        {cost} credits
      </div>
      <span className="relative mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-royal transition group-hover:bg-blue-50">
        Open full-screen tool
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
      </div>
    </Link>
  );
}

export function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-3">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
