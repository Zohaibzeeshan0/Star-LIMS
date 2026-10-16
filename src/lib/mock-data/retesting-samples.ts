/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Raw Material Retesting Mock Data (Phase 5)
 * Realistic GMP surveillance records with degradation parameters, HPLC assays, previous retest history and mock timelines.
 */

import { RetestSample, ExpiryUrgency } from "../types/retesting";

export function getRetestUrgency(sample: RetestSample): {
  urgency: ExpiryUrgency;
  daysRemaining: number;
  label: string;
} {
  if (sample.status === "Completed") {
    return {
      urgency: "COMPLETED",
      daysRemaining: 365,
      label: `Extended until ${sample.extendedRetestDate || sample.nextRetestDueDate}`
    };
  }

  // Reference date for simulation (October 2026)
  const today = new Date("2026-10-16");
  const targetDate = new Date(sample.nextRetestDueDate);
  const diffTime = targetDate.getTime() - today.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (days < 0 || sample.status === "Overdue") {
    return {
      urgency: "OVERDUE",
      daysRemaining: days,
      label: `Overdue by ${Math.abs(days)} days`
    };
  } else if (days <= 30 || sample.status === "Due Soon") {
    return {
      urgency: "DUE_SOON",
      daysRemaining: days,
      label: `Due in ${days} days`
    };
  } else if (sample.status === "In Progress") {
    return {
      urgency: "IN_PROGRESS",
      daysRemaining: days,
      label: `In Progress (Due in ${days}d)`
    };
  } else {
    return {
      urgency: "SCHEDULED",
      daysRemaining: days,
      label: `Scheduled (${days} days)`
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
    previousTestDate: "2024-10-15",
    lastRetestDate: "2026-10-01",
    nextRetestDueDate: "2027-10-01",
    extendedRetestDate: "2027-10-01",
    retestCycleNumber: 1,
    extensionMonthsGranted: 12,
    status: "Completed",
    retestReason: "Scheduled 24-Month Surveillance for Shelf-Life Extension",
    pharmacopeia: "BP 2026",
    storageCondition: "Store airtight below 25°C in original double-PE lined fiber drums",
    analyst: "Zubair Ahmed",
    reviewedBy: "Dr. Farhan Malik",
    qaDispositionDate: "2026-10-08",
    remarks: "Assay maintained at 99.4% (spec 98.0-101.0%). 4-Aminophenol impurity below LOQ. +12 Months Extension authorized.",
    history: [
      {
        id: "HIST-01",
        cycleNumber: 1,
        testDate: "2026-10-01",
        assayResult: "99.42%",
        waterContent: "0.24%",
        impurities: "0.0018% 4-Aminophenol",
        extensionGranted: "+12 Months (Valid until 2027-10-01)",
        analyst: "Zubair Ahmed",
        disposition: "Approved / Extended"
      }
    ],
    timeline: [
      {
        id: "EV-01",
        title: "Consignment Intake & Sampling",
        timestamp: "2024-10-15 09:30",
        stage: "Warehouse Quarantine",
        description: "18 fiber drums received from Mallinckrodt USA. Tamper-evident seals intact.",
        user: "Tariq Mahmood (Warehouse Lead)",
        state: "completed"
      },
      {
        id: "EV-02",
        title: "Initial Lot Release Testing",
        timestamp: "2024-10-18 14:15",
        stage: "QC Laboratory",
        description: "Assay 99.85%, LOD 0.18%. Initial 24-month shelf life granted under BP 2026.",
        user: "Zubair Ahmed (QC Analyst)",
        state: "completed"
      },
      {
        id: "EV-03",
        title: "24-Month Retest Surveillance Requisition",
        timestamp: "2026-09-25 08:30",
        stage: "QC Scheduling",
        description: "Surveillance sampling protocol SR-2026-301 issued prior to retest due date.",
        user: "System / SOP-QC-075",
        state: "completed"
      },
      {
        id: "EV-04",
        title: "Chromatographic Assays & KF Moisture",
        timestamp: "2026-10-03 16:45",
        stage: "Analytical QC",
        description: "HPLC Waters e2695 potency 99.42%. Karl Fischer water content 0.24%. All criteria passed.",
        user: "Zubair Ahmed (QC Analyst)",
        state: "completed"
      },
      {
        id: "EV-05",
        title: "QA Shelf-Life Extension Authorization",
        timestamp: "2026-10-08 11:20",
        stage: "Quality Assurance",
        description: "Retest certificate stamped. New expiration boundary set to 2027-10-01 (+12 Months).",
        user: "Dr. Farhan Malik (QA Director)",
        state: "completed"
      }
    ],
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
    previousTestDate: "2024-11-28",
    lastRetestDate: "2024-11-28",
    nextRetestDueDate: "2026-11-10",
    retestCycleNumber: 1,
    status: "Due Soon",
    retestReason: "Surveillance prior to 24-month manufacturer retest boundary",
    pharmacopeia: "BP 2026",
    storageCondition: "Store airtight below 25°C, protect from high humidity",
    analyst: "Saima Naz",
    reviewedBy: "Dr. Farhan Malik",
    remarks: "Sample drawn from 5 representative drums. Assay HPLC run queued on Instrument HPLC-04.",
    history: [],
    timeline: [
      {
        id: "EV-01",
        title: "Intake Staging & Initial Release",
        timestamp: "2024-11-28 10:00",
        stage: "Warehouse Staging",
        description: "30 drums received. Potency 99.91% verified under BP 2026.",
        user: "Saima Naz (QC Analyst)",
        state: "completed"
      },
      {
        id: "EV-02",
        title: "Surveillance Approaching Alert",
        timestamp: "2026-10-02 08:00",
        stage: "QC LIMS Surveillance",
        description: "Automated alert: Due date approaching within 25 days.",
        user: "System Monitor",
        state: "completed"
      },
      {
        id: "EV-03",
        title: "Warehouse Sampling Requisition Issued",
        timestamp: "2026-10-14 11:30",
        stage: "Warehouse Bay R-01",
        description: "Composite 250g sample drawn across 5 representative drums.",
        user: "Saima Naz (QC Analyst)",
        state: "current"
      },
      {
        id: "EV-04",
        title: "HPLC Assays & Dicyandiamide Purity",
        timestamp: "2026-10-18 (Projected)",
        stage: "HPLC Lab",
        description: "Instrument HPLC-04 scheduled for isocratic run.",
        user: "Assigned Analyst",
        state: "pending"
      }
    ],
    tests: [
      {
        id: "T-01",
        parameter: "Assay (Metformin HCl, Dried Basis)",
        specification: "98.5% - 101.0%",
        initialReleaseResult: "99.91%",
        currentRetestResult: "Sample drawn - Pending run",
        passed: true,
        instrumentUsed: "Agilent 1260 Infinity II"
      },
      {
        id: "T-02",
        parameter: "Related Substance: Dicyandiamide",
        specification: "NMT 0.05%",
        initialReleaseResult: "0.015%",
        currentRetestResult: "Pending run",
        passed: true,
        instrumentUsed: "Agilent 1260 DAD"
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
    previousTestDate: "2025-09-15",
    lastRetestDate: "2025-09-15",
    nextRetestDueDate: "2026-10-08",
    retestCycleNumber: 2,
    status: "Overdue",
    retestReason: "2nd Retest Interval expired on 2026-10-08. Warehouse hold active.",
    pharmacopeia: "USP 48-NF 43",
    storageCondition: "Store in airtight containers at temperature not exceeding 25°C",
    analyst: "Bilal Tariq",
    reviewedBy: "Dr. Farhan Malik",
    remarks: "CRITICAL: Current retest date exceeded by 8 days! Material automatically locked in ERP dispensing. Urgent re-assay required.",
    history: [
      {
        id: "HIST-01",
        cycleNumber: 1,
        testDate: "2025-09-15",
        assayResult: "988 µg/mg",
        waterContent: "13.4%",
        impurities: "NMT 0.5%",
        extensionGranted: "+12 Months (Valid until 2026-10-08)",
        analyst: "Bilal Tariq",
        disposition: "Approved / Extended"
      }
    ],
    timeline: [
      {
        id: "EV-01",
        title: "Cycle 1 Retest Pass & Extension",
        timestamp: "2025-09-15 11:00",
        stage: "QA Authorization",
        description: "Potency 988 µg/mg. Extended +12 months to 2026-10-08.",
        user: "Bilal Tariq (Microbiology Lead)",
        state: "completed"
      },
      {
        id: "EV-02",
        title: "Retest Due Date Boundary Exceeded",
        timestamp: "2026-10-09 00:01",
        stage: "ERP & LIMS Staging Lock",
        description: "CRITICAL ALERT: Material locked in quarantine. Dispensing barred under SOP-QC-075.",
        user: "System Audit Monitor",
        state: "current"
      },
      {
        id: "EV-03",
        title: "Urgent Expedited Re-sampling",
        timestamp: "2026-10-15 14:00",
        stage: "Dedicated Beta-Lactam Booth",
        description: "Sample drawn by QA under containment protocol. Priority queued in QC.",
        user: "Bilal Tariq (QC Analyst)",
        state: "current"
      }
    ],
    tests: [
      {
        id: "T-01",
        parameter: "Potency Assay (USP C16H19N3O5S)",
        specification: "900 - 1050 µg/mg (anhydrous)",
        initialReleaseResult: "992 µg/mg",
        currentRetestResult: "Priority testing queued",
        passed: false,
        instrumentUsed: "Waters Alliance HPLC"
      },
      {
        id: "T-02",
        parameter: "Water Content (Trihydrate Stoichiometry)",
        specification: "11.5% - 14.5%",
        initialReleaseResult: "13.2%",
        currentRetestResult: "Priority testing queued",
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
    previousTestDate: "2024-11-05",
    lastRetestDate: "2024-11-05",
    nextRetestDueDate: "2026-10-20",
    retestCycleNumber: 1,
    status: "In Progress",
    retestReason: "Surveillance retest prior to 2-year anniversary",
    pharmacopeia: "USP 48-NF 43",
    storageCondition: "Protect from light, preserve in well-closed containers below 25°C",
    analyst: "Zubair Ahmed",
    reviewedBy: "Dr. Farhan Malik",
    remarks: "Fluoroquinolone related impurities analysis underway. Chromatographic resolution check passed.",
    history: [],
    timeline: [
      {
        id: "EV-01",
        title: "Surveillance Requisition Issued",
        timestamp: "2026-10-10 11:20",
        stage: "QC Intake",
        description: "Requisition #CP-SR-404 approved by QA.",
        user: "Zubair Ahmed",
        state: "completed"
      },
      {
        id: "EV-02",
        title: "Testing In Progress on HPLC-02",
        timestamp: "2026-10-16 08:15",
        stage: "Analytical Instrumental Suite",
        description: "Chromatographic system suitability passed. Sample duplicate injections running.",
        user: "Zubair Ahmed",
        state: "current"
      }
    ],
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
    previousTestDate: "2025-09-01",
    lastRetestDate: "2026-09-01",
    nextRetestDueDate: "2026-09-01",
    retestCycleNumber: 2,
    status: "Rejected",
    retestReason: "Surveillance 36-Month Expiry Evaluation",
    pharmacopeia: "Ph. Eur. 11.0",
    storageCondition: "Store below 25°C in cool dry environment, avoid heat sources",
    analyst: "Saima Naz",
    reviewedBy: "Dr. Farhan Malik",
    qaDispositionDate: "2026-09-18",
    remarks: "OOS Investigation OOS-2026-089: Stearic acid / Palmitic acid ratio degraded below Ph. Eur. monograph limits. Free fatty acid content elevated. Material rejected for destruction.",
    history: [
      {
        id: "HIST-01",
        cycleNumber: 1,
        testDate: "2025-09-01",
        assayResult: "Stearic 44.1%",
        waterContent: "2.1%",
        impurities: "FFA 1.8%",
        extensionGranted: "+12 Months",
        analyst: "Saima Naz",
        disposition: "Approved / Extended"
      }
    ],
    timeline: [
      {
        id: "EV-01",
        title: "36-Month Surveillance Testing",
        timestamp: "2026-09-05 08:00",
        stage: "Gas Chromatography Lab",
        description: "Fatty acid breakdown detected on Shimadzu GC-2010 Plus.",
        user: "Saima Naz",
        state: "completed"
      },
      {
        id: "EV-02",
        title: "OOS Investigation OOS-2026-089 & Formal Rejection",
        timestamp: "2026-09-18 15:30",
        stage: "QA Disposition",
        description: "Stearic acid 37.4% (spec NLT 40.0%). Lot quarantined for bio-hazardous destruction.",
        user: "Dr. Farhan Malik",
        state: "completed"
      }
    ],
    tests: [
      {
        id: "T-01",
        parameter: "Stearic Acid in Fatty Acid Fraction",
        specification: "NLT 40.0%",
        initialReleaseResult: "46.2%",
        currentRetestResult: "37.4% (OOS)",
        passed: false,
        instrumentUsed: "Shimadzu GC-2010 Plus Gas Chromatograph"
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
    previousTestDate: "2024-09-25",
    lastRetestDate: "2026-09-10",
    nextRetestDueDate: "2027-09-10",
    extendedRetestDate: "2027-09-10",
    retestCycleNumber: 1,
    extensionMonthsGranted: 12,
    status: "Completed",
    retestReason: "Annual surveillance retest for wet granulation binder stock",
    pharmacopeia: "USP 48-NF 43",
    storageCondition: "Store in tight containers in a dry place, hygroscopic",
    analyst: "Zubair Ahmed",
    reviewedBy: "Dr. Farhan Malik",
    qaDispositionDate: "2026-09-22",
    remarks: "K-value stable at 30.2. Peroxides below limits. Extension of +12 months granted.",
    history: [
      {
        id: "HIST-01",
        cycleNumber: 1,
        testDate: "2026-09-10",
        assayResult: "K-Value: 30.2",
        waterContent: "3.2%",
        impurities: "Peroxides: 185 ppm",
        extensionGranted: "+12 Months (Valid until 2027-09-10)",
        analyst: "Zubair Ahmed",
        disposition: "Approved / Extended"
      }
    ],
    timeline: [
      {
        id: "EV-01",
        title: "Surveillance Retest Completed",
        timestamp: "2026-09-22 17:10",
        stage: "QA Authorization",
        description: "Viscosity K-value 30.2. Extension authorized.",
        user: "Dr. Farhan Malik",
        state: "completed"
      }
    ],
    tests: [
      {
        id: "T-01",
        parameter: "K-Value (Viscosity)",
        specification: "27.0 - 32.0",
        initialReleaseResult: "30.5",
        currentRetestResult: "30.2",
        passed: true,
        instrumentUsed: "Ubbelohde Viscometer"
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
    previousTestDate: "2024-10-28",
    lastRetestDate: "2026-10-12",
    nextRetestDueDate: "2026-10-12",
    retestCycleNumber: 1,
    status: "Quarantine",
    retestReason: "Surveillance Retest • Slight visual darkening reported during sampling",
    pharmacopeia: "USP 48-NF 43",
    storageCondition: "Store below 20°C in moisture-proof containers with desiccant",
    analyst: "Saima Naz",
    reviewedBy: "Dr. Farhan Malik",
    remarks: "Visual inspection detected slight off-white to cream shift. Acid resistance test and omeprazole sulfone/sulfide impurity profiling in progress. Lot placed in QA Quarantine.",
    history: [],
    timeline: [
      {
        id: "EV-01",
        title: "Sampling Visual Discrepancy Note",
        timestamp: "2026-10-11 13:45",
        stage: "Sampling Booth",
        description: "Color shift noticed. QA deviation logged.",
        user: "Saima Naz",
        state: "completed"
      },
      {
        id: "EV-02",
        title: "QA Quarantine Investigation Hold",
        timestamp: "2026-10-15 10:30",
        stage: "Quarantine Chamber",
        description: "Acid resistance testing in progress on DT 820.",
        user: "Dr. Farhan Malik",
        state: "current"
      }
    ],
    tests: [
      {
        id: "T-01",
        parameter: "Gastric Resistance (0.1N HCl, 2h)",
        specification: "NMT 10% dissolved",
        initialReleaseResult: "3.2%",
        currentRetestResult: "6.8%",
        passed: true,
        instrumentUsed: "Erweka Dissolution Tester DT 820"
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
    previousTestDate: "2024-09-05",
    lastRetestDate: "2026-08-20",
    nextRetestDueDate: "2028-08-20",
    extendedRetestDate: "2028-08-20",
    retestCycleNumber: 1,
    extensionMonthsGranted: 24,
    status: "Completed",
    retestReason: "Biennial Surveillance • Cold Chain Integrity Verification",
    pharmacopeia: "USP 48-NF 43",
    storageCondition: "Store airtight between 2°C and 8°C in nitrogen flushed packs",
    analyst: "Zubair Ahmed",
    reviewedBy: "Dr. Farhan Malik",
    qaDispositionDate: "2026-08-29",
    remarks: "Polymorphic Form-I confirmed by Powder X-Ray Diffraction (PXRD). Enantiomeric purity 99.9%. +24 Months shelf-life extension validated.",
    history: [
      {
        id: "HIST-01",
        cycleNumber: 1,
        testDate: "2026-08-20",
        assayResult: "100.1%",
        waterContent: "4.7%",
        impurities: "Chiral 99.90%",
        extensionGranted: "+24 Months (Valid until 2028-08-20)",
        analyst: "Zubair Ahmed",
        disposition: "Approved / Extended"
      }
    ],
    timeline: [
      {
        id: "EV-01",
        title: "Cold Chain Retest Inspection Passed",
        timestamp: "2026-08-29 16:00",
        stage: "QA Authorization",
        description: "+24 Months extension validated for cold-bay stock.",
        user: "Dr. Farhan Malik",
        state: "completed"
      }
    ],
    tests: [
      {
        id: "T-01",
        parameter: "Assay (Anhydrous, C66H68CaF2N4O10)",
        specification: "98.0% - 102.0%",
        initialReleaseResult: "100.4%",
        currentRetestResult: "100.1%",
        passed: true,
        instrumentUsed: "Waters HPLC Alliance"
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
    previousTestDate: "2024-12-05",
    lastRetestDate: "2024-12-05",
    nextRetestDueDate: "2026-11-20",
    retestCycleNumber: 1,
    status: "Scheduled",
    retestReason: "Standard 24-Month Surveillance Schedule",
    pharmacopeia: "USP 48-NF 43",
    storageCondition: "Store below 30°C in a dry area, protect from damp surfaces",
    analyst: "Bilal Tariq",
    reviewedBy: "Dr. Farhan Malik",
    remarks: "Scheduled for sampling next week. Retest notification dispatched to warehouse dispensing lead.",
    history: [],
    timeline: [
      {
        id: "EV-01",
        title: "24-Month Retest Scheduled",
        timestamp: "2026-10-12 11:00",
        stage: "QC Calendar",
        description: "Scheduled sampling notification for Bay E-02.",
        user: "Bilal Tariq",
        state: "completed"
      }
    ],
    tests: [
      {
        id: "T-01",
        parameter: "Loss on Drying (LOD)",
        specification: "NMT 5.0%",
        initialReleaseResult: "3.8%",
        currentRetestResult: "Scheduled",
        passed: true,
        instrumentUsed: "Mettler Toledo HR83"
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
    previousTestDate: "2024-11-14",
    lastRetestDate: "2024-11-14",
    nextRetestDueDate: "2026-10-30",
    retestCycleNumber: 1,
    status: "Due Soon",
    retestReason: "Surveillance prior to 2-year manufacturer expiration boundary",
    pharmacopeia: "USP 48-NF 43",
    storageCondition: "Store in well-closed containers at 15-25°C",
    analyst: "Saima Naz",
    reviewedBy: "Dr. Farhan Malik",
    remarks: "Due in 14 days. Sampling requisition #SR-2026-401 issued to warehouse sampling booth.",
    history: [],
    timeline: [
      {
        id: "EV-01",
        title: "Approaching Due Date Alert (14 Days)",
        timestamp: "2026-10-05 09:30",
        stage: "QC LIMS Watchlist",
        description: "Requisition sent to sampling team.",
        user: "Saima Naz",
        state: "completed"
      }
    ],
    tests: [
      {
        id: "T-01",
        parameter: "Loss on Drying",
        specification: "NMT 14.0%",
        initialReleaseResult: "10.5%",
        currentRetestResult: "11.2%",
        passed: true,
        instrumentUsed: "Halogen Moisture Analyzer"
      }
    ],
    createdAt: "2026-10-05T09:30:00Z",
    updatedAt: "2026-10-15T14:10:00Z"
  },
  {
    id: "CP-RET-2026-011",
    rawMaterialSampleId: "CP-RAW-2024-0905",
    materialCode: "RM-SOL-0004",
    materialName: "Isopropanol (IPA Spectro Grade)",
    category: "Process Solvent / Reagent",
    supplier: "Honeywell Specialty Chemicals",
    manufacturer: "Honeywell Seelze GmbH, Germany",
    batchNumber: "IPA-HNW-99120",
    warehouseLocation: "Solvent Flammable Vault F-01",
    remainingStock: 600,
    unit: "Liters",
    containersCount: 3,
    manufactureDate: "2024-10-25",
    previousTestDate: "2024-11-08",
    lastRetestDate: "2024-11-08",
    nextRetestDueDate: "2026-10-25",
    retestCycleNumber: 1,
    status: "In Progress",
    retestReason: "Peroxide & acidity surveillance in organic solvent drums",
    pharmacopeia: "Ph. Eur. 11.0",
    storageCondition: "Store in dedicated spark-proof flammable safety cabinet below 25°C",
    analyst: "Bilal Tariq",
    reviewedBy: "Dr. Farhan Malik",
    remarks: "Drum seal inspected. Refractive index and gas chromatography purity running on GC-01.",
    history: [],
    timeline: [
      {
        id: "EV-01",
        title: "Solvent Testing In Progress",
        timestamp: "2026-10-16 09:20",
        stage: "GC Lab",
        description: "Non-volatile residue and KF water running.",
        user: "Bilal Tariq",
        state: "current"
      }
    ],
    tests: [
      {
        id: "T-01",
        parameter: "GC Purity (Isopropanol content)",
        specification: "NLT 99.80%",
        initialReleaseResult: "99.96%",
        currentRetestResult: "99.94%",
        passed: true,
        instrumentUsed: "Shimadzu GC-2010 Plus"
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
    previousTestDate: "2024-09-01",
    lastRetestDate: "2026-08-15",
    nextRetestDueDate: "2027-08-15",
    extendedRetestDate: "2027-08-15",
    retestCycleNumber: 1,
    extensionMonthsGranted: 12,
    status: "Completed",
    retestReason: "Liquid Oral Syrup Formulation Retest Program",
    pharmacopeia: "USP 48-NF 43",
    storageCondition: "Store airtight below 25°C, protect from high humidity",
    analyst: "Zubair Ahmed",
    reviewedBy: "Dr. Farhan Malik",
    qaDispositionDate: "2026-08-25",
    remarks: "Potency at 99.7%. pH of 0.1% solution in range 9.5-10.5. +12 months shelf extension applied.",
    history: [
      {
        id: "HIST-01",
        cycleNumber: 1,
        testDate: "2026-08-15",
        assayResult: "99.7%",
        waterContent: "2.1%",
        impurities: "p-Hydroxybenzoic acid: 0.12%",
        extensionGranted: "+12 Months",
        analyst: "Zubair Ahmed",
        disposition: "Approved / Extended"
      }
    ],
    timeline: [
      {
        id: "EV-01",
        title: "Shelf-Life Extension Granted",
        timestamp: "2026-08-25 14:40",
        stage: "QA Release",
        description: "Valid until 2027-08-15 for liquid oral batch dispensing.",
        user: "Dr. Farhan Malik",
        state: "completed"
      }
    ],
    tests: [
      {
        id: "T-01",
        parameter: "Assay (C10H11NaO3, Dried Basis)",
        specification: "98.5% - 101.5%",
        initialReleaseResult: "99.9%",
        currentRetestResult: "99.7%",
        passed: true,
        instrumentUsed: "Waters UV Spectrophotometer"
      }
    ],
    createdAt: "2026-08-16T10:00:00Z",
    updatedAt: "2026-08-25T14:40:00Z"
  }
];
