"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const data = [
  { day: "Sat", pass: 14, quarantine: 2, fail: 1 },
  { day: "Sun", pass: 8, quarantine: 1, fail: 0 },
  { day: "Mon", pass: 22, quarantine: 3, fail: 1 },
  { day: "Tue", pass: 26, quarantine: 4, fail: 2 },
  { day: "Wed", pass: 31, quarantine: 2, fail: 0 },
  { day: "Thu", pass: 28, quarantine: 3, fail: 1 },
  { day: "Today", pass: 19, quarantine: 2, fail: 1 },
];

export function ThroughputChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748B", fontSize: 12, fontWeight: 600 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748B", fontSize: 12 }}
          />
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
            iconType="circle"
            wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }}
          />
          <Bar
            dataKey="pass"
            name="Pass / Released"
            fill="#0F9D8A"
            stackId="a"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="quarantine"
            name="Quarantine / Retest"
            fill="#E7A23B"
            stackId="a"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="fail"
            name="Fail / Rejected"
            fill="#DC2626"
            stackId="a"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
