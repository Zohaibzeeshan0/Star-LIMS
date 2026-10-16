"use client";

import React, { useState } from "react";
import { MOCK_SAMPLES } from "@/lib/mock-data/samples";
import { SampleRecord } from "@/lib/types/sample";
import { SampleTable } from "@/components/samples/SampleTable";
import { SampleDetailModal } from "@/components/samples/SampleDetailModal";
import { ResultEntryModal } from "@/components/samples/ResultEntryModal";
import { FlaskConical } from "lucide-react";

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
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-4">
        <div>
          <span className="text-xs font-bold text-teal-pharma uppercase tracking-wider">
            Repository
          </span>
          <h1 className="font-heading text-2xl font-black text-pharma-blue flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-teal-pharma" />
            Master Laboratory Sample Records
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete database of packaging materials, raw material APIs, retesting cycles, and finished pharmaceutical products.
          </p>
        </div>
      </div>

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
