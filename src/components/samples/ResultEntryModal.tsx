"use client";

import React, { useState, useEffect } from "react";
import { SampleRecord, SampleStatus, TestParameter } from "@/lib/types/sample";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit3, CheckCircle2, AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";
import { UnsavedChangesDialog } from "@/components/ui/unsaved-changes-dialog";

interface ResultEntryModalProps {
  sample: SampleRecord | null;
  open: boolean;
  onClose: () => void;
  onSave: (updatedSample: SampleRecord) => void;
}

export function ResultEntryModal({
  sample,
  open,
  onClose,
  onSave,
}: ResultEntryModalProps) {
  const [tests, setTests] = useState<TestParameter[]>([]);
  const [status, setStatus] = useState<SampleStatus>("Pass/Released");
  const [statusNotes, setStatusNotes] = useState("");
  const [analystName, setAnalystName] = useState("Dr. Ayesha Khan");
  const [isDirty, setIsDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  useEffect(() => {
    if (sample) {
      setTests(JSON.parse(JSON.stringify(sample.tests)));
      setStatus(sample.status);
      setStatusNotes(sample.statusNotes);
      setAnalystName(sample.analyst || "Dr. Ayesha Khan");
      setIsDirty(false);
    }
  }, [sample]);

  const handleRequestClose = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  if (!sample) return null;

  const handleTestResultChange = (index: number, value: string) => {
    const updated = [...tests];
    updated[index].observedResult = value;
    setTests(updated);
    setIsDirty(true);
  };

  const handleTestPassToggle = (index: number, passed: boolean) => {
    const updated = [...tests];
    updated[index].passed = passed;
    setTests(updated);
    setIsDirty(true);

    // Automated evaluation of overall status
    const allPassed = updated.every((t) => t.passed);
    if (allPassed) {
      setStatus("Pass/Released");
    } else {
      setStatus("Fail/Rejected");
    }
  };

  const handleSave = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedSample: SampleRecord = {
        ...sample,
        tests,
        status,
        statusNotes:
          statusNotes.trim() ||
          `Verified by ${analystName} on ${new Date().toISOString().slice(0, 10)}.`,
        reviewedBy: `${analystName} (QC Analyst)`,
        reviewedDate: new Date().toISOString().slice(0, 16).replace("T", " "),
        observedSummary:
          tests.length > 0
            ? `${tests[0].name}: ${tests[0].observedResult}`
            : sample.observedSummary,
      };

      onSave(updatedSample);
      setIsDirty(false);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(val) => !val && handleRequestClose()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              <Edit3 className="h-5 w-5 text-pharma-blue" />
              <span>Enter Analytical Results: {sample.productName}</span>
            </DialogTitle>
            <p className="text-xs text-slate-500 font-mono">
              Lot #{sample.batchNumber} • Protocol: {sample.pharmacopeia}
            </p>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <p className="text-xs text-slate-600">
              Enter measured laboratory readings for each test parameter. Toggling compliance automatically re-evaluates the batch disposition.
            </p>

            {/* Test Inputs */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {tests.map((t, idx) => (
                <div
                  key={t.id}
                  className="grid grid-cols-12 gap-3 items-center p-3 rounded-lg border border-slate-200 bg-slate-50/60"
                >
                  <div className="col-span-5">
                    <span className="font-bold text-xs text-pharma-blue block">
                      {t.name}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 block truncate" title={t.specification}>
                      Spec: {t.specification}
                    </span>
                  </div>

                  <div className="col-span-5">
                    <Input
                      value={t.observedResult}
                      onChange={(e) => handleTestResultChange(idx, e.target.value)}
                      placeholder="Observed result"
                      className="h-8 text-xs bg-white"
                    />
                  </div>

                  <div className="col-span-2 flex justify-end">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold select-none">
                      <input
                        type="checkbox"
                        checked={t.passed}
                        onChange={(e) => handleTestPassToggle(idx, e.target.checked)}
                        className="rounded accent-teal-pharma h-4 w-4"
                      />
                      <span className={t.passed ? "text-teal-pharma-dark font-bold" : "text-fail-red font-bold"}>
                        {t.passed ? "Pass" : "Fail"}
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Disposition & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-xs font-bold text-pharma-blue mb-1">
                  Batch Disposition Status
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value as SampleStatus);
                    setIsDirty(true);
                  }}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-bold shadow-2xs focus:border-pharma-blue focus:outline-none"
                >
                  <option value="Pass/Released">Pass / Released (Teal Green)</option>
                  <option value="Quarantine/Retest">Quarantine / Retest (Warning Amber)</option>
                  <option value="Fail/Rejected">Fail / Rejected - OOS (Red)</option>
                  <option value="In Testing">In Testing (Blue)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-pharma-blue mb-1">
                  Authorized Sign-off Analyst
                </label>
                <Input
                  value={analystName}
                  onChange={(e) => {
                    setAnalystName(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Chemist Name"
                  className="h-9 text-xs font-semibold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-pharma-blue mb-1">
                  QA/QC Analytical Remarks & Disposition Conclusion
                </label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => {
                    setStatusNotes(e.target.value);
                    setIsDirty(true);
                  }}
                  rows={2}
                  placeholder="Enter analytical review rationale..."
                  className="w-full rounded-md border border-slate-200 bg-white p-2.5 text-xs text-slate-800 shadow-2xs focus:border-pharma-blue focus:outline-none"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleRequestClose}
              disabled={submitting}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              variant="teal"
              onClick={handleSave}
              disabled={submitting}
              size="sm"
              className="gap-1.5 font-bold"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving & Signing...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Save & Sign Electronically
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UnsavedChangesDialog
        isOpen={showDiscardConfirm}
        onStay={() => setShowDiscardConfirm(false)}
        onDiscard={() => {
          setShowDiscardConfirm(false);
          onClose();
        }}
      />
    </>
  );
}
