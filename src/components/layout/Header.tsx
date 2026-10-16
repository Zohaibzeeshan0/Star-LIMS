"use client";

import React from "react";
import Link from "next/link";
import { Menu, PlusCircle, Download, ShieldCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onToggleMobile?: () => void;
  title?: string;
  subtitle?: string;
}

export function Header({
  onToggleMobile,
  title = "Laboratory Management",
  subtitle = "Analytical Quality Control"
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur-md shadow-xs">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobile}
          className="rounded-lg p-1.5 text-pharma-blue hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-pharma">
            {subtitle}
          </span>
          <h1 className="font-heading text-lg font-extrabold text-pharma-blue">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* cGMP Lab Node Status */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-clinical-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-pharma opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-pharma"></span>
          </span>
          <span>cGMP Node #04 • Active</span>
        </div>

        {/* Quick Intake Button */}
        <Link href="/register">
          <Button variant="teal" size="sm" className="gap-1.5 font-bold shadow-sm">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Intake Sample</span>
            <span className="md:hidden">Intake</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
