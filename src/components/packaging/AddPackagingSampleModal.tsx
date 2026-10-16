"use client";

import React, { useState } from "react";
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
import { PlusCircle, AlertCircle, Package, Loader2 } from "lucide-react";
import { UnsavedChangesDialog } from "@/components/ui/unsaved-changes-dialog";

interface AddPackagingSampleModalProps {
  open: boolean;
  onClose: () => void;
  onAddSample: (newSample: PackagingSample) => void;
}

export function AddPackagingSampleModal({
  open,
  onClose,
  onAddSample,
}: AddPackagingSampleModalProps) {
  // Generate a random initial ID
  const defaultSampleId = `CP-PKG-2026-${String(Math.floor(Math.random() * 899 + 115))}`;
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PackagingSampleFormValues>({
    resolver: zodResolver(packagingSampleSchema),
    defaultValues: {
      id: defaultSampleId,
      materialName: "",
      materialCode: "PM-",
      supplier: "",
      manufacturer: "",
      batchNumber: "",
      receivedDate: new Date().toISOString().slice(0, 10),
      samplingDate: new Date().toISOString().slice(0, 10),
      quantity: 100,
      unit: "Bottles",
      packagingType: "Primary Packaging",
      status: "Registered",
      remarks: "Sample intake logged for initial analytical and physical qualification.",
      storageLocation: "PM Receiving Bay 01",
      analyst: "Hamza Shafiq",
    },
  });

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
      const newSample: PackagingSample = {
        id: data.id,
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
        storageLocation: data.storageLocation || "PM Main Store",
        analyst: data.analyst || "Hamza Shafiq",
        inspectedBy: "Dr. Ayesha Khan (QC Lead)",
        specificationRef: "In-House Monograph Verification",
        tests: [
          {
            id: "T1",
            name: "Visual Inspection & Dimensions",
            specification: "Conforms to technical drawing",
            observedResult: "Pending",
            passed: true,
          },
          {
            id: "T2",
            name: "Barrier / Seal Integrity Check",
            specification: "Zero leakage under vacuum",
            observedResult: "Pending",
            passed: true,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onAddSample(newSample);
      reset();
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
              <PlusCircle className="h-5 w-5 text-teal-pharma" />
              <span>Intake New Packaging Material Sample</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Enter physical batch parameters and technical specifications under cGMP chain of custody.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              {/* Sample ID */}
              <div>
                <label htmlFor="pkg-add-id" className="block font-bold text-pharma-blue mb-1">
                  Sample LIMS ID <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="pkg-add-id"
                  {...register("id")}
                  placeholder="CP-PKG-2026-0115"
                  aria-invalid={!!errors.id}
                  aria-describedby={errors.id ? "pkg-add-id-error" : undefined}
                  className={`font-mono text-xs ${errors.id ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.id && (
                  <p id="pkg-add-id-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.id.message}</span>
                  </p>
                )}
              </div>

              {/* Material Code */}
              <div>
                <label htmlFor="pkg-add-code" className="block font-bold text-pharma-blue mb-1">
                  Material Item Code <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="pkg-add-code"
                  {...register("materialCode")}
                  placeholder="e.g. PM-FOL-0042"
                  aria-invalid={!!errors.materialCode}
                  aria-describedby={errors.materialCode ? "pkg-add-code-error" : undefined}
                  className={`font-mono text-xs ${errors.materialCode ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.materialCode && (
                  <p id="pkg-add-code-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.materialCode.message}</span>
                  </p>
                )}
              </div>

              {/* Packaging Type */}
              <div>
                <label htmlFor="pkg-add-type" className="block font-bold text-pharma-blue mb-1">
                  Packaging Type <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <select
                  id="pkg-add-type"
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
                <label htmlFor="pkg-add-name" className="block font-bold text-pharma-blue mb-1">
                  Packaging Material Name <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="pkg-add-name"
                  {...register("materialName")}
                  placeholder="e.g. Amber Type I Borosilicate Glass Vials 10ml or Alu-Alu Blister Foil"
                  aria-invalid={!!errors.materialName}
                  aria-describedby={errors.materialName ? "pkg-add-name-error" : undefined}
                  className={`text-xs ${errors.materialName ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.materialName && (
                  <p id="pkg-add-name-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.materialName.message}</span>
                  </p>
                )}
              </div>

              {/* Supplier */}
              <div>
                <label htmlFor="pkg-add-supplier" className="block font-bold text-pharma-blue mb-1">
                  Supplier / Vendor <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="pkg-add-supplier"
                  {...register("supplier")}
                  placeholder="e.g. Schott Pharma AG"
                  aria-invalid={!!errors.supplier}
                  aria-describedby={errors.supplier ? "pkg-add-supplier-error" : undefined}
                  className={`text-xs ${errors.supplier ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.supplier && (
                  <p id="pkg-add-supplier-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.supplier.message}</span>
                  </p>
                )}
              </div>

              {/* Manufacturer */}
              <div>
                <label htmlFor="pkg-add-mfr" className="block font-bold text-pharma-blue mb-1">
                  Manufacturer <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="pkg-add-mfr"
                  {...register("manufacturer")}
                  placeholder="e.g. Schott Tubing Germany"
                  aria-invalid={!!errors.manufacturer}
                  aria-describedby={errors.manufacturer ? "pkg-add-mfr-error" : undefined}
                  className={`text-xs ${errors.manufacturer ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.manufacturer && (
                  <p id="pkg-add-mfr-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.manufacturer.message}</span>
                  </p>
                )}
              </div>

              {/* Batch Number */}
              <div>
                <label htmlFor="pkg-add-batch" className="block font-bold text-pharma-blue mb-1">
                  Batch / Lot Number <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="pkg-add-batch"
                  {...register("batchNumber")}
                  placeholder="e.g. VIAL-10ML-L09"
                  aria-invalid={!!errors.batchNumber}
                  aria-describedby={errors.batchNumber ? "pkg-add-batch-error" : undefined}
                  className={`font-mono text-xs ${errors.batchNumber ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.batchNumber && (
                  <p id="pkg-add-batch-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.batchNumber.message}</span>
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="pkg-add-qty" className="block font-bold text-pharma-blue mb-1">
                  Quantity Received <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="pkg-add-qty"
                  type="number"
                  {...register("quantity")}
                  aria-invalid={!!errors.quantity}
                  aria-describedby={errors.quantity ? "pkg-add-qty-error" : undefined}
                  className={`text-xs ${errors.quantity ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.quantity && (
                  <p id="pkg-add-qty-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.quantity.message}</span>
                  </p>
                )}
              </div>

              {/* Unit */}
              <div>
                <label htmlFor="pkg-add-unit" className="block font-bold text-pharma-blue mb-1">
                  Unit <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <select
                  id="pkg-add-unit"
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
                <label htmlFor="pkg-add-status" className="block font-bold text-pharma-blue mb-1">
                  Initial Disposition Status <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <select
                  id="pkg-add-status"
                  {...register("status")}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold shadow-2xs focus:border-pharma-blue focus:outline-hidden focus:ring-1 focus:ring-pharma-blue"
                >
                  <option value="Registered">Registered (Intake Queue)</option>
                  <option value="Under Testing">Under Testing</option>
                  <option value="Quarantine">Quarantine</option>
                </select>
              </div>

              {/* Received Date */}
              <div>
                <label htmlFor="pkg-add-recdate" className="block font-bold text-pharma-blue mb-1">
                  Received Date <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="pkg-add-recdate"
                  type="date"
                  {...register("receivedDate")}
                  aria-invalid={!!errors.receivedDate}
                  aria-describedby={errors.receivedDate ? "pkg-add-recdate-error" : undefined}
                  className={`text-xs ${errors.receivedDate ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.receivedDate && (
                  <p id="pkg-add-recdate-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.receivedDate.message}</span>
                  </p>
                )}
              </div>

              {/* Sampling Date */}
              <div>
                <label htmlFor="pkg-add-sampdate" className="block font-bold text-pharma-blue mb-1">
                  Sampling Date <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="pkg-add-sampdate"
                  type="date"
                  {...register("samplingDate")}
                  aria-invalid={!!errors.samplingDate}
                  aria-describedby={errors.samplingDate ? "pkg-add-sampdate-error" : undefined}
                  className={`text-xs ${errors.samplingDate ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.samplingDate && (
                  <p id="pkg-add-sampdate-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.samplingDate.message}</span>
                  </p>
                )}
              </div>

              {/* Storage Location */}
              <div>
                <label htmlFor="pkg-add-location" className="block font-bold text-pharma-blue mb-1">
                  Warehouse Location
                </label>
                <Input
                  id="pkg-add-location"
                  {...register("storageLocation")}
                  placeholder="e.g. PM Warehouse Bay B-04"
                  className="text-xs"
                />
              </div>

              {/* Remarks (Col span 3) */}
              <div className="sm:col-span-3">
                <label htmlFor="pkg-add-remarks" className="block font-bold text-pharma-blue mb-1">
                  Sampling Notes &amp; Technical Remarks <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="pkg-add-remarks"
                  {...register("remarks")}
                  rows={2}
                  placeholder="e.g. Sample intake logged. Clean barrier packaging verified, zero moisture exposure."
                  aria-invalid={!!errors.remarks}
                  aria-describedby={errors.remarks ? "pkg-add-remarks-error" : undefined}
                  className={`w-full rounded-md border border-slate-200 bg-white p-2.5 text-xs text-slate-800 shadow-2xs focus:border-pharma-blue focus:outline-hidden focus:ring-1 focus:ring-pharma-blue ${
                    errors.remarks ? "border-fail-red" : ""
                  }`}
                />
                {errors.remarks && (
                  <p id="pkg-add-remarks-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
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
                  <PlusCircle className="h-4 w-4" />
                )}
                <span>{submitting || isSubmitting ? "Registering..." : "Register & Save Sample"}</span>
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
