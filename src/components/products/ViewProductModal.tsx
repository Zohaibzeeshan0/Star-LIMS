"use client";

import React from "react";
import { ProductSample } from "@/lib/types/product";
import { ProductStatusBadge } from "./ProductStatusBadge";
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
  Calendar,
  Pill,
  Factory,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Edit2,
  Clock,
  Layers
} from "lucide-react";

interface ViewProductModalProps {
  sample: ProductSample | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (sample: ProductSample) => void;
}

export function ViewProductModal({
  sample,
  open,
  onClose,
  onEdit,
}: ViewProductModalProps) {
  if (!sample) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto print:max-w-none print:m-0 print:p-0 print:border-none print:shadow-none">
        {/* Certificate Container */}
        <div className="space-y-6 p-2 print:p-6 bg-white">
          {/* Header & Letterhead */}
          <div className="border-b-2 border-pharma-blue pb-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-teal-pharma uppercase tracking-widest">
                  CITI PHARMA QUALITY ASSURANCE & FINISHED BATCH RELEASE
                </span>
                <h2 className="font-heading text-xl font-black text-pharma-blue mt-0.5">
                  Finished Product Batch Release Certificate / Analytical Protocol
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Compliance with cGMP, DRAP Finished Product Specifications & ICH Guidelines
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5">
                <ProductStatusBadge
                  status={sample.status}
                  stage={sample.stage}
                  stabilityInterval={sample.stabilityInterval}
                />
                <span className="font-mono text-xs font-bold text-pharma-blue bg-pharma-blue/5 px-2.5 py-1 rounded border border-pharma-blue/20">
                  {sample.id}
                </span>
                <span className="text-[10px] text-slate-400">
                  Code: {sample.productCode}
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Product Profile & Batch Provenance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Card */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-pharma-blue flex items-center gap-1.5">
                <Pill className="h-3.5 w-3.5" />
                Product Identity & Formulation
              </span>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-400">Brand Name:</span>
                  <div className="font-bold text-slate-900 text-sm">{sample.productName}</div>
                </div>
                <div>
                  <span className="text-slate-400">Active Generic Substance:</span>
                  <div className="font-semibold text-teal-pharma-dark">{sample.genericName}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                  <div>
                    <span className="text-slate-400">Dosage Form:</span>
                    <div className="font-medium text-slate-800">{sample.dosageForm}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Compendial Standard:</span>
                    <div className="font-medium text-slate-800">{sample.pharmacopeia}</div>
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-200/60">
                  <span className="text-slate-400">Packaging Presentation:</span>
                  <div className="text-slate-700 font-medium">{sample.packagingPresentation}</div>
                </div>
              </div>
            </div>

            {/* Batch & Manufacturing Card */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-pharma-dark flex items-center gap-1.5">
                <Factory className="h-3.5 w-3.5" />
                Manufacturing & Release Stream
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400">Batch / Lot Number:</span>
                    <div className="font-mono font-bold text-pharma-blue text-sm">{sample.batchNumber}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Commercial Batch Size:</span>
                    <div className="font-bold text-slate-800">{sample.batchSize}</div>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400">Production Line:</span>
                  <div className="font-medium text-slate-800">{sample.productionLine}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                  <div>
                    <span className="text-slate-400">Testing Stream:</span>
                    <div className="font-semibold text-slate-700">{sample.stage}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Target Market:</span>
                    <div className="font-semibold text-slate-700">{sample.targetMarket}</div>
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-200/60">
                  <span className="text-slate-400">Storage Specification:</span>
                  <div className="text-slate-700 font-medium">{sample.storageCondition}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Shelf-Life Chronology */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
              <Calendar className="h-3.5 w-3.5" />
              Batch Lifecycle & Stability Milestones
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400">Manufacturing Date</span>
                <div className="font-mono font-bold text-slate-800 mt-0.5">{sample.manufacturingDate}</div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400">Expiration Date</span>
                <div className="font-mono font-bold text-slate-800 mt-0.5">{sample.expiryDate}</div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400">Sampling Date</span>
                <div className="font-mono font-bold text-slate-800 mt-0.5">{sample.samplingDate}</div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400">Quantity Tested</span>
                <div className="font-mono font-bold text-slate-800 mt-0.5">
                  {sample.quantitySampled} {sample.unit}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Analytical Test Battery Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-pharma-blue" />
                Laboratory Analytical Test Battery
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Monograph: {sample.pharmacopeia}
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-600">
                    <th className="py-2.5 px-3">Test Parameter</th>
                    <th className="py-2.5 px-3">Approved Release Specification</th>
                    <th className="py-2.5 px-3">Observed Result</th>
                    <th className="py-2.5 px-3">Instrument / Method</th>
                    <th className="py-2.5 px-3 text-right">Disposition</th>
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
                      <td className="py-2.5 px-3 font-bold text-slate-900 font-mono text-[11px]">
                        {test.observedResult}
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
                            OOS / Fail
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: QA Remarks */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1.5 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Quality Assurance Disposition & Release Remarks
            </span>
            <p className="text-slate-800 leading-relaxed font-medium">
              {sample.remarks}
            </p>
          </div>

          {/* Section 5: Electronic Signatures (21 CFR Part 11) */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t-2 border-slate-200 text-xs">
            {/* QC Analyst Sign-off */}
            <div className="rounded-lg border border-slate-200 p-3 bg-white space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                QC Analyst Sign-off
              </span>
              <div className="font-bold text-slate-900">{sample.analyst}</div>
              <div className="text-[10px] text-slate-500 font-mono">
                Executed: {sample.updatedAt.slice(0, 10)} 11:20 UTC
              </div>
              <div className="text-[9px] text-teal-700 flex items-center gap-1 font-semibold">
                <ShieldCheck className="h-3 w-3" />
                21 CFR Part 11 Electronic Signature Verified
              </div>
            </div>

            {/* QA Release Director Sign-off */}
            <div className="rounded-lg border border-slate-200 p-3 bg-white space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                QA Batch Release Authorization
              </span>
              <div className="font-bold text-slate-900">{sample.reviewedBy}</div>
              <div className="text-[10px] text-slate-500 font-mono">
                Released: {sample.qaReleaseDate || sample.updatedAt.slice(0, 10)} 15:30 UTC
              </div>
              <div className="text-[9px] text-teal-700 flex items-center gap-1 font-semibold">
                <ShieldCheck className="h-3 w-3" />
                Batch Cleared for Commercial Distribution
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <DialogFooter className="pt-3 border-t border-slate-200 flex items-center justify-between print:hidden">
          <div className="text-[11px] text-slate-400">
            Citi Pharma LIMS • Form Ref: CP-FRM-QA-089-R03
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
                Edit Record
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
