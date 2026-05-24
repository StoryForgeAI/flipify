"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chrome } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { useUser } from "@/components/user-provider";

export default function RegisterPage() {
  const router = useRouter();
  const {
    signUpWithEmail,
    signInWithGoogle,
    isAuthenticated,
    loading,
    authConfigured,
    authConfigMessage
  } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedRisk, setAcceptedRisk] = useState(false);
  const [acceptedAi, setAcceptedAi] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, loading, router]);

  const canSubmit = acceptedRisk && acceptedAi;

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      setStatus("Please accept both security requirements before creating an account.");
      return;
    }

    const result = await signUpWithEmail(email, password);
    if (result.error) {
      setStatus(result.error);
      return;
    }
    setStatus("Account created. Check your email if Supabase email confirmation is enabled.");
    router.replace("/home");
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
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-10">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-soft">
        <Logo />
        <div className="mt-8">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Create your resale OS</h1>
          <p className="mt-2 text-sm text-slate-600">Start with AI product discovery, listing copy, and profit signals.</p>
        </div>
        <form onSubmit={handleRegister} className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-ink">
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="you@example.com" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-royal focus:ring-4 focus:ring-blue-50" />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required placeholder="Choose a strong password" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-royal focus:ring-4 focus:ring-blue-50" />
          </label>
          <SecurityCheck checked={acceptedRisk} onChange={setAcceptedRisk}>
            I accept that marketplace purchases and supplier decisions are my responsibility.
          </SecurityCheck>
          <SecurityCheck checked={acceptedAi} onChange={setAcceptedAi}>
            I will review AI-generated listings, images, and content before publishing.
          </SecurityCheck>
          {!loading && !authConfigured ? (
            <p className="rounded-lg bg-amber-50 p-3 text-xs font-semibold text-amber-700">
              {authConfigMessage}
            </p>
          ) : null}
          {status ? <p className="rounded-lg bg-amber-50 p-3 text-xs font-semibold text-amber-700">{status}</p> : null}
          <button className="w-full rounded-lg bg-royal px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
            Create account
          </button>
          <button type="button" onClick={handleGoogle} className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-ink transition hover:bg-slate-50">
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
