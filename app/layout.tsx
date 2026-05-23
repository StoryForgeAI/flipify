import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { AuthGate } from "@/components/auth-gate";
import { InventoryProvider } from "@/components/inventory-provider";
import { UserProvider } from "@/components/user-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Flipify | The AI Reselling OS",
  description: "Find, optimize, and flip high-profit fashion items with AI."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <UserProvider>
          <InventoryProvider>
            <AuthGate>
              <AppShell>{children}</AppShell>
            </AuthGate>
          </InventoryProvider>
        </UserProvider>
      </body>
    </html>
  );
}
