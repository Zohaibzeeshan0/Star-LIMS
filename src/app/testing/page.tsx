"use client";

import React, { useState } from "react";
import { MOCK_TEST_WORKLIST } from "@/lib/mock-data/testing-worklist";
import { TestWorklistItem, TestStatus } from "@/lib/types/testing";
import { TestWorklistTable } from "@/components/testing/TestWorklistTable";
import { TestDetailModal } from "@/components/testing/TestDetailModal";
import { ResultEntryModal } from "@/components/testing/ResultEntryModal";
import { TestReviewModal } from "@/components/testing/TestReviewModal";
import { TestConfirmDialog } from "@/components/testing/TestConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  FlaskConical,
  Clock,
  Activity,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Check
} from "lucide-react";

export default function TestingWorklistPage() {
  const [tests, setTests] = useState<TestWorklistItem[]>(MOCK_TEST_WORKLIST);
  const [selectedTest, setSelectedTest] = useState<TestWorklistItem | null>(null);

  // Modal Visibility States
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [resultEntryModalOpen, setResultEntryModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Pending Confirmation Action State
  const [pendingConfirmAction, setPendingConfirmAction] = useState<{
    title: string;
    description: string;
    variant: "danger" | "teal" | "warning" | "default";
    action: () => void;
  } | null>(null);

  // Feedback Notification Banner
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 6000);
  };

  // Handlers
  const handleView = (test: TestWorklistItem) => {
    setSelectedTest(test);
    setDetailModalOpen(true);
  };

  const handleEnterResults = (test: TestWorklistItem) => {
    setSelectedTest(test);
    setResultEntryModalOpen(true);
  };

  const handleReview = (test: TestWorklistItem) => {
    setSelectedTest(test);
    setReviewModalOpen(true);
  };

  const handleSaveResults = (updatedTest: TestWorklistItem) => {
    setTests((prev) =>
      prev.map((t) => (t.id === updatedTest.id ? updatedTest : t))
    );
    setSelectedTest(updatedTest);

    if (updatedTest.isOOS || updatedTest.status === "Out of Specification") {
      showNotification(
        `🚨 WARNING: Out of Specification (OOS) recorded for ${updatedTest.id} (${updatedTest.materialOrProduct}). Phase I investigation logged.`
      );
    } else {
      showNotification(
        `✅ Analytical results for ${updatedTest.id} (${updatedTest.testType}) saved. Status updated to "${updatedTest.status}".`
      );
    }
  };

  const handleSaveReview = (reviewedTest: TestWorklistItem) => {
    setTests((prev) =>
      prev.map((t) => (t.id === reviewedTest.id ? reviewedTest : t))
    );
    setSelectedTest(reviewedTest);

    if (reviewedTest.status === "Reviewed") {
      showNotification(
        `✨ Test dossier ${reviewedTest.id} QA-verified and signed by ${reviewedTest.reviewedBy}. Monograph criteria satisfied.`
      );
    } else if (reviewedTest.status === "Out of Specification") {
      showNotification(
        `⚠️ Test dossier ${reviewedTest.id} flagged as Out of Specification by QA. QA deviation notice generated.`
      );
    } else {
      showNotification(
        `QC dossier ${reviewedTest.id} status updated to "${reviewedTest.status}".`
      );
    }
  };

  // Status Metrics Calculations
  const totalCount = tests.length;
  const notStartedCount = tests.filter((t) => t.status === "Not Started").length;
  const inProgressCount = tests.filter((t) => t.status === "In Progress").length;
  const pendingReviewCount = tests.filter((t) => t.status === "Pending Review").length;
  const reviewedCount = tests.filter((t) => t.status === "Reviewed").length;
  const oosCount = tests.filter((t) => t.status === "Out of Specification" || t.isOOS).length;

  const oosTests = tests.filter((t) => t.status === "Out of Specification" || t.isOOS);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Banner */}
      {feedbackMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#123B63] text-white px-4 py-3 rounded-xl shadow-2xl border border-white/20 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed flex-1">
              <span className="font-bold block text-teal-200">21 CFR Part 11 GLP Event Logged</span>
              <span>{feedbackMessage}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-white/60 hover:text-white text-xs font-bold ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#123B63] via-[#1A4B7C] to-[#123B63] -mx-4 -mt-4 sm:-mx-8 sm:-mt-8 p-6 sm:p-8 text-white shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest bg-teal-500/20 text-teal-300 border border-teal-400/30">
                Phase 7 Core Laboratory Module
              </span>
              <span className="text-[11px] text-white/60">
                • cGMP &amp; GLP Monograph Verification
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <FlaskConical className="h-7 w-7 text-teal-400" />
              Laboratory Testing &amp; QC Results
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed">
              Analytical test worklist assignment, multi-parameter result entry (numeric limits, text, and selectable criteria), real-time Out of Specification (OOS) detection, and QA review sign-off.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 text-right">
              <span className="text-[10px] uppercase font-bold text-teal-300 block">
                Active Test Dossiers
              </span>
              <span className="font-mono text-xl font-black text-white">
                {totalCount} Tests
              </span>
            </div>
          </div>
        </div>

        {/* Mock Data Banner */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-blue-100">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-teal-300 shrink-0" />
            <span>
              <strong>Demonstration &amp; Simulated QC Data:</strong> This frontend simulates laboratory test assignment, parameter entry, and review presentation. Does not represent actual batch release or regulatory approval.
            </span>
          </div>
          <span className="hidden sm:inline font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/80">
            DEMO QC MODE
          </span>
        </div>
      </div>

      {/* Urgent OOS Alert Banner (If Any Failures Exist) */}
      {oosCount > 0 && (
        <div className="bg-gradient-to-r from-rose-50 via-rose-100/70 to-rose-50 border-2 border-rose-400/80 p-4 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-600 text-white shrink-0 mt-0.5 animate-pulse">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="text-xs">
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-rose-950 text-sm">
                  Urgent Out of Specification (OOS) Alert ({oosCount} Incident{oosCount > 1 ? "s" : ""})
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white uppercase tracking-wider">
                  Phase I Investigation Required
                </span>
              </div>
              <p className="text-rose-900 mt-1 max-w-3xl leading-relaxed">
                The following dossiers have breached pharmacopeial release criteria:{" "}
                {oosTests.map((t, idx) => (
                  <span key={t.id} className="font-mono font-bold">
                    {t.id} ({t.materialOrProduct} - {t.testType}){idx < oosTests.length - 1 ? ", " : ""}
                  </span>
                ))}
                . Quarantine hold must remain active until QA Phase I investigation is approved.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleView(oosTests[0])}
            className="text-xs font-bold gap-1.5 shrink-0 self-start md:self-auto"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Inspect First OOS Dossier
          </Button>
        </div>
      )}

      {/* KPI Status Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Tests */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Total Tests
            </span>
            <FlaskConical className="h-4 w-4 text-pharma-blue" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-pharma-blue font-mono">
              {totalCount}
            </span>
            <span className="text-[10px] text-slate-400">assigned</span>
          </div>
        </div>

        {/* Not Started */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Not Started
            </span>
            <Clock className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-700 font-mono">
              {notStartedCount}
            </span>
            <span className="text-[10px] text-slate-400">in queue</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-purple-700 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              In Progress
            </span>
            <Activity className="h-4 w-4 text-purple-600 animate-spin" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-purple-800 font-mono">
              {inProgressCount}
            </span>
            <span className="text-[10px] text-purple-600">under testing</span>
          </div>
        </div>

        {/* Pending Review */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-amber-800 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Pending QA
            </span>
            <ShieldCheck className="h-4 w-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-900 font-mono">
              {pendingReviewCount}
            </span>
            <span className="text-[10px] text-amber-700 font-medium">ready for review</span>
          </div>
        </div>

        {/* Reviewed */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-teal-800 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              QA Reviewed
            </span>
            <FileCheck2 className="h-4 w-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-teal-800 font-mono">
              {reviewedCount}
            </span>
            <span className="text-[10px] text-teal-600">verified</span>
          </div>
        </div>

        {/* Out of Specification */}
        <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-300 shadow-2xs">
          <div className="flex items-center justify-between text-rose-800 mb-1">
            <span className="text-[11px] font-black uppercase tracking-wider">
              OOS Deviation
            </span>
            <AlertTriangle className="h-4 w-4 text-rose-600 animate-bounce" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-900 font-mono">
              {oosCount}
            </span>
            <span className="text-[10px] text-rose-700 font-bold">non-compliant</span>
          </div>
        </div>
      </div>

      {/* Main Worklist Table */}
      <TestWorklistTable
        tests={tests}
        onView={handleView}
        onEnterResults={handleEnterResults}
        onReview={handleReview}
      />

      {/* Modals */}
      <TestDetailModal
        test={selectedTest}
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onEnterResults={(test) => {
          setSelectedTest(test);
          setResultEntryModalOpen(true);
        }}
        onReview={(test) => {
          setSelectedTest(test);
          setReviewModalOpen(true);
        }}
      />

      <ResultEntryModal
        test={selectedTest}
        open={resultEntryModalOpen}
        onClose={() => setResultEntryModalOpen(false)}
        onSave={handleSaveResults}
      />

      <TestReviewModal
        test={selectedTest}
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSaveReview={handleSaveReview}
      />

      {pendingConfirmAction && (
        <TestConfirmDialog
          open={confirmDialogOpen}
          title={pendingConfirmAction.title}
          description={pendingConfirmAction.description}
          variant={pendingConfirmAction.variant}
          onConfirm={() => {
            pendingConfirmAction.action();
            setConfirmDialogOpen(false);
            setPendingConfirmAction(null);
          }}
          onCancel={() => {
            setConfirmDialogOpen(false);
            setPendingConfirmAction(null);
          }}
        />
      )}
    </div>
  );
}
