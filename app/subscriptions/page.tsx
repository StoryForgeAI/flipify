import { Check, Crown, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui";

const plans = [
  { name: "Free", price: "€0", features: ["5 starter credits", "Core AI tools", "Manual eBay export"] },
  { name: "Pro", price: "€19/mo", features: ["More monthly credits", "Full workflows", "Advanced product scoring"] },
  { name: "Elite", price: "€49/mo", features: ["Higher limits", "Priority AI runs", "Marketplace automation"] }
];

export default function SubscriptionsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <PageHeader
        eyebrow="Plans"
        title="Subscriptions"
        description="Choose the plan that matches your flipping volume."
      />
      <section className="grid gap-5 px-5 py-8 sm:px-8 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <div key={plan.name} className="rounded-2xl border border-white/10 bg-white/10 p-6">
            {index === 1 ? <Crown className="h-7 w-7 text-blue-200" /> : <Sparkles className="h-7 w-7 text-blue-200" />}
            <h2 className="mt-5 text-2xl font-semibold text-white">{plan.name}</h2>
            <p className="mt-2 text-3xl font-black text-white">{plan.price}</p>
            <div className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <p key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="h-4 w-4 text-emerald-400" />
                  {feature}
                </p>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
