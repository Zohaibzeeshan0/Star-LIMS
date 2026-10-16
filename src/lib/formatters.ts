/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Phase 9: Global Formatters & Utilities
 * Conforming to cGMP, WHO GMP, and 21 CFR Part 11 Documentation Standards
 */

/**
 * Formats a date string into standardized ISO (YYYY-MM-DD) or Pharmacopeial (DD-MMM-YYYY) format
 */
export function formatLIMSDate(
  dateInput: string | Date | undefined | null,
  format: "iso" | "pharma" = "pharma"
): string {
  if (!dateInput) return "N/A";

  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);

    if (format === "iso") {
      return d.toISOString().slice(0, 10);
    }

    const day = String(d.getDate()).padStart(2, "0");
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  } catch {
    return String(dateInput);
  }
}

/**
 * Formats numbers with thousand separators and optional pharmaceutical measurement units
 */
export function formatLIMSNumber(
  val: number | string | undefined | null,
  unit?: string
): string {
  if (val === undefined || val === null || val === "") return "—";

  const num = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(num)) return String(val);

  const formatted = num.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });

  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Standardizes pharmaceutical disposition status categorization
 */
export type NormalizedDisposition = "PASS" | "QUARANTINE" | "FAIL" | "PENDING";

export function normalizeStatus(status: string): NormalizedDisposition {
  const s = status.toLowerCase();
  if (s.includes("released") || s.includes("pass") || s.includes("completed") || s.includes("reviewed")) {
    return "PASS";
  }
  if (s.includes("quarantine") || s.includes("retest") || s.includes("scheduled") || s.includes("due soon") || s.includes("overdue") || s.includes("hold")) {
    return "QUARANTINE";
  }
  if (s.includes("fail") || s.includes("reject") || s.includes("oos") || s.includes("out of specification")) {
    return "FAIL";
  }
  return "PENDING";
}
