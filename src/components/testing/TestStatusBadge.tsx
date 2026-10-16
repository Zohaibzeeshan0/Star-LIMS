"use client";

import React from "react";
import { TestStatus } from "@/lib/types/testing";
import {
  Clock,
  Activity,
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  FileCheck
} from "lucide-react";

interface TestStatusBadgeProps {
  status: TestStatus;
  isOOS?: boolean;
}

export function TestStatusBadge({ status, isOOS }: TestStatusBadgeProps) {
  let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
  let icon = <Clock className="h-3 w-3" />;

  switch (status) {
    case "Not Started":
      badgeStyle = "bg-slate-100 text-slate-700 border-slate-300";
      icon = <Clock className="h-3 w-3 text-slate-500" />;
      break;
    case "In Progress":
      badgeStyle = "bg-purple-50 text-purple-800 border-purple-300";
      icon = <Activity className="h-3 w-3 text-purple-600 animate-spin" />;
      break;
    case "Completed":
      badgeStyle = "bg-sky-50 text-sky-800 border-sky-300";
      icon = <CheckCircle2 className="h-3 w-3 text-sky-600" />;
      break;
    case "Pending Review":
      badgeStyle = "bg-amber-50 text-amber-900 border-amber-300";
      icon = <ShieldAlert className="h-3 w-3 text-amber-600" />;
      break;
    case "Reviewed":
      badgeStyle = "bg-teal-50 text-teal-800 border-teal-300";
      icon = <FileCheck className="h-3 w-3 text-teal-600" />;
      break;
    case "Out of Specification":
      badgeStyle = "bg-rose-100 text-rose-900 border-rose-400 font-bold shadow-xs";
      icon = <AlertTriangle className="h-3 w-3 text-rose-600 animate-bounce" />;
      break;
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide shadow-2xs ${badgeStyle}`}
      >
        {icon}
        <span>{status}</span>
      </span>
      {isOOS && status !== "Out of Specification" && (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white uppercase tracking-wider animate-pulse">
          OOS Flag
        </span>
      )}
    </div>
  );
}

export function ParameterStatusBadge({ status }: { status: "Pass" | "Fail" | "Pending" }) {
  if (status === "Pass") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
        Pass
      </span>
    );
  }
  if (status === "Fail") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-400 shadow-2xs">
        <AlertTriangle className="h-3 w-3 text-rose-600" />
        Fail (OOS)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-300">
      <Clock className="h-3 w-3 text-slate-400" />
      Pending
    </span>
  );
}
