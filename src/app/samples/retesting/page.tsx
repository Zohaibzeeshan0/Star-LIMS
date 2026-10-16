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
  ShieldAlert,
  Activity,
  Layers,
  FileCheck
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

  // Add Handler
  const handleAddSample = (newSample: RetestSample) => {
    setSamples((prev) => [newSample, ...prev]);
    showNotification(`Retest surveillance order ${newSample.id} (${newSample.materialName}) scheduled successfully!`);
  };

  // Edit Handler
  const handleUpdateSample = (updatedSample: RetestSample) => {
    setSamples((prev) =>
      prev.map((s) => (s.id === updatedSample.id ? updatedSample : s))
    );
    showNotification(`Retest record ${updatedSample.id} updated successfully.`);
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

    if (newStatus === "Extended / Passed" && !extensionDate) {
      // Calculate +12 or +24 months extension from current retest date
      const d = new Date(sample.currentRetestDate);
      d.setMonth(d.getMonth() + months);
      extensionDate = d.toISOString().slice(0, 10);
    }

    const updated: RetestSample = {
      ...sample,
      status: newStatus,
      extendedRetestDate: extensionDate,
      qaDispositionDate: newStatus === "Extended / Passed" ? new Date().toISOString().slice(0, 10) : sample.qaDispositionDate,
      updatedAt: new Date().toISOString(),
      remarks:
        newStatus === "Extended / Passed"
          ? `${sample.remarks} • Retest PASSED. Shelf-life extension authorized until ${extensionDate} (+${months} Mo).`
          : newStatus === "Rejected / OOS"
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

  // Metrics
  const total = samples.length;
  const extended = samples.filter((s) => s.status === "Extended / Passed").length;
  const overdue = samples.filter((s) => {
    const { urgency } = getRetestUrgency(s);
    return urgency === "OVERDUE";
  }).length;
  const dueSoon = samples.filter((s) => {
    const { urgency } = getRetestUrgency(s);
    return urgency === "URGENT_30";
  }).length;
  const underTesting = samples.filter((s) => s.status === "Under Testing").length;
  const rejected = samples.filter((s) => s.status === "Rejected / OOS").length;

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <span className="text-xs font-bold text-teal-pharma uppercase tracking-wider">
            Phase 5 Module • Active Ingredients & Excipients Surveillance (ICH Q7 §7.5)
          </span>
          <h1 className="font-heading text-2xl font-black text-pharma-blue flex items-center gap-2 mt-0.5">
            <RotateCcw className="h-6 w-6 text-teal-pharma" />
            Raw Material Retesting & Shelf-Life Extension Program
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Surveillance re-assays, potency stability tracking, Karl Fischer moisture pickup, degradation checks, and QA authorization for warehouse shelf-life extension.
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
            Schedule Retest Order
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
                ICH Q7 & Citi Pharma SOP-QC-075 mandate immediate warehouse dispensing lock. Immediate re-assay or QA disposition required.
              </div>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              const overdueSample = samples.find(
                (s) => getRetestUrgency(s).urgency === "OVERDUE"
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

      {/* Retest Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3.5">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-pharma-blue">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Surveillance</span>
          <div className="font-heading text-2xl font-black text-pharma-blue mt-0.5">{total}</div>
          <span className="text-[10px] text-slate-400 font-medium">Lots in retest program</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-teal-pharma">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-pharma-dark">Extended & Valid</span>
          <div className="font-heading text-2xl font-black text-teal-pharma-dark mt-0.5">{extended}</div>
          <span className="text-[10px] text-teal-pharma-dark font-medium">+12 to 24 Mo granted</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-amber-500">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Due Soon (&le;30d)</span>
          <div className="font-heading text-2xl font-black text-amber-800 mt-0.5">{dueSoon}</div>
          <span className="text-[10px] text-amber-700 font-medium">Sampling requisition open</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-red-500">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">Overdue (Critical)</span>
          <div className="font-heading text-2xl font-black text-red-700 mt-0.5">{overdue}</div>
          <span className="text-[10px] text-red-600 font-medium">Dispensing locked</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-purple-500">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Under Testing</span>
          <div className="font-heading text-2xl font-black text-purple-700 mt-0.5">{underTesting}</div>
          <span className="text-[10px] text-purple-600 font-medium">HPLC / KF running</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs border-l-4 border-l-rose-500 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">Rejected / OOS</span>
          <div className="font-heading text-2xl font-black text-rose-800 mt-0.5">{rejected}</div>
          <span className="text-[10px] text-rose-600 font-medium">Degradation / Disposal</span>
        </div>
      </div>

      {/* Main Interactive Table */}
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

      {/* Add New Retest Order Modal */}
      <AddRetestSampleModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddSample={handleAddSample}
      />

      {/* View Sample Details Modal */}
      <ViewRetestModal
        sample={selectedSample}
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        onEdit={(sample) => {
          setSelectedSample(sample);
          setEditModalOpen(true);
        }}
      />

      {/* Edit Sample Modal */}
      <EditRetestSampleModal
        sample={selectedSample}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdateSample={handleUpdateSample}
      />

      {/* Confirmation Dialog for Status Changes */}
      {pendingStatusChange && (
        <RetestConfirmDialog
          open={confirmDialogOpen}
          title={`Confirm Surveillance Disposition: ${pendingStatusChange.newStatus}`}
          description={`Are you sure you want to change the surveillance disposition of lot "${pendingStatusChange.sample.batchNumber}" (${pendingStatusChange.sample.materialName}) to "${pendingStatusChange.newStatus}"? If approving extension, an additional +12 to +24 months shelf-life will be recorded under 21 CFR Part 11 audit trails.`}
          confirmLabel={
            pendingStatusChange.newStatus === "Extended / Passed"
              ? "Authorize Extension (+12 Mo)"
              : `Confirm as ${pendingStatusChange.newStatus}`
          }
          variant={
            pendingStatusChange.newStatus === "Extended / Passed"
              ? "teal"
              : pendingStatusChange.newStatus === "Rejected / OOS"
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
