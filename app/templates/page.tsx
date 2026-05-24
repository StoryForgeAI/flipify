"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clipboard,
  Download,
  FileVideo,
  ImagePlus,
  Instagram,
  Link as LinkIcon,
  Play,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Volume2,
  Wand2,
  Youtube
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useInventory } from "@/components/inventory-provider";
import { PageHeader, MetricPill } from "@/components/ui";
import { aiFoundProduct, InventoryItem } from "@/lib/data";
import { cn } from "@/lib/utils";
import { CreditAction, getCreditCost } from "@/lib/credits";
import { useUser } from "@/components/user-provider";

const finderSteps = [
  "Targeting",
  "AI Trust Score",
  "SEO Listing Optimization",
  "AI Visual Enhance",
  "Pricing Intelligence",
  "Final Touch & Export"
];

const videoSteps = [
  "Select Product",
  "Video Prompt & Influencer Model",
  "Voiceover & Audio",
  "Smart Captions",
  "Final Delivery"
];

type Workflow = "finder" | "video";

export default function TemplatesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Templates"
        title="Choose a workflow"
        description="Starter credits are enough for quick tools, while full templates require a larger paid credit balance."
      />
      <section className="grid gap-5 px-5 py-8 sm:px-8 lg:grid-cols-2">
        <TemplateCard
          href="/templates/template1"
          title="AI Product Finder & Listing Copier"
          description="Find a product, score seller trust, generate eBay-ready SEO copy, enhance photos, calculate margin, and export."
          cost={getCreditCost("template_finder")}
          icon={ShoppingBag}
        />
        <TemplateCard
          href="/templates/template2"
          title="Reseller Auto-Video & Content Pipeline"
          description="Turn active inventory into video prompts, voiceover scripts, captions, and Pro social posting assets."
          cost={getCreditCost("template_video")}
          icon={FileVideo}
        />
      </section>
    </main>
  );
}

function TemplateCard({
  href,
  title,
  description,
  cost,
  icon: Icon
}: {
  href: string;
  title: string;
  description: string;
  cost: number;
  icon: typeof ShoppingBag;
}) {
  return (
    <Link href={href} className="group relative min-h-96 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-7 text-white shadow-soft transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.45),transparent_36%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.22),transparent_32%)]" />
      <div className="relative flex items-center justify-between">
        <div className="grid h-14 w-14 place-items-center rounded-xl bg-white text-royal">
          <Icon className="h-6 w-6" />
        </div>
        <span className="rounded-full border border-blue-300/30 bg-blue-400/20 px-3 py-1 text-xs font-black text-blue-100">
          {cost} credits
        </span>
      </div>
      <h2 className="relative mt-10 text-3xl font-semibold tracking-tight">{title}</h2>
      <p className="relative mt-4 text-sm leading-6 text-slate-300">{description}</p>
      <span className="relative mt-10 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-royal transition group-hover:bg-blue-50">
        Open full-screen workflow
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export function TemplateWorkflow({
  initialWorkflow = "finder",
  locked = false
}: {
  initialWorkflow?: Workflow;
  locked?: boolean;
}) {
  const [workflow, setWorkflow] = useState<Workflow>(initialWorkflow);
  const [finderStep, setFinderStep] = useState(0);
  const [videoStep, setVideoStep] = useState(0);
  const [title, setTitle] = useState(aiFoundProduct.title);
  const [description, setDescription] = useState(aiFoundProduct.description);
  const [hashtags, setHashtags] = useState(aiFoundProduct.hashtags);
  const [resellPrice, setResellPrice] = useState(aiFoundProduct.suggestedPrice);
  const [published, setPublished] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("inv-1");
  const { items, addItem } = useInventory();
  const { email, credits, setCredits, spendLocalCredits } = useUser();
  const [aiStatus, setAiStatus] = useState("Ready");

  const activeSteps = workflow === "finder" ? finderSteps : videoSteps;
  const activeStep = workflow === "finder" ? finderStep : videoStep;
  const maxStep = activeSteps.length - 1;
  const selectedProduct = useMemo(
    () => items.find((item) => item.id === selectedProductId) ?? items[0],
    [items, selectedProductId]
  );

  const setActiveStep = (step: number) => {
    if (workflow === "finder") {
      setFinderStep(step);
    } else {
      setVideoStep(step);
    }
  };

  const nextStep = () => setActiveStep(Math.min(activeStep + 1, maxStep));
  const previousStep = () => setActiveStep(Math.max(activeStep - 1, 0));

  const publishProduct = () => {
    const item: InventoryItem = {
      id: "workflow-adidas-track-jacket",
      name: aiFoundProduct.name,
      brand: aiFoundProduct.brand,
      status: "Published",
      image: aiFoundProduct.image,
      foundPrice: aiFoundProduct.buyingPrice,
      marketValue: aiFoundProduct.marketValue,
      profit: Math.max(resellPrice - aiFoundProduct.buyingPrice - 2, 0),
      score: aiFoundProduct.score,
      channel: "eBay"
    };
    addItem(item);
    setPublished(true);
  };

  const copyListing = async () => {
    await navigator.clipboard?.writeText(`${title}\n\n${description}\n\n${hashtags}`);
  };

  const runTemplateAi = async () => {
    const action: CreditAction = workflow === "finder" ? "template_finder" : "template_video";
    const cost = getCreditCost(action);
    setAiStatus("Running AI and debiting credits...");

    try {
      const response = await fetch("/api/ai/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          action,
          prompt: `Run the ${workflow} Flipify workflow for a fashion resale item.`
        })
      });
      const data = (await response.json()) as { credits?: number; error?: string };
      if (!response.ok) {
        setAiStatus(data.error || `This workflow needs ${cost} credits.`);
        return;
      }
      if (typeof data.credits === "number") {
        setCredits(data.credits);
      }
      setAiStatus(`AI completed. ${cost} credits spent.`);
    } catch {
      if (spendLocalCredits(cost)) {
        setAiStatus(`Preview AI completed. ${cost} local credits spent.`);
      } else {
        setAiStatus(`Not enough credits. This workflow costs ${cost} credits.`);
      }
    }
  };

  return (
    <main className={cn(locked && "min-h-screen bg-slate-950")}>
      {locked ? (
        <div className="px-5 pt-5 sm:px-8">
          <Link href="/templates" className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15">
            <ArrowLeft className="h-4 w-4" />
            Back to templates
          </Link>
        </div>
      ) : (
        <PageHeader
          eyebrow="Templates"
          title="Workflows & multi-step templates"
          description="Run complete resale workflows with focused steps, live states, and inventory handoff."
        />
      )}
      <section className={cn("px-5 py-8 sm:px-8", locked && "text-white")}>
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-blue-300/30 bg-blue-400/15 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-royal">{credits} credits available</p>
            <p className="mt-1 text-sm text-slate-600">{aiStatus}</p>
          </div>
          <button onClick={runTemplateAi} className="inline-flex items-center justify-center gap-2 rounded-lg bg-royal px-4 py-3 text-sm font-black text-white transition hover:bg-blue-700">
            <Sparkles className="h-4 w-4" />
            Run AI Usage
          </button>
        </div>

        {locked ? null : (
          <div className="inline-flex rounded-lg border border-white/10 bg-white/10 p-1 shadow-sm">
            {[
              ["finder", "AI Product Finder & Listing Copier"],
              ["video", "Reseller Auto-Video & Content Pipeline"]
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setWorkflow(value as Workflow)}
                className={cn(
                  "rounded-md px-4 py-2 text-sm font-bold transition",
                  workflow === value ? "bg-royal text-white" : "text-slate-300 hover:bg-white/10"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div className={cn("grid gap-6 xl:grid-cols-[320px_1fr]", locked ? "mt-0" : "mt-6")}>
          <aside className="rounded-lg border border-white/10 bg-white/10 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Workflow progress</p>
            <div className="mt-5 space-y-2">
              {activeSteps.map((step, index) => (
                <button
                  key={step}
                  onClick={() => setActiveStep(index)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition",
                    index === activeStep
                      ? "border-blue-200 bg-blue-50 text-royal"
                      : index < activeStep
                        ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                        : "border-white/10 bg-white/10 text-slate-300 hover:bg-white/15"
                  )}
                >
                  <span className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-black",
                    index <= activeStep ? "bg-royal text-white" : "bg-slate-100 text-slate-500"
                  )}>
                    {index < activeStep ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <span className="text-sm font-bold">{step}</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="min-h-[650px] rounded-lg border border-white/10 bg-slate-900 p-5 text-white shadow-sm sm:p-7">
            {workflow === "finder" ? (
              <FinderStep
                step={finderStep}
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                hashtags={hashtags}
                setHashtags={setHashtags}
                resellPrice={resellPrice}
                setResellPrice={setResellPrice}
                copyListing={copyListing}
                publishProduct={publishProduct}
                published={published}
              />
            ) : (
              <VideoStep
                step={videoStep}
                items={items}
                selectedProductId={selectedProductId}
                setSelectedProductId={setSelectedProductId}
                selectedProduct={selectedProduct}
              />
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={previousStep}
                disabled={activeStep === 0}
                className="rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous Step
              </button>
              <button
                onClick={nextStep}
                disabled={activeStep === maxStep}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-royal px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Next Step
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function FinderStep({
  step,
  title,
  setTitle,
  description,
  setDescription,
  hashtags,
  setHashtags,
  resellPrice,
  setResellPrice,
  copyListing,
  publishProduct,
  published
}: {
  step: number;
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  hashtags: string;
  setHashtags: (value: string) => void;
  resellPrice: number;
  setResellPrice: (value: number) => void;
  copyListing: () => void;
  publishProduct: () => void;
  published: boolean;
}) {
  if (step === 0) {
    return (
      <StepShell icon={ShoppingBag} title="Targeting" description="Define the resale niche, source profile, and spend limit for this scan.">
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Hashtags or themes" defaultValue="vintage, adidas, gymwear" />
          <Field label="Budget" defaultValue="€10 - €25" />
          <label className="block text-sm font-semibold text-white lg:col-span-2">
            Short product brief
            <textarea defaultValue="Find lightweight branded jackets with strong retro sportswear demand and low sourcing cost." className="mt-2 min-h-36 w-full rounded-lg border border-slate-200 p-4 text-sm outline-none transition focus:border-royal focus:ring-4 focus:ring-blue-50" />
          </label>
        </div>
      </StepShell>
    );
  }

  if (step === 1) {
    return (
      <StepShell icon={ShieldCheck} title="AI Trust Score" description="Review the discovered item, supplier confidence, and purchase links before moving forward.">
        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
            <Image src={aiFoundProduct.image} alt={aiFoundProduct.name} fill className="object-cover" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">{aiFoundProduct.name}</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <MetricPill label="Buying Price" value={`€${aiFoundProduct.buyingPrice}`} />
              <MetricPill label="Market Value" value={`€${aiFoundProduct.marketValue}`} />
              <MetricPill label="Deal Score" value={`${aiFoundProduct.score}/100`} />
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
              <p className="font-bold">{aiFoundProduct.supplier} - {aiFoundProduct.safeScore}% Safe</p>
              <p className="mt-1 text-sm">Disclaimer: Transact at own risk.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-white">
              <LinkIcon className="h-4 w-4 text-royal" />
              Open purchase links
            </button>
          </div>
        </div>
      </StepShell>
    );
  }

  if (step === 2) {
    return (
      <StepShell icon={Wand2} title="SEO Listing Optimization" description="Edit AI-generated listing assets before copying to your marketplace.">
        <div className="space-y-4">
          <Editable label="Title" value={title} onChange={setTitle} />
          <Editable label="Description" value={description} onChange={setDescription} textarea />
          <Editable label="Hashtags" value={hashtags} onChange={setHashtags} />
          <button onClick={copyListing} className="inline-flex items-center gap-2 rounded-lg bg-royal px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
            <Clipboard className="h-4 w-4" />
            Copy to Clipboard
          </button>
        </div>
      </StepShell>
    );
  }

  if (step === 3) {
    return (
      <StepShell icon={ImagePlus} title="AI Visual Enhance" description="Convert raw item photos into clean marketplace studio shots.">
        <div className="grid gap-5 lg:grid-cols-2">
          <PhotoPanel label="Original upload" muted />
          <PhotoPanel label="Studio background result" />
        </div>
      </StepShell>
    );
  }

  if (step === 4) {
    const profit = Math.max(resellPrice - aiFoundProduct.buyingPrice - 2, 0);
    return (
      <StepShell icon={Sparkles} title="Pricing Intelligence" description="Tune resale pricing while Flipify calculates expected profit after estimated platform costs.">
        <div className="grid gap-4 lg:grid-cols-3">
          <MetricPill label="Estimated market value" value={`€${aiFoundProduct.marketValue}`} />
          <label className="rounded-lg border border-white/10 bg-white/10 px-4 py-3">
            <span className="text-xs font-medium text-slate-500">Suggested resell price</span>
            <input type="number" value={resellPrice} onChange={(event) => setResellPrice(Number(event.target.value))} className="mt-1 w-full text-lg font-semibold text-white outline-none" />
          </label>
          <MetricPill label="Potential profit margin" value={`+€${profit}`} />
        </div>
      </StepShell>
    );
  }

  return (
    <StepShell icon={Send} title="Final Touch & Export" description="Package the listing and send it to your product inventory or external marketplace.">
      <div className="rounded-lg border border-white/10 bg-white/10 p-5">
        <p className="text-sm font-bold text-royal">Summary sheet</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
        <p className="mt-3 text-sm font-semibold text-slate-300">{hashtags}</p>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-royal px-4 py-3 text-sm font-bold text-white">
          <Clipboard className="h-4 w-4" />
          Copy & Export to Marketplace
        </button>
        <button onClick={publishProduct} className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-bold text-royal">
          <ShoppingBag className="h-4 w-4" />
          {published ? "Published to Dashboard Inventory" : "Publish to Dashboard Inventory"}
        </button>
      </div>
    </StepShell>
  );
}

function VideoStep({
  step,
  items,
  selectedProductId,
  setSelectedProductId,
  selectedProduct
}: {
  step: number;
  items: InventoryItem[];
  selectedProductId: string;
  setSelectedProductId: (value: string) => void;
  selectedProduct: InventoryItem;
}) {
  if (step === 0) {
    return (
      <StepShell icon={ShoppingBag} title="Select Product" description="Choose an active inventory item for the video content pipeline.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedProductId(item.id)}
              className={cn(
                "overflow-hidden rounded-lg border bg-white/10 text-left transition hover:-translate-y-1 hover:shadow-soft",
                selectedProductId === item.id ? "border-royal ring-4 ring-blue-50" : "border-slate-200"
              )}
            >
              <div className="relative aspect-[4/3]">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-royal">{item.brand}</p>
                <p className="mt-1 text-sm font-bold text-white">{item.name}</p>
              </div>
            </button>
          ))}
        </div>
      </StepShell>
    );
  }

  if (step === 1) {
    return (
      <StepShell icon={FileVideo} title="Video Prompt & Influencer Model" description="Create the short-form content direction and optionally choose a digital try-on model.">
        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <label className="block text-sm font-semibold text-white">
            Video generation prompt
            <textarea defaultValue={`Create a 12-second faceless TikTok showing ${selectedProduct.name} styled as a premium thrift find with quick cuts and price reveal.`} className="mt-2 min-h-48 w-full rounded-lg border border-slate-200 p-4 text-sm outline-none focus:border-royal focus:ring-4 focus:ring-blue-50" />
          </label>
          <label className="block text-sm font-semibold text-white">
            AI Influencer Model
            <select className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-royal focus:ring-4 focus:ring-blue-50">
              <option>None</option>
              <option>Streetwear model</option>
              <option>Minimal studio model</option>
              <option>Gen Z creator model</option>
            </select>
          </label>
        </div>
      </StepShell>
    );
  }

  if (step === 2) {
    return (
      <StepShell icon={Volume2} title="Voiceover & Audio" description="Use AI text-to-speech or upload audio and apply a creator-style voice change.">
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block text-sm font-semibold text-white">
            Text-to-speech script
            <textarea defaultValue="I found this branded vintage piece for under twenty euros and Flipify says the resale margin is looking strong." className="mt-2 min-h-40 w-full rounded-lg border border-slate-200 p-4 text-sm outline-none focus:border-royal focus:ring-4 focus:ring-blue-50" />
          </label>
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-white">
              Upload audio file
              <input type="file" className="mt-2 w-full rounded-lg border border-dashed border-slate-300 bg-slate-950 p-4 text-sm" />
            </label>
            <label className="block text-sm font-semibold text-white">
              Voice Changer
              <select className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-royal focus:ring-4 focus:ring-blue-50">
                <option>Clean creator voice</option>
                <option>Energetic seller</option>
                <option>Calm luxury narrator</option>
              </select>
            </label>
          </div>
        </div>
      </StepShell>
    );
  }

  if (step === 3) {
    return (
      <StepShell icon={Play} title="Smart Captions" description="Preview auto-generated captions and choose a short-form caption style.">
        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <div className="relative aspect-[9/16] overflow-hidden rounded-lg bg-ink">
            <Image src={selectedProduct.image} alt={selectedProduct.name} fill className="object-cover opacity-80" />
            <div className="absolute inset-x-5 bottom-16 rounded-lg bg-white/95 px-4 py-3 text-center text-lg font-black text-white">
              UNDERPRICED FIND
            </div>
          </div>
          <div className="space-y-3">
            {["Bold resale reveal", "Minimal lower-third", "TikTok kinetic captions"].map((style) => (
              <button key={style} className="flex w-full items-center justify-between rounded-lg border border-white/10 px-4 py-3 text-sm font-bold text-white transition hover:border-royal">
                {style}
                <Check className="h-4 w-4 text-royal" />
              </button>
            ))}
          </div>
        </div>
      </StepShell>
    );
  }

  return (
    <StepShell icon={Download} title="Final Delivery" description="Download the final asset or prepare one-click social posting for Pro workflows.">
      <div className="grid gap-5 lg:grid-cols-2">
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-royal px-5 py-4 text-sm font-bold text-white">
          <Download className="h-4 w-4" />
          Download Video
        </button>
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-5">
          <p className="text-sm font-bold text-royal">Pro: One-Click Social Post</p>
          <div className="mt-4 grid gap-3">
            {[
              [Instagram, "Instagram Reels"],
              [Play, "TikTok"],
              [Youtube, "YouTube Shorts"]
            ].map(([Icon, label]) => {
              const SocialIcon = Icon as typeof Instagram;
              return (
                <label key={label as string} className="flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm font-bold text-white">
                  <span className="flex items-center gap-2">
                    <SocialIcon className="h-4 w-4 text-royal" />
                    {label as string}
                  </span>
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-blue-600" />
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </StepShell>
  );
}

function StepShell({
  icon: Icon,
  title,
  description,
  children
}: {
  icon: typeof Sparkles;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-[fadeIn_220ms_ease-out]">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-blue-50 text-royal">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
      <div className="mt-7">{children}</div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="block text-sm font-semibold text-white">
      {label}
      <input defaultValue={defaultValue} className="mt-2 w-full rounded-lg border border-white/10 px-4 py-3 text-sm outline-none transition focus:border-royal focus:ring-4 focus:ring-blue-50" />
    </label>
  );
}

function Editable({
  label,
  value,
  onChange,
  textarea
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-white">
      {label}
      {textarea ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-36 w-full rounded-lg border border-slate-200 p-4 text-sm outline-none transition focus:border-royal focus:ring-4 focus:ring-blue-50" />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 px-4 py-3 text-sm outline-none transition focus:border-royal focus:ring-4 focus:ring-blue-50" />
      )}
    </label>
  );
}

function PhotoPanel({ label, muted }: { label: string; muted?: boolean }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/10 p-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white">
        <Image src={aiFoundProduct.image} alt={label} fill className={cn("object-cover", muted ? "opacity-60 grayscale" : "saturate-125")} />
        {!muted ? (
          <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent" />
        ) : null}
      </div>
      <p className="mt-3 text-sm font-bold text-white">{label}</p>
    </div>
  );
}
