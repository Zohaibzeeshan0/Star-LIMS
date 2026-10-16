"use client";

import React, { useState } from "react";
import { RetestSample } from "@/lib/types/retesting";
import { RetestStatusBadge } from "./RetestStatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Printer,
  Sparkles,
  Calendar,
  Layers,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Edit2,
  History,
  GitCommit,
  User,
  FlaskConical
} from "lucide-react";

interface ViewRetestModalProps {
  sample: RetestSample | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (sample: RetestSample) => void;
}

export function ViewRetestModal({
  sample,
  open,
  onClose,
  onEdit,
}: ViewRetestModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "history" | "timeline">("details");

  if (!sample) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto print:max-w-none print:m-0 print:p-0 print:border-none print:shadow-none">
        {/* Certificate / Details Container */}
        <div className="space-y-5 p-2 print:p-6 bg-white">
          {/* Mock Data Banner */}
          <div className="flex items-center justify-between bg-blue-50/80 border border-blue-200 px-3.5 py-1.5 rounded-lg text-[11px] text-blue-900 print:hidden">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-pharma-blue" />
              <span className="font-bold">Simulated Retest Record (Mock Data)</span>
              <span className="text-blue-700 font-normal hidden sm:inline">• Citi Pharma QC Surveillance Protocol</span>
            </div>
            <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-blue-200">
              SIMULATED RECORD
            </span>
          </div>

          {/* Header & Letterhead */}
          <div className="border-b-2 border-pharma-blue pb-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-teal-pharma uppercase tracking-widest">
                  CITI PHARMA QUALITY ASSURANCE &amp; CONTROL DIVISION
                </span>
                <h2 className="font-heading text-xl font-black text-pharma-blue mt-0.5">
                  View Retest Details: {sample.id}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Raw Material Retest Surveillance &amp; Shelf-Life Extension Protocol (ICH Q7 §7.5)
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5">
                <RetestStatusBadge status={sample.status} sample={sample} showUrgency />
                <span className="font-mono text-xs font-bold text-pharma-blue bg-pharma-blue/5 px-2.5 py-1 rounded border border-pharma-blue/20">
                  {sample.id}
                </span>
                <span className="text-[10px] text-slate-400">
                  Original Intake: {sample.rawMaterialSampleId}
                </span>
              </div>
            </div>

            {/* View Tabs */}
            <div className="flex items-center gap-2 mt-4 pt-2 border-t border-slate-100 print:hidden">
              <button
                onClick={() => setActiveTab("details")}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === "details"
                    ? "bg-pharma-blue text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                Retest Specifications &amp; Assays
              </button>

              <button
                onClick={() => setActiveTab("history")}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === "history"
                    ? "bg-pharma-blue text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <History className="h-3.5 w-3.5" />
                Previous Retest History ({sample.history?.length || 0})
              </button>

              <button
                onClick={() => setActiveTab("timeline")}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === "timeline"
                    ? "bg-pharma-blue text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <GitCommit className="h-3.5 w-3.5" />
                Sample Events Timeline ({sample.timeline?.length || 0})
              </button>
            </div>
          </div>

          {/* TAB 1: DETAILS & SPECIFICATIONS */}
          {(activeTab === "details" || typeof window === "undefined") && (
            <div className="space-y-5">
              {/* Material Identification & Warehouse Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Material Card */}
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-pharma-blue flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    Raw Material Identification
                  </span>

                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-slate-400">Material Name:</span>
                      <div className="font-bold text-slate-900 text-sm">{sample.materialName}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                      <div>
                        <span className="text-slate-400">Material Code:</span>
                        <div className="font-mono font-bold text-slate-800">{sample.materialCode}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Category:</span>
                        <div className="font-semibold text-slate-700">{sample.category}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                      <div>
                        <span className="text-slate-400">Batch / Lot Number:</span>
                        <div className="font-mono font-black text-pharma-blue">{sample.batchNumber}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Compendial Standard:</span>
                        <div className="font-semibold text-slate-700">{sample.pharmacopeia}</div>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-slate-200/60">
                      <span className="text-slate-400">Supplier &amp; Manufacturer:</span>
                      <div className="text-slate-700 font-medium">
                        {sample.supplier} • {sample.manufacturer}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warehouse Stock & Location Card */}
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-pharma-dark flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    Warehouse Staging &amp; Stock
                  </span>

                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-slate-400">Storage Location:</span>
                      <div className="font-bold text-slate-800">{sample.warehouseLocation}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Environmental Requirement:</span>
                      <div className="text-slate-700 font-medium">{sample.storageCondition}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                      <div>
                        <span className="text-slate-400">Remaining Quantity:</span>
                        <div className="font-bold text-slate-900 text-sm">
                          {sample.remainingStock.toLocaleString()} {sample.unit}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Containers Inspected:</span>
                        <div className="font-bold text-slate-800">
                          {sample.containersCount} sealed containers
                        </div>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-slate-200/60">
                      <span className="text-slate-400">Retest Reason:</span>
                      <div className="text-slate-700 font-medium">{sample.retestReason}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Retest Lifecycle Dates (Explicit user requirements) */}
              <div className="rounded-xl border border-teal-pharma/30 bg-teal-pharma/5 p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-pharma-dark flex items-center gap-1.5 mb-3">
                  <Clock className="h-3.5 w-3.5" />
                  Retest Schedule Chronology &amp; Horizon
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-teal-pharma/20">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Previous Test Date</span>
                    <div className="font-mono font-bold text-slate-800 mt-0.5">{sample.previousTestDate}</div>
                    <span className="text-[10px] text-slate-400">Initial intake / last cycle</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-teal-pharma/20">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Last Retest Date</span>
                    <div className="font-mono font-bold text-slate-800 mt-0.5">{sample.lastRetestDate}</div>
                    <span className="text-[10px] text-slate-400">Most recent assay run</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-teal-pharma/20">
                    <span className="text-[10px] font-bold uppercase text-amber-700">Next Retest Due Date</span>
                    <div className="font-mono font-black text-amber-800 mt-0.5">{sample.nextRetestDueDate}</div>
                    <span className="text-[10px] text-amber-700 font-semibold">Surveillance boundary</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-teal-pharma/40 shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-teal-pharma-dark flex items-center gap-1">
                      <Sparkles className="h-2.5 w-2.5" />
                      Extended Retest Date
                    </span>
                    <div className="font-mono font-black text-teal-700 text-sm mt-0.5">
                      {sample.extendedRetestDate || "Pending Testing"}
                    </div>
                    <span className="text-[10px] text-teal-700 font-semibold">
                      {sample.extensionMonthsGranted ? `+${sample.extensionMonthsGranted} Months Authorized` : "Under surveillance"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Analytical Test Battery Comparison */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-pharma-blue" />
                    Current Surveillance Analytical Results
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Monograph: {sample.pharmacopeia}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[650px]">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-600">
                        <th className="py-2.5 px-3">Test Parameter</th>
                        <th className="py-2.5 px-3">Approved Specification</th>
                        <th className="py-2.5 px-3">Initial Lot Value</th>
                        <th className="py-2.5 px-3">Current Surveillance Result</th>
                        <th className="py-2.5 px-3">Instrument</th>
                        <th className="py-2.5 px-3 text-right">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sample.tests.map((test) => (
                        <tr key={test.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            {test.parameter}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                            {test.specification}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                            {test.initialReleaseResult}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 font-mono text-[11px]">
                            {test.currentRetestResult}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 text-[10px]">
                            {test.instrumentUsed}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {test.passed ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                <CheckCircle2 className="h-3 w-3" />
                                Pass
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                <XCircle className="h-3 w-3" />
                                OOS
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Remarks */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Surveillance Observations &amp; Regulatory Remarks
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {sample.remarks}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PREVIOUS RETEST HISTORY */}
          {activeTab === "history" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <History className="h-4 w-4 text-pharma-blue" />
                  Historical Retest Surveillance Log &amp; Past Extensions
                </span>
                <span className="text-[11px] text-slate-500">
                  Total Completed Cycles: {sample.history?.length || 0}
                </span>
              </div>

              {(!sample.history || sample.history.length === 0) ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-8 text-center text-slate-500">
                  <Clock className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-xs text-slate-700">No prior retest history recorded.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    This sample is in its initial surveillance cycle (Cycle #{sample.retestCycleNumber}). Prior test date was initial lot release.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[650px]">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-600">
                        <th className="py-2.5 px-3">Cycle #</th>
                        <th className="py-2.5 px-3">Retest Date</th>
                        <th className="py-2.5 px-3">Potency Assay</th>
                        <th className="py-2.5 px-3">Water Content</th>
                        <th className="py-2.5 px-3">Extension Granted</th>
                        <th className="py-2.5 px-3">Analyst</th>
                        <th className="py-2.5 px-3 text-right">Disposition</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sample.history.map((h) => (
                        <tr key={h.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-mono font-bold text-pharma-blue">
                            Cycle #{h.cycleNumber}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-700">
                            {h.testDate}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                            {h.assayResult}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-700">
                            {h.waterContent}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-teal-700">
                            {h.extensionGranted}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {h.analyst}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                              <CheckCircle2 className="h-3 w-3" />
                              {h.disposition}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MOCK TIMELINE OF SAMPLE EVENTS */}
          {activeTab === "timeline" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <GitCommit className="h-4 w-4 text-pharma-blue" />
                  Chronological Mock Timeline of Sample Events
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Sample: {sample.id} • Batch: {sample.batchNumber}
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
                  {sample.timeline?.map((ev, idx) => {
                    const isCompleted = ev.state === "completed";
                    const isCurrent = ev.state === "current";

                    return (
                      <div key={ev.id || idx} className="relative pl-6">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-[9px] top-0.5 h-4 w-4 rounded-full border-2 bg-white flex items-center justify-center ${
                            isCompleted
                              ? "border-teal-500 text-teal-600"
                              : isCurrent
                              ? "border-amber-500 text-amber-600 ring-4 ring-amber-100"
                              : "border-slate-300 text-slate-400"
                          }`}
                        >
                          {isCompleted ? (
                            <div className="h-2 w-2 rounded-full bg-teal-500" />
                          ) : isCurrent ? (
                            <div className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                          ) : (
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                          )}
                        </div>

                        {/* Event Content */}
                        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="font-bold text-slate-900 text-xs">
                              {ev.title}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">
                              {ev.timestamp}
                            </span>
                          </div>

                          <div className="text-[11px] text-teal-pharma-dark font-semibold">
                            Stage: {ev.stage}
                          </div>

                          <p className="text-xs text-slate-600 leading-snug">
                            {ev.description}
                          </p>

                          <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-400">
                            <User className="h-3 w-3" />
                            <span>Action By: {ev.user}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Electronic Signatures (21 CFR Part 11) */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t-2 border-slate-200 text-xs">
            {/* Analyst Signature */}
            <div className="rounded-lg border border-slate-200 p-3 bg-white space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Assigned QC Analyst Sign-off
              </span>
              <div className="font-bold text-slate-900">{sample.analyst}</div>
              <div className="text-[10px] text-slate-500 font-mono">
                Verified: {sample.updatedAt.slice(0, 10)} 09:30 UTC
              </div>
              <div className="text-[9px] text-teal-700 flex items-center gap-1 font-semibold">
                <ShieldCheck className="h-3 w-3" />
                21 CFR Part 11 Cryptographically Sealed
              </div>
            </div>

            {/* QA Director Signature */}
            <div className="rounded-lg border border-slate-200 p-3 bg-white space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                QA Release &amp; Authorization
              </span>
              <div className="font-bold text-slate-900">{sample.reviewedBy}</div>
              <div className="text-[10px] text-slate-500 font-mono">
                Approved: {sample.qaDispositionDate || sample.updatedAt.slice(0, 10)} 14:15 UTC
              </div>
              <div className="text-[9px] text-teal-700 flex items-center gap-1 font-semibold">
                <ShieldCheck className="h-3 w-3" />
                Authorized for Dispensing Staging
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <DialogFooter className="pt-3 border-t border-slate-200 flex items-center justify-between print:hidden">
          <div className="text-[11px] text-slate-400">
            Citi Pharma LIMS • Document Control Ref: CP-SOP-QC-075-R04
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs text-slate-700"
            >
              <Printer className="h-3.5 w-3.5" />
              Print Certificate
            </Button>
            {onEdit && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onEdit(sample);
                }}
                className="gap-1.5 text-xs text-pharma-blue border-pharma-blue/30"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit Retest Schedule
              </Button>
            )}
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
