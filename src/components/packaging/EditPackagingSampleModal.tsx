"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  packagingSampleSchema,
  PackagingSampleFormValues,
} from "@/lib/validations/packaging-schema";
import { PackagingSample } from "@/lib/types/packaging";
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

interface EditPackagingSampleModalProps {
  sample: PackagingSample | null;
  open: boolean;
  onClose: () => void;
  onUpdateSample: (updatedSample: PackagingSample) => void;
}

export function EditPackagingSampleModal({
  sample,
  open,
  onClose,
  onUpdateSample,
}: EditPackagingSampleModalProps) {
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PackagingSampleFormValues>({
    resolver: zodResolver(packagingSampleSchema),
  });

  useEffect(() => {
    if (sample) {
      reset({
        id: sample.id,
        materialName: sample.materialName,
        materialCode: sample.materialCode,
        supplier: sample.supplier,
        manufacturer: sample.manufacturer,
        batchNumber: sample.batchNumber,
        receivedDate: sample.receivedDate,
        samplingDate: sample.samplingDate,
        quantity: sample.quantity,
        unit: sample.unit,
        packagingType: sample.packagingType,
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

  const onSubmit = async (data: PackagingSampleFormValues) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const updated: PackagingSample = {
        ...sample,
        materialName: data.materialName,
        materialCode: data.materialCode.toUpperCase(),
        supplier: data.supplier,
        manufacturer: data.manufacturer,
        batchNumber: data.batchNumber.toUpperCase(),
        receivedDate: data.receivedDate,
        samplingDate: data.samplingDate,
        quantity: Number(data.quantity),
        unit: data.unit,
        packagingType: data.packagingType,
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
              <span>Modify Packaging Sample Record: {sample.id}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Update physical properties, lot attributes, and QC metadata in compliance with 21 CFR Part 11.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              {/* Sample ID (Read-only for audit integrity) */}
              <div>
                <label htmlFor="pkg-edit-id" className="block font-bold text-slate-600 mb-1">
                  Sample LIMS ID (Fixed)
                </label>
                <Input
                  id="pkg-edit-id"
                  {...register("id")}
                  disabled
                  className="font-mono text-xs bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Material Code */}
              <div>
                <label htmlFor="pkg-edit-code" className="block font-bold text-pharma-blue mb-1">
                  Material Item Code <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="pkg-edit-code"
                  {...register("materialCode")}
                  aria-invalid={!!errors.materialCode}
                  aria-describedby={errors.materialCode ? "pkg-edit-code-error" : undefined}
                  className={`font-mono text-xs ${errors.materialCode ? "border-fail-red" : ""}`}
                />
                {errors.materialCode && (
                  <p id="pkg-edit-code-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.materialCode.message}</span>
                  </p>
                )}
              </div>

              {/* Packaging Type */}
              <div>
                <label htmlFor="pkg-edit-type" className="block font-bold text-pharma-blue mb-1">
                  Packaging Type <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <select
                  id="pkg-edit-type"
                  {...register("packagingType")}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold shadow-2xs focus:border-pharma-blue focus:outline-hidden focus:ring-1 focus:ring-pharma-blue"
                >
                  <option value="Primary Packaging">Primary Packaging</option>
                  <option value="Secondary Packaging">Secondary Packaging</option>
                  <option value="Tertiary Packaging">Tertiary Packaging</option>
                  <option value="Printed Packaging">Printed Packaging</option>
                  <option value="Closures & Seals">Closures & Seals</option>
                </select>
              </div>

              {/* Material Name (Col span 3) */}
              <div className="sm:col-span-3">
                <label htmlFor="pkg-edit-name" className="block font-bold text-pharma-blue mb-1">
                  Packaging Material Name <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="pkg-edit-name"
                  {...register("materialName")}
                  aria-invalid={!!errors.materialName}
                  aria-describedby={errors.materialName ? "pkg-edit-name-error" : undefined}
                  className={`text-xs ${errors.materialName ? "border-fail-red" : ""}`}
                />
                {errors.materialName && (
                  <p id="pkg-edit-name-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.materialName.message}</span>
                  </p>
                )}
              </div>

              {/* Supplier */}
              <div>
                <label htmlFor="pkg-edit-supplier" className="block font-bold text-pharma-blue mb-1">
                  Supplier / Vendor <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="pkg-edit-supplier"
                  {...register("supplier")}
                  aria-invalid={!!errors.supplier}
                  aria-describedby={errors.supplier ? "pkg-edit-supplier-error" : undefined}
                  className={`text-xs ${errors.supplier ? "border-fail-red" : ""}`}
                />
                {errors.supplier && (
                  <p id="pkg-edit-supplier-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.supplier.message}</span>
                  </p>
                )}
              </div>

              {/* Manufacturer */}
              <div>
                <label htmlFor="pkg-edit-mfr" className="block font-bold text-pharma-blue mb-1">
                  Manufacturer <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="pkg-edit-mfr"
                  {...register("manufacturer")}
                  aria-invalid={!!errors.manufacturer}
                  aria-describedby={errors.manufacturer ? "pkg-edit-mfr-error" : undefined}
                  className={`text-xs ${errors.manufacturer ? "border-fail-red" : ""}`}
                />
                {errors.manufacturer && (
                  <p id="pkg-edit-mfr-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.manufacturer.message}</span>
                  </p>
                )}
              </div>

              {/* Batch Number */}
              <div>
                <label htmlFor="pkg-edit-batch" className="block font-bold text-pharma-blue mb-1">
                  Batch / Lot Number <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="pkg-edit-batch"
                  {...register("batchNumber")}
                  aria-invalid={!!errors.batchNumber}
                  aria-describedby={errors.batchNumber ? "pkg-edit-batch-error" : undefined}
                  className={`font-mono text-xs ${errors.batchNumber ? "border-fail-red" : ""}`}
                />
                {errors.batchNumber && (
                  <p id="pkg-edit-batch-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.batchNumber.message}</span>
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="pkg-edit-qty" className="block font-bold text-pharma-blue mb-1">
                  Quantity <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="pkg-edit-qty"
                  type="number"
                  {...register("quantity")}
                  aria-invalid={!!errors.quantity}
                  aria-describedby={errors.quantity ? "pkg-edit-qty-error" : undefined}
                  className={`text-xs ${errors.quantity ? "border-fail-red" : ""}`}
                />
                {errors.quantity && (
                  <p id="pkg-edit-qty-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.quantity.message}</span>
                  </p>
                )}
              </div>

              {/* Unit */}
              <div>
                <label htmlFor="pkg-edit-unit" className="block font-bold text-pharma-blue mb-1">
                  Unit <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <select
                  id="pkg-edit-unit"
                  {...register("unit")}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold shadow-2xs focus:border-pharma-blue focus:outline-hidden focus:ring-1 focus:ring-pharma-blue"
                >
                  <option value="Bottles">Bottles</option>
                  <option value="Vials">Vials</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Caps">Caps</option>
                  <option value="Cartons">Cartons</option>
                  <option value="Leaflets">Leaflets</option>
                  <option value="Sheets">Sheets</option>
                  <option value="Stoppers">Stoppers</option>
                  <option value="kg">kg</option>
                  <option value="Units">Units</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="pkg-edit-status" className="block font-bold text-pharma-blue mb-1">
                  Compliance Disposition Status <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <select
                  id="pkg-edit-status"
                  {...register("status")}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold shadow-2xs focus:border-pharma-blue focus:outline-hidden focus:ring-1 focus:ring-pharma-blue"
                >
                  <option value="Registered">Registered</option>
                  <option value="Under Testing">Under Testing</option>
                  <option value="Released">Released (Compliant)</option>
                  <option value="Quarantine">Quarantine</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Retest">Retest</option>
                </select>
              </div>

              {/* Received Date */}
              <div>
                <label htmlFor="pkg-edit-recdate" className="block font-bold text-pharma-blue mb-1">
                  Received Date <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="pkg-edit-recdate"
                  type="date"
                  {...register("receivedDate")}
                  aria-invalid={!!errors.receivedDate}
                  aria-describedby={errors.receivedDate ? "pkg-edit-recdate-error" : undefined}
                  className="text-xs"
                />
              </div>

              {/* Sampling Date */}
              <div>
                <label htmlFor="pkg-edit-sampdate" className="block font-bold text-pharma-blue mb-1">
                  Sampling Date <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="pkg-edit-sampdate"
                  type="date"
                  {...register("samplingDate")}
                  aria-invalid={!!errors.samplingDate}
                  aria-describedby={errors.samplingDate ? "pkg-edit-sampdate-error" : undefined}
                  className="text-xs"
                />
              </div>

              {/* Storage Location */}
              <div>
                <label htmlFor="pkg-edit-location" className="block font-bold text-pharma-blue mb-1">
                  Warehouse Location
                </label>
                <Input
                  id="pkg-edit-location"
                  {...register("storageLocation")}
                  className="text-xs"
                />
              </div>

              {/* Remarks (Col span 3) */}
              <div className="sm:col-span-3">
                <label htmlFor="pkg-edit-remarks" className="block font-bold text-pharma-blue mb-1">
                  Sampling Notes &amp; Technical Remarks <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="pkg-edit-remarks"
                  {...register("remarks")}
                  rows={2}
                  aria-invalid={!!errors.remarks}
                  aria-describedby={errors.remarks ? "pkg-edit-remarks-error" : undefined}
                  className={`w-full rounded-md border border-slate-200 bg-white p-2.5 text-xs text-slate-800 shadow-2xs focus:border-pharma-blue focus:outline-hidden focus:ring-1 focus:ring-pharma-blue ${
                    errors.remarks ? "border-fail-red" : ""
                  }`}
                />
                {errors.remarks && (
                  <p id="pkg-edit-remarks-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.remarks.message}</span>
                  </p>
                )}
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
                <span>{submitting || isSubmitting ? "Saving Changes..." : "Save Modifications"}</span>
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
