"use client";

import React, { useState, useMemo } from "react";
import {
  RetestSample,
  RetestStatus,
  RetestCategory,
  ExpiryUrgency
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
  ShieldAlert
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
  | "currentRetestDate"
  | "id"
  | "materialName"
  | "batchNumber"
  | "remainingStock";

export function RetestTable({
  samples,
  onView,
  onEdit,
  onInitiateRetest,
  onRequestStatusChange,
  onAddNew
}: RetestTableProps) {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RetestStatus | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<RetestCategory | "ALL">("ALL");
  const [urgencyFilter, setUrgencyFilter] = useState<ExpiryUrgency | "ALL">("ALL");

  // Sorting States
  const [sortField, setSortField] = useState<SortField>("currentRetestDate");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 7;

  // Filter & Search Logic
  const filteredSamples = useMemo(() => {
    return samples.filter((sample) => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchId = sample.id.toLowerCase().includes(query);
        const matchRawId = sample.rawMaterialSampleId.toLowerCase().includes(query);
        const matchName = sample.materialName.toLowerCase().includes(query);
        const matchCode = sample.materialCode.toLowerCase().includes(query);
        const matchBatch = sample.batchNumber.toLowerCase().includes(query);
        const matchSupplier = sample.supplier.toLowerCase().includes(query);
        const matchLocation = sample.warehouseLocation.toLowerCase().includes(query);
        if (!matchId && !matchRawId && !matchName && !matchCode && !matchBatch && !matchSupplier && !matchLocation) {
          return false;
        }
      }

      // Status
      if (statusFilter !== "ALL" && sample.status !== statusFilter) {
        return false;
      }

      // Category
      if (categoryFilter !== "ALL" && sample.category !== categoryFilter) {
        return false;
      }

      // Urgency
      if (urgencyFilter !== "ALL") {
        const { urgency } = getRetestUrgency(sample);
        if (urgency !== urgencyFilter) {
          return false;
        }
      }

      return true;
    });
  }, [samples, searchQuery, statusFilter, categoryFilter, urgencyFilter]);

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
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
    setUrgencyFilter("ALL");
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = [
      "Retest ID",
      "Original RM ID",
      "Material Name",
      "Material Code",
      "Category",
      "Batch Number",
      "Supplier",
      "Warehouse Location",
      "Remaining Stock",
      "Unit",
      "Retest Cycle",
      "Current Retest Date",
      "Extended Retest Date",
      "Status",
      "QC Analyst"
    ];

    const rows = sortedSamples.map((s) => [
      `"${s.id}"`,
      `"${s.rawMaterialSampleId}"`,
      `"${s.materialName}"`,
      `"${s.materialCode}"`,
      `"${s.category}"`,
      `"${s.batchNumber}"`,
      `"${s.supplier}"`,
      `"${s.warehouseLocation}"`,
      s.remainingStock,
      `"${s.unit}"`,
      s.retestCycleNumber,
      `"${s.currentRetestDate}"`,
      `"${s.extendedRetestDate || "N/A"}"`,
      `"${s.status}"`,
      `"${s.analyst}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `CitiPharma_Retesting_Surveillance_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Header */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Retest ID, Raw ID, Material, Batch #, Supplier, Location..."
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
              Schedule Retest Order
            </Button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
          {/* Status Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Retest Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as RetestStatus | "ALL");
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-md border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
            >
              <option value="ALL">All Statuses</option>
              <option value="Due Soon">Due Soon (&lt;= 30 Days)</option>
              <option value="Overdue">Overdue (Expired / Hold)</option>
              <option value="Under Testing">Under Testing (In QC)</option>
              <option value="Extended / Passed">Extended / Passed (+Extension)</option>
              <option value="Scheduled">Scheduled (Valid)</option>
              <option value="Quarantine">Quarantine (OOS Investigation)</option>
              <option value="Rejected / OOS">Rejected / OOS</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Urgency / Proximity
            </label>
            <select
              value={urgencyFilter}
              onChange={(e) => {
                setUrgencyFilter(e.target.value as ExpiryUrgency | "ALL");
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-md border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
            >
              <option value="ALL">All Surveillance Horizons</option>
              <option value="OVERDUE">🚨 Critical Overdue</option>
              <option value="URGENT_30">⚠️ Urgent (Due within 30 days)</option>
              <option value="UPCOMING_60">📅 Upcoming (31-60 days)</option>
              <option value="EXTENDED">✨ Extended Shelf-Life</option>
              <option value="VALID">✅ Valid (&gt; 60 days)</option>
            </select>
          </div>

          {/* Material Category */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Material Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value as RetestCategory | "ALL");
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-md border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
            >
              <option value="ALL">All Categories</option>
              <option value="Active Pharmaceutical Ingredient (API)">Active Ingredients (API)</option>
              <option value="Excipient / Binder / Filler">Excipients & Fillers</option>
              <option value="Coating Polymer / Granulating Agent">Polymers & Binders</option>
              <option value="Preservative / Antioxidant">Preservatives & Buffers</option>
              <option value="Process Solvent / Reagent">Process Solvents</option>
            </select>
          </div>

          {/* Reset Action */}
          <div className="flex items-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="w-full text-xs text-slate-500 hover:text-pharma-blue"
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Main Table Wrapper */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-3.5">
                  <button
                    onClick={() => handleSort("id")}
                    className="flex items-center gap-1 hover:text-pharma-blue"
                  >
                    Retest ID / Lot
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">
                  <button
                    onClick={() => handleSort("materialName")}
                    className="flex items-center gap-1 hover:text-pharma-blue"
                  >
                    Raw Material Details
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">Warehouse Location</th>
                <th className="py-3 px-3.5">
                  <button
                    onClick={() => handleSort("remainingStock")}
                    className="flex items-center gap-1 hover:text-pharma-blue"
                  >
                    Remaining Stock
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">
                  <button
                    onClick={() => handleSort("currentRetestDate")}
                    className="flex items-center gap-1 hover:text-pharma-blue"
                  >
                    Retest Horizon
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">Surveillance Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedSamples.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Clock className="h-8 w-8 text-slate-300" />
                      <p className="font-semibold text-slate-700">No retest records matched your criteria.</p>
                      <p className="text-[11px] text-slate-400">
                        Try clearing or adjusting search filters.
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
                      {/* Retest ID & Original RM ID */}
                      <td className="py-3 px-3.5 align-top">
                        <div className="font-mono font-bold text-pharma-blue">
                          {sample.id}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Ref: {sample.rawMaterialSampleId}
                        </div>
                        <div className="inline-flex items-center gap-1 mt-1 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          Cycle #{sample.retestCycleNumber}
                        </div>
                      </td>

                      {/* Material Details */}
                      <td className="py-3 px-3.5 align-top max-w-xs">
                        <div className="font-bold text-slate-800 leading-snug">
                          {sample.materialName}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono">
                          <span>{sample.materialCode}</span>
                          <span>•</span>
                          <span className="font-semibold text-pharma-blue">Lot: {sample.batchNumber}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          Mfg: {sample.manufacturer}
                        </div>
                      </td>

                      {/* Warehouse Location */}
                      <td className="py-3 px-3.5 align-top">
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                          <span>{sample.warehouseLocation}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {sample.storageCondition}
                        </div>
                      </td>

                      {/* Remaining Stock */}
                      <td className="py-3 px-3.5 align-top">
                        <div className="font-bold text-slate-800">
                          {sample.remainingStock.toLocaleString()} {sample.unit}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {sample.containersCount} sealed containers
                        </div>
                      </td>

                      {/* Retest Horizon & Proximity */}
                      <td className="py-3 px-3.5 align-top">
                        <div className="flex items-center gap-1 text-slate-800 font-semibold">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>{sample.currentRetestDate}</span>
                        </div>

                        {sample.extendedRetestDate ? (
                          <div className="text-[10px] font-bold text-teal-700 flex items-center gap-1 mt-0.5">
                            <Sparkles className="h-2.5 w-2.5" />
                            Ext: {sample.extendedRetestDate}
                          </div>
                        ) : (
                          <div
                            className={`text-[10px] font-bold mt-0.5 ${
                              urgency.urgency === "OVERDUE"
                                ? "text-red-700 animate-pulse"
                                : urgency.urgency === "URGENT_30"
                                ? "text-amber-700"
                                : "text-slate-500"
                            }`}
                          >
                            {urgency.label}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400">
                          Mfg: {sample.manufactureDate}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-3.5 align-top">
                        <RetestStatusBadge status={sample.status} sample={sample} showUrgency />
                      </td>

                      {/* Row Actions */}
                      <td className="py-3 px-3.5 align-top text-right space-y-1">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(sample)}
                            className="h-7 w-7 p-0 text-slate-500 hover:text-pharma-blue hover:bg-slate-100"
                            title="View Retest Certificate & Test Battery"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(sample)}
                            className="h-7 w-7 p-0 text-slate-500 hover:text-pharma-blue hover:bg-slate-100"
                            title="Edit Retest Record"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {/* Quick Workflow Transition Buttons */}
                        <div className="flex items-center justify-end gap-1">
                          {sample.status !== "Extended / Passed" && (
                            <button
                              onClick={() => onRequestStatusChange(sample, "Extended / Passed")}
                              className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors"
                              title="Authorize Shelf-Life Extension"
                            >
                              Extend
                            </button>
                          )}
                          {sample.status !== "Under Testing" && sample.status !== "Extended / Passed" && (
                            <button
                              onClick={() => onRequestStatusChange(sample, "Under Testing")}
                              className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 transition-colors"
                              title="Send to QC Testing"
                            >
                              Test
                            </button>
                          )}
                          {sample.status !== "Rejected / OOS" && sample.status !== "Quarantine" && (
                            <button
                              onClick={() => onRequestStatusChange(sample, "Quarantine")}
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-200 transition-colors"
                              title="Hold in Quarantine"
                            >
                              Hold
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
