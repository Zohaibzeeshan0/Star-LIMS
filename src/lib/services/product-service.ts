/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 11: Finished Products Service
 */

import { apiConfig } from "../api/config";
import { apiClient } from "../api/client";
import { ProductSample, ProductStatus, ProductUnit } from "../types/product";
import { MOCK_PRODUCT_SAMPLES } from "../mock-data/products";
import { IProductService } from "./types";
import {
  ProductFilterParams,
  CreateProductSampleRequest,
  UpdateProductSampleRequest,
} from "../api/contracts";

export class ProductService implements IProductService {
  public async getAll(filters?: ProductFilterParams): Promise<ProductSample[]> {
    if (!apiConfig.useMock) {
      return apiClient.get<ProductSample[]>("/products", { params: filters as Record<string, string | number> });
    }

    let result = [...MOCK_PRODUCT_SAMPLES];

    if (filters?.dosageForm && filters.dosageForm !== "ALL") {
      result = result.filter((s) => s.dosageForm === filters.dosageForm);
    }
    if (filters?.status && filters.status !== "ALL") {
      result = result.filter((s) => s.status === filters.status);
    }
    if (filters?.sampleType && filters.sampleType !== "ALL") {
      result = result.filter((s) => s.sampleType === filters.sampleType);
    }
    if (filters?.dateFrom) {
      result = result.filter((s) => s.manufacturingDate >= filters.dateFrom!);
    }
    if (filters?.dateTo) {
      result = result.filter((s) => s.manufacturingDate <= filters.dateTo!);
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.productName.toLowerCase().includes(q) ||
          s.batchNumber.toLowerCase().includes(q) ||
          s.productCode.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public async getById(id: string): Promise<ProductSample | null> {
    if (!apiConfig.useMock) {
      return apiClient.get<ProductSample>(`/products/${id}`);
    }

    const found = MOCK_PRODUCT_SAMPLES.find((s) => s.id === id);
    return found ? { ...found } : null;
  }

  public async create(payload: CreateProductSampleRequest): Promise<ProductSample> {
    if (!apiConfig.useMock) {
      return apiClient.post<ProductSample>("/products", payload);
    }

    const newId = payload.id || `CP-PRD-2026-${String(Math.floor(Math.random() * 899 + 500))}`;
    const newRecord: ProductSample = {
      id: newId,
      productName: payload.productName,
      productCode: payload.productCode.toUpperCase(),
      dosageForm: payload.dosageForm,
      strength: payload.strength,
      genericName: payload.genericName,
      batchNumber: payload.batchNumber.toUpperCase(),
      batchSize: payload.batchSize,
      batchStatus: payload.batchStatus,
      manufacturingDate: payload.manufacturingDate,
      expiryDate: payload.expiryDate,
      receivedDate: payload.receivedDate,
      samplingDate: payload.samplingDate,
      sampleType: payload.sampleType,
      packagingDetails: payload.packagingDetails,
      productionLine: payload.productionLine,
      targetMarket: payload.targetMarket,
      storageCondition: payload.storageCondition,
      pharmacopeia: (payload.pharmacopeia as ProductSample["pharmacopeia"]) || "BP 2026",
      quantitySampled: Number(payload.quantitySampled),
      unit: (payload.unit as ProductUnit) || "Tablets",
      status: payload.status || "Registered",
      analyst: payload.analyst,
      reviewedBy: payload.reviewedBy,
      remarks: payload.remarks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tests: [
        {
          id: "T-01",
          parameter: "Active Ingredient Assay by HPLC",
          specification: "98.0% - 102.0% of label claim",
          observedResult: "99.8%",
          instrumentUsed: "Waters Alliance HPLC (INST-HPLC-02)",
          passed: true,
        },
        {
          id: "T-02",
          parameter: "Dissolution Rate (USP Apparatus II)",
          specification: "Q ≥ 80% at 30 minutes in 0.1N HCl",
          observedResult: "94.2% at 30 min",
          instrumentUsed: "Electrolab Dissolution Tester (INST-DIS-01)",
          passed: true,
        },
      ],
      statusHistory: [],
    };

    MOCK_PRODUCT_SAMPLES.unshift(newRecord);
    return { ...newRecord };
  }

  public async update(id: string, payload: UpdateProductSampleRequest): Promise<ProductSample> {
    if (!apiConfig.useMock) {
      return apiClient.put<ProductSample>(`/products/${id}`, payload);
    }

    const idx = MOCK_PRODUCT_SAMPLES.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Product sample with ID '${id}' not found`);
    }

    MOCK_PRODUCT_SAMPLES[idx] = {
      ...MOCK_PRODUCT_SAMPLES[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    return { ...MOCK_PRODUCT_SAMPLES[idx] };
  }

  public async updateStatus(id: string, status: ProductStatus, remarks?: string): Promise<ProductSample> {
    if (!apiConfig.useMock) {
      return apiClient.patch<ProductSample>(`/products/${id}/status`, { status, remarks });
    }

    const idx = MOCK_PRODUCT_SAMPLES.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Product sample with ID '${id}' not found`);
    }

    MOCK_PRODUCT_SAMPLES[idx] = {
      ...MOCK_PRODUCT_SAMPLES[idx],
      status,
      remarks: remarks || MOCK_PRODUCT_SAMPLES[idx].remarks,
      updatedAt: new Date().toISOString(),
    };

    return { ...MOCK_PRODUCT_SAMPLES[idx] };
  }
}

export const productService = new ProductService();
