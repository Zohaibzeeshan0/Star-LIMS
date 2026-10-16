"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MOCK_SAMPLES } from "@/lib/mock-data/samples";
import { SampleRecord } from "@/lib/types/sample";
import { SampleTable } from "@/components/samples/SampleTable";
import { SampleDetailModal } from "@/components/samples/SampleDetailModal";
import { ResultEntryModal } from "@/components/samples/ResultEntryModal";
import {
  FlaskConical,
  Package,
  Layers,
  RotateCcw,
  Pill,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function MasterSamplesPage() {
  const [samples, setSamples] = useState<SampleRecord[]>(MOCK_SAMPLES);
  const [selectedSample, setSelectedSample] = useState<SampleRecord | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  const handleViewDetail = (sample: SampleRecord) => {
    setSelectedSample(sample);
    setDetailModalOpen(true);
  };

  const handleEnterResults = (sample: SampleRecord) => {
    setSelectedSample(sample);
    setResultModalOpen(true);
  };

  const handleSaveResults = (updated: SampleRecord) => {
    setSamples((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
        <div>
          <span className="text-xs font-bold text-teal-pharma uppercase tracking-wider">
            Repository &amp; Overview
          </span>
          <h1 className="font-heading text-2xl font-black text-pharma-blue flex items-center gap-2 mt-0.5">
            <FlaskConical className="h-6 w-6 text-teal-pharma" />
            Master Laboratory Sample Records
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete database of packaging materials, raw material APIs, retesting cycles, and finished pharmaceutical products.
          </p>
        </div>
      </div>

      {/* Stream Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Packaging Materials */}
        <Link
          href="/samples/packaging"
          className="group rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:shadow-md hover:border-teal-pharma/40 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-teal-50 p-2 text-teal-pharma group-hover:bg-teal-pharma group-hover:text-white transition-colors">
                <Package className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-teal-pharma-dark bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Phase 3
              </span>
            </div>
            <h3 className="font-heading font-bold text-sm text-pharma-blue mt-3 group-hover:text-teal-pharma transition-colors">
              Packaging Materials
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
              Blister foil pinholes, glass vial dimensions, cartons, tamper-evident seals &amp; stoppers.
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-teal-pharma mt-3 pt-2 border-t border-slate-100">
            <span>Manage Packaging</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Raw Materials */}
        <Link
          href="/samples/raw-materials"
          className="group rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:shadow-md hover:border-teal-pharma/40 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-sky-50 p-2 text-sky-700 group-hover:bg-sky-700 group-hover:text-white transition-colors">
                <Layers className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                Phase 4
              </span>
            </div>
            <h3 className="font-heading font-bold text-sm text-pharma-blue mt-3 group-hover:text-sky-700 transition-colors">
              Raw Materials (APIs)
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
              Active ingredients, excipients, solvents, PO references &amp; dispensing release.
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-sky-700 mt-3 pt-2 border-t border-slate-100">
            <span>Manage Raw Materials</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Retesting Program */}
        <Link
          href="/samples/retesting"
          className="group rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:shadow-md hover:border-warning-amber/40 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-amber-50 p-2 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <RotateCcw className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
                Phase 5
              </span>
            </div>
            <h3 className="font-heading font-bold text-sm text-pharma-blue mt-3 group-hover:text-amber-700 transition-colors">
              RM Retesting &amp; Shelf-Life
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
              ICH Q7 §7.5 surveillance, expiration proximity alerts, and +12/24 Mo shelf extension.
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 mt-3 pt-2 border-t border-slate-100">
            <span>Manage Retesting</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Product Samples */}
        <Link
          href="/samples/products"
          className="group rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-purple-50 p-2 text-purple-700 group-hover:bg-purple-700 group-hover:text-white transition-colors">
                <Pill className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Phase 6
              </span>
            </div>
            <h3 className="font-heading font-bold text-sm text-pharma-blue mt-3 group-hover:text-purple-700 transition-colors">
              Product Samples &amp; Stability
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
              Finished commercial batch release, IPQC controls, and ICH climatic chamber pulls.
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-purple-700 mt-3 pt-2 border-t border-slate-100">
            <span>Manage Products</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Master Aggregate Sample Table */}
      <SampleTable
        samples={samples}
        initialCategory="ALL"
        onViewDetail={handleViewDetail}
        onEnterResults={handleEnterResults}
      />

      <SampleDetailModal
        sample={selectedSample}
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />

      <ResultEntryModal
        sample={selectedSample}
        open={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        onSave={handleSaveResults}
      />
    </div>
  );
}
