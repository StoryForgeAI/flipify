import { NextResponse } from "next/server";
import { requiredEnv } from "@/lib/server/env";

export async function GET() {
  const clientId = requiredEnv("EBAY_CLIENT_ID");
  const redirectUri = requiredEnv("EBAY_REDIRECT_URI");
  const scopes = [
    "https://api.ebay.com/oauth/api_scope/sell.inventory",
    "https://api.ebay.com/oauth/api_scope/sell.account"
  ].join(" ");

  const url = new URL("https://auth.ebay.com/oauth2/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scopes);

  return NextResponse.json({ url: url.toString(), scopes });
}
