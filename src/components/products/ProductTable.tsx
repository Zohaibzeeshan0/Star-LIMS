"use client";

import React, { useState, useMemo } from "react";
import {
  ProductSample,
  ProductStatus,
  DosageForm,
  BatchStatus,
  SampleType
} from "@/lib/types/product";
import { ProductStatusBadge } from "./ProductStatusBadge";
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
  Download,
  Clock,
  Pill,
  CheckCircle2,
  XCircle,
  PlusCircle,
  FlaskConical,
  Package
} from "lucide-react";

interface ProductTableProps {
  samples: ProductSample[];
  onView: (sample: ProductSample) => void;
  onEdit: (sample: ProductSample) => void;
  onRequestStatusChange: (sample: ProductSample, newStatus: ProductStatus) => void;
  onAddNew: () => void;
}

type SortField =
  | "id"
  | "productName"
  | "productCode"
  | "batchNumber"
  | "manufacturingDate"
  | "expiryDate"
  | "receivedDate";

export function ProductTable({
  samples,
  onView,
  onEdit,
  onRequestStatusChange,
  onAddNew
}: ProductTableProps) {
  // Filter States (Exact user requirements: dosage form, product, batch status, sample status, date range)
  const [searchQuery, setSearchQuery] = useState("");
  const [dosageFormFilter, setDosageFormFilter] = useState<DosageForm | "ALL">("ALL");
  const [productFilter, setProductFilter] = useState<string>("ALL");
  const [batchStatusFilter, setBatchStatusFilter] = useState<BatchStatus | "ALL">("ALL");
  const [sampleStatusFilter, setSampleStatusFilter] = useState<ProductStatus | "ALL">("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // Sorting States
  const [sortField, setSortField] = useState<SortField>("receivedDate");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 7;

  // Extract unique product names for product filter
  const uniqueProducts = useMemo(() => {
    return Array.from(new Set(samples.map((s) => s.productName))).sort();
  }, [samples]);

  // Filter & Search Logic (Search by sample ID, product name, product code, batch number)
  const filteredSamples = useMemo(() => {
    return samples.filter((sample) => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchId = sample.id.toLowerCase().includes(query);
        const matchName = sample.productName.toLowerCase().includes(query);
        const matchCode = sample.productCode.toLowerCase().includes(query);
        const matchBatch = sample.batchNumber.toLowerCase().includes(query);
        if (!matchId && !matchName && !matchCode && !matchBatch) {
          return false;
        }
      }

      // Dosage Form Filter
      if (dosageFormFilter !== "ALL" && sample.dosageForm !== dosageFormFilter) {
        return false;
      }

      // Product Name Filter
      if (productFilter !== "ALL" && sample.productName !== productFilter) {
        return false;
      }

      // Batch Status Filter
      if (batchStatusFilter !== "ALL" && sample.batchStatus !== batchStatusFilter) {
        return false;
      }

      // Sample Status Filter
      if (sampleStatusFilter !== "ALL" && sample.status !== sampleStatusFilter) {
        return false;
      }

      // Date Range Filter (against receivedDate or manufacturingDate)
      if (dateFrom && sample.receivedDate < dateFrom) {
        return false;
      }
      if (dateTo && sample.receivedDate > dateTo) {
        return false;
      }

      return true;
    });
  }, [samples, searchQuery, dosageFormFilter, productFilter, batchStatusFilter, sampleStatusFilter, dateFrom, dateTo]);

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
    setDosageFormFilter("ALL");
    setProductFilter("ALL");
    setBatchStatusFilter("ALL");
    setSampleStatusFilter("ALL");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = [
      "Sample ID",
      "Product Name",
      "Product Code",
      "Dosage Form",
      "Strength",
      "Batch Number",
      "Batch Status",
      "Manufacturing Date",
      "Expiry Date",
      "Received Date",
      "Sample Type",
      "Packaging Details",
      "Status",
      "Assigned Analyst"
    ];

    const rows = sortedSamples.map((s) => [
      `"${s.id}"`,
      `"${s.productName}"`,
      `"${s.productCode}"`,
      `"${s.dosageForm}"`,
      `"${s.strength}"`,
      `"${s.batchNumber}"`,
      `"${s.batchStatus}"`,
      `"${s.manufacturingDate}"`,
      `"${s.expiryDate}"`,
      `"${s.receivedDate}"`,
      `"${s.sampleType}"`,
      `"${s.packagingDetails}"`,
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
      `CitiPharma_Product_Samples_${new Date().toISOString().slice(0, 10)}.csv`
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
          <span className="font-semibold">Simulated Finished Product QC Environment</span>
          <span className="text-blue-600 font-normal hidden sm:inline">• Commercial release, IPQC, and stability records are mock data for demonstration</span>
        </div>
        <span className="font-mono text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-blue-200">
          MOCK DATA
        </span>
      </div>

      {/* Search and Filters Header */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box (Search by Sample ID, Product Name, Product Code, Batch Number) */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Sample ID, Product Name, Product Code, or Batch Number..."
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
              <PlusCircle className="h-3.5 w-3.5" />
              Add Product Sample
            </Button>
          </div>
        </div>

        {/* Filter Row 1: Dosage Form, Product, Batch Status, Sample Status */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
          {/* Dosage Form Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Dosage Form
            </label>
            <select
              value={dosageFormFilter}
              onChange={(e) => {
                setDosageFormFilter(e.target.value as DosageForm | "ALL");
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-md border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
            >
              <option value="ALL">All Dosage Forms</option>
              <option value="Tablets">Tablets</option>
              <option value="Capsules">Capsules</option>
              <option value="Syrups">Syrups</option>
              <option value="Suspensions">Suspensions</option>
              <option value="Creams">Creams</option>
              <option value="Injectables / Ampoules">Injectables / Ampoules</option>
            </select>
          </div>

          {/* Product Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Product Name
            </label>
            <select
              value={productFilter}
              onChange={(e) => {
                setProductFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-md border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
            >
              <option value="ALL">All Products</option>
              {uniqueProducts.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Batch Status Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Batch Status
            </label>
            <select
              value={batchStatusFilter}
              onChange={(e) => {
                setBatchStatusFilter(e.target.value as BatchStatus | "ALL");
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-md border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
            >
              <option value="ALL">All Batch Statuses</option>
              <option value="Commercial Batch">Commercial Batch</option>
              <option value="Validation Batch">Validation Batch</option>
              <option value="Pilot Batch">Pilot Batch</option>
              <option value="Stability Chamber Batch">Stability Chamber Batch</option>
              <option value="Quarantine Hold">Quarantine Hold</option>
            </select>
          </div>

          {/* Sample Status Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Sample Status
            </label>
            <select
              value={sampleStatusFilter}
              onChange={(e) => {
                setSampleStatusFilter(e.target.value as ProductStatus | "ALL");
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-md border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
            >
              <option value="ALL">All Sample Statuses</option>
              <option value="Registered">Registered</option>
              <option value="Under Testing">Under Testing</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Released">Released (Pass)</option>
              <option value="Quarantine">Quarantine</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Filter Row 2: Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 items-end">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Received Date From
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
              Received Date To
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-3.5">
                  <button
                    onClick={() => handleSort("id")}
                    className="flex items-center gap-1 hover:text-pharma-blue"
                  >
                    Sample ID / Type
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">
                  <button
                    onClick={() => handleSort("productName")}
                    className="flex items-center gap-1 hover:text-pharma-blue"
                  >
                    Product &amp; Strength
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">Dosage Form</th>
                <th className="py-3 px-3.5">
                  <button
                    onClick={() => handleSort("batchNumber")}
                    className="flex items-center gap-1 hover:text-pharma-blue"
                  >
                    Batch Details
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">
                  <button
                    onClick={() => handleSort("manufacturingDate")}
                    className="flex items-center gap-1 hover:text-pharma-blue"
                  >
                    Mfg / Exp Dates
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">
                  <button
                    onClick={() => handleSort("receivedDate")}
                    className="flex items-center gap-1 hover:text-pharma-blue"
                  >
                    Received Date
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">Sample Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedSamples.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Pill className="h-8 w-8 text-slate-300" />
                      <p className="font-semibold text-slate-700">No product batches matched your criteria.</p>
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
                  return (
                    <tr
                      key={sample.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Sample ID & Sample Type */}
                      <td className="py-3 px-3.5 align-top">
                        <div className="font-mono font-bold text-pharma-blue">
                          {sample.id}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {sample.productCode}
                        </div>
                        <div className="mt-1">
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                            {sample.sampleType}
                          </span>
                        </div>
                      </td>

                      {/* Product Name & Strength */}
                      <td className="py-3 px-3.5 align-top max-w-xs">
                        <div className="font-bold text-slate-800 leading-snug">
                          {sample.productName}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                          <span className="font-bold text-teal-pharma-dark">{sample.strength}</span>
                          <span>•</span>
                          <span className="text-slate-500">{sample.genericName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                          Pkg: {sample.packagingDetails}
                        </div>
                      </td>

                      {/* Dosage Form */}
                      <td className="py-3 px-3.5 align-top">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          <Pill className="h-3 w-3 text-slate-400" />
                          {sample.dosageForm}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Std: {sample.pharmacopeia}
                        </div>
                      </td>

                      {/* Batch Details */}
                      <td className="py-3 px-3.5 align-top">
                        <div className="font-mono font-bold text-pharma-blue">
                          {sample.batchNumber}
                        </div>
                        <div className="text-[10px] text-slate-600 font-semibold mt-0.5">
                          {sample.batchStatus}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Size: {sample.batchSize}
                        </div>
                      </td>

                      {/* Mfg / Exp Dates */}
                      <td className="py-3 px-3.5 align-top font-mono">
                        <div className="text-slate-800 font-semibold">
                          Exp: {sample.expiryDate}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Mfg: {sample.manufacturingDate}
                        </div>
                      </td>

                      {/* Received Date */}
                      <td className="py-3 px-3.5 align-top font-mono text-slate-700">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>{sample.receivedDate}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                          Sampled: {sample.quantitySampled} {sample.unit}
                        </div>
                      </td>

                      {/* Sample Status */}
                      <td className="py-3 px-3.5 align-top">
                        <ProductStatusBadge status={sample.status} />
                      </td>

                      {/* Row Actions */}
                      <td className="py-3 px-3.5 align-top text-right space-y-1">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(sample)}
                            className="h-7 w-7 p-0 text-slate-500 hover:text-pharma-blue hover:bg-slate-100"
                            title="View Finished Product Details & History"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(sample)}
                            className="h-7 w-7 p-0 text-slate-500 hover:text-pharma-blue hover:bg-slate-100"
                            title="Edit Product Record"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {/* Quick Status Workflow Action Buttons */}
                        <div className="flex items-center justify-end gap-1">
                          {sample.status !== "Released" && (
                            <button
                              onClick={() => onRequestStatusChange(sample, "Released")}
                              className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors"
                              title="Authorize Commercial Batch Release"
                            >
                              Release
                            </button>
                          )}
                          {sample.status !== "Quarantine" && sample.status !== "Rejected" && (
                            <button
                              onClick={() => onRequestStatusChange(sample, "Quarantine")}
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors"
                              title="Hold Batch in Quarantine"
                            >
                              Hold
                            </button>
                          )}
                          {sample.status !== "Rejected" && (
                            <button
                              onClick={() => onRequestStatusChange(sample, "Rejected")}
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 transition-colors"
                              title="Reject Batch (OOS)"
                            >
                              Reject
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
            <span className="font-bold text-slate-800">{filteredSamples.length}</span> product
            samples
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
