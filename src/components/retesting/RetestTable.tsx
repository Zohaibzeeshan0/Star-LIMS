"use client";

import React, { useState, useMemo } from "react";
import {
  RetestSample,
  RetestStatus,
  RetestCategory
} from "@/lib/types/retesting";
import { RetestStatusBadge } from "./RetestStatusBadge";
import { getRetestUrgency } from "@/lib/mock-data/retesting-samples";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Download,
  Clock,
  Layers,
  MapPin,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  User,
  FlaskConical
} from "lucide-react";

interface RetestTableProps {
  samples: RetestSample[];
  onView: (sample: RetestSample) => void;
  onEdit: (sample: RetestSample) => void;
  onInitiateRetest: (sample: RetestSample) => void;
  onRequestStatusChange: (sample: RetestSample, newStatus: RetestStatus) => void;
  onAddNew: () => void;
}

type SortField =
  | "nextRetestDueDate"
  | "previousTestDate"
  | "lastRetestDate"
  | "id"
  | "materialName"
  | "batchNumber"
  | "analyst";

export function RetestTable({
  samples,
  onView,
  onEdit,
  onInitiateRetest,
  onRequestStatusChange,
  onAddNew
}: RetestTableProps) {
  // Filter States (Specific user requirements: due status, material, supplier, assigned analyst, date range)
  const [searchQuery, setSearchQuery] = useState("");
  const [dueStatusFilter, setDueStatusFilter] = useState<RetestStatus | "ALL">("ALL");
  const [materialFilter, setMaterialFilter] = useState<string>("ALL");
  const [supplierFilter, setSupplierFilter] = useState<string>("ALL");
  const [analystFilter, setAnalystFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // Sorting States
  const [sortField, setSortField] = useState<SortField>("nextRetestDueDate");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 7;

  // Extract unique options for filter dropdowns
  const uniqueMaterials = useMemo(() => {
    return Array.from(new Set(samples.map((s) => s.materialName))).sort();
  }, [samples]);

  const uniqueSuppliers = useMemo(() => {
    return Array.from(new Set(samples.map((s) => s.supplier))).sort();
  }, [samples]);

  const uniqueAnalysts = useMemo(() => {
    return Array.from(new Set(samples.map((s) => s.analyst))).sort();
  }, [samples]);

  // Filter & Search Logic
  const filteredSamples = useMemo(() => {
    return samples.filter((sample) => {
      // Free text search
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchId = sample.id.toLowerCase().includes(query);
        const matchRawId = sample.rawMaterialSampleId.toLowerCase().includes(query);
        const matchName = sample.materialName.toLowerCase().includes(query);
        const matchCode = sample.materialCode.toLowerCase().includes(query);
        const matchBatch = sample.batchNumber.toLowerCase().includes(query);
        const matchSupplier = sample.supplier.toLowerCase().includes(query);
        const matchAnalyst = sample.analyst.toLowerCase().includes(query);
        if (!matchId && !matchRawId && !matchName && !matchCode && !matchBatch && !matchSupplier && !matchAnalyst) {
          return false;
        }
      }

      // Due Status Filter
      if (dueStatusFilter !== "ALL" && sample.status !== dueStatusFilter) {
        return false;
      }

      // Material Filter
      if (materialFilter !== "ALL" && sample.materialName !== materialFilter) {
        return false;
      }

      // Supplier Filter
      if (supplierFilter !== "ALL" && sample.supplier !== supplierFilter) {
        return false;
      }

      // Analyst Filter
      if (analystFilter !== "ALL" && sample.analyst !== analystFilter) {
        return false;
      }

      // Date Range Filter (against nextRetestDueDate)
      if (dateFrom && sample.nextRetestDueDate < dateFrom) {
        return false;
      }
      if (dateTo && sample.nextRetestDueDate > dateTo) {
        return false;
      }

      return true;
    });
  }, [samples, searchQuery, dueStatusFilter, materialFilter, supplierFilter, analystFilter, dateFrom, dateTo]);

  // Sort Logic
  const sortedSamples = useMemo(() => {
    return [...filteredSamples].sort((a, b) => {
      let valA: string | number = a[sortField] || "";
      let valB: string | number = b[sortField] || "";

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredSamples, sortField, sortAsc]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedSamples.length / pageSize) || 1;
  const paginatedSamples = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedSamples.slice(start, start + pageSize);
  }, [sortedSamples, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDueStatusFilter("ALL");
    setMaterialFilter("ALL");
    setSupplierFilter("ALL");
    setAnalystFilter("ALL");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = [
      "Sample ID",
      "Material Name",
      "Material Code",
      "Batch Number",
      "Previous Test Date",
      "Last Retest Date",
      "Next Retest Due Date",
      "Assigned Analyst",
      "Status",
      "Supplier",
      "Warehouse Location",
      "Remaining Stock"
    ];

    const rows = sortedSamples.map((s) => [
      `"${s.id}"`,
      `"${s.materialName}"`,
      `"${s.materialCode}"`,
      `"${s.batchNumber}"`,
      `"${s.previousTestDate}"`,
      `"${s.lastRetestDate}"`,
      `"${s.nextRetestDueDate}"`,
      `"${s.analyst}"`,
      `"${s.status}"`,
      `"${s.supplier}"`,
      `"${s.warehouseLocation}"`,
      `${s.remainingStock} ${s.unit}`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `CitiPharma_Retesting_Records_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Mock Data Assurance Badge */}
      <div className="flex items-center justify-between bg-blue-50/70 border border-blue-200/60 px-3.5 py-1.5 rounded-lg text-[11px] text-blue-800">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-pharma-blue" />
          <span className="font-semibold">Simulated QC Surveillance Environment</span>
          <span className="text-blue-600 font-normal hidden sm:inline">• All records are realistic mock pharmaceutical surveillance data conforming to ICH Q7 §7.5</span>
        </div>
        <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-blue-200">
          MOCK DATA
        </span>
      </div>

      {/* Search and Filters Header */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Sample ID, Material, Code, Batch #, Supplier, Analyst..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pharma-blue/30 focus:border-pharma-blue transition-all"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="gap-1.5 text-xs text-slate-600 hover:text-pharma-blue border-slate-200 font-semibold"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button
              variant="teal"
              size="sm"
              onClick={onAddNew}
              className="gap-1.5 text-xs font-bold shadow-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Add Retest Schedule
            </Button>
          </div>
        </div>

        {/* Filter Row 1: Due Status, Material, Supplier, Assigned Analyst */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
          {/* Due Status Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Due Status
            </label>
            <select
              value={dueStatusFilter}
              onChange={(e) => {
                setDueStatusFilter(e.target.value as RetestStatus | "ALL");
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-md border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
            >
              <option value="ALL">All Due Statuses</option>
              <option value="Due Soon">Due Soon (&lt;= 30 Days)</option>
              <option value="Overdue">Overdue (Critical Hold)</option>
              <option value="Scheduled">Scheduled (Valid Horizon)</option>
              <option value="In Progress">In Progress (Under Testing)</option>
              <option value="Completed">Completed (Passed / Extended)</option>
              <option value="Quarantine">Quarantine (Investigation)</option>
              <option value="Rejected">Rejected (OOS)</option>
            </select>
          </div>

          {/* Material Name Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Material Name
            </label>
            <select
              value={materialFilter}
              onChange={(e) => {
                setMaterialFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-md border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
            >
              <option value="ALL">All Raw Materials</option>
              {uniqueMaterials.map((mat) => (
                <option key={mat} value={mat}>
                  {mat}
                </option>
              ))}
            </select>
          </div>

          {/* Supplier Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Supplier / Vendor
            </label>
            <select
              value={supplierFilter}
              onChange={(e) => {
                setSupplierFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-md border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
            >
              <option value="ALL">All Suppliers</option>
              {uniqueSuppliers.map((sup) => (
                <option key={sup} value={sup}>
                  {sup}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Analyst Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Assigned Analyst
            </label>
            <select
              value={analystFilter}
              onChange={(e) => {
                setAnalystFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-md border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
            >
              <option value="ALL">All QC Analysts</option>
              {uniqueAnalysts.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Row 2: Date Range (Due Date Horizon) */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 items-end">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Due Date From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-md border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Due Date To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-md border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
            />
          </div>

          <div className="sm:col-span-2 flex items-center justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-xs text-slate-500 hover:text-pharma-blue"
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Main Table Wrapper */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-3.5">
                  <button
                    onClick={() => handleSort("id")}
                    className="flex items-center gap-1 hover:text-pharma-blue"
                  >
                    Sample ID
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">
                  <button
                    onClick={() => handleSort("materialName")}
                    className="flex items-center gap-1 hover:text-pharma-blue"
                  >
                    Material Name &amp; Code
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">
                  <button
                    onClick={() => handleSort("batchNumber")}
                    className="flex items-center gap-1 hover:text-pharma-blue"
                  >
                    Batch Number
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">
                  <button
                    onClick={() => handleSort("previousTestDate")}
                    className="flex items-center gap-1 hover:text-pharma-blue"
                  >
                    Previous Test Date
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">
                  <button
                    onClick={() => handleSort("lastRetestDate")}
                    className="flex items-center gap-1 hover:text-pharma-blue"
                  >
                    Last Retest Date
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">
                  <button
                    onClick={() => handleSort("nextRetestDueDate")}
                    className="flex items-center gap-1 hover:text-pharma-blue"
                  >
                    Next Retest Due Date
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">
                  <button
                    onClick={() => handleSort("analyst")}
                    className="flex items-center gap-1 hover:text-pharma-blue"
                  >
                    Assigned Analyst
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedSamples.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Clock className="h-8 w-8 text-slate-300" />
                      <p className="font-semibold text-slate-700">No retest records matched your criteria.</p>
                      <p className="text-[11px] text-slate-400">
                        Try clearing search terms or widening the date filter range.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetFilters}
                        className="mt-2 text-xs"
                      >
                        Reset All Filters
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedSamples.map((sample) => {
                  const urgency = getRetestUrgency(sample);

                  return (
                    <tr
                      key={sample.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Sample ID */}
                      <td className="py-3 px-3.5 align-top">
                        <div className="font-mono font-bold text-pharma-blue">
                          {sample.id}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Ref: {sample.rawMaterialSampleId}
                        </div>
                        <span className="inline-block mt-1 text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          Cycle #{sample.retestCycleNumber}
                        </span>
                      </td>

                      {/* Material Name & Code */}
                      <td className="py-3 px-3.5 align-top max-w-xs">
                        <div className="font-bold text-slate-800 leading-snug">
                          {sample.materialName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {sample.materialCode}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          Supplier: {sample.supplier}
                        </div>
                      </td>

                      {/* Batch Number */}
                      <td className="py-3 px-3.5 align-top">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {sample.batchNumber}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Stock: {sample.remainingStock} {sample.unit}
                        </div>
                      </td>

                      {/* Previous Test Date */}
                      <td className="py-3 px-3.5 align-top text-slate-600 font-mono">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>{sample.previousTestDate}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-sans">
                          Mfg: {sample.manufactureDate}
                        </div>
                      </td>

                      {/* Last Retest Date */}
                      <td className="py-3 px-3.5 align-top text-slate-600 font-mono">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>{sample.lastRetestDate}</span>
                        </div>
                      </td>

                      {/* Next Retest Due Date (with Visual Approaching & Overdue Warnings) */}
                      <td className="py-3 px-3.5 align-top">
                        <div className="flex items-center gap-1 font-mono font-bold text-slate-900">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>{sample.nextRetestDueDate}</span>
                        </div>

                        {/* Visual Warnings for Approaching & Overdue */}
                        {urgency.urgency === "OVERDUE" && (
                          <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-300 animate-pulse">
                            <AlertTriangle className="h-3 w-3 text-red-600" />
                            <span>{urgency.label}</span>
                          </div>
                        )}
                        {urgency.urgency === "DUE_SOON" && (
                          <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                            <Clock className="h-3 w-3 text-amber-600" />
                            <span>{urgency.label}</span>
                          </div>
                        )}
                        {urgency.urgency === "COMPLETED" && (
                          <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-teal-800 bg-teal-100 px-1.5 py-0.2 rounded">
                            <Sparkles className="h-2.5 w-2.5 text-teal-600" />
                            <span>Extended</span>
                          </div>
                        )}
                        {urgency.urgency === "SCHEDULED" && (
                          <div className="mt-1 text-[10px] text-slate-400">
                            {urgency.label}
                          </div>
                        )}
                      </td>

                      {/* Assigned Analyst */}
                      <td className="py-3 px-3.5 align-top">
                        <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span>{sample.analyst}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          QA: {sample.reviewedBy}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5 align-top">
                        <RetestStatusBadge status={sample.status} sample={sample} />
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 align-top text-right space-y-1">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(sample)}
                            className="h-7 w-7 p-0 text-slate-500 hover:text-pharma-blue hover:bg-slate-100"
                            title="View Retest Details & Timeline"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(sample)}
                            className="h-7 w-7 p-0 text-slate-500 hover:text-pharma-blue hover:bg-slate-100"
                            title="Edit Retest Schedule"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {/* Quick Action Transitions */}
                        <div className="flex items-center justify-end gap-1">
                          {sample.status !== "Completed" && (
                            <button
                              onClick={() => onRequestStatusChange(sample, "Completed")}
                              className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors"
                              title="Authorize Shelf-Life Extension"
                            >
                              Extend
                            </button>
                          )}
                          {sample.status !== "In Progress" && sample.status !== "Completed" && (
                            <button
                              onClick={() => onRequestStatusChange(sample, "In Progress")}
                              className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 transition-colors"
                              title="Mark In Progress"
                            >
                              Test
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Count Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-50/80 border-t border-slate-200 text-xs text-slate-600">
          <div>
            Showing{" "}
            <span className="font-bold text-slate-800">
              {filteredSamples.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-slate-800">
              {Math.min(currentPage * pageSize, filteredSamples.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-800">{filteredSamples.length}</span> retest
            records
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage <= 1}
              className="h-7 px-2 text-xs border-slate-200"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Prev
            </Button>
            <span className="px-2 text-xs font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="h-7 px-2 text-xs border-slate-200"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
