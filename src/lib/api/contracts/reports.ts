/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 11: Reports & Analytics API Contracts
 */

import { ReportCategory, ReportRow, ReportMetrics } from "../../types/report";
import { BaseFilterParams } from "./common";

export interface ReportFilterParams extends BaseFilterParams {
  category: ReportCategory;
  materialOrProduct?: string;
  batchNumber?: string;
  supplier?: string;
}

export interface ReportExportRequest {
  category: ReportCategory;
  filters: ReportFilterParams;
  format: "csv" | "pdf" | "json";
}

export interface ReportDataResponse {
  category: ReportCategory;
  metrics: ReportMetrics;
  rows: ReportRow[];
  totalRecords: number;
  generatedAt: string;
}
