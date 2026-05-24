"use client";

import Link from "next/link";
import { RefreshCw, Sparkles } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="relative grid h-11 w-11 place-items-center rounded-lg border border-blue-300/30 bg-white shadow-sm">
        <RefreshCw className="h-5 w-5 text-royal" />
        <Sparkles className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-royal p-0.5 text-white" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight text-white">Flipify</span>
          <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-royal">
            ResellOS
          </span>
        </div>
        <p className="text-xs font-medium text-slate-400">AI reselling command center</p>
      </div>
    </Link>
  );
}
