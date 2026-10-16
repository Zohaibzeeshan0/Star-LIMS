"use client";

import React from "react";
import { RetestStatus, RetestSample } from "@/lib/types/retesting";
import { getRetestUrgency } from "@/lib/mock-data/retesting-samples";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Activity,
  Calendar,
  XCircle,
  ShieldAlert,
  Sparkles
} from "lucide-react";

interface RetestStatusBadgeProps {
  status: RetestStatus;
  sample?: RetestSample;
  showUrgency?: boolean;
}

export function RetestStatusBadge({
  status,
  sample,
  showUrgency = false
}: RetestStatusBadgeProps) {
  let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
  let icon = <Calendar className="h-3 w-3" />;

  switch (status) {
    case "Completed":
      badgeStyle = "bg-teal-50 text-teal-800 border-teal-200/80";
      icon = <CheckCircle2 className="h-3 w-3 text-teal-600" />;
      break;
    case "Due Soon":
      badgeStyle = "bg-amber-50 text-amber-900 border-amber-300";
      icon = <Clock className="h-3 w-3 text-amber-600 animate-pulse" />;
      break;
    case "Overdue":
      badgeStyle = "bg-red-50 text-red-800 border-red-300";
      icon = <AlertTriangle className="h-3 w-3 text-red-600 animate-bounce" />;
      break;
    case "In Progress":
      badgeStyle = "bg-purple-50 text-purple-800 border-purple-200";
      icon = <Activity className="h-3 w-3 text-purple-600 animate-spin" />;
      break;
    case "Scheduled":
      badgeStyle = "bg-blue-50 text-blue-800 border-blue-200";
      icon = <Calendar className="h-3 w-3 text-blue-600" />;
      break;
    case "Rejected":
      badgeStyle = "bg-rose-50 text-rose-800 border-rose-300";
      icon = <XCircle className="h-3 w-3 text-rose-600" />;
      break;
    case "Quarantine":
      badgeStyle = "bg-orange-50 text-orange-800 border-orange-300";
      icon = <ShieldAlert className="h-3 w-3 text-orange-600" />;
      break;
  }

  const urgencyInfo = sample ? getRetestUrgency(sample) : null;

  return (
    <div className="inline-flex flex-col gap-1 items-start">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide shadow-2xs ${badgeStyle}`}
      >
        {icon}
        <span>{status}</span>
      </span>

      {showUrgency && urgencyInfo && (
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded ${
            urgencyInfo.urgency === "OVERDUE"
              ? "bg-red-100 text-red-800"
              : urgencyInfo.urgency === "DUE_SOON"
              ? "bg-amber-100 text-amber-900"
              : urgencyInfo.urgency === "COMPLETED"
              ? "bg-teal-100 text-teal-800"
              : "text-slate-500"
          }`}
        >
          {urgencyInfo.urgency === "COMPLETED" && <Sparkles className="h-2.5 w-2.5 text-teal-600" />}
          {urgencyInfo.label}
        </span>
      )}
    </div>
  );
}
