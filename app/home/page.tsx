import { Crown } from "lucide-react";
import { ToolCard } from "@/components/ui";
import { tools } from "@/lib/data";

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-white px-5 py-8 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-ink">Hey aiwithtomx!</h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-royal">
                <Crown className="h-3.5 w-3.5" />
                Pro Member
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">Your AI resale cockpit is ready for today&apos;s flips.</p>
          </div>
        </div>
      </section>
      <section className="px-5 py-8 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.title} tool={tool} />
          ))}
        </div>
      </section>
    </main>
  );
}
