"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { STARTER_CREDITS } from "@/lib/credits";
import { createBrowserSupabaseClient } from "@/lib/supabase-client";

type UserContextValue = {
  email: string;
  user: User | null;
  loading: boolean;
  authConfigured: boolean;
  authConfigMessage: string;
  isAuthenticated: boolean;
  credits: number;
  setCredits: (credits: number) => void;
  spendLocalCredits: (amount: number) => boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | null>(null);
const fallbackEmail = "aiwithtomx@example.com";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [authConfigured, setAuthConfigured] = useState(false);
  const [authConfigMessage, setAuthConfigMessage] = useState("");
  const [credits, setCredits] = useState(STARTER_CREDITS);
  const email = user?.email || fallbackEmail;

  useEffect(() => {
    let mounted = true;

    async function loadAuth() {
      try {
        const response = await fetch("/api/auth/config", { cache: "no-store" });
        const config = (await response.json()) as {
          configured: boolean;
          url: string | null;
          key: string | null;
          missing?: { url?: boolean; key?: boolean };
        };

        if (!mounted) {
          return;
        }

        if (!config.configured || !config.url || !config.key) {
          setAuthConfigured(false);
          setAuthConfigMessage(
            `Supabase Auth is missing ${config.missing?.url ? "the project URL" : ""}${config.missing?.url && config.missing?.key ? " and " : ""}${config.missing?.key ? "the anon/publishable key" : ""}.`
          );
          setLoading(false);
          return;
        }

        const client = createBrowserSupabaseClient({ url: config.url, key: config.key });
        setSupabase(client);
        setAuthConfigured(true);
        setAuthConfigMessage("");

        const { data: sessionData } = await client.auth.getSession();
        if (!mounted) {
          return;
        }
        setUser(sessionData.session?.user ?? null);
        setLoading(false);

        const { data } = client.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
          setLoading(false);
        });

        return () => data.subscription.unsubscribe();
      } catch {
        if (!mounted) {
          return;
        }
        setAuthConfigured(false);
        setAuthConfigMessage("Supabase Auth config could not be loaded.");
        setLoading(false);
      }
    }

    const cleanupPromise = loadAuth();

    return () => {
      mounted = false;
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, []);

  useEffect(() => {
    if (!email) {
      return;
    }

    const key = `flipify-credits:${email}`;
    const stored = window.localStorage.getItem(key);
    if (stored) {
      setCredits(Number(stored));
    }

    fetch(`/api/credits?email=${encodeURIComponent(email)}`)
      .then((response) => response.json())
      .then((data: { credits?: number }) => {
        if (typeof data.credits === "number") {
          setCredits(data.credits);
        }
      })
      .catch(() => setCredits(STARTER_CREDITS));
  }, [email]);

  useEffect(() => {
    window.localStorage.setItem(`flipify-credits:${email}`, String(credits));
  }, [credits, email]);

  const value = useMemo(
    () => ({
      email,
      user,
      loading,
      authConfigured,
      authConfigMessage,
      isAuthenticated: Boolean(user),
      credits,
      setCredits,
      spendLocalCredits: (amount: number) => {
        if (credits < amount) {
          return false;
        }
        setCredits((current) => current - amount);
        return true;
      },
      signInWithEmail: async (nextEmail: string, password: string) => {
        if (!supabase) {
          return { error: authConfigMessage || "Supabase Auth is not configured yet." };
        }
        const { error } = await supabase.auth.signInWithPassword({ email: nextEmail, password });
        return { error: error?.message };
      },
      signUpWithEmail: async (nextEmail: string, password: string) => {
        if (!supabase) {
          return { error: authConfigMessage || "Supabase Auth is not configured yet." };
        }
        const { error } = await supabase.auth.signUp({
          email: nextEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/home`
          }
        });
        return { error: error?.message };
      },
      signInWithGoogle: async () => {
        if (!supabase) {
          return { error: authConfigMessage || "Supabase Auth is not configured yet." };
        }
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/home`
          }
        });
        return { error: error?.message };
      },
      signOut: async () => {
        await supabase?.auth.signOut();
      }
    }),
    [authConfigMessage, authConfigured, credits, email, loading, supabase, user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }
  return context;
}
