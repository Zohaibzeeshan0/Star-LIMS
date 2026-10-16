"use client";

import React from "react";
import Image from "next/image";
import { UnifiedReportItem } from "@/lib/types/report";
import { Button } from "@/components/ui/button";
import {
  Printer,
  Download,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Calendar,
  Building,
  Layers,
  FlaskConical,
  Award
} from "lucide-react";
import { exportReportToCSV } from "@/lib/report-service";

interface SampleReportPreviewModalProps {
  item: UnifiedReportItem | null;
  open: boolean;
  onClose: () => void;
}

export function SampleReportPreviewModal({
  item,
  open,
  onClose
}: SampleReportPreviewModalProps) {
  if (!open || !item) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportItemCSV = () => {
    exportReportToCSV([item], `Sample_${item.id}`);
  };

  // Extract raw tests if available
  const rawDetails = item.rawDetails as any;
  const rawTests: Array<{
    name?: string;
    parameter?: string;
    specification?: string;
    observedResult?: string;
    observedValue?: string;
    passed?: boolean;
    status?: string;
    instrumentUsed?: string;
  }> = rawDetails?.tests || rawDetails?.parameters || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Action Header Toolbar (Hidden in Print) */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-6 py-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="font-heading text-xs font-bold uppercase tracking-wider text-pharma-blue">
              Official Quality Control Sample Dossier Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportItemCSV}
              className="h-8 gap-1.5 text-xs text-slate-700 hover:text-pharma-blue border-slate-300"
            >
              <Download className="h-3.5 w-3.5 text-teal-pharma" />
              <span>Export CSV</span>
            </Button>

            <Button
              variant="teal"
              size="sm"
              onClick={handlePrint}
              className="h-8 gap-1.5 text-xs font-bold shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </Button>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors ml-2"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-10 overflow-y-auto space-y-6 text-slate-800 bg-white" id="printable-report">
          {/* Watermark / Demo Disclaimer Banner */}
          <div className="rounded-lg border border-amber-300 bg-amber-50/90 px-4 py-2.5 text-center text-xs text-amber-900 font-semibold shadow-2xs">
            ⚠️ <strong>DEMONSTRATION LIMS REPORT:</strong> Simulated pharmaceutical data for Citi Pharma laboratory information architecture demonstration only. Not for clinical, regulatory, or batch commercial disposition.
          </div>

          {/* Letterhead Header */}
          <div className="border-b-2 border-pharma-blue pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <Image
                    src="/citi_pharma_logo.jpg"
                    alt="Citi Pharma Crest"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="font-heading text-xl font-black uppercase tracking-wider text-pharma-blue">
                    Citi Pharma Limited
                  </h1>
                  <p className="text-xs font-semibold text-teal-pharma">
                    Central Quality Assurance &amp; Analytical Control Laboratories
                  </p>
                  <p className="text-[10px] text-slate-500">
                    GMP Certified Facility • ISO/IEC 17025 Accredited • 21 CFR Part 11 Compliant LIMS
                  </p>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
                <span className="inline-block rounded bg-pharma-blue px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-white">
                  Certificate of Testing
                </span>
                <div className="mt-1 font-mono text-xs font-bold text-slate-700">
                  Doc Ref: CP-QC-{item.id}
                </div>
                <div className="text-[10px] text-slate-500">
                  Issued: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </div>
              </div>
            </div>
          </div>

          {/* Sample Metadata Specification Grid */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <h3 className="font-heading text-xs font-extrabold uppercase tracking-wider text-pharma-blue mb-3 flex items-center gap-1.5 border-b border-slate-200/80 pb-1.5">
              <Layers className="h-3.5 w-3.5 text-teal-pharma" />
              <span>Sample Identification &amp; Traceability Record</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Sample / Dossier ID
                </span>
                <span className="font-mono font-bold text-pharma-blue mt-0.5 block">
                  {item.id}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Batch / Lot Number
                </span>
                <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 mt-0.5 inline-block">
                  {item.batchNumber}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Stream Category
                </span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {item.streamLabel}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Overall Disposition
                </span>
                <div className="mt-0.5">
                  {item.dispositionType === "PASS" ? (
                    <span className="inline-flex items-center gap-1 font-bold text-teal-pharma text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {item.status}
                    </span>
                  ) : item.dispositionType === "QUARANTINE" ? (
                    <span className="inline-flex items-center gap-1 font-bold text-amber-600 text-xs">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {item.status}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-bold text-critical-red text-xs">
                      <XCircle className="h-3.5 w-3.5" />
                      {item.status}
                    </span>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Material / Product Name
                </span>
                <span className="font-heading font-bold text-sm text-slate-900 mt-0.5 block">
                  {item.title}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Internal Code
                </span>
                <span className="font-mono font-semibold text-slate-700 mt-0.5 block">
                  {item.code}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Standard Monograph
                </span>
                <span className="font-medium text-slate-700 mt-0.5 block">
                  {item.pharmacopeiaOrSpec}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Supplier / Manufacturer
                </span>
                <span className="font-medium text-slate-800 mt-0.5 block">
                  {item.supplierOrMfr}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Date Recorded
                </span>
                <span className="font-medium text-slate-800 mt-0.5 block">
                  {item.date}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Lead Analyst
                </span>
                <span className="font-medium text-slate-800 mt-0.5 block">
                  {item.analyst}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Storage Conditions
                </span>
                <span className="font-medium text-slate-800 mt-0.5 block truncate" title={item.storageLocationOrCondition}>
                  {item.storageLocationOrCondition}
                </span>
              </div>
            </div>
          </div>

          {/* Test Monograph Results Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xs font-extrabold uppercase tracking-wider text-pharma-blue flex items-center gap-1.5">
                <FlaskConical className="h-3.5 w-3.5 text-teal-pharma" />
                <span>Analytical Monograph Results &amp; Limits Verification</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-500">
                Evaluation: <strong>{item.testsSummary.passed}</strong> Passed / {item.testsSummary.total} Total
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-[10px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200">
                    <th className="px-3.5 py-2.5">#</th>
                    <th className="px-3.5 py-2.5">Analytical Parameter</th>
                    <th className="px-3.5 py-2.5">Acceptance Limit / Specification</th>
                    <th className="px-3.5 py-2.5">Observed Test Value</th>
                    <th className="px-3.5 py-2.5 text-center">Disposition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rawTests.length > 0 ? (
                    rawTests.map((t, idx) => {
                      const paramName = t.name || t.parameter || `Test Parameter ${idx + 1}`;
                      const spec = t.specification || "Conforms to Monograph";
                      const observed = t.observedResult || t.observedValue || "Conforms";
                      const isPass = t.passed ?? (t.status === "Pass" || !t.status?.includes("Fail"));

                      return (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-3.5 py-2 font-mono text-slate-400">{idx + 1}</td>
                          <td className="px-3.5 py-2 font-bold text-slate-800">{paramName}</td>
                          <td className="px-3.5 py-2 font-mono text-slate-600">{spec}</td>
                          <td className="px-3.5 py-2 font-mono font-bold text-pharma-blue">{observed}</td>
                          <td className="px-3.5 py-2 text-center">
                            {isPass ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-pharma-dark bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                Pass
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-critical-red bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                Fail / OOS
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-xs text-slate-500">
                        {item.keyParameterResult || "All standard pharmacopeial tests conducted in compliance with cGMP protocol."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 21 CFR Part 11 Electronic Approvals & Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t-2 border-slate-200">
            <div className="rounded-lg border border-slate-200/80 bg-slate-50/50 p-3.5 text-center space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                1. Conducted By
              </span>
              <div className="font-serif italic text-sm text-slate-700 min-h-[28px] flex items-center justify-center">
                {item.analyst}
              </div>
              <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500">
                QC Analytical Chemist
                <div className="font-mono text-[9px] text-slate-400 mt-0.5">
                  ID: CP-CHEM-9842 • Signed
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200/80 bg-slate-50/50 p-3.5 text-center space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                2. Reviewed By
              </span>
              <div className="font-serif italic text-sm text-teal-pharma-dark min-h-[28px] flex items-center justify-center">
                Dr. Ayesha Khan
              </div>
              <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500">
                Senior QC Lead Chemist
                <div className="font-mono text-[9px] text-slate-400 mt-0.5">
                  21 CFR Part 11 Verified
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200/80 bg-slate-50/50 p-3.5 text-center space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                3. Authorized QA Release
              </span>
              <div className="font-serif italic text-sm text-pharma-blue min-h-[28px] flex items-center justify-center font-bold">
                Farhan Malik
              </div>
              <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500">
                Head of Quality Assurance
                <div className="font-mono text-[9px] text-slate-400 mt-0.5">
                  Batch Disposition Certified
                </div>
              </div>
            </div>
          </div>

          {/* Footer Seals */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-3">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-pharma" />
              <span>Certified Tamper-Evident LIMS Electronic Record</span>
            </span>
            <span>Citi Pharma Laboratories • Confidential Analytical Dossier</span>
          </div>
        </div>
      </div>
    </div>
  );
}
