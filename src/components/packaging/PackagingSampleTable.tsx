"use client";

import React, { useState, useMemo } from "react";
import { PackagingSample, PackagingStatus, PackagingType } from "@/lib/types/packaging";
import { PackagingStatusBadge } from "./PackagingStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  Edit,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Layers,
  Calendar,
  X
} from "lucide-react";

interface PackagingSampleTableProps {
  samples: PackagingSample[];
  onView: (sample: PackagingSample) => void;
  onEdit: (sample: PackagingSample) => void;
  onAddNew: () => void;
  onRequestStatusChange: (sample: PackagingSample, newStatus: PackagingStatus) => void;
}

export function PackagingSampleTable({
  samples,
  onView,
  onEdit,
  onAddNew,
  onRequestStatusChange,
}: PackagingSampleTableProps) {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [supplierFilter, setSupplierFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Sort State
  const [sortField, setSortField] = useState<keyof PackagingSample>("receivedDate");
  const [sortAsc, setSortAsc] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Unique list of suppliers for filter dropdown
  const uniqueSuppliers = useMemo(() => {
    const list = Array.from(new Set(samples.map((s) => s.supplier)));
    return list.sort();
  }, [samples]);

  // Filtered & Sorted Records
  const filteredSamples = useMemo(() => {
    return samples
      .filter((item) => {
        // Status filter
        if (statusFilter !== "ALL" && item.status !== statusFilter) return false;

        // Type filter
        if (typeFilter !== "ALL" && item.packagingType !== typeFilter) return false;

        // Supplier filter
        if (supplierFilter !== "ALL" && item.supplier !== supplierFilter) return false;

        // Date range filter
        if (dateFrom && item.receivedDate < dateFrom) return false;
        if (dateTo && item.receivedDate > dateTo) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchId = item.id.toLowerCase().includes(q);
          const matchName = item.materialName.toLowerCase().includes(q);
          const matchCode = item.materialCode.toLowerCase().includes(q);
          const matchBatch = item.batchNumber.toLowerCase().includes(q);
          const matchSupplier = item.supplier.toLowerCase().includes(q);
          const matchMfg = item.manufacturer.toLowerCase().includes(q);
          return matchId || matchName || matchCode || matchBatch || matchSupplier || matchMfg;
        }

        return true;
      })
      .sort((a, b) => {
        const valA = a[sortField] ?? "";
        const valB = b[sortField] ?? "";
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [
    samples,
    searchQuery,
    statusFilter,
    typeFilter,
    supplierFilter,
    dateFrom,
    dateTo,
    sortField,
    sortAsc,
  ]);

  // Pagination Slice
  const totalItems = filteredSamples.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedSamples = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSamples.slice(start, start + pageSize);
  }, [filteredSamples, currentPage, pageSize]);

  // Adjust page if out of bounds
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const toggleSort = (field: keyof PackagingSample) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setSupplierFilter("ALL");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    statusFilter !== "ALL" ||
    typeFilter !== "ALL" ||
    supplierFilter !== "ALL" ||
    dateFrom !== "" ||
    dateTo !== "";

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Sample ID",
      "Material Name",
      "Material Code",
      "Packaging Type",
      "Supplier",
      "Manufacturer",
      "Batch Number",
      "Received Date",
      "Sampling Date",
      "Quantity",
      "Unit",
      "Status",
      "Storage Location",
      "Remarks",
    ];
    const rows = filteredSamples.map((s) => [
      `"${s.id}"`,
      `"${s.materialName}"`,
      `"${s.materialCode}"`,
      `"${s.packagingType}"`,
      `"${s.supplier}"`,
      `"${s.manufacturer}"`,
      `"${s.batchNumber}"`,
      `"${s.receivedDate}"`,
      `"${s.samplingDate}"`,
      s.quantity,
      `"${s.unit}"`,
      `"${s.status}"`,
      `"${s.storageLocation}"`,
      `"${s.remarks.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `Citi_Pharma_Packaging_Samples_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Status pills configuration
  const statusOptions = [
    { label: "All", value: "ALL", count: samples.length },
    { label: "Registered", value: "Registered", count: samples.filter((s) => s.status === "Registered").length },
    { label: "Under Testing", value: "Under Testing", count: samples.filter((s) => s.status === "Under Testing").length },
    { label: "Released", value: "Released", count: samples.filter((s) => s.status === "Released").length },
    { label: "Rejected", value: "Rejected", count: samples.filter((s) => s.status === "Rejected").length },
    { label: "Quarantine", value: "Quarantine", count: samples.filter((s) => s.status === "Quarantine").length },
    { label: "Retest", value: "Retest", count: samples.filter((s) => s.status === "Retest").length },
  ];

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden space-y-0">
      {/* 1. Header Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by ID, Material Name, Code, Batch, Supplier..."
              className="pl-9 bg-white text-xs"
            />
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="gap-1.5 text-xs font-semibold"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button
              variant="teal"
              size="sm"
              onClick={onAddNew}
              className="gap-1.5 text-xs font-bold shadow-sm"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Add New Sample
            </Button>
          </div>
        </div>

        {/* 2. Status Pill Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1 rounded-lg border border-slate-200/60 overflow-x-auto">
          {statusOptions.map((st) => (
            <button
              key={st.value}
              onClick={() => {
                setStatusFilter(st.value);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all select-none ${
                statusFilter === st.value
                  ? "bg-white text-pharma-blue shadow-xs font-bold"
                  : "text-slate-600 hover:text-pharma-blue hover:bg-white/50"
              }`}
            >
              <span>{st.label}</span>
              <span className="rounded-full bg-slate-200/90 px-1.5 py-0.2 text-[10px] text-slate-700 font-mono">
                {st.count}
              </span>
            </button>
          ))}
        </div>

        {/* 3. Multi-Criteria Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
          {/* Packaging Type Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-500 font-medium">Type:</label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-800 shadow-2xs focus:border-pharma-blue focus:outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="Primary Packaging">Primary Packaging</option>
              <option value="Secondary Packaging">Secondary Packaging</option>
              <option value="Tertiary Packaging">Tertiary Packaging</option>
              <option value="Printed Packaging">Printed Packaging</option>
              <option value="Closures & Seals">Closures & Seals</option>
            </select>
          </div>

          {/* Supplier Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-500 font-medium">Supplier:</label>
            <select
              value={supplierFilter}
              onChange={(e) => {
                setSupplierFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-800 shadow-2xs focus:border-pharma-blue focus:outline-none max-w-xs truncate"
            >
              <option value="ALL">All Suppliers</option>
              {uniqueSuppliers.map((supp) => (
                <option key={supp} value={supp}>
                  {supp}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range: From / To */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-500 font-medium flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-400" />
              From:
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-mono text-slate-700 shadow-2xs focus:border-pharma-blue focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-slate-500 font-medium">To:</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
              className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-mono text-slate-700 shadow-2xs focus:border-pharma-blue focus:outline-none"
            />
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-8 px-2 text-xs text-fail-red hover:bg-fail-red/10 gap-1 font-semibold"
            >
              <X className="h-3.5 w-3.5" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* 4. Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-100/70 font-heading text-[11px] font-bold uppercase tracking-wider text-pharma-blue">
            <tr>
              <th
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/50"
                onClick={() => toggleSort("id")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Sample ID / Lot</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/50"
                onClick={() => toggleSort("materialName")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Material Name & Code</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">Packaging Type</th>
              <th className="py-3 px-4">Supplier / Manufacturer</th>
              <th
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/50"
                onClick={() => toggleSort("quantity")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Quantity</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/50"
                onClick={() => toggleSort("receivedDate")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Received / Sampling</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">Quality Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedSamples.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter className="h-8 w-8 text-slate-300" />
                    <span className="font-semibold text-sm text-slate-700">
                      No matching packaging samples found
                    </span>
                    <span className="text-xs text-slate-400">
                      Try clearing your search terms or adjusting the supplier, type, or date filters.
                    </span>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                        className="mt-2 text-xs"
                      >
                        Reset All Filters
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedSamples.map((sample) => (
                <tr
                  key={sample.id}
                  className="transition-colors hover:bg-sky-50/40"
                >
                  {/* Sample ID & Lot */}
                  <td className="py-3 px-4 font-mono">
                    <div className="flex flex-col">
                      <span
                        className="font-bold text-pharma-blue hover:underline cursor-pointer"
                        onClick={() => onView(sample)}
                      >
                        {sample.id}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Lot: <strong className="text-slate-800">{sample.batchNumber}</strong>
                      </span>
                    </div>
                  </td>

                  {/* Material Name & Code */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col max-w-xs">
                      <span className="font-bold text-slate-900 text-xs">
                        {sample.materialName}
                      </span>
                      <span className="font-mono text-[11px] text-teal-pharma-dark font-medium">
                        {sample.materialCode}
                      </span>
                    </div>
                  </td>

                  {/* Packaging Type */}
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {sample.packagingType}
                    </span>
                  </td>

                  {/* Supplier & Manufacturer */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col max-w-xs">
                      <span className="font-semibold text-slate-800">
                        {sample.supplier}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate">
                        Mfg: {sample.manufacturer}
                      </span>
                    </div>
                  </td>

                  {/* Quantity & Unit */}
                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-slate-800">
                      {sample.quantity.toLocaleString()}
                    </span>{" "}
                    <span className="text-slate-500 text-[11px] font-sans">
                      {sample.unit}
                    </span>
                  </td>

                  {/* Received & Sampling Dates */}
                  <td className="py-3 px-4 font-mono text-slate-600">
                    <div className="flex flex-col">
                      <span>{sample.receivedDate}</span>
                      <span className="text-[10px] text-slate-400">
                        Sampled: {sample.samplingDate}
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    <PackagingStatusBadge status={sample.status} />
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(sample)}
                        title="View Full Technical Details"
                        className="h-7 px-2 text-xs text-pharma-blue hover:bg-pharma-blue/10"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(sample)}
                        title="Edit Sample Record"
                        className="h-7 px-2 text-xs text-slate-700 hover:bg-slate-100"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>

                      {/* Quick Disposition Actions */}
                      {sample.status !== "Released" && (
                        <button
                          onClick={() => onRequestStatusChange(sample, "Released")}
                          title="Quick Release (Pass)"
                          className="h-7 w-7 rounded flex items-center justify-center text-teal-pharma hover:bg-teal-pharma/10 transition-colors"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {sample.status !== "Rejected" && (
                        <button
                          onClick={() => onRequestStatusChange(sample, "Rejected")}
                          title="Flag Reject / OOS"
                          className="h-7 w-7 rounded flex items-center justify-center text-fail-red hover:bg-fail-red/10 transition-colors"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {sample.status !== "Quarantine" && (
                        <button
                          onClick={() => onRequestStatusChange(sample, "Quarantine")}
                          title="Move to Quarantine Hold"
                          className="h-7 w-7 rounded flex items-center justify-center text-warning-amber hover:bg-warning-amber/10 transition-colors"
                        >
                          <AlertTriangle className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 5. Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong>{Math.min(totalItems, (currentPage - 1) * pageSize + 1)}</strong> to{" "}
            <strong>{Math.min(totalItems, currentPage * pageSize)}</strong> of{" "}
            <strong>{totalItems}</strong> packaging samples
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-1.5">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-7 rounded border border-slate-200 bg-white px-1.5 text-xs font-semibold focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {/* Navigation Pages */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7 w-7 p-0"
              aria-label="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 w-7 p-0"
              aria-label="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
