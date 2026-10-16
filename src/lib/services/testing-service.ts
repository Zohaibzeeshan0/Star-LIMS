/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 11: QC Testing Worklist Service (Mock + HTTP interchangeable)
 */

import { apiConfig } from "../api/config";
import { apiClient } from "../api/client";
import { TestWorklistItem, TestStatus } from "../types/testing";
import { MOCK_TEST_WORKLIST } from "../mock-data/testing-worklist";
import { ITestingService } from "./types";
import {
  TestingFilterParams,
  SaveTestResultsRequest,
  TestReviewRequest,
} from "../api/contracts";

export class TestingService implements ITestingService {
  public async getAll(filters?: TestingFilterParams): Promise<TestWorklistItem[]> {
    if (!apiConfig.useMock) {
      return apiClient.get<TestWorklistItem[]>("/testing", {
        params: filters as Record<string, string | number>,
      });
    }

    let result = [...MOCK_TEST_WORKLIST];

    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.materialOrProduct.toLowerCase().includes(q) ||
          t.batchNumber.toLowerCase().includes(q) ||
          t.sampleId.toLowerCase().includes(q) ||
          t.assignedAnalyst.toLowerCase().includes(q)
      );
    }

    if (filters?.status && filters.status !== "ALL") {
      result = result.filter((t) => t.status === filters.status);
    }

    if (filters?.testType && filters.testType !== "ALL") {
      result = result.filter((t) => t.testType === filters.testType);
    }

    if (filters?.assignedAnalyst && filters.assignedAnalyst !== "ALL") {
      result = result.filter((t) => t.assignedAnalyst === filters.assignedAnalyst);
    }

    if (filters?.isOOS !== undefined) {
      result = result.filter((t) => t.isOOS === filters.isOOS);
    }

    return result;
  }

  public async getById(id: string): Promise<TestWorklistItem | null> {
    if (!apiConfig.useMock) {
      return apiClient.get<TestWorklistItem>(`/testing/${id}`);
    }

    const found = MOCK_TEST_WORKLIST.find((t) => t.id === id);
    return found ? { ...found } : null;
  }

  public async saveResults(payload: SaveTestResultsRequest): Promise<TestWorklistItem> {
    if (!apiConfig.useMock) {
      return apiClient.post<TestWorklistItem>(`/testing/${payload.testId}/results`, payload);
    }

    const idx = MOCK_TEST_WORKLIST.findIndex((t) => t.id === payload.testId);
    if (idx === -1) {
      throw new Error(`Test record '${payload.testId}' not found`);
    }

    const existing = MOCK_TEST_WORKLIST[idx];

    // Merge parameter updates
    const updatedParameters = existing.parameters.map((param) => {
      const res = payload.parameters.find((p) => p.id === param.id);
      if (res) {
        return {
          ...param,
          observedResult: res.observedResult,
          status: res.status,
          instrumentUsed: res.instrumentUsed || param.instrumentUsed,
          analystNotes: res.analystNotes || param.analystNotes,
        };
      }
      return param;
    });

    const hasFailedParam = updatedParameters.some((p) => p.status === "Fail");
    const status: TestStatus = hasFailedParam
      ? "Out of Specification"
      : payload.status;
    const isOOS = hasFailedParam || status === "Out of Specification";

    const updated: TestWorklistItem = {
      ...existing,
      assignedAnalyst: payload.assignedAnalyst,
      testingDate: payload.testingDate,
      instrumentReference: payload.instrumentReference,
      observations: payload.observations,
      analystComments: payload.analystComments,
      status,
      isOOS,
      parameters: updatedParameters,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    MOCK_TEST_WORKLIST[idx] = updated;
    return { ...updated };
  }

  public async submitReview(payload: TestReviewRequest): Promise<TestWorklistItem> {
    if (!apiConfig.useMock) {
      return apiClient.post<TestWorklistItem>(`/testing/${payload.testId}/review`, payload);
    }

    const idx = MOCK_TEST_WORKLIST.findIndex((t) => t.id === payload.testId);
    if (idx === -1) {
      throw new Error(`Test record '${payload.testId}' not found`);
    }

    const existing = MOCK_TEST_WORKLIST[idx];
    const isOOS = payload.disposition === "Out of Specification" || existing.isOOS;

    const updated: TestWorklistItem = {
      ...existing,
      reviewedBy: payload.reviewedBy,
      reviewDate: payload.reviewDate,
      reviewComments: payload.reviewComments,
      status: payload.disposition,
      isOOS,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    MOCK_TEST_WORKLIST[idx] = updated;
    return { ...updated };
  }
}

export const testingService = new TestingService();
