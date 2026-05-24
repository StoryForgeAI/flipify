"use client";

import Link from "next/link";
import { ArrowLeft, Copy, Sparkles, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { useUser } from "@/components/user-provider";
import { tools } from "@/lib/data";
import { getCreditCost } from "@/lib/credits";
import { cn } from "@/lib/utils";

type AiResponse = {
  credits?: number;
  cost?: number;
  result?: string;
  structured?: Record<string, unknown>;
  error?: string;
};

const starterPrompts: Record<string, string> = {
  product_finder:
    "Find profitable eBay-friendly vintage fashion items under 25 EUR. Focus on Adidas, Nike, Diesel, gymwear, track jackets, and Y2K denim.",
  description_optimizer:
    "Optimize this listing: Vintage Adidas track jacket, royal blue, used but clean, bought for 12 EUR, target eBay buyers.",
  pricing_intelligence:
    "Analyze resale pricing for a vintage Adidas track jacket bought for 12 EUR with expected market value around 45 EUR.",
  photo_studio:
    "Create a studio photo direction for a messy vintage jacket product photo. Make it premium, clean, eBay-ready."
};

export function ToolWorkspace({ slug }: { slug: string }) {
  const tool = tools.find((item) => item.slug === slug) ?? tools[0];
  const Icon = tool.icon;
  const { email, credits, setCredits, spendLocalCredits } = useUser();
  const [prompt, setPrompt] = useState(starterPrompts[tool.action] || tool.description);
  const [status, setStatus] = useState("Ready to run");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResponse | null>(null);
  const cost = getCreditCost(tool.action);

  const displayText = useMemo(() => {
    if (!result) {
      return "";
    }
    if (result.structured) {
      return JSON.stringify(result.structured, null, 2);
    }
    return result.result || "";
  }, [result]);

  const runAi = async () => {
    setLoading(true);
    setStatus("Running Flipify AI...");

    try {
      const response = await fetch("/api/ai/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          action: tool.action,
          prompt
        })
      });
      const data = (await response.json()) as AiResponse;
      if (!response.ok) {
        setStatus(data.error || "AI run failed");
        setResult(data);
        return;
      }
      if (typeof data.credits === "number") {
        setCredits(data.credits);
      }
      setResult(data);
      setStatus(`${data.cost ?? cost} credits spent. Output ready.`);
    } catch {
      if (!spendLocalCredits(cost)) {
        setStatus(`Not enough credits. This tool costs ${cost}.`);
        return;
      }
      const fallback = buildLocalPreview(tool.action, prompt);
      setResult({ cost, credits: credits - cost, structured: fallback });
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

        <section className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className={cn("grid h-16 w-16 place-items-center rounded-2xl bg-white text-royal shadow-soft")}>
              <Icon className="h-7 w-7" />
            </div>
            <p className="mt-8 text-sm font-black uppercase tracking-wide text-blue-200">{cost} credits per run</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">{tool.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">{tool.description}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["OpenAI powered", "Credit metered", "eBay-ready"].map((badge) => (
                <div key={badge} className="rounded-xl border border-white/10 bg-white/10 p-4 text-sm font-bold text-white backdrop-blur">
                  {badge}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white shadow-2xl sm:p-6">
            <label className="text-sm font-black text-white">
              AI brief
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="mt-3 min-h-44 w-full resize-none rounded-xl border border-white/10 bg-slate-950 p-4 text-sm leading-6 text-white outline-none transition focus:border-blue-300/50 focus:ring-4 focus:ring-blue-400/10"
              />
            </label>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button onClick={runAi} disabled={loading} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-royal px-5 py-4 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                {loading ? <Zap className="h-4 w-4 animate-pulse" /> : <Sparkles className="h-4 w-4" />}
                {loading ? "Generating..." : `Run AI for ${cost} credits`}
              </button>
              <button onClick={copyResult} disabled={!displayText} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-4 text-sm font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
            <p className="mt-3 text-sm font-bold text-slate-500">{status}</p>
            <div className="mt-5 min-h-72 rounded-xl border border-slate-200 bg-slate-950 p-4 text-sm leading-6 text-slate-100">
              <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm">
                {displayText || "Your AI output will appear here after the run."}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function buildLocalPreview(action: string, prompt: string) {
  if (action === "pricing_intelligence") {
    return {
      marketValue: "EUR 42-55",
      suggestedPrice: "EUR 39",
      estimatedProfit: "EUR 25",
      confidence: "Preview"
    };
  }

  if (action === "photo_studio") {
    return {
      background: "Soft light gray studio sweep",
      lighting: "Diffuse daylight from front-left",
      editing: "Remove clutter, preserve fabric texture, sharpen logo"
    };
  }

  if (action === "description_optimizer") {
    return {
      title: "Vintage Adidas Track Jacket - Royal Blue Retro Sportswear",
      description: "Clean retro Adidas track jacket with strong everyday styling potential.",
      hashtags: ["vintageadidas", "trackjacket", "streetwear", "ebayfind"]
    };
  }

  return {
    searchBrief: prompt,
    finds: [
      { item: "Vintage Adidas Track Jacket", buyPrice: "EUR 12", resaleRange: "EUR 39-49", score: 94 },
      { item: "Nike ACG Fleece", buyPrice: "EUR 24", resaleRange: "EUR 60-78", score: 91 }
    ]
  };
}
