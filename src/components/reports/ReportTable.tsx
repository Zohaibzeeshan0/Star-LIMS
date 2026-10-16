"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { UnifiedReportItem } from "@/lib/types/report";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  FlaskConical
} from "lucide-react";

interface ReportTableProps {
  items: UnifiedReportItem[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (column: string) => void;
  onPreviewReport: (item: UnifiedReportItem) => void;
}

export function ReportTable({
  items,
  sortBy,
  sortOrder,
  onSortChange,
  onPreviewReport
}: ReportTableProps) {
  // Pagination State
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset to page 1 if items length changes significantly
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (validPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, validPage, pageSize]);

  // Sort indicator helper
  const renderSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-3 w-3 text-slate-400 group-hover:text-slate-600 transition-colors" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3 text-pharma-blue" />
    ) : (
      <ArrowDown className="h-3 w-3 text-pharma-blue" />
    );
  };

  // Status Badge Component
  const renderStatusBadge = (item: UnifiedReportItem) => {
    switch (item.dispositionType) {
      case "PASS":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-teal-pharma-dark border border-teal-200">
            <CheckCircle2 className="h-3 w-3 text-teal-pharma" />
            <span>{item.status}</span>
          </span>
        );
      case "QUARANTINE":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-300">
            <AlertTriangle className="h-3 w-3 text-amber-600" />
            <span>{item.status}</span>
          </span>
        );
      case "FAIL":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-critical-red border border-red-200">
            <XCircle className="h-3 w-3 text-critical-red" />
            <span>{item.status}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200">
            <Clock className="h-3 w-3 text-slate-500" />
            <span>{item.status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              <th
                onClick={() => onSortChange("id")}
                className="cursor-pointer px-4 py-3 hover:bg-slate-100/80 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Sample / Dossier ID</span>
                  {renderSortIcon("id")}
                </div>
              </th>
              <th
                onClick={() => onSortChange("title")}
                className="cursor-pointer px-4 py-3 hover:bg-slate-100/80 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Material / Product Description</span>
                  {renderSortIcon("title")}
                </div>
              </th>
              <th
                onClick={() => onSortChange("batchNumber")}
                className="cursor-pointer px-4 py-3 hover:bg-slate-100/80 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Batch #</span>
                  {renderSortIcon("batchNumber")}
                </div>
              </th>
              <th className="px-4 py-3">Category &amp; Stream</th>
              <th
                onClick={() => onSortChange("supplier")}
                className="cursor-pointer px-4 py-3 hover:bg-slate-100/80 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Supplier / Source</span>
                  {renderSortIcon("supplier")}
                </div>
              </th>
              <th
                onClick={() => onSortChange("date")}
                className="cursor-pointer px-4 py-3 hover:bg-slate-100/80 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Date &amp; Analyst</span>
                  {renderSortIcon("date")}
                </div>
              </th>
              <th
                onClick={() => onSortChange("status")}
                className="cursor-pointer px-4 py-3 hover:bg-slate-100/80 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Compliance Status</span>
                  {renderSortIcon("status")}
                </div>
              </th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedItems.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/70 transition-colors group"
              >
                {/* 1. ID & Stream Badge */}
                <td className="px-4 py-3 align-top">
                  <div className="font-mono text-xs font-bold text-pharma-blue flex items-center gap-1.5">
                    <FlaskConical className="h-3 w-3 text-teal-pharma shrink-0" />
                    <span>{item.id}</span>
                  </div>
                  <span className="inline-block mt-0.5 rounded px-1.5 py-0.2 text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    {item.streamLabel}
                  </span>
                </td>

                {/* 2. Title & Code */}
                <td className="px-4 py-3 align-top max-w-xs">
                  <span className="font-heading font-bold text-slate-900 block truncate" title={item.title}>
                    {item.title}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                    <span className="font-mono text-slate-600 bg-slate-50 px-1 rounded border border-slate-200">
                      {item.code}
                    </span>
                    {item.keyParameterResult && (
                      <span className="truncate text-slate-500" title={item.keyParameterResult}>
                        • {item.keyParameterResult}
                      </span>
                    )}
                  </div>
                </td>

                {/* 3. Batch # */}
                <td className="px-4 py-3 align-top">
                  <span className="font-mono font-semibold text-slate-800 bg-sky-50/80 px-2 py-0.5 rounded border border-sky-200/60 inline-block">
                    {item.batchNumber}
                  </span>
                </td>

                {/* 4. Category */}
                <td className="px-4 py-3 align-top">
                  <span className="text-slate-800 font-medium block">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate block">
                    {item.pharmacopeiaOrSpec}
                  </span>
                </td>

                {/* 5. Supplier */}
                <td className="px-4 py-3 align-top max-w-[180px]">
                  <span className="text-slate-700 truncate block font-medium" title={item.supplierOrMfr}>
                    {item.supplierOrMfr}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {item.storageLocationOrCondition}
                  </span>
                </td>

                {/* 6. Date & Analyst */}
                <td className="px-4 py-3 align-top">
                  <span className="font-medium text-slate-800 block">
                    {item.date}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    By: {item.analyst}
                  </span>
                </td>

                {/* 7. Status */}
                <td className="px-4 py-3 align-top">
                  {renderStatusBadge(item)}
                  <div className="mt-1 text-[10px] text-slate-500">
                    Tests: <strong className="text-teal-pharma">{item.testsSummary.passed}</strong>/{item.testsSummary.total} pass
                  </div>
                </td>

                {/* 8. Actions */}
                <td className="px-4 py-3 align-top text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPreviewReport(item)}
                      className="h-7 px-2 text-[11px] font-bold text-pharma-blue hover:text-white hover:bg-pharma-blue border-slate-200 shadow-2xs gap-1"
                      title="Generate Official Report Preview"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Preview</span>
                    </Button>

                    <Link href={item.navigationUrl}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-slate-400 hover:text-pharma-blue hover:bg-slate-100"
                        title={`Open in ${item.streamLabel} Module`}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 bg-slate-50/50">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Show:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="h-7 rounded border border-slate-200 bg-white px-2 text-xs text-slate-700 shadow-2xs focus:border-pharma-blue"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
          <span className="text-slate-400">|</span>
          <span>
            Showing <strong>{(validPage - 1) * pageSize + 1}</strong> -{" "}
            <strong>{Math.min(validPage * pageSize, items.length)}</strong> of{" "}
            <strong>{items.length}</strong> records
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={validPage <= 1}
            className="h-8 gap-1 px-2.5 text-xs text-slate-600 disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
          </Button>

          <span className="px-2.5 text-xs font-semibold text-slate-700">
            Page {validPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={validPage >= totalPages}
            className="h-8 gap-1 px-2.5 text-xs text-slate-600 disabled:opacity-40"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
