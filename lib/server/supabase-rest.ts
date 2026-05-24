import { optionalEnv, requiredEnv } from "@/lib/server/env";
import { STARTER_CREDITS } from "@/lib/credits";

type Json = Record<string, unknown>;

function getSupabaseConfig() {
  return {
    url: optionalEnv("NEXT_PUBLIC_SUPABASE_URL") || optionalEnv("SUPABASE_URL"),
    serviceRoleKey: optionalEnv("SUPABASE_SERVICE_ROLE_KEY")
  };
}

async function supabaseFetch(path: string, init?: RequestInit) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  if (!url || !serviceRoleKey) {
    return null;
  }

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init?.headers
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`);
  }

  return response.json();
}

export async function getOrCreateCreditAccount(email: string) {
  if (!email || email === "aiwithtomx@example.com") {
    throw new Error("A real authenticated email is required for profile creation.");
  }

  const encodedEmail = encodeURIComponent(email);
  const existing = await supabaseFetch(`profiles?email=eq.${encodedEmail}&select=id,email,credits,subscription`);

  if (Array.isArray(existing) && existing[0]) {
    return existing[0] as { id: string; email: string; credits: number; subscription?: string };
  }

  const created = await supabaseFetch("profiles", {
    method: "POST",
    body: JSON.stringify({ email, credits: STARTER_CREDITS, subscription: "Free" })
  });

  if (Array.isArray(created) && created[0]) {
    return created[0] as { id: string; email: string; credits: number; subscription?: string };
  }

  return { id: "local-preview", email, credits: STARTER_CREDITS, subscription: "Free" };
}

export async function debitCredits(email: string, amount: number, meta: Json) {
  const account = await getOrCreateCreditAccount(email);
  if (account.credits < amount) {
    return { ok: false, credits: account.credits, error: "Not enough credits" };
  }

  const nextCredits = account.credits - amount;
  await supabaseFetch(`profiles?email=eq.${encodeURIComponent(email)}`, {
    method: "PATCH",
    body: JSON.stringify({ credits: nextCredits })
  });

  await supabaseFetch("credit_events", {
    method: "POST",
    body: JSON.stringify({
      email,
      amount: -amount,
      reason: meta.reason ?? "ai_usage",
      metadata: meta
    })
  });

  return { ok: true, credits: nextCredits };
}

export async function saveInventoryItem(email: string, item: Json) {
  await supabaseFetch("inventory_items", {
    method: "POST",
    body: JSON.stringify({ email, ...item })
  });
}
