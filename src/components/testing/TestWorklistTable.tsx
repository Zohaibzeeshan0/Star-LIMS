"use client";

import React, { useState, useMemo } from "react";
import {
  TestWorklistItem,
  TestStatus,
  TestType,
} from "@/lib/types/testing";
import { TestStatusBadge } from "./TestStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit3,
  Calendar,
  Download,
  Clock,
  FlaskConical,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  User,
  Gauge
} from "lucide-react";

interface TestWorklistTableProps {
  tests: TestWorklistItem[];
  onView: (test: TestWorklistItem) => void;
  onEnterResults: (test: TestWorklistItem) => void;
  onReview: (test: TestWorklistItem) => void;
  onRequestStatusChange?: (test: TestWorklistItem, newStatus: TestStatus) => void;
}

type SortField =
  | "id"
  | "sampleId"
  | "materialOrProduct"
  | "batchNumber"
  | "dueDate"
  | "status"
  | "testType";

export function TestWorklistTable({
  tests,
  onView,
  onEnterResults,
  onReview,
  onRequestStatusChange,
}: TestWorklistTableProps) {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TestStatus | "ALL">("ALL");
  const [testTypeFilter, setTestTypeFilter] = useState<TestType | "ALL">("ALL");
  const [analystFilter, setAnalystFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // Sorting
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Extract unique analysts
  const uniqueAnalysts = useMemo(() => {
    return Array.from(new Set(tests.map((t) => t.assignedAnalyst))).sort();
  }, [tests]);

  // Extract unique categories
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(tests.map((t) => t.sampleCategory))).sort();
  }, [tests]);

  // Filtering Logic
  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchId = test.id.toLowerCase().includes(query);
        const matchSample = test.sampleId.toLowerCase().includes(query);
        const matchMaterial = test.materialOrProduct.toLowerCase().includes(query);
        const matchCode = test.materialOrProductCode.toLowerCase().includes(query);
        const matchBatch = test.batchNumber.toLowerCase().includes(query);
        const matchAnalyst = test.assignedAnalyst.toLowerCase().includes(query);
        const matchType = test.testType.toLowerCase().includes(query);
        if (!matchId && !matchSample && !matchMaterial && !matchCode && !matchBatch && !matchAnalyst && !matchType) {
          return false;
        }
      }

      // Status
      if (statusFilter !== "ALL" && test.status !== statusFilter) {
        return false;
      }

      // Test Type
      if (testTypeFilter !== "ALL" && test.testType !== testTypeFilter) {
        return false;
      }

      // Analyst
      if (analystFilter !== "ALL" && test.assignedAnalyst !== analystFilter) {
        return false;
      }

      // Category
      if (categoryFilter !== "ALL" && test.sampleCategory !== categoryFilter) {
        return false;
      }

      // Due Date Range
      if (dateFrom && test.dueDate < dateFrom) {
        return false;
      }
      if (dateTo && test.dueDate > dateTo) {
        return false;
      }

      return true;
    });
  }, [tests, searchQuery, statusFilter, testTypeFilter, analystFilter, categoryFilter, dateFrom, dateTo]);

  // Sorting Logic
  const sortedTests = useMemo(() => {
    return [...filteredTests].sort((a, b) => {
      let valA: string = "";
      let valB: string = "";

      switch (sortField) {
        case "id":
          valA = a.id;
          valB = b.id;
          break;
        case "sampleId":
          valA = a.sampleId;
          valB = b.sampleId;
          break;
        case "materialOrProduct":
          valA = a.materialOrProduct;
          valB = b.materialOrProduct;
          break;
        case "batchNumber":
          valA = a.batchNumber;
          valB = b.batchNumber;
          break;
        case "dueDate":
          valA = a.dueDate;
          valB = b.dueDate;
          break;
        case "status":
          valA = a.status;
          valB = b.status;
          break;
        case "testType":
          valA = a.testType;
          valB = b.testType;
          break;
      }

      const comparison = valA.localeCompare(valB);
      return sortAsc ? comparison : -comparison;
    });
  }, [filteredTests, sortField, sortAsc]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedTests.length / pageSize) || 1;
  const paginatedTests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedTests.slice(start, start + pageSize);
  }, [sortedTests, currentPage, pageSize]);

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
    setTestTypeFilter("ALL");
    setAnalystFilter("ALL");
    setCategoryFilter("ALL");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const isFiltering =
    searchQuery !== "" ||
    statusFilter !== "ALL" ||
    testTypeFilter !== "ALL" ||
    analystFilter !== "ALL" ||
    categoryFilter !== "ALL" ||
    dateFrom !== "" ||
    dateTo !== "";

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = [
      "Test ID",
      "Sample ID",
      "Stream Category",
      "Material / Product",
      "Batch Number",
      "Test Type",
      "Assigned Analyst",
      "Due Date",
      "Testing Date",
      "Status",
      "OOS Flag",
      "Parameters Count",
    ];

    const rows = sortedTests.map((t) => [
      `"${t.id}"`,
      `"${t.sampleId}"`,
      `"${t.sampleCategory}"`,
      `"${t.materialOrProduct}"`,
      `"${t.batchNumber}"`,
      `"${t.testType}"`,
      `"${t.assignedAnalyst}"`,
      `"${t.dueDate}"`,
      `"${t.testingDate || ""}"`,
      `"${t.status}"`,
      `"${t.isOOS ? "YES" : "NO"}"`,
      `"${t.parameters.length}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `citi_pharma_test_worklist_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by Test ID, Sample ID, Material / Product, Batch #, or Analyst..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9 text-xs bg-slate-50/50 border-slate-200 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end lg:self-auto">
            {isFiltering && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs h-9 text-slate-600 hover:text-slate-900 border-dashed"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset Filters
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="text-xs h-9 font-semibold text-slate-700 gap-1.5"
            >
              <Download className="h-3.5 w-3.5 text-pharma-blue" />
              Export Worklist CSV
            </Button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100">
          {/* Status Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Test Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full h-8 text-xs bg-slate-50/50 border border-slate-200 rounded-md px-2 text-slate-700 focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Statuses ({tests.length})</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Out of Specification">Out of Specification</option>
            </select>
          </div>

          {/* Test Type Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Test Type
            </label>
            <select
              value={testTypeFilter}
              onChange={(e) => {
                setTestTypeFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full h-8 text-xs bg-slate-50/50 border border-slate-200 rounded-md px-2 text-slate-700 focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Test Types</option>
              <option value="HPLC Assay & Potency">HPLC Assay & Potency</option>
              <option value="Dissolution Rate & Drug Release">Dissolution Rate</option>
              <option value="Karl Fischer Moisture Content">Karl Fischer Moisture</option>
              <option value="Sterility & Endotoxin (LAL)">Sterility & Endotoxin</option>
              <option value="Microbial Enumeration (TAMC/TYMC)">Microbial (TAMC/TYMC)</option>
              <option value="Disintegration & Hardness">Disintegration & Hardness</option>
              <option value="Gas Chromatography Residual Solvents">GC Residual Solvents</option>
              <option value="FTIR Identification & Description">FTIR Identification</option>
              <option value="Packaging Foil Pinhole & Leak Test">Packaging Foil & Leak</option>
            </select>
          </div>

          {/* Assigned Analyst Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Assigned Analyst
            </label>
            <select
              value={analystFilter}
              onChange={(e) => {
                setAnalystFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-8 text-xs bg-slate-50/50 border border-slate-200 rounded-md px-2 text-slate-700 focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Analysts ({uniqueAnalysts.length})</option>
              {uniqueAnalysts.map((analyst) => (
                <option key={analyst} value={analyst}>
                  {analyst}
                </option>
              ))}
            </select>
          </div>

          {/* Sample Stream / Category Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Sample Stream
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-8 text-xs bg-slate-50/50 border border-slate-200 rounded-md px-2 text-slate-700 focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Sample Streams</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date Filter */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Due Date Filter
            </label>
            <div className="flex items-center gap-1">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-1/2 h-8 text-[11px] bg-slate-50/50 border border-slate-200 rounded px-1 text-slate-700"
                title="Due Date From"
              />
              <span className="text-[10px] text-slate-400">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-1/2 h-8 text-[11px] bg-slate-50/50 border border-slate-200 rounded px-1 text-slate-700"
                title="Due Date To"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Worklist Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[950px]">
            <thead className="bg-[#123B63] text-white">
              <tr>
                <th
                  onClick={() => handleSort("id")}
                  className="py-3 px-3.5 font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Test ID</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-300" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("sampleId")}
                  className="py-3 px-3.5 font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Sample ID</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-300" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("materialOrProduct")}
                  className="py-3 px-3.5 font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Material / Product</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-300" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("batchNumber")}
                  className="py-3 px-3.5 font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Batch #</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-300" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("testType")}
                  className="py-3 px-3.5 font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Test Type</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-300" />
                  </div>
                </th>

                <th className="py-3 px-3.5 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span>Assigned Analyst</span>
                  </div>
                </th>

                <th
                  onClick={() => handleSort("dueDate")}
                  className="py-3 px-3.5 font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Due Date</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-300" />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("status")}
                  className="py-3 px-3.5 font-semibold cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>QC Status</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-300" />
                  </div>
                </th>

                <th className="py-3 px-3.5 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedTests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FlaskConical className="h-10 w-10 text-slate-300" />
                      <span className="font-semibold text-sm text-slate-700">
                        No testing records found
                      </span>
                      <p className="text-xs text-slate-500 max-w-sm">
                        No laboratory tests matched your search query or filter criteria. Try adjusting or resetting your filters.
                      </p>
                      {isFiltering && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResetFilters}
                          className="mt-2 text-xs"
                        >
                          Clear All Filters
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTests.map((test) => {
                  const todayStr = "2026-10-16";
                  const isOverdue = test.dueDate < todayStr && test.status !== "Reviewed" && test.status !== "Completed";

                  return (
                    <tr
                      key={test.id}
                      className={`hover:bg-blue-50/40 transition-colors group ${
                        test.isOOS ? "bg-rose-50/25" : ""
                      }`}
                    >
                      {/* Test ID */}
                      <td className="py-3 px-3.5 font-mono font-bold text-pharma-blue whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{test.id}</span>
                          {test.isOOS && (
                            <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" title="OOS Flagged" />
                          )}
                        </div>
                      </td>

                      {/* Sample ID & Stream */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="font-mono text-slate-700 block font-medium">
                          {test.sampleId}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                          {test.sampleCategory}
                        </span>
                      </td>

                      {/* Material / Product Name & Code */}
                      <td className="py-3 px-3.5 max-w-[200px]">
                        <span className="font-semibold text-slate-800 line-clamp-1" title={test.materialOrProduct}>
                          {test.materialOrProduct}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {test.materialOrProductCode}
                        </span>
                      </td>

                      {/* Batch Number */}
                      <td className="py-3 px-3.5 font-mono text-slate-700 whitespace-nowrap font-medium">
                        {test.batchNumber}
                      </td>

                      {/* Test Type */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {test.testType}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[160px]">
                          {test.parameters.length} parameter{test.parameters.length > 1 ? "s" : ""}
                        </div>
                      </td>

                      {/* Assigned Analyst */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3 w-3 text-slate-400" />
                          <span className="font-medium text-slate-800">
                            {test.assignedAnalyst}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 truncate block max-w-[130px]">
                          {test.instrumentReference.split("(")[0]}
                        </span>
                      </td>

                      {/* Due Date */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span
                            className={`font-mono text-xs ${
                              isOverdue
                                ? "text-rose-600 font-bold"
                                : "text-slate-700"
                            }`}
                          >
                            {test.dueDate}
                          </span>
                        </div>
                        {isOverdue && (
                          <span className="text-[9px] font-extrabold text-rose-600 uppercase tracking-wider block">
                            Overdue
                          </span>
                        )}
                      </td>

                      {/* QC Status Badge */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <TestStatusBadge status={test.status} isOOS={test.isOOS} />
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Dossier Button */}
                          <button
                            onClick={() => onView(test)}
                            title="View Test Dossier"
                            className="p-1.5 text-slate-500 hover:text-pharma-blue hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Enter Results Button */}
                          <button
                            onClick={() => onEnterResults(test)}
                            title="Enter or Edit Analytical Results"
                            className="p-1.5 text-slate-500 hover:text-teal-pharma hover:bg-teal-50 rounded-md transition-colors"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          {/* QA Review Button */}
                          <button
                            onClick={() => onReview(test)}
                            title="QA Monograph Review & Sign-off"
                            className={`p-1.5 rounded-md transition-colors ${
                              test.status === "Reviewed"
                                ? "text-teal-600 hover:bg-teal-50"
                                : test.status === "Pending Review"
                                ? "text-amber-600 hover:bg-amber-50 font-bold ring-1 ring-amber-300"
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <ShieldCheck className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Counter Bar */}
        <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing{" "}
            <strong>
              {sortedTests.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}
            </strong>{" "}
            to{" "}
            <strong>
              {Math.min(currentPage * pageSize, sortedTests.length)}
            </strong>{" "}
            of <strong>{sortedTests.length}</strong> laboratory test records
            {filteredTests.length !== tests.length && (
              <span className="text-slate-400 ml-1">
                (filtered from {tests.length} total)
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="h-8 px-2 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-0.5" />
              Prev
            </Button>

            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`h-7 w-7 text-xs rounded-md font-semibold transition-colors ${
                    currentPage === pg
                      ? "bg-pharma-blue text-white shadow-2xs"
                      : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  {pg}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="h-8 px-2 text-xs"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
