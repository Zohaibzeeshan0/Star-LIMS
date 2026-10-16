"use client";

import React, { useState, useEffect } from "react";
import { ReportSummaryMetrics } from "@/lib/types/report";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";
import { PieChart as PieIcon, BarChart3, TrendingUp, Sparkles } from "lucide-react";

interface ReportChartsProps {
  metrics: ReportSummaryMetrics;
}

export function ReportCharts({ metrics }: ReportChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-72 rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs animate-pulse flex items-center justify-center text-xs text-slate-400">
          Loading disposition analytics...
        </div>
        <div className="h-72 rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs animate-pulse flex items-center justify-center text-xs text-slate-400 lg:col-span-2">
          Loading stream throughput telemetry...
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Disposition Donut Chart */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-teal-50 p-1.5 text-teal-pharma">
                <PieIcon className="h-4 w-4" />
              </div>
              <h3 className="font-heading text-sm font-bold text-pharma-blue">
                Disposition Distribution
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {metrics.totalRecords} Samples
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Real-time batch status split across current filter parameters.
          </p>
        </div>

        <div className="h-56 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={metrics.dispositionDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {metrics.dispositionDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
                        <span className="font-bold text-slate-800">{data.name}</span>
                        <div className="mt-0.5 text-slate-600">
                          Count: <strong className="text-pharma-blue">{data.value}</strong>{" "}
                          ({Math.round((data.value / (metrics.totalRecords || 1)) * 100)}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Stream Compliance Throughput Bar Chart */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs flex flex-col justify-between lg:col-span-2">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-sky-50 p-1.5 text-pharma-blue">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-pharma-blue">
                  Laboratory Stream Throughput &amp; Compliance
                </h3>
                <span className="text-[10px] text-slate-500">
                  Breakdown by Packaging, Raw Materials, Retesting, Products &amp; QC Worklist
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-600 border border-slate-200">
              <Sparkles className="h-3 w-3 text-teal-pharma" />
              <span>cGMP Metrics</span>
            </div>
          </div>
        </div>

        <div className="h-56 w-full mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={metrics.streamThroughput}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#64748B" }}
                interval={0}
              />
              <YAxis tick={{ fontSize: 10, fill: "#64748B" }} allowDecimals={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs shadow-md">
                        <strong className="block text-pharma-blue mb-1">{label}</strong>
                        {payload.map((entry, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-4 text-slate-600">
                            <span className="flex items-center gap-1.5">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              {entry.name}:
                            </span>
                            <span className="font-bold text-slate-800">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="released" name="Pass / Released" fill="#0F9D8A" radius={[3, 3, 0, 0]} />
              <Bar dataKey="quarantine" name="Quarantine / Retest" fill="#E7A23B" radius={[3, 3, 0, 0]} />
              <Bar dataKey="rejected" name="Rejected / OOS" fill="#DC2626" radius={[3, 3, 0, 0]} />
              <Bar dataKey="inTesting" name="In Testing" fill="#123B63" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0F9D8A]" />
            <span>Pass / Released</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#E7A23B]" />
            <span>Quarantine</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#DC2626]" />
            <span>Rejected / OOS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#123B63]" />
            <span>In Testing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
