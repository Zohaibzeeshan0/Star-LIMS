/**
 * Citi Pharma Laboratory Management System (LIMS)
 * TypeScript Type Definitions
 */

export type SampleCategory =
  | "Packaging Material"
  | "Raw Material (API)"
  | "Raw Material Retesting"
  | "Product Sample (Finished)"
  | "Product Sample (In-Process)"
  | "Product Sample (Stability)"
  | "Sterile Injectable";

export type SampleStatus =
  | "Pass/Released"
  | "Fail/Rejected"
  | "Quarantine/Retest"
  | "In Testing"
  | "QA Review";

export type PriorityLevel = "Normal" | "Urgent" | "Immediate Release";

export type PharmacopeiaStandard =
  | "BP 2026"
  | "USP 48-NF 43"
  | "Ph. Eur. 11.0"
  | "In-House Validated";

export interface TestParameter {
  id: string;
  name: string;
  specification: string;
  observedResult: string;
  passed: boolean;
  testedBy?: string;
  instrumentId?: string;
}

export interface SampleRecord {
  id: string; // e.g., CP-SAMP-2026-0842
  batchNumber: string; // e.g., PAR-500-B294
  productName: string;
  category: SampleCategory;
  pharmacopeia: PharmacopeiaStandard;
  mfgDate: string;
  expDate: string;
  retestDate?: string;
  batchSize: string;
  sampleQuantity: string;
  storageCondition: string;
  priority: PriorityLevel;
  analyst: string;
  analystDepartment: string;
  receivedDate: string;
  targetSpecification: string;
  observedSummary: string;
  status: SampleStatus;
  statusNotes: string;
  tests: TestParameter[];
  reviewedBy: string;
  reviewedDate: string;
  digitalSignatureHash?: string;
  oosInvestigationId?: string;
}

export interface LabInstrument {
  id: string;
  name: string;
  type: string;
  location: string;
  lastCalibrated: string;
  nextCalibrationDue: string;
  status: "Operational" | "Due Soon" | "Quarantined" | "Under Maintenance";
  calibrationStatus: "Valid" | "Due in 48h" | "Recalibration Required";
  responsibleChemist: string;
}

export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  user: string;
  action:
    | "SAMPLE_REGISTRATION"
    | "TEST_RESULT_ENTRY"
    | "STATUS_CHANGE"
    | "COA_GENERATED"
    | "APPROVAL_RELEASE"
    | "INSTRUMENT_CALIBRATION"
    | "OOS_INVESTIGATION_OPENED";
  target: string;
  detail: string;
  ipAddress: string;
  cfrChecksum: string;
}
