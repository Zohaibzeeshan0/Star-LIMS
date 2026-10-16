"use client";

import React from "react";
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
import { PlusCircle, AlertCircle, Package } from "lucide-react";

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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

  const onSubmit = (data: PackagingSampleFormValues) => {
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
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            {/* Sample ID */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Sample LIMS ID <span className="text-fail-red">*</span>
              </label>
              <Input
                {...register("id")}
                placeholder="CP-PKG-2026-0115"
                className={`font-mono text-xs ${errors.id ? "border-fail-red" : ""}`}
              />
              {errors.id && (
                <span className="text-[11px] text-fail-red mt-0.5 block">{errors.id.message}</span>
              )}
            </div>

            {/* Material Code */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Material Item Code <span className="text-fail-red">*</span>
              </label>
              <Input
                {...register("materialCode")}
                placeholder="e.g. PM-FOL-0042"
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

            {/* Material Name (Col span 3) */}
            <div className="sm:col-span-3">
              <label className="block font-bold text-pharma-blue mb-1">
                Packaging Material Name <span className="text-fail-red">*</span>
              </label>
              <Input
                {...register("materialName")}
                placeholder="e.g. Amber Type I Borosilicate Glass Vials 10ml or Alu-Alu Blister Foil"
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
                placeholder="e.g. Schott Pharma AG or Alupack Ind."
                className={`text-xs ${errors.supplier ? "border-fail-red" : ""}`}
              />
              {errors.supplier && (
                <span className="text-[11px] text-fail-red mt-0.5 block">{errors.supplier.message}</span>
              )}
            </div>

            {/* Manufacturer */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Manufacturer Name <span className="text-fail-red">*</span>
              </label>
              <Input
                {...register("manufacturer")}
                placeholder="e.g. Constantia Flexibles or Berry Global"
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
                placeholder="e.g. ALU-240-B88"
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
              {errors.receivedDate && (
                <span className="text-[11px] text-fail-red mt-0.5 block">{errors.receivedDate.message}</span>
              )}
            </div>

            {/* Sampling Date */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Sampling Date <span className="text-fail-red">*</span>
              </label>
              <Input type="date" {...register("samplingDate")} className="text-xs" />
              {errors.samplingDate && (
                <span className="text-[11px] text-fail-red mt-0.5 block">{errors.samplingDate.message}</span>
              )}
            </div>

            {/* Initial Status */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Initial Sample Status <span className="text-fail-red">*</span>
              </label>
              <select
                {...register("status")}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold shadow-2xs focus:border-pharma-blue focus:outline-none"
              >
                <option value="Registered">Registered (Intake Logged)</option>
                <option value="Under Testing">Under Testing</option>
                <option value="Quarantine">Quarantine (Hold)</option>
                <option value="Released">Released (Pre-authorized)</option>
                <option value="Retest">Retest Required</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Sample Quantity <span className="text-fail-red">*</span>
              </label>
              <Input
                type="number"
                {...register("quantity")}
                placeholder="100"
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
                Storage Bay Location
              </label>
              <Input
                {...register("storageLocation")}
                placeholder="e.g. PM Warehouse Bay B-04"
                className="text-xs"
              />
            </div>

            {/* Remarks (Col span 3) */}
            <div className="sm:col-span-3">
              <label className="block font-bold text-pharma-blue mb-1">
                Sampling Notes & Technical Remarks <span className="text-fail-red">*</span>
              </label>
              <textarea
                {...register("remarks")}
                rows={2}
                placeholder="e.g. Sample intake logged. Clean barrier packaging verified, zero moisture exposure."
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
              variant="teal"
              size="sm"
              disabled={isSubmitting}
              className="gap-1.5 font-bold shadow-sm"
            >
              <PlusCircle className="h-4 w-4" />
              Register & Save Sample
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
