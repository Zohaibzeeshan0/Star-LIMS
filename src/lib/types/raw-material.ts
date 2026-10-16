/**
 * Citi Pharma Laboratory Information Management System (LIMS)
 * Raw Material Sample Types (Phase 4)
 */

export type RawMaterialStatus =
  | "Registered"
  | "Under Testing"
  | "Reviewed"
  | "Released"
  | "Rejected"
  | "Quarantine"
  | "Retest";

export type RawMaterialCategory =
  | "Active Pharmaceutical Ingredient (API)"
  | "Excipient / Binder / Filler"
  | "Process Solvent / Reagent"
  | "Coating Polymer / Colorant"
  | "Preservative / Buffer";

export type RawMaterialUnit = "kg" | "g" | "Liters" | "mL" | "Drums" | "Bags";

export interface RawMaterialTest {
  id: string;
  name: string;
  specification: string;
  observedResult: string;
  passed: boolean;
  instrumentUsed?: string;
}

export interface RawMaterialSample {
  id: string; // e.g. CP-RAW-2026-0401
  materialCode: string; // e.g. RM-API-0012
  materialName: string; // e.g. Paracetamol DC 90% Granules
  category: RawMaterialCategory;
  supplier: string; // e.g. Mallinckrodt Pharmaceuticals
  manufacturer: string; // e.g. Mallinckrodt USA
  batchNumber: string; // e.g. PAR-DC90-M88
  poReference: string; // e.g. PO-2026-8812
  receivedDate: string; // YYYY-MM-DD
  samplingDate: string; // YYYY-MM-DD
  retestDate?: string; // YYYY-MM-DD
  quantity: number;
  unit: RawMaterialUnit;
  storageCondition: string; // e.g. "Store airtight below 25°C, protect from moisture"
  pharmacopeia: "BP 2026" | "USP 48-NF 43" | "Ph. Eur. 11.0" | "In-House Validated";
  status: RawMaterialStatus;
  remarks: string;
  storageLocation: string; // e.g. "RM Quarantine Bay Q-02"
  analyst: string; // e.g. "Zubair Ahmed"
  reviewedBy: string; // e.g. "Farhan Malik (QA Manager)"
  inspectedBy?: string;
  tests: RawMaterialTest[];
  createdAt: string;
  updatedAt: string;
}

export interface RawMaterialFilterState {
  searchQuery: string;
  status: RawMaterialStatus | "ALL";
  category: RawMaterialCategory | "ALL";
  supplier: string;
  dateFrom: string;
  dateTo: string;
}
