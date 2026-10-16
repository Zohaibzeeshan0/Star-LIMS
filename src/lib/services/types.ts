/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 11: Service Layer Contract Interfaces
 */

import { SampleRecord, SampleStatus } from "../types/sample";
import { PackagingSample, PackagingStatus } from "../types/packaging";
import { RawMaterialSample, RawMaterialStatus } from "../types/raw-material";
import { RetestSample, RetestStatus } from "../types/retesting";
import { ProductSample, ProductStatus } from "../types/product";
import { TestWorklistItem } from "../types/testing";
import {
  SampleFilterParams,
  CreateSampleRequest,
  UpdateSampleRequest,
  PackagingFilterParams,
  CreatePackagingSampleRequest,
  UpdatePackagingSampleRequest,
  RawMaterialFilterParams,
  CreateRawMaterialRequest,
  UpdateRawMaterialRequest,
  RetestFilterParams,
  CreateRetestSampleRequest,
  UpdateRetestSampleRequest,
  ProductFilterParams,
  CreateProductSampleRequest,
  UpdateProductSampleRequest,
  TestingFilterParams,
  SaveTestResultsRequest,
  TestReviewRequest,
  ReportFilterParams,
  ReportDataResponse,
  ReportExportRequest,
} from "../api/contracts";

export interface ISampleService {
  getAll(filters?: SampleFilterParams): Promise<SampleRecord[]>;
  getById(id: string): Promise<SampleRecord | null>;
  create(payload: CreateSampleRequest): Promise<SampleRecord>;
  update(id: string, payload: UpdateSampleRequest): Promise<SampleRecord>;
  updateStatus(id: string, status: SampleStatus, remarks?: string): Promise<SampleRecord>;
}

export interface IPackagingService {
  getAll(filters?: PackagingFilterParams): Promise<PackagingSample[]>;
  getById(id: string): Promise<PackagingSample | null>;
  create(payload: CreatePackagingSampleRequest): Promise<PackagingSample>;
  update(id: string, payload: UpdatePackagingSampleRequest): Promise<PackagingSample>;
  updateStatus(id: string, status: PackagingStatus, remarks?: string): Promise<PackagingSample>;
}

export interface IRawMaterialService {
  getAll(filters?: RawMaterialFilterParams): Promise<RawMaterialSample[]>;
  getById(id: string): Promise<RawMaterialSample | null>;
  create(payload: CreateRawMaterialRequest): Promise<RawMaterialSample>;
  update(id: string, payload: UpdateRawMaterialRequest): Promise<RawMaterialSample>;
  updateStatus(id: string, status: RawMaterialStatus, remarks?: string): Promise<RawMaterialSample>;
}

export interface IRetestingService {
  getAll(filters?: RetestFilterParams): Promise<RetestSample[]>;
  getById(id: string): Promise<RetestSample | null>;
  create(payload: CreateRetestSampleRequest): Promise<RetestSample>;
  update(id: string, payload: UpdateRetestSampleRequest): Promise<RetestSample>;
  updateStatus(id: string, status: RetestStatus, remarks?: string): Promise<RetestSample>;
}

export interface IProductService {
  getAll(filters?: ProductFilterParams): Promise<ProductSample[]>;
  getById(id: string): Promise<ProductSample | null>;
  create(payload: CreateProductSampleRequest): Promise<ProductSample>;
  update(id: string, payload: UpdateProductSampleRequest): Promise<ProductSample>;
  updateStatus(id: string, status: ProductStatus, remarks?: string): Promise<ProductSample>;
}

export interface ITestingService {
  getAll(filters?: TestingFilterParams): Promise<TestWorklistItem[]>;
  getById(id: string): Promise<TestWorklistItem | null>;
  saveResults(payload: SaveTestResultsRequest): Promise<TestWorklistItem>;
  submitReview(payload: TestReviewRequest): Promise<TestWorklistItem>;
}

export interface IReportService {
  getReportData(filters: ReportFilterParams): Promise<ReportDataResponse>;
  exportReport(payload: ReportExportRequest): Promise<{ downloadUrl?: string; filename: string }>;
}
