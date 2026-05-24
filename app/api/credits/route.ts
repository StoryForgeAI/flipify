import { NextResponse } from "next/server";
import { getOrCreateCreditAccount } from "@/lib/server/supabase-rest";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing authenticated email" }, { status: 401 });
  }

  const account = await getOrCreateCreditAccount(email);

  return NextResponse.json({
    email: account.email,
    credits: account.credits,
    subscription: account.subscription || "Free"
  });
}
