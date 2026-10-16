/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Finished Products, IPQC & Stability Testing Types (Phase 6)
 * Conforming to cGMP, ICH Q1A(R2) Stability, and USP/BP Finished Product Monographs
 */

export type ProductStatus =
  | "Registered"
  | "Under Testing"
  | "Reviewed"
  | "Released"
  | "Quarantine"
  | "Rejected";

export type TestingStage =
  | "Finished Product Release (FPR)"
  | "In-Process Quality Control (IPQC)"
  | "ICH Stability (Accelerated 40°C/75% RH)"
  | "ICH Stability (Real-Time 25°C/60% RH)"
  | "Annual Product Quality Review (PQR)"
  | "Sterile Parenteral Release";

export type DosageForm =
  | "Film-Coated Tablets"
  | "Extended-Release Tablets"
  | "Hard Gelatin Capsules"
  | "Oral Liquid / Syrup / Suspension"
  | "Sterile Lyophilized Vial / Ampoule"
  | "Topical Cream / Ointment";

export type ProductUnit = "Tablets" | "Capsules" | "Bottles" | "Vials" | "Tubes" | "Packs";

export interface ProductTest {
  id: string;
  parameter: string; // e.g. "Assay Potency (% Label Claim)", "Dissolution (USP App 2, 45 min)", "Uniformity of Dosage Units (AV)"
  specification: string; // e.g. "95.0% - 105.0%", "Q NLT 80% in 45 min", "Acceptance Value AV <= 15.0"
  observedResult: string; // e.g. "99.4%", "89.2% (Range: 86.4% - 92.1%)", "AV = 4.2"
  passed: boolean;
  instrumentUsed: string; // e.g. "Waters Alliance e2695 HPLC", "Erweka DT 820 Dissolution Tester"
}

export interface ProductSample {
  id: string; // e.g. "CP-PRD-2026-0501"
  productCode: string; // e.g. "FP-TAB-0104"
  productName: string; // e.g. "Ciprocit 500mg Film-Coated Tablets"
  genericName: string; // e.g. "Ciprofloxacin Hydrochloride BP"
  dosageForm: DosageForm;
  stage: TestingStage;
  stabilityInterval?: string; // e.g. "Initial (0-Mo)", "3-Month Pull", "6-Month Pull", "12-Month Pull", "24-Month Pull"
  
  // Batch & Manufacturing Details
  batchNumber: string; // e.g. "CPT-500-26A"
  batchSize: string; // e.g. "250,000 Tablets"
  productionLine: string; // e.g. "Solid Oral Line-1 (Kilian Tablet Press)"
  manufacturingDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  samplingDate: string; // YYYY-MM-DD
  samplingStage: string; // e.g. "Final Secondary Packaged Stock", "Core Compression Stage", "Coating Pan Discharge"
  
  // Packaging & Distribution
  packagingPresentation: string; // e.g. "10 x 10 Alu-PVC Blisters per Printed Carton"
  targetMarket: "Domestic (DRAP)" | "Export (GCC / MENA)" | "Institutional Hospital Supply";
  
  // Storage & Monograph
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
  
  // Analytical Battery
  tests: ProductTest[];
  
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilterState {
  searchQuery: string;
  status: ProductStatus | "ALL";
  dosageForm: DosageForm | "ALL";
  stage: TestingStage | "ALL";
  productionLine: string;
}
