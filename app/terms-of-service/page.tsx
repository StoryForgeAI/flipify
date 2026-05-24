import Link from "next/link";
import { Logo } from "@/components/logo";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <Logo />
          <Link href="/home" className="rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white">
            Back to app
          </Link>
        </div>
        <article className="rounded-xl border border-white/10 bg-white/10 p-6 shadow-soft sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-royal">Legal</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Terms of Service</h1>
          <p className="mt-2 text-sm text-slate-500">Last updated: May 23, 2026</p>
          <div className="mt-8 space-y-5 text-sm leading-7 text-slate-600">
            <p>
              Flipify provides software tools for resale research, AI-assisted listing creation, content generation, inventory management, and marketplace workflow support.
            </p>
            <p>
              You are responsible for reviewing supplier trust, marketplace rules, listing accuracy, pricing, intellectual property rights, and final publication decisions.
            </p>
            <p>
              AI-generated output may be incomplete or inaccurate. You must review all product claims, descriptions, visuals, captions, and pricing before use.
            </p>
            <p>
              Credits are consumed when AI actions or workflows are run. Full templates can require more credits than the free starter balance.
            </p>
            <p>
              Do not use Flipify to create misleading listings, infringe brand rights, violate marketplace policies, or automate prohibited activity.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
