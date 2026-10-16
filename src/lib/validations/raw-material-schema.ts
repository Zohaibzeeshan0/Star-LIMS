import { z } from "zod";

export const rawMaterialSampleSchema = z.object({
  id: z
    .string()
    .min(3, "Sample ID is required (e.g. CP-RAW-2026-0415)")
    .regex(/^[A-Za-z0-9\-_]+$/, "Alphanumeric, hyphen, and underscore characters only"),
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
    "Process Solvent / Reagent",
    "Coating Polymer / Colorant",
    "Preservative / Buffer"
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
    .min(2, "Batch / Lot number is required")
    .regex(/^[A-Za-z0-9\-_/]+$/, "Alphanumeric, dash, and slash characters only"),
  poReference: z
    .string()
    .min(2, "Purchase Order Reference (PO Ref) is required (e.g. PO-2026-8812)"),
  receivedDate: z
    .string()
    .min(1, "Received date is required"),
  samplingDate: z
    .string()
    .min(1, "Sampling date is required"),
  retestDate: z.string().optional(),
  quantity: z
    .coerce
    .number({ invalid_type_error: "Quantity must be a positive number" })
    .positive("Quantity must be greater than zero"),
  unit: z.enum(["kg", "g", "Liters", "mL", "Drums", "Bags"], {
    errorMap: () => ({ message: "Please select a valid unit" })
  }),
  storageCondition: z
    .string()
    .min(3, "Storage condition is required (e.g. Store airtight below 25°C)"),
  pharmacopeia: z.enum(["BP 2026", "USP 48-NF 43", "Ph. Eur. 11.0", "In-House Validated"]),
  status: z.enum([
    "Registered",
    "Under Testing",
    "Reviewed",
    "Released",
    "Rejected",
    "Quarantine",
    "Retest"
  ]),
  remarks: z
    .string()
    .min(3, "Please provide sampling remarks or inspection notes")
    .max(500, "Remarks cannot exceed 500 characters"),
  storageLocation: z.string().optional(),
  analyst: z.string().optional()
});

export type RawMaterialSampleFormValues = z.infer<typeof rawMaterialSampleSchema>;
