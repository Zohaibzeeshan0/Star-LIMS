import React from "react";
import { PackagingStatus } from "@/lib/types/packaging";
import { cn } from "@/lib/utils";

interface PackagingStatusBadgeProps {
  status: PackagingStatus | string;
  className?: string;
  showDot?: boolean;
}

export function PackagingStatusBadge({
  status,
  className,
  showDot = true,
}: PackagingStatusBadgeProps) {
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
          label: "Quarantine",
        };
      case "Retest":
        return {
          bg: "bg-amber-100 text-amber-900 border-amber-300 font-bold",
          dot: "bg-amber-600",
          label: "Retest Required",
        };
      case "Under Testing":
        return {
          bg: "bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold",
          dot: "bg-indigo-500",
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
