import OpenAI from "openai";
import { NextResponse } from "next/server";
import { CreditAction, getCreditCost } from "@/lib/credits";
import { debitCredits } from "@/lib/server/supabase-rest";

type RunRequest = {
  email?: string;
  action: CreditAction;
  prompt?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as RunRequest;
  const email = body.email || "aiwithtomx@example.com";
  const cost = getCreditCost(body.action);
  const debit = await debitCredits(email, cost, {
    reason: body.action,
    prompt: body.prompt?.slice(0, 500)
  });

  if (!debit.ok) {
    return NextResponse.json({ error: debit.error, credits: debit.credits, cost }, { status: 402 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      credits: debit.credits,
      cost,
      result: "OpenAI is not configured yet. Add OPENAI_API_KEY in Vercel to enable live AI output."
    });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.responses.create({
    model: process.env.OPENAI_TEXT_MODEL || "gpt-4.1-mini",
    input:
      body.prompt ||
      "Generate concise resale listing copy for a high-margin vintage fashion item."
  });

  return NextResponse.json({
    credits: debit.credits,
    cost,
    result: response.output_text
  });
}
