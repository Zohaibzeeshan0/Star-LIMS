"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resultEntryFormSchema,
  ResultEntryFormValues,
} from "@/lib/validations/testing-schema";
import { TestWorklistItem, TestStatus } from "@/lib/types/testing";
import { ParameterStatusBadge } from "./TestStatusBadge";
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
  FlaskConical,
  Save,
  AlertTriangle,
  User,
  Calendar,
  Gauge,
  CheckCircle2,
  Info,
  ShieldAlert
} from "lucide-react";

interface ResultEntryModalProps {
  test: TestWorklistItem | null;
  open: boolean;
  onClose: () => void;
  onSave: (updatedTest: TestWorklistItem) => void;
}

function evaluateResultStatus(
  inputType: "numeric" | "text" | "selectable",
  val: string,
  minAllowed?: number,
  maxAllowed?: number
): "Pass" | "Fail" | "Pending" {
  const trimmed = (val || "").trim();
  if (!trimmed) return "Pending";

  if (inputType === "numeric") {
    const num = parseFloat(trimmed);
    if (isNaN(num)) return "Fail";
    if (minAllowed !== undefined && num < minAllowed) return "Fail";
    if (maxAllowed !== undefined && num > maxAllowed) return "Fail";
    return "Pass";
  }

  if (inputType === "selectable") {
    const lower = trimmed.toLowerCase();
    if (lower.includes("does not") || lower.includes("fail") || lower.includes("non-conforming")) {
      return "Fail";
    }
    return "Pass";
  }

  // text
  const lower = trimmed.toLowerCase();
  if (lower.includes("fail") || lower.includes("does not comply") || lower.includes("turbid") || lower.includes("growth observed")) {
    return "Fail";
  }
  return "Pass";
}

export function ResultEntryModal({
  test,
  open,
  onClose,
  onSave,
}: ResultEntryModalProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResultEntryFormValues>({
    resolver: zodResolver(resultEntryFormSchema),
    defaultValues: {
      id: "",
      sampleId: "",
      materialOrProduct: "",
      batchNumber: "",
      testType: "",
      assignedAnalyst: "",
      testingDate: new Date().toISOString().split("T")[0],
      instrumentReference: "",
      observations: "",
      analystComments: "",
      status: "In Progress",
      parameters: [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "parameters",
  });

  useEffect(() => {
    if (test) {
      reset({
        id: test.id,
        sampleId: test.sampleId,
        materialOrProduct: test.materialOrProduct,
        batchNumber: test.batchNumber,
        testType: test.testType,
        assignedAnalyst: test.assignedAnalyst,
        testingDate: test.testingDate || new Date().toISOString().split("T")[0],
        instrumentReference: test.instrumentReference,
        observations: test.observations || "",
        analystComments: test.analystComments || "",
        status: test.status,
        parameters: test.parameters.map((p) => ({
          id: p.id,
          name: p.name,
          specification: p.specification,
          unit: p.unit,
          inputType: p.inputType,
          observedResult: p.observedResult || "",
          status: p.status,
          instrumentUsed: p.instrumentUsed || test.instrumentReference,
          analystNotes: p.analystNotes || "",
        })),
      });
    }
  }, [test, reset]);

  if (!test) return null;

  const watchedParameters = watch("parameters") || [];
  const watchedStatus = watch("status");

  // Determine if any parameter is Fail
  const hasOOS = watchedParameters.some((p) => p.status === "Fail");

  // Real-time evaluation handler
  const handleResultChange = (
    index: number,
    newValue: string,
    inputType: "numeric" | "text" | "selectable",
    minAllowed?: number,
    maxAllowed?: number
  ) => {
    setValue(`parameters.${index}.observedResult`, newValue);
    const newStatus = evaluateResultStatus(inputType, newValue, minAllowed, maxAllowed);
    setValue(`parameters.${index}.status`, newStatus);

    // If any parameter fails, suggest Out of Specification
    const updatedParams = [...watchedParameters];
    updatedParams[index] = {
      ...updatedParams[index],
      observedResult: newValue,
      status: newStatus,
    };

    const oosDetected = updatedParams.some((p) => p.status === "Fail");
    if (oosDetected) {
      setValue("status", "Out of Specification");
    } else if (watchedStatus === "Out of Specification") {
      setValue("status", "Pending Review");
    }
  };

  const onSubmit = (data: ResultEntryFormValues) => {
    const updatedTest: TestWorklistItem = {
      ...test,
      assignedAnalyst: data.assignedAnalyst,
      testingDate: data.testingDate,
      instrumentReference: data.instrumentReference,
      observations: data.observations,
      analystComments: data.analystComments,
      status: data.status as TestStatus,
      isOOS: data.parameters.some((p) => p.status === "Fail"),
      parameters: data.parameters.map((p, idx) => ({
        ...test.parameters[idx],
        observedResult: p.observedResult,
        status: p.status,
        instrumentUsed: p.instrumentUsed || test.instrumentReference,
        analystNotes: p.analystNotes,
      })),
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedTest);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <span className="text-[10px] font-bold text-teal-pharma uppercase tracking-widest block">
                CITI PHARMA QUALITY CONTROL • TEST RESULT ENTRY
              </span>
              <DialogTitle className="text-lg font-bold text-pharma-blue mt-0.5">
                Analytical Result Entry: {test.id}
              </DialogTitle>
              <p className="text-xs text-slate-500">
                {test.testType} for <span className="font-semibold text-slate-700">{test.materialOrProduct}</span> ({test.batchNumber})
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-pharma-blue bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                {test.sampleId}
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Demo banner */}
        <div className="bg-amber-50/80 border border-amber-200 px-3 py-2 rounded-lg text-xs text-amber-900 flex items-start gap-2">
          <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Simulated Laboratory Input:</strong> Real-time Pass/Fail evaluations are based on defined monograph tolerances. All recorded values are mock demonstration data.
          </span>
        </div>

        {hasOOS && (
          <div className="bg-rose-50 border border-rose-300 p-3 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-rose-900 block">
                Out of Specification (OOS) Result Detected!
              </span>
              <span className="text-rose-800">
                One or more observed values fall outside specification tolerances. System has set status to <strong>Out of Specification</strong>. Phase I lab investigation required.
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Section 1: Execution Details */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Calendar className="h-4 w-4 text-pharma-blue" />
              Testing Execution &amp; Instrument Reference
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Testing Date *
                </label>
                <Input
                  type="date"
                  {...register("testingDate")}
                  className="h-8 text-xs bg-white"
                />
                {errors.testingDate && (
                  <p className="text-[10px] text-rose-600 mt-0.5">{errors.testingDate.message}</p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Assigned Analyst *
                </label>
                <Input
                  {...register("assignedAnalyst")}
                  placeholder="e.g. Zubair Ahmed"
                  className="h-8 text-xs bg-white"
                />
                {errors.assignedAnalyst && (
                  <p className="text-[10px] text-rose-600 mt-0.5">{errors.assignedAnalyst.message}</p>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Instrument Reference *
                </label>
                <Input
                  {...register("instrumentReference")}
                  placeholder="e.g. Waters Alliance HPLC (INST-HPLC-02)"
                  className="h-8 text-xs bg-white"
                />
                {errors.instrumentReference && (
                  <p className="text-[10px] text-rose-600 mt-0.5">{errors.instrumentReference.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Parameter Results Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FlaskConical className="h-4 w-4 text-teal-pharma" />
                Analytical Parameters &amp; Observed Values
              </span>
              <span className="text-[11px] text-slate-500">
                Numeric inputs validate automatically against min/max limits
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#123B63] text-white">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Parameter</th>
                      <th className="py-2.5 px-3 font-semibold">Specification</th>
                      <th className="py-2.5 px-3 font-semibold">Unit</th>
                      <th className="py-2.5 px-3 font-semibold w-48">Observed Result *</th>
                      <th className="py-2.5 px-3 font-semibold text-center w-28">Status</th>
                      <th className="py-2.5 px-3 font-semibold">Notes / Peak Area</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {fields.map((field, index) => {
                      const origParam = test.parameters[index] || {};
                      const currentParam = watchedParameters[index] || {};

                      return (
                        <tr key={field.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-3 font-medium text-slate-800">
                            <div>{field.name}</div>
                            <span className="text-[10px] text-slate-400 capitalize">
                              Type: {field.inputType}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-700 bg-slate-50/50">
                            {field.specification}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 font-mono">
                            {field.unit}
                          </td>
                          <td className="py-2.5 px-3">
                            {field.inputType === "selectable" ? (
                              <select
                                value={currentParam.observedResult || ""}
                                onChange={(e) =>
                                  handleResultChange(
                                    index,
                                    e.target.value,
                                    "selectable",
                                    origParam.minAllowed,
                                    origParam.maxAllowed
                                  )
                                }
                                className="w-full h-8 text-xs bg-white border border-slate-200 rounded-md px-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
                              >
                                <option value="">Select outcome...</option>
                                {(origParam.selectableOptions || ["Complies", "Does Not Comply"]).map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : field.inputType === "numeric" ? (
                              <Input
                                type="number"
                                step="any"
                                value={currentParam.observedResult || ""}
                                onChange={(e) =>
                                  handleResultChange(
                                    index,
                                    e.target.value,
                                    "numeric",
                                    origParam.minAllowed,
                                    origParam.maxAllowed
                                  )
                                }
                                placeholder={`e.g. ${origParam.minAllowed ?? 0}`}
                                className="h-8 text-xs font-mono bg-white"
                              />
                            ) : (
                              <Input
                                type="text"
                                value={currentParam.observedResult || ""}
                                onChange={(e) =>
                                  handleResultChange(
                                    index,
                                    e.target.value,
                                    "text"
                                  )
                                }
                                placeholder="Descriptive result..."
                                className="h-8 text-xs bg-white"
                              />
                            )}
                            {errors.parameters?.[index]?.observedResult && (
                              <p className="text-[10px] text-rose-600 mt-0.5">
                                {errors.parameters[index]?.observedResult?.message}
                              </p>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <ParameterStatusBadge status={currentParam.status || "Pending"} />
                          </td>
                          <td className="py-2.5 px-3">
                            <Input
                              {...register(`parameters.${index}.analystNotes`)}
                              placeholder="Optional remarks"
                              className="h-8 text-xs bg-white"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 3: Observations & Comments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                Observations &amp; Physical Analysis *
              </label>
              <Textarea
                {...register("observations")}
                placeholder="Describe baseline, color changes, precipitation, or system suitability metrics..."
                className="text-xs h-20 bg-white"
              />
              {errors.observations && (
                <p className="text-[10px] text-rose-600">{errors.observations.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                Analyst Comments &amp; Notes *
              </label>
              <Textarea
                {...register("analystComments")}
                placeholder="Method execution details, filter types, calibration verification..."
                className="text-xs h-20 bg-white"
              />
              {errors.analystComments && (
                <p className="text-[10px] text-rose-600">{errors.analystComments.message}</p>
              )}
            </div>
          </div>

          {/* Section 4: Workflow Status Selection */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Workflow Status Progression
              </span>
              <span className="text-[11px] text-slate-500">
                Move dossier forward in the QC laboratory lifecycle
              </span>
            </div>

            <div className="w-full sm:w-60">
              <select
                {...register("status")}
                className="w-full h-8 text-xs bg-white border border-slate-200 rounded-md px-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue font-semibold"
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Out of Specification" className="text-rose-600 font-bold">
                  Out of Specification (OOS)
                </option>
              </select>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2 border-t pt-3">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-teal-pharma" />
              <span>Conforms to Citi Pharma GLP Documentation</span>
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                size="sm"
                disabled={isSubmitting}
                className="bg-pharma-blue hover:bg-pharma-blue/90 text-white font-bold text-xs gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                Save Analytical Results
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
