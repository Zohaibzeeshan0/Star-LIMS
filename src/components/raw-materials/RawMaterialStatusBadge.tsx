import React from "react";
import { RawMaterialStatus } from "@/lib/types/raw-material";
import { cn } from "@/lib/utils";

interface RawMaterialStatusBadgeProps {
  status: RawMaterialStatus | string;
  className?: string;
  showDot?: boolean;
}

export function RawMaterialStatusBadge({
  status,
  className,
  showDot = true,
}: RawMaterialStatusBadgeProps) {
  const getBadgeConfig = () => {
    switch (status) {
      case "Released":
        return {
          bg: "bg-teal-pharma-light text-teal-pharma-dark border-teal-pharma/30 font-bold",
          dot: "bg-teal-pharma",
          label: "Released / Pass",
        };
      case "Rejected":
        return {
          bg: "bg-fail-red-light text-fail-red-dark border-fail-red/30 font-bold",
          dot: "bg-fail-red",
          label: "Rejected / OOS",
        };
      case "Quarantine":
        return {
          bg: "bg-warning-amber-light text-warning-amber-dark border-warning-amber/40 font-bold",
          dot: "bg-warning-amber",
          label: "Quarantine Hold",
        };
      case "Retest":
        return {
          bg: "bg-amber-100 text-amber-900 border-amber-300 font-bold",
          dot: "bg-amber-600",
          label: "Retest Required",
        };
      case "Reviewed":
        return {
          bg: "bg-sky-50 text-sky-800 border-sky-300 font-semibold",
          dot: "bg-sky-600",
          label: "Reviewed / Pending QA",
        };
      case "Under Testing":
        return {
          bg: "bg-purple-50 text-purple-700 border-purple-200 font-semibold",
          dot: "bg-purple-500",
          label: "Under Testing",
        };
      case "Registered":
      default:
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200 font-semibold",
          dot: "bg-blue-500",
          label: "Registered",
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border tracking-tight transition-colors shadow-2xs whitespace-nowrap",
        config.bg,
        className
      )}
    >
      {showDot && (
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
      )}
      <span>{config.label}</span>
    </span>
  );
}
