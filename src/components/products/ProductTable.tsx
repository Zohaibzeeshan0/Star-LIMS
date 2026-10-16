"use client";

import React, { useState, useMemo } from "react";
import {
  ProductSample,
  ProductStatus,
  DosageForm,
  TestingStage
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
  Layers,
  MapPin,
  Pill,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Flame,
  PlusCircle
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
  | "batchNumber"
  | "manufacturingDate"
  | "expiryDate";

export function ProductTable({
  samples,
  onView,
  onEdit,
  onRequestStatusChange,
  onAddNew
}: ProductTableProps) {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "ALL">("ALL");
  const [stageFilter, setStageFilter] = useState<TestingStage | "ALL">("ALL");
  const [dosageFormFilter, setDosageFormFilter] = useState<DosageForm | "ALL">("ALL");

  // Sorting States
  const [sortField, setSortField] = useState<SortField>("manufacturingDate");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

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
        const matchCode = sample.productCode.toLowerCase().includes(query);
        const matchName = sample.productName.toLowerCase().includes(query);
        const matchGeneric = sample.genericName.toLowerCase().includes(query);
        const matchBatch = sample.batchNumber.toLowerCase().includes(query);
        const matchLine = sample.productionLine.toLowerCase().includes(query);
        if (!matchId && !matchCode && !matchName && !matchGeneric && !matchBatch && !matchLine) {
          return false;
        }
      }

      // Status
      if (statusFilter !== "ALL" && sample.status !== statusFilter) {
        return false;
      }

      // Stage
      if (stageFilter !== "ALL" && sample.stage !== stageFilter) {
        return false;
      }

      // Dosage Form
      if (dosageFormFilter !== "ALL" && sample.dosageForm !== dosageFormFilter) {
        return false;
      }

      return true;
    });
  }, [samples, searchQuery, statusFilter, stageFilter, dosageFormFilter]);

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
    setStageFilter("ALL");
    setDosageFormFilter("ALL");
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = [
      "Product ID",
      "Product Code",
      "Product Name",
      "Generic Name",
      "Dosage Form",
      "Testing Stage",
      "Stability Interval",
      "Batch Number",
      "Batch Size",
      "Production Line",
      "Mfg Date",
      "Exp Date",
      "Status",
      "QA Release Director"
    ];

    const rows = sortedSamples.map((s) => [
      `"${s.id}"`,
      `"${s.productCode}"`,
      `"${s.productName}"`,
      `"${s.genericName}"`,
      `"${s.dosageForm}"`,
      `"${s.stage}"`,
      `"${s.stabilityInterval || "N/A"}"`,
      `"${s.batchNumber}"`,
      `"${s.batchSize}"`,
      `"${s.productionLine}"`,
      `"${s.manufacturingDate}"`,
      `"${s.expiryDate}"`,
      `"${s.status}"`,
      `"${s.reviewedBy}"`
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
      {/* Search and Filters Header */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Product ID, Code, Brand, Generic, Batch #, Line..."
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
              Register Batch Sample
            </Button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
          {/* Status Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              QC Disposition Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as ProductStatus | "ALL");
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-md border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
            >
              <option value="ALL">All Statuses</option>
              <option value="Released">Released (Pass)</option>
              <option value="Under Testing">Under Testing</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Registered">Registered</option>
              <option value="Quarantine">Quarantine (Investigation)</option>
              <option value="Rejected">Rejected (OOS)</option>
            </select>
          </div>

          {/* Testing Stage Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Testing Stage / Stream
            </label>
            <select
              value={stageFilter}
              onChange={(e) => {
                setStageFilter(e.target.value as TestingStage | "ALL");
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-md border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-pharma-blue"
            >
              <option value="ALL">All Streams</option>
              <option value="Finished Product Release (FPR)">Finished Commercial Release</option>
              <option value="In-Process Quality Control (IPQC)">In-Process IPQC Controls</option>
              <option value="ICH Stability (Accelerated 40°C/75% RH)">ICH Accelerated Stability (40°C)</option>
              <option value="ICH Stability (Real-Time 25°C/60% RH)">ICH Real-Time Stability (25°C)</option>
              <option value="Sterile Parenteral Release">Sterile Parenteral Vials / Ampoules</option>
            </select>
          </div>

          {/* Dosage Form */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Pharmaceutical Form
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
              <option value="Film-Coated Tablets">Film-Coated Tablets</option>
              <option value="Extended-Release Tablets">Extended-Release Tablets</option>
              <option value="Hard Gelatin Capsules">Hard Gelatin Capsules</option>
              <option value="Oral Liquid / Syrup / Suspension">Oral Liquids & Syrups</option>
              <option value="Sterile Lyophilized Vial / Ampoule">Sterile Injectables</option>
              <option value="Topical Cream / Ointment">Topical Semi-Solids</option>
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
                    Sample ID / Stream
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">
                  <button
                    onClick={() => handleSort("productName")}
                    className="flex items-center gap-1 hover:text-pharma-blue"
                  >
                    Product & Generic Name
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">
                  <button
                    onClick={() => handleSort("batchNumber")}
                    className="flex items-center gap-1 hover:text-pharma-blue"
                  >
                    Batch # / Presentation
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">Production Facility</th>
                <th className="py-3 px-3.5">
                  <button
                    onClick={() => handleSort("expiryDate")}
                    className="flex items-center gap-1 hover:text-pharma-blue"
                  >
                    Shelf-Life (Mfg / Exp)
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3.5">QC Disposition</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedSamples.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Pill className="h-8 w-8 text-slate-300" />
                      <p className="font-semibold text-slate-700">No product batches matched your criteria.</p>
                      <p className="text-[11px] text-slate-400">
                        Try adjusting your search terms or filters.
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
                      {/* Product ID & Stage */}
                      <td className="py-3 px-3.5 align-top">
                        <div className="font-mono font-bold text-pharma-blue">
                          {sample.id}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {sample.productCode}
                        </div>
                        <div className="mt-1">
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                            {sample.dosageForm}
                          </span>
                        </div>
                      </td>

                      {/* Product Name & Generic */}
                      <td className="py-3 px-3.5 align-top max-w-xs">
                        <div className="font-bold text-slate-800 leading-snug">
                          {sample.productName}
                        </div>
                        <div className="text-[11px] text-teal-pharma-dark font-medium mt-0.5">
                          {sample.genericName}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Market: {sample.targetMarket} • Standard: {sample.pharmacopeia}
                        </div>
                      </td>

                      {/* Batch & Presentation */}
                      <td className="py-3 px-3.5 align-top">
                        <div className="font-mono font-bold text-pharma-blue">
                          {sample.batchNumber}
                        </div>
                        <div className="text-[10px] text-slate-600 font-semibold mt-0.5">
                          Size: {sample.batchSize}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[180px] mt-0.5">
                          {sample.packagingPresentation}
                        </div>
                      </td>

                      {/* Production Facility */}
                      <td className="py-3 px-3.5 align-top">
                        <div className="text-slate-700 font-medium leading-snug">
                          {sample.productionLine}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Sampling: {sample.samplingStage}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                          Sampled: {sample.quantitySampled} {sample.unit}
                        </div>
                      </td>

                      {/* Mfg / Exp Dates */}
                      <td className="py-3 px-3.5 align-top">
                        <div className="flex items-center gap-1 text-slate-800">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span className="font-semibold">Exp: {sample.expiryDate}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Mfg: {sample.manufacturingDate}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Drawn: {sample.samplingDate}
                        </div>
                      </td>

                      {/* Status & Stage */}
                      <td className="py-3 px-3.5 align-top">
                        <ProductStatusBadge
                          status={sample.status}
                          stage={sample.stage}
                          stabilityInterval={sample.stabilityInterval}
                        />
                      </td>

                      {/* Row Actions */}
                      <td className="py-3 px-3.5 align-top text-right space-y-1">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(sample)}
                            className="h-7 w-7 p-0 text-slate-500 hover:text-pharma-blue hover:bg-slate-100"
                            title="View Finished Product Release Certificate / Protocol"
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
            <span className="font-bold text-slate-800">{filteredSamples.length}</span> batch
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
