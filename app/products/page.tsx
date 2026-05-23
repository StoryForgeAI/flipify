"use client";

import Image from "next/image";
import { BadgeEuro, ExternalLink } from "lucide-react";
import { useInventory } from "@/components/inventory-provider";
import { PageHeader, MetricPill } from "@/components/ui";

export default function ProductsPage() {
  const { items } = useInventory();

  return (
    <main>
      <PageHeader
        eyebrow="Inventory"
        title="Active products"
        description="Items you have processed, exported, or published from Flipify workflows."
      />
      <section className="grid gap-5 px-5 py-8 sm:px-8 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
            <div className="relative aspect-[4/3] bg-slate-100">
              <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink shadow-sm">
                {item.status}
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-royal">{item.brand}</p>
                  <h2 className="mt-1 text-lg font-semibold text-ink">{item.name}</h2>
                </div>
                <button className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-royal hover:text-royal">
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <MetricPill label="Found Price" value={`€${item.foundPrice}`} />
                <MetricPill label="Market Value" value={`€${item.marketValue}`} />
              </div>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3 text-emerald-700">
                <div className="flex items-center gap-2">
                  <BadgeEuro className="h-4 w-4" />
                  <span className="text-sm font-bold">Estimated profit</span>
                </div>
                <span className="text-lg font-black">+€{item.profit}</span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
