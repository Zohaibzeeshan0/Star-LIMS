"use client";

import React, { useState } from "react";
import { MOCK_SAMPLES } from "@/lib/mock-data/samples";
import { SampleRecord } from "@/lib/types/sample";
import { SampleTable } from "@/components/samples/SampleTable";
import { SampleDetailModal } from "@/components/samples/SampleDetailModal";
import { ResultEntryModal } from "@/components/samples/ResultEntryModal";
import { RotateCcw } from "lucide-react";

export default function RawMaterialRetestingPage() {
  const [samples, setSamples] = useState<SampleRecord[]>(
    MOCK_SAMPLES.filter((s) => s.category === "Raw Material Retesting")
  );
  const [selectedSample, setSelectedSample] = useState<SampleRecord | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-xs font-bold text-warning-amber-dark uppercase tracking-wider">
          Scheduled Shelf-Life Surveillance
        </span>
        <h1 className="font-heading text-2xl font-black text-pharma-blue flex items-center gap-2 mt-0.5">
          <RotateCcw className="h-6 w-6 text-warning-amber" />
          Raw Material Retesting Program
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Surveillance re-assays for active substances approaching expiration or scheduled retest intervals (ICH Q7 / GMP guidelines) to authorize shelf-life extension.
        </p>
      </div>

      <SampleTable
        samples={samples}
        initialCategory="Raw Material Retesting"
        onViewDetail={(s) => {
          setSelectedSample(s);
          setDetailModalOpen(true);
        }}
        onEnterResults={(s) => {
          setSelectedSample(s);
          setResultModalOpen(true);
        }}
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
        onSave={(updated) => {
          setSamples((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s))
          );
        }}
      />
    </div>
  );
}
