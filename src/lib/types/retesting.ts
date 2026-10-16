/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Raw Material Retesting Module Types (Phase 5)
 * Conforming to ICH Q7 Section 7.5, WHO GMP, and USP <1079> Surveillance Standards
 */

export type RetestStatus =
  | "Due Soon"
  | "Overdue"
  | "Scheduled"
  | "In Progress"
  | "Completed"
  | "Quarantine"
  | "Rejected";

export type RetestCategory =
  | "Active Pharmaceutical Ingredient (API)"
  | "Excipient / Binder / Filler"
  | "Coating Polymer / Granulating Agent"
  | "Preservative / Antioxidant"
  | "Process Solvent / Reagent";

export type RetestUnit = "kg" | "g" | "Liters" | "Drums" | "Bags";

export type ExpiryUrgency = "OVERDUE" | "DUE_SOON" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";
export type RetestUrgency = ExpiryUrgency;

export interface RetestHistoryRecord {
  id: string;
  cycleNumber: number;
  testDate: string;
  assayResult: string;
  waterContent: string;
  impurities: string;
  extensionGranted: string; // e.g. "+12 Months (Valid until 2026-10-01)"
  analyst: string;
  disposition: "Approved / Extended" | "Quarantine Hold" | "Rejected";
}

export interface RetestTimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  stage: string;
  description: string;
  user: string;
  state: "completed" | "current" | "pending";
}

export interface RetestAnalyticalResult {
  id: string;
  parameter: string; // e.g. "Assay (Anhydrous Basis)", "Related Impurities (Total)", "Water Content (KF)"
  specification: string; // e.g. "98.5% - 101.5%", "NMT 0.15%", "NMT 0.50%"
  initialReleaseResult: string; // e.g. "99.82%", "0.04%", "0.18%"
  currentRetestResult: string; // e.g. "99.41%", "0.07%", "0.26%"
  passed: boolean;
  instrumentUsed: string; // e.g. "HPLC Waters Alliance e2695", "Metrohm Karl Fischer 890"
}

export interface RetestSample {
  id: string; // Sample ID e.g. "CP-RET-2026-001"
  rawMaterialSampleId: string; // Original intake reference e.g. "CP-RAW-2024-0310"
  materialCode: string; // e.g. "RM-API-0012"
  materialName: string; // e.g. "Paracetamol DC 90% Granules"
  category: RetestCategory;
  supplier: string; // e.g. "Mallinckrodt Pharmaceuticals"
  manufacturer: string; // e.g. "Mallinckrodt USA"
  batchNumber: string; // e.g. "PAR-DC90-M88"
  warehouseLocation: string; // e.g. "Bay R-02 (Climate Controlled 20-25°C)"
  
  // Quantities
  remainingStock: number;
  unit: RetestUnit;
  containersCount: number; // e.g. 12 drums

  // Retest Lifecycle Dates (Explicit user requirements)
  previousTestDate: string; // Initial lot test or prior retest date (YYYY-MM-DD)
  lastRetestDate: string; // Date of most recent retest (YYYY-MM-DD)
  nextRetestDueDate: string; // Next scheduled retest due date (YYYY-MM-DD)
  manufactureDate: string; // YYYY-MM-DD
  extendedRetestDate?: string; // YYYY-MM-DD (after passing)
  retestCycleNumber: number; // 1, 2, 3
  extensionMonthsGranted?: number; // e.g. 12 or 24 months

  // Governance & Quality
  status: RetestStatus;
  retestReason: string; // e.g. "Scheduled 24-Month Surveillance", "Dispensing Request for Bulk Staging"
  pharmacopeia: "BP 2026" | "USP 48-NF 43" | "Ph. Eur. 11.0" | "In-House Validated";
  storageCondition: string; // e.g. "Store airtight below 25°C, protect from light"
  analyst: string; // Assigned QC Analyst
  reviewedBy: string; // QA Manager
  qaDispositionDate?: string; // Date QA stamped release or rejection
  remarks: string;

  // Previous Retest History & Mock Timeline (Explicit user requirements)
  history: RetestHistoryRecord[];
  timeline: RetestTimelineEvent[];

  // Analytical Test Results
  tests: RetestAnalyticalResult[];

  createdAt: string;
  updatedAt: string;
}

export interface RetestFilterState {
  searchQuery: string;
  dueStatus: RetestStatus | "ALL";
  material: string;
  supplier: string;
  analyst: string;
  dateFrom: string;
  dateTo: string;
}
