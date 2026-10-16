"use client";

import React, { useEffect } from "react";
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
import { Edit3, Save } from "lucide-react";

interface EditProductSampleModalProps {
  sample: ProductSample | null;
  open: boolean;
  onClose: () => void;
  onUpdateSample: (updatedSample: ProductSample) => void;
}

export function EditProductSampleModal({
  sample,
  open,
  onClose,
  onUpdateSample,
}: EditProductSampleModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductSampleFormValues>({
    resolver: zodResolver(productSampleSchema),
  });

  useEffect(() => {
    if (sample) {
      reset({
        id: sample.id,
        productName: sample.productName,
        productCode: sample.productCode,
        dosageForm: sample.dosageForm,
        strength: sample.strength,
        genericName: sample.genericName,
        batchNumber: sample.batchNumber,
        batchSize: sample.batchSize,
        batchStatus: sample.batchStatus,
        manufacturingDate: sample.manufacturingDate,
        expiryDate: sample.expiryDate,
        receivedDate: sample.receivedDate,
        sampleType: sample.sampleType,
        packagingDetails: sample.packagingDetails,
        productionLine: sample.productionLine,
        targetMarket: sample.targetMarket,
        storageCondition: sample.storageCondition,
        pharmacopeia: sample.pharmacopeia,
        quantitySampled: sample.quantitySampled,
        unit: sample.unit,
        status: sample.status,
        analyst: sample.analyst,
        reviewedBy: sample.reviewedBy,
        remarks: sample.remarks,
      });
    }
  }, [sample, reset]);

  if (!sample) return null;

  const onSubmit = (data: ProductSampleFormValues) => {
    const updated: ProductSample = {
      ...sample,
      productName: data.productName,
      dosageForm: data.dosageForm,
      strength: data.strength,
      batchSize: data.batchSize,
      batchStatus: data.batchStatus,
      manufacturingDate: data.manufacturingDate,
      expiryDate: data.expiryDate,
      receivedDate: data.receivedDate,
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
        ...sample.statusHistory,
        {
          id: `SH-${Date.now()}`,
          status: data.status,
          timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
          changedBy: data.analyst,
          remarks: `Status updated to ${data.status}: ${data.remarks}`
        }
      ],
      updatedAt: new Date().toISOString(),
    };

    onUpdateSample(updated);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="font-heading text-lg font-bold text-pharma-blue">
                Edit Product Sample: {sample.id}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Update batch release parameters, packaging details, QC disposition, and QA approvals.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Read-Only Summary Banner */}
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-slate-800">{sample.productName}</span>
                <span className="text-slate-400 font-mono ml-2">({sample.productCode})</span>
                <p className="text-slate-500 mt-0.5">
                  Lot: <span className="font-mono font-semibold text-pharma-blue">{sample.batchNumber}</span> | Strength: {sample.strength}
                </p>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-white px-2 py-0.5 rounded border">
                {sample.dosageForm}
              </span>
            </div>
          </div>

          {/* Hidden Fields for Validation */}
          <input type="hidden" {...register("id")} />
          <input type="hidden" {...register("productCode")} />
          <input type="hidden" {...register("genericName")} />
          <input type="hidden" {...register("batchNumber")} />

          {/* Product Name & Strength */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("productName")}
                className="text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Strength <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("strength")}
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
                className="w-full text-xs py-2 px-3 mt-1 rounded-md border border-slate-200 bg-white text-slate-700"
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
                className="w-full text-xs py-2 px-3 mt-1 rounded-md border border-slate-200 bg-white text-slate-700"
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

          {/* User Required Dates Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Manufacturing Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register("manufacturingDate")}
                className="text-xs mt-1 bg-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register("expiryDate")}
                className="text-xs mt-1 bg-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Received Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register("receivedDate")}
                className="text-xs mt-1 bg-white font-mono font-bold text-pharma-blue"
              />
            </div>
          </div>

          {/* Disposition Status & Packaging Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">
                QC Disposition Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register("status")}
                className="w-full text-xs py-2 px-3 mt-1 rounded-md border border-slate-200 bg-white text-slate-700 font-bold focus:ring-1 focus:ring-pharma-blue"
              >
                <option value="Registered">Registered</option>
                <option value="Under Testing">Under Testing</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Released">Released (Pass)</option>
                <option value="Quarantine">Quarantine (Investigation)</option>
                <option value="Rejected">Rejected (OOS)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Packaging Details <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("packagingDetails")}
                className="text-xs mt-1"
              />
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
                className="text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                QA Release Director <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("reviewedBy")}
                className="text-xs mt-1"
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="text-xs font-semibold text-slate-700">
              Quality Release Remarks &amp; Audit Trail Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("remarks")}
              rows={3}
              className="w-full text-xs p-2 mt-1 rounded-md border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
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
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
