import { z } from "zod";

export const packagingSampleSchema = z.object({
  id: z
    .string()
    .min(3, "Sample ID is required (e.g. CP-PKG-2026-0115)")
    .regex(/^[A-Za-z0-9\-_]+$/, "Alphanumeric, hyphen, and underscore characters only"),
  materialName: z
    .string()
    .min(3, "Material name must be at least 3 characters")
    .max(120, "Material name cannot exceed 120 characters"),
  materialCode: z
    .string()
    .min(2, "Material item code is required (e.g. PM-FOL-0042)"),
  supplier: z
    .string()
    .min(2, "Supplier / Vendor name is required"),
  manufacturer: z
    .string()
    .min(2, "Manufacturer name is required"),
  batchNumber: z
    .string()
    .min(2, "Batch / Lot number is required")
    .regex(/^[A-Za-z0-9\-_/]+$/, "Alphanumeric, dash, slash characters only"),
  receivedDate: z
    .string()
    .min(1, "Received date is required"),
  samplingDate: z
    .string()
    .min(1, "Sampling date is required"),
  quantity: z
    .coerce
    .number({ invalid_type_error: "Quantity must be a positive number" })
    .positive("Quantity must be greater than zero"),
  unit: z.enum([
    "Rolls",
    "Bottles",
    "Vials",
    "Caps",
    "Cartons",
    "Leaflets",
    "Sheets",
    "Stoppers",
    "kg",
    "Units"
  ], {
    errorMap: () => ({ message: "Please select a valid measurement unit" })
  }),
  packagingType: z.enum([
    "Primary Packaging",
    "Secondary Packaging",
    "Tertiary Packaging",
    "Printed Packaging",
    "Closures & Seals"
  ], {
    errorMap: () => ({ message: "Please select a valid packaging classification" })
  }),
  status: z.enum([
    "Registered",
    "Under Testing",
    "Released",
    "Rejected",
    "Quarantine",
    "Retest"
  ]),
  remarks: z
    .string()
    .min(3, "Please provide brief remarks or inspection instructions")
    .max(500, "Remarks cannot exceed 500 characters"),
  storageLocation: z.string().optional(),
  analyst: z.string().optional()
});

export type PackagingSampleFormValues = z.infer<typeof packagingSampleSchema>;
