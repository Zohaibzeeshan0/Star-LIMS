/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 11: Master Sample Service (Mock + HTTP interchangeable)
 */

import { apiConfig } from "../api/config";
import { apiClient } from "../api/client";
import { SampleRecord, SampleStatus, PharmacopeiaStandard, PriorityLevel } from "../types/sample";
import { MOCK_SAMPLES } from "../mock-data/samples";
import { ISampleService } from "./types";
import {
  SampleFilterParams,
  CreateSampleRequest,
  UpdateSampleRequest,
} from "../api/contracts";

export class SampleService implements ISampleService {
  public async getAll(filters?: SampleFilterParams): Promise<SampleRecord[]> {
    if (!apiConfig.useMock) {
      return apiClient.get<SampleRecord[]>("/samples", { params: filters as Record<string, string | number> });
    }

    // Mock In-Memory Implementation
    let result = [...MOCK_SAMPLES];

    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.productName.toLowerCase().includes(q) ||
          s.batchNumber.toLowerCase().includes(q)
      );
    }

    if (filters?.category && filters.category !== "ALL") {
      result = result.filter((s) => s.category === filters.category);
    }

    if (filters?.status && filters.status !== "ALL") {
      result = result.filter((s) => s.status === filters.status);
    }

    return result;
  }

  public async getById(id: string): Promise<SampleRecord | null> {
    if (!apiConfig.useMock) {
      return apiClient.get<SampleRecord>(`/samples/${id}`);
    }

    const found = MOCK_SAMPLES.find((s) => s.id === id);
    return found ? { ...found } : null;
  }

  public async create(payload: CreateSampleRequest): Promise<SampleRecord> {
    if (!apiConfig.useMock) {
      return apiClient.post<SampleRecord>("/samples", payload);
    }

    const sampleId = `CP-REG-2026-${String(Math.floor(Math.random() * 8999 + 1000))}`;
    const newRecord: SampleRecord = {
      id: sampleId,
      batchNumber: payload.batchNumber.toUpperCase(),
      productName: payload.productName,
      category: payload.category,
      pharmacopeia: (payload.pharmacopeia as PharmacopeiaStandard) || "BP 2026",
      mfgDate: payload.mfgDate,
      expDate: payload.expDate,
      retestDate: payload.retestDate,
      batchSize: payload.batchSize,
      sampleQuantity: payload.sampleQuantity,
      storageCondition: payload.storageCondition,
      priority: (payload.priority as PriorityLevel) || "Normal",
      analyst: payload.analyst,
      analystDepartment: "QC Department",
      receivedDate: new Date().toISOString().slice(0, 10),
      targetSpecification: payload.targetSpecification,
      observedSummary: "Under Intake Queue • Awaiting Lab Stage",
      status: "In Testing",
      statusNotes: "Sample successfully registered into Citi Pharma Chain of Custody.",
      tests: payload.selectedTests.map((tName, i) => ({
        id: `T${i + 1}`,
        name: tName,
        specification: "Per monograph protocol",
        observedResult: "Pending Analysis",
        passed: true,
      })),
      reviewedBy: "Pending QC Review",
      reviewedDate: "Pending",
    };

    MOCK_SAMPLES.unshift(newRecord);
    return { ...newRecord };
  }

  public async update(id: string, payload: UpdateSampleRequest): Promise<SampleRecord> {
    if (!apiConfig.useMock) {
      return apiClient.put<SampleRecord>(`/samples/${id}`, payload);
    }

    const idx = MOCK_SAMPLES.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Sample with ID '${id}' not found`);
    }

    MOCK_SAMPLES[idx] = {
      ...MOCK_SAMPLES[idx],
      ...payload,
    };

    return { ...MOCK_SAMPLES[idx] };
  }

  public async updateStatus(id: string, status: SampleStatus, remarks?: string): Promise<SampleRecord> {
    if (!apiConfig.useMock) {
      return apiClient.patch<SampleRecord>(`/samples/${id}/status`, { status, remarks });
    }

    const idx = MOCK_SAMPLES.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Sample with ID '${id}' not found`);
    }

    MOCK_SAMPLES[idx] = {
      ...MOCK_SAMPLES[idx],
      status,
      statusNotes: remarks || MOCK_SAMPLES[idx].statusNotes,
      reviewedDate: new Date().toISOString().slice(0, 16).replace("T", " "),
    };

    return { ...MOCK_SAMPLES[idx] };
  }
}

export const sampleService = new SampleService();
