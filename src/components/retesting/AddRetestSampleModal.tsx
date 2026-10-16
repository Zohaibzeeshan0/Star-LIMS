"use client";

import React from "react";
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
import { PlusCircle, AlertCircle, RotateCcw } from "lucide-react";

interface AddRetestSampleModalProps {
  open: boolean;
  onClose: () => void;
  onAddSample: (newSample: RetestSample) => void;
}

export function AddRetestSampleModal({
  open,
  onClose,
  onAddSample,
}: AddRetestSampleModalProps) {
  const defaultSampleId = `CP-RET-2026-${String(Math.floor(Math.random() * 899 + 15)).padStart(3, "0")}`;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RetestSampleFormValues>({
    resolver: zodResolver(retestSampleSchema),
    defaultValues: {
      id: defaultSampleId,
      rawMaterialSampleId: "CP-RAW-2024-",
      materialCode: "RM-API-",
      materialName: "",
      category: "Active Pharmaceutical Ingredient (API)",
      supplier: "",
      manufacturer: "",
      batchNumber: "",
      warehouseLocation: "Bay R-02 (Climate Controlled 20-25°C)",
      remainingStock: 250,
      unit: "kg",
      containersCount: 10,
      manufactureDate: "2024-10-15",
      originalRetestDate: "2026-10-15",
      currentRetestDate: "2026-10-15",
      extendedRetestDate: "",
      retestCycleNumber: 1,
      extensionMonthsGranted: 12,
      status: "Scheduled",
      retestReason: "Scheduled 24-Month Surveillance for Shelf-Life Extension",
      pharmacopeia: "USP 48-NF 43",
      storageCondition: "Store airtight below 25°C, protect from moisture and light",
      analyst: "Zubair Ahmed (Senior QC Analyst)",
      reviewedBy: "Dr. Farhan Malik (QA Director)",
      remarks: "Surveillance sampling requisition initiated. Container seals and desiccant packs verified intact.",
    },
  });

  const onSubmit = (data: RetestSampleFormValues) => {
    const newSample: RetestSample = {
      id: data.id,
      rawMaterialSampleId: data.rawMaterialSampleId.toUpperCase(),
      materialCode: data.materialCode.toUpperCase(),
      materialName: data.materialName,
      category: data.category,
      supplier: data.supplier,
      manufacturer: data.manufacturer,
      batchNumber: data.batchNumber.toUpperCase(),
      warehouseLocation: data.warehouseLocation,
      remainingStock: Number(data.remainingStock),
      unit: data.unit,
      containersCount: Number(data.containersCount),
      manufactureDate: data.manufactureDate,
      initialReceiptDate: data.manufactureDate,
      originalRetestDate: data.originalRetestDate,
      currentRetestDate: data.currentRetestDate,
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
      tests: [
        {
          id: "T-01",
          parameter: "Assay / Potency Verification",
          specification: "98.5% - 101.5%",
          initialReleaseResult: "99.8%",
          currentRetestResult: data.status === "Extended / Passed" ? "99.5%" : "Testing scheduled",
          passed: true,
          instrumentUsed: "Waters Alliance e2695 HPLC"
        },
        {
          id: "T-02",
          parameter: "Related Substances / Degradation Products",
          specification: "NMT 0.20%",
          initialReleaseResult: "0.04%",
          currentRetestResult: data.status === "Extended / Passed" ? "0.06%" : "Testing scheduled",
          passed: true,
          instrumentUsed: "Waters UV/Vis 2489"
        },
        {
          id: "T-03",
          parameter: "Water Content by Karl Fischer",
          specification: "NMT 0.50%",
          initialReleaseResult: "0.20%",
          currentRetestResult: data.status === "Extended / Passed" ? "0.24%" : "Testing scheduled",
          passed: true,
          instrumentUsed: "Metrohm 890 Titrando KF"
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="font-heading text-lg font-bold text-pharma-blue">
                Schedule Raw Material Retest Surveillance
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Log a scheduled or reactive re-assay order for APIs and critical excipients to authorize shelf-life extension.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Top Identifier Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Retest Order ID <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("id")}
                placeholder="CP-RET-2026-015"
                className="font-mono text-xs mt-1 uppercase"
              />
              {errors.id && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.id.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Original Raw Material ID <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("rawMaterialSampleId")}
                placeholder="CP-RAW-2024-0310"
                className="font-mono text-xs mt-1 uppercase"
              />
              {errors.rawMaterialSampleId && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.rawMaterialSampleId.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Material Code <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("materialCode")}
                placeholder="RM-API-0012"
                className="font-mono text-xs mt-1 uppercase"
              />
              {errors.materialCode && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.materialCode.message}
                </p>
              )}
            </div>
          </div>

          {/* Material Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Raw Material Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("materialName")}
                placeholder="e.g. Paracetamol DC 90% Granules"
                className="text-xs mt-1"
              />
              {errors.materialName && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.materialName.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Material Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register("category")}
                className="w-full text-xs py-2 px-3 mt-1 rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
              >
                <option value="Active Pharmaceutical Ingredient (API)">Active Pharmaceutical Ingredient (API)</option>
                <option value="Excipient / Binder / Filler">Excipient / Binder / Filler</option>
                <option value="Coating Polymer / Granulating Agent">Coating Polymer / Granulating Agent</option>
                <option value="Preservative / Antioxidant">Preservative / Antioxidant</option>
                <option value="Process Solvent / Reagent">Process Solvent / Reagent</option>
              </select>
            </div>
          </div>

          {/* Batch, Supplier & Manufacturer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Batch / Lot Number <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("batchNumber")}
                placeholder="PAR-DC90-M88"
                className="font-mono text-xs mt-1 uppercase"
              />
              {errors.batchNumber && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.batchNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Supplier / Vendor <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("supplier")}
                placeholder="e.g. Mallinckrodt Pharmaceuticals"
                className="text-xs mt-1"
              />
              {errors.supplier && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.supplier.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Manufacturer <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("manufacturer")}
                placeholder="e.g. Mallinckrodt Inc., USA"
                className="text-xs mt-1"
              />
              {errors.manufacturer && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.manufacturer.message}
                </p>
              )}
            </div>
          </div>

          {/* Warehouse Location, Stock & Containers */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">
                Warehouse Location <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("warehouseLocation")}
                placeholder="e.g. Bay R-02 (Climate Controlled 20-25°C)"
                className="text-xs mt-1"
              />
              {errors.warehouseLocation && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.warehouseLocation.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Remaining Stock <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-1 mt-1">
                <Input
                  type="number"
                  step="any"
                  {...register("remainingStock")}
                  className="text-xs w-2/3"
                />
                <select
                  {...register("unit")}
                  className="w-1/3 text-xs py-1.5 px-1 rounded-md border border-slate-200 bg-white text-slate-700"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="Liters">L</option>
                  <option value="Drums">Drums</option>
                  <option value="Bags">Bags</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Containers Count <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                {...register("containersCount")}
                placeholder="10"
                className="text-xs mt-1"
              />
            </div>
          </div>

          {/* Dates & Retest Cycle */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3 rounded-lg border border-slate-200/80">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Manufacture Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register("manufactureDate")}
                className="text-xs mt-1 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Original Retest Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register("originalRetestDate")}
                className="text-xs mt-1 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Current Retest Horizon <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register("currentRetestDate")}
                className="text-xs mt-1 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Retest Cycle # <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                {...register("retestCycleNumber")}
                min={1}
                max={5}
                className="text-xs mt-1 bg-white"
              />
            </div>
          </div>

          {/* Retest Reason, Monograph & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Retest Reason / Protocol <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("retestReason")}
                placeholder="Scheduled 24-Month Surveillance"
                className="text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Pharmacopeial Standard <span className="text-red-500">*</span>
              </label>
              <select
                {...register("pharmacopeia")}
                className="w-full text-xs py-2 px-3 mt-1 rounded-md border border-slate-200 bg-white text-slate-700"
              >
                <option value="USP 48-NF 43">USP 48-NF 43</option>
                <option value="BP 2026">BP 2026</option>
                <option value="Ph. Eur. 11.0">Ph. Eur. 11.0</option>
                <option value="In-House Validated">In-House Validated</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Surveillance Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register("status")}
                className="w-full text-xs py-2 px-3 mt-1 rounded-md border border-slate-200 bg-white text-slate-700"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Due Soon">Due Soon (&lt;= 30 Days)</option>
                <option value="Overdue">Overdue</option>
                <option value="Under Testing">Under Testing</option>
                <option value="Extended / Passed">Extended / Passed</option>
                <option value="Quarantine">Quarantine</option>
                <option value="Rejected / OOS">Rejected / OOS</option>
              </select>
            </div>
          </div>

          {/* Storage Condition & Assignees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Storage Condition <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("storageCondition")}
                placeholder="Store airtight below 25°C"
                className="text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Assigned QC Analyst <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("analyst")}
                placeholder="Zubair Ahmed"
                className="text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                QA Reviewer <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("reviewedBy")}
                placeholder="Dr. Farhan Malik"
                className="text-xs mt-1"
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="text-xs font-semibold text-slate-700">
              Surveillance Remarks & Inspection Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("remarks")}
              rows={2}
              className="w-full text-xs p-2 mt-1 rounded-md border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
              placeholder="Record container integrity, drum seal status, and re-assay justification..."
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
              <PlusCircle className="h-4 w-4" />
              Schedule Retest Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
