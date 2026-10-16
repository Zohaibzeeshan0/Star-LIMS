import { z } from "zod";

export const productSampleSchema = z.object({
  id: z
    .string()
    .min(3, "Product Sample ID is required (e.g. CP-PRD-2026-0501)")
    .regex(/^[A-Za-z0-9\-_]+$/, "Alphanumeric, hyphen, and underscore characters only"),
  productCode: z
    .string()
    .min(2, "Product Code is required (e.g. FP-TAB-0104)"),
  productName: z
    .string()
    .min(3, "Product Name must be at least 3 characters")
    .max(140, "Product Name cannot exceed 140 characters"),
  genericName: z
    .string()
    .min(2, "Active Generic Name is required"),
  dosageForm: z.enum([
    "Film-Coated Tablets",
    "Extended-Release Tablets",
    "Hard Gelatin Capsules",
    "Oral Liquid / Syrup / Suspension",
    "Sterile Lyophilized Vial / Ampoule",
    "Topical Cream / Ointment"
  ], {
    errorMap: () => ({ message: "Please select a valid dosage form" })
  }),
  stage: z.enum([
    "Finished Product Release (FPR)",
    "In-Process Quality Control (IPQC)",
    "ICH Stability (Accelerated 40°C/75% RH)",
    "ICH Stability (Real-Time 25°C/60% RH)",
    "Annual Product Quality Review (PQR)",
    "Sterile Parenteral Release"
  ]),
  stabilityInterval: z.string().optional(),
  batchNumber: z
    .string()
    .min(2, "Batch / Lot number is required"),
  batchSize: z
    .string()
    .min(2, "Batch size is required (e.g. 250,000 Tablets)"),
  productionLine: z
    .string()
    .min(2, "Production facility / line is required"),
  manufacturingDate: z
    .string()
    .min(1, "Manufacturing date is required"),
  expiryDate: z
    .string()
    .min(1, "Expiration date is required"),
  samplingDate: z
    .string()
    .min(1, "Sampling date is required"),
  samplingStage: z
    .string()
    .min(2, "Sampling stage / location is required"),
  packagingPresentation: z
    .string()
    .min(2, "Packaging presentation is required (e.g. 10x10 Blister Pack)"),
  targetMarket: z.enum([
    "Domestic (DRAP)",
    "Export (GCC / MENA)",
    "Institutional Hospital Supply"
  ]),
  storageCondition: z
    .string()
    .min(3, "Storage condition is required"),
  pharmacopeia: z.enum(["BP 2026", "USP 48-NF 43", "Ph. Eur. 11.0", "In-House Validated"]),
  quantitySampled: z
    .coerce
    .number({ invalid_type_error: "Quantity sampled must be a number" })
    .positive("Quantity must be greater than zero"),
  unit: z.enum(["Tablets", "Capsules", "Bottles", "Vials", "Tubes", "Packs"], {
    errorMap: () => ({ message: "Please select a valid unit" })
  }),
  status: z.enum([
    "Registered",
    "Under Testing",
    "Reviewed",
    "Released",
    "Quarantine",
    "Rejected"
  ]),
  analyst: z
    .string()
    .min(2, "Assigned QC Analyst is required"),
  reviewedBy: z
    .string()
    .min(2, "QA Reviewer is required"),
  remarks: z
    .string()
    .min(3, "Sampling & testing remarks are required")
    .max(500, "Remarks cannot exceed 500 characters")
});

export type ProductSampleFormValues = z.infer<typeof productSampleSchema>;
