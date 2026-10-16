"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  rawMaterialSampleSchema,
  RawMaterialSampleFormValues,
} from "@/lib/validations/raw-material-schema";
import { RawMaterialSample } from "@/lib/types/raw-material";
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
import { Edit, Save, AlertCircle, Loader2 } from "lucide-react";
import { UnsavedChangesDialog } from "@/components/ui/unsaved-changes-dialog";

interface EditRawMaterialModalProps {
  sample: RawMaterialSample | null;
  open: boolean;
  onClose: () => void;
  onUpdateSample: (updatedSample: RawMaterialSample) => void;
}

export function EditRawMaterialModal({
  sample,
  open,
  onClose,
  onUpdateSample,
}: EditRawMaterialModalProps) {
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RawMaterialSampleFormValues>({
    resolver: zodResolver(rawMaterialSampleSchema),
  });

  useEffect(() => {
    if (sample) {
      reset({
        id: sample.id,
        materialCode: sample.materialCode,
        materialName: sample.materialName,
        category: sample.category,
        supplier: sample.supplier,
        manufacturer: sample.manufacturer,
        batchNumber: sample.batchNumber,
        poReference: sample.poReference,
        receivedDate: sample.receivedDate,
        samplingDate: sample.samplingDate,
        retestDate: sample.retestDate,
        quantity: sample.quantity,
        unit: sample.unit,
        storageCondition: sample.storageCondition,
        pharmacopeia: sample.pharmacopeia,
        status: sample.status,
        remarks: sample.remarks,
        storageLocation: sample.storageLocation,
        analyst: sample.analyst,
      });
    }
  }, [sample, reset]);

  if (!sample) return null;

  const handleRequestClose = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const onSubmit = async (data: RawMaterialSampleFormValues) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const updated: RawMaterialSample = {
        ...sample,
        materialCode: data.materialCode.toUpperCase(),
        materialName: data.materialName,
        category: data.category,
        supplier: data.supplier,
        manufacturer: data.manufacturer,
        batchNumber: data.batchNumber.toUpperCase(),
        poReference: data.poReference.toUpperCase(),
        receivedDate: data.receivedDate,
        samplingDate: data.samplingDate,
        retestDate: data.retestDate,
        quantity: Number(data.quantity),
        unit: data.unit,
        storageCondition: data.storageCondition,
        pharmacopeia: data.pharmacopeia,
        status: data.status,
        remarks: data.remarks,
        storageLocation: data.storageLocation || sample.storageLocation,
        analyst: data.analyst || sample.analyst,
        updatedAt: new Date().toISOString(),
      };

      onUpdateSample(updated);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && handleRequestClose()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-pharma-blue">
              <Edit className="h-5 w-5 text-teal-pharma" />
              <span>Modify Raw Material Record: {sample.id}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Update analytical specifications, storage allocations, and supplier lot metadata.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              {/* Sample ID (Read-only) */}
              <div>
                <label htmlFor="rm-edit-id" className="block font-bold text-slate-600 mb-1">
                  Sample LIMS ID (Fixed)
                </label>
                <Input
                  id="rm-edit-id"
                  {...register("id")}
                  disabled
                  className="font-mono text-xs bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Material Code */}
              <div>
                <label htmlFor="rm-edit-code" className="block font-bold text-pharma-blue mb-1">
                  Material Code <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="rm-edit-code"
                  {...register("materialCode")}
                  aria-invalid={!!errors.materialCode}
                  aria-describedby={errors.materialCode ? "rm-edit-code-error" : undefined}
                  className={`font-mono text-xs ${errors.materialCode ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.materialCode && (
                  <p id="rm-edit-code-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.materialCode.message}</span>
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="rm-edit-cat" className="block font-bold text-pharma-blue mb-1">
                  Chemical Category <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <select
                  id="rm-edit-cat"
                  {...register("category")}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold shadow-2xs focus:border-pharma-blue focus:outline-hidden focus:ring-1 focus:ring-pharma-blue"
                >
                  <option value="Active Pharmaceutical Ingredient (API)">Active Ingredient (API)</option>
                  <option value="Excipient / Binder / Filler">Excipient / Binder / Filler</option>
                  <option value="Process Solvent / Reagent">Process Solvent / Reagent</option>
                  <option value="Coating Polymer / Colorant">Coating Polymer / Colorant</option>
                  <option value="Preservative / Buffer">Preservative / Buffer</option>
                </select>
              </div>

              {/* Material Name (Col span 2) */}
              <div className="sm:col-span-2">
                <label htmlFor="rm-edit-name" className="block font-bold text-pharma-blue mb-1">
                  Raw Material Chemical Name <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="rm-edit-name"
                  {...register("materialName")}
                  aria-invalid={!!errors.materialName}
                  aria-describedby={errors.materialName ? "rm-edit-name-error" : undefined}
                  className={`text-xs ${errors.materialName ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.materialName && (
                  <p id="rm-edit-name-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.materialName.message}</span>
                  </p>
                )}
              </div>

              {/* Pharmacopeia Monograph */}
              <div>
                <label htmlFor="rm-edit-pharm" className="block font-bold text-pharma-blue mb-1">
                  Target Pharmacopeia <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <select
                  id="rm-edit-pharm"
                  {...register("pharmacopeia")}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold shadow-2xs focus:border-pharma-blue focus:outline-hidden focus:ring-1 focus:ring-pharma-blue"
                >
                  <option value="BP 2026">BP 2026</option>
                  <option value="USP 48-NF 43">USP 48-NF 43</option>
                  <option value="Ph. Eur. 11.0">Ph. Eur. 11.0</option>
                  <option value="In-House Validated">In-House Validated</option>
                </select>
              </div>

              {/* Supplier */}
              <div>
                <label htmlFor="rm-edit-supplier" className="block font-bold text-pharma-blue mb-1">
                  Supplier / Vendor <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="rm-edit-supplier"
                  {...register("supplier")}
                  aria-invalid={!!errors.supplier}
                  aria-describedby={errors.supplier ? "rm-edit-supplier-error" : undefined}
                  className={`text-xs ${errors.supplier ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.supplier && (
                  <p id="rm-edit-supplier-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.supplier.message}</span>
                  </p>
                )}
              </div>

              {/* Manufacturer */}
              <div>
                <label htmlFor="rm-edit-mfr" className="block font-bold text-pharma-blue mb-1">
                  Manufacturer <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="rm-edit-mfr"
                  {...register("manufacturer")}
                  aria-invalid={!!errors.manufacturer}
                  aria-describedby={errors.manufacturer ? "rm-edit-mfr-error" : undefined}
                  className={`text-xs ${errors.manufacturer ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.manufacturer && (
                  <p id="rm-edit-mfr-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.manufacturer.message}</span>
                  </p>
                )}
              </div>

              {/* Batch Number */}
              <div>
                <label htmlFor="rm-edit-batch" className="block font-bold text-pharma-blue mb-1">
                  Batch / Lot Number <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="rm-edit-batch"
                  {...register("batchNumber")}
                  aria-invalid={!!errors.batchNumber}
                  aria-describedby={errors.batchNumber ? "rm-edit-batch-error" : undefined}
                  className={`font-mono text-xs ${errors.batchNumber ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.batchNumber && (
                  <p id="rm-edit-batch-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.batchNumber.message}</span>
                  </p>
                )}
              </div>

              {/* PO Reference */}
              <div>
                <label htmlFor="rm-edit-po" className="block font-bold text-pharma-blue mb-1">
                  PO Reference <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="rm-edit-po"
                  {...register("poReference")}
                  aria-invalid={!!errors.poReference}
                  aria-describedby={errors.poReference ? "rm-edit-po-error" : undefined}
                  className={`font-mono text-xs ${errors.poReference ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.poReference && (
                  <p id="rm-edit-po-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.poReference.message}</span>
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="rm-edit-qty" className="block font-bold text-pharma-blue mb-1">
                  Quantity <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="rm-edit-qty"
                  type="number"
                  step="0.01"
                  {...register("quantity")}
                  aria-invalid={!!errors.quantity}
                  aria-describedby={errors.quantity ? "rm-edit-qty-error" : undefined}
                  className={`text-xs ${errors.quantity ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.quantity && (
                  <p id="rm-edit-qty-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.quantity.message}</span>
                  </p>
                )}
              </div>

              {/* Unit */}
              <div>
                <label htmlFor="rm-edit-unit" className="block font-bold text-pharma-blue mb-1">
                  Unit <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <select
                  id="rm-edit-unit"
                  {...register("unit")}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold shadow-2xs focus:border-pharma-blue focus:outline-hidden focus:ring-1 focus:ring-pharma-blue"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="Liters">Liters</option>
                  <option value="mL">mL</option>
                  <option value="Drums">Drums</option>
                  <option value="Bags">Bags</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="rm-edit-status" className="block font-bold text-pharma-blue mb-1">
                  Compliance Disposition Status <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <select
                  id="rm-edit-status"
                  {...register("status")}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold shadow-2xs focus:border-pharma-blue focus:outline-hidden focus:ring-1 focus:ring-pharma-blue"
                >
                  <option value="Registered">Registered</option>
                  <option value="Under Testing">Under Testing</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Released">Released (Approved)</option>
                  <option value="Quarantine">Quarantine</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Retest">Retest</option>
                </select>
              </div>

              {/* Storage Condition (Col span 2) */}
              <div className="sm:col-span-2">
                <label htmlFor="rm-edit-cond" className="block font-bold text-pharma-blue mb-1">
                  Storage Condition Specification <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="rm-edit-cond"
                  {...register("storageCondition")}
                  aria-invalid={!!errors.storageCondition}
                  aria-describedby={errors.storageCondition ? "rm-edit-cond-error" : undefined}
                  className={`text-xs ${errors.storageCondition ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
              </div>

              {/* Storage Bay */}
              <div>
                <label htmlFor="rm-edit-bay" className="block font-bold text-pharma-blue mb-1">
                  Storage Bay Location
                </label>
                <Input
                  id="rm-edit-bay"
                  {...register("storageLocation")}
                  className="text-xs"
                />
              </div>

              {/* Remarks (Col span 3) */}
              <div className="sm:col-span-3">
                <label htmlFor="rm-edit-remarks" className="block font-bold text-pharma-blue mb-1">
                  Sampling Notes &amp; Remarks <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="rm-edit-remarks"
                  {...register("remarks")}
                  rows={2}
                  aria-invalid={!!errors.remarks}
                  aria-describedby={errors.remarks ? "rm-edit-remarks-error" : undefined}
                  className={`w-full rounded-md border border-slate-200 bg-white p-2.5 text-xs text-slate-800 shadow-2xs focus:border-pharma-blue focus:outline-hidden focus:ring-1 focus:ring-pharma-blue ${
                    errors.remarks ? "border-fail-red" : ""
                  }`}
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRequestClose}
                disabled={submitting || isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="teal"
                size="sm"
                disabled={submitting || isSubmitting}
                className="gap-1.5 font-bold shadow-sm"
              >
                {submitting || isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{submitting || isSubmitting ? "Saving..." : "Save Raw Material Changes"}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Confirmation Dialog */}
      <UnsavedChangesDialog
        open={showDiscardConfirm}
        onConfirmDiscard={() => {
          setShowDiscardConfirm(false);
          reset();
          onClose();
        }}
        onCancelStay={() => setShowDiscardConfirm(false)}
      />
    </>
  );
}
