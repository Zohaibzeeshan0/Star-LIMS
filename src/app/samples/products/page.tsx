"use client";

import React, { useState } from "react";
import { MOCK_SAMPLES } from "@/lib/mock-data/samples";
import { SampleRecord } from "@/lib/types/sample";
import { SampleTable } from "@/components/samples/SampleTable";
import { SampleDetailModal } from "@/components/samples/SampleDetailModal";
import { ResultEntryModal } from "@/components/samples/ResultEntryModal";
import { Pill } from "lucide-react";

export default function ProductSamplesPage() {
  const [samples, setSamples] = useState<SampleRecord[]>(
    MOCK_SAMPLES.filter(
      (s) =>
        s.category === "Product Sample (Finished)" ||
        s.category === "Product Sample (In-Process)" ||
        s.category === "Product Sample (Stability)" ||
        s.category === "Sterile Injectable"
    )
  );
  const [selectedSample, setSelectedSample] = useState<SampleRecord | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-xs font-bold text-teal-pharma uppercase tracking-wider">
          Finished Dosage Forms & Sterile Parentals
        </span>
        <h1 className="font-heading text-2xl font-black text-pharma-blue flex items-center gap-2 mt-0.5">
          <Pill className="h-6 w-6 text-teal-pharma" />
          Product Samples & Stability Testing
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Finished dosage batch release, In-Process Quality Control (IPQC), Water for Injection (WFI), and accelerated stability chamber pulls.
        </p>
      </div>

      <SampleTable
        samples={samples}
        initialCategory="ALL"
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
