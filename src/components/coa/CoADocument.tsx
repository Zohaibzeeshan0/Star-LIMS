"use client";

import React from "react";
import Image from "next/image";
import { SampleRecord } from "@/lib/types/sample";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer, Download, ShieldCheck, CheckCircle2 } from "lucide-react";

interface CoADocumentProps {
  sample: SampleRecord;
  samplesList?: SampleRecord[];
  onSelectSample?: (sample: SampleRecord) => void;
}

export function CoADocument({ sample, samplesList, onSelectSample }: CoADocumentProps) {
  const isReleased = sample.status === "Pass/Released";

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(sample, null, 2));
    const dl = document.createElement("a");
    dl.href = dataStr;
    dl.download = `CoA_${sample.batchNumber}.json`;
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar (Hidden on Print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200/80 bg-white shadow-xs">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-pharma-blue whitespace-nowrap">
            Select Batch for CoA:
          </label>
          {samplesList && onSelectSample && (
            <select
              value={sample.id}
              onChange={(e) => {
                const found = samplesList.find((s) => s.id === e.target.value);
                if (found) onSelectSample(found);
              }}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 shadow-2xs focus:border-pharma-blue focus:outline-none max-w-sm"
            >
              {samplesList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.batchNumber} - {s.productName} ({s.status})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadJSON}
            className="gap-1.5 text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            Export JSON
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 text-xs font-bold bg-pharma-blue hover:bg-pharma-blue-hover shadow-sm"
          >
            <Printer className="h-3.5 w-3.5" />
            Print / Save PDF CoA
          </Button>
        </div>
      </div>

      {/* Official Certificate Document Wrapper */}
      <div className="max-w-4xl mx-auto rounded-xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm text-slate-900 relative">
        {/* Letterhead */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-pharma-blue pb-6">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
              <Image
                src="/citi_pharma_logo.jpg"
                alt="Citi Pharma Emblem"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-black tracking-wide text-pharma-blue uppercase">
                Citi Pharma
              </h2>
              <p className="text-xs font-semibold text-slate-600">
                Quality Control & Quality Assurance Directorate
              </p>
              <p className="text-[11px] font-bold text-teal-pharma-dark mt-0.5">
                Quality • Precision • Compliance • WHO & FDA cGMP Validated
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <h1 className="font-heading text-xl font-extrabold text-pharma-blue uppercase tracking-tight">
              Certificate of Analysis
            </h1>
            <div className="font-mono text-xs text-slate-500 font-semibold mt-0.5">
              Ref: CP-CoA-{sample.batchNumber}
            </div>
            <div className="mt-2">
              <StatusBadge status={sample.status} />
            </div>
          </div>
        </div>

        {/* Batch Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 p-5 mt-6 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
          <div className="flex justify-between border-b border-dashed border-slate-200 pb-1.5">
            <span className="font-semibold text-slate-500">Product / Material:</span>
            <span className="font-bold text-pharma-blue">{sample.productName}</span>
          </div>
          <div className="flex justify-between border-b border-dashed border-slate-200 pb-1.5">
            <span className="font-semibold text-slate-500">Sample LIMS ID:</span>
            <span className="font-mono font-bold text-slate-800">{sample.id}</span>
          </div>
          <div className="flex justify-between border-b border-dashed border-slate-200 pb-1.5">
            <span className="font-semibold text-slate-500">Batch / Lot No:</span>
            <span className="font-mono font-bold text-slate-900">{sample.batchNumber}</span>
          </div>
          <div className="flex justify-between border-b border-dashed border-slate-200 pb-1.5">
            <span className="font-semibold text-slate-500">Pharmacopeial Standard:</span>
            <span className="font-bold text-teal-pharma-dark">{sample.pharmacopeia}</span>
          </div>
          <div className="flex justify-between border-b border-dashed border-slate-200 pb-1.5">
            <span className="font-semibold text-slate-500">Manufacturing Date:</span>
            <span className="font-mono text-slate-800">{sample.mfgDate}</span>
          </div>
          <div className="flex justify-between border-b border-dashed border-slate-200 pb-1.5">
            <span className="font-semibold text-slate-500">Expiry Date:</span>
            <span className="font-mono text-slate-800">{sample.expDate}</span>
          </div>
          <div className="flex justify-between border-b border-dashed border-slate-200 pb-1.5">
            <span className="font-semibold text-slate-500">Batch Quantity / Size:</span>
            <span className="font-semibold text-slate-800">{sample.batchSize}</span>
          </div>
          <div className="flex justify-between border-b border-dashed border-slate-200 pb-1.5">
            <span className="font-semibold text-slate-500">Storage Condition:</span>
            <span className="font-semibold text-slate-800">{sample.storageCondition}</span>
          </div>
        </div>

        {/* Analytical Results Table */}
        <div className="mt-8">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-pharma-blue mb-3">
            Analytical Monograph Testing Results
          </h3>
          <div className="rounded-lg border border-slate-200 overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[550px]">
              <thead className="bg-slate-100 border-b border-slate-200 font-bold uppercase text-[10px] text-slate-700">
                <tr>
                  <th className="py-2.5 px-3.5 w-1/3">Test Parameter</th>
                  <th className="py-2.5 px-3.5 w-1/3">Monograph Specification</th>
                  <th className="py-2.5 px-3.5 w-1/5">Observed Value</th>
                  <th className="py-2.5 px-3.5 text-right">Conformance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sample.tests.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3.5 font-bold text-slate-900">{t.name}</td>
                    <td className="py-2.5 px-3.5 font-mono text-slate-600 text-[11px]">{t.specification}</td>
                    <td className="py-2.5 px-3.5 font-extrabold text-pharma-blue">{t.observedResult}</td>
                    <td className="py-2.5 px-3.5 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.passed
                            ? "bg-teal-pharma/15 text-teal-pharma-dark"
                            : "bg-fail-red/15 text-fail-red-dark"
                        }`}
                      >
                        {t.passed ? "PASSED" : "FAILED"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disposition Rationale */}
        <div
          className={`mt-6 p-4 rounded-lg border text-xs ${
            isReleased
              ? "bg-teal-pharma/10 border-teal-pharma/30 text-teal-pharma-dark"
              : "bg-fail-red/10 border-fail-red/30 text-fail-red-dark"
          }`}
        >
          <strong className="block uppercase font-bold text-[11px]">
            {isReleased
              ? "✓ Quality Assurance Release Conclusion:"
              : "⚠ Quality Assurance Hold / Rejection Notice:"}
          </strong>
          <p className="mt-1 text-slate-700 font-medium">
            {sample.statusNotes}
          </p>
        </div>

        {/* Signatures & Certification */}
        <div className="grid grid-cols-2 gap-12 mt-10 pt-6 border-t border-slate-200">
          <div>
            <div className="border-b border-slate-400 pb-1 h-14 flex items-end">
              <span className="font-mono text-[11px] text-slate-500 italic">
                Digitally Authenticated: {sample.analyst}
              </span>
            </div>
            <span className="font-bold text-xs text-pharma-blue block mt-1.5">
              {sample.analyst}
            </span>
            <span className="text-[10px] text-slate-500 block">
              Senior QC Analytical Chemist
            </span>
          </div>

          <div className="relative">
            <div className="border-b border-slate-400 pb-1 h-14 flex items-end justify-between">
              <span className="font-mono text-[11px] text-slate-500 italic">
                Authorized Sign-off: {sample.reviewedBy}
              </span>
              <div
                className={`border-2 border-dashed px-2 py-1 rounded text-[9px] font-black uppercase transform -rotate-6 ${
                  isReleased
                    ? "border-teal-pharma text-teal-pharma"
                    : "border-fail-red text-fail-red"
                }`}
              >
                {isReleased ? "BATCH RELEASED" : "BATCH REJECTED"}
              </div>
            </div>
            <span className="font-bold text-xs text-pharma-blue block mt-1.5">
              {sample.reviewedBy}
            </span>
            <span className="text-[10px] text-slate-500 block">
              Head of Quality Assurance & Regulatory Affairs
            </span>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] text-slate-400 font-mono border-t border-slate-100 pt-3">
          Citi Pharma Laboratories • 21 CFR Part 11 Electronic Batch Release Record • Checksum: SHA-256-CP99824F
        </div>
      </div>
    </div>
  );
}
