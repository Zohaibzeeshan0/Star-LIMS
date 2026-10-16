"use client";

import React, { useState } from "react";
import { TestWorklistItem } from "@/lib/types/testing";
import { TestStatusBadge, ParameterStatusBadge } from "./TestStatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FlaskConical,
  Calendar,
  User,
  Gauge,
  FileText,
  Printer,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Edit3,
  Clock,
  Sparkles,
  ClipboardList
} from "lucide-react";

interface TestDetailModalProps {
  test: TestWorklistItem | null;
  open: boolean;
  onClose: () => void;
  onEnterResults?: (test: TestWorklistItem) => void;
  onReview?: (test: TestWorklistItem) => void;
}

export function TestDetailModal({
  test,
  open,
  onClose,
  onEnterResults,
  onReview,
}: TestDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"parameters" | "observations" | "review">("parameters");

  if (!test) return null;

  const handlePrint = () => {
    window.print();
  };

  const passCount = test.parameters.filter((p) => p.status === "Pass").length;
  const failCount = test.parameters.filter((p) => p.status === "Fail").length;
  const pendingCount = test.parameters.filter((p) => p.status === "Pending").length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto print:max-w-none print:m-0 print:p-0 print:border-none print:shadow-none">
        <div className="space-y-5 p-1 sm:p-2 bg-white">
          {/* Mock Banner */}
          <div className="flex items-center justify-between bg-blue-50/90 border border-blue-200 px-3.5 py-1.5 rounded-lg text-[11px] text-blue-900 print:hidden">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-pharma-blue" />
              <span className="font-bold">Demonstration QC Laboratory Test Record</span>
              <span className="text-blue-700 font-normal hidden sm:inline">
                • Simulated cGMP/GLP analytical test entry &amp; QA review
              </span>
            </div>
            <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-blue-200">
              SIMULATED TEST DATA
            </span>
          </div>

          {/* Header */}
          <div className="border-b-2 border-pharma-blue pb-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-teal-pharma uppercase tracking-widest">
                  CITI PHARMA QUALITY CONTROL LABORATORY • TESTING DOSSIER
                </span>
                <h2 className="font-heading text-xl font-black text-pharma-blue mt-0.5">
                  Test Dossier: {test.id}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {test.testType} for <span className="font-semibold text-slate-700">{test.materialOrProduct}</span>
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5">
                <TestStatusBadge status={test.status} isOOS={test.isOOS} />
                <span className="font-mono text-xs font-bold text-pharma-blue bg-pharma-blue/5 px-2.5 py-1 rounded border border-pharma-blue/20">
                  {test.id}
                </span>
                <span className="text-[10px] text-slate-400">
                  Sample ID: {test.sampleId}
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mt-4 pt-2 border-t border-slate-100 print:hidden">
              <button
                onClick={() => setActiveTab("parameters")}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === "parameters"
                    ? "bg-pharma-blue text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <ClipboardList className="h-3.5 w-3.5" />
                Analytical Parameters ({test.parameters.length})
              </button>

              <button
                onClick={() => setActiveTab("observations")}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === "observations"
                    ? "bg-pharma-blue text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                Observations &amp; Analyst Notes
              </button>

              <button
                onClick={() => setActiveTab("review")}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === "review"
                    ? "bg-pharma-blue text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                QA Review &amp; Sign-off
                {test.status === "Reviewed" && (
                  <span className="h-2 w-2 rounded-full bg-teal-500 ml-1" />
                )}
              </button>
            </div>
          </div>

          {/* Sample & Assignment Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Sample ID
              </span>
              <span className="text-xs font-mono font-bold text-pharma-blue block mt-0.5">
                {test.sampleId}
              </span>
              <span className="text-[10px] text-slate-500 truncate block">
                {test.sampleCategory}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Batch / Lot #
              </span>
              <span className="text-xs font-mono font-bold text-slate-800 block mt-0.5">
                {test.batchNumber}
              </span>
              <span className="text-[10px] text-slate-500">
                Code: {test.materialOrProductCode}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Assigned Analyst
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <User className="h-3 w-3 text-pharma-blue" />
                <span className="text-xs font-semibold text-slate-800">
                  {test.assignedAnalyst}
                </span>
              </div>
              <span className="text-[10px] text-slate-500">
                Due: {test.dueDate}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Testing Reference
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <Gauge className="h-3 w-3 text-teal-pharma" />
                <span className="text-xs font-semibold text-slate-800 truncate" title={test.instrumentReference}>
                  {test.instrumentReference}
                </span>
              </div>
              <span className="text-[10px] text-slate-500">
                Date: {test.testingDate || "Pending"}
              </span>
            </div>
          </div>

          {/* TAB 1: Analytical Parameters */}
          {activeTab === "parameters" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span>Test Parameter Specifications &amp; Observed Results</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Pharmacopeial release specifications vs recorded analytical values
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    {passCount} Pass
                  </span>
                  {failCount > 0 && (
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-bold border border-rose-300 animate-pulse">
                      {failCount} Fail (OOS)
                    </span>
                  )}
                  {pendingCount > 0 && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
                      {pendingCount} Pending
                    </span>
                  )}
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#123B63] text-white">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">#</th>
                        <th className="py-2.5 px-3 font-semibold">Parameter Name</th>
                        <th className="py-2.5 px-3 font-semibold">Specification</th>
                        <th className="py-2.5 px-3 font-semibold">Unit</th>
                        <th className="py-2.5 px-3 font-semibold">Observed Result</th>
                        <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                        <th className="py-2.5 px-3 font-semibold">Instrument Used</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {test.parameters.map((param, idx) => (
                        <tr
                          key={param.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            param.status === "Fail" ? "bg-rose-50/40" : ""
                          }`}
                        >
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">
                            <div>{param.name}</div>
                            {param.analystNotes && (
                              <div className="text-[10px] text-slate-500 italic mt-0.5">
                                Note: {param.analystNotes}
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-700 bg-slate-50/50">
                            {param.specification}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 font-mono">
                            {param.unit}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold">
                            <span
                              className={`px-2 py-0.5 rounded ${
                                param.status === "Fail"
                                  ? "bg-rose-100 text-rose-800 font-black"
                                  : param.status === "Pass"
                                  ? "bg-emerald-50 text-emerald-800"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {param.observedResult || "—"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <ParameterStatusBadge status={param.status} />
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                            {param.instrumentUsed || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {test.isOOS && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-rose-900">
                      Out of Specification (OOS) Flagged
                    </h4>
                    <p className="text-[11px] text-rose-800 mt-0.5">
                      One or more parameter results have breached established release tolerances. Phase I laboratory investigation must be initiated prior to any batch disposition or re-test.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Observations & Analyst Notes */}
          {activeTab === "observations" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <FileText className="h-4 w-4 text-pharma-blue" />
                  Laboratory Observations &amp; Physical Analysis
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono">
                  {test.observations || "No analytical observations recorded."}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <User className="h-4 w-4 text-teal-pharma" />
                  Analyst Comments &amp; Protocol Execution
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {test.analystComments || "No analyst comments submitted."}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Assigned Analyst: <strong>{test.assignedAnalyst}</strong></span>
                  <span>Testing Date: <strong>{test.testingDate || "Pending"}</strong></span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Gauge className="h-4 w-4 text-indigo-600" />
                  Instrument &amp; Calibration Reference
                </div>
                <p className="text-xs text-slate-600">
                  Calibrated instrument reference: <strong className="font-mono text-slate-800">{test.instrumentReference}</strong>
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: QA Review & Sign-off */}
          {activeTab === "review" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <ShieldCheck className="h-4 w-4 text-teal-pharma" />
                    Quality Assurance Monograph Verification
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      test.status === "Reviewed"
                        ? "bg-teal-50 text-teal-800 border border-teal-300"
                        : "bg-amber-50 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {test.status === "Reviewed" ? "QA Verified & Signed" : "Pending QA Sign-off"}
                  </span>
                </div>

                {test.reviewedBy ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-teal-50/50 border border-teal-200 text-xs text-teal-900 leading-relaxed">
                      {test.reviewComments}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">
                          Reviewed By
                        </span>
                        <span className="font-bold text-slate-800">{test.reviewedBy}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">
                          Review Date
                        </span>
                        <span className="font-bold text-slate-800">{test.reviewDate}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Awaiting QA Review:</strong> This test dossier is currently awaiting review by a designated Quality Assurance officer or QC Laboratory Manager.
                    </div>
                  </div>
                )}
              </div>

              {/* 21 CFR Part 11 Electronic Signature Box */}
              <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-700">
                  <ShieldCheck className="h-4 w-4 text-pharma-blue" />
                  Simulated 21 CFR Part 11 Electronic Verification Block
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>System Record UUID: <span className="font-mono">{test.id}-UUID-V7</span></div>
                  <div>Audit Timestamp: <span className="font-mono">{test.updatedAt}</span></div>
                  <div>Integrity Hash: <span className="font-mono">SHA256:8f4c...citi-lims</span></div>
                  <div>Governance State: <span>Simulated Monograph Compliance</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Legal / Regulatory Disclaimer */}
          <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
            <span className="font-bold text-slate-700 shrink-0">Regulatory Notice:</span>
            <span>
              This interface presents mock laboratory QC data for interface workflow demonstration only. Real pharmaceutical release decisions require verified instruments, certified analysts, and authenticated 21 CFR Part 11 digital signatures.
            </span>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2 border-t pt-3 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="text-xs font-semibold gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Dossier
          </Button>

          <div className="flex items-center gap-2">
            {onEnterResults && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onEnterResults(test);
                }}
                className="text-xs font-bold gap-1.5 border-pharma-blue text-pharma-blue hover:bg-pharma-blue/10"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Enter / Edit Results
              </Button>
            )}

            {onReview && test.status !== "Reviewed" && (
              <Button
                variant="teal"
                size="sm"
                onClick={() => {
                  onClose();
                  onReview(test);
                }}
                className="text-xs font-bold gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                QA Review &amp; Sign-off
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
