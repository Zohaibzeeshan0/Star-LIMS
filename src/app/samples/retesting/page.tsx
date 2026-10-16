"use client";

import React, { useState } from "react";
import { MOCK_RETEST_SAMPLES, getRetestUrgency } from "@/lib/mock-data/retesting-samples";
import { RetestSample, RetestStatus } from "@/lib/types/retesting";
import { RetestTable } from "@/components/retesting/RetestTable";
import { AddRetestSampleModal } from "@/components/retesting/AddRetestSampleModal";
import { EditRetestSampleModal } from "@/components/retesting/EditRetestSampleModal";
import { ViewRetestModal } from "@/components/retesting/ViewRetestModal";
import { RetestConfirmDialog } from "@/components/retesting/RetestConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Calendar,
  Activity,
  Layers,
  FlaskConical
} from "lucide-react";

export default function RawMaterialRetestingPage() {
  const [samples, setSamples] = useState<RetestSample[]>(MOCK_RETEST_SAMPLES);
  const [selectedSample, setSelectedSample] = useState<RetestSample | null>(null);

  // Modal Visibility States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Status Change Request State
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    sample: RetestSample;
    newStatus: RetestStatus;
  } | null>(null);

  // Feedback Notification Banner
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 5000);
  };

  // Add Handler (Add Retest Schedule)
  const handleAddSample = (newSample: RetestSample) => {
    setSamples((prev) => [newSample, ...prev]);
    showNotification(`Retest schedule for ${newSample.id} (${newSample.materialName}) created successfully!`);
  };

  // Edit Handler
  const handleUpdateSample = (updatedSample: RetestSample) => {
    setSamples((prev) =>
      prev.map((s) => (s.id === updatedSample.id ? updatedSample : s))
    );
    showNotification(`Retest schedule ${updatedSample.id} updated successfully.`);
  };

  // Status Change Confirmation Trigger
  const handleRequestStatusChange = (
    sample: RetestSample,
    newStatus: RetestStatus
  ) => {
    setPendingStatusChange({ sample, newStatus });
    setConfirmDialogOpen(true);
  };

  // Confirm Status Change
  const handleConfirmStatusChange = () => {
    if (!pendingStatusChange) return;

    const { sample, newStatus } = pendingStatusChange;
    let extensionDate = sample.extendedRetestDate;
    let months = sample.extensionMonthsGranted || 12;

    if (newStatus === "Completed" && !extensionDate) {
      // Calculate +12 or +24 months extension from next retest due date
      const d = new Date(sample.nextRetestDueDate);
      d.setMonth(d.getMonth() + months);
      extensionDate = d.toISOString().slice(0, 10);
    }

    const updated: RetestSample = {
      ...sample,
      status: newStatus,
      extendedRetestDate: extensionDate,
      qaDispositionDate: newStatus === "Completed" ? new Date().toISOString().slice(0, 10) : sample.qaDispositionDate,
      updatedAt: new Date().toISOString(),
      remarks:
        newStatus === "Completed"
          ? `${sample.remarks} • Retest PASSED. Shelf-life extension authorized until ${extensionDate} (+${months} Mo).`
          : newStatus === "Rejected"
          ? `${sample.remarks} • REJECTED / OOS: Degradation exceeds pharmacopeial limit. Locked in quarantine for disposal.`
          : newStatus === "Quarantine"
          ? `${sample.remarks} • Placed in QA Quarantine hold pending laboratory investigation.`
          : sample.remarks,
    };

    setSamples((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setConfirmDialogOpen(false);
    setPendingStatusChange(null);
    showNotification(`Status for lot ${sample.batchNumber} updated to "${newStatus}".`);
  };

  // Retest Dashboard Mock Counts (Exact user requirement: Due Soon, Overdue, Scheduled, In Progress, and Completed)
  const total = samples.length;
  const dueSoon = samples.filter((s) => s.status === "Due Soon").length;
  const overdue = samples.filter((s) => s.status === "Overdue").length;
  const scheduled = samples.filter((s) => s.status === "Scheduled").length;
  const inProgress = samples.filter((s) => s.status === "In Progress").length;
  const completed = samples.filter((s) => s.status === "Completed").length;

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <span className="text-xs font-bold text-teal-pharma uppercase tracking-wider">
            Phase 5 Module • Active Ingredients &amp; Excipients Surveillance (ICH Q7 §7.5)
          </span>
          <h1 className="font-heading text-2xl font-black text-pharma-blue flex items-center gap-2 mt-0.5">
            <RotateCcw className="h-6 w-6 text-teal-pharma" />
            Raw Material Retesting Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Surveillance re-assays, potency stability tracking, Karl Fischer moisture monitoring, and QA authorization for warehouse shelf-life extension.
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
            Add Retest Schedule
          </Button>
        </div>
      </div>

      {/* Critical Overdue Warning Banner */}
      {overdue > 0 && (
        <div className="rounded-xl border border-red-300 bg-red-50/90 p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-900">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2 text-red-600 shrink-0">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-xs">
                CRITICAL SURVEILLANCE ALERT: {overdue} Raw Material Lot{overdue > 1 ? "s are" : " is"} Overdue for Retest!
              </div>
              <div className="text-[11px] text-red-700 mt-0.5">
                ICH Q7 &amp; Citi Pharma SOP-QC-075 mandate immediate warehouse dispensing lock. Immediate re-assay or QA disposition required.
              </div>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              const overdueSample = samples.find(
                (s) => s.status === "Overdue"
              );
              if (overdueSample) {
                setSelectedSample(overdueSample);
                setViewModalOpen(true);
              }
            }}
            className="text-xs font-bold shrink-0 shadow-xs"
          >
            Inspect Overdue Lot
          </Button>
        </div>
      )}

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

      {/* Retest Dashboard KPI Cards (Exact user requirements: Due Soon, Overdue, Scheduled, In Progress, Completed) */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3.5">
        {/* Total Surveillance */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-pharma-blue">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Lots</span>
          <div className="font-heading text-2xl font-black text-pharma-blue mt-0.5">{total}</div>
          <span className="text-[10px] text-slate-400 font-medium">In Retest Program</span>
        </div>

        {/* Due Soon */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-amber-500">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Due Soon</span>
          <div className="font-heading text-2xl font-black text-amber-800 mt-0.5">{dueSoon}</div>
          <span className="text-[10px] text-amber-700 font-medium">Due in &le;30 Days</span>
        </div>

        {/* Overdue */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-red-500">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">Overdue</span>
          <div className="font-heading text-2xl font-black text-red-700 mt-0.5">{overdue}</div>
          <span className="text-[10px] text-red-600 font-medium">Critical Hold / Expired</span>
        </div>

        {/* Scheduled */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-blue-500">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Scheduled</span>
          <div className="font-heading text-2xl font-black text-blue-700 mt-0.5">{scheduled}</div>
          <span className="text-[10px] text-blue-600 font-medium">Valid Surveillance</span>
        </div>

        {/* In Progress */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-purple-500">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">In Progress</span>
          <div className="font-heading text-2xl font-black text-purple-700 mt-0.5">{inProgress}</div>
          <span className="text-[10px] text-purple-600 font-medium">Assays Active in QC</span>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-teal-pharma col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-pharma-dark">Completed</span>
          <div className="font-heading text-2xl font-black text-teal-pharma-dark mt-0.5">{completed}</div>
          <span className="text-[10px] text-teal-pharma-dark font-medium">Shelf-Life Extended</span>
        </div>
      </div>

      {/* Main Interactive Retest Table */}
      <RetestTable
        samples={samples}
        onView={(sample) => {
          setSelectedSample(sample);
          setViewModalOpen(true);
        }}
        onEdit={(sample) => {
          setSelectedSample(sample);
          setEditModalOpen(true);
        }}
        onInitiateRetest={(sample) => {
          setSelectedSample(sample);
          setEditModalOpen(true);
        }}
        onAddNew={() => setAddModalOpen(true)}
        onRequestStatusChange={handleRequestStatusChange}
      />

      {/* Add Retest Schedule Modal Dialog */}
      <AddRetestSampleModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddSample={handleAddSample}
      />

      {/* View Retest Details Modal Dialog (includes previous retest history & mock timeline) */}
      <ViewRetestModal
        sample={selectedSample}
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        onEdit={(sample) => {
          setSelectedSample(sample);
          setEditModalOpen(true);
        }}
      />

      {/* Edit Retest Schedule Modal Dialog */}
      <EditRetestSampleModal
        sample={selectedSample}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdateSample={handleUpdateSample}
      />

      {/* Confirmation Dialog for Status Transitions */}
      {pendingStatusChange && (
        <RetestConfirmDialog
          open={confirmDialogOpen}
          title={`Confirm Retest Disposition: ${pendingStatusChange.newStatus}`}
          description={`Are you sure you want to change the surveillance status of lot "${pendingStatusChange.sample.batchNumber}" (${pendingStatusChange.sample.materialName}) to "${pendingStatusChange.newStatus}"? This disposition is logged under 21 CFR Part 11 audit trails.`}
          confirmLabel={
            pendingStatusChange.newStatus === "Completed"
              ? "Authorize Extension (+12 Mo)"
              : `Confirm as ${pendingStatusChange.newStatus}`
          }
          variant={
            pendingStatusChange.newStatus === "Completed"
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
