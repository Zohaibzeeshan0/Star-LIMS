"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_SAMPLES } from "@/lib/mock-data/samples";
import { SampleRecord } from "@/lib/types/sample";
import { CoADocument } from "@/components/coa/CoADocument";
import { FileCheck2 } from "lucide-react";

function CoAPageContent() {
  const searchParams = useSearchParams();
  const sampleIdParam = searchParams.get("sampleId");

  const [selectedSample, setSelectedSample] = useState<SampleRecord>(
    () =>
      MOCK_SAMPLES.find((s) => s.id === sampleIdParam) ||
      MOCK_SAMPLES.find((s) => s.status === "Pass/Released") ||
      MOCK_SAMPLES[0]
  );

  useEffect(() => {
    if (sampleIdParam) {
      const found = MOCK_SAMPLES.find((s) => s.id === sampleIdParam);
      if (found) setSelectedSample(found);
    }
  }, [sampleIdParam]);

  return (
    <div className="space-y-6">
      <div className="no-print border-b border-slate-200/80 pb-4">
        <span className="text-xs font-bold text-teal-pharma uppercase tracking-wider">
          Commercial & Clinical Release
        </span>
        <h1 className="font-heading text-2xl font-black text-pharma-blue flex items-center gap-2 mt-0.5">
          <FileCheck2 className="h-6 w-6 text-teal-pharma" />
          Official Certificate of Analysis (CoA)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Exportable, print-formatted regulatory document verifying pharmacopeial test conformance under 21 CFR Part 11 electronic sign-off.
        </p>
      </div>

      <CoADocument
        sample={selectedSample}
        samplesList={MOCK_SAMPLES}
        onSelectSample={(s) => setSelectedSample(s)}
      />
    </div>
  );
}

export default function CoAPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Certificate of Analysis...</div>}>
      <CoAPageContent />
    </Suspense>
  );
}
