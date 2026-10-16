"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MOCK_SAMPLES } from "@/lib/mock-data/samples";
import { SampleRecord } from "@/lib/types/sample";
import { KPICards } from "@/components/dashboard/KPICards";
import { ThroughputChart } from "@/components/dashboard/ThroughputChart";
import { DispositionChart } from "@/components/dashboard/DispositionChart";
import { UrgentAlerts } from "@/components/dashboard/UrgentAlerts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SampleDetailModal } from "@/components/samples/SampleDetailModal";
import { ResultEntryModal } from "@/components/samples/ResultEntryModal";
import {
  ShieldCheck,
  BarChart3,
  PieChart as PieIcon,
  AlertTriangle,
  ArrowRight,
  Package,
  Layers,
  RotateCcw,
  Pill,
  CheckCircle2
} from "lucide-react";

export default function DashboardPage() {
  const [samples, setSamples] = useState<SampleRecord[]>(MOCK_SAMPLES);
  const [selectedSample, setSelectedSample] = useState<SampleRecord | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  const handleViewDetail = (sample: SampleRecord) => {
    setSelectedSample(sample);
    setDetailModalOpen(true);
  };

  const handleUpdateResults = (updatedSample: SampleRecord) => {
    setSamples((prev) =>
      prev.map((s) => (s.id === updatedSample.id ? updatedSample : s))
    );
  };

  return (
    <div className="space-y-6">
      {/* Compliance Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pharma-blue via-[#174E7E] to-teal-pharma p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-teal-300 font-bold text-xs uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4" />
            <span>WHO & US FDA cGMP Certified Laboratory Information System</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
            Citi Pharma Analytical Quality Control
          </h1>
          <p className="mt-2 text-sky-100 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Integrated testing governance for packaging materials, raw materials (APIs/excipients), scheduled retesting intervals, and finished drug release.
          </p>

          {/* Quick Stream Badges */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Link href="/samples/packaging">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 transition-colors font-semibold text-white">
                <Package className="h-3.5 w-3.5" />
                Packaging Materials (3)
              </span>
            </Link>
            <Link href="/samples/raw-materials">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 transition-colors font-semibold text-white">
                <Layers className="h-3.5 w-3.5" />
                Raw Materials (3)
              </span>
            </Link>
            <Link href="/samples/retesting">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 transition-colors font-semibold text-amber-200">
                <RotateCcw className="h-3.5 w-3.5" />
                Retesting Protocol (3)
              </span>
            </Link>
            <Link href="/samples/products">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 transition-colors font-semibold text-white">
                <Pill className="h-3.5 w-3.5" />
                Product Samples (5)
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <KPICards samples={samples} />

      {/* Main Charts & Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Weekly Throughput & Urgent Stream (2 Cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Throughput Recharts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">
                <BarChart3 className="h-4 w-4 text-teal-pharma" />
                Weekly Batch Testing Throughput
              </CardTitle>
              <span className="text-xs text-slate-500 font-semibold">
                Last 7 Days (Volume: 153 Assays)
              </span>
            </CardHeader>
            <CardContent>
              <ThroughputChart />
            </CardContent>
          </Card>

          {/* Urgent Action Stream */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base text-warning-amber-dark">
                <AlertTriangle className="h-4 w-4 text-warning-amber" />
                Urgent Laboratory Attention & OOS Flagged Batches
              </CardTitle>
              <Link href="/samples">
                <Button variant="ghost" size="sm" className="text-xs text-pharma-blue font-bold gap-1">
                  View All Records
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <UrgentAlerts
                samples={samples}
                onSelectSample={(s) => handleViewDetail(s)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Disposition Ratio & Lab Qualification Checklist */}
        <div className="space-y-6">
          {/* Recharts Disposition Donut */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                <PieIcon className="h-4 w-4 text-teal-pharma" />
                Batch Disposition Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DispositionChart samples={samples} />
            </CardContent>
          </Card>

          {/* Compliance & Audit Health */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <ShieldCheck className="h-4 w-4 text-teal-pharma" />
                Regulatory Compliance Indicators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-medium text-slate-700">21 CFR Part 11 Electronic Records</span>
                <span className="inline-flex items-center gap-1 font-bold text-teal-pharma text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Validated
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-medium text-slate-700">HPLC Shimadzu-01 Calibration</span>
                <span className="inline-flex items-center gap-1 font-bold text-teal-pharma text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Certified
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-medium text-slate-700">Micro Analytical Balance #05</span>
                <span className="inline-flex items-center gap-1 font-bold text-warning-amber-dark text-[11px]">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Due in 48h
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">Chamber #SC-02 (40°C/75% RH)</span>
                <span className="inline-flex items-center gap-1 font-bold text-teal-pharma text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Conforming
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <SampleDetailModal
        sample={selectedSample}
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />

      <ResultEntryModal
        sample={selectedSample}
        open={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        onSave={handleUpdateResults}
      />
    </div>
  );
}
