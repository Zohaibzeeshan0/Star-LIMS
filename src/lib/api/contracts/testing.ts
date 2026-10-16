/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 11: QC Testing Worklist API Contracts
 */

import { TestWorklistItem, TestStatus, TestParameterResult } from "../../types/testing";
import { BaseFilterParams } from "./common";

export interface TestingFilterParams extends BaseFilterParams {
  testType?: string;
  assignedAnalyst?: string;
  instrumentReference?: string;
  isOOS?: boolean;
}

export interface SaveTestResultsRequest {
  testId: string;
  assignedAnalyst: string;
  testingDate: string;
  instrumentReference: string;
  observations: string;
  analystComments: string;
  status: TestStatus;
  parameters: TestParameterResult[];
}

export interface TestReviewRequest {
  testId: string;
  reviewedBy: string;
  reviewDate: string;
  reviewComments: string;
  disposition: TestStatus;
  electronicSignatureAcknowledged: boolean;
}
