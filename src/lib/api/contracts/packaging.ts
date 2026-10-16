/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 11: Packaging Material API Contracts
 */

import { PackagingSample, PackagingStatus, PackagingType, PackagingUnit } from "../../types/packaging";
import { BaseFilterParams, StatusChangeRequest } from "./common";

export interface PackagingFilterParams extends BaseFilterParams {
  packagingType?: PackagingType | "ALL";
  supplier?: string;
  manufacturer?: string;
}

export interface CreatePackagingSampleRequest {
  id?: string;
  materialCode: string;
  materialName: string;
  supplier: string;
  manufacturer: string;
  batchNumber: string;
  receivedDate: string;
  samplingDate: string;
  quantity: number;
  unit: PackagingUnit;
  packagingType: PackagingType;
  status?: PackagingStatus;
  remarks?: string;
  storageLocation?: string;
  analyst?: string;
}

export type UpdatePackagingSampleRequest = Partial<CreatePackagingSampleRequest>;

export type PackagingStatusChangeRequest = StatusChangeRequest<PackagingStatus>;
