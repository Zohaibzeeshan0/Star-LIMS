/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 8: Reports, Search, Filters & Export Types
 * Conforming to WHO GMP, ISO/IEC 17025, and 21 CFR Part 11 Documentation Guidelines
 */

export type ReportCategory =
  | "ALL"
  | "packaging"
  | "raw-materials"
  | "retesting"
  | "products"
  | "qc-results"
  | "status-summary";

export type DispositionFilter =
  | "ALL"
  | "Released"
  | "Pass/Released"
  | "Quarantine"
  | "Retest"
  | "Rejected"
  | "Fail/Rejected"
  | "In Testing"
  | "Under Testing"
  | "Out of Specification"
  | "Reviewed";

export interface ReportFilterState {
  searchQuery: string;
  category: ReportCategory;
  subCategory?: string;
  status: string;
  supplier: string;
  batchNumber: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface UnifiedReportItem {
  id: string; // e.g. "CP-PKG-2026-0101"
  stream: "packaging" | "raw-materials" | "retesting" | "products" | "qc-results" | "master-samples";
  streamLabel: string; // e.g. "Packaging Materials", "Raw Materials (API)", etc.
  title: string; // e.g. "Alu-Alu Cold Form Blister Foil 240mm"
  code: string; // e.g. "PM-FOL-0042"
  batchNumber: string; // e.g. "ALU-240-B88"
  category: string; // e.g. "Primary Packaging"
  supplierOrMfr: string; // e.g. "Alupack Ind. Pvt Ltd"
  date: string; // YYYY-MM-DD
  dateLabel: string; // e.g. "Received Date", "Testing Date", etc.
  status: string; // e.g. "Released", "Quarantine", "Rejected"
  dispositionType: "PASS" | "QUARANTINE" | "FAIL" | "PENDING";
  analyst: string;
  storageLocationOrCondition: string;
  pharmacopeiaOrSpec: string;
  testsSummary: {
    total: number;
    passed: number;
    failed: number;
  };
  keyParameterResult?: string;
  navigationUrl: string; // e.g. "/samples/packaging"
  rawDetails: Record<string, unknown>; // Underlying entity
}

export interface ReportSummaryMetrics {
  totalRecords: number;
  releasedCount: number;
  quarantineCount: number;
  rejectedCount: number;
  inTestingCount: number;
  complianceRate: number; // e.g. 84.5%
  
  // Recharts Chart Data Series
  dispositionDistribution: {
    name: string;
    value: number;
    color: string;
  }[];
  
  streamThroughput: {
    name: string;
    released: number;
    quarantine: number;
    rejected: number;
    inTesting: number;
    total: number;
  }[];

  monthlyVolumeTrend: {
    month: string;
    passed: number;
    quarantine: number;
    rejected: number;
  }[];
}

export interface GlobalSearchResult {
  item: UnifiedReportItem;
  matchedFields: string[]; // e.g. ["Batch Number: PAR-500-B294", "Product Name: Paracetamol"]
  relevanceScore: number;
}

export type ReportRow = UnifiedReportItem;
export type ReportMetrics = ReportSummaryMetrics;
