/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Raw Material Retesting Mock Data (Phase 5)
 * Realistic GMP surveillance records with degradation parameters, HPLC assays, and extension logs.
 */

import { RetestSample, ExpiryUrgency } from "../types/retesting";

export function getRetestUrgency(sample: RetestSample): {
  urgency: ExpiryUrgency;
  daysRemaining: number;
  label: string;
} {
  if (sample.status === "Extended / Passed") {
    return {
      urgency: "EXTENDED",
      daysRemaining: 365,
      label: `Extended to ${sample.extendedRetestDate || "N/A"}`
    };
  }

  // Reference date for simulation (October 2026)
  const today = new Date("2026-10-16");
  const targetDate = new Date(sample.currentRetestDate);
  const diffTime = targetDate.getTime() - today.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return {
      urgency: "OVERDUE",
      daysRemaining: days,
      label: `Overdue by ${Math.abs(days)} days`
    };
  } else if (days <= 30) {
    return {
      urgency: "URGENT_30",
      daysRemaining: days,
      label: `Due in ${days} days`
    };
  } else if (days <= 60) {
    return {
      urgency: "UPCOMING_60",
      daysRemaining: days,
      label: `Due in ${days} days`
    };
  } else {
    return {
      urgency: "VALID",
      daysRemaining: days,
      label: `Valid (${days} days)`
    };
  }
}

export const MOCK_RETEST_SAMPLES: RetestSample[] = [
  {
    id: "CP-RET-2026-001",
    rawMaterialSampleId: "CP-RAW-2024-0310",
    materialCode: "RM-API-0012",
    materialName: "Paracetamol DC 90% Granules",
    category: "Active Pharmaceutical Ingredient (API)",
    supplier: "Mallinckrodt Pharmaceuticals",
    manufacturer: "Mallinckrodt Inc., USA",
    batchNumber: "PAR-DC90-M88",
    warehouseLocation: "Bay R-02 (Climate Controlled 20-25°C)",
    remainingStock: 450,
    unit: "kg",
    containersCount: 18,
    manufactureDate: "2024-10-01",
    initialReceiptDate: "2024-10-15",
    originalRetestDate: "2026-10-01",
    currentRetestDate: "2026-10-01",
    extendedRetestDate: "2027-10-01",
    retestCycleNumber: 1,
    extensionMonthsGranted: 12,
    status: "Extended / Passed",
    retestReason: "Scheduled 24-Month Surveillance for Shelf-Life Extension",
    pharmacopeia: "BP 2026",
    storageCondition: "Store airtight below 25°C in original double-PE lined fiber drums",
    analyst: "Zubair Ahmed (Senior QC Analyst)",
    reviewedBy: "Dr. Farhan Malik (QA Director)",
    qaDispositionDate: "2026-10-08",
    remarks: "Assay maintained at 99.4% (spec 98.0-101.0%). 4-Aminophenol impurity below LOQ. +12 Months Extension authorized.",
    tests: [
      {
        id: "T-01",
        parameter: "Assay (C8H9NO2, Anhydrous)",
        specification: "98.0% - 101.0%",
        initialReleaseResult: "99.85%",
        currentRetestResult: "99.42%",
        passed: true,
        instrumentUsed: "Waters Alliance e2695 HPLC"
      },
      {
        id: "T-02",
        parameter: "Related Substance: 4-Aminophenol",
        specification: "NMT 0.005% (50 ppm)",
        initialReleaseResult: "0.0012%",
        currentRetestResult: "0.0018%",
        passed: true,
        instrumentUsed: "Waters UV/Vis Detector 2489"
      },
      {
        id: "T-03",
        parameter: "Water Content by Karl Fischer",
        specification: "NMT 0.50%",
        initialReleaseResult: "0.18%",
        currentRetestResult: "0.24%",
        passed: true,
        instrumentUsed: "Metrohm 890 Titrando KF"
      },
      {
        id: "T-04",
        parameter: "Granule Compressibility Index",
        specification: "12.0% - 18.0%",
        initialReleaseResult: "14.2%",
        currentRetestResult: "14.8%",
        passed: true,
        instrumentUsed: "Erweka Tapped Density Tester"
      }
    ],
    createdAt: "2026-09-25T08:30:00Z",
    updatedAt: "2026-10-08T14:15:00Z"
  },
  {
    id: "CP-RET-2026-002",
    rawMaterialSampleId: "CP-RAW-2024-0418",
    materialCode: "RM-API-0045",
    materialName: "Metformin Hydrochloride Micronized BP",
    category: "Active Pharmaceutical Ingredient (API)",
    supplier: "Wanbury Limited",
    manufacturer: "Wanbury Unit-II, India",
    batchNumber: "MET-HC-24089",
    warehouseLocation: "Bay R-01 (API Secure Storage)",
    remainingStock: 750,
    unit: "kg",
    containersCount: 30,
    manufactureDate: "2024-11-10",
    initialReceiptDate: "2024-11-28",
    originalRetestDate: "2026-11-10",
    currentRetestDate: "2026-11-10",
    retestCycleNumber: 1,
    status: "Due Soon",
    retestReason: "Surveillance prior to 24-month manufacturer retest boundary",
    pharmacopeia: "BP 2026",
    storageCondition: "Store airtight below 25°C, protect from high humidity",
    analyst: "Saima Naz (QC Analyst)",
    reviewedBy: "Dr. Farhan Malik (QA Director)",
    remarks: "Sample drawn from 5 representative drums. Assay HPLC run queued on Instrument HPLC-04.",
    tests: [
      {
        id: "T-01",
        parameter: "Assay (Metformin HCl, Dried Basis)",
        specification: "98.5% - 101.0%",
        initialReleaseResult: "99.91%",
        currentRetestResult: "Pending HPLC run",
        passed: true,
        instrumentUsed: "Agilent 1260 Infinity II"
      },
      {
        id: "T-02",
        parameter: "Related Substance: Dicyandiamide",
        specification: "NMT 0.05%",
        initialReleaseResult: "0.015%",
        currentRetestResult: "Pending HPLC run",
        passed: true,
        instrumentUsed: "Agilent 1260 DAD"
      },
      {
        id: "T-03",
        parameter: "Loss on Drying (LOD)",
        specification: "NMT 0.50%",
        initialReleaseResult: "0.22%",
        currentRetestResult: "0.28%",
        passed: true,
        instrumentUsed: "Mettler Toledo Halogen Moisture HR83"
      }
    ],
    createdAt: "2026-10-02T10:00:00Z",
    updatedAt: "2026-10-14T11:45:00Z"
  },
  {
    id: "CP-RET-2026-003",
    rawMaterialSampleId: "CP-RAW-2023-0891",
    materialCode: "RM-API-0022",
    materialName: "Amoxicillin Trihydrate Compacted Powder",
    category: "Active Pharmaceutical Ingredient (API)",
    supplier: "Antibióticos do Brasil Ltda (ABL)",
    manufacturer: "ABL Cosmópolis Plant, Brazil",
    batchNumber: "AMX-TR-23910",
    warehouseLocation: "Bay B-03 (Beta-Lactam Dedicated Quarantine)",
    remainingStock: 320,
    unit: "kg",
    containersCount: 16,
    manufactureDate: "2023-09-15",
    initialReceiptDate: "2023-10-02",
    originalRetestDate: "2025-09-15",
    currentRetestDate: "2026-10-08",
    retestCycleNumber: 2,
    status: "Overdue",
    retestReason: "2nd Retest Interval expired on 2026-10-08. Warehouse hold active.",
    pharmacopeia: "USP 48-NF 43",
    storageCondition: "Store in airtight containers at temperature not exceeding 25°C",
    analyst: "Bilal Tariq (Microbiology & QC Lead)",
    reviewedBy: "Dr. Farhan Malik (QA Director)",
    remarks: "CRITICAL: Current retest date exceeded by 8 days! Material automatically locked in ERP dispensing. Urgent re-assay required.",
    tests: [
      {
        id: "T-01",
        parameter: "Potency Assay (USP C16H19N3O5S)",
        specification: "900 - 1050 µg/mg (anhydrous)",
        initialReleaseResult: "992 µg/mg",
        currentRetestResult: "Testing queued",
        passed: false,
        instrumentUsed: "Waters Alliance HPLC"
      },
      {
        id: "T-02",
        parameter: "Water Content (Trihydrate Stoichiometry)",
        specification: "11.5% - 14.5%",
        initialReleaseResult: "13.2%",
        currentRetestResult: "Testing queued",
        passed: false,
        instrumentUsed: "Metrohm 890 Titrando KF"
      }
    ],
    createdAt: "2026-10-09T09:15:00Z",
    updatedAt: "2026-10-15T16:20:00Z"
  },
  {
    id: "CP-RET-2026-004",
    rawMaterialSampleId: "CP-RAW-2024-0512",
    materialCode: "RM-API-0078",
    materialName: "Ciprofloxacin Hydrochloride Monohydrate",
    category: "Active Pharmaceutical Ingredient (API)",
    supplier: "Bayer AG Healthcare",
    manufacturer: "Bayer Wuppertal, Germany",
    batchNumber: "CIP-HC-24011",
    warehouseLocation: "Bay R-03 (Potent Compounds)",
    remainingStock: 180,
    unit: "kg",
    containersCount: 9,
    manufactureDate: "2024-10-20",
    initialReceiptDate: "2024-11-05",
    originalRetestDate: "2026-10-20",
    currentRetestDate: "2026-10-20",
    retestCycleNumber: 1,
    status: "Under Testing",
    retestReason: "Surveillance retest prior to 2-year anniversary",
    pharmacopeia: "USP 48-NF 43",
    storageCondition: "Protect from light, preserve in well-closed containers below 25°C",
    analyst: "Zubair Ahmed (Senior QC Analyst)",
    reviewedBy: "Dr. Farhan Malik (QA Director)",
    remarks: "Fluoroquinolone related impurities analysis underway. Chromatographic resolution check passed.",
    tests: [
      {
        id: "T-01",
        parameter: "Assay (C17H18FN3O3·HCl)",
        specification: "98.0% - 102.0%",
        initialReleaseResult: "100.2%",
        currentRetestResult: "99.8%",
        passed: true,
        instrumentUsed: "Waters Alliance e2695 HPLC"
      },
      {
        id: "T-02",
        parameter: "Fluoroquinolonic Acid (Impurity A)",
        specification: "NMT 0.20%",
        initialReleaseResult: "0.04%",
        currentRetestResult: "0.06%",
        passed: true,
        instrumentUsed: "Waters PDA 2998"
      },
      {
        id: "T-03",
        parameter: "Water Content by Karl Fischer",
        specification: "4.7% - 6.7%",
        initialReleaseResult: "5.4%",
        currentRetestResult: "5.6%",
        passed: true,
        instrumentUsed: "Metrohm KF 890"
      }
    ],
    createdAt: "2026-10-10T11:20:00Z",
    updatedAt: "2026-10-16T08:15:00Z"
  },
  {
    id: "CP-RET-2026-005",
    rawMaterialSampleId: "CP-RAW-2023-0104",
    materialCode: "RM-EXC-0005",
    materialName: "Magnesium Stearate (Vegetable Grade)",
    category: "Excipient / Binder / Filler",
    supplier: "Peter Greven GmbH",
    manufacturer: "Peter Greven Bad Münstereifel, Germany",
    batchNumber: "MGS-VG-23091",
    warehouseLocation: "Bay E-04 (Excipient Pallet Staging)",
    remainingStock: 600,
    unit: "kg",
    containersCount: 24,
    manufactureDate: "2023-09-01",
    initialReceiptDate: "2023-09-20",
    originalRetestDate: "2025-09-01",
    currentRetestDate: "2026-09-01",
    retestCycleNumber: 2,
    status: "Rejected / OOS",
    retestReason: "Surveillance 36-Month Expiry Evaluation",
    pharmacopeia: "Ph. Eur. 11.0",
    storageCondition: "Store below 25°C in cool dry environment, avoid heat sources",
    analyst: "Saima Naz (QC Analyst)",
    reviewedBy: "Dr. Farhan Malik (QA Director)",
    qaDispositionDate: "2026-09-18",
    remarks: "OOS Investigation OOS-2026-089: Stearic acid / Palmitic acid ratio degraded below Ph. Eur. monograph limits. Free fatty acid content elevated. Material rejected for destruction.",
    tests: [
      {
        id: "T-01",
        parameter: "Stearic Acid in Fatty Acid Fraction",
        specification: "NLT 40.0%",
        initialReleaseResult: "46.2%",
        currentRetestResult: "37.4% (OOS)",
        passed: false,
        instrumentUsed: "Shimadzu GC-2010 Plus Gas Chromatograph"
      },
      {
        id: "T-02",
        parameter: "Sum of Stearic + Palmitic Acid",
        specification: "NLT 90.0%",
        initialReleaseResult: "94.8%",
        currentRetestResult: "87.1% (OOS)",
        passed: false,
        instrumentUsed: "Shimadzu GC-2010 Plus"
      },
      {
        id: "T-03",
        parameter: "Free Fatty Acids",
        specification: "NMT 3.0%",
        initialReleaseResult: "1.1%",
        currentRetestResult: "4.8% (OOS)",
        passed: false,
        instrumentUsed: "Automatic Potentiometric Titrator"
      }
    ],
    createdAt: "2026-09-05T08:00:00Z",
    updatedAt: "2026-09-18T15:30:00Z"
  },
  {
    id: "CP-RET-2026-006",
    rawMaterialSampleId: "CP-RAW-2024-0630",
    materialCode: "RM-EXC-0018",
    materialName: "Povidone K30 (PVP K30 Pharma Grade)",
    category: "Coating Polymer / Granulating Agent",
    supplier: "BASF SE Germany",
    manufacturer: "BASF Ludwigshafen, Germany",
    batchNumber: "PVP-K30-B902",
    warehouseLocation: "Bay E-01 (Air Conditioned)",
    remainingStock: 500,
    unit: "kg",
    containersCount: 20,
    manufactureDate: "2024-09-10",
    initialReceiptDate: "2024-09-25",
    originalRetestDate: "2026-09-10",
    currentRetestDate: "2026-09-10",
    extendedRetestDate: "2027-09-10",
    retestCycleNumber: 1,
    extensionMonthsGranted: 12,
    status: "Extended / Passed",
    retestReason: "Annual surveillance retest for wet granulation binder stock",
    pharmacopeia: "USP 48-NF 43",
    storageCondition: "Store in tight containers in a dry place, hygroscopic",
    analyst: "Zubair Ahmed (Senior QC Analyst)",
    reviewedBy: "Dr. Farhan Malik (QA Director)",
    qaDispositionDate: "2026-09-22",
    remarks: "K-value stable at 30.2. Peroxides below limits. Extension of +12 months granted.",
    tests: [
      {
        id: "T-01",
        parameter: "K-Value (Viscosity)",
        specification: "27.0 - 32.0",
        initialReleaseResult: "30.5",
        currentRetestResult: "30.2",
        passed: true,
        instrumentUsed: "Ubbelohde Viscometer"
      },
      {
        id: "T-02",
        parameter: "Water Content by KF",
        specification: "NMT 5.0%",
        initialReleaseResult: "2.8%",
        currentRetestResult: "3.2%",
        passed: true,
        instrumentUsed: "Metrohm KF Titrator"
      },
      {
        id: "T-03",
        parameter: "Peroxides Content (as H2O2)",
        specification: "NMT 400 ppm",
        initialReleaseResult: "110 ppm",
        currentRetestResult: "185 ppm",
        passed: true,
        instrumentUsed: "Peroxide Spectrophotometric Assay"
      }
    ],
    createdAt: "2026-09-12T14:00:00Z",
    updatedAt: "2026-09-22T17:10:00Z"
  },
  {
    id: "CP-RET-2026-007",
    rawMaterialSampleId: "CP-RAW-2024-0715",
    materialCode: "RM-API-0033",
    materialName: "Omeprazole Delayed-Release Pellets 8.5%",
    category: "Active Pharmaceutical Ingredient (API)",
    supplier: "Aarti Drugs Limited",
    manufacturer: "Aarti Drugs Tarapur Plant, India",
    batchNumber: "OMP-PEL-24102",
    warehouseLocation: "Bay R-04 (Desiccant Controlled Chamber)",
    remainingStock: 220,
    unit: "kg",
    containersCount: 11,
    manufactureDate: "2024-10-12",
    initialReceiptDate: "2024-10-28",
    originalRetestDate: "2026-10-12",
    currentRetestDate: "2026-10-12",
    retestCycleNumber: 1,
    status: "Quarantine",
    retestReason: "Surveillance Retest • Slight visual darkening reported during sampling",
    pharmacopeia: "USP 48-NF 43",
    storageCondition: "Store below 20°C in moisture-proof containers with desiccant",
    analyst: "Saima Naz (QC Analyst)",
    reviewedBy: "Dr. Farhan Malik (QA Director)",
    remarks: "Visual inspection detected slight off-white to cream shift. Acid resistance test and omeprazole sulfone/sulfide impurity profiling in progress. Lot placed in QA Quarantine.",
    tests: [
      {
        id: "T-01",
        parameter: "Gastric Resistance (0.1N HCl, 2h)",
        specification: "NMT 10% dissolved",
        initialReleaseResult: "3.2%",
        currentRetestResult: "6.8%",
        passed: true,
        instrumentUsed: "Erweka Dissolution Tester DT 820"
      },
      {
        id: "T-02",
        parameter: "Dissolution in Buffer pH 6.8 (30 min)",
        specification: "NLT 75% dissolved",
        initialReleaseResult: "88.4%",
        currentRetestResult: "81.2%",
        passed: true,
        instrumentUsed: "Agilent UV Spectrophotometer"
      },
      {
        id: "T-03",
        parameter: "Related Substance: Omeprazole Sulfone",
        specification: "NMT 0.50%",
        initialReleaseResult: "0.08%",
        currentRetestResult: "0.42%",
        passed: true,
        instrumentUsed: "Waters Alliance e2695 HPLC"
      }
    ],
    createdAt: "2026-10-11T13:45:00Z",
    updatedAt: "2026-10-15T10:30:00Z"
  },
  {
    id: "CP-RET-2026-008",
    rawMaterialSampleId: "CP-RAW-2024-0119",
    materialCode: "RM-API-0062",
    materialName: "Atorvastatin Calcium Trihydrate Crystalline",
    category: "Active Pharmaceutical Ingredient (API)",
    supplier: "Biocon Limited",
    manufacturer: "Biocon Park, Bangalore, India",
    batchNumber: "ATV-CAL-24018",
    warehouseLocation: "Bay R-02 (API Cold Bay 2-8°C)",
    remainingStock: 95,
    unit: "kg",
    containersCount: 5,
    manufactureDate: "2024-08-20",
    initialReceiptDate: "2024-09-05",
    originalRetestDate: "2026-08-20",
    currentRetestDate: "2026-08-20",
    extendedRetestDate: "2028-08-20",
    retestCycleNumber: 1,
    extensionMonthsGranted: 24,
    status: "Extended / Passed",
    retestReason: "Biennial Surveillance • Cold Chain Integrity Verification",
    pharmacopeia: "USP 48-NF 43",
    storageCondition: "Store airtight between 2°C and 8°C in nitrogen flushed packs",
    analyst: "Zubair Ahmed (Senior QC Analyst)",
    reviewedBy: "Dr. Farhan Malik (QA Director)",
    qaDispositionDate: "2026-08-29",
    remarks: "Polymorphic Form-I confirmed by Powder X-Ray Diffraction (PXRD). Enantiomeric purity 99.9%. +24 Months shelf-life extension validated.",
    tests: [
      {
        id: "T-01",
        parameter: "Assay (Anhydrous, C66H68CaF2N4O10)",
        specification: "98.0% - 102.0%",
        initialReleaseResult: "100.4%",
        currentRetestResult: "100.1%",
        passed: true,
        instrumentUsed: "Waters HPLC Alliance"
      },
      {
        id: "T-02",
        parameter: "Enantiomeric Purity (Chiral HPLC)",
        specification: "NLT 99.5%",
        initialReleaseResult: "99.92%",
        currentRetestResult: "99.90%",
        passed: true,
        instrumentUsed: "Chiralpak AD-H Column / Waters PDA"
      },
      {
        id: "T-03",
        parameter: "Water Content by KF",
        specification: "3.5% - 5.5%",
        initialReleaseResult: "4.5%",
        currentRetestResult: "4.7%",
        passed: true,
        instrumentUsed: "Metrohm KF Titrator"
      }
    ],
    createdAt: "2026-08-21T09:00:00Z",
    updatedAt: "2026-08-29T16:00:00Z"
  },
  {
    id: "CP-RET-2026-009",
    rawMaterialSampleId: "CP-RAW-2024-0802",
    materialCode: "RM-EXC-0001",
    materialName: "Microcrystalline Cellulose (Avicel PH-102)",
    category: "Excipient / Binder / Filler",
    supplier: "DuPont Nutrition & Biosciences",
    manufacturer: "DuPont Cork Plant, Ireland",
    batchNumber: "MCC-PH102-IR99",
    warehouseLocation: "Bay E-02 (General Excipients)",
    remainingStock: 1250,
    unit: "kg",
    containersCount: 50,
    manufactureDate: "2024-11-20",
    initialReceiptDate: "2024-12-05",
    originalRetestDate: "2026-11-20",
    currentRetestDate: "2026-11-20",
    retestCycleNumber: 1,
    status: "Scheduled",
    retestReason: "Standard 24-Month Surveillance Schedule",
    pharmacopeia: "USP 48-NF 43",
    storageCondition: "Store below 30°C in a dry area, protect from damp surfaces",
    analyst: "Bilal Tariq (QC Analyst)",
    reviewedBy: "Dr. Farhan Malik (QA Director)",
    remarks: "Scheduled for sampling next week. Retest notification dispatched to warehouse dispensing lead.",
    tests: [
      {
        id: "T-01",
        parameter: "Loss on Drying (LOD)",
        specification: "NMT 5.0%",
        initialReleaseResult: "3.8%",
        currentRetestResult: "Scheduled",
        passed: true,
        instrumentUsed: "Mettler Toledo HR83"
      },
      {
        id: "T-02",
        parameter: "Particle Size (+60 mesh retain)",
        specification: "NMT 8.0%",
        initialReleaseResult: "2.4%",
        currentRetestResult: "Scheduled",
        passed: true,
        instrumentUsed: "Retsch AS 200 Sieve Shaker"
      }
    ],
    createdAt: "2026-10-12T11:00:00Z",
    updatedAt: "2026-10-12T11:00:00Z"
  },
  {
    id: "CP-RET-2026-010",
    rawMaterialSampleId: "CP-RAW-2024-0820",
    materialCode: "RM-EXC-0009",
    materialName: "Pregelatinized Starch (Starch 1500)",
    category: "Excipient / Binder / Filler",
    supplier: "Colorcon Limited",
    manufacturer: "Colorcon Dartford, UK",
    batchNumber: "ST-1500-UK240",
    warehouseLocation: "Bay E-03 (Direct Compression Binders)",
    remainingStock: 800,
    unit: "kg",
    containersCount: 32,
    manufactureDate: "2024-10-30",
    initialReceiptDate: "2024-11-14",
    originalRetestDate: "2026-10-30",
    currentRetestDate: "2026-10-30",
    retestCycleNumber: 1,
    status: "Due Soon",
    retestReason: "Surveillance prior to 2-year manufacturer expiration boundary",
    pharmacopeia: "USP 48-NF 43",
    storageCondition: "Store in well-closed containers at 15-25°C",
    analyst: "Saima Naz (QC Analyst)",
    reviewedBy: "Dr. Farhan Malik (QA Director)",
    remarks: "Due in 14 days. Sampling requisition #SR-2026-401 issued to warehouse sampling booth.",
    tests: [
      {
        id: "T-01",
        parameter: "Loss on Drying",
        specification: "NMT 14.0%",
        initialReleaseResult: "10.5%",
        currentRetestResult: "11.2%",
        passed: true,
        instrumentUsed: "Halogen Moisture Analyzer"
      },
      {
        id: "T-02",
        parameter: "pH of 10% Aqueous Suspension",
        specification: "4.5 - 7.0",
        initialReleaseResult: "5.8",
        currentRetestResult: "5.6",
        passed: true,
        instrumentUsed: "Mettler Toledo pH Meter SevenDirect"
      }
    ],
    createdAt: "2026-10-05T09:30:00Z",
    updatedAt: "2026-10-15T14:10:00Z"
  },
  {
    id: "CP-RET-2026-011",
    rawMaterialSampleId: "CP-RAW-2024-0905",
    materialCode: "RM-SOL-0004",
    materialName: "Isopropanol (IPA Electronic / Spectro Grade)",
    category: "Process Solvent / Reagent",
    supplier: "Honeywell Specialty Chemicals",
    manufacturer: "Honeywell Seelze GmbH, Germany",
    batchNumber: "IPA-HNW-99120",
    warehouseLocation: "Solvent Flammable Vault F-01",
    remainingStock: 600,
    unit: "Liters",
    containersCount: 3,
    manufactureDate: "2024-10-25",
    initialReceiptDate: "2024-11-08",
    originalRetestDate: "2026-10-25",
    currentRetestDate: "2026-10-25",
    retestCycleNumber: 1,
    status: "Under Testing",
    retestReason: "Peroxide & acidity surveillance in organic solvent drums",
    pharmacopeia: "Ph. Eur. 11.0",
    storageCondition: "Store in dedicated spark-proof flammable safety cabinet below 25°C",
    analyst: "Bilal Tariq (QC Analyst)",
    reviewedBy: "Dr. Farhan Malik (QA Director)",
    remarks: "Drum seal inspected. Refractive index and gas chromatography purity running on GC-01.",
    tests: [
      {
        id: "T-01",
        parameter: "GC Purity (Isopropanol content)",
        specification: "NLT 99.80%",
        initialReleaseResult: "99.96%",
        currentRetestResult: "99.94%",
        passed: true,
        instrumentUsed: "Shimadzu GC-2010 Plus"
      },
      {
        id: "T-02",
        parameter: "Non-Volatile Residue",
        specification: "NMT 2 mg / 100 mL",
        initialReleaseResult: "0.4 mg",
        currentRetestResult: "0.6 mg",
        passed: true,
        instrumentUsed: "Analytical Balance 5-Decimals"
      },
      {
        id: "T-03",
        parameter: "Water Content by KF",
        specification: "NMT 0.10%",
        initialReleaseResult: "0.03%",
        currentRetestResult: "0.05%",
        passed: true,
        instrumentUsed: "Metrohm KF Coulometer"
      }
    ],
    createdAt: "2026-10-12T08:00:00Z",
    updatedAt: "2026-10-16T09:20:00Z"
  },
  {
    id: "CP-RET-2026-012",
    rawMaterialSampleId: "CP-RAW-2024-0350",
    materialCode: "RM-PRS-0003",
    materialName: "Propylparaben Sodium NF (Preservative)",
    category: "Preservative / Antioxidant",
    supplier: "Clariant AG",
    manufacturer: "Clariant Tarragona, Spain",
    batchNumber: "PRP-SOD-24003",
    warehouseLocation: "Bay R-03 (Potent Compounds)",
    remainingStock: 75,
    unit: "kg",
    containersCount: 3,
    manufactureDate: "2024-08-15",
    initialReceiptDate: "2024-09-01",
    originalRetestDate: "2026-08-15",
    currentRetestDate: "2026-08-15",
    extendedRetestDate: "2027-08-15",
    retestCycleNumber: 1,
    extensionMonthsGranted: 12,
    status: "Extended / Passed",
    retestReason: "Liquid Oral Syrup Formulation Retest Program",
    pharmacopeia: "USP 48-NF 43",
    storageCondition: "Store airtight below 25°C, protect from high humidity",
    analyst: "Zubair Ahmed (Senior QC Analyst)",
    reviewedBy: "Dr. Farhan Malik (QA Director)",
    qaDispositionDate: "2026-08-25",
    remarks: "Potency at 99.7%. pH of 0.1% solution in range 9.5-10.5. +12 months shelf extension applied.",
    tests: [
      {
        id: "T-01",
        parameter: "Assay (C10H11NaO3, Dried Basis)",
        specification: "98.5% - 101.5%",
        initialReleaseResult: "99.9%",
        currentRetestResult: "99.7%",
        passed: true,
        instrumentUsed: "Waters UV Spectrophotometer"
      },
      {
        id: "T-02",
        parameter: "pH of 0.1% w/v Solution",
        specification: "9.5 - 10.5",
        initialReleaseResult: "10.1",
        currentRetestResult: "10.0",
        passed: true,
        instrumentUsed: "Mettler Toledo pH Meter"
      }
    ],
    createdAt: "2026-08-16T10:00:00Z",
    updatedAt: "2026-08-25T14:40:00Z"
  }
];
