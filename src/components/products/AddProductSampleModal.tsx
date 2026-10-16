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
      productName: "",
      productCode: "FP-TAB-",
      dosageForm: "Tablets",
      strength: "500 mg",
      genericName: "",
      batchNumber: "",
      batchSize: "250,000 Tablets",
      batchStatus: "Commercial Batch",
      manufacturingDate: new Date().toISOString().slice(0, 10),
      expiryDate: "2029-10-15",
      receivedDate: new Date().toISOString().slice(0, 10),
      sampleType: "Finished Product Release",
      packagingDetails: "10 x 10 Alu-PVC Blisters per Printed Unit Carton",
      productionLine: "Solid Oral Facility (Line-1 Fette Press)",
      targetMarket: "Domestic (DRAP)",
      storageCondition: "Store below 30°C in a dry place, protect from light",
      pharmacopeia: "BP 2026",
      quantitySampled: 100,
      unit: "Tablets",
      status: "Registered",
      analyst: "Zubair Ahmed",
      reviewedBy: "Dr. Farhan Malik",
      remarks: "Sample drawn according to SOP-QC-012 for commercial batch release inspection.",
    },
  });

  const onSubmit = (data: ProductSampleFormValues) => {
    const newSample: ProductSample = {
      id: data.id,
      productName: data.productName,
      productCode: data.productCode.toUpperCase(),
      dosageForm: data.dosageForm,
      strength: data.strength,
      genericName: data.genericName,
      batchNumber: data.batchNumber.toUpperCase(),
      batchSize: data.batchSize,
      batchStatus: data.batchStatus,
      manufacturingDate: data.manufacturingDate,
      expiryDate: data.expiryDate,
      receivedDate: data.receivedDate,
      samplingDate: data.receivedDate,
      sampleType: data.sampleType,
      packagingDetails: data.packagingDetails,
      productionLine: data.productionLine,
      targetMarket: data.targetMarket,
      storageCondition: data.storageCondition,
      pharmacopeia: data.pharmacopeia,
      quantitySampled: Number(data.quantitySampled),
      unit: data.unit,
      status: data.status,
      analyst: data.analyst,
      reviewedBy: data.reviewedBy,
      remarks: data.remarks,
      statusHistory: [
        {
          id: `SH-${Date.now()}-1`,
          status: data.status,
          timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
          changedBy: data.analyst,
          remarks: "Initial product sample registered into QC laboratory."
        }
      ],
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
                Add Finished Product Sample
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Register a finished pharmaceutical product batch, IPQC sample, or stability pull for laboratory testing.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Top Identifier Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Sample ID <span className="text-red-500">*</span>
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

          {/* Product Name, Strength & Generic */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("productName")}
                placeholder="e.g. Ciprocit Film-Coated Tablets"
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
                Strength / Concentration <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("strength")}
                placeholder="e.g. 500 mg or 120 mg/5 mL"
                className="text-xs mt-1"
              />
              {errors.strength && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {errors.strength.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Active Generic Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("genericName")}
                placeholder="e.g. Ciprofloxacin HCl BP"
                className="text-xs mt-1"
              />
            </div>
          </div>

          {/* Dosage Form, Sample Type & Batch Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Dosage Form <span className="text-red-500">*</span>
              </label>
              <select
                {...register("dosageForm")}
                className="w-full text-xs py-2 px-3 mt-1 rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
              >
                <option value="Tablets">Tablets</option>
                <option value="Capsules">Capsules</option>
                <option value="Syrups">Syrups</option>
                <option value="Suspensions">Suspensions</option>
                <option value="Creams">Creams</option>
                <option value="Injectables / Ampoules">Injectables / Ampoules</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Sample Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register("sampleType")}
                className="w-full text-xs py-2 px-3 mt-1 rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
              >
                <option value="Finished Product Release">Finished Product Release</option>
                <option value="In-Process Quality Control (IPQC)">In-Process Quality Control (IPQC)</option>
                <option value="ICH Stability Testing">ICH Stability Testing</option>
                <option value="Process Validation Batch">Process Validation Batch</option>
                <option value="Sterile Parenteral Release">Sterile Parenteral Release</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Batch Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register("batchStatus")}
                className="w-full text-xs py-2 px-3 mt-1 rounded-md border border-slate-200 bg-white text-slate-700"
              >
                <option value="Commercial Batch">Commercial Batch</option>
                <option value="Validation Batch">Validation Batch</option>
                <option value="Pilot Batch">Pilot Batch</option>
                <option value="Stability Chamber Batch">Stability Chamber Batch</option>
                <option value="Quarantine Hold">Quarantine Hold</option>
              </select>
            </div>
          </div>

          {/* User Required Dates Row: Manufacturing, Expiry, Received */}
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
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register("expiryDate")}
                className="text-xs mt-1 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Received Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register("receivedDate")}
                className="text-xs mt-1 bg-white font-bold text-pharma-blue"
              />
            </div>
          </div>

          {/* Packaging Details & Batch Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">
                Packaging Details <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("packagingDetails")}
                placeholder="e.g. 10 x 10 Alu-PVC Blister Packs in Unit Carton"
                className="text-xs mt-1"
              />
            </div>

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
          </div>

          {/* Production Line, Market & Monograph */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Production Line <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("productionLine")}
                placeholder="e.g. Solid Oral Line-1"
                className="text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Target Market <span className="text-red-500">*</span>
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
                Sample Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register("status")}
                className="w-full text-xs py-2 px-3 mt-1 rounded-md border border-slate-200 bg-white text-slate-700 font-bold"
              >
                <option value="Registered">Registered</option>
                <option value="Under Testing">Under Testing</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Released">Released</option>
                <option value="Quarantine">Quarantine</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Assignees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              Sampling Remarks &amp; Inspection Notes <span className="text-red-500">*</span>
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
              Add Product Sample
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
