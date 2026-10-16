/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 11: Typed HTTP API Client
 */

import { apiConfig } from "./config";
import { ApiError, NetworkError, ValidationError, NotFoundError, UnauthorizedError } from "./errors";

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined | null>;
  timeoutMs?: number;
}

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;

  constructor(
    baseUrl = apiConfig.baseUrl,
    defaultHeaders = apiConfig.headers,
    defaultTimeout = apiConfig.timeoutMs
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.defaultHeaders = defaultHeaders;
    this.defaultTimeout = defaultTimeout;
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined | null>
  ): string {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          url.searchParams.append(key, String(val));
        }
      });
    }

    return url.toString();
  }

  private async request<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      options?.timeoutMs || this.defaultTimeout
    );

    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...this.defaultHeaders,
          ...options?.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      // Handle HTTP error statuses
      if (!response.ok) {
        let errorPayload: { message?: string; code?: string; details?: unknown } = {};
        try {
          errorPayload = await response.json();
        } catch {
          // If response body is not JSON
        }

        const msg = errorPayload.message || `HTTP ${response.status}: ${response.statusText}`;

        if (response.status === 401 || response.status === 403) {
          throw new UnauthorizedError(msg);
        }
        if (response.status === 404) {
          throw new NotFoundError(msg);
        }
        if (response.status === 422 || response.status === 400) {
          throw new ValidationError(msg, errorPayload.details);
        }

        throw new ApiError(msg, response.status, errorPayload.code || "HTTP_ERROR", errorPayload.details);
      }

      // Successful 204 No Content
      if (response.status === 204) {
        return null as unknown as T;
      }

      const json = await response.json();
      return json as T;
    } catch (err: unknown) {
      clearTimeout(timeout);

      if (err instanceof ApiError) {
        throw err;
      }

      if (err instanceof DOMException && err.name === "AbortError") {
        throw new NetworkError(`Request timed out after ${options?.timeoutMs || this.defaultTimeout}ms.`);
      }

      if (err instanceof TypeError && err.message.includes("fetch")) {
        throw new NetworkError("Failed to reach LIMS API gateway. Verify network connection.");
      }

      throw new ApiError((err as Error).message || "Unknown API communication failure.");
    }
  }

  public get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, "GET", undefined, options);
  }

  public post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, "POST", data, options);
  }

  public put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, "PUT", data, options);
  }

  public patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, "PATCH", data, options);
  }

  public delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, "DELETE", undefined, options);
  }
}

// Global shared singleton
export const apiClient = new ApiClient();
