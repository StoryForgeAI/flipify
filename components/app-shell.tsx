"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Crown,
  Home,
  LayoutTemplate,
  MessageCircle,
  Plus,
  Sparkles,
  Wrench
} from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const dashboardRoutes = ["/home", "/tools", "/templates", "/products", "/community"];

const links = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/tools", label: "Tools", icon: Wrench },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/products", label: "Products", icon: Box },
  { href: "/community", label: "Community", icon: MessageCircle }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = dashboardRoutes.some((route) => pathname.startsWith(route));

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-mist">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white px-5 py-6 lg:flex lg:flex-col">
        <Logo />
        <Link
          href="/templates"
          className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-royal px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Find & Flip
        </Link>
        <nav className="mt-7 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
                  active
                    ? "bg-blue-50 text-royal"
                    : "text-slate-600 hover:bg-slate-50 hover:text-ink"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-sm font-bold text-white">
              AI
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Hey aiwithtomx!</p>
              <p className="text-xs text-slate-500">Reseller workspace</p>
            </div>
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-royal transition hover:border-royal hover:shadow-sm">
            <Crown className="h-4 w-4" />
            Upgrade to Pro
          </button>
        </div>
      </aside>
      <div className="lg:pl-72">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur lg:hidden">
          <Logo />
          <Link href="/templates" className="rounded-lg bg-royal p-2 text-white">
            <Sparkles className="h-5 w-5" />
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
