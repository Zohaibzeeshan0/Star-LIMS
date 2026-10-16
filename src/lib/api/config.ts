/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 11: Backend Integration Configuration
 * Conforms to cGMP & 21 CFR Part 11 Architecture Standards
 */

export interface ApiConfig {
  baseUrl: string;
  useMock: boolean;
  timeoutMs: number;
  headers: Record<string, string>;
}

export const apiConfig: ApiConfig = {
  // Configured via environment variable; defaults to local Next.js Route Handlers /api
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",

  // Defaults to true for frontend development & client demonstrations.
  // Set NEXT_PUBLIC_USE_MOCK=false to target live backend microservices or MySQL API routes.
  useMock: process.env.NEXT_PUBLIC_USE_MOCK !== "false",

  // HTTP request timeout in milliseconds
  timeoutMs: Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS) || 15000,

  // Standard GLP/cGMP audit headers
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Client-Application": "CitiPharma-StarLIMS",
    "X-LIMS-Version": "1.0.0",
  },
};
