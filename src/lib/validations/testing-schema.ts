import { z } from "zod";

export const testParameterResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  specification: z.string(),
  unit: z.string(),
  inputType: z.enum(["numeric", "text", "selectable"]),
  observedResult: z.string().min(1, "Observed result is required"),
  status: z.enum(["Pass", "Fail", "Pending"]),
  instrumentUsed: z.string().optional(),
  analystNotes: z.string().optional()
});

export const resultEntryFormSchema = z.object({
  id: z.string(),
  sampleId: z.string(),
  materialOrProduct: z.string(),
  batchNumber: z.string(),
  testType: z.string(),
  assignedAnalyst: z.string().min(2, "Assigned analyst name is required"),
  testingDate: z.string().min(1, "Testing date is required"),
  instrumentReference: z.string().min(2, "Instrument reference ID is required"),
  observations: z
    .string()
    .min(3, "Observations are required (e.g. system suitability, color changes)")
    .max(500, "Observations cannot exceed 500 characters"),
  analystComments: z
    .string()
    .min(3, "Analyst comments are required")
    .max(500, "Comments cannot exceed 500 characters"),
  status: z.enum([
    "Not Started",
    "In Progress",
    "Completed",
    "Pending Review",
    "Reviewed",
    "Out of Specification"
  ]),
  parameters: z.array(testParameterResultSchema)
});

export const testReviewFormSchema = z.object({
  reviewedBy: z.string().min(2, "Reviewer name is required"),
  reviewDate: z.string().min(1, "Review date is required"),
  reviewComments: z
    .string()
    .min(3, "QA review comments and monograph verification statement are required")
    .max(600, "Review comments cannot exceed 600 characters"),
  disposition: z.enum([
    "Reviewed",
    "Out of Specification",
    "In Progress"
  ])
});

export type ResultEntryFormValues = z.infer<typeof resultEntryFormSchema>;
export type TestReviewFormValues = z.infer<typeof testReviewFormSchema>;
