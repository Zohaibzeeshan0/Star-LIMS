"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FlaskConical,
  Package,
  Layers,
  RotateCcw,
  Pill,
  PlusCircle,
  FileCheck2,
  Gauge,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: "amber" | "teal" | string;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const navigation: NavSection[] = [
    {
      group: "Core Laboratory",
      items: [
        { name: "QC Dashboard", href: "/", icon: LayoutDashboard },
        { name: "Master Sample Records", href: "/samples", icon: FlaskConical, badge: "12" },
        { name: "Sample Registration", href: "/register", icon: PlusCircle },
      ]
    },
    {
      group: "Sample Streams",
      items: [
        { name: "Packaging Materials", href: "/samples/packaging", icon: Package, badge: "3" },
        { name: "Raw Materials (APIs)", href: "/samples/raw-materials", icon: Layers, badge: "3" },
        { name: "Raw Material Retesting", href: "/samples/retesting", icon: RotateCcw, badge: "3", badgeColor: "amber" },
        { name: "Product Samples", href: "/samples/products", icon: Pill, badge: "5" },
      ]
    },
    {
      group: "Compliance & QA",
      items: [
        { name: "Certificate of Analysis", href: "/coa", icon: FileCheck2 },
        { name: "Instruments & Calib", href: "/instruments", icon: Gauge, badge: "1 Due", badgeColor: "amber" },
        { name: "21 CFR Part 11 Log", href: "/audit-trail", icon: ShieldCheck },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-gradient-to-b from-[#0A1E33] via-[#123B63] to-[#0D2D4D] text-white shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3.5 border-b border-white/10 px-5 py-5">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white shadow-md ring-2 ring-white/20">
            <Image
              src="/citi_pharma_logo.jpg"
              alt="Citi Pharma Emblem"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-lg font-extrabold tracking-wide text-white uppercase">
                Citi Pharma
              </span>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-200">
              Laboratory Management
            </span>
            <span className="mt-0.5 flex items-center gap-1 text-[10px] font-medium tracking-tight text-teal-300">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
              Quality • Precision • Compliance
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3.5 py-4">
          {navigation.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-sky-300/70">
                {section.group}
              </span>
              <div className="mt-1 space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={cn(
                        "group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150",
                        isActive
                          ? "bg-teal-pharma/25 text-white font-semibold border-l-4 border-teal-pharma shadow-sm"
                          : "text-slate-300 hover:bg-white/10 hover:text-white hover:translate-x-0.5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isActive ? "text-teal-300" : "text-slate-400 group-hover:text-white"
                          )}
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider",
                            item.badgeColor === "amber"
                              ? "bg-warning-amber text-slate-950 font-extrabold"
                              : "bg-teal-pharma/80 text-white"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Chemist / Compliance Footer */}
        <div className="border-t border-white/10 bg-black/25 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-pharma font-bold text-white ring-2 ring-teal-300/40 text-xs">
              AK
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-xs font-bold text-white">
                Dr. Ayesha Khan
              </span>
              <span className="truncate text-[10px] text-sky-200">
                Senior QC Lead Chemist
              </span>
              <div className="mt-1 flex items-center gap-1 text-[9px] font-semibold text-teal-300">
                <CheckCircle2 className="h-2.5 w-2.5 text-teal-400" />
                <span>21 CFR Part 11 Certified</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
