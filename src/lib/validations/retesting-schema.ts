import { z } from "zod";

export const retestSampleSchema = z.object({
  id: z
    .string()
    .min(3, "Sample ID is required (e.g. CP-RET-2026-001)")
    .regex(/^[A-Za-z0-9\-_]+$/, "Alphanumeric, hyphen, and underscore characters only"),
  rawMaterialSampleId: z
    .string()
    .min(3, "Original Raw Material ID is required (e.g. CP-RAW-2024-0310)"),
  materialCode: z
    .string()
    .min(2, "Material Code is required (e.g. RM-API-0012)"),
  materialName: z
    .string()
    .min(3, "Material Name must be at least 3 characters")
    .max(140, "Material Name cannot exceed 140 characters"),
  category: z.enum([
    "Active Pharmaceutical Ingredient (API)",
    "Excipient / Binder / Filler",
    "Coating Polymer / Granulating Agent",
    "Preservative / Antioxidant",
    "Process Solvent / Reagent"
  ], {
    errorMap: () => ({ message: "Please select a valid material category" })
  }),
  supplier: z
    .string()
    .min(2, "Supplier / Vendor name is required"),
  manufacturer: z
    .string()
    .min(2, "Manufacturer name is required"),
  batchNumber: z
    .string()
    .min(2, "Batch / Lot number is required"),
  warehouseLocation: z
    .string()
    .min(2, "Warehouse bay location is required (e.g. Bay R-02)"),
  remainingStock: z
    .coerce
    .number({ invalid_type_error: "Remaining stock must be a number" })
    .positive("Remaining stock must be greater than zero"),
  unit: z.enum(["kg", "g", "Liters", "Drums", "Bags"], {
    errorMap: () => ({ message: "Please select a valid unit" })
  }),
  containersCount: z
    .coerce
    .number()
    .int("Must be a whole number of containers")
    .positive("Must have at least 1 container"),
  manufactureDate: z
    .string()
    .min(1, "Original manufacture date is required"),
  previousTestDate: z
    .string()
    .min(1, "Previous test date is required"),
  lastRetestDate: z
    .string()
    .min(1, "Last retest date is required"),
  nextRetestDueDate: z
    .string()
    .min(1, "Next retest due date is required"),
  extendedRetestDate: z.string().optional(),
  retestCycleNumber: z
    .coerce
    .number()
    .int()
    .min(1, "Retest cycle must be at least 1"),
  extensionMonthsGranted: z
    .coerce
    .number()
    .optional(),
  status: z.enum([
    "Due Soon",
    "Overdue",
    "Scheduled",
    "In Progress",
    "Completed",
    "Quarantine",
    "Rejected"
  ]),
  retestReason: z
    .string()
    .min(3, "Retest reason or surveillance protocol reference is required"),
  pharmacopeia: z.enum(["BP 2026", "USP 48-NF 43", "Ph. Eur. 11.0", "In-House Validated"]),
  storageCondition: z
    .string()
    .min(3, "Storage condition is required"),
  analyst: z
    .string()
    .min(2, "Assigned QC Analyst is required"),
  reviewedBy: z
    .string()
    .min(2, "QA Reviewer is required"),
  remarks: z
    .string()
    .min(3, "Surveillance remarks or notes are required")
    .max(500, "Remarks cannot exceed 500 characters")
});

export type RetestSampleFormValues = z.infer<typeof retestSampleSchema>;
