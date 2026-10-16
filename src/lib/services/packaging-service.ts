/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 11: Packaging Material Service
 */

import { apiConfig } from "../api/config";
import { apiClient } from "../api/client";
import { PackagingSample, PackagingStatus, PackagingUnit } from "../types/packaging";
import { MOCK_PACKAGING_SAMPLES } from "../mock-data/packaging-samples";
import { IPackagingService } from "./types";
import {
  PackagingFilterParams,
  CreatePackagingSampleRequest,
  UpdatePackagingSampleRequest,
} from "../api/contracts";

export class PackagingService implements IPackagingService {
  public async getAll(filters?: PackagingFilterParams): Promise<PackagingSample[]> {
    if (!apiConfig.useMock) {
      return apiClient.get<PackagingSample[]>("/packaging", { params: filters as Record<string, string | number> });
    }

    let result = [...MOCK_PACKAGING_SAMPLES];

    if (filters?.status && filters.status !== "ALL") {
      result = result.filter((s) => s.status === filters.status);
    }
    if (filters?.packagingType && filters.packagingType !== "ALL") {
      result = result.filter((s) => s.packagingType === filters.packagingType);
    }
    if (filters?.supplier && filters.supplier !== "ALL") {
      result = result.filter((s) => s.supplier === filters.supplier);
    }
    if (filters?.dateFrom) {
      result = result.filter((s) => s.receivedDate >= filters.dateFrom!);
    }
    if (filters?.dateTo) {
      result = result.filter((s) => s.receivedDate <= filters.dateTo!);
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.materialName.toLowerCase().includes(q) ||
          s.batchNumber.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public async getById(id: string): Promise<PackagingSample | null> {
    if (!apiConfig.useMock) {
      return apiClient.get<PackagingSample>(`/packaging/${id}`);
    }

    const found = MOCK_PACKAGING_SAMPLES.find((s) => s.id === id);
    return found ? { ...found } : null;
  }

  public async create(payload: CreatePackagingSampleRequest): Promise<PackagingSample> {
    if (!apiConfig.useMock) {
      return apiClient.post<PackagingSample>("/packaging", payload);
    }

    const newId = payload.id || `CP-PKG-2026-${String(Math.floor(Math.random() * 899 + 100))}`;
    const newRecord: PackagingSample = {
      id: newId,
      materialCode: payload.materialCode.toUpperCase(),
      materialName: payload.materialName,
      supplier: payload.supplier,
      manufacturer: payload.manufacturer,
      batchNumber: payload.batchNumber.toUpperCase(),
      receivedDate: payload.receivedDate,
      samplingDate: payload.samplingDate,
      quantity: Number(payload.quantity),
      unit: (payload.unit as PackagingUnit) || "Rolls",
      packagingType: payload.packagingType,
      status: payload.status || "Registered",
      remarks: payload.remarks || "Sample logged for QC physical & barrier verification.",
      storageLocation: payload.storageLocation || "PM Receiving Bay 01",
      analyst: payload.analyst || "Hamza Shafiq",
      inspectedBy: "Dr. Farhan Malik",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tests: [
        {
          id: "T-01",
          name: "Visual Defect & Dimensional Verification",
          specification: "Free from pinholes, uniform thickness ± 5%",
          observedResult: "Conforms to standard template",
          passed: true,
        },
        {
          id: "T-02",
          name: "Heat-Seal / Barrier Integrity Testing",
          specification: "Burst pressure ≥ 45 N, zero leakages",
          observedResult: "52 N burst resistance",
          passed: true,
        },
      ],
    };

    MOCK_PACKAGING_SAMPLES.unshift(newRecord);
    return { ...newRecord };
  }

  public async update(id: string, payload: UpdatePackagingSampleRequest): Promise<PackagingSample> {
    if (!apiConfig.useMock) {
      return apiClient.put<PackagingSample>(`/packaging/${id}`, payload);
    }

    const idx = MOCK_PACKAGING_SAMPLES.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Packaging sample with ID '${id}' not found`);
    }

    MOCK_PACKAGING_SAMPLES[idx] = {
      ...MOCK_PACKAGING_SAMPLES[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    return { ...MOCK_PACKAGING_SAMPLES[idx] };
  }

  public async updateStatus(id: string, status: PackagingStatus, remarks?: string): Promise<PackagingSample> {
    if (!apiConfig.useMock) {
      return apiClient.patch<PackagingSample>(`/packaging/${id}/status`, { status, remarks });
    }

    const idx = MOCK_PACKAGING_SAMPLES.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Packaging sample with ID '${id}' not found`);
    }

    MOCK_PACKAGING_SAMPLES[idx] = {
      ...MOCK_PACKAGING_SAMPLES[idx],
      status,
      remarks: remarks || MOCK_PACKAGING_SAMPLES[idx].remarks,
      updatedAt: new Date().toISOString(),
    };

    return { ...MOCK_PACKAGING_SAMPLES[idx] };
  }
}

export const packagingService = new PackagingService();
