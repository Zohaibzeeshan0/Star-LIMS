"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  retestSampleSchema,
  RetestSampleFormValues,
} from "@/lib/validations/retesting-schema";
import { RetestSample } from "@/lib/types/retesting";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit3, Save } from "lucide-react";

interface EditRetestSampleModalProps {
  sample: RetestSample | null;
  open: boolean;
  onClose: () => void;
  onUpdateSample: (updatedSample: RetestSample) => void;
}

export function EditRetestSampleModal({
  sample,
  open,
  onClose,
  onUpdateSample,
}: EditRetestSampleModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RetestSampleFormValues>({
    resolver: zodResolver(retestSampleSchema),
  });

  useEffect(() => {
    if (sample) {
      reset({
        id: sample.id,
        rawMaterialSampleId: sample.rawMaterialSampleId,
        materialCode: sample.materialCode,
        materialName: sample.materialName,
        category: sample.category,
        supplier: sample.supplier,
        manufacturer: sample.manufacturer,
        batchNumber: sample.batchNumber,
        warehouseLocation: sample.warehouseLocation,
        remainingStock: sample.remainingStock,
        unit: sample.unit,
        containersCount: sample.containersCount,
        manufactureDate: sample.manufactureDate,
        previousTestDate: sample.previousTestDate,
        lastRetestDate: sample.lastRetestDate,
        nextRetestDueDate: sample.nextRetestDueDate,
        extendedRetestDate: sample.extendedRetestDate || "",
        retestCycleNumber: sample.retestCycleNumber,
        extensionMonthsGranted: sample.extensionMonthsGranted || 12,
        status: sample.status,
        retestReason: sample.retestReason,
        pharmacopeia: sample.pharmacopeia,
        storageCondition: sample.storageCondition,
        analyst: sample.analyst,
        reviewedBy: sample.reviewedBy,
        remarks: sample.remarks,
      });
    }
  }, [sample, reset]);

  if (!sample) return null;

  const onSubmit = (data: RetestSampleFormValues) => {
    const updated: RetestSample = {
      ...sample,
      warehouseLocation: data.warehouseLocation,
      remainingStock: Number(data.remainingStock),
      unit: data.unit,
      containersCount: Number(data.containersCount),
      previousTestDate: data.previousTestDate,
      lastRetestDate: data.lastRetestDate,
      nextRetestDueDate: data.nextRetestDueDate,
      extendedRetestDate: data.extendedRetestDate || undefined,
      retestCycleNumber: Number(data.retestCycleNumber),
      extensionMonthsGranted: data.extensionMonthsGranted ? Number(data.extensionMonthsGranted) : undefined,
      status: data.status,
      retestReason: data.retestReason,
      pharmacopeia: data.pharmacopeia,
      storageCondition: data.storageCondition,
      analyst: data.analyst,
      reviewedBy: data.reviewedBy,
      remarks: data.remarks,
      updatedAt: new Date().toISOString(),
    };

    onUpdateSample(updated);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="font-heading text-lg font-bold text-pharma-blue">
                Edit Retest Schedule: {sample.id}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Update surveillance status, extend shelf-life dates, adjust remaining warehouse stock or QC assignees.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Read-Only Material Summary Box */}
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-slate-800">{sample.materialName}</span>
                <span className="text-slate-400 font-mono ml-2">({sample.materialCode})</span>
                <p className="text-slate-500 mt-0.5">
                  Lot: <span className="font-mono font-semibold text-pharma-blue">{sample.batchNumber}</span> | Ref: {sample.rawMaterialSampleId}
                </p>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-white px-2 py-0.5 rounded border">
                Cycle #{sample.retestCycleNumber}
              </span>
            </div>
          </div>

          {/* Hidden Required Fields for Validation */}
          <input type="hidden" {...register("id")} />
          <input type="hidden" {...register("rawMaterialSampleId")} />
          <input type="hidden" {...register("materialCode")} />
          <input type="hidden" {...register("materialName")} />
          <input type="hidden" {...register("category")} />
          <input type="hidden" {...register("supplier")} />
          <input type="hidden" {...register("manufacturer")} />
          <input type="hidden" {...register("batchNumber")} />
          <input type="hidden" {...register("manufactureDate")} />

          {/* Retest Status & Extension Months */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Surveillance Disposition Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register("status")}
                className="w-full text-xs py-2 px-3 mt-1 rounded-md border border-slate-200 bg-white text-slate-700 font-medium focus:ring-1 focus:ring-pharma-blue"
              >
                <option value="Due Soon">Due Soon (&lt;= 30 Days)</option>
                <option value="Overdue">Overdue (Critical Hold)</option>
                <option value="Scheduled">Scheduled (Valid Horizon)</option>
                <option value="In Progress">In Progress (Under Testing)</option>
                <option value="Completed">Completed (Passed / Extended)</option>
                <option value="Quarantine">Quarantine</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Extension Granted (Months)
              </label>
              <Input
                type="number"
                {...register("extensionMonthsGranted")}
                placeholder="12"
                className="text-xs mt-1"
              />
            </div>
          </div>

          {/* User Required Dates Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Previous Test Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register("previousTestDate")}
                className="text-xs mt-1 bg-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Last Retest Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register("lastRetestDate")}
                className="text-xs mt-1 bg-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Next Retest Due Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register("nextRetestDueDate")}
                className="text-xs mt-1 bg-white font-mono font-bold text-pharma-blue"
              />
            </div>
          </div>

          {/* Warehouse Location & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Warehouse Location <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("warehouseLocation")}
                className="text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Remaining Stock <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                step="any"
                {...register("remainingStock")}
                className="text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Containers Count <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                {...register("containersCount")}
                className="text-xs mt-1"
              />
            </div>
          </div>

          {/* Assignees & Reason */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                QC Analyst Assigned <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("analyst")}
                className="text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                QA Reviewer / Approver <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("reviewedBy")}
                className="text-xs mt-1"
              />
            </div>
          </div>

          {/* Retest Reason */}
          <div>
            <label className="text-xs font-semibold text-slate-700">
              Retest Protocol / Surveillance Justification <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("retestReason")}
              className="text-xs mt-1"
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="text-xs font-semibold text-slate-700">
              Surveillance Observations &amp; 21 CFR Part 11 Audit Remarks <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("remarks")}
              rows={3}
              className="w-full text-xs p-2 mt-1 rounded-md border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
            />
            {errors.remarks && (
              <p className="text-[11px] text-red-500 mt-0.5">{errors.remarks.message}</p>
            )}
          </div>

          <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="teal"
              size="sm"
              disabled={isSubmitting}
              className="text-xs font-bold gap-1.5"
            >
              <Save className="h-4 w-4" />
              Save Surveillance Updates
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
