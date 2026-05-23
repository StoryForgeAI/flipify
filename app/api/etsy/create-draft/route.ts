import { NextResponse } from "next/server";
import { requiredEnv } from "@/lib/server/env";

type EtsyDraftRequest = {
  accessToken: string;
  title: string;
  description: string;
  price: number;
  quantity?: number;
  taxonomyId?: number;
  whoMade?: string;
  whenMade?: string;
};

export async function POST(request: Request) {
  const shopId = requiredEnv("ETSY_SHOP_ID");
  const apiKey = requiredEnv("ETSY_CLIENT_ID");
  const body = (await request.json()) as EtsyDraftRequest;

  if (!body.accessToken) {
    return NextResponse.json({ error: "Missing Etsy OAuth access token" }, { status: 401 });
  }

  const form = new URLSearchParams({
    title: body.title,
    description: body.description,
    price: String(body.price),
    quantity: String(body.quantity || 1),
    who_made: body.whoMade || "someone_else",
    when_made: body.whenMade || "2000_2009",
    taxonomy_id: String(body.taxonomyId || 69150467)
  });

  const response = await fetch(`https://api.etsy.com/v3/application/shops/${shopId}/listings`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      Authorization: `Bearer ${body.accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: form
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
