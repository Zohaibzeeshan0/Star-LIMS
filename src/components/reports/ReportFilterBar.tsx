"use client";

import React, { useMemo } from "react";
import { ReportFilterState, ReportCategory } from "@/lib/types/report";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  RotateCcw,
  Calendar,
  AlertCircle,
  Building2,
  Layers,
  Sparkles
} from "lucide-react";

interface ReportFilterBarProps {
  filters: ReportFilterState;
  onFilterChange: (filters: ReportFilterState) => void;
  onReset: () => void;
  allSuppliers: string[];
  totalFiltered: number;
  totalAvailable: number;
}

export function ReportFilterBar({
  filters,
  onFilterChange,
  onReset,
  allSuppliers,
  totalFiltered,
  totalAvailable
}: ReportFilterBarProps) {
  // Check if dateFrom > dateTo
  const isDateRangeInvalid = useMemo(() => {
    if (filters.dateFrom && filters.dateTo) {
      return filters.dateFrom > filters.dateTo;
    }
    return false;
  }, [filters.dateFrom, filters.dateTo]);

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    filters.searchQuery ||
    filters.status !== "ALL" ||
    filters.supplier !== "ALL" ||
    filters.batchNumber ||
    filters.dateFrom ||
    filters.dateTo
  );

  const handleInputChange = (field: keyof ReportFilterState, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-teal-50 p-1.5 text-teal-pharma">
            <Filter className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-pharma-blue">
              Audit Query &amp; Multi-Criteria Filters
            </h4>
            <span className="text-[11px] text-slate-500">
              Filter sample dossiers by monograph standards, analytical dates, batch, and manufacturer
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">
            Showing <strong className="text-pharma-blue">{totalFiltered}</strong> of {totalAvailable} records
          </span>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="h-8 gap-1.5 text-xs text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
              <span>Reset Filters</span>
            </Button>
          )}
        </div>
      </div>

      {/* Date Validation Alert */}
      {isDateRangeInvalid && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-critical-red border border-red-200 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            <strong>Invalid Date Range:</strong> &quot;Start Date&quot; cannot be later than &quot;End Date&quot;. Please adjust your date boundaries.
          </span>
        </div>
      )}

      {/* Filter Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. General Search */}
        <div className="lg:col-span-2 space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Search Text
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Material, code, analyst..."
              value={filters.searchQuery}
              onChange={(e) => handleInputChange("searchQuery", e.target.value)}
              className="h-9 pl-9 text-xs"
            />
          </div>
        </div>

        {/* 2. Batch Number */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Batch / Lot #
          </label>
          <Input
            placeholder="e.g. PAR-500-B294"
            value={filters.batchNumber}
            onChange={(e) => handleInputChange("batchNumber", e.target.value)}
            className="h-9 text-xs"
          />
        </div>

        {/* 3. Status Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Disposition Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className="h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 shadow-2xs focus:border-pharma-blue focus:outline-hidden focus:ring-1 focus:ring-pharma-blue"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pass/Released">Pass / Released</option>
            <option value="Quarantine/Retest">Quarantine / Retest</option>
            <option value="Fail/Rejected">Fail / Rejected</option>
            <option value="In Testing">In Testing / Under Testing</option>
            <option value="Reviewed">QA Reviewed</option>
          </select>
        </div>

        {/* 4. Date From */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Date From
          </label>
          <div className="relative">
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleInputChange("dateFrom", e.target.value)}
              className={`h-9 text-xs ${isDateRangeInvalid ? "border-critical-red bg-red-50/50" : ""}`}
            />
          </div>
        </div>

        {/* 5. Date To */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Date To
          </label>
          <div className="relative">
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleInputChange("dateTo", e.target.value)}
              className={`h-9 text-xs ${isDateRangeInvalid ? "border-critical-red bg-red-50/50" : ""}`}
            />
          </div>
        </div>
      </div>

      {/* Secondary Row: Supplier Filter if available */}
      {allSuppliers.length > 0 && (
        <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Building2 className="h-3 w-3 text-slate-400" />
            Supplier Filter:
          </span>
          <select
            value={filters.supplier}
            onChange={(e) => handleInputChange("supplier", e.target.value)}
            className="h-7 rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700 shadow-2xs focus:border-pharma-blue focus:outline-hidden"
          >
            <option value="ALL">All Suppliers / Manufacturers ({allSuppliers.length})</option>
            {allSuppliers.map((sup, idx) => (
              <option key={idx} value={sup}>
                {sup}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
