/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 11: Raw Material Service
 */

import { apiConfig } from "../api/config";
import { apiClient } from "../api/client";
import { RawMaterialSample, RawMaterialStatus, RawMaterialUnit } from "../types/raw-material";
import { MOCK_RAW_MATERIALS } from "../mock-data/raw-materials";
import { IRawMaterialService } from "./types";
import {
  RawMaterialFilterParams,
  CreateRawMaterialRequest,
  UpdateRawMaterialRequest,
} from "../api/contracts";

export class RawMaterialService implements IRawMaterialService {
  public async getAll(filters?: RawMaterialFilterParams): Promise<RawMaterialSample[]> {
    if (!apiConfig.useMock) {
      return apiClient.get<RawMaterialSample[]>("/raw-materials", { params: filters as Record<string, string | number> });
    }

    let result = [...MOCK_RAW_MATERIALS];

    if (filters?.category && filters.category !== "ALL") {
      result = result.filter((s) => s.category === filters.category);
    }
    if (filters?.status && filters.status !== "ALL") {
      result = result.filter((s) => s.status === filters.status);
    }
    if (filters?.supplier && filters.supplier !== "ALL") {
      result = result.filter((s) => s.supplier === filters.supplier);
    }
    if (filters?.pharmacopeia && filters.pharmacopeia !== "ALL") {
      result = result.filter((s) => s.pharmacopeia === filters.pharmacopeia);
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
          s.batchNumber.toLowerCase().includes(q) ||
          s.materialCode.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public async getById(id: string): Promise<RawMaterialSample | null> {
    if (!apiConfig.useMock) {
      return apiClient.get<RawMaterialSample>(`/raw-materials/${id}`);
    }

    const found = MOCK_RAW_MATERIALS.find((s) => s.id === id);
    return found ? { ...found } : null;
  }

  public async create(payload: CreateRawMaterialRequest): Promise<RawMaterialSample> {
    if (!apiConfig.useMock) {
      return apiClient.post<RawMaterialSample>("/raw-materials", payload);
    }

    const newId = payload.id || `CP-RAW-2026-${String(Math.floor(Math.random() * 899 + 100))}`;
    const newRecord: RawMaterialSample = {
      id: newId,
      materialCode: payload.materialCode.toUpperCase(),
      materialName: payload.materialName,
      category: payload.category,
      supplier: payload.supplier,
      manufacturer: payload.manufacturer,
      batchNumber: payload.batchNumber.toUpperCase(),
      poReference: payload.poReference,
      receivedDate: payload.receivedDate,
      samplingDate: payload.samplingDate,
      retestDate: payload.retestDate,
      quantity: Number(payload.quantity),
      unit: (payload.unit as RawMaterialUnit) || "kg",
      storageCondition: payload.storageCondition,
      pharmacopeia: (payload.pharmacopeia as RawMaterialSample["pharmacopeia"]) || "BP 2026",
      status: payload.status || "Registered",
      remarks: payload.remarks,
      storageLocation: payload.storageLocation || "API Quarantine Bay Q-01",
      analyst: payload.analyst || "Zubair Ahmed",
      reviewedBy: "Dr. Farhan Malik",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tests: [
        {
          id: "T-01",
          name: "Identification by FT-IR Spectroscopy",
          specification: "Concordant with reference spectrum",
          observedResult: "Concordant (Correlation > 0.98)",
          instrumentUsed: "Shimadzu IRSpirit (INST-FTIR-01)",
          passed: true,
        },
        {
          id: "T-02",
          name: "Assay (% Purity on Dried Basis)",
          specification: "98.5% - 101.5%",
          observedResult: "99.8%",
          instrumentUsed: "Waters Alliance HPLC (INST-HPLC-02)",
          passed: true,
        },
      ],
    };

    MOCK_RAW_MATERIALS.unshift(newRecord);
    return { ...newRecord };
  }

  public async update(id: string, payload: UpdateRawMaterialRequest): Promise<RawMaterialSample> {
    if (!apiConfig.useMock) {
      return apiClient.put<RawMaterialSample>(`/raw-materials/${id}`, payload);
    }

    const idx = MOCK_RAW_MATERIALS.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Raw material sample with ID '${id}' not found`);
    }

    MOCK_RAW_MATERIALS[idx] = {
      ...MOCK_RAW_MATERIALS[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    return { ...MOCK_RAW_MATERIALS[idx] };
  }

  public async updateStatus(id: string, status: RawMaterialStatus, remarks?: string): Promise<RawMaterialSample> {
    if (!apiConfig.useMock) {
      return apiClient.patch<RawMaterialSample>(`/raw-materials/${id}/status`, { status, remarks });
    }

    const idx = MOCK_RAW_MATERIALS.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Raw material sample with ID '${id}' not found`);
    }

    MOCK_RAW_MATERIALS[idx] = {
      ...MOCK_RAW_MATERIALS[idx],
      status,
      remarks: remarks || MOCK_RAW_MATERIALS[idx].remarks,
      updatedAt: new Date().toISOString(),
    };

    return { ...MOCK_RAW_MATERIALS[idx] };
  }
}

export const rawMaterialService = new RawMaterialService();
