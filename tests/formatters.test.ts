import test from "node:test";
import assert from "node:assert/strict";
import { formatLIMSDate, formatLIMSNumber, normalizeStatus } from "../src/lib/formatters.ts";

test("formatLIMSDate formats valid dates properly", () => {
  const resultPharma = formatLIMSDate("2026-10-16", "pharma");
  assert.equal(resultPharma, "16-Oct-2026");

  const resultISO = formatLIMSDate("2026-10-16", "iso");
  assert.equal(resultISO, "2026-10-16");
});

test("formatLIMSDate handles null, undefined and invalid gracefully", () => {
  assert.equal(formatLIMSDate(null), "N/A");
  assert.equal(formatLIMSDate(undefined), "N/A");
  assert.equal(formatLIMSDate("invalid-date-string"), "invalid-date-string");
});

test("formatLIMSNumber formats numbers with thousand separators and units", () => {
  assert.equal(formatLIMSNumber(1000), "1,000");
  assert.equal(formatLIMSNumber(250000, "kg"), "250,000 kg");
  assert.equal(formatLIMSNumber(99.85, "%"), "99.85 %");
});

test("formatLIMSNumber handles empty or nil values", () => {
  assert.equal(formatLIMSNumber(null), "—");
  assert.equal(formatLIMSNumber(undefined), "—");
  assert.equal(formatLIMSNumber(""), "—");
});

test("normalizeStatus harmonizes pharmaceutical disposition categories", () => {
  // Pass / Released
  assert.equal(normalizeStatus("Pass/Released"), "PASS");
  assert.equal(normalizeStatus("Released"), "PASS");
  assert.equal(normalizeStatus("Completed"), "PASS");
  assert.equal(normalizeStatus("Reviewed"), "PASS");

  // Quarantine / Retest
  assert.equal(normalizeStatus("Quarantine/Retest"), "QUARANTINE");
  assert.equal(normalizeStatus("Scheduled"), "QUARANTINE");
  assert.equal(normalizeStatus("Due Soon"), "QUARANTINE");
  assert.equal(normalizeStatus("Overdue"), "QUARANTINE");

  // Fail / Rejected / OOS
  assert.equal(normalizeStatus("Fail/Rejected"), "FAIL");
  assert.equal(normalizeStatus("Rejected"), "FAIL");
  assert.equal(normalizeStatus("Out of Specification"), "FAIL");
  assert.equal(normalizeStatus("OOS Investigation"), "FAIL");

  // Pending
  assert.equal(normalizeStatus("In Testing"), "PENDING");
  assert.equal(normalizeStatus("In Progress"), "PENDING");
});
