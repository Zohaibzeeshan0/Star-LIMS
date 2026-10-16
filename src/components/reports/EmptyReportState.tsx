"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { SearchX, RotateCcw } from "lucide-react";

interface EmptyReportStateProps {
  onReset: () => void;
  message?: string;
}

export function EmptyReportState({
  onReset,
  message = "No pharmaceutical records match the selected audit query criteria."
}: EmptyReportStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-2xs">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <SearchX className="h-7 w-7" />
      </div>
      <h3 className="font-heading text-base font-bold text-pharma-blue mt-4">
        Zero Matching Analytical Records
      </h3>
      <p className="mt-1.5 max-w-md text-xs text-slate-500 leading-relaxed">
        {message} Try widening your date boundaries, clearing the batch number query, or resetting the disposition status filter.
      </p>
      <Button
        variant="teal"
        size="sm"
        onClick={onReset}
        className="mt-5 gap-1.5 font-bold shadow-sm"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>Reset Filter Criteria</span>
      </Button>
    </div>
  );
}
