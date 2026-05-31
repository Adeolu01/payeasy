import type { Metadata } from "next";
import "@/lib/env";
import { AppShell } from "@/components/ui/app-shell";
import { StellarAuthProvider } from "@/contexts/StellarAuthContext";
import { LocaleDirection } from "@/components/ui/locale-direction";
import { BottomNav } from "@/components/ui/bottom-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayEasy — Blockchain-Powered Rent Sharing for Roommates",
  description:
    "Find roommates, split rent, and pay securely through Stellar blockchain escrow. PayEasy makes rent sharing transparent, trustless, and effortless.",
  keywords: [
    "rent sharing",
    "roommate finder",
    "blockchain payments",
    "stellar",
    "escrow",
    "rent splitting",
  ],
  openGraph: {
    title: "PayEasy — Blockchain-Powered Rent Sharing",
    description:
      "Find roommates, split rent, and pay securely through Stellar blockchain escrow.",
    type: "website",
    url: "https://payeasy.dev",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="pb-16 md:pb-0">
        <LocaleDirection />
        <StellarAuthProvider>
          <AppShell>{children}</AppShell>
          <BottomNav />
        </StellarAuthProvider>
      </body>
    </html>
  );
}
