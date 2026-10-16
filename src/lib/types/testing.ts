/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 7: Laboratory Testing & QC Results Types
 * Conforming to cGMP, GLP, and 21 CFR Part 11 Laboratory Documentation Standards
 */

export type TestStatus =
  | "Not Started"
  | "In Progress"
  | "Completed"
  | "Pending Review"
  | "Reviewed"
  | "Out of Specification";

export type TestType =
  | "HPLC Assay & Potency"
  | "Dissolution Rate & Drug Release"
  | "Karl Fischer Moisture Content"
  | "Sterility & Endotoxin (LAL)"
  | "Microbial Enumeration (TAMC/TYMC)"
  | "Disintegration & Hardness"
  | "Gas Chromatography Residual Solvents"
  | "FTIR Identification & Description"
  | "Packaging Foil Pinhole & Leak Test";

export type InputType = "numeric" | "text" | "selectable";

export interface TestParameter {
  id: string;
  name: string; // e.g. "Assay Potency", "Related Substance Impurity A", "Water Content"
  specification: string; // e.g. "98.5% - 101.5%", "NMT 0.20%", "NMT 0.50%"
  unit: string; // e.g. "%", "mg/mL", "ppm", "minutes", "CFU/g", "EU/mg"
  inputType: InputType;
  minAllowed?: number;
  maxAllowed?: number;
  selectableOptions?: string[]; // e.g. ["Complies", "Does Not Comply"]
  observedResult: string;
  status: "Pass" | "Fail" | "Pending";
  instrumentUsed: string; // e.g. "HPLC Waters Alliance e2695"
  analystNotes?: string;
}

export interface TestWorklistItem {
  id: string; // e.g. "CP-TST-2026-081"
  sampleId: string; // e.g. "CP-PRD-2026-0501" or "CP-RAW-2026-0401"
  sampleCategory:
    | "Active Pharmaceutical Ingredient (API)"
    | "Raw Material (Excipient/Solvent)"
    | "Packaging Material"
    | "Raw Material Retesting"
    | "Finished Pharmaceutical Product"
    | "In-Process Control (IPQC)";
  materialOrProduct: string; // e.g. "Ciprocit 500mg Film-Coated Tablets"
  materialOrProductCode: string; // e.g. "FP-TAB-0104"
  batchNumber: string; // e.g. "CPT-500-26A"
  testType: TestType;
  assignedAnalyst: string; // e.g. "Zubair Ahmed"
  dueDate: string; // YYYY-MM-DD
  testingDate?: string; // YYYY-MM-DD
  instrumentReference: string; // e.g. "Waters Alliance HPLC (INST-HPLC-02)"
  status: TestStatus;
  isOOS: boolean;
  
  // Test Parameters Table
  parameters: TestParameter[];
  
  // Observations and Comments
  observations: string;
  analystComments: string;
  
  // Review & Sign-off Details
  reviewedBy?: string;
  reviewDate?: string;
  reviewComments?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface TestWorklistFilterState {
  searchQuery: string;
  status: TestStatus | "ALL";
  testType: TestType | "ALL";
  assignedAnalyst: string;
  dateFrom: string;
  dateTo: string;
}
