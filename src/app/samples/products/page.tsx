"use client";

import React, { useState } from "react";
import { MOCK_PRODUCT_SAMPLES } from "@/lib/mock-data/products";
import { ProductSample, ProductStatus } from "@/lib/types/product";
import { ProductTable } from "@/components/products/ProductTable";
import { AddProductSampleModal } from "@/components/products/AddProductSampleModal";
import { EditProductSampleModal } from "@/components/products/EditProductSampleModal";
import { ViewProductModal } from "@/components/products/ViewProductModal";
import { ProductConfirmDialog } from "@/components/products/ProductConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Pill,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Flame,
  Activity,
  ShieldCheck,
  ThermometerSnowflake,
  Factory
} from "lucide-react";

export default function ProductSamplesPage() {
  const [samples, setSamples] = useState<ProductSample[]>(MOCK_PRODUCT_SAMPLES);
  const [selectedSample, setSelectedSample] = useState<ProductSample | null>(null);

  // Modal Visibility States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Status Change Request State
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    sample: ProductSample;
    newStatus: ProductStatus;
  } | null>(null);

  // Feedback Notification Banner
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 5000);
  };

  // Add Handler
  const handleAddSample = (newSample: ProductSample) => {
    setSamples((prev) => [newSample, ...prev]);
    showNotification(`Product batch ${newSample.id} (${newSample.productName}) registered successfully!`);
  };

  // Edit Handler
  const handleUpdateSample = (updatedSample: ProductSample) => {
    setSamples((prev) =>
      prev.map((s) => (s.id === updatedSample.id ? updatedSample : s))
    );
    showNotification(`Product record ${updatedSample.id} updated successfully.`);
  };

  // Status Change Confirmation Trigger
  const handleRequestStatusChange = (
    sample: ProductSample,
    newStatus: ProductStatus
  ) => {
    setPendingStatusChange({ sample, newStatus });
    setConfirmDialogOpen(true);
  };

  // Confirm Status Change
  const handleConfirmStatusChange = () => {
    if (!pendingStatusChange) return;

    const { sample, newStatus } = pendingStatusChange;
    const updated: ProductSample = {
      ...sample,
      status: newStatus,
      qaReleaseDate: newStatus === "Released" ? new Date().toISOString().slice(0, 10) : sample.qaReleaseDate,
      updatedAt: new Date().toISOString(),
      remarks:
        newStatus === "Released"
          ? `${sample.remarks} • Released by QA for commercial distribution on ${new Date().toISOString().slice(0, 10)}.`
          : newStatus === "Rejected"
          ? `${sample.remarks} • REJECTED: Failed finished product release monograph. Scrapped under OOS deviation.`
          : newStatus === "Quarantine"
          ? `${sample.remarks} • Placed on QA Quarantine hold for investigation.`
          : sample.remarks,
    };

    setSamples((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setConfirmDialogOpen(false);
    setPendingStatusChange(null);
    showNotification(`Status for lot ${sample.batchNumber} updated to "${newStatus}".`);
  };

  // Metrics
  const total = samples.length;
  const released = samples.filter((s) => s.status === "Released").length;
  const underTesting = samples.filter((s) => s.status === "Under Testing").length;
  const ipqcCount = samples.filter((s) => s.stage === "In-Process Quality Control (IPQC)").length;
  const stabilityCount = samples.filter((s) => s.stage.includes("Stability")).length;
  const quarantineOrRejected = samples.filter(
    (s) => s.status === "Quarantine" || s.status === "Rejected"
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <span className="text-xs font-bold text-teal-pharma uppercase tracking-wider">
            Phase 6 Module • Finished Dosage Forms, IPQC & Stability Surveillance
          </span>
          <h1 className="font-heading text-2xl font-black text-pharma-blue flex items-center gap-2 mt-0.5">
            <Pill className="h-6 w-6 text-teal-pharma" />
            Product Samples & Stability Testing Program
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Commercial batch release testing, In-Process Quality Controls (IPQC), ICH climatic chamber pulls (40°C/75% RH &amp; 25°C/60% RH), and sterile parenterals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="teal"
            size="sm"
            onClick={() => setAddModalOpen(true)}
            className="gap-1.5 font-bold shadow-xs"
          >
            <PlusCircle className="h-4 w-4" />
            Register Batch Sample
          </Button>
        </div>
      </div>

      {/* Floating Notification Alert */}
      {feedbackMessage && (
        <div className="rounded-lg border border-teal-pharma/40 bg-teal-pharma/10 p-3.5 text-xs text-teal-pharma-dark font-semibold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-teal-pharma" />
            <span>{feedbackMessage}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-teal-pharma-dark hover:opacity-75 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3.5">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-pharma-blue">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Batches</span>
          <div className="font-heading text-2xl font-black text-pharma-blue mt-0.5">{total}</div>
          <span className="text-[10px] text-slate-400 font-medium">Logged in QC streams</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-teal-pharma">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-pharma-dark">Released (Pass)</span>
          <div className="font-heading text-2xl font-black text-teal-pharma-dark mt-0.5">{released}</div>
          <span className="text-[10px] text-teal-pharma-dark font-medium">Commercial batch release</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-purple-500">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Under QC Testing</span>
          <div className="font-heading text-2xl font-black text-purple-700 mt-0.5">{underTesting}</div>
          <span className="text-[10px] text-purple-600 font-medium">Assay & Sterility active</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-indigo-500">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">IPQC Controls</span>
          <div className="font-heading text-2xl font-black text-indigo-700 mt-0.5">{ipqcCount}</div>
          <span className="text-[10px] text-indigo-600 font-medium">In-process compression/blend</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-amber-500">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Stability Pulls</span>
          <div className="font-heading text-2xl font-black text-amber-800 mt-0.5">{stabilityCount}</div>
          <span className="text-[10px] text-amber-700 font-medium">ICH 40°C &amp; 25°C chambers</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-rose-500 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">Hold / Rejected</span>
          <div className="font-heading text-2xl font-black text-rose-800 mt-0.5">{quarantineOrRejected}</div>
          <span className="text-[10px] text-rose-600 font-medium">OOS deviation open</span>
        </div>
      </div>

      {/* Main Interactive Table */}
      <ProductTable
        samples={samples}
        onView={(sample) => {
          setSelectedSample(sample);
          setViewModalOpen(true);
        }}
        onEdit={(sample) => {
          setSelectedSample(sample);
          setEditModalOpen(true);
        }}
        onAddNew={() => setAddModalOpen(true)}
        onRequestStatusChange={handleRequestStatusChange}
      />

      {/* Add New Sample Modal */}
      <AddProductSampleModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddSample={handleAddSample}
      />

      {/* View Sample Details Modal */}
      <ViewProductModal
        sample={selectedSample}
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        onEdit={(sample) => {
          setSelectedSample(sample);
          setEditModalOpen(true);
        }}
      />

      {/* Edit Sample Modal */}
      <EditProductSampleModal
        sample={selectedSample}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdateSample={handleUpdateSample}
      />

      {/* Confirmation Dialog for Status Changes */}
      {pendingStatusChange && (
        <ProductConfirmDialog
          open={confirmDialogOpen}
          title={`Confirm Batch Disposition: ${pendingStatusChange.newStatus}`}
          description={`Are you sure you want to change the QA disposition of batch "${pendingStatusChange.sample.batchNumber}" (${pendingStatusChange.sample.productName}) to "${pendingStatusChange.newStatus}"? This action will generate a formal batch release or rejection log under 21 CFR Part 11 audit trails.`}
          confirmLabel={
            pendingStatusChange.newStatus === "Released"
              ? "Authorize Commercial Release"
              : `Confirm as ${pendingStatusChange.newStatus}`
          }
          variant={
            pendingStatusChange.newStatus === "Released"
              ? "teal"
              : pendingStatusChange.newStatus === "Rejected"
              ? "danger"
              : pendingStatusChange.newStatus === "Quarantine"
              ? "warning"
              : "default"
          }
          onConfirm={handleConfirmStatusChange}
          onCancel={() => {
            setConfirmDialogOpen(false);
            setPendingStatusChange(null);
          }}
        />
      )}
    </div>
  );
}
