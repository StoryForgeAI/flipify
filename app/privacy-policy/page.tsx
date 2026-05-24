import Link from "next/link";
import { Logo } from "@/components/logo";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="May 23, 2026">
      <p>
        Flipify collects account information, authentication data, workflow inputs, uploaded product details, credit usage events, and integration metadata needed to operate the platform.
      </p>
      <p>
        We use this data to provide AI resale tools, manage credits, save inventory, connect supported marketplaces such as eBay, improve product quality, and protect the service from abuse.
      </p>
      <p>
        When you connect third-party services, their APIs may process your data according to their own policies. You should review eBay, Supabase, OpenAI, and any connected provider terms before publishing or syncing listings.
      </p>
      <p>
        API keys and service-role secrets must be stored only in Vercel environment variables. Never place private keys in client-side code.
      </p>
      <p>
        To request deletion or export of your account data, contact the Flipify operator through your support channel.
      </p>
    </LegalPage>
  );
}

function LegalPage({
  title,
  updated,
  children
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
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
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">Last updated: {updated}</p>
          <div className="mt-8 space-y-5 text-sm leading-7 text-slate-600">{children}</div>
        </article>
      </div>
    </main>
  );
}
