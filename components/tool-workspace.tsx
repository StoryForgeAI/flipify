"use client";

import Link from "next/link";
import { ArrowLeft, Copy, Sparkles, Zap } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { useUser } from "@/components/user-provider";
import { tools } from "@/lib/data";
import { getCreditCost } from "@/lib/credits";

type AiResponse = {
  credits?: number;
  cost?: number;
  result?: string;
  structured?: Record<string, unknown>;
  error?: string;
};

type Field = {
  key: string;
  label: string;
  placeholder: string;
  textarea?: boolean;
};

const toolFields: Record<string, Field[]> = {
  product_finder: [
    { key: "niche", label: "Target niche", placeholder: "vintage Adidas, Y2K denim, Nike ACG" },
    { key: "budget", label: "Max buy budget", placeholder: "25 EUR" }
  ],
  description_optimizer: [
    { key: "title", label: "Raw item title", placeholder: "Vintage Adidas Track Jacket" },
    { key: "details", label: "Item details", placeholder: "Brand, size, color, condition, flaws, measurements", textarea: true }
  ],
  pricing_intelligence: [
    { key: "itemName", label: "Name of the item", placeholder: "Vintage Adidas Track Jacket" },
    { key: "budget", label: "Your budget", placeholder: "20 EUR" }
  ],
  photo_studio: [
    { key: "itemName", label: "Product name", placeholder: "Black Nike fleece pullover" },
    { key: "style", label: "Desired studio style", placeholder: "clean eBay hero image, light gray background, premium lighting", textarea: true }
  ]
};

const defaults: Record<string, Record<string, string>> = {
  product_finder: { niche: "vintage Adidas track jackets", budget: "25 EUR" },
  description_optimizer: {
    title: "Vintage Adidas Track Jacket",
    details: "Royal blue, size M, used but clean, light wear, no major flaws, target eBay buyers."
  },
  pricing_intelligence: { itemName: "Vintage Adidas Track Jacket", budget: "20 EUR" },
  photo_studio: {
    itemName: "Vintage Adidas Track Jacket",
    style: "Clean eBay-ready studio shot, soft light gray background, natural shadow, crisp logo detail."
  }
};

export function ToolWorkspace({ slug }: { slug: string }) {
  const tool = tools.find((item) => item.slug === slug) ?? tools[0];
  const Icon = tool.icon;
  const { email, credits, setCredits, spendLocalCredits } = useUser();
  const [values, setValues] = useState<Record<string, string>>(defaults[tool.action] || {});
  const [status, setStatus] = useState("Ready to run");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResponse | null>(null);
  const cost = getCreditCost(tool.action);
  const fields = toolFields[tool.action] || [];

  const prompt = useMemo(
    () =>
      `${tool.title}\n${fields
        .map((field) => `${field.label}: ${values[field.key] || ""}`)
        .join("\n")}`,
    [fields, tool.title, values]
  );

  const displayText = useMemo(() => {
    if (!result) return "";
    if (result.structured) return JSON.stringify(result.structured, null, 2);
    return result.result || result.error || "";
  }, [result]);

  const runAi = async () => {
    setLoading(true);
    setStatus("Running Flipify AI...");
    try {
      const response = await fetch("/api/ai/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: tool.action, prompt })
      });
      const data = (await response.json()) as AiResponse;
      if (!response.ok) {
        setStatus(data.error || "AI run failed");
        setResult(data);
        return;
      }
      if (typeof data.credits === "number") setCredits(data.credits);
      setResult(data);
      setStatus(`${data.cost ?? cost} credits spent. Output ready.`);
    } catch {
      if (!spendLocalCredits(cost)) {
        setStatus(`Not enough credits. This tool costs ${cost}.`);
        return;
      }
      setResult({ cost, credits: credits - cost, structured: buildLocalPreview(tool.action, values) });
      setStatus(`${cost} preview credits spent. Connect OpenAI for live output.`);
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    await navigator.clipboard?.writeText(displayText);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.35),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.24),transparent_28%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/tools" className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15">
            <ArrowLeft className="h-4 w-4" />
            Back to tools
          </Link>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-300/30 bg-blue-400/15 px-3 py-1 text-sm font-black text-blue-100">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-royal text-white">{credits}</span>
            credits available
          </div>
        </div>

        <section className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-royal shadow-soft">
              <Icon className="h-7 w-7" />
            </div>
            <p className="mt-8 text-sm font-black uppercase tracking-wide text-blue-200">{cost} credits per run</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">{tool.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">{tool.promise}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white shadow-2xl sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.key} className={field.textarea ? "block text-sm font-black text-white sm:col-span-2" : "block text-sm font-black text-white"}>
                  {field.label}
                  {field.textarea ? (
                    <textarea
                      value={values[field.key] || ""}
                      onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
                      placeholder={field.placeholder}
                      className="mt-3 min-h-32 w-full resize-none rounded-xl border border-white/10 bg-slate-950 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-300/50 focus:ring-4 focus:ring-blue-400/10"
                    />
                  ) : (
                    <input
                      value={values[field.key] || ""}
                      onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
                      placeholder={field.placeholder}
                      className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950 p-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-300/50 focus:ring-4 focus:ring-blue-400/10"
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button onClick={runAi} disabled={loading} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-royal px-5 py-4 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-600">
                {loading ? <Zap className="h-4 w-4 animate-pulse" /> : <Sparkles className="h-4 w-4" />}
                {loading ? "Generating..." : `Run AI for ${cost} credits`}
              </button>
              <button onClick={copyResult} disabled={!displayText} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-4 text-sm font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
            <p className="mt-3 text-sm font-bold text-slate-400">{status}</p>
            <ResultPanel result={result} />
          </div>
        </section>
      </div>
    </main>
  );
}

function ResultPanel({ result }: { result: AiResponse | null }) {
  const data = result?.structured;

  if (!result) {
    return (
      <div className="mt-5 rounded-xl border border-white/10 bg-slate-950 p-5 text-sm text-slate-400">
        Your AI output will appear here after the run.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mt-5 rounded-xl border border-white/10 bg-slate-950 p-5 text-sm leading-6 text-slate-100">
        {result.error || result.result}
      </div>
    );
  }

  return (
    <div className="mt-5 grid gap-3">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-blue-200">{humanize(key)}</p>
          <div className="mt-2 text-sm leading-6 text-slate-100">
            {renderValue(value)}
          </div>
        </div>
      ))}
    </div>
  );
}

function renderValue(value: unknown): React.ReactNode {
  if (Array.isArray(value)) {
    return (
      <div className="grid gap-2">
        {value.map((item, index) => (
          <div key={index} className="rounded-lg bg-white/10 p-3">
            {typeof item === "object" && item ? renderObject(item as Record<string, unknown>) : String(item)}
          </div>
        ))}
      </div>
    );
  }
  if (typeof value === "object" && value) return renderObject(value as Record<string, unknown>);
  return String(value);
}

function renderObject(value: Record<string, unknown>) {
  return (
    <dl className="grid gap-2">
      {Object.entries(value).map(([key, entry]) => (
        <div key={key} className="grid gap-1 sm:grid-cols-[180px_1fr]">
          <dt className="font-bold text-slate-400">{humanize(key)}</dt>
          <dd className="break-words">{typeof entry === "object" && entry ? JSON.stringify(entry) : String(entry)}</dd>
        </div>
      ))}
    </dl>
  );
}

function humanize(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function buildLocalPreview(action: string, values: Record<string, string>) {
  if (action === "pricing_intelligence") {
    return {
      itemName: values.itemName || "Vintage Adidas Track Jacket",
      recommendedMaxBuyPriceEUR: "18",
      exampleBuySearchLink: "https://www.ebay.com/sch/i.html?_nkw=vintage+adidas+track+jacket",
      suggestedSellPriceEUR: "44",
      expectedProfitEUR: "22",
      marginPercent: "50%",
      confidence: "Preview"
    };
  }
  if (action === "photo_studio") {
    return {
      studioPrompt: `Professional eBay product photo for ${values.itemName || "fashion item"}`,
      background: "Matte charcoal or light gray studio sweep",
      lighting: "Soft front-left light with natural shadow",
      editingChecklist: ["Remove clutter", "Keep texture realistic", "Sharpen brand detail"]
    };
  }
  if (action === "description_optimizer") {
    return {
      title: `${values.title || "Vintage Adidas Track Jacket"} - Clean Retro Sportswear`,
      bulletPoints: ["Clear condition notes", "Brand and size up front", "eBay searchable keywords"],
      searchKeywords: ["vintage adidas", "track jacket", "retro sportswear"]
    };
  }
  return {
    summary: `Best opportunities for ${values.niche || "fashion resale"}`,
    items: [
      {
        item: "Vintage Adidas Track Jacket",
        maxBuyPriceEUR: "18",
        exampleSearchLink: "https://www.ebay.com/sch/i.html?_nkw=vintage+adidas+track+jacket",
        estimatedResalePriceEUR: "44",
        dealScore: 92
      }
    ]
  };
}
