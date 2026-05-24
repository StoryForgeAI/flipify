import { CreditCard, Receipt, WalletCards } from "lucide-react";
import { PageHeader } from "@/components/ui";

export default function BillingInfoPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <PageHeader
        eyebrow="Billing"
        title="Billing info"
        description="Track credits, invoices, and future payment methods for Flipify."
      />
      <section className="grid gap-5 px-5 py-8 sm:px-8 lg:grid-cols-3">
        {[
          ["Credit wallet", "Starter balance begins at 5 credits. AI actions debit after completion.", WalletCards],
          ["Payment method", "Connect Stripe later for automatic credit packs and subscriptions.", CreditCard],
          ["Invoices", "Invoice history will appear here after paid billing is connected.", Receipt]
        ].map(([title, copy, Icon]) => {
          const CardIcon = Icon as typeof CreditCard;
          return (
            <div key={title as string} className="rounded-2xl border border-white/10 bg-white/10 p-6">
              <CardIcon className="h-7 w-7 text-blue-200" />
              <h2 className="mt-5 text-xl font-semibold text-white">{title as string}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{copy as string}</p>
            </div>
          );
        })}
      </section>
    </main>
  );
}
