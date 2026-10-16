import test from "node:test";
import assert from "node:assert/strict";

import { MOCK_SAMPLES } from "../src/lib/mock-data/samples.ts";
import { MOCK_PACKAGING_SAMPLES } from "../src/lib/mock-data/packaging-samples.ts";
import { MOCK_RAW_MATERIALS } from "../src/lib/mock-data/raw-materials.ts";
import { MOCK_RETEST_SAMPLES } from "../src/lib/mock-data/retesting-samples.ts";
import { MOCK_PRODUCT_SAMPLES } from "../src/lib/mock-data/products.ts";
import { MOCK_TEST_WORKLIST } from "../src/lib/mock-data/testing-worklist.ts";

test("MOCK_SAMPLES dataset integrity", () => {
  assert.ok(MOCK_SAMPLES.length > 0, "Samples dataset should not be empty");
  const ids = new Set<string>();

  for (const s of MOCK_SAMPLES) {
    assert.ok(s.id, "Sample ID must exist");
    assert.ok(!ids.has(s.id), `Duplicate sample ID found: ${s.id}`);
    ids.add(s.id);

    assert.ok(s.batchNumber, `Sample ${s.id} missing batchNumber`);
    assert.ok(s.productName, `Sample ${s.id} missing productName`);
    assert.ok(s.category, `Sample ${s.id} missing category`);
    assert.ok(Array.isArray(s.tests), `Sample ${s.id} tests must be an array`);
  }
});

test("MOCK_PACKAGING_SAMPLES dataset integrity", () => {
  assert.ok(MOCK_PACKAGING_SAMPLES.length > 0, "Packaging samples dataset should not be empty");
  const ids = new Set<string>();

  for (const p of MOCK_PACKAGING_SAMPLES) {
    assert.ok(p.id, "Packaging ID must exist");
    assert.ok(!ids.has(p.id), `Duplicate packaging sample ID: ${p.id}`);
    ids.add(p.id);

    assert.ok(p.materialName, `Packaging sample ${p.id} missing materialName`);
    assert.ok(p.materialCode, `Packaging sample ${p.id} missing materialCode`);
    assert.ok(p.supplier, `Packaging sample ${p.id} missing supplier`);
    assert.ok(p.status, `Packaging sample ${p.id} missing status`);
  }
});

test("MOCK_RAW_MATERIALS dataset integrity", () => {
  assert.ok(MOCK_RAW_MATERIALS.length > 0, "Raw materials dataset should not be empty");
  const ids = new Set<string>();

  for (const rm of MOCK_RAW_MATERIALS) {
    assert.ok(rm.id, "Raw material ID must exist");
    assert.ok(!ids.has(rm.id), `Duplicate raw material ID: ${rm.id}`);
    ids.add(rm.id);

    assert.ok(rm.materialName, `Raw material ${rm.id} missing materialName`);
    assert.ok(rm.batchNumber, `Raw material ${rm.id} missing batchNumber`);
    assert.ok(rm.category, `Raw material ${rm.id} missing category`);
  }
});

test("MOCK_RETEST_SAMPLES dataset integrity", () => {
  assert.ok(MOCK_RETEST_SAMPLES.length > 0, "Retest samples dataset should not be empty");
  const ids = new Set<string>();

  for (const ret of MOCK_RETEST_SAMPLES) {
    assert.ok(ret.id, "Retest sample ID must exist");
    assert.ok(!ids.has(ret.id), `Duplicate retest ID: ${ret.id}`);
    ids.add(ret.id);

    assert.ok(ret.materialName, `Retest sample ${ret.id} missing materialName`);
    assert.ok(ret.retestCycleNumber >= 1, `Retest sample ${ret.id} cycle must be >= 1`);
  }
});

test("MOCK_PRODUCT_SAMPLES dataset integrity", () => {
  assert.ok(MOCK_PRODUCT_SAMPLES.length > 0, "Product samples dataset should not be empty");
  const ids = new Set<string>();

  for (const prd of MOCK_PRODUCT_SAMPLES) {
    assert.ok(prd.id, "Product sample ID must exist");
    assert.ok(!ids.has(prd.id), `Duplicate product ID: ${prd.id}`);
    ids.add(prd.id);

    assert.ok(prd.productName, `Product sample ${prd.id} missing productName`);
    assert.ok(prd.dosageForm, `Product sample ${prd.id} missing dosageForm`);
    assert.ok(prd.batchSize, `Product sample ${prd.id} batchSize must exist`);
  }
});

test("MOCK_TEST_WORKLIST dataset integrity", () => {
  assert.ok(MOCK_TEST_WORKLIST.length > 0, "Worklist dataset should not be empty");
  const ids = new Set<string>();

  for (const t of MOCK_TEST_WORKLIST) {
    assert.ok(t.id, "Test ID must exist");
    assert.ok(!ids.has(t.id), `Duplicate test ID: ${t.id}`);
    ids.add(t.id);

    assert.ok(t.testType, `Test ${t.id} missing testType`);
    assert.ok(t.parameters.length > 0, `Test ${t.id} must have parameters`);
  }
});
