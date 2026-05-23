import { NextResponse } from "next/server";
import { getOrCreateCreditAccount } from "@/lib/server/supabase-rest";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") || "aiwithtomx@example.com";
  const account = await getOrCreateCreditAccount(email);

  return NextResponse.json({
    email: account.email,
    credits: account.credits
  });
}
