/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 11: Retesting & Stability Surveillance API Contracts
 */

import { RetestSample, RetestStatus, RetestUrgency, RetestCategory, RetestUnit } from "../../types/retesting";
import { BaseFilterParams, StatusChangeRequest, PharmacopeiaStandard } from "./common";

export interface RetestFilterParams extends BaseFilterParams {
  urgency?: RetestUrgency | "ALL";
  supplier?: string;
  cycleNumber?: number;
}

export interface CreateRetestSampleRequest {
  id?: string;
  rawMaterialSampleId: string;
  materialCode: string;
  materialName: string;
  category: RetestCategory;
  supplier: string;
  manufacturer: string;
  batchNumber: string;
  warehouseLocation: string;
  remainingStock: number;
  unit: RetestUnit;
  containersCount: number;
  manufactureDate: string;
  previousTestDate: string;
  lastRetestDate: string;
  nextRetestDueDate: string;
  extendedRetestDate?: string;
  retestCycleNumber: number;
  extensionMonthsGranted?: number;
  status?: RetestStatus;
  retestReason: string;
  pharmacopeia: PharmacopeiaStandard;
  storageCondition: string;
  analyst: string;
  reviewedBy: string;
  remarks: string;
}

export type UpdateRetestSampleRequest = Partial<CreateRetestSampleRequest>;

export type RetestStatusChangeRequest = StatusChangeRequest<RetestStatus>;
