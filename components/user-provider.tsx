"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STARTER_CREDITS } from "@/lib/credits";

type UserContextValue = {
  email: string;
  credits: number;
  setCredits: (credits: number) => void;
  spendLocalCredits: (amount: number) => boolean;
};

const UserContext = createContext<UserContextValue | null>(null);
const demoEmail = "aiwithtomx@example.com";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [email] = useState(demoEmail);
  const [credits, setCredits] = useState(STARTER_CREDITS);

  useEffect(() => {
    const stored = window.localStorage.getItem("flipify-credits");
    if (stored) {
      setCredits(Number(stored));
      return;
    }

    fetch(`/api/credits?email=${encodeURIComponent(demoEmail)}`)
      .then((response) => response.json())
      .then((data: { credits?: number }) => {
        if (typeof data.credits === "number") {
          setCredits(data.credits);
        }
      })
      .catch(() => setCredits(STARTER_CREDITS));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("flipify-credits", String(credits));
  }, [credits]);

  const value = useMemo(
    () => ({
      email,
      credits,
      setCredits,
      spendLocalCredits: (amount: number) => {
        if (credits < amount) {
          return false;
        }
        setCredits((current) => current - amount);
        return true;
      }
    }),
    [credits, email]
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
