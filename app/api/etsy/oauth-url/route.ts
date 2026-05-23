import crypto from "crypto";
import { NextResponse } from "next/server";
import { requiredEnv } from "@/lib/server/env";

function base64Url(input: Buffer) {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function GET() {
  const clientId = requiredEnv("ETSY_CLIENT_ID");
  const redirectUri = requiredEnv("ETSY_REDIRECT_URI");
  const verifier = base64Url(crypto.randomBytes(32));
  const challenge = base64Url(crypto.createHash("sha256").update(verifier).digest());
  const state = base64Url(crypto.randomBytes(16));

  const url = new URL("https://www.etsy.com/oauth/connect");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "listings_r listings_w shops_r");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");

  return NextResponse.json({
    url: url.toString(),
    codeVerifier: verifier,
    state
  });
}
