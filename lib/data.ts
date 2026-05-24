import {
  BadgeEuro,
  Bot,
  Camera,
  Search,
  Sparkles,
  Tags
} from "lucide-react";
import { CreditAction } from "@/lib/credits";

export type Tool = {
  slug: string;
  title: string;
  description: string;
  icon: typeof Search;
  accent: string;
  action: CreditAction;
  promise: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  brand: string;
  status: "Published" | "Exported" | "Draft";
  image: string;
  foundPrice: number;
  marketValue: number;
  profit: number;
  score: number;
  channel: string;
};

export const tools: Tool[] = [
  {
    slug: "product-finder-ai",
    title: "Product Finder AI",
    description: "Scan and discover underpriced items with high resale margins.",
    icon: Search,
    accent: "bg-blue-50 text-blue-700",
    action: "product_finder",
    promise: "Find the flip before everyone else sees it."
  },
  {
    slug: "description-tag-optimizer",
    title: "Description & Tag Optimizer",
    description: "Generate SEO-optimized titles, descriptions, and high-traffic hashtags.",
    icon: Tags,
    accent: "bg-amber-50 text-amber-700",
    action: "description_optimizer",
    promise: "Turn a rough item into a searchable listing."
  },
  {
    slug: "pricing-margin-intelligence",
    title: "Pricing & Margin Intelligence",
    description: "Calculate market value, optimal listing price, and clean profit scores.",
    icon: BadgeEuro,
    accent: "bg-emerald-50 text-emerald-700",
    action: "pricing_intelligence",
    promise: "Know the margin before you buy."
  },
  {
    slug: "photo-studio-background-ai",
    title: "Photo Studio Background AI",
    description: "Transform messy product photos into professional marketplace studio shots.",
    icon: Camera,
    accent: "bg-indigo-50 text-indigo-700",
    action: "photo_studio",
    promise: "Make thrift photos look marketplace-ready."
  }
];

export const starterInventory: InventoryItem[] = [];

export const aiFoundProduct = {
  name: "Vintage Adidas Track Jacket",
  brand: "Adidas",
  buyingPrice: 12,
  marketValue: 45,
  suggestedPrice: 39,
  profit: 25,
  score: 94,
  supplier: "eBay seller",
  safeScore: 85,
  image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80",
  title: "Vintage Adidas Track Jacket - Royal Blue Retro Streetwear",
  description:
    "Clean vintage Adidas track jacket with a sharp retro profile, lightweight feel, and strong streetwear styling potential. Ideal for eBay buyers looking for authentic sportswear.",
  hashtags: "#vintageadidas #trackjacket #streetwear #resellfind #vintagefashion"
};

export const workflowBadges = [
  { icon: Bot, label: "AI scan ready" },
  { icon: Sparkles, label: "Listing copy generated" },
  { icon: BadgeEuro, label: "Margin checked" }
];
