import test from "node:test";
import assert from "node:assert/strict";

import { ApiError, ValidationError, NotFoundError } from "../src/lib/api/errors.ts";
import { apiConfig } from "../src/lib/api/config.ts";

test("apiConfig defaults to mock mode and standard cGMP headers", () => {
  assert.equal(apiConfig.useMock, true);
  assert.equal(apiConfig.baseUrl, "/api");
  assert.ok(apiConfig.headers["X-Client-Application"], "Must include client application header");
  assert.equal(apiConfig.headers["X-LIMS-Version"], "1.0.0");
});

test("ApiError hierarchy preserves status codes and GLP error details", () => {
  const genericErr = new ApiError("Database connection dropped", 500);
  assert.equal(genericErr.status, 500);
  assert.equal(genericErr.name, "ApiError");

  const validationErr = new ValidationError("Monograph pH specification out of range", {
    pH: ["Value 4.2 is below minimum allowed monograph limit 4.5"],
  });
  assert.equal(validationErr.status, 422);
  assert.equal(validationErr.name, "ValidationError");
  assert.ok(validationErr.details?.pH);

  const notFoundErr = new NotFoundError("Sample CP-PRD-2026-9999");
  assert.equal(notFoundErr.status, 404);
  assert.match(notFoundErr.message, /not found/i);
});
