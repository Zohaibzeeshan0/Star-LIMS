"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SampleRecord, SampleStatus, SampleCategory } from "@/lib/types/sample";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Eye,
  FileCheck2,
  Edit3,
  Download,
  ArrowUpDown,
  Sparkles
} from "lucide-react";

interface SampleTableProps {
  samples: SampleRecord[];
  initialCategory?: SampleCategory | "ALL";
  onViewDetail: (sample: SampleRecord) => void;
  onEnterResults: (sample: SampleRecord) => void;
}

export function SampleTable({
  samples,
  initialCategory = "ALL",
  onViewDetail,
  onEnterResults,
}: SampleTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortField, setSortField] = useState<keyof SampleRecord>("receivedDate");
  const [sortAsc, setSortAsc] = useState(false);

  // Filtered & Sorted
  const filteredSamples = useMemo(() => {
    return samples.filter((sample) => {
      // Status filter
      if (selectedStatus !== "ALL" && sample.status !== selectedStatus) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "ALL" && sample.category !== selectedCategory) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = sample.id.toLowerCase().includes(q);
        const matchBatch = sample.batchNumber.toLowerCase().includes(q);
        const matchProduct = sample.productName.toLowerCase().includes(q);
        const matchAnalyst = sample.analyst.toLowerCase().includes(q);
        const matchSpec = sample.targetSpecification.toLowerCase().includes(q);
        return matchId || matchBatch || matchProduct || matchAnalyst || matchSpec;
      }
      return true;
    }).sort((a, b) => {
      const valA = a[sortField] || "";
      const valB = b[sortField] || "";
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [samples, selectedStatus, selectedCategory, searchQuery, sortField, sortAsc]);

  const toggleSort = (field: keyof SampleRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Sample ID",
      "Batch Number",
      "Product Name",
      "Category",
      "Pharmacopeia",
      "Status",
      "Analyst",
      "Received Date",
      "Target Spec",
      "Observed Summary"
    ];
    const rows = filteredSamples.map((s) => [
      `"${s.id}"`,
      `"${s.batchNumber}"`,
      `"${s.productName}"`,
      `"${s.category}"`,
      `"${s.pharmacopeia}"`,
      `"${s.status}"`,
      `"${s.analyst}"`,
      `"${s.receivedDate}"`,
      `"${s.targetSpecification.replace(/"/g, '""')}"`,
      `"${s.observedSummary.replace(/"/g, '""')}"`
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `Citi_Pharma_LIMS_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const statuses = [
    { label: "All", value: "ALL", count: samples.length },
    { label: "Pass / Released", value: "Pass/Released", count: samples.filter(s => s.status === "Pass/Released").length },
    { label: "Quarantine / Retest", value: "Quarantine/Retest", count: samples.filter(s => s.status === "Quarantine/Retest").length },
    { label: "Fail / Rejected", value: "Fail/Rejected", count: samples.filter(s => s.status === "Fail/Rejected").length },
    { label: "In Testing", value: "In Testing", count: samples.filter(s => s.status === "In Testing").length },
  ];

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
      {/* Table Control Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-5 border-b border-slate-100 bg-slate-50/50">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Sample ID, Lot #, Product Name, Analyst..."
            className="pl-9 bg-white"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200/60">
          {statuses.map((st) => (
            <button
              key={st.value}
              onClick={() => setSelectedStatus(st.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                selectedStatus === st.value
                  ? "bg-white text-pharma-blue shadow-xs font-bold"
                  : "text-slate-600 hover:text-pharma-blue hover:bg-white/50"
              }`}
            >
              <span>{st.label}</span>
              <span className="rounded-full bg-slate-200/80 px-1.5 py-0.2 text-[10px] text-slate-700">
                {st.count}
              </span>
            </button>
          ))}
        </div>

        {/* Category & Export Actions */}
        <div className="flex items-center gap-2">
          {initialCategory === "ALL" && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs focus:outline-none focus:border-pharma-blue"
            >
              <option value="ALL">All Categories</option>
              <option value="Packaging Material">Packaging Materials</option>
              <option value="Raw Material (API)">Raw Materials (APIs)</option>
              <option value="Raw Material Retesting">Raw Material Retesting</option>
              <option value="Product Sample (Finished)">Finished Products</option>
              <option value="Product Sample (In-Process)">In-Process / Utilities</option>
              <option value="Product Sample (Stability)">Stability Testing</option>
              <option value="Sterile Injectable">Sterile Injectables</option>
            </select>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-1.5 text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[850px]">
          <thead className="border-b border-slate-200 bg-slate-100/70 font-heading text-[11px] font-bold uppercase tracking-wider text-pharma-blue">
            <tr>
              <th
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-200/50"
                onClick={() => toggleSort("id")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Sample ID / Lot</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>
              <th
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-200/50"
                onClick={() => toggleSort("productName")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Product & Specification</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4">Analytical Tests & Limits</th>
              <th className="py-3.5 px-4">Assigned Analyst</th>
              <th
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-200/50"
                onClick={() => toggleSort("receivedDate")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Received</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4">Compliance Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSamples.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter className="h-8 w-8 text-slate-300" />
                    <span className="font-semibold text-sm text-slate-600">
                      No matching pharmaceutical records found
                    </span>
                    <span className="text-xs text-slate-400">
                      Try clearing your search query or selecting a different status filter.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSamples.map((sample) => (
                <tr
                  key={sample.id}
                  className="transition-colors hover:bg-sky-50/40"
                >
                  {/* Sample ID & Lot */}
                  <td className="py-3.5 px-4 font-mono">
                    <div className="flex flex-col">
                      <span className="font-bold text-pharma-blue hover:underline cursor-pointer" onClick={() => onViewDetail(sample)}>
                        {sample.id}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Lot: <strong className="text-slate-700">{sample.batchNumber}</strong>
                      </span>
                    </div>
                  </td>

                  {/* Product & Category */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col max-w-xs">
                      <span className="font-bold text-slate-900 text-[13px]">
                        {sample.productName}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-medium text-teal-pharma-dark text-[11px]">
                          {sample.category}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 font-mono text-[10px]">
                          {sample.pharmacopeia}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Tests & Limits */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col max-w-sm">
                      <span className="font-semibold text-slate-800 line-clamp-1">
                        {sample.targetSpecification}
                      </span>
                      <span className="text-[11px] text-slate-500 italic line-clamp-1 mt-0.5">
                        Observed: {sample.observedSummary}
                      </span>
                    </div>
                  </td>

                  {/* Analyst */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">
                        {sample.analyst}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {sample.analystDepartment}
                      </span>
                    </div>
                  </td>

                  {/* Received */}
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {sample.receivedDate}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={sample.status} />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetail(sample)}
                        title="View Monograph & Specifications"
                        className="h-7 px-2 text-xs text-pharma-blue hover:bg-pharma-blue/10"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEnterResults(sample)}
                        title="Enter / Update Test Observations"
                        className="h-7 px-2 text-xs text-slate-700 hover:bg-slate-100"
                      >
                        <Edit3 className="h-3.5 w-3.5 mr-1" />
                        Results
                      </Button>
                      <Link href={`/coa?sampleId=${sample.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Generate Certificate of Analysis"
                          className="h-7 px-2 text-xs text-teal-pharma hover:bg-teal-pharma/10 font-bold"
                        >
                          <FileCheck2 className="h-3.5 w-3.5 mr-1" />
                          CoA
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
        <span>
          Showing <strong>{filteredSamples.length}</strong> of <strong>{samples.length}</strong> laboratory records
        </span>
        <span className="font-mono text-[11px] text-slate-400">
          Citi Pharma 21 CFR Part 11 Compliant Data Repository
        </span>
      </div>
    </div>
  );
}
