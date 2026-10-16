"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { SampleRecord } from "@/lib/types/sample";

interface DispositionChartProps {
  samples: SampleRecord[];
}

export function DispositionChart({ samples }: DispositionChartProps) {
  const passed = samples.filter((s) => s.status === "Pass/Released").length;
  const quarantine = samples.filter((s) => s.status === "Quarantine/Retest").length;
  const failed = samples.filter((s) => s.status === "Fail/Rejected").length;
  const inTesting = samples.filter((s) => s.status === "In Testing").length;

  const data = [
    { name: "Pass / Released", value: passed, color: "#0F9D8A" },
    { name: "Quarantine / Retest", value: quarantine, color: "#E7A23B" },
    { name: "Fail / Rejected", value: failed, color: "#DC2626" },
    { name: "In Testing", value: inTesting, color: "#2563EB" },
  ];

  const total = samples.length;

  return (
    <div className="relative h-72 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={65}
            outerRadius={88}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 12px rgba(18, 59, 99, 0.08)",
              fontSize: "12px",
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="font-heading text-2xl font-black text-pharma-blue leading-none block">
          {total}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Batches
        </span>
      </div>
    </div>
  );
}
