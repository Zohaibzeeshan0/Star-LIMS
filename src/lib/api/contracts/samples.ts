/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 11: Master Sample API Contracts
 */

import { SampleRecord, SampleStatus, SampleCategory, PharmacopeiaStandard, PriorityLevel } from "../../types/sample";
import { BaseFilterParams, StatusChangeRequest } from "./common";

export interface SampleFilterParams extends BaseFilterParams {
  category?: SampleCategory | "ALL";
  pharmacopeia?: string;
  analyst?: string;
}

export interface CreateSampleRequest {
  batchNumber: string;
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
  selectedTests: string[];
  targetSpecification: string;
}

export type UpdateSampleRequest = Partial<CreateSampleRequest>;

export type SampleStatusChangeRequest = StatusChangeRequest<SampleStatus>;
