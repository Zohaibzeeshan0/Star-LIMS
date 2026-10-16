"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productSampleSchema,
  ProductSampleFormValues,
} from "@/lib/validations/product-schema";
import { ProductSample } from "@/lib/types/product";
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
import { PlusCircle, Pill } from "lucide-react";

interface AddProductSampleModalProps {
  open: boolean;
  onClose: () => void;
  onAddSample: (newSample: ProductSample) => void;
}

export function AddProductSampleModal({
  open,
  onClose,
  onAddSample,
}: AddProductSampleModalProps) {
  const defaultSampleId = `CP-PRD-2026-${String(Math.floor(Math.random() * 899 + 515)).padStart(3, "0")}`;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductSampleFormValues>({
    resolver: zodResolver(productSampleSchema),
    defaultValues: {
      id: defaultSampleId,
      productCode: "FP-TAB-",
      productName: "",
      genericName: "",
      dosageForm: "Film-Coated Tablets",
      stage: "Finished Product Release (FPR)",
      stabilityInterval: "N/A - Commercial Release",
      batchNumber: "",
      batchSize: "250,000 Tablets",
      productionLine: "Solid Oral Facility (Line-1 Fette Press)",
      manufacturingDate: new Date().toISOString().slice(0, 10),
      expiryDate: "2029-10-15",
      samplingDate: new Date().toISOString().slice(0, 10),
      samplingStage: "Final Secondary Packaged Stock",
      packagingPresentation: "10 x 10 Alu-PVC Blisters per Printed Unit Carton",
      targetMarket: "Domestic (DRAP)",
      storageCondition: "Store below 30°C in a dry place, protect from light",
      pharmacopeia: "BP 2026",
      quantitySampled: 100,
      unit: "Tablets",
      status: "Registered",
      analyst: "Zubair Ahmed (Senior QC Analyst)",
      reviewedBy: "Dr. Farhan Malik (QA Release Director)",
      remarks: "Sample drawn according to SOP-QC-012 for commercial batch release inspection.",
    },
  });

  const onSubmit = (data: ProductSampleFormValues) => {
    const newSample: ProductSample = {
      id: data.id,
      productCode: data.productCode.toUpperCase(),
      productName: data.productName,
      genericName: data.genericName,
      dosageForm: data.dosageForm,
      stage: data.stage,
      stabilityInterval: data.stabilityInterval || undefined,
      batchNumber: data.batchNumber.toUpperCase(),
      batchSize: data.batchSize,
      productionLine: data.productionLine,
      manufacturingDate: data.manufacturingDate,
      expiryDate: data.expiryDate,
      samplingDate: data.samplingDate,
      samplingStage: data.samplingStage,
      packagingPresentation: data.packagingPresentation,
      targetMarket: data.targetMarket,
      storageCondition: data.storageCondition,
      pharmacopeia: data.pharmacopeia,
      quantitySampled: Number(data.quantitySampled),
      unit: data.unit,
      status: data.status,
      analyst: data.analyst,
      reviewedBy: data.reviewedBy,
      remarks: data.remarks,
      tests: [
        {
          id: "PT-01",
          parameter: "Assay (% Label Claim)",
          specification: "95.0% - 105.0%",
          observedResult: "99.6%",
          passed: true,
          instrumentUsed: "Waters Alliance e2695 HPLC"
        },
        {
          id: "PT-02",
          parameter: "Dissolution Rate (USP App 2)",
          specification: "Q NLT 80% in 45 min",
          observedResult: "91.2%",
          passed: true,
          instrumentUsed: "Erweka DT 820 Dissolution Tester"
        },
        {
          id: "PT-03",
          parameter: "Uniformity of Dosage Units",
          specification: "AV NMT 15.0",
          observedResult: "AV = 4.1",
          passed: true,
          instrumentUsed: "Mettler Toledo Analytical Balance"
        },
        {
          id: "PT-04",
          parameter: "Disintegration Time",
          specification: "NMT 15 minutes",
          observedResult: "7 min 15 sec",
          passed: true,
          instrumentUsed: "Sotax DT50"
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
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="font-heading text-lg font-bold text-pharma-blue">
                Register Finished Product / Stability Sample
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Log a commercial finished product batch, an IPQC sample, or an ICH stability pull for QC analytical testing.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Top Identifier Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Product Sample ID <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("id")}
                placeholder="CP-PRD-2026-0515"
                className="font-mono text-xs mt-1 uppercase"
              />
              {errors.id && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.id.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Product Code <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("productCode")}
                placeholder="FP-TAB-0104"
                className="font-mono text-xs mt-1 uppercase"
              />
              {errors.productCode && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.productCode.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Batch / Lot Number <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("batchNumber")}
                placeholder="CPT-500-26A"
                className="font-mono text-xs mt-1 uppercase"
              />
              {errors.batchNumber && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.batchNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Product Name & Generic Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Product Brand Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("productName")}
                placeholder="e.g. Ciprocit 500mg Film-Coated Tablets"
                className="text-xs mt-1"
              />
              {errors.productName && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.productName.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Active Generic Substance <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("genericName")}
                placeholder="e.g. Ciprofloxacin Hydrochloride BP"
                className="text-xs mt-1"
              />
              {errors.genericName && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.genericName.message}
                </p>
              )}
            </div>
          </div>

          {/* Dosage Form, Testing Stage & Stability Interval */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Dosage Form <span className="text-red-500">*</span>
              </label>
              <select
                {...register("dosageForm")}
                className="w-full text-xs py-2 px-3 mt-1 rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
              >
                <option value="Film-Coated Tablets">Film-Coated Tablets</option>
                <option value="Extended-Release Tablets">Extended-Release Tablets</option>
                <option value="Hard Gelatin Capsules">Hard Gelatin Capsules</option>
                <option value="Oral Liquid / Syrup / Suspension">Oral Liquid / Syrup / Suspension</option>
                <option value="Sterile Lyophilized Vial / Ampoule">Sterile Lyophilized Vial / Ampoule</option>
                <option value="Topical Cream / Ointment">Topical Cream / Ointment</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Testing Stream / Stage <span className="text-red-500">*</span>
              </label>
              <select
                {...register("stage")}
                className="w-full text-xs py-2 px-3 mt-1 rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
              >
                <option value="Finished Product Release (FPR)">Finished Product Release (FPR)</option>
                <option value="In-Process Quality Control (IPQC)">In-Process Quality Control (IPQC)</option>
                <option value="ICH Stability (Accelerated 40°C/75% RH)">ICH Stability (Accelerated 40°C/75% RH)</option>
                <option value="ICH Stability (Real-Time 25°C/60% RH)">ICH Stability (Real-Time 25°C/60% RH)</option>
                <option value="Sterile Parenteral Release">Sterile Parenteral Release</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Stability Pull / Interval
              </label>
              <Input
                {...register("stabilityInterval")}
                placeholder="e.g. 6-Month Pull or N/A"
                className="text-xs mt-1"
              />
            </div>
          </div>

          {/* Batch Size, Production Line & Sampling Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Batch Size <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("batchSize")}
                placeholder="e.g. 250,000 Tablets"
                className="text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Production Line / Facility <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("productionLine")}
                placeholder="e.g. Solid Oral Line-1"
                className="text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Sampling Stage <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("samplingStage")}
                placeholder="e.g. Final Packaged Stock"
                className="text-xs mt-1"
              />
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Manufacturing Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register("manufacturingDate")}
                className="text-xs mt-1 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Expiration Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register("expiryDate")}
                className="text-xs mt-1 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Sampling Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register("samplingDate")}
                className="text-xs mt-1 bg-white"
              />
            </div>
          </div>

          {/* Packaging, Target Market & Monograph */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Packaging Presentation <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("packagingPresentation")}
                placeholder="e.g. 10x10 Blister Packs"
                className="text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Commercial Target Market <span className="text-red-500">*</span>
              </label>
              <select
                {...register("targetMarket")}
                className="w-full text-xs py-2 px-3 mt-1 rounded-md border border-slate-200 bg-white text-slate-700"
              >
                <option value="Domestic (DRAP)">Domestic (Pakistan DRAP)</option>
                <option value="Export (GCC / MENA)">Export (GCC / MENA)</option>
                <option value="Institutional Hospital Supply">Institutional Hospital Supply</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Pharmacopeial Monograph <span className="text-red-500">*</span>
              </label>
              <select
                {...register("pharmacopeia")}
                className="w-full text-xs py-2 px-3 mt-1 rounded-md border border-slate-200 bg-white text-slate-700"
              >
                <option value="BP 2026">BP 2026</option>
                <option value="USP 48-NF 43">USP 48-NF 43</option>
                <option value="Ph. Eur. 11.0">Ph. Eur. 11.0</option>
                <option value="In-House Validated">In-House Validated</option>
              </select>
            </div>
          </div>

          {/* Sample Quantity, Storage & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Quantity Sampled <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-1 mt-1">
                <Input
                  type="number"
                  {...register("quantitySampled")}
                  className="text-xs w-2/3"
                />
                <select
                  {...register("unit")}
                  className="w-1/3 text-xs py-1.5 px-1 rounded-md border border-slate-200 bg-white text-slate-700"
                >
                  <option value="Tablets">Tabs</option>
                  <option value="Capsules">Caps</option>
                  <option value="Bottles">Bottles</option>
                  <option value="Vials">Vials</option>
                  <option value="Tubes">Tubes</option>
                  <option value="Packs">Packs</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Storage Condition <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("storageCondition")}
                placeholder="Store below 30°C in dry area"
                className="text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Initial QC Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register("status")}
                className="w-full text-xs py-2 px-3 mt-1 rounded-md border border-slate-200 bg-white text-slate-700"
              >
                <option value="Registered">Registered</option>
                <option value="Under Testing">Under Testing</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Released">Released (Pass)</option>
                <option value="Quarantine">Quarantine</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Assignees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                QC Analyst Assigned <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("analyst")}
                placeholder="Zubair Ahmed"
                className="text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                QA Release Reviewer <span className="text-red-500">*</span>
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
              Sampling Remarks & Packaging Inspection <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("remarks")}
              rows={2}
              className="w-full text-xs p-2 mt-1 rounded-md border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
              placeholder="Record batch yield, packaging seal integrity, and analytical test protocol..."
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
              Register Batch Sample
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
