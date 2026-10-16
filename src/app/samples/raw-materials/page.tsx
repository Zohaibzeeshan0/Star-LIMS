"use client";

import React, { useState } from "react";
import { MOCK_RAW_MATERIALS } from "@/lib/mock-data/raw-materials";
import { RawMaterialSample, RawMaterialStatus } from "@/lib/types/raw-material";
import { RawMaterialTable } from "@/components/raw-materials/RawMaterialTable";
import { AddRawMaterialModal } from "@/components/raw-materials/AddRawMaterialModal";
import { EditRawMaterialModal } from "@/components/raw-materials/EditRawMaterialModal";
import { ViewRawMaterialModal } from "@/components/raw-materials/ViewRawMaterialModal";
import { RawMaterialConfirmDialog } from "@/components/raw-materials/RawMaterialConfirmDialog";
import { RawMaterialStatusBadge } from "@/components/raw-materials/RawMaterialStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Layers,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  ShieldCheck,
  FileText
} from "lucide-react";

export default function RawMaterialsPage() {
  const [samples, setSamples] = useState<RawMaterialSample[]>(MOCK_RAW_MATERIALS);
  const [selectedSample, setSelectedSample] = useState<RawMaterialSample | null>(null);

  // Modal Visibility States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Status Change Request State
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    sample: RawMaterialSample;
    newStatus: RawMaterialStatus;
  } | null>(null);

  // Feedback Notification Banner
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4500);
  };

  // Add Handler
  const handleAddSample = (newSample: RawMaterialSample) => {
    setSamples((prev) => [newSample, ...prev]);
    showNotification(`Raw material sample ${newSample.id} (${newSample.materialName}) registered successfully!`);
  };

  // Edit Handler
  const handleUpdateSample = (updatedSample: RawMaterialSample) => {
    setSamples((prev) =>
      prev.map((s) => (s.id === updatedSample.id ? updatedSample : s))
    );
    showNotification(`Raw material record ${updatedSample.id} updated successfully.`);
  };

  // Status Change Confirmation Trigger
  const handleRequestStatusChange = (
    sample: RawMaterialSample,
    newStatus: RawMaterialStatus
  ) => {
    setPendingStatusChange({ sample, newStatus });
    setConfirmDialogOpen(true);
  };

  // Confirm Status Change
  const handleConfirmStatusChange = () => {
    if (!pendingStatusChange) return;

    const { sample, newStatus } = pendingStatusChange;
    const updated: RawMaterialSample = {
      ...sample,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      remarks:
        newStatus === "Released"
          ? `${sample.remarks} • Released for dispensing staging on ${new Date().toISOString().slice(0, 10)}.`
          : newStatus === "Rejected"
          ? `${sample.remarks} • Rejected / OOS Quarantine disposition recorded.`
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
  const reviewed = samples.filter((s) => s.status === "Reviewed").length;
  const quarantine = samples.filter((s) => s.status === "Quarantine" || s.status === "Retest").length;
  const rejected = samples.filter((s) => s.status === "Rejected").length;

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <span className="text-xs font-bold text-teal-pharma uppercase tracking-wider">
            Phase 4 Module • Active Ingredients, Excipients & Solvents
          </span>
          <h1 className="font-heading text-2xl font-black text-pharma-blue flex items-center gap-2 mt-0.5">
            <Layers className="h-6 w-6 text-teal-pharma" />
            Raw Material Sample Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Consignment intake, potency assays, chromatographic purity, Karl Fischer moisture content, and GMP release for production dispensing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="teal"
            size="sm"
            onClick={() => setAddModalOpen(true)}
            className="gap-1.5 font-bold shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Register Raw Material
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

      {/* Raw Material Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3.5">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-pharma-blue">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Raw Materials</span>
          <div className="font-heading text-2xl font-black text-pharma-blue mt-0.5">{total}</div>
          <span className="text-[10px] text-slate-400 font-medium">Logged in QC queue</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-teal-pharma">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-pharma-dark">Released (Pass)</span>
          <div className="font-heading text-2xl font-black text-teal-pharma-dark mt-0.5">{released}</div>
          <span className="text-[10px] text-teal-pharma-dark font-medium">Cleared for dispensing</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-purple-500">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Under Testing</span>
          <div className="font-heading text-2xl font-black text-purple-700 mt-0.5">{underTesting}</div>
          <span className="text-[10px] text-slate-400 font-medium">HPLC / GC running</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-sky-500">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800">Reviewed</span>
          <div className="font-heading text-2xl font-black text-sky-800 mt-0.5">{reviewed}</div>
          <span className="text-[10px] text-slate-400 font-medium">Awaiting QA sign-off</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-warning-amber">
          <span className="text-[10px] font-bold uppercase tracking-wider text-warning-amber-dark">Quarantine / Retest</span>
          <div className="font-heading text-2xl font-black text-warning-amber-dark mt-0.5">{quarantine}</div>
          <span className="text-[10px] text-slate-400 font-medium">Hold / Re-assay</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-fail-red col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-fail-red-dark">Rejected (OOS)</span>
          <div className="font-heading text-2xl font-black text-fail-red-dark mt-0.5">{rejected}</div>
          <span className="text-[10px] text-fail-red font-medium">OOS deviation open</span>
        </div>
      </div>

      {/* Main Interactive Table */}
      <RawMaterialTable
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
      <AddRawMaterialModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddSample={handleAddSample}
      />

      {/* View Sample Details Modal */}
      <ViewRawMaterialModal
        sample={selectedSample}
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        onEdit={(sample) => {
          setSelectedSample(sample);
          setEditModalOpen(true);
        }}
      />

      {/* Edit Sample Modal */}
      <EditRawMaterialModal
        sample={selectedSample}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdateSample={handleUpdateSample}
      />

      {/* Confirmation Dialog for Status Changes */}
      {pendingStatusChange && (
        <RawMaterialConfirmDialog
          open={confirmDialogOpen}
          title={`Confirm Status Disposition: ${pendingStatusChange.newStatus}`}
          description={`Are you sure you want to change the disposition status of lot "${pendingStatusChange.sample.batchNumber}" (${pendingStatusChange.sample.materialName}) to "${pendingStatusChange.newStatus}"? This action will be recorded under 21 CFR Part 11 audit trails.`}
          confirmLabel={`Confirm as ${pendingStatusChange.newStatus}`}
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
