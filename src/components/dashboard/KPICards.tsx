import React from "react";
import { SampleRecord } from "@/lib/types/sample";
import { FlaskConical, CheckCircle2, AlertTriangle, XCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardsProps {
  samples: SampleRecord[];
}

export function KPICards({ samples }: KPICardsProps) {
  const total = samples.length;
  const passed = samples.filter((s) => s.status === "Pass/Released").length;
  const quarantine = samples.filter((s) => s.status === "Quarantine/Retest").length;
  const failed = samples.filter((s) => s.status === "Fail/Rejected").length;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : "0";

  const cards = [
    {
      title: "Total Laboratory Queue",
      value: total,
      subtext: "Batches actively logged across all streams",
      icon: FlaskConical,
      accent: "pharma",
      borderClass: "border-l-4 border-l-pharma-blue",
      iconBg: "bg-pharma-blue/10 text-pharma-blue",
    },
    {
      title: "Batch Pass / Released",
      value: `${passRate}%`,
      subtext: `${passed} batches released for production/dispatch`,
      icon: CheckCircle2,
      accent: "teal",
      borderClass: "border-l-4 border-l-teal-pharma",
      iconBg: "bg-teal-pharma/10 text-teal-pharma",
      highlight: true,
    },
    {
      title: "Quarantine / Retest",
      value: quarantine,
      subtext: "Mandatory incubation & re-assay hold",
      icon: AlertTriangle,
      accent: "amber",
      borderClass: "border-l-4 border-l-warning-amber",
      iconBg: "bg-warning-amber/10 text-warning-amber",
    },
    {
      title: "Fail / Rejected (OOS)",
      value: failed,
      subtext: "Out-of-Specification investigations open",
      icon: XCircle,
      accent: "fail",
      borderClass: "border-l-4 border-l-fail-red",
      iconBg: "bg-fail-red/10 text-fail-red",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={cn(
              "rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md",
              c.borderClass
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {c.title}
                </span>
                <span className="font-heading mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
                  {c.value}
                </span>
                <span className="mt-1 text-xs text-slate-500 font-medium">
                  {c.subtext}
                </span>
              </div>
              <div className={cn("rounded-lg p-2.5", c.iconBg)}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
