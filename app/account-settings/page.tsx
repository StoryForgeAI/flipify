import { Mail, ShieldCheck, UserCircle } from "lucide-react";
import { PageHeader } from "@/components/ui";

export default function AccountSettingsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <PageHeader
        eyebrow="Account"
        title="Account settings"
        description="Manage your profile defaults, login preferences, and workspace identity."
      />
      <section className="grid gap-5 px-5 py-8 sm:px-8 lg:grid-cols-3">
        {[
          ["Profile", "Keep your reseller workspace identity clean and consistent.", UserCircle],
          ["Email", "Your authenticated Supabase email powers credits and billing.", Mail],
          ["Security", "Review marketplace and AI publishing requirements.", ShieldCheck]
        ].map(([title, copy, Icon]) => {
          const CardIcon = Icon as typeof UserCircle;
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
