"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { STARTER_CREDITS } from "@/lib/credits";
import { isSupabaseAuthConfigured, supabase } from "@/lib/supabase-client";

type UserContextValue = {
  email: string;
  user: User | null;
  loading: boolean;
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
  const [credits, setCredits] = useState(STARTER_CREDITS);
  const email = user?.email || fallbackEmail;

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
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
          return { error: "Supabase Auth is not configured yet." };
        }
        const { error } = await supabase.auth.signInWithPassword({ email: nextEmail, password });
        return { error: error?.message };
      },
      signUpWithEmail: async (nextEmail: string, password: string) => {
        if (!supabase) {
          return { error: "Supabase Auth is not configured yet." };
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
          return { error: "Supabase Auth is not configured yet." };
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
    [credits, email, loading, user]
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
