/**
 * Citi Pharma Laboratory Information Management System (LIMS)
 * Packaging Material Sample Types
 */

export type PackagingStatus =
  | "Registered"
  | "Under Testing"
  | "Released"
  | "Rejected"
  | "Quarantine"
  | "Retest";

export type PackagingType =
  | "Primary Packaging"
  | "Secondary Packaging"
  | "Tertiary Packaging"
  | "Printed Packaging"
  | "Closures & Seals";

export type PackagingUnit =
  | "Rolls"
  | "Bottles"
  | "Vials"
  | "Caps"
  | "Cartons"
  | "Leaflets"
  | "Sheets"
  | "Stoppers"
  | "kg"
  | "Units";

export interface PackagingTest {
  id: string;
  name: string;
  specification: string;
  observedResult: string;
  passed: boolean;
  standardMethod?: string;
}

export interface PackagingSample {
  id: string; // e.g. CP-PKG-2026-0101
  materialName: string; // e.g. "Alu-Alu Cold Form Blister Foil 240mm"
  materialCode: string; // e.g. "PM-FOL-0042"
  supplier: string; // e.g. "Alupack Ind. Pvt Ltd"
  manufacturer: string; // e.g. "Constantia Flexibles AG"
  batchNumber: string; // e.g. "ALU-240-B88"
  receivedDate: string; // YYYY-MM-DD
  samplingDate: string; // YYYY-MM-DD
  quantity: number;
  unit: PackagingUnit;
  packagingType: PackagingType;
  status: PackagingStatus;
  remarks: string;
  storageLocation: string; // e.g. "PM Warehouse Bay B-04"
  analyst: string; // e.g. "Hamza Shafiq"
  inspectedBy: string; // e.g. "Farhan Malik (QA Manager)"
  specificationRef?: string; // e.g. "Citi Pharma In-House Spec PKG-SPC-012"
  tests: PackagingTest[];
  createdAt: string;
  updatedAt: string;
}

export interface PackagingFilterState {
  searchQuery: string;
  status: PackagingStatus | "ALL";
  packagingType: PackagingType | "ALL";
  supplier: string; // "ALL" or specific supplier
  dateFrom: string;
  dateTo: string;
}
