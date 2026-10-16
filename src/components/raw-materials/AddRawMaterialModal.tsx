"use client";

import React from "react";
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
import { PlusCircle, AlertCircle, Layers } from "lucide-react";

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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
      storageLocation: "Raw Material Quarantine Bay Q-01",
      analyst: "Zubair Ahmed",
    },
  });

  const onSubmit = (data: RawMaterialSampleFormValues) => {
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
      storageLocation: data.storageLocation || "RM Quarantine Hold",
      analyst: data.analyst || "Zubair Ahmed",
      reviewedBy: "Dr. Ayesha Khan (QC Lead)",
      tests: [
        {
          id: "T1",
          name: "Identification (FTIR & Chemical)",
          specification: "Conforms to Pharmacopeial Reference Standard",
          observedResult: "Pending",
          passed: true,
          instrumentUsed: "PerkinElmer FTIR 100"
        },
        {
          id: "T2",
          name: "Assay (% Potency by HPLC / UV)",
          specification: "98.0 - 102.0 % (Dried Basis)",
          observedResult: "Pending",
          passed: true,
          instrumentUsed: "Shimadzu HPLC System-01"
        },
        {
          id: "T3",
          name: "Water Content by Karl Fischer",
          specification: "Conforms to monograph limit",
          observedResult: "Pending",
          passed: true,
          instrumentUsed: "Metrohm 899 Coulometer"
        }
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
            <span>Register New Raw Material Consignment</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Log active pharmaceutical ingredients (APIs), excipients, or process solvents into chain of custody.
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
                placeholder="CP-RAW-2026-0415"
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
                placeholder="e.g. RM-API-0012"
                className={`font-mono text-xs ${errors.materialCode ? "border-fail-red" : ""}`}
              />
              {errors.materialCode && (
                <span className="text-[11px] text-fail-red mt-0.5 block">{errors.materialCode.message}</span>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Material Classification <span className="text-fail-red">*</span>
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

            {/* Material Name (Col span 3) */}
            <div className="sm:col-span-3">
              <label className="block font-bold text-pharma-blue mb-1">
                Material Chemical Nomenclature / Trade Name <span className="text-fail-red">*</span>
              </label>
              <Input
                {...register("materialName")}
                placeholder="e.g. Paracetamol DC 90% Granules or Amoxicillin Trihydrate (API)"
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
                placeholder="e.g. Aurobindo Pharma or Mallinckrodt"
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
                placeholder="e.g. BASF Ludwigshafen or Dow Chemical"
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
                placeholder="e.g. AMX-TRI-RM041"
                className={`font-mono text-xs ${errors.batchNumber ? "border-fail-red" : ""}`}
              />
              {errors.batchNumber && (
                <span className="text-[11px] text-fail-red mt-0.5 block">{errors.batchNumber.message}</span>
              )}
            </div>

            {/* Purchase Order (PO) Reference */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Purchase Order Reference (PO Ref) <span className="text-fail-red">*</span>
              </label>
              <Input
                {...register("poReference")}
                placeholder="e.g. PO-2026-8812"
                className={`font-mono text-xs ${errors.poReference ? "border-fail-red" : ""}`}
              />
              {errors.poReference && (
                <span className="text-[11px] text-fail-red mt-0.5 block">{errors.poReference.message}</span>
              )}
            </div>

            {/* Pharmacopeia Monograph */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Pharmacopeial Standard <span className="text-fail-red">*</span>
              </label>
              <select
                {...register("pharmacopeia")}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold shadow-2xs focus:border-pharma-blue focus:outline-none"
              >
                <option value="BP 2026">BP 2026 (British Pharmacopoeia)</option>
                <option value="USP 48-NF 43">USP 48-NF 43 (United States Pharmacopeia)</option>
                <option value="Ph. Eur. 11.0">Ph. Eur. 11.0 (European Pharmacopoeia)</option>
                <option value="In-House Validated">In-House Validated Method</option>
              </select>
            </div>

            {/* Initial Status */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Initial Status <span className="text-fail-red">*</span>
              </label>
              <select
                {...register("status")}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold shadow-2xs focus:border-pharma-blue focus:outline-none"
              >
                <option value="Registered">Registered (Intake Logged)</option>
                <option value="Under Testing">Under Testing</option>
                <option value="Quarantine">Quarantine (Hold)</option>
                <option value="Reviewed">Reviewed (Pending QA Release)</option>
                <option value="Released">Released (Pass)</option>
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
                placeholder="250"
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

            {/* Retest Date */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Scheduled Retest Date
              </label>
              <Input type="date" {...register("retestDate")} className="text-xs" />
            </div>

            {/* Storage Condition (Col span 2) */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-pharma-blue mb-1">
                Storage Condition Specification <span className="text-fail-red">*</span>
              </label>
              <Input
                {...register("storageCondition")}
                placeholder="e.g. Store airtight below 25°C, protect from moisture and light"
                className={`text-xs ${errors.storageCondition ? "border-fail-red" : ""}`}
              />
              {errors.storageCondition && (
                <span className="text-[11px] text-fail-red mt-0.5 block">{errors.storageCondition.message}</span>
              )}
            </div>

            {/* Storage Bay */}
            <div>
              <label className="block font-bold text-pharma-blue mb-1">
                Storage Bay Location
              </label>
              <Input
                {...register("storageLocation")}
                placeholder="e.g. API Bay A-02"
                className="text-xs"
              />
            </div>

            {/* Remarks (Col span 3) */}
            <div className="sm:col-span-3">
              <label className="block font-bold text-pharma-blue mb-1">
                Sampling Notes & QA Inspection Remarks <span className="text-fail-red">*</span>
              </label>
              <textarea
                {...register("remarks")}
                rows={2}
                placeholder="e.g. Sampling completed in laminar airflow dispensing booth DB-02. Verified manufacturer seals."
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
              Register Raw Material Sample
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
