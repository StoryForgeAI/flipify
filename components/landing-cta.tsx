"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useUser } from "@/components/user-provider";
import { cn } from "@/lib/utils";

export function LandingCta({
  compact = false,
  showIcon = true,
  children = "Start Flipping for Free"
}: {
  compact?: boolean;
  showIcon?: boolean;
  children?: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useUser();
  const href = !loading && isAuthenticated ? "/home" : "/register";

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg bg-royal text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-blue-700",
        compact ? "px-4 py-2" : "px-5 py-3"
      )}
    >
      {children}
      {showIcon ? <ArrowRight className="h-4 w-4" /> : null}
    </Link>
  );
}
