import { z } from "zod";

export const productSampleSchema = z.object({
  id: z
    .string()
    .min(3, "Sample ID is required (e.g. CP-PRD-2026-0501)")
    .regex(/^[A-Za-z0-9\-_]+$/, "Alphanumeric, hyphen, and underscore characters only"),
  productName: z
    .string()
    .min(3, "Product Name must be at least 3 characters")
    .max(140, "Product Name cannot exceed 140 characters"),
  productCode: z
    .string()
    .min(2, "Product Code is required (e.g. FP-TAB-0104)"),
  dosageForm: z.enum([
    "Tablets",
    "Capsules",
    "Syrups",
    "Suspensions",
    "Creams",
    "Injectables / Ampoules"
  ], {
    errorMap: () => ({ message: "Please select a valid pharmaceutical dosage form" })
  }),
  strength: z
    .string()
    .min(1, "Product strength / concentration is required (e.g. 500 mg or 120 mg/5 mL)"),
  genericName: z
    .string()
    .min(2, "Active Generic Name is required"),
  batchNumber: z
    .string()
    .min(2, "Batch / Lot number is required"),
  batchSize: z
    .string()
    .min(2, "Batch size is required (e.g. 250,000 Tablets)"),
  batchStatus: z.enum([
    "Commercial Batch",
    "Validation Batch",
    "Pilot Batch",
    "Stability Chamber Batch",
    "Quarantine Hold"
  ]),
  manufacturingDate: z
    .string()
    .min(1, "Manufacturing date is required"),
  expiryDate: z
    .string()
    .min(1, "Expiration date is required"),
  receivedDate: z
    .string()
    .min(1, "Sample received date is required"),
  sampleType: z.enum([
    "Finished Product Release",
    "In-Process Quality Control (IPQC)",
    "ICH Stability Testing",
    "Process Validation Batch",
    "Sterile Parenteral Release"
  ]),
  packagingDetails: z
    .string()
    .min(2, "Packaging details are required (e.g. 10x10 Alu-PVC Blister Packs in Unit Carton)"),
  productionLine: z
    .string()
    .min(2, "Production line / suite is required"),
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
    .min(3, "Sampling & inspection remarks are required")
    .max(500, "Remarks cannot exceed 500 characters")
});

export type ProductSampleFormValues = z.infer<typeof productSampleSchema>;
