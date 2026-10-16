import test from "node:test";
import assert from "node:assert/strict";

import { sampleRegistrationSchema } from "../src/lib/validations/sample-schema.ts";
import { packagingSampleSchema } from "../src/lib/validations/packaging-schema.ts";
import { rawMaterialSampleSchema } from "../src/lib/validations/raw-material-schema.ts";
import { retestSampleSchema } from "../src/lib/validations/retesting-schema.ts";
import { productSampleSchema } from "../src/lib/validations/product-schema.ts";
import { testReviewFormSchema } from "../src/lib/validations/testing-schema.ts";

test("sampleRegistrationSchema accepts valid payload and rejects missing fields", () => {
  const validPayload = {
    productName: "Paracetamol BP 500mg Tablets",
    batchNumber: "PAR-500-B294",
    category: "Product Sample (Finished)",
    pharmacopeia: "BP 2026",
    mfgDate: "2026-10-01",
    expDate: "2029-09-30",
    batchSize: "500,000 Tablets",
    sampleQuantity: "100 Tablets",
    storageCondition: "Room Temp (15-25°C)",
    priority: "Normal",
    analyst: "Dr. Ayesha Khan",
    selectedTests: ["Assay (% Label Claim by HPLC / GC)"],
    targetSpecification: "Per BP 2026 monograph"
  };

  const parsed = sampleRegistrationSchema.safeParse(validPayload);
  assert.ok(parsed.success, "Valid payload should pass");

  // Invalid: missing productName and selectedTests
  const invalid = sampleRegistrationSchema.safeParse({
    ...validPayload,
    productName: "",
    selectedTests: []
  });
  assert.ok(!invalid.success, "Invalid payload must fail");
});

test("packagingSampleSchema validates materialCode and quantities", () => {
  const validPayload = {
    id: "CP-PKG-2026-001",
    materialCode: "PM-BLI-001",
    materialName: "Printed Alu-Alu Cold Form Foil",
    supplier: "Pharmapack Industries Ltd",
    manufacturer: "Pharmapack Foils Global",
    batchNumber: "ALU-2026-0881",
    receivedDate: "2026-10-10",
    samplingDate: "2026-10-10",
    quantity: 50,
    unit: "Rolls",
    packagingType: "Primary Packaging",
    status: "Registered",
    remarks: "Received in sound condition",
    storageLocation: "Bay 01",
    analyst: "Hamza Shafiq"
  };

  const parsed = packagingSampleSchema.safeParse(validPayload);
  assert.ok(parsed.success, "Packaging sample should pass");

  const invalid = packagingSampleSchema.safeParse({
    ...validPayload,
    quantity: -5 // Invalid negative quantity
  });
  assert.ok(!invalid.success, "Negative quantity must fail");
});

test("rawMaterialSampleSchema validates pharmacopeia and storage", () => {
  const validPayload = {
    id: "CP-RAW-2026-001",
    materialCode: "RM-API-001",
    materialName: "Paracetamol Fine Powder",
    category: "Active Pharmaceutical Ingredient (API)",
    supplier: "Hebei Jiheng Chemical Co.",
    manufacturer: "Jiheng Pharma APIs",
    batchNumber: "PCM-2026-09A",
    poReference: "PO-2026-8812",
    receivedDate: "2026-10-01",
    samplingDate: "2026-10-01",
    quantity: 500,
    unit: "kg",
    storageCondition: "Store airtight below 25°C",
    pharmacopeia: "Ph. Eur. 11.0",
    status: "Registered",
    remarks: "Seals verified intact",
    storageLocation: "API Bay 01",
    analyst: "Zubair Ahmed"
  };

  const parsed = rawMaterialSampleSchema.safeParse(validPayload);
  assert.ok(parsed.success, "Raw material sample should pass");

  const invalid = rawMaterialSampleSchema.safeParse({
    ...validPayload,
    quantity: -10 // Negative quantity
  });
  assert.ok(!invalid.success, "Negative quantity must fail");
});

test("retestSampleSchema validates retest dates and cycle numbers", () => {
  const validPayload = {
    id: "CP-RET-2026-001",
    rawMaterialSampleId: "CP-RAW-2024-010",
    materialCode: "RM-API-001",
    materialName: "Paracetamol Fine Powder",
    category: "Active Pharmaceutical Ingredient (API)",
    supplier: "Hebei Jiheng Chemical Co.",
    manufacturer: "Jiheng Pharma APIs",
    batchNumber: "PCM-2024-11A",
    warehouseLocation: "Bay R-02",
    remainingStock: 250,
    unit: "kg",
    containersCount: 10,
    manufactureDate: "2024-10-15",
    previousTestDate: "2024-10-25",
    lastRetestDate: "2024-10-25",
    nextRetestDueDate: "2026-10-25",
    retestCycleNumber: 1,
    extensionMonthsGranted: 12,
    status: "Scheduled",
    retestReason: "Surveillance sampling",
    pharmacopeia: "USP 48-NF 43",
    storageCondition: "Store airtight below 25°C",
    analyst: "Zubair Ahmed",
    reviewedBy: "Dr. Farhan Malik",
    remarks: "Seals intact"
  };

  const parsed = retestSampleSchema.safeParse(validPayload);
  assert.ok(parsed.success, "Retest sample should pass");

  const invalid = retestSampleSchema.safeParse({
    ...validPayload,
    retestCycleNumber: 0 // Cycle must be >= 1
  });
  assert.ok(!invalid.success, "Cycle 0 must fail");
});

test("productSampleSchema validates dosage form and strength", () => {
  const validPayload = {
    id: "CP-PRD-2026-001",
    productName: "Ciprocit Film-Coated Tablets",
    productCode: "FP-TAB-0104",
    dosageForm: "Tablets",
    strength: "500 mg",
    genericName: "Ciprofloxacin Hydrochloride BP",
    batchNumber: "CPT-500-26A",
    batchSize: "250,000 Tablets",
    batchStatus: "Commercial Batch",
    manufacturingDate: "2026-09-18",
    expiryDate: "2029-09-17",
    receivedDate: "2026-09-22",
    samplingDate: "2026-09-22",
    sampleType: "Finished Product Release",
    packagingDetails: "10 x 10 Alu-PVC Blister",
    productionLine: "Solid Oral Dosage Line 02",
    targetMarket: "Domestic (DRAP)",
    storageCondition: "Store below 30°C",
    pharmacopeia: "BP 2026",
    quantitySampled: 100,
    unit: "Tablets",
    status: "Registered",
    analyst: "Zubair Ahmed",
    reviewedBy: "Dr. Farhan Malik",
    remarks: "Sample drawn per SOP"
  };

  const parsed = productSampleSchema.safeParse(validPayload);
  assert.ok(parsed.success, "Product sample should pass");

  const invalid = productSampleSchema.safeParse({
    ...validPayload,
    productName: "" // Empty product name
  });
  assert.ok(!invalid.success, "Empty product name must fail");
});

test("testReviewFormSchema validates sign-off", () => {
  const validPayload = {
    reviewedBy: "Dr. Farhan Malik (QC Lead)",
    reviewDate: "2026-10-16",
    reviewComments: "Chromatograms inspected against reference standard. Conforms to release specification.",
    disposition: "Reviewed"
  };

  const parsed = testReviewFormSchema.safeParse(validPayload);
  assert.ok(parsed.success, "Review form should pass");

  const invalid = testReviewFormSchema.safeParse({
    ...validPayload,
    reviewedBy: "" // Missing reviewer name
  });
  assert.ok(!invalid.success, "Empty reviewer must fail");
});
