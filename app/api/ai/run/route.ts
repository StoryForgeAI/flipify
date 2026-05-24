import OpenAI from "openai";
import { NextResponse } from "next/server";
import { CreditAction, getCreditCost } from "@/lib/credits";
import { debitCredits, getOrCreateCreditAccount } from "@/lib/server/supabase-rest";

type RunRequest = {
  email?: string;
  action: CreditAction;
  prompt?: string;
};

const actionPrompts: Record<CreditAction, string> = {
  product_finder:
    "Return JSON with keys: summary, items. items must be an array of 3 resale opportunities with item, brand, sourceQuery, targetMarketplace, estimatedBuyPriceEUR, estimatedResalePriceEUR, estimatedProfitEUR, dealScore, riskNotes.",
  description_optimizer:
    "Return JSON with keys: title, description, bulletPoints, hashtags, etsyTags. Make it marketplace-ready, accurate, and compelling.",
  pricing_intelligence:
    "Return JSON with keys: marketValueRangeEUR, suggestedListPriceEUR, floorPriceEUR, targetProfitEUR, marginPercent, confidence, pricingNotes.",
  photo_studio:
    "Return JSON with keys: studioPrompt, background, lighting, editingChecklist, marketplacePhotoTips. Do not claim an image file was generated.",
  video_generator:
    "Return JSON with keys: hook, storyboard, captions, voiceover, shotList, socialPostCopy. Make it short-form video ready.",
  template_finder:
    "Return JSON with keys: foundProduct, supplierTrust, seoListing, visualEnhancement, pricing, exportChecklist.",
  template_video:
    "Return JSON with keys: selectedProductPlan, videoPrompt, influencerModel, voiceover, captions, deliveryChecklist."
};

function parseJsonOutput(text: string) {
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }
    try {
      return JSON.parse(match[0]) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as RunRequest;
  const email = body.email;

  if (!email) {
    return NextResponse.json({ error: "You must be logged in before running AI.", cost: getCreditCost(body.action) }, { status: 401 });
  }

  const cost = getCreditCost(body.action);
  const account = await getOrCreateCreditAccount(email);

  if (account.credits < cost) {
    return NextResponse.json({ error: "Not enough credits", credits: account.credits, cost }, { status: 402 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      credits: account.credits,
      cost,
      error: "OpenAI is not configured yet. Add OPENAI_API_KEY in Vercel to enable live AI output."
    }, { status: 503 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.responses.create({
    model: process.env.OPENAI_TEXT_MODEL || "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "You are Flipify, an expert AI fashion resale operating system. Be specific, practical, Etsy-aware, and conservative. Return valid JSON only."
      },
      {
        role: "user",
        content: `${actionPrompts[body.action]}\n\nUser brief:\n${body.prompt || "Generate a useful resale workflow output."}`
      }
    ]
  });
  const structured = parseJsonOutput(response.output_text);
  const debit = await debitCredits(email, cost, {
    reason: body.action,
    prompt: body.prompt?.slice(0, 500)
  });

  return NextResponse.json({
    credits: debit.ok ? debit.credits : account.credits,
    cost,
    result: response.output_text,
    structured
  });
}
