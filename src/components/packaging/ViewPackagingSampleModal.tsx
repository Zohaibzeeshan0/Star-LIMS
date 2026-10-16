"use client";

import React from "react";
import { PackagingSample } from "@/lib/types/packaging";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PackagingStatusBadge } from "./PackagingStatusBadge";
import {
  Package,
  FileText,
  Calendar,
  Building2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Edit,
  Barcode
} from "lucide-react";

interface ViewPackagingSampleModalProps {
  sample: PackagingSample | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (sample: PackagingSample) => void;
}

export function ViewPackagingSampleModal({
  sample,
  open,
  onClose,
  onEdit,
}: ViewPackagingSampleModalProps) {
  if (!sample) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <DialogTitle>
              <Package className="h-5 w-5 text-teal-pharma" />
              <span>{sample.materialName}</span>
            </DialogTitle>
            <PackagingStatusBadge status={sample.status} />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mt-1">
            <span>ID: <strong className="text-pharma-blue">{sample.id}</strong></span>
            <span>•</span>
            <span>Item Code: <strong className="text-slate-800">{sample.materialCode}</strong></span>
            <span>•</span>
            <span>Batch/Lot: <strong className="text-slate-900">{sample.batchNumber}</strong></span>
          </div>
        </DialogHeader>

        {/* Core Metadata Card */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <div>
            <span className="font-semibold text-slate-400 block uppercase text-[10px]">Packaging Type</span>
            <span className="font-bold text-pharma-blue mt-0.5 block">{sample.packagingType}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block uppercase text-[10px]">Supplier / Vendor</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{sample.supplier}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block uppercase text-[10px]">Manufacturer</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{sample.manufacturer}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block uppercase text-[10px]">Quantity & Unit</span>
            <span className="font-bold text-slate-800 mt-0.5 block">
              {sample.quantity.toLocaleString()} {sample.unit}
            </span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block uppercase text-[10px]">Received Date</span>
            <span className="font-mono text-slate-800 mt-0.5 block">{sample.receivedDate}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block uppercase text-[10px]">Sampling Date</span>
            <span className="font-mono text-slate-800 mt-0.5 block">{sample.samplingDate}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block uppercase text-[10px]">Storage Location</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{sample.storageLocation}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block uppercase text-[10px]">Assigned Analyst</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{sample.analyst}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block uppercase text-[10px]">Specification Ref</span>
            <span className="font-mono text-slate-700 mt-0.5 block truncate">{sample.specificationRef || "Standard Monograph"}</span>
          </div>
        </div>

        {/* Physical & Functional Monograph Tests */}
        <div className="space-y-2">
          <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-pharma-blue flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-teal-pharma" />
            Quality Control Physical & Barrier Testing
          </h4>
          <div className="rounded-lg border border-slate-200 overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-slate-100/70 border-b border-slate-200 font-bold uppercase text-[10px] text-slate-600">
                <tr>
                  <th className="py-2.5 px-3">Test Parameter</th>
                  <th className="py-2.5 px-3">Monograph Limit</th>
                  <th className="py-2.5 px-3">Observed Reading</th>
                  <th className="py-2.5 px-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sample.tests && sample.tests.length > 0 ? (
                  sample.tests.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-semibold text-slate-900">{t.name}</td>
                      <td className="py-2 px-3 font-mono text-slate-600 text-[11px]">{t.specification}</td>
                      <td className="py-2 px-3 font-bold text-pharma-blue">{t.observedResult}</td>
                      <td className="py-2 px-3 text-right">
                        {t.passed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-pharma-light text-teal-pharma-dark border border-teal-pharma/20">
                            <CheckCircle2 className="h-3 w-3" />
                            Pass
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-fail-red-light text-fail-red-dark border border-fail-red/20">
                            <XCircle className="h-3 w-3" />
                            OOS / Fail
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-400 italic">
                      Standard monograph testing schedule in progress.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Remarks & QA Disposition */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-pharma-blue mb-1">
            <ShieldCheck className="h-4 w-4 text-teal-pharma" />
            <span>Inspection Notes & Disposition Assessment</span>
          </div>
          <p className="text-slate-600 italic leading-relaxed">
            &ldquo;{sample.remarks}&rdquo;
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Reviewed By: <strong className="text-slate-800">{sample.inspectedBy}</strong></span>
            <span>Recorded: {sample.updatedAt.slice(0, 10)}</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          {onEdit && (
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(sample);
              }}
              className="gap-1.5 font-bold"
            >
              <Edit className="h-3.5 w-3.5" />
              Edit Sample
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
