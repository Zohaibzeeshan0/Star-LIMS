/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 11: Common API Contracts & Envelope Specifications
 */

import { PharmacopeiaStandard } from "../../types/sample";
export type { PharmacopeiaStandard };

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SortParams<T = string> {
  sortBy?: T;
  sortOrder?: "asc" | "desc";
}

export interface DateRangeParams {
  dateFrom?: string;
  dateTo?: string;
}

export interface BaseFilterParams extends PaginationParams, DateRangeParams {
  searchQuery?: string;
  status?: string;
}

export interface StatusChangeRequest<TStatus = string> {
  newStatus: TStatus;
  remarks?: string;
  authorizedBy: string;
  auditReason?: string;
}

export interface BatchDispositionSummary {
  total: number;
  released: number;
  quarantined: number;
  rejected: number;
  inTesting: number;
}
