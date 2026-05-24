"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  Crown,
  CreditCard,
  Home,
  LayoutTemplate,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Plus,
  Settings,
  Sparkles,
  UserCircle,
  Wrench
} from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { useUser } from "@/components/user-provider";

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
  const router = useRouter();
  const { email, credits, signOut } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const isFocusedRoute =
    /^\/tools\/[^/]+/.test(pathname) ||
    pathname.startsWith("/templates/template1") ||
    pathname.startsWith("/templates/template2");
  const showSidebar = !isFocusedRoute && dashboardRoutes.some((route) => pathname.startsWith(route));

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-mist">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white px-5 py-6 lg:flex lg:flex-col">
        <Logo />
        <SidebarContent pathname={pathname} />
      </aside>
      {menuOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="relative flex h-full w-[min(86vw,320px)] flex-col border-r border-slate-200 bg-white px-5 py-5 shadow-soft">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-600"
              >
                <span className="text-xl leading-none">x</span>
              </button>
            </div>
            <SidebarContent pathname={pathname} onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      ) : null}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 bg-white text-ink shadow-sm"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Logo />
          </div>
          <div className="hidden text-sm font-semibold text-slate-500 lg:block">
            Flipify AI resale dashboard
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-blue-100 bg-blue-50 py-1 pl-1 pr-3 text-sm font-black text-royal sm:flex">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-royal text-white">{credits}</span>
              credits
            </div>
            <ProfileDropdown
              email={email}
              credits={credits}
              onLogout={async () => {
                await signOut();
                router.replace("/login");
              }}
            />
            <Link href="/templates" className="hidden rounded-lg bg-royal p-2 text-white sm:block lg:hidden">
              <Sparkles className="h-5 w-5" />
            </Link>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  onNavigate
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <Link
        href="/templates"
        onClick={onNavigate}
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
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition",
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
    </>
  );
}

function ProfileDropdown({
  email,
  credits,
  onLogout
}: {
  email: string;
  credits: number;
  onLogout: () => void;
}) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm transition hover:border-blue-200 hover:shadow-md">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-royal">
          <Mail className="h-4 w-4" />
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-xs font-semibold text-slate-500">Registered email</span>
          <span className="block max-w-44 truncate text-sm font-bold text-ink">{email}</span>
        </span>
      </button>
      <div className="invisible absolute right-0 top-12 w-80 translate-y-2 rounded-xl border border-slate-200 bg-white p-3 opacity-0 shadow-soft transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="rounded-lg bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-royal text-white">
              <UserCircle className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">{email}</p>
              <p className="text-xs font-semibold text-slate-500">Free workspace</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg border border-blue-100 bg-white px-3 py-2">
            <span className="text-sm font-bold text-ink">Available credits</span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-royal text-sm font-black text-white">{credits}</span>
          </div>
        </div>
        <div className="mt-2 space-y-1">
          <ProfileItem icon={Settings} label="Account settings" />
          <ProfileItem icon={CreditCard} label="Billing infos" />
          <ProfileLink icon={LockKeyhole} href="/privacy-policy" label="Privacy Policy" />
          <ProfileLink icon={LockKeyhole} href="/terms-of-service" label="Terms of Service" />
          <button onClick={onLogout} className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50">
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileItem({
  icon: Icon,
  label,
  checked
}: {
  icon: typeof Settings;
  label: string;
  checked?: boolean;
}) {
  return (
    <button className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
      <span className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-royal" />
        {label}
      </span>
    </button>
  );
}

function ProfileLink({
  icon: Icon,
  href,
  label
}: {
  icon: typeof Settings;
  href: string;
  label: string;
}) {
  return (
    <Link href={href} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
      <Icon className="h-4 w-4 text-royal" />
      {label}
    </Link>
  );
}
