"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sampleRegistrationSchema,
  SampleRegistrationFormValues
} from "@/lib/validations/sample-schema";
import { MOCK_SAMPLES } from "@/lib/mock-data/samples";
import { SampleRecord } from "@/lib/types/sample";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  FlaskConical,
  ArrowRight
} from "lucide-react";

const AVAILABLE_TESTS = [
  { name: "Assay (% Label Claim by HPLC / GC)", spec: "98.0 - 102.0 %" },
  { name: "Dissolution Rate Profile (USP II)", spec: "Q ≥ 80.0 % at 30 min" },
  { name: "Water Content by Karl Fischer", spec: "NMT 5.0 %" },
  { name: "Chromatographic Related Substances", spec: "Individual NMT 0.2%, Total NMT 1.0%" },
  { name: "Uniformity of Dosage Units", spec: "Acceptance Value AV ≤ 15.0" },
  { name: "Disintegration Time", spec: "NMT 15 minutes" },
  { name: "Sterility & Bioburden (LAL/Membrane)", spec: "Sterile (No microbial growth 14d)" },
  { name: "Packaging Heat Seal & Burst Strength", spec: "Burst ≥ 45 N, Zero pinholes" }
];

export default function RegisterSamplePage() {
  const router = useRouter();
  const [successSample, setSuccessSample] = useState<SampleRecord | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<SampleRegistrationFormValues>({
    resolver: zodResolver(sampleRegistrationSchema),
    defaultValues: {
      category: "Product Sample (Finished)",
      pharmacopeia: "BP 2026",
      priority: "Normal",
      storageCondition: "Room Temp (15-25°C)",
      analyst: "Dr. Ayesha Khan",
      selectedTests: ["Assay (% Label Claim by HPLC / GC)", "Dissolution Rate Profile (USP II)"],
      targetSpecification: "Per British Pharmacopoeia (BP 2026) monograph requirements",
      mfgDate: new Date().toISOString().slice(0, 10),
      expDate: "2029-10-31"
    }
  });

  const selectedTests = watch("selectedTests") || [];

  const handleTestToggle = (testName: string) => {
    if (selectedTests.includes(testName)) {
      setValue(
        "selectedTests",
        selectedTests.filter((t) => t !== testName)
      );
    } else {
      setValue("selectedTests", [...selectedTests, testName]);
    }
  };

  const onSubmit = async (data: SampleRegistrationFormValues) => {
    // Generate new LIMS ID
    const sampleId = `CP-REG-2026-${String(Math.floor(Math.random() * 8999 + 1000))}`;

    const newRecord: SampleRecord = {
      id: sampleId,
      batchNumber: data.batchNumber.toUpperCase(),
      productName: data.productName,
      category: data.category,
      pharmacopeia: data.pharmacopeia,
      mfgDate: data.mfgDate,
      expDate: data.expDate,
      retestDate: data.retestDate,
      batchSize: data.batchSize,
      sampleQuantity: data.sampleQuantity,
      storageCondition: data.storageCondition,
      priority: data.priority,
      analyst: data.analyst,
      analystDepartment: "QC Department",
      receivedDate: new Date().toISOString().slice(0, 10),
      targetSpecification: data.targetSpecification,
      observedSummary: "Under Intake Queue • Awaiting Lab Stage",
      status: "In Testing",
      statusNotes: "Sample successfully registered into Citi Pharma Chain of Custody.",
      tests: data.selectedTests.map((tName, i) => {
        const found = AVAILABLE_TESTS.find((at) => at.name === tName);
        return {
          id: `T${i + 1}`,
          name: tName,
          specification: found ? found.spec : "Per protocol",
          observedResult: "Pending Analysis",
          passed: true
        };
      }),
      reviewedBy: "Pending QC Review",
      reviewedDate: "Pending"
    };

    // Prepend to MOCK_SAMPLES in-memory
    MOCK_SAMPLES.unshift(newRecord);
    setSuccessSample(newRecord);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-xs font-bold text-teal-pharma uppercase tracking-wider">
          Chain of Custody Intake
        </span>
        <h1 className="font-heading text-2xl font-black text-pharma-blue flex items-center gap-2 mt-0.5">
          <PlusCircle className="h-6 w-6 text-teal-pharma" />
          Sample Intake & Monograph Assignment
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Formally register new batches of packaging materials, raw materials (APIs/excipients), scheduled retest lots, or finished products.
        </p>
      </div>

      {successSample ? (
        <Card className="border-teal-pharma/40 bg-teal-pharma/5 p-8 text-center animate-in fade-in duration-300">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-pharma text-white shadow-md">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="font-heading text-xl font-bold text-pharma-blue mt-4">
            Sample Intake Successfully Verified!
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Registered with LIMS Tracking ID:{" "}
            <code className="font-mono font-bold text-teal-pharma-dark text-sm bg-white px-2 py-0.5 rounded border border-teal-pharma/20">
              {successSample.id}
            </code>
          </p>
          <div className="mt-4 p-4 rounded-lg bg-white border border-slate-200 max-w-md mx-auto text-left text-xs space-y-1">
            <div><strong>Product:</strong> {successSample.productName}</div>
            <div><strong>Batch / Lot:</strong> {successSample.batchNumber}</div>
            <div><strong>Classification:</strong> {successSample.category}</div>
            <div><strong>Pharmacopeia:</strong> {successSample.pharmacopeia}</div>
            <div><strong>Assigned Chemist:</strong> {successSample.analyst}</div>
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSuccessSample(null)}
            >
              Register Another Sample
            </Button>
            <Button
              variant="teal"
              size="sm"
              onClick={() => router.push("/samples")}
              className="gap-1 font-bold"
            >
              Go to Master Records
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <FileText className="h-4 w-4 text-teal-pharma" />
                1. Sample Identification & Classification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-pharma-blue mb-1">
                    Product / Chemical Name <span className="text-fail-red">*</span>
                  </label>
                  <Input
                    {...register("productName")}
                    placeholder="e.g. Paracetamol BP 500mg Tablets or Alu-Alu Blister Foil"
                    className={errors.productName ? "border-fail-red" : ""}
                  />
                  {errors.productName && (
                    <span className="text-[11px] text-fail-red mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.productName.message}
                    </span>
                  )}
                </div>

                {/* Batch / Lot Number */}
                <div>
                  <label className="block text-xs font-bold text-pharma-blue mb-1">
                    Batch / Lot Number <span className="text-fail-red">*</span>
                  </label>
                  <Input
                    {...register("batchNumber")}
                    placeholder="e.g. PAR-500-B295"
                    className={`font-mono ${errors.batchNumber ? "border-fail-red" : ""}`}
                  />
                  {errors.batchNumber && (
                    <span className="text-[11px] text-fail-red mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.batchNumber.message}
                    </span>
                  )}
                </div>

                {/* Classification Stream */}
                <div>
                  <label className="block text-xs font-bold text-pharma-blue mb-1">
                    Sample Stream Classification <span className="text-fail-red">*</span>
                  </label>
                  <select
                    {...register("category")}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold shadow-2xs focus:border-pharma-blue focus:outline-none"
                  >
                    <option value="Packaging Material">Packaging Material</option>
                    <option value="Raw Material (API)">Raw Material (API)</option>
                    <option value="Raw Material Retesting">Raw Material Retesting</option>
                    <option value="Product Sample (Finished)">Product Sample (Finished)</option>
                    <option value="Product Sample (In-Process)">Product Sample (In-Process / IPQC)</option>
                    <option value="Product Sample (Stability)">Product Sample (Stability)</option>
                    <option value="Sterile Injectable">Sterile Injectable</option>
                  </select>
                </div>

                {/* Batch Size */}
                <div>
                  <label className="block text-xs font-bold text-pharma-blue mb-1">
                    Total Batch Size <span className="text-fail-red">*</span>
                  </label>
                  <Input
                    {...register("batchSize")}
                    placeholder="e.g. 500,000 Tablets / 250 kg / 50 Rolls"
                  />
                  {errors.batchSize && (
                    <span className="text-[11px] text-fail-red mt-1">
                      {errors.batchSize.message}
                    </span>
                  )}
                </div>

                {/* Sample Quantity */}
                <div>
                  <label className="block text-xs font-bold text-pharma-blue mb-1">
                    Quantity Sampled for QC <span className="text-fail-red">*</span>
                  </label>
                  <Input
                    {...register("sampleQuantity")}
                    placeholder="e.g. 100 Tablets / 150 grams / 5 Rolls"
                  />
                  {errors.sampleQuantity && (
                    <span className="text-[11px] text-fail-red mt-1">
                      {errors.sampleQuantity.message}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <ShieldCheck className="h-4 w-4 text-teal-pharma" />
                2. Pharmacopeial Protocol & Analytical Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Pharmacopeia */}
                <div>
                  <label className="block text-xs font-bold text-pharma-blue mb-1">
                    Monograph Protocol <span className="text-fail-red">*</span>
                  </label>
                  <select
                    {...register("pharmacopeia")}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold shadow-2xs focus:border-pharma-blue focus:outline-none"
                  >
                    <option value="BP 2026">BP 2026 (British Pharmacopoeia)</option>
                    <option value="USP 48-NF 43">USP 48-NF 43 (United States Pharmacopeia)</option>
                    <option value="Ph. Eur. 11.0">Ph. Eur. 11.0 (European Pharmacopoeia)</option>
                    <option value="In-House Validated">In-House Validated Standard</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-bold text-pharma-blue mb-1">
                    Testing Priority
                  </label>
                  <select
                    {...register("priority")}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold shadow-2xs focus:border-pharma-blue focus:outline-none"
                  >
                    <option value="Normal">Normal Turnaround (48-72h)</option>
                    <option value="Urgent">Urgent (Stat Release)</option>
                    <option value="Immediate Release">Immediate Release (Parenteral/WFI)</option>
                  </select>
                </div>

                {/* Assigned Analyst */}
                <div>
                  <label className="block text-xs font-bold text-pharma-blue mb-1">
                    Assigned Chemist <span className="text-fail-red">*</span>
                  </label>
                  <select
                    {...register("analyst")}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold shadow-2xs focus:border-pharma-blue focus:outline-none"
                  >
                    <option value="Dr. Ayesha Khan">Dr. Ayesha Khan (QC Lead Chemist)</option>
                    <option value="Zubair Ahmed">Zubair Ahmed (Instrumental HPLC/GC)</option>
                    <option value="Sana Rizvi">Sana Rizvi (Dissolution & Solid Orals)</option>
                    <option value="M. Bilal Tariq">M. Bilal Tariq (Microbiology & Sterility)</option>
                    <option value="Hamza Shafiq">Hamza Shafiq (Packaging & Utilities)</option>
                  </select>
                </div>

                {/* Mfg Date */}
                <div>
                  <label className="block text-xs font-bold text-pharma-blue mb-1">
                    Manufacturing Date <span className="text-fail-red">*</span>
                  </label>
                  <Input type="date" {...register("mfgDate")} />
                </div>

                {/* Exp Date */}
                <div>
                  <label className="block text-xs font-bold text-pharma-blue mb-1">
                    Expiry Date <span className="text-fail-red">*</span>
                  </label>
                  <Input type="date" {...register("expDate")} />
                </div>

                {/* Retest Date */}
                <div>
                  <label className="block text-xs font-bold text-pharma-blue mb-1">
                    Retest Date (If applicable)
                  </label>
                  <Input type="date" {...register("retestDate")} />
                </div>

                {/* Storage Condition */}
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-pharma-blue mb-1">
                    Storage Requirement
                  </label>
                  <Input
                    {...register("storageCondition")}
                    placeholder="e.g. Room Temp (15-25°C), Cold Storage (2-8°C), or Stability Chamber (40°C/75% RH)"
                  />
                </div>

                {/* Target Spec */}
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-pharma-blue mb-1">
                    Target Monograph Specification Summary
                  </label>
                  <Input
                    {...register("targetSpecification")}
                    placeholder="e.g. Assay: 98.0% - 102.0% | Dissolution: ≥ 80% at 30 min | Impurities ≤ 0.2%"
                  />
                </div>
              </div>

              {/* Checklist */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-pharma-blue mb-2">
                  Select Required Analytical Tests ({selectedTests.length} Selected)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AVAILABLE_TESTS.map((test) => {
                    const isChecked = selectedTests.includes(test.name);
                    return (
                      <div
                        key={test.name}
                        onClick={() => handleTestToggle(test.name)}
                        className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer select-none transition-all ${
                          isChecked
                            ? "bg-teal-pharma/5 border-teal-pharma/40"
                            : "bg-slate-50 border-slate-200/80 hover:bg-slate-100/60"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by div
                          className="mt-0.5 rounded accent-teal-pharma h-4 w-4"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900">
                            {test.name}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">
                            Spec: {test.spec}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.selectedTests && (
                  <span className="text-[11px] text-fail-red mt-1.5 block">
                    {errors.selectedTests.message}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/samples")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="teal"
              disabled={isSubmitting}
              className="gap-2 font-bold px-6 shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4" />
              Complete Registration & Assign
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
