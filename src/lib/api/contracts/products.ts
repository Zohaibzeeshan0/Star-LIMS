/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 11: Finished Products API Contracts
 */

import { ProductSample, ProductStatus, DosageForm, SampleReleaseType, ProductUnit } from "../../types/product";
import { BaseFilterParams, StatusChangeRequest, PharmacopeiaStandard } from "./common";

export interface ProductFilterParams extends BaseFilterParams {
  dosageForm?: DosageForm | "ALL";
  sampleType?: SampleReleaseType | "ALL";
  productCode?: string;
}

export interface CreateProductSampleRequest {
  id?: string;
  productName: string;
  productCode: string;
  dosageForm: DosageForm;
  strength: string;
  genericName: string;
  batchNumber: string;
  batchSize: string;
  batchStatus: "Commercial Batch" | "Validation Batch" | "Pilot Batch" | "Stability Chamber Batch" | "Quarantine Hold";
  manufacturingDate: string;
  expiryDate: string;
  receivedDate: string;
  samplingDate: string;
  sampleType: SampleReleaseType;
  packagingDetails: string;
  productionLine: string;
  targetMarket: "Domestic (DRAP)" | "Export (GCC / MENA)" | "Institutional Hospital Supply";
  storageCondition: string;
  pharmacopeia: PharmacopeiaStandard;
  quantitySampled: number;
  unit: ProductUnit;
  status?: ProductStatus;
  analyst: string;
  reviewedBy: string;
  remarks: string;
}

export type UpdateProductSampleRequest = Partial<CreateProductSampleRequest>;

export type ProductStatusChangeRequest = StatusChangeRequest<ProductStatus>;
