import Link from "next/link";
import { Chrome } from "lucide-react";
import { Logo } from "@/components/logo";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-10">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-soft">
        <Logo />
        <div className="mt-8">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Create your resale OS</h1>
          <p className="mt-2 text-sm text-slate-600">Start with AI product discovery, listing copy, and profit signals.</p>
        </div>
        <form className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-ink">
            Email
            <input type="email" placeholder="you@example.com" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-royal focus:ring-4 focus:ring-blue-50" />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Password
            <input type="password" placeholder="Choose a strong password" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-royal focus:ring-4 focus:ring-blue-50" />
          </label>
          <label className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-600">
            <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-blue-600" />
            I accept that marketplace purchases and supplier decisions are my responsibility.
          </label>
          <label className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-600">
            <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-blue-600" />
            I will review AI-generated listings, images, and content before publishing.
          </label>
          <button className="w-full rounded-lg bg-royal px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
            Create account
          </button>
          <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-ink transition hover:bg-slate-50">
            <Chrome className="h-4 w-4" />
            Continue with Google
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link href="/login" className="font-bold text-royal">Login</Link>
        </p>
      </div>
    </main>
  );
}
