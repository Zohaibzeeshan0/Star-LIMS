/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 11: Reports & Analytics Service (Mock + HTTP interchangeable)
 */

import { apiConfig } from "../api/config";
import { apiClient } from "../api/client";
import { IReportService } from "./types";
import {
  ReportFilterParams,
  ReportDataResponse,
  ReportExportRequest,
} from "../api/contracts";
import {
  getAllReportItems,
  filterReportItems,
  calculateReportMetrics,
  sortReportItems,
} from "../report-service";
import { ReportFilterState } from "../types/report";

export class ReportService implements IReportService {
  public async getReportData(filters: ReportFilterParams): Promise<ReportDataResponse> {
    if (!apiConfig.useMock) {
      return apiClient.get<ReportDataResponse>("/reports", {
        params: filters as unknown as Record<string, string | number>,
      });
    }

    const allItems = getAllReportItems();

    const filterState: ReportFilterState = {
      searchQuery: filters.searchQuery || "",
      category: filters.category || "ALL",
      status: filters.status || "ALL",
      supplier: filters.supplier || "ALL",
      batchNumber: filters.batchNumber || "",
      dateFrom: filters.dateFrom || "",
      dateTo: filters.dateTo || "",
      sortBy: "date",
      sortOrder: "desc",
    };

    let filtered = filterReportItems(allItems, filterState);

    if (filters.materialOrProduct) {
      const mop = filters.materialOrProduct.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(mop) ||
          item.code.toLowerCase().includes(mop)
      );
    }

    filtered = sortReportItems(filtered, "date", "desc");
    const metrics = calculateReportMetrics(filtered);

    return {
      category: filters.category,
      metrics,
      rows: filtered,
      totalRecords: filtered.length,
      generatedAt: new Date().toISOString(),
    };
  }

  public async exportReport(
    payload: ReportExportRequest
  ): Promise<{ downloadUrl?: string; filename: string }> {
    if (!apiConfig.useMock) {
      return apiClient.post<{ downloadUrl: string; filename: string }>(
        "/reports/export",
        payload
      );
    }

    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `CitiPharma_${payload.category}_Report_${timestamp}.${payload.format}`;

    return {
      filename,
    };
  }
}

export const reportService = new ReportService();
