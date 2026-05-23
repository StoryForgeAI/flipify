import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { InventoryProvider } from "@/components/inventory-provider";

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
        <InventoryProvider>
          <AppShell>{children}</AppShell>
        </InventoryProvider>
      </body>
    </html>
  );
}
