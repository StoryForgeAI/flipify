import { MessageCircle, Users } from "lucide-react";
import { PageHeader } from "@/components/ui";

export default function CommunityPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Community"
        title="Reseller community"
        description="A clean placeholder for mastermind drops, winning flips, and seller playbooks."
      />
      <section className="px-5 py-8 sm:px-8">
        <div className="rounded-lg border border-white/10 bg-white/10 p-8 shadow-sm">
          <Users className="h-10 w-10 text-royal" />
          <h2 className="mt-5 text-2xl font-semibold text-white">Share wins, scripts, and supplier notes.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Flipify Community is ready for future social features while keeping the dashboard route structure complete.
          </p>
          <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-royal px-4 py-3 text-sm font-bold text-white">
            <MessageCircle className="h-4 w-4" />
            Join waitlist
          </button>
        </div>
      </section>
    </main>
  );
}
