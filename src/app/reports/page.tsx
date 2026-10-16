"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ReportCategory,
  ReportFilterState,
  UnifiedReportItem
} from "@/lib/types/report";
import {
  getAllReportItems,
  filterReportItems,
  sortReportItems,
  calculateReportMetrics,
  exportReportToCSV
} from "@/lib/report-service";
import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards";
import { ReportCharts } from "@/components/reports/ReportCharts";
import { ReportFilterBar } from "@/components/reports/ReportFilterBar";
import { ReportTable } from "@/components/reports/ReportTable";
import { EmptyReportState } from "@/components/reports/EmptyReportState";
import { SampleReportPreviewModal } from "@/components/reports/SampleReportPreviewModal";
import { GlobalSampleSearchModal } from "@/components/reports/GlobalSampleSearchModal";
import { Button } from "@/components/ui/button";
import {
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  RotateCcw,
  Package,
  Layers,
  RotateCcw as RetestIcon,
  Pill,
  ClipboardCheck,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2
} from "lucide-react";

export default function ReportsPage() {
  // Master Dataset (Independent from future API endpoints)
  const masterItems = useMemo(() => getAllReportItems(), []);

  // Filter State
  const initialFilters: ReportFilterState = {
    searchQuery: "",
    category: "ALL",
    status: "ALL",
    supplier: "ALL",
    batchNumber: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "date",
    sortOrder: "desc"
  };

  const [filters, setFilters] = useState<ReportFilterState>(initialFilters);

  // Modal Visibility States
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedPreviewItem, setSelectedPreviewItem] = useState<UnifiedReportItem | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  // Keyboard shortcut Ctrl+K / Cmd+K for global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Extract all unique suppliers for the filter dropdown
  const allSuppliers = useMemo(() => {
    const set = new Set<string>();
    masterItems.forEach((item) => {
      if (item.supplierOrMfr && item.supplierOrMfr !== "Citi Pharma Formulation Unit") {
        set.add(item.supplierOrMfr);
      }
    });
    return Array.from(set).sort();
  }, [masterItems]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    const filtered = filterReportItems(masterItems, filters);
    return sortReportItems(filtered, filters.sortBy, filters.sortOrder);
  }, [masterItems, filters]);

  // Calculated Metrics for Cards & Charts
  const metrics = useMemo(() => {
    return calculateReportMetrics(filteredItems);
  }, [filteredItems]);

  // Handlers
  const handleSortChange = (column: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === "asc" ? "desc" : "asc"
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      ...initialFilters,
      category: filters.category // Keep active category tab
    });
    showToast("Filters reset to default.");
  };

  const handleCategoryTabChange = (cat: ReportCategory) => {
    setFilters((prev) => ({
      ...prev,
      category: cat,
      // reset specific search parameters when switching categories
      searchQuery: "",
      batchNumber: "",
      status: "ALL",
      supplier: "ALL"
    }));
  };

  const handleOpenPreview = (item: UnifiedReportItem) => {
    setSelectedPreviewItem(item);
    setPreviewModalOpen(true);
  };

  const handleExportCSV = () => {
    const categoryTitle =
      filters.category === "ALL"
        ? "Consolidated Laboratory Sample Overview"
        : filters.category.toUpperCase();
    exportReportToCSV(filteredItems, categoryTitle);
    showToast(`Exported ${filteredItems.length} records to CSV (Demonstration Dataset).`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Category Tabs Configuration
  const categoryTabs: { id: ReportCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "ALL", label: "Consolidated Overview", icon: FileSpreadsheet },
    { id: "packaging", label: "Packaging Materials", icon: Package },
    { id: "raw-materials", label: "Raw Materials (APIs)", icon: Layers },
    { id: "retesting", label: "RM Retesting", icon: RetestIcon },
    { id: "products", label: "Finished Products & IPQC", icon: Pill },
    { id: "qc-results", label: "QC Test Results", icon: ClipboardCheck },
    { id: "status-summary", label: "Sample Status Summary", icon: ShieldCheck }
  ];

  const activeCategoryTitle = categoryTabs.find((t) => t.id === filters.category)?.label || "Overview";

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300 no-print">
          <div className="bg-[#123B63] text-white px-4 py-3 rounded-xl shadow-2xl border border-white/20 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed flex-1">
              <span className="font-bold block text-teal-200">LIMS Report Export</span>
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-white/60 hover:text-white text-xs font-bold ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Page Header (No Print) */}
      <div className="no-print bg-gradient-to-r from-[#123B63] via-[#1A4B7C] to-[#123B63] -mx-6 -mt-6 md:-mx-8 md:-mt-8 p-6 md:p-8 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest bg-teal-500/20 text-teal-300 border border-teal-400/30">
                Phase 8 Compliance Reporting Engine
              </span>
              <span className="text-[11px] text-white/60">
                • WHO GMP &amp; 21 CFR Part 11 Audit Logs
              </span>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-black text-white flex items-center gap-2.5">
              <FileSpreadsheet className="h-7 w-7 text-teal-400" />
              <span>Laboratory Reports, Search &amp; Data Export</span>
            </h1>
            <p className="text-xs text-sky-100 max-w-2xl leading-relaxed">
              Consolidated reporting analytics across Packaging Materials, Raw Materials, Retesting, Finished Pharmaceutical Products, and QC Analytical Test Worklists.
            </p>
          </div>

          {/* Quick Actions Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Global Search Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchModalOpen(true)}
              className="bg-white/10 text-white hover:bg-white/20 border-white/20 text-xs font-bold gap-2 shadow-xs"
            >
              <Search className="h-3.5 w-3.5 text-teal-300" />
              <span>Global Sample Search</span>
              <kbd className="hidden sm:inline-block rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-mono text-white/80">
                Ctrl+K
              </kbd>
            </Button>

            {/* Export CSV Button */}
            <Button
              variant="teal"
              size="sm"
              onClick={handleExportCSV}
              className="text-xs font-bold gap-1.5 shadow-sm"
              title="Download CSV dataset (Demonstration Data)"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>

            {/* Print Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="bg-white/10 text-white hover:bg-white/20 border-white/20 text-xs font-bold gap-1.5 shadow-xs"
              title="Print Current Report"
            >
              <Printer className="h-3.5 w-3.5 text-sky-200" />
              <span className="hidden sm:inline">Print</span>
            </Button>
          </div>
        </div>

        {/* Demonstration Notice */}
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-teal-500/15 border border-teal-400/25 px-3 py-1.5 text-[11px] text-teal-200">
          <Info className="h-3.5 w-3.5 shrink-0 text-teal-300" />
          <span>
            <strong>Demonstration Dataset Notice:</strong> All reporting figures, disposition rates, and exports utilize simulated pharmaceutical laboratory data for architectural verification.
          </span>
        </div>
      </div>

      {/* Category Tabs (No Print) */}
      <div className="no-print overflow-x-auto pb-1">
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2 min-w-max">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = filters.category === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleCategoryTabChange(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-pharma-blue text-white shadow-sm ring-1 ring-pharma-blue"
                    : "text-slate-600 hover:bg-slate-100 hover:text-pharma-blue"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-teal-300" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Summary Cards */}
      <ReportSummaryCards
        metrics={metrics}
        categoryTitle={activeCategoryTitle}
      />

      {/* 2. Recharts Dynamic Visualizations */}
      <ReportCharts metrics={metrics} />

      {/* 3. Filter Bar (No Print) */}
      <div className="no-print">
        <ReportFilterBar
          filters={filters}
          onFilterChange={(newFilters) => setFilters(newFilters)}
          onReset={handleResetFilters}
          allSuppliers={allSuppliers}
          totalFiltered={filteredItems.length}
          totalAvailable={masterItems.length}
        />
      </div>

      {/* 4. Report Table or Empty State */}
      {filteredItems.length > 0 ? (
        <ReportTable
          items={filteredItems}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSortChange={handleSortChange}
          onPreviewReport={handleOpenPreview}
        />
      ) : (
        <EmptyReportState onReset={handleResetFilters} />
      )}

      {/* 5. Print-Friendly Sample Report Preview Modal */}
      <SampleReportPreviewModal
        item={selectedPreviewItem}
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
      />

      {/* 6. Global Sample Search Modal */}
      <GlobalSampleSearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        allItems={masterItems}
        onPreviewItem={handleOpenPreview}
      />
    </div>
  );
}
