import Link from "next/link";
import { Chrome } from "lucide-react";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-10">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-soft">
        <Logo />
        <div className="mt-8">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-600">Log in to continue scanning, optimizing, and flipping.</p>
        </div>
        <form className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-ink">
            Email
            <input type="email" placeholder="you@example.com" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-royal focus:ring-4 focus:ring-blue-50" />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Password
            <input type="password" placeholder="••••••••" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-royal focus:ring-4 focus:ring-blue-50" />
          </label>
          <button className="w-full rounded-lg bg-royal px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
            Login
          </button>
          <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-ink transition hover:bg-slate-50">
            <Chrome className="h-4 w-4" />
            Continue with Google
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          New to Flipify? <Link href="/register" className="font-bold text-royal">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
