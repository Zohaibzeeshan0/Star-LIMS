"use client";

import React from "react";
import { SampleRecord } from "@/lib/types/sample";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { FlaskConical, FileText, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

interface SampleDetailModalProps {
  sample: SampleRecord | null;
  open: boolean;
  onClose: () => void;
}

export function SampleDetailModal({ sample, open, onClose }: SampleDetailModalProps) {
  if (!sample) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <DialogTitle>
              <FlaskConical className="h-5 w-5 text-teal-pharma" />
              <span>{sample.productName}</span>
            </DialogTitle>
            <StatusBadge status={sample.status} />
          </div>
          <p className="text-xs text-slate-500 font-mono">
            Sample ID: {sample.id} • Lot #{sample.batchNumber} • Protocol: {sample.pharmacopeia}
          </p>
        </DialogHeader>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
          <div>
            <span className="font-semibold text-slate-400 block uppercase text-[10px]">Classification</span>
            <span className="font-bold text-pharma-blue mt-0.5 block">{sample.category}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block uppercase text-[10px]">Batch Size / Qty</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{sample.batchSize}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block uppercase text-[10px]">Storage Condition</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{sample.storageCondition}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block uppercase text-[10px]">Mfg / Received Date</span>
            <span className="font-mono text-slate-800 mt-0.5 block">{sample.mfgDate} / {sample.receivedDate}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block uppercase text-[10px]">Expiry / Retest Date</span>
            <span className="font-mono text-slate-800 mt-0.5 block">
              {sample.expDate} {sample.retestDate ? `(Retest: ${sample.retestDate})` : ""}
            </span>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block uppercase text-[10px]">Assigned Analyst</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{sample.analyst}</span>
          </div>
        </div>

        {/* Analytical Tests Breakdown */}
        <div>
          <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-pharma-blue mb-2 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-teal-pharma" />
            Pharmacopeial Analytical Conformance
          </h4>
          <div className="rounded-lg border border-slate-200 overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-600">
                <tr>
                  <th className="py-2.5 px-3">Test Parameter</th>
                  <th className="py-2.5 px-3">Monograph Specification</th>
                  <th className="py-2.5 px-3">Observed Result</th>
                  <th className="py-2.5 px-3 text-right">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sample.tests.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{t.name}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">{t.specification}</td>
                    <td className="py-2.5 px-3 font-bold text-pharma-blue">{t.observedResult}</td>
                    <td className="py-2.5 px-3 text-right">
                      {t.passed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-pharma/10 text-teal-pharma-dark border border-teal-pharma/20">
                          <CheckCircle2 className="h-3 w-3" />
                          Complies
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-fail-red/10 text-fail-red-dark border border-fail-red/20">
                          <XCircle className="h-3 w-3" />
                          OOS Flag
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* QA Review & Disposition Conclusion */}
        <div className="rounded-lg border border-slate-200/80 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-pharma-blue">
            <ShieldCheck className="h-4 w-4 text-teal-pharma" />
            <span>Quality Assurance Disposition Remarks</span>
          </div>
          <p className="mt-1 text-xs text-slate-600 italic">
            {sample.statusNotes}
          </p>
          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Reviewed By: <strong className="text-slate-800">{sample.reviewedBy}</strong></span>
            <span>Date: {sample.reviewedDate}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} size="sm">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
