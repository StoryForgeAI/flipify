import { NextResponse } from "next/server";
import { optionalEnv } from "@/lib/server/env";

type EbayDraftRequest = {
  accessToken: string;
  sku?: string;
  title: string;
  description: string;
  price: number;
  quantity?: number;
  imageUrls?: string[];
  categoryId?: string;
  condition?: string;
  brand?: string;
  size?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as EbayDraftRequest;
  const marketplaceId = optionalEnv("EBAY_MARKETPLACE_ID") || "EBAY_US";
  const sku = body.sku || `flipify-${Date.now()}`;

  if (!body.accessToken) {
    return NextResponse.json({ error: "Missing eBay OAuth access token" }, { status: 401 });
  }

  const inventoryResponse = await fetch(`https://api.ebay.com/sell/inventory/v1/inventory_item/${encodeURIComponent(sku)}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${body.accessToken}`,
      "Content-Type": "application/json",
      "Content-Language": "en-US",
      "X-EBAY-C-MARKETPLACE-ID": marketplaceId
    },
    body: JSON.stringify({
      availability: {
        shipToLocationAvailability: {
          quantity: body.quantity || 1
        }
      },
      condition: body.condition || "USED_EXCELLENT",
      product: {
        title: body.title,
        description: body.description,
        imageUrls: body.imageUrls || [],
        aspects: {
          Brand: [body.brand || "Unbranded"],
          Size: body.size ? [body.size] : undefined
        }
      }
    })
  });

  if (!inventoryResponse.ok) {
    return NextResponse.json(await inventoryResponse.json().catch(() => ({ error: "eBay inventory item creation failed" })), {
      status: inventoryResponse.status
    });
  }

  const locationKey = optionalEnv("EBAY_MERCHANT_LOCATION_KEY");
  const paymentPolicyId = optionalEnv("EBAY_PAYMENT_POLICY_ID");
  const fulfillmentPolicyId = optionalEnv("EBAY_FULFILLMENT_POLICY_ID");
  const returnPolicyId = optionalEnv("EBAY_RETURN_POLICY_ID");

  if (!locationKey || !paymentPolicyId || !fulfillmentPolicyId || !returnPolicyId || !body.categoryId) {
    return NextResponse.json({
      sku,
      status: "inventory_item_created",
      nextStep:
        "Add EBAY_MERCHANT_LOCATION_KEY, EBAY_PAYMENT_POLICY_ID, EBAY_FULFILLMENT_POLICY_ID, EBAY_RETURN_POLICY_ID, and categoryId to create an offer."
    });
  }

  const offerResponse = await fetch("https://api.ebay.com/sell/inventory/v1/offer", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${body.accessToken}`,
      "Content-Type": "application/json",
      "Content-Language": "en-US",
      "X-EBAY-C-MARKETPLACE-ID": marketplaceId
    },
    body: JSON.stringify({
      sku,
      marketplaceId,
      format: "FIXED_PRICE",
      availableQuantity: body.quantity || 1,
      categoryId: body.categoryId,
      merchantLocationKey: locationKey,
      listingDescription: body.description,
      pricingSummary: {
        price: {
          value: String(body.price),
          currency: optionalEnv("EBAY_CURRENCY") || "USD"
        }
      },
      listingPolicies: {
        paymentPolicyId,
        fulfillmentPolicyId,
        returnPolicyId
      }
    })
  });

  const offer = await offerResponse.json();
  return NextResponse.json({ sku, offer }, { status: offerResponse.status });
}
