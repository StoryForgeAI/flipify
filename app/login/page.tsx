"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Chrome } from "lucide-react";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { useUser } from "@/components/user-provider";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginShell />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/home";
  const { signInWithEmail, signInWithGoogle, isAuthenticated, loading } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedRisk, setAcceptedRisk] = useState(false);
  const [acceptedAi, setAcceptedAi] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace(returnTo);
    }
  }, [isAuthenticated, loading, returnTo, router]);

  const canSubmit = acceptedRisk && acceptedAi;

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      setStatus("Please accept both security requirements before logging in.");
      return;
    }

    const result = await signInWithEmail(email, password);
    if (result.error) {
      setStatus(result.error);
      return;
    }
    router.replace(returnTo);
  };

  const handleGoogle = async () => {
    if (!canSubmit) {
      setStatus("Please accept both security requirements before Google sign in.");
      return;
    }
    const result = await signInWithGoogle();
    if (result.error) {
      setStatus(result.error);
    }
  };

  return (
    <LoginShell>
        <div className="mt-8">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-600">Log in to continue scanning, optimizing, and flipping.</p>
        </div>
        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-ink">
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="you@example.com" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-royal focus:ring-4 focus:ring-blue-50" />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required placeholder="Password" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-royal focus:ring-4 focus:ring-blue-50" />
          </label>
          <SecurityCheck checked={acceptedRisk} onChange={setAcceptedRisk}>
            I accept that marketplace purchases and supplier decisions are my responsibility.
          </SecurityCheck>
          <SecurityCheck checked={acceptedAi} onChange={setAcceptedAi}>
            I will review AI-generated listings, images, and content before publishing.
          </SecurityCheck>
          {status ? <p className="rounded-lg bg-amber-50 p-3 text-xs font-semibold text-amber-700">{status}</p> : null}
          <button className="w-full rounded-lg bg-royal px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
            Login
          </button>
          <button type="button" onClick={handleGoogle} className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-ink transition hover:bg-slate-50">
            <Chrome className="h-4 w-4" />
            Continue with Google
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          New to Flipify? <Link href="/register" className="font-bold text-royal">Create an account</Link>
        </p>
    </LoginShell>
  );
}

function LoginShell({ children }: { children?: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-10">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-soft">
        <Logo />
        {children}
      </div>
    </main>
  );
}

function SecurityCheck({
  checked,
  onChange,
  children
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-600">
      <input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" required className="mt-0.5 h-4 w-4 accent-blue-600" />
      {children}
    </label>
  );
}
