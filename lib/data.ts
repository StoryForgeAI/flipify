import {
  BadgeEuro,
  Bot,
  Camera,
  Clapperboard,
  Search,
  Sparkles,
  Tags
} from "lucide-react";

export type Tool = {
  title: string;
  description: string;
  icon: typeof Search;
  accent: string;
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
    title: "Product Finder AI",
    description: "Scan and discover underpriced items with high resale margins.",
    icon: Search,
    accent: "bg-blue-50 text-blue-700"
  },
  {
    title: "Viral Video Generator",
    description: "Turn your item photos into high-converting TikTok/Shorts faceless videos.",
    icon: Clapperboard,
    accent: "bg-fuchsia-50 text-fuchsia-700"
  },
  {
    title: "Description & Tag Optimizer",
    description: "Generate SEO-optimized titles, descriptions, and high-traffic hashtags.",
    icon: Tags,
    accent: "bg-amber-50 text-amber-700"
  },
  {
    title: "Pricing & Margin Intelligence",
    description: "Calculate market value, optimal listing price, and clean profit scores.",
    icon: BadgeEuro,
    accent: "bg-emerald-50 text-emerald-700"
  },
  {
    title: "Photo Studio Background AI",
    description: "Transform messy product photos into professional marketplace studio shots.",
    icon: Camera,
    accent: "bg-indigo-50 text-indigo-700"
  }
];

export const starterInventory: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Vintage Adidas Track Jacket",
    brand: "Adidas",
    status: "Published",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80",
    foundPrice: 12,
    marketValue: 45,
    profit: 25,
    score: 94,
    channel: "Vinted"
  },
  {
    id: "inv-2",
    name: "Y2K Denim Cargo Skirt",
    brand: "Diesel",
    status: "Exported",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
    foundPrice: 18,
    marketValue: 62,
    profit: 34,
    score: 89,
    channel: "Depop"
  },
  {
    id: "inv-3",
    name: "Nike ACG Fleece Pullover",
    brand: "Nike",
    status: "Draft",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    foundPrice: 24,
    marketValue: 74,
    profit: 39,
    score: 91,
    channel: "Grailed"
  }
];

export const aiFoundProduct = {
  name: "Vintage Adidas Track Jacket",
  brand: "Adidas",
  buyingPrice: 12,
  marketValue: 45,
  suggestedPrice: 39,
  profit: 25,
  score: 94,
  supplier: "Etsy Supplier",
  safeScore: 85,
  image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80",
  title: "Vintage Adidas Track Jacket - Royal Blue Retro Streetwear",
  description:
    "Clean vintage Adidas track jacket with a sharp retro profile, lightweight feel, and strong streetwear styling potential. Ideal for Vinted, Depop, and Grailed buyers looking for authentic sportswear.",
  hashtags: "#vintageadidas #trackjacket #streetwear #resellfind #vintagefashion"
};

export const workflowBadges = [
  { icon: Bot, label: "AI scan ready" },
  { icon: Sparkles, label: "Listing copy generated" },
  { icon: BadgeEuro, label: "Margin checked" }
];
