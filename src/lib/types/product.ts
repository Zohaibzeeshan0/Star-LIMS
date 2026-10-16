/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Finished Products, IPQC & Stability Testing Types (Phase 6)
 * Conforming to cGMP, DRAP Finished Product Monographs, and ICH Quality Guidelines
 */

export type ProductStatus =
  | "Registered"
  | "Under Testing"
  | "Reviewed"
  | "Released"
  | "Quarantine"
  | "Rejected";

export type SampleType =
  | "Finished Product Release"
  | "In-Process Quality Control (IPQC)"
  | "ICH Stability Testing"
  | "Process Validation Batch"
  | "Sterile Parenteral Release";

export type SampleReleaseType = SampleType;

export type DosageForm =
  | "Tablets"
  | "Capsules"
  | "Syrups"
  | "Suspensions"
  | "Creams"
  | "Injectables / Ampoules";

export type BatchStatus =
  | "Commercial Batch"
  | "Validation Batch"
  | "Pilot Batch"
  | "Stability Chamber Batch"
  | "Quarantine Hold";

export type ProductUnit = "Tablets" | "Capsules" | "Bottles" | "Vials" | "Tubes" | "Packs";

export interface StatusHistoryEntry {
  id: string;
  status: ProductStatus;
  timestamp: string;
  changedBy: string;
  remarks: string;
}

export interface ProductTest {
  id: string;
  parameter: string; // e.g. "Assay Potency (% Label Claim)", "Dissolution (USP App 2, 45 min)", "Uniformity of Dosage Units (AV)"
  specification: string; // e.g. "95.0% - 105.0%", "Q NLT 80% in 45 min", "Acceptance Value AV <= 15.0"
  observedResult: string; // e.g. "99.4%", "89.2% (Range: 86.4% - 92.1%)", "AV = 4.2"
  passed: boolean;
  instrumentUsed: string; // e.g. "Waters Alliance e2695 HPLC", "Erweka DT 820 Dissolution Tester"
}

export interface ProductSample {
  id: string; // Sample ID e.g. "CP-PRD-2026-0501"
  productName: string; // e.g. "Ciprocit Film-Coated Tablets"
  productCode: string; // e.g. "FP-TAB-0104"
  dosageForm: DosageForm; // e.g. "Tablets", "Capsules", "Syrups", "Suspensions", "Creams", "Injectables / Ampoules"
  strength: string; // e.g. "500 mg", "120 mg/5 mL", "1% w/w", "1 g/vial"
  genericName: string; // e.g. "Ciprofloxacin Hydrochloride BP"
  batchNumber: string; // e.g. "CPT-500-26A"
  batchSize: string; // e.g. "250,000 Tablets"
  batchStatus: BatchStatus; // "Commercial Batch" | "Validation Batch" | "Pilot Batch" | etc.
  
  // Dates (Explicit user requirements)
  manufacturingDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  receivedDate: string; // YYYY-MM-DD
  samplingDate: string; // YYYY-MM-DD
  
  // Sampling & Packaging details
  sampleType: SampleType; // "Finished Product Release", "In-Process Quality Control (IPQC)", etc.
  packagingDetails: string; // e.g. "10 x 10 Alu-PVC Blisters per Printed Unit Carton"
  productionLine: string; // e.g. "Solid Oral Facility (Line-1 Fette Press)"
  targetMarket: "Domestic (DRAP)" | "Export (GCC / MENA)" | "Institutional Hospital Supply";
  
  // Storage & Pharmacopeia
  storageCondition: string; // e.g. "Store below 30°C in a dry place, protect from light"
  pharmacopeia: "BP 2026" | "USP 48-NF 43" | "Ph. Eur. 11.0" | "In-House Validated";
  
  // Quantity Sampled for QC
  quantitySampled: number;
  unit: ProductUnit;
  
  // Governance
  status: ProductStatus;
  analyst: string; // Assigned QC Analyst
  reviewedBy: string; // QA Batch Release Manager
  qaReleaseDate?: string;
  remarks: string;
  
  // Testing Summaries & Mock Status History (Explicit user requirement)
  tests: ProductTest[];
  statusHistory: StatusHistoryEntry[];
  
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilterState {
  searchQuery: string;
  dosageForm: DosageForm | "ALL";
  product: string;
  batchStatus: BatchStatus | "ALL";
  sampleStatus: ProductStatus | "ALL";
  dateFrom: string;
  dateTo: string;
}
