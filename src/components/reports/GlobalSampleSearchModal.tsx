"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { UnifiedReportItem, GlobalSearchResult } from "@/lib/types/report";
import { performGlobalSampleSearch } from "@/lib/report-service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  X,
  FlaskConical,
  Package,
  Layers,
  RotateCcw,
  Pill,
  ClipboardCheck,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles
} from "lucide-react";

interface GlobalSampleSearchModalProps {
  open: boolean;
  onClose: () => void;
  allItems: UnifiedReportItem[];
  onPreviewItem: (item: UnifiedReportItem) => void;
}

export function GlobalSampleSearchModal({
  open,
  onClose,
  allItems,
  onPreviewItem
}: GlobalSampleSearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedStream, setSelectedStream] = useState<string>("ALL");

  const results: GlobalSearchResult[] = useMemo(() => {
    if (!query.trim()) return [];
    const searchRes = performGlobalSampleSearch(query, allItems);
    if (selectedStream === "ALL") return searchRes;
    return searchRes.filter((r) => r.item.stream === selectedStream);
  }, [query, allItems, selectedStream]);

  if (!open) return null;

  const streamChips = [
    { id: "ALL", label: "All Streams" },
    { id: "packaging", label: "Packaging" },
    { id: "raw-materials", label: "Raw Materials" },
    { id: "retesting", label: "Retesting" },
    { id: "products", label: "Products" },
    { id: "qc-results", label: "QC Worklist" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 pt-16 sm:pt-20 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Header Input */}
        <div className="border-b border-slate-200 p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-teal-50 p-2 text-teal-pharma">
              <Search className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <Input
                autoFocus
                placeholder="Search by Sample ID, Batch #, Item Name, Supplier, or Analyst..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-11 text-sm border-slate-300 focus:border-pharma-blue focus:ring-pharma-blue"
              />
            </div>
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold px-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              aria-label="Close search modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Stream Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              Filter By Stream:
            </span>
            {streamChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSelectedStream(chip.id)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  selectedStream === chip.id
                    ? "bg-pharma-blue text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 divide-y divide-slate-100">
          {!query.trim() ? (
            <div className="py-12 text-center text-slate-400">
              <Sparkles className="mx-auto h-8 w-8 text-teal-pharma mb-2 opacity-60" />
              <h4 className="font-heading text-sm font-bold text-slate-700">
                Universal LIMS Sample Search
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Type any Batch Number (e.g., <strong>PAR-500</strong>), Sample ID (e.g., <strong>CP-RAW</strong>), or Material Name to look up dossiers across all 5 laboratory streams.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <FlaskConical className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <h4 className="font-heading text-sm font-bold text-slate-700">
                No matching samples found for &quot;{query}&quot;
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Try searching with a shorter term or resetting the stream filter.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-1">
                Found {results.length} Matching Records across Laboratory Streams
              </div>

              {results.map(({ item, matchedFields }, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white p-3.5 hover:border-teal-pharma hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-pharma-blue">
                        {item.id}
                      </span>
                      <span className="rounded bg-sky-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-sky-800 border border-sky-200">
                        Batch: {item.batchNumber}
                      </span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 border border-slate-200">
                        {item.streamLabel}
                      </span>
                    </div>

                    <h4 className="font-heading text-sm font-bold text-slate-900 group-hover:text-teal-pharma transition-colors">
                      {item.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span>Supplier: <strong className="text-slate-700">{item.supplierOrMfr}</strong></span>
                      <span>•</span>
                      <span>Date: <strong className="text-slate-700">{item.date}</strong></span>
                      <span>•</span>
                      <span>Analyst: <strong className="text-slate-700">{item.analyst}</strong></span>
                    </div>

                    {/* Matched Highlights */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {matchedFields.map((field, fIdx) => (
                        <span
                          key={fIdx}
                          className="rounded bg-teal-50 px-1.5 py-0.2 text-[9px] font-bold text-teal-pharma-dark border border-teal-200"
                        >
                          Matched {field}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onClose();
                        onPreviewItem(item);
                      }}
                      className="h-8 gap-1 text-xs text-pharma-blue font-bold border-slate-200 hover:bg-slate-50"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Preview</span>
                    </Button>

                    <Link href={item.navigationUrl} onClick={onClose}>
                      <Button
                        variant="teal"
                        size="sm"
                        className="h-8 gap-1 text-xs font-bold shadow-xs"
                      >
                        <span>Open Stream</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-2.5 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Quick hint: Search supports partial ID matching like <strong className="text-slate-700">CP-</strong> or product codes like <strong className="text-slate-700">RM-</strong>.
          </span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            Esc to close
          </button>
        </div>
      </div>
    </div>
  );
}
