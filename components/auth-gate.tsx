"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/components/user-provider";

const protectedRoutes = ["/home", "/tools", "/templates", "/products", "/community"];

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, isAuthenticated, authConfigured } = useUser();
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  useEffect(() => {
    if (loading || !isProtected || isAuthenticated) {
      return;
    }

    router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
  }, [isAuthenticated, isProtected, loading, pathname, router]);

  if (isProtected && (loading || !isAuthenticated || !authConfigured)) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 px-5 text-white">
        <div className="rounded-xl border border-white/10 bg-white/10 p-6 text-center shadow-soft">
          <p className="text-sm font-bold text-royal">Checking your Flipify session...</p>
          <p className="mt-2 text-sm text-slate-500">Redirecting to login if needed.</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
