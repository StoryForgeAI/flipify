"use client";

import Link from "next/link";
import Image from "next/image";
import { RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";

export function Logo() {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="relative grid h-11 w-11 place-items-center rounded-lg border border-blue-300/30 bg-white shadow-sm">
        {imageFailed ? (
          <>
            <RefreshCw className="h-5 w-5 text-royal" />
            <Sparkles className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-royal p-0.5 text-white" />
          </>
        ) : (
          <Image
            src="/flipify-logo.png"
            alt="Flipify"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            onError={() => setImageFailed(true)}
          />
        )}
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
