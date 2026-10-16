"use client";

import React, { useState } from "react";
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
import { PlusCircle, AlertCircle, Layers, Loader2 } from "lucide-react";
import { UnsavedChangesDialog } from "@/components/ui/unsaved-changes-dialog";

interface AddRawMaterialModalProps {
  open: boolean;
  onClose: () => void;
  onAddSample: (newSample: RawMaterialSample) => void;
}

export function AddRawMaterialModal({
  open,
  onClose,
  onAddSample,
}: AddRawMaterialModalProps) {
  const defaultSampleId = `CP-RAW-2026-${String(Math.floor(Math.random() * 899 + 415))}`;
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RawMaterialSampleFormValues>({
    resolver: zodResolver(rawMaterialSampleSchema),
    defaultValues: {
      id: defaultSampleId,
      materialCode: "RM-API-",
      materialName: "",
      category: "Active Pharmaceutical Ingredient (API)",
      supplier: "",
      manufacturer: "",
      batchNumber: "",
      poReference: "PO-2026-",
      receivedDate: new Date().toISOString().slice(0, 10),
      samplingDate: new Date().toISOString().slice(0, 10),
      retestDate: "2028-10-15",
      quantity: 100,
      unit: "kg",
      storageCondition: "Store airtight below 25°C, protect from moisture",
      pharmacopeia: "Ph. Eur. 11.0",
      status: "Registered",
      remarks: "Sample intake logged from incoming shipment. Tamper-evident drum seals verified intact.",
      storageLocation: "API Quarantine Bay Q-01",
      analyst: "Zubair Ahmed",
    },
  });

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
      const newSample: RawMaterialSample = {
        id: data.id,
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
        storageLocation: data.storageLocation || "RM Quarantine Area",
        analyst: data.analyst || "Zubair Ahmed",
        reviewedBy: "Farhan Malik (QA Manager)",
        inspectedBy: "Dr. Ayesha Khan (QC Lead)",
        tests: [
          {
            id: "T1",
            name: "Identification (FTIR & HPLC Retention)",
            specification: "Conforms to reference standard",
            observedResult: "Pending",
            passed: true,
            instrumentUsed: "FTIR Shimadzu IRAffinity-1S",
          },
          {
            id: "T2",
            name: "Chromatographic Assay & Potency",
            specification: "98.5% - 101.5% (anhydrous)",
            observedResult: "Pending",
            passed: true,
            instrumentUsed: "Waters Alliance e2695 HPLC",
          },
          {
            id: "T3",
            name: "Loss on Drying / Moisture by KF",
            specification: "NMT 0.50%",
            observedResult: "Pending",
            passed: true,
            instrumentUsed: "Metrohm 890 Karl Fischer",
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
              <span>Intake New Raw Material Sample (API / Excipient)</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Log incoming pharmaceutical chemical substances under cGMP dispensing &amp; quarantine controls.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              {/* Sample ID */}
              <div>
                <label htmlFor="rm-add-id" className="block font-bold text-pharma-blue mb-1">
                  Sample LIMS ID <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="rm-add-id"
                  {...register("id")}
                  placeholder="CP-RAW-2026-0415"
                  aria-invalid={!!errors.id}
                  aria-describedby={errors.id ? "rm-add-id-error" : undefined}
                  className={`font-mono text-xs ${errors.id ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.id && (
                  <p id="rm-add-id-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.id.message}</span>
                  </p>
                )}
              </div>

              {/* Material Code */}
              <div>
                <label htmlFor="rm-add-code" className="block font-bold text-pharma-blue mb-1">
                  Material Item Code <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="rm-add-code"
                  {...register("materialCode")}
                  placeholder="e.g. RM-API-0012"
                  aria-invalid={!!errors.materialCode}
                  aria-describedby={errors.materialCode ? "rm-add-code-error" : undefined}
                  className={`font-mono text-xs ${errors.materialCode ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.materialCode && (
                  <p id="rm-add-code-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.materialCode.message}</span>
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="rm-add-cat" className="block font-bold text-pharma-blue mb-1">
                  Chemical Category <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <select
                  id="rm-add-cat"
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
                <label htmlFor="rm-add-name" className="block font-bold text-pharma-blue mb-1">
                  Raw Material Chemical Name <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="rm-add-name"
                  {...register("materialName")}
                  placeholder="e.g. Paracetamol DC 90% Granules or Ciprofloxacin HCl"
                  aria-invalid={!!errors.materialName}
                  aria-describedby={errors.materialName ? "rm-add-name-error" : undefined}
                  className={`text-xs ${errors.materialName ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.materialName && (
                  <p id="rm-add-name-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.materialName.message}</span>
                  </p>
                )}
              </div>

              {/* Pharmacopeia Monograph */}
              <div>
                <label htmlFor="rm-add-pharm" className="block font-bold text-pharma-blue mb-1">
                  Target Pharmacopeia <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <select
                  id="rm-add-pharm"
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
                <label htmlFor="rm-add-supplier" className="block font-bold text-pharma-blue mb-1">
                  Supplier / Vendor <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="rm-add-supplier"
                  {...register("supplier")}
                  placeholder="e.g. Mallinckrodt Pharmaceuticals"
                  aria-invalid={!!errors.supplier}
                  aria-describedby={errors.supplier ? "rm-add-supplier-error" : undefined}
                  className={`text-xs ${errors.supplier ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.supplier && (
                  <p id="rm-add-supplier-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.supplier.message}</span>
                  </p>
                )}
              </div>

              {/* Manufacturer */}
              <div>
                <label htmlFor="rm-add-mfr" className="block font-bold text-pharma-blue mb-1">
                  Manufacturer <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="rm-add-mfr"
                  {...register("manufacturer")}
                  placeholder="e.g. Mallinckrodt USA"
                  aria-invalid={!!errors.manufacturer}
                  aria-describedby={errors.manufacturer ? "rm-add-mfr-error" : undefined}
                  className={`text-xs ${errors.manufacturer ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.manufacturer && (
                  <p id="rm-add-mfr-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.manufacturer.message}</span>
                  </p>
                )}
              </div>

              {/* Batch Number */}
              <div>
                <label htmlFor="rm-add-batch" className="block font-bold text-pharma-blue mb-1">
                  Batch / Lot Number <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="rm-add-batch"
                  {...register("batchNumber")}
                  placeholder="e.g. PAR-DC90-M88"
                  aria-invalid={!!errors.batchNumber}
                  aria-describedby={errors.batchNumber ? "rm-add-batch-error" : undefined}
                  className={`font-mono text-xs ${errors.batchNumber ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.batchNumber && (
                  <p id="rm-add-batch-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.batchNumber.message}</span>
                  </p>
                )}
              </div>

              {/* PO Reference */}
              <div>
                <label htmlFor="rm-add-po" className="block font-bold text-pharma-blue mb-1">
                  Purchase Order Ref (PO #) <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="rm-add-po"
                  {...register("poReference")}
                  placeholder="e.g. PO-2026-8812"
                  aria-invalid={!!errors.poReference}
                  aria-describedby={errors.poReference ? "rm-add-po-error" : undefined}
                  className={`font-mono text-xs ${errors.poReference ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.poReference && (
                  <p id="rm-add-po-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.poReference.message}</span>
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="rm-add-qty" className="block font-bold text-pharma-blue mb-1">
                  Quantity Received <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="rm-add-qty"
                  type="number"
                  step="0.01"
                  {...register("quantity")}
                  aria-invalid={!!errors.quantity}
                  aria-describedby={errors.quantity ? "rm-add-qty-error" : undefined}
                  className={`text-xs ${errors.quantity ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.quantity && (
                  <p id="rm-add-qty-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.quantity.message}</span>
                  </p>
                )}
              </div>

              {/* Unit */}
              <div>
                <label htmlFor="rm-add-unit" className="block font-bold text-pharma-blue mb-1">
                  Unit <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <select
                  id="rm-add-unit"
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

              {/* Received Date */}
              <div>
                <label htmlFor="rm-add-recdate" className="block font-bold text-pharma-blue mb-1">
                  Received Date <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="rm-add-recdate"
                  type="date"
                  {...register("receivedDate")}
                  aria-invalid={!!errors.receivedDate}
                  aria-describedby={errors.receivedDate ? "rm-add-recdate-error" : undefined}
                  className="text-xs"
                />
                {errors.receivedDate && (
                  <p id="rm-add-recdate-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.receivedDate.message}</span>
                  </p>
                )}
              </div>

              {/* Sampling Date */}
              <div>
                <label htmlFor="rm-add-sampdate" className="block font-bold text-pharma-blue mb-1">
                  Sampling Date <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="rm-add-sampdate"
                  type="date"
                  {...register("samplingDate")}
                  aria-invalid={!!errors.samplingDate}
                  aria-describedby={errors.samplingDate ? "rm-add-sampdate-error" : undefined}
                  className="text-xs"
                />
                {errors.samplingDate && (
                  <p id="rm-add-sampdate-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.samplingDate.message}</span>
                  </p>
                )}
              </div>

              {/* Retest Date */}
              <div>
                <label htmlFor="rm-add-retest" className="block font-bold text-pharma-blue mb-1">
                  Scheduled Retest Date
                </label>
                <Input
                  id="rm-add-retest"
                  type="date"
                  {...register("retestDate")}
                  className="text-xs"
                />
              </div>

              {/* Storage Condition (Col span 2) */}
              <div className="sm:col-span-2">
                <label htmlFor="rm-add-cond" className="block font-bold text-pharma-blue mb-1">
                  Storage Condition Specification <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <Input
                  id="rm-add-cond"
                  {...register("storageCondition")}
                  placeholder="e.g. Store airtight below 25°C, protect from moisture and light"
                  aria-invalid={!!errors.storageCondition}
                  aria-describedby={errors.storageCondition ? "rm-add-cond-error" : undefined}
                  className={`text-xs ${errors.storageCondition ? "border-fail-red focus-visible:ring-fail-red" : ""}`}
                />
                {errors.storageCondition && (
                  <p id="rm-add-cond-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{errors.storageCondition.message}</span>
                  </p>
                )}
              </div>

              {/* Storage Bay */}
              <div>
                <label htmlFor="rm-add-bay" className="block font-bold text-pharma-blue mb-1">
                  Storage Bay Location
                </label>
                <Input
                  id="rm-add-bay"
                  {...register("storageLocation")}
                  placeholder="e.g. API Bay A-02"
                  className="text-xs"
                />
              </div>

              {/* Remarks (Col span 3) */}
              <div className="sm:col-span-3">
                <label htmlFor="rm-add-remarks" className="block font-bold text-pharma-blue mb-1">
                  Sampling Notes &amp; QA Inspection Remarks <span className="text-fail-red" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="rm-add-remarks"
                  {...register("remarks")}
                  rows={2}
                  placeholder="e.g. Sampling completed in laminar airflow dispensing booth DB-02. Verified manufacturer seals."
                  aria-invalid={!!errors.remarks}
                  aria-describedby={errors.remarks ? "rm-add-remarks-error" : undefined}
                  className={`w-full rounded-md border border-slate-200 bg-white p-2.5 text-xs text-slate-800 shadow-2xs focus:border-pharma-blue focus:outline-hidden focus:ring-1 focus:ring-pharma-blue ${
                    errors.remarks ? "border-fail-red" : ""
                  }`}
                />
                {errors.remarks && (
                  <p id="rm-add-remarks-error" role="alert" className="text-[11px] text-fail-red mt-1 font-medium flex items-center gap-1">
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
                <span>{submitting || isSubmitting ? "Registering..." : "Register Raw Material Sample"}</span>
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
