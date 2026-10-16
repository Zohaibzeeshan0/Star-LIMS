"use client";

import React, { useState } from "react";
import { MOCK_AUDIT_TRAIL } from "@/lib/mock-data/samples";
import { AuditTrailEntry } from "@/lib/types/sample";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Search, Download, CheckCircle2, Lock } from "lucide-react";

export default function AuditTrailPage() {
  const [logs] = useState<AuditTrailEntry[]>(MOCK_AUDIT_TRAIL);
  const [query, setQuery] = useState("");

  const filteredLogs = logs.filter((log) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      log.user.toLowerCase().includes(q) ||
      log.target.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.detail.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    const headers = ["Timestamp", "Authorized User", "Action Protocol", "Target Entity", "Detail", "IP Address", "Checksum"];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.user}"`,
      `"${l.action}"`,
      `"${l.target}"`,
      `"${l.detail.replace(/"/g, '""')}"`,
      `"${l.ipAddress}"`,
      `"${l.cfrChecksum}"`
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `Citi_Pharma_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <span className="text-xs font-bold text-teal-pharma uppercase tracking-wider">
            Regulatory Compliance Log
          </span>
          <h1 className="font-heading text-2xl font-black text-pharma-blue flex items-center gap-2 mt-0.5">
            <ShieldCheck className="h-6 w-6 text-teal-pharma" />
            21 CFR Part 11 Electronic Records & Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-evident, cryptographically hashed chronological record of all analytical testing modifications, user authorizations, and batch release decisions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="pass" className="gap-1 font-bold">
            <Lock className="h-3 w-3" />
            Immutable SHA-256
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-1.5 text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            Export Audit CSV
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search audit trail by user, target batch, or action..."
              className="pl-9 bg-white text-xs"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 border-b border-slate-200 font-heading text-[11px] font-bold uppercase tracking-wider text-pharma-blue">
              <tr>
                <th className="py-3.5 px-4">Timestamp (UTC)</th>
                <th className="py-3.5 px-4">Authorized Chemist / Officer</th>
                <th className="py-3.5 px-4">Action Type</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-4">Transaction / Monograph Detail</th>
                <th className="py-3.5 px-4">IP & Cryptographic Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-bold text-pharma-blue">
                    {log.user}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {log.target}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs">
                    {log.detail}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-teal-pharma-dark">
                    <span>{log.ipAddress}</span> • <span>{log.cfrChecksum}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
