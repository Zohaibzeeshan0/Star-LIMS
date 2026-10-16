/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 11: Raw Materials (APIs/Excipients) API Contracts
 */

import { RawMaterialSample, RawMaterialCategory, RawMaterialStatus, RawMaterialUnit } from "../../types/raw-material";
import { BaseFilterParams, StatusChangeRequest, PharmacopeiaStandard } from "./common";

export interface RawMaterialFilterParams extends BaseFilterParams {
  category?: RawMaterialCategory | "ALL";
  supplier?: string;
  manufacturer?: string;
  pharmacopeia?: string;
}

export interface CreateRawMaterialRequest {
  id?: string;
  materialCode: string;
  materialName: string;
  category: RawMaterialCategory;
  casNumber?: string;
  supplier: string;
  manufacturer: string;
  batchNumber: string;
  poReference: string;
  receivedDate: string;
  samplingDate: string;
  retestDate?: string;
  quantity: number;
  unit: RawMaterialUnit;
  storageCondition: string;
  pharmacopeia: PharmacopeiaStandard;
  status?: RawMaterialStatus;
  remarks: string;
  storageLocation?: string;
  analyst?: string;
}

export type UpdateRawMaterialRequest = Partial<CreateRawMaterialRequest>;

export type RawMaterialStatusChangeRequest = StatusChangeRequest<RawMaterialStatus>;
