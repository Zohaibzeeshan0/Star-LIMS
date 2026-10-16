"use client";

import React from "react";
import { ProductStatus, SampleType } from "@/lib/types/product";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Activity,
  XCircle,
  ShieldCheck,
  Flame,
  ThermometerSnowflake
} from "lucide-react";

interface ProductStatusBadgeProps {
  status: ProductStatus;
  sampleType?: SampleType;
}

export function ProductStatusBadge({
  status,
  sampleType
}: ProductStatusBadgeProps) {
  let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
  let icon = <Clock className="h-3 w-3" />;

  switch (status) {
    case "Released":
      badgeStyle = "bg-teal-50 text-teal-800 border-teal-200";
      icon = <CheckCircle2 className="h-3 w-3 text-teal-600" />;
      break;
    case "Under Testing":
      badgeStyle = "bg-purple-50 text-purple-800 border-purple-200";
      icon = <Activity className="h-3 w-3 text-purple-600 animate-spin" />;
      break;
    case "Reviewed":
      badgeStyle = "bg-sky-50 text-sky-800 border-sky-200";
      icon = <ShieldCheck className="h-3 w-3 text-sky-600" />;
      break;
    case "Registered":
      badgeStyle = "bg-blue-50 text-blue-800 border-blue-200";
      icon = <Clock className="h-3 w-3 text-blue-600" />;
      break;
    case "Quarantine":
      badgeStyle = "bg-amber-50 text-amber-900 border-amber-300";
      icon = <AlertTriangle className="h-3 w-3 text-amber-600 animate-pulse" />;
      break;
    case "Rejected":
      badgeStyle = "bg-rose-50 text-rose-800 border-rose-300";
      icon = <XCircle className="h-3 w-3 text-rose-600" />;
      break;
  }

  return (
    <div className="inline-flex flex-col gap-1 items-start">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide shadow-2xs ${badgeStyle}`}
      >
        {icon}
        <span>{status}</span>
      </span>

      {sampleType && (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded ${
            sampleType.includes("Stability")
              ? "bg-amber-100 text-amber-900"
              : sampleType.includes("IPQC")
              ? "bg-indigo-100 text-indigo-800"
              : sampleType.includes("Sterile")
              ? "bg-sky-100 text-sky-900"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {sampleType.includes("Stability") && <Flame className="h-2.5 w-2.5 text-amber-600" />}
          {sampleType.includes("Sterile") && <ThermometerSnowflake className="h-2.5 w-2.5 text-sky-600" />}
          {sampleType}
        </span>
      )}
    </div>
  );
}
