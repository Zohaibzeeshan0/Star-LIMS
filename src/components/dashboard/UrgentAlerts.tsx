import React from "react";
import { SampleRecord } from "@/lib/types/sample";
import { StatusBadge } from "@/components/ui/badge";
import { AlertTriangle, ChevronRight, Clock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UrgentAlertsProps {
  samples: SampleRecord[];
  onSelectSample?: (sample: SampleRecord) => void;
}

export function UrgentAlerts({ samples, onSelectSample }: UrgentAlertsProps) {
  const urgentSamples = samples.filter(
    (s) => s.priority === "Urgent" || s.status === "Fail/Rejected" || s.status === "Quarantine/Retest"
  );

  return (
    <div className="space-y-3">
      {urgentSamples.slice(0, 4).map((sample) => {
        const isFailed = sample.status === "Fail/Rejected";
        return (
          <div
            key={sample.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border transition-all ${
              isFailed
                ? "bg-fail-red/5 border-fail-red/30 hover:border-fail-red/50"
                : "bg-warning-amber/5 border-warning-amber/30 hover:border-warning-amber/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 rounded-md p-1.5 shrink-0 ${
                  isFailed ? "bg-fail-red/10 text-fail-red" : "bg-warning-amber/10 text-warning-amber"
                }`}
              >
                {isFailed ? (
                  <ShieldAlert className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-pharma-blue">
                    {sample.productName}
                  </span>
                  <StatusBadge status={sample.status} />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span>
                    Lot: <code className="font-mono font-semibold text-slate-700">{sample.batchNumber}</code>
                  </span>
                  <span>•</span>
                  <span>{sample.category}</span>
                  <span>•</span>
                  <span className="text-slate-600 font-medium">Analyst: {sample.analyst}</span>
                </div>
                <p className="mt-1 text-xs text-slate-600 line-clamp-1 italic">
                  {sample.statusNotes}
                </p>
              </div>
            </div>

            {onSelectSample && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectSample(sample)}
                className="shrink-0 text-xs gap-1 font-semibold hover:border-pharma-blue"
              >
                Review
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
