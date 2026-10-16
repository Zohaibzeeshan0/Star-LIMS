"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  testReviewFormSchema,
  TestReviewFormValues,
} from "@/lib/validations/testing-schema";
import { TestWorklistItem, TestStatus } from "@/lib/types/testing";
import { ParameterStatusBadge, TestStatusBadge } from "./TestStatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  User,
  Calendar,
  Lock,
  Sparkles,
  Info,
  Loader2
} from "lucide-react";
import { UnsavedChangesDialog } from "@/components/ui/unsaved-changes-dialog";

interface TestReviewModalProps {
  test: TestWorklistItem | null;
  open: boolean;
  onClose: () => void;
  onSaveReview: (updatedTest: TestWorklistItem) => void;
}

export function TestReviewModal({
  test,
  open,
  onClose,
  onSaveReview,
}: TestReviewModalProps) {
  const [signatureChecked, setSignatureChecked] = useState(false);
  const [signatureError, setSignatureError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TestReviewFormValues>({
    resolver: zodResolver(testReviewFormSchema),
    defaultValues: {
      reviewedBy: "Dr. Farhan Malik (QC Lead)",
      reviewDate: new Date().toISOString().split("T")[0],
      reviewComments:
        test?.reviewComments ||
        "Chromatograms inspected against reference standard. System suitability criteria, baseline drift, and peak symmetry verified. Results conform to monograph release specifications.",
      disposition: test?.isOOS ? "Out of Specification" : "Reviewed",
    },
  });

  const handleRequestClose = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  if (!test) return null;

  const watchedDisposition = watch("disposition");
  const hasFailParams = test.parameters.some((p) => p.status === "Fail");

  const onSubmit = async (data: TestReviewFormValues) => {
    if (!signatureChecked) {
      setSignatureError("Electronic verification statement must be acknowledged.");
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    setSignatureError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedTest: TestWorklistItem = {
        ...test,
        reviewedBy: data.reviewedBy,
        reviewDate: data.reviewDate,
        reviewComments: data.reviewComments,
        status: data.disposition as TestStatus,
        isOOS: data.disposition === "Out of Specification" || hasFailParams,
        updatedAt: new Date().toISOString(),
      };

      onSaveReview(updatedTest);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && handleRequestClose()}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <span className="text-[10px] font-bold text-teal-pharma uppercase tracking-widest block">
                CITI PHARMA QUALITY ASSURANCE • ANALYTICAL REVIEW &amp; SIGN-OFF
              </span>
              <DialogTitle className="text-lg font-bold text-pharma-blue mt-0.5">
                QC Dossier Verification: {test.id}
              </DialogTitle>
              <p className="text-xs text-slate-500">
                {test.testType} • <span className="font-semibold text-slate-700">{test.materialOrProduct}</span> ({test.batchNumber})
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <TestStatusBadge status={test.status} isOOS={test.isOOS} />
              <span className="font-mono text-[11px] font-bold text-slate-500">
                Sample: {test.sampleId}
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Demo banner */}
        <div className="bg-blue-50/80 border border-blue-200 px-3 py-2 rounded-lg text-xs text-blue-900 flex items-start gap-2">
          <Info className="h-4 w-4 text-pharma-blue shrink-0 mt-0.5" />
          <span>
            <strong>Simulated QC Review Screen:</strong> Compares analyst entered results against registered specifications. Completing this review updates local state and simulates GLP audit log creation.
          </span>
        </div>

        {hasFailParams && (
          <div className="bg-rose-50 border border-rose-300 p-3 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-rose-900 block">
                Attention: Test Contains Non-Conforming Results
              </span>
              <span className="text-rose-800">
                One or more parameters failed specification limits. Recommended disposition is <strong>Out of Specification</strong> to trigger Phase I investigation.
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Section 1: Specification Comparison Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FlaskConical className="h-4 w-4 text-teal-pharma" />
                Specification Comparison &amp; Conformance Check
              </span>
              <span className="text-[11px] text-slate-500">
                Analyst: <strong>{test.assignedAnalyst}</strong> | Date: <strong>{test.testingDate || "N/A"}</strong>
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="bg-[#123B63] text-white">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Parameter Name</th>
                      <th className="py-2.5 px-3 font-semibold">Release Specification</th>
                      <th className="py-2.5 px-3 font-semibold">Unit</th>
                      <th className="py-2.5 px-3 font-semibold">Observed Value</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                      <th className="py-2.5 px-3 font-semibold">Instrument</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {test.parameters.map((param) => (
                      <tr
                        key={param.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          param.status === "Fail" ? "bg-rose-50/50" : ""
                        }`}
                      >
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          {param.name}
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
                                ? "bg-rose-100 text-rose-800"
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
                          {param.instrumentUsed || test.instrumentReference}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 2: Analyst Observations Review */}
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-800 block">
              Analyst Execution Records:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block uppercase">
                  Recorded Observations
                </span>
                <p className="text-slate-700 font-mono text-[11px] bg-white p-2 rounded border border-slate-200 mt-1">
                  {test.observations || "No observations recorded."}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 block uppercase">
                  Analyst Comments
                </span>
                <p className="text-slate-700 text-[11px] bg-white p-2 rounded border border-slate-200 mt-1">
                  {test.analystComments || "No analyst comments provided."}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: QA Review Form */}
          <div className="bg-teal-50/30 p-4 rounded-xl border border-teal-200 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-pharma">
              <ShieldCheck className="h-4 w-4" />
              Quality Assurance Sign-off &amp; Monograph Verification
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Reviewer Name &amp; Title *
                </label>
                <Input
                  {...register("reviewedBy")}
                  placeholder="e.g. Dr. Farhan Malik (QC Lead)"
                  className="h-8 text-xs bg-white"
                />
                {errors.reviewedBy && (
                  <p className="text-[10px] text-rose-600 mt-0.5">{errors.reviewedBy.message}</p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Review Date *
                </label>
                <Input
                  type="date"
                  {...register("reviewDate")}
                  className="h-8 text-xs bg-white"
                />
                {errors.reviewDate && (
                  <p className="text-[10px] text-rose-600 mt-0.5">{errors.reviewDate.message}</p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  QC Disposition *
                </label>
                <select
                  {...register("disposition")}
                  className="w-full h-8 text-xs bg-white border border-slate-200 rounded-md px-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-pharma font-semibold"
                >
                  <option value="Reviewed" className="text-teal-700 font-bold">
                    Reviewed (Approved QC Result)
                  </option>
                  <option value="Out of Specification" className="text-rose-600 font-bold">
                    Out of Specification (Flag OOS)
                  </option>
                  <option value="In Progress">
                    In Progress (Return to Analyst)
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                QA Verification &amp; Monograph Compliance Statement *
              </label>
              <Textarea
                {...register("reviewComments")}
                placeholder="Enter QA verification remarks, integration review details, and pharmacopeial compliance findings..."
                className="text-xs h-20 bg-white"
              />
              {errors.reviewComments && (
                <p className="text-[10px] text-rose-600 mt-0.5">{errors.reviewComments.message}</p>
              )}
            </div>

            {/* Electronic signature declaration */}
            <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={signatureChecked}
                  onChange={(e) => {
                    setSignatureChecked(e.target.checked);
                    if (e.target.checked) setSignatureError("");
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-xs text-slate-700 leading-snug">
                  <strong>21 CFR Part 11 Electronic Attestation:</strong> I confirm that I have reviewed the underlying analytical chromatograms, raw integration curves, equipment logs, and calculations, and verify that these results accurately represent the testing conducted under Citi Pharma standard operating procedures.
                </span>
              </label>
              {signatureError && (
                <p className="text-[11px] text-rose-600 font-bold ml-6">{signatureError}</p>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2 border-t pt-3">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              <span>Simulated Electronic Review Sign-off</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={submitting}
                onClick={handleRequestClose}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={watchedDisposition === "Out of Specification" ? "destructive" : "teal"}
                size="sm"
                disabled={isSubmitting || submitting}
                className="font-bold text-xs gap-1.5"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Signing Dossier...
                  </>
                ) : watchedDisposition === "Out of Specification" ? (
                  <>
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Confirm OOS Disposition
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Sign &amp; Complete Review
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
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
