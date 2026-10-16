import { z } from "zod";

export const sampleRegistrationSchema = z.object({
  productName: z.string().min(3, "Product / Chemical Name must be at least 3 characters."),
  batchNumber: z.string().min(2, "Batch / Lot Number is required (e.g. PAR-500-B294).").regex(/^[a-zA-Z0-9\-_/]+$/, "Alphanumeric, dash, or slash characters only."),
  category: z.enum([
    "Packaging Material",
    "Raw Material (API)",
    "Raw Material Retesting",
    "Product Sample (Finished)",
    "Product Sample (In-Process)",
    "Product Sample (Stability)",
    "Sterile Injectable"
  ], {
    errorMap: () => ({ message: "Please select a valid sample classification." })
  }),
  pharmacopeia: z.enum([
    "BP 2026",
    "USP 48-NF 43",
    "Ph. Eur. 11.0",
    "In-House Validated"
  ]),
  batchSize: z.string().min(1, "Batch size is required (e.g. 500,000 Tablets, 250 kg)."),
  sampleQuantity: z.string().min(1, "Sample quantity sampled is required (e.g. 100 Tablets, 150g)."),
  storageCondition: z.string().min(1, "Storage temperature/condition must be specified."),
  priority: z.enum(["Normal", "Urgent", "Immediate Release"]),
  analyst: z.string().min(1, "Please assign a qualified analytical chemist."),
  mfgDate: z.string().min(1, "Manufacturing date is required."),
  expDate: z.string().min(1, "Expiry date is required."),
  retestDate: z.string().optional(),
  targetSpecification: z.string().min(5, "Analytical monograph specification limit is required."),
  selectedTests: z.array(z.string()).min(1, "Select at least one mandatory analytical test parameter.")
});

export type SampleRegistrationFormValues = z.infer<typeof sampleRegistrationSchema>;

export const testResultEntrySchema = z.object({
  status: z.enum([
    "Pass/Released",
    "Fail/Rejected",
    "Quarantine/Retest",
    "In Testing",
    "QA Review"
  ]),
  statusNotes: z.string().min(5, "Disposition conclusion notes are mandatory."),
  analystSignOff: z.string().min(2, "Electronic signature authorization name is required.")
});

export type TestResultEntryFormValues = z.infer<typeof testResultEntrySchema>;
