"use client";

import React, { useEffect } from "react";
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
import { Edit, Save } from "lucide-react";

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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

  const onSubmit = (data: PackagingSampleFormValues) => {
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
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-pharma-blue">
            <Edit className="h-5 w-5 text-pharma-blue" />
            <span>Edit Packaging Material Record: {sample.id}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Modify packaging attributes, inspection status disposition, or sampling remarks.
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

            {/* Packaging Type */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Packaging Type <span className="text-fail-red">*</span>
              </label>
              <select
                {...register("packagingType")}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold shadow-2xs focus:border-pharma-blue focus:outline-none"
              >
                <option value="Primary Packaging">Primary Packaging</option>
                <option value="Secondary Packaging">Secondary Packaging</option>
                <option value="Tertiary Packaging">Tertiary Packaging</option>
                <option value="Printed Packaging">Printed Packaging</option>
                <option value="Closures & Seals">Closures & Seals</option>
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

            {/* Status (Key Field) */}
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
                <option value="Rolls">Rolls</option>
                <option value="Bottles">Bottles</option>
                <option value="Vials">Vials</option>
                <option value="Caps">Caps</option>
                <option value="Cartons">Cartons</option>
                <option value="Leaflets">Leaflets</option>
                <option value="Sheets">Sheets</option>
                <option value="Stoppers">Stoppers</option>
                <option value="Units">Units</option>
                <option value="kg">kg</option>
              </select>
            </div>

            {/* Storage Location */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Storage Location
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
