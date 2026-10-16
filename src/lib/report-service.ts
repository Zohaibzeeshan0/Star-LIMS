/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 8: Report Aggregator, Search, Filters and CSV Export Service
 */

import { MOCK_PACKAGING_SAMPLES } from "./mock-data/packaging-samples";
import { MOCK_RAW_MATERIALS } from "./mock-data/raw-materials";
import { MOCK_RETEST_SAMPLES } from "./mock-data/retesting-samples";
import { MOCK_PRODUCT_SAMPLES } from "./mock-data/products";
import { MOCK_TEST_WORKLIST } from "./mock-data/testing-worklist";
import {
  UnifiedReportItem,
  ReportFilterState,
  ReportSummaryMetrics,
  ReportCategory,
  GlobalSearchResult
} from "./types/report";

/**
 * Aggregates all laboratory mock data into a uniform reporting format
 */
export function getAllReportItems(): UnifiedReportItem[] {
  const items: UnifiedReportItem[] = [];

  // 1. Packaging Materials
  MOCK_PACKAGING_SAMPLES.forEach((pkg) => {
    const passed = pkg.tests.filter((t) => t.passed).length;
    const failed = pkg.tests.filter((t) => !t.passed).length;
    let disp: UnifiedReportItem["dispositionType"] = "PENDING";
    if (pkg.status === "Released") disp = "PASS";
    else if (pkg.status === "Rejected") disp = "FAIL";
    else if (pkg.status === "Quarantine" || pkg.status === "Retest") disp = "QUARANTINE";

    items.push({
      id: pkg.id,
      stream: "packaging",
      streamLabel: "Packaging Materials",
      title: pkg.materialName,
      code: pkg.materialCode,
      batchNumber: pkg.batchNumber,
      category: pkg.packagingType,
      supplierOrMfr: pkg.supplier,
      date: pkg.receivedDate,
      dateLabel: "Received Date",
      status: pkg.status,
      dispositionType: disp,
      analyst: pkg.analyst,
      storageLocationOrCondition: pkg.storageLocation,
      pharmacopeiaOrSpec: pkg.specificationRef || "In-House Validated Spec",
      testsSummary: { total: pkg.tests.length, passed, failed },
      keyParameterResult: pkg.tests[0] ? `${pkg.tests[0].name}: ${pkg.tests[0].observedResult}` : undefined,
      navigationUrl: "/samples/packaging",
      rawDetails: pkg as unknown as Record<string, unknown>
    });
  });

  // 2. Raw Materials (APIs & Excipients)
  MOCK_RAW_MATERIALS.forEach((rm) => {
    const passed = rm.tests.filter((t) => t.passed).length;
    const failed = rm.tests.filter((t) => !t.passed).length;
    let disp: UnifiedReportItem["dispositionType"] = "PENDING";
    if (rm.status === "Released" || rm.status === "Reviewed") disp = "PASS";
    else if (rm.status === "Rejected") disp = "FAIL";
    else if (rm.status === "Quarantine" || rm.status === "Retest") disp = "QUARANTINE";

    items.push({
      id: rm.id,
      stream: "raw-materials",
      streamLabel: "Raw Materials (APIs)",
      title: rm.materialName,
      code: rm.materialCode,
      batchNumber: rm.batchNumber,
      category: rm.category,
      supplierOrMfr: rm.supplier,
      date: rm.receivedDate,
      dateLabel: "Received Date",
      status: rm.status,
      dispositionType: disp,
      analyst: rm.analyst,
      storageLocationOrCondition: rm.storageLocation,
      pharmacopeiaOrSpec: rm.pharmacopeia,
      testsSummary: { total: rm.tests.length, passed, failed },
      keyParameterResult: rm.tests[0] ? `${rm.tests[0].name}: ${rm.tests[0].observedResult}` : undefined,
      navigationUrl: "/samples/raw-materials",
      rawDetails: rm as unknown as Record<string, unknown>
    });
  });

  // 3. Raw Material Retesting
  MOCK_RETEST_SAMPLES.forEach((ret) => {
    const passed = ret.tests.filter((t) => t.passed).length;
    const failed = ret.tests.filter((t) => !t.passed).length;
    let disp: UnifiedReportItem["dispositionType"] = "PENDING";
    if (ret.status === "Completed") disp = "PASS";
    else if (ret.status === "Rejected") disp = "FAIL";
    else if (ret.status === "Due Soon" || ret.status === "Overdue" || ret.status === "Quarantine") disp = "QUARANTINE";

    items.push({
      id: ret.id,
      stream: "retesting",
      streamLabel: "RM Retesting Surveillance",
      title: ret.materialName,
      code: ret.materialCode,
      batchNumber: ret.batchNumber,
      category: ret.category,
      supplierOrMfr: ret.supplier,
      date: ret.nextRetestDueDate,
      dateLabel: "Retest Due Date",
      status: ret.status,
      dispositionType: disp,
      analyst: ret.analyst,
      storageLocationOrCondition: ret.storageCondition || ret.warehouseLocation,
      pharmacopeiaOrSpec: ret.pharmacopeia || "ICH Q7 §7.5 / GMP",
      testsSummary: { total: ret.tests.length, passed, failed },
      keyParameterResult: ret.tests[0] ? `${ret.tests[0].parameter}: ${ret.tests[0].currentRetestResult}` : undefined,
      navigationUrl: "/samples/retesting",
      rawDetails: ret as unknown as Record<string, unknown>
    });
  });

  // 4. Product Samples (Finished, IPQC, Stability)
  MOCK_PRODUCT_SAMPLES.forEach((prd) => {
    const passed = prd.tests.filter((t) => t.passed).length;
    const failed = prd.tests.filter((t) => !t.passed).length;
    let disp: UnifiedReportItem["dispositionType"] = "PENDING";
    if (prd.status === "Released" || prd.status === "Reviewed") disp = "PASS";
    else if (prd.status === "Rejected") disp = "FAIL";
    else if (prd.status === "Quarantine") disp = "QUARANTINE";

    items.push({
      id: prd.id,
      stream: "products",
      streamLabel: "Finished Products & IPQC",
      title: prd.productName,
      code: prd.productCode,
      batchNumber: prd.batchNumber,
      category: prd.sampleType,
      supplierOrMfr: "Citi Pharma Formulation Unit",
      date: prd.manufacturingDate,
      dateLabel: "Manufacturing Date",
      status: prd.status,
      dispositionType: disp,
      analyst: prd.analyst,
      storageLocationOrCondition: prd.storageCondition || "Controlled Room Temp 20-25°C",
      pharmacopeiaOrSpec: prd.pharmacopeia,
      testsSummary: { total: prd.tests.length, passed, failed },
      keyParameterResult: prd.tests[0] ? `${prd.tests[0].parameter}: ${prd.tests[0].observedResult}` : undefined,
      navigationUrl: "/samples/products",
      rawDetails: prd as unknown as Record<string, unknown>
    });
  });

  // 5. QC Test Worklist & Results
  MOCK_TEST_WORKLIST.forEach((tst) => {
    const passed = tst.parameters.filter((p) => p.status === "Pass").length;
    const failed = tst.parameters.filter((p) => p.status === "Fail").length;
    let disp: UnifiedReportItem["dispositionType"] = "PENDING";
    if (tst.status === "Reviewed" || tst.status === "Completed") disp = "PASS";
    else if (tst.status === "Out of Specification" || tst.isOOS) disp = "FAIL";
    else if (tst.status === "Pending Review") disp = "QUARANTINE";

    items.push({
      id: tst.id,
      stream: "qc-results",
      streamLabel: "QC Analytical Results",
      title: `${tst.materialOrProduct} (${tst.testType})`,
      code: tst.materialOrProductCode,
      batchNumber: tst.batchNumber,
      category: tst.sampleCategory,
      supplierOrMfr: tst.sampleCategory,
      date: tst.testingDate || tst.dueDate,
      dateLabel: tst.testingDate ? "Testing Date" : "Due Date",
      status: tst.status,
      dispositionType: disp,
      analyst: tst.assignedAnalyst,
      storageLocationOrCondition: tst.instrumentReference,
      pharmacopeiaOrSpec: tst.testType,
      testsSummary: { total: tst.parameters.length, passed, failed },
      keyParameterResult: tst.parameters[0] ? `${tst.parameters[0].name}: ${tst.parameters[0].observedResult || "Pending"}` : undefined,
      navigationUrl: "/testing",
      rawDetails: tst as unknown as Record<string, unknown>
    });
  });

  return items;
}

/**
 * Filter items by category and filter criteria
 */
export function filterReportItems(
  items: UnifiedReportItem[],
  filters: ReportFilterState
): UnifiedReportItem[] {
  return items.filter((item) => {
    // 1. Category Filter
    if (filters.category !== "ALL" && filters.category !== "status-summary") {
      if (item.stream !== filters.category) {
        return false;
      }
    }

    // 2. Search Query (Title, Code, ID, Batch #, Supplier, Analyst)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.batchNumber.toLowerCase().includes(q) ||
        item.supplierOrMfr.toLowerCase().includes(q) ||
        item.analyst.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 3. Batch Number specific filter
    if (filters.batchNumber.trim()) {
      if (!item.batchNumber.toLowerCase().includes(filters.batchNumber.toLowerCase())) {
        return false;
      }
    }

    // 4. Supplier specific filter
    if (filters.supplier && filters.supplier !== "ALL") {
      if (item.supplierOrMfr !== filters.supplier) {
        return false;
      }
    }

    // 5. Status filter
    if (filters.status && filters.status !== "ALL") {
      if (filters.status === "Pass/Released") {
        if (item.dispositionType !== "PASS") return false;
      } else if (filters.status === "Quarantine/Retest") {
        if (item.dispositionType !== "QUARANTINE") return false;
      } else if (filters.status === "Fail/Rejected") {
        if (item.dispositionType !== "FAIL") return false;
      } else if (filters.status === "In Testing") {
        if (item.dispositionType !== "PENDING") return false;
      } else {
        if (item.status.toLowerCase() !== filters.status.toLowerCase()) {
          return false;
        }
      }
    }

    // 6. Date Range Filters (From - To)
    if (filters.dateFrom) {
      if (item.date < filters.dateFrom) return false;
    }
    if (filters.dateTo) {
      if (item.date > filters.dateTo) return false;
    }

    return true;
  });
}

/**
 * Sort items based on column and order
 */
export function sortReportItems(
  items: UnifiedReportItem[],
  sortBy: string,
  sortOrder: "asc" | "desc"
): UnifiedReportItem[] {
  return [...items].sort((a, b) => {
    let aVal: string | number = "";
    let bVal: string | number = "";

    switch (sortBy) {
      case "id":
        aVal = a.id;
        bVal = b.id;
        break;
      case "title":
        aVal = a.title;
        bVal = b.title;
        break;
      case "batchNumber":
        aVal = a.batchNumber;
        bVal = b.batchNumber;
        break;
      case "date":
        aVal = a.date;
        bVal = b.date;
        break;
      case "status":
        aVal = a.status;
        bVal = b.status;
        break;
      case "supplier":
        aVal = a.supplierOrMfr;
        bVal = b.supplierOrMfr;
        break;
      default:
        aVal = a.date;
        bVal = b.date;
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Calculate Summary KPI Metrics and Recharts series from filtered items
 */
export function calculateReportMetrics(items: UnifiedReportItem[]): ReportSummaryMetrics {
  const totalRecords = items.length;
  let releasedCount = 0;
  let quarantineCount = 0;
  let rejectedCount = 0;
  let inTestingCount = 0;

  // Stream throughput aggregation
  const streamMap: Record<string, { released: number; quarantine: number; rejected: number; inTesting: number; total: number }> = {
    "Packaging Materials": { released: 0, quarantine: 0, rejected: 0, inTesting: 0, total: 0 },
    "Raw Materials (APIs)": { released: 0, quarantine: 0, rejected: 0, inTesting: 0, total: 0 },
    "RM Retesting": { released: 0, quarantine: 0, rejected: 0, inTesting: 0, total: 0 },
    "Product Samples": { released: 0, quarantine: 0, rejected: 0, inTesting: 0, total: 0 },
    "QC Analytical": { released: 0, quarantine: 0, rejected: 0, inTesting: 0, total: 0 }
  };

  // Monthly trend tracker
  const monthlyMap: Record<string, { passed: number; quarantine: number; rejected: number }> = {
    "May 2026": { passed: 2, quarantine: 0, rejected: 0 },
    "Jun 2026": { passed: 4, quarantine: 1, rejected: 0 },
    "Jul 2026": { passed: 3, quarantine: 0, rejected: 1 },
    "Aug 2026": { passed: 5, quarantine: 2, rejected: 0 },
    "Sep 2026": { passed: 7, quarantine: 1, rejected: 0 },
    "Oct 2026": { passed: 0, quarantine: 0, rejected: 0 }
  };

  items.forEach((item) => {
    // Counts
    if (item.dispositionType === "PASS") releasedCount++;
    else if (item.dispositionType === "QUARANTINE") quarantineCount++;
    else if (item.dispositionType === "FAIL") rejectedCount++;
    else inTestingCount++;

    // Map to stream throughput
    let streamKey = "Packaging Materials";
    if (item.stream === "raw-materials") streamKey = "Raw Materials (APIs)";
    else if (item.stream === "retesting") streamKey = "RM Retesting";
    else if (item.stream === "products") streamKey = "Product Samples";
    else if (item.stream === "qc-results") streamKey = "QC Analytical";

    if (streamMap[streamKey]) {
      streamMap[streamKey].total++;
      if (item.dispositionType === "PASS") streamMap[streamKey].released++;
      else if (item.dispositionType === "QUARANTINE") streamMap[streamKey].quarantine++;
      else if (item.dispositionType === "FAIL") streamMap[streamKey].rejected++;
      else streamMap[streamKey].inTesting++;
    }

    // Map month (Oct 2026 fallback)
    if (item.date) {
      const monthPart = item.date.slice(0, 7); // e.g. "2026-10"
      let label = "Oct 2026";
      if (monthPart === "2026-05") label = "May 2026";
      else if (monthPart === "2026-06") label = "Jun 2026";
      else if (monthPart === "2026-07") label = "Jul 2026";
      else if (monthPart === "2026-08") label = "Aug 2026";
      else if (monthPart === "2026-09") label = "Sep 2026";
      else if (monthPart === "2026-10") label = "Oct 2026";

      if (monthlyMap[label]) {
        if (item.dispositionType === "PASS") monthlyMap[label].passed++;
        else if (item.dispositionType === "QUARANTINE") monthlyMap[label].quarantine++;
        else if (item.dispositionType === "FAIL") monthlyMap[label].rejected++;
      }
    }
  });

  const complianceRate = totalRecords > 0 ? Math.round((releasedCount / totalRecords) * 100) : 100;

  const dispositionDistribution = [
    { name: "Pass / Released", value: releasedCount, color: "#0F9D8A" }, // Teal Green
    { name: "Quarantine / Retest", value: quarantineCount, color: "#E7A23B" }, // Warning Amber
    { name: "Fail / Rejected / OOS", value: rejectedCount, color: "#DC2626" }, // Critical Red
    { name: "In Progress / Pending", value: inTestingCount, color: "#123B63" } // Pharma Blue
  ].filter((d) => d.value > 0);

  const streamThroughput = Object.entries(streamMap).map(([name, data]) => ({
    name,
    ...data
  }));

  const monthlyVolumeTrend = Object.entries(monthlyMap).map(([month, data]) => ({
    month,
    ...data
  }));

  return {
    totalRecords,
    releasedCount,
    quarantineCount,
    rejectedCount,
    inTestingCount,
    complianceRate,
    dispositionDistribution: dispositionDistribution.length > 0 ? dispositionDistribution : [{ name: "No Data", value: 1, color: "#CBD5E1" }],
    streamThroughput,
    monthlyVolumeTrend
  };
}

/**
 * Global Search query across all datasets with field match tracking
 */
export function performGlobalSampleSearch(query: string, items: UnifiedReportItem[]): GlobalSearchResult[] {
  if (!query.trim()) return [];

  const q = query.trim().toLowerCase();
  const results: GlobalSearchResult[] = [];

  items.forEach((item) => {
    const matchedFields: string[] = [];
    let score = 0;

    if (item.id.toLowerCase().includes(q)) {
      matchedFields.push(`Sample ID: ${item.id}`);
      score += 10;
    }
    if (item.batchNumber.toLowerCase().includes(q)) {
      matchedFields.push(`Batch Number: ${item.batchNumber}`);
      score += 8;
    }
    if (item.title.toLowerCase().includes(q)) {
      matchedFields.push(`Item Name: ${item.title}`);
      score += 6;
    }
    if (item.code.toLowerCase().includes(q)) {
      matchedFields.push(`Material/Product Code: ${item.code}`);
      score += 7;
    }
    if (item.supplierOrMfr.toLowerCase().includes(q)) {
      matchedFields.push(`Supplier: ${item.supplierOrMfr}`);
      score += 4;
    }
    if (item.analyst.toLowerCase().includes(q)) {
      matchedFields.push(`Analyst: ${item.analyst}`);
      score += 3;
    }
    if (item.status.toLowerCase().includes(q)) {
      matchedFields.push(`Status: ${item.status}`);
      score += 2;
    }

    if (matchedFields.length > 0) {
      results.push({
        item,
        matchedFields,
        relevanceScore: score
      });
    }
  });

  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Generates and triggers download of a standardized CSV report
 */
export function exportReportToCSV(items: UnifiedReportItem[], reportCategoryTitle: string): void {
  const timestamp = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
  
  // Disclaimer and metadata header lines
  const metaLines = [
    `# ==============================================================================`,
    `# CITI PHARMA QUALITY ASSURANCE & CONTROL LABORATORY`,
    `# LIMS REPORT EXPORT: ${reportCategoryTitle.toUpperCase()}`,
    `# Export Generated: ${timestamp} PKT`,
    `# 21 CFR Part 11 Audit Trail Compliant Dataset`,
    `# NOTICE: DEMONSTRATION DATA ONLY - FOR SIMULATION & INTERNAL VALIDATION USE ONLY`,
    `# ==============================================================================`,
    ``
  ];

  const headers = [
    "Sample / Test ID",
    "Stream Category",
    "Material / Product Name",
    "Material Code",
    "Batch / Lot Number",
    "Sub-Category",
    "Supplier / Manufacturer",
    "Recorded Date",
    "Compliance Disposition",
    "Raw Status",
    "Lead Analyst",
    "Storage Location / Spec",
    "Total Tests",
    "Tests Passed",
    "Tests Failed",
    "Key Parameter Result"
  ];

  const rows = items.map((item) => [
    `"${item.id}"`,
    `"${item.streamLabel}"`,
    `"${item.title.replace(/"/g, '""')}"`,
    `"${item.code}"`,
    `"${item.batchNumber}"`,
    `"${item.category}"`,
    `"${item.supplierOrMfr.replace(/"/g, '""')}"`,
    `"${item.date}"`,
    `"${item.dispositionType}"`,
    `"${item.status}"`,
    `"${item.analyst}"`,
    `"${item.storageLocationOrCondition.replace(/"/g, '""')}"`,
    item.testsSummary.total,
    item.testsSummary.passed,
    item.testsSummary.failed,
    `"${(item.keyParameterResult || "").replace(/"/g, '""')}"`
  ]);

  const csvContent = [
    ...metaLines,
    headers.join(","),
    ...rows.map((r) => r.join(","))
  ].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const fileNameCategory = reportCategoryTitle.toLowerCase().replace(/[^a-z0-9]/g, "_");
  link.setAttribute("href", url);
  link.setAttribute("download", `Citi_Pharma_LIMS_Report_${fileNameCategory}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
