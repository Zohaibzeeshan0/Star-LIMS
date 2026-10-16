import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Citi Pharma | Laboratory Management System (LIMS)",
  description:
    "Enterprise pharmaceutical laboratory information management system for packaging materials, raw materials, retesting, and finished product quality control.",
  icons: {
    icon: "/citi_pharma_logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
