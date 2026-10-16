/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 11: Retesting & Stability Surveillance Service
 */

import { apiConfig } from "../api/config";
import { apiClient } from "../api/client";
import { RetestSample, RetestStatus, RetestUnit } from "../types/retesting";
import { MOCK_RETEST_SAMPLES } from "../mock-data/retesting-samples";
import { IRetestingService } from "./types";
import {
  RetestFilterParams,
  CreateRetestSampleRequest,
  UpdateRetestSampleRequest,
} from "../api/contracts";

export class RetestService implements IRetestingService {
  public async getAll(filters?: RetestFilterParams): Promise<RetestSample[]> {
    if (!apiConfig.useMock) {
      return apiClient.get<RetestSample[]>("/retesting", { params: filters as Record<string, string | number> });
    }

    let result = [...MOCK_RETEST_SAMPLES];

    if (filters?.status && filters.status !== "ALL") {
      result = result.filter((s) => s.status === filters.status);
    }
    if (filters?.supplier && filters.supplier !== "ALL") {
      result = result.filter((s) => s.supplier === filters.supplier);
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.materialName.toLowerCase().includes(q) ||
          s.batchNumber.toLowerCase().includes(q) ||
          s.rawMaterialSampleId.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public async getById(id: string): Promise<RetestSample | null> {
    if (!apiConfig.useMock) {
      return apiClient.get<RetestSample>(`/retesting/${id}`);
    }

    const found = MOCK_RETEST_SAMPLES.find((s) => s.id === id);
    return found ? { ...found } : null;
  }

  public async create(payload: CreateRetestSampleRequest): Promise<RetestSample> {
    if (!apiConfig.useMock) {
      return apiClient.post<RetestSample>("/retesting", payload);
    }

    const newId = payload.id || `CP-RET-2026-${String(Math.floor(Math.random() * 899 + 100))}`;
    const newRecord: RetestSample = {
      id: newId,
      rawMaterialSampleId: payload.rawMaterialSampleId.toUpperCase(),
      materialCode: payload.materialCode.toUpperCase(),
      materialName: payload.materialName,
      category: payload.category,
      supplier: payload.supplier,
      manufacturer: payload.manufacturer,
      batchNumber: payload.batchNumber.toUpperCase(),
      warehouseLocation: payload.warehouseLocation,
      remainingStock: Number(payload.remainingStock),
      unit: (payload.unit as RetestUnit) || "kg",
      containersCount: Number(payload.containersCount),
      manufactureDate: payload.manufactureDate,
      previousTestDate: payload.previousTestDate,
      lastRetestDate: payload.lastRetestDate,
      nextRetestDueDate: payload.nextRetestDueDate,
      extendedRetestDate: payload.extendedRetestDate,
      retestCycleNumber: Number(payload.retestCycleNumber),
      extensionMonthsGranted: Number(payload.extensionMonthsGranted || 12),
      status: payload.status || "Scheduled",
      retestReason: payload.retestReason,
      pharmacopeia: (payload.pharmacopeia as RetestSample["pharmacopeia"]) || "BP 2026",
      storageCondition: payload.storageCondition,
      analyst: payload.analyst,
      reviewedBy: payload.reviewedBy,
      remarks: payload.remarks,
      tests: [
        {
          id: "T-01",
          parameter: "Potency Assay (% Dried Basis)",
          specification: "98.5 - 101.5 %",
          initialReleaseResult: "99.8 %",
          currentRetestResult: "99.2 %",
          instrumentUsed: "Waters Alliance HPLC (INST-HPLC-02)",
          passed: true,
        },
        {
          id: "T-02",
          parameter: "Karl Fischer Water Content",
          specification: "NMT 0.50 %",
          initialReleaseResult: "0.22 %",
          currentRetestResult: "0.28 %",
          instrumentUsed: "Metrohm KF Titrator (INST-KF-01)",
          passed: true,
        },
      ],
      history: [],
      timeline: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_RETEST_SAMPLES.unshift(newRecord);
    return { ...newRecord };
  }

  public async update(id: string, payload: UpdateRetestSampleRequest): Promise<RetestSample> {
    if (!apiConfig.useMock) {
      return apiClient.put<RetestSample>(`/retesting/${id}`, payload);
    }

    const idx = MOCK_RETEST_SAMPLES.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Retest sample with ID '${id}' not found`);
    }

    MOCK_RETEST_SAMPLES[idx] = {
      ...MOCK_RETEST_SAMPLES[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    return { ...MOCK_RETEST_SAMPLES[idx] };
  }

  public async updateStatus(id: string, status: RetestStatus, remarks?: string): Promise<RetestSample> {
    if (!apiConfig.useMock) {
      return apiClient.patch<RetestSample>(`/retesting/${id}/status`, { status, remarks });
    }

    const idx = MOCK_RETEST_SAMPLES.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Retest sample with ID '${id}' not found`);
    }

    MOCK_RETEST_SAMPLES[idx] = {
      ...MOCK_RETEST_SAMPLES[idx],
      status,
      remarks: remarks || MOCK_RETEST_SAMPLES[idx].remarks,
      updatedAt: new Date().toISOString(),
    };

    return { ...MOCK_RETEST_SAMPLES[idx] };
  }
}

export const retestService = new RetestService();
