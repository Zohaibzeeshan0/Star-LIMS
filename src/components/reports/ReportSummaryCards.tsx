"use client";

import React from "react";
import { ReportSummaryMetrics } from "@/lib/types/report";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  TrendingUp,
  ShieldCheck
} from "lucide-react";

interface ReportSummaryCardsProps {
  metrics: ReportSummaryMetrics;
  categoryTitle: string;
}

export function ReportSummaryCards({ metrics, categoryTitle }: ReportSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Total Records */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:shadow-sm transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Samples
          </span>
          <div className="rounded-lg bg-sky-50 p-2 text-pharma-blue">
            <FileText className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading text-2xl font-black text-pharma-blue">
            {metrics.totalRecords}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">Records</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500 truncate">
          Active stream: <strong className="text-slate-700">{categoryTitle}</strong>
        </p>
      </div>

      {/* 2. Released / Compliant */}
      <div className="relative overflow-hidden rounded-xl border border-teal-200/60 bg-white p-4 shadow-2xs hover:shadow-sm transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-pharma-dark">
            Pass / Released
          </span>
          <div className="rounded-lg bg-teal-50 p-2 text-teal-pharma">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading text-2xl font-black text-teal-pharma">
            {metrics.releasedCount}
          </span>
          <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-pharma-dark border border-teal-200">
            {metrics.complianceRate}% Rate
          </span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          CoA generated &amp; release approved
        </p>
      </div>

      {/* 3. Quarantine / Retest */}
      <div className="relative overflow-hidden rounded-xl border border-amber-200/80 bg-white p-4 shadow-2xs hover:shadow-sm transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            Quarantine / Retest
          </span>
          <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading text-2xl font-black text-amber-600">
            {metrics.quarantineCount}
          </span>
          <span className="text-[10px] font-bold text-amber-700">Under Hold</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          Pending shelf-life / QA clearance
        </p>
      </div>

      {/* 4. Rejected / OOS */}
      <div className="relative overflow-hidden rounded-xl border border-red-200/80 bg-white p-4 shadow-2xs hover:shadow-sm transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-critical-red">
            Rejected / OOS
          </span>
          <div className="rounded-lg bg-red-50 p-2 text-critical-red">
            <XCircle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading text-2xl font-black text-critical-red">
            {metrics.rejectedCount}
          </span>
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-critical-red border border-red-200">
            Phase I Alert
          </span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          Out-of-Specification deviations
        </p>
      </div>

      {/* 5. In-Progress / Under Testing */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:shadow-sm transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
            In Testing
          </span>
          <div className="rounded-lg bg-slate-100 p-2 text-slate-700">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading text-2xl font-black text-slate-800">
            {metrics.inTestingCount}
          </span>
          <span className="text-[10px] font-bold text-sky-700">Active Runs</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          Analytical monograph underway
        </p>
      </div>
    </div>
  );
}
