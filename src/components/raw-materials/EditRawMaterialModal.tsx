"use client";

import React, { useEffect } from "react";
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
import { Edit, Save } from "lucide-react";

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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

  const onSubmit = (data: RawMaterialSampleFormValues) => {
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
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-pharma-blue">
            <Edit className="h-5 w-5 text-pharma-blue" />
            <span>Edit Raw Material Record: {sample.id}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Modify raw material attributes, QA status disposition, or sampling remarks.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            {/* Sample ID (read-only) */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Sample LIMS ID
              </label>
              <Input
                {...register("id")}
                readOnly
                className="font-mono text-xs bg-slate-100 text-slate-600 cursor-not-allowed"
              />
            </div>

            {/* Material Code */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Material Code <span className="text-fail-red">*</span>
              </label>
              <Input
                {...register("materialCode")}
                className={`font-mono text-xs ${errors.materialCode ? "border-fail-red" : ""}`}
              />
              {errors.materialCode && (
                <span className="text-[11px] text-fail-red mt-0.5 block">{errors.materialCode.message}</span>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Classification <span className="text-fail-red">*</span>
              </label>
              <select
                {...register("category")}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold shadow-2xs focus:border-pharma-blue focus:outline-none"
              >
                <option value="Active Pharmaceutical Ingredient (API)">Active Pharmaceutical Ingredient (API)</option>
                <option value="Excipient / Binder / Filler">Excipient / Binder / Filler</option>
                <option value="Process Solvent / Reagent">Process Solvent / Reagent</option>
                <option value="Coating Polymer / Colorant">Coating Polymer / Colorant</option>
                <option value="Preservative / Buffer">Preservative / Buffer</option>
              </select>
            </div>

            {/* Material Name */}
            <div className="sm:col-span-3">
              <label className="block font-bold text-pharma-blue mb-1">
                Material Name <span className="text-fail-red">*</span>
              </label>
              <Input
                {...register("materialName")}
                className={`text-xs ${errors.materialName ? "border-fail-red" : ""}`}
              />
              {errors.materialName && (
                <span className="text-[11px] text-fail-red mt-0.5 block">{errors.materialName.message}</span>
              )}
            </div>

            {/* Supplier */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Supplier / Vendor <span className="text-fail-red">*</span>
              </label>
              <Input
                {...register("supplier")}
                className={`text-xs ${errors.supplier ? "border-fail-red" : ""}`}
              />
              {errors.supplier && (
                <span className="text-[11px] text-fail-red mt-0.5 block">{errors.supplier.message}</span>
              )}
            </div>

            {/* Manufacturer */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Manufacturer <span className="text-fail-red">*</span>
              </label>
              <Input
                {...register("manufacturer")}
                className={`text-xs ${errors.manufacturer ? "border-fail-red" : ""}`}
              />
              {errors.manufacturer && (
                <span className="text-[11px] text-fail-red mt-0.5 block">{errors.manufacturer.message}</span>
              )}
            </div>

            {/* Batch / Lot Number */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Batch / Lot Number <span className="text-fail-red">*</span>
              </label>
              <Input
                {...register("batchNumber")}
                className={`font-mono text-xs ${errors.batchNumber ? "border-fail-red" : ""}`}
              />
              {errors.batchNumber && (
                <span className="text-[11px] text-fail-red mt-0.5 block">{errors.batchNumber.message}</span>
              )}
            </div>

            {/* PO Reference */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                PO Reference <span className="text-fail-red">*</span>
              </label>
              <Input
                {...register("poReference")}
                className={`font-mono text-xs ${errors.poReference ? "border-fail-red" : ""}`}
              />
              {errors.poReference && (
                <span className="text-[11px] text-fail-red mt-0.5 block">{errors.poReference.message}</span>
              )}
            </div>

            {/* Pharmacopeia */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Pharmacopeial Standard <span className="text-fail-red">*</span>
              </label>
              <select
                {...register("pharmacopeia")}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold shadow-2xs focus:border-pharma-blue focus:outline-none"
              >
                <option value="BP 2026">BP 2026</option>
                <option value="USP 48-NF 43">USP 48-NF 43</option>
                <option value="Ph. Eur. 11.0">Ph. Eur. 11.0</option>
                <option value="In-House Validated">In-House Validated</option>
              </select>
            </div>

            {/* Quality Status (All 7 statuses) */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Quality Status Disposition <span className="text-fail-red">*</span>
              </label>
              <select
                {...register("status")}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-bold shadow-2xs focus:border-pharma-blue focus:outline-none"
              >
                <option value="Registered">Registered (Intake)</option>
                <option value="Under Testing">Under Testing</option>
                <option value="Reviewed">Reviewed (Pending QA Release)</option>
                <option value="Released">Released (Pass)</option>
                <option value="Rejected">Rejected (OOS)</option>
                <option value="Quarantine">Quarantine (Hold)</option>
                <option value="Retest">Retest Required</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Quantity <span className="text-fail-red">*</span>
              </label>
              <Input
                type="number"
                {...register("quantity")}
                className={`text-xs ${errors.quantity ? "border-fail-red" : ""}`}
              />
              {errors.quantity && (
                <span className="text-[11px] text-fail-red mt-0.5 block">{errors.quantity.message}</span>
              )}
            </div>

            {/* Unit */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Measurement Unit <span className="text-fail-red">*</span>
              </label>
              <select
                {...register("unit")}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold shadow-2xs focus:border-pharma-blue focus:outline-none"
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
              <label className="block font-bold text-pharma-blue mb-1">
                Received Date <span className="text-fail-red">*</span>
              </label>
              <Input type="date" {...register("receivedDate")} className="text-xs" />
            </div>

            {/* Sampling Date */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Sampling Date <span className="text-fail-red">*</span>
              </label>
              <Input type="date" {...register("samplingDate")} className="text-xs" />
            </div>

            {/* Retest Date */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Scheduled Retest Date
              </label>
              <Input type="date" {...register("retestDate")} className="text-xs" />
            </div>

            {/* Storage Condition */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-pharma-blue mb-1">
                Storage Condition Specification <span className="text-fail-red">*</span>
              </label>
              <Input {...register("storageCondition")} className="text-xs" />
            </div>

            {/* Storage Bay */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Storage Bay Location
              </label>
              <Input {...register("storageLocation")} className="text-xs" />
            </div>

            {/* Remarks */}
            <div className="sm:col-span-3">
              <label className="block font-bold text-pharma-blue mb-1">
                Inspection Remarks & Disposition Notes <span className="text-fail-red">*</span>
              </label>
              <textarea
                {...register("remarks")}
                rows={2}
                className={`w-full rounded-md border border-slate-200 bg-white p-2.5 text-xs text-slate-800 shadow-2xs focus:border-pharma-blue focus:outline-none ${
                  errors.remarks ? "border-fail-red" : ""
                }`}
              />
              {errors.remarks && (
                <span className="text-[11px] text-fail-red mt-0.5 block">{errors.remarks.message}</span>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={isSubmitting}
              className="gap-1.5 font-bold shadow-sm"
            >
              <Save className="h-4 w-4" />
              Save Modifications
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
