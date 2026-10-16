/**
 * Citi Pharma Laboratory Information Management System (Star-LIMS)
 * Finished Products, IPQC & Stability Testing Mock Data (Phase 6)
 * Realistic pharmaceutical batch release, dissolution profiles, in-process assays and mock status histories.
 */

import { ProductSample } from "../types/product";

export const MOCK_PRODUCT_SAMPLES: ProductSample[] = [
  {
    id: "CP-PRD-2026-0501",
    productName: "Ciprocit Film-Coated Tablets",
    productCode: "FP-TAB-0104",
    dosageForm: "Tablets",
    strength: "500 mg",
    genericName: "Ciprofloxacin Hydrochloride BP",
    batchNumber: "CPT-500-26A",
    batchSize: "250,000 Tablets",
    batchStatus: "Commercial Batch",
    manufacturingDate: "2026-09-18",
    expiryDate: "2029-09-17",
    receivedDate: "2026-09-22",
    samplingDate: "2026-09-22",
    sampleType: "Finished Product Release",
    packagingDetails: "10 x 10 Alu-PVC Blister Packs in Unit Carton",
    productionLine: "Solid Oral Facility (Line-1 Fette Press)",
    targetMarket: "Domestic (DRAP)",
    storageCondition: "Store below 30°C in a dry place, protect from direct light",
    pharmacopeia: "BP 2026",
    quantitySampled: 120,
    unit: "Tablets",
    status: "Released",
    analyst: "Zubair Ahmed",
    reviewedBy: "Dr. Farhan Malik",
    qaReleaseDate: "2026-09-29",
    remarks: "All finished product release specifications met. Dissolution profile exceeds Q NLT 80% at 30 min. Certificate of Analysis #CP-COA-2026-0881 issued.",
    statusHistory: [
      {
        id: "SH-01",
        status: "Registered",
        timestamp: "2026-09-22 09:30",
        changedBy: "Bilal Tariq (Intake Chemist)",
        remarks: "Sample drawn from secondary packaging line. Tamper seals verified."
      },
      {
        id: "SH-02",
        status: "Under Testing",
        timestamp: "2026-09-24 11:15",
        changedBy: "Zubair Ahmed (Senior QC Analyst)",
        remarks: "Assay, dissolution, and uniformity testing commenced."
      },
      {
        id: "SH-03",
        status: "Reviewed",
        timestamp: "2026-09-28 14:00",
        changedBy: "Saima Naz (QC Lab Lead)",
        remarks: "Analytical results verified against BP 2026 monograph."
      },
      {
        id: "SH-04",
        status: "Released",
        timestamp: "2026-09-29 15:20",
        changedBy: "Dr. Farhan Malik (QA Director)",
        remarks: "Batch release authorized for commercial distribution."
      }
    ],
    tests: [
      {
        id: "PT-01",
        parameter: "Assay (% Label Claim Ciprofloxacin)",
        specification: "95.0% - 105.0%",
        observedResult: "99.8%",
        passed: true,
        instrumentUsed: "Waters Alliance e2695 HPLC"
      },
      {
        id: "PT-02",
        parameter: "Dissolution (USP App 2 Paddles, 50 rpm, 0.01N HCl, 45 min)",
        specification: "Q NLT 80% dissolved in 45 min",
        observedResult: "92.4% (Range: 89.1% - 95.8%)",
        passed: true,
        instrumentUsed: "Erweka DT 820 Dissolution Station"
      },
      {
        id: "PT-03",
        parameter: "Uniformity of Dosage Units (USP <905>)",
        specification: "Acceptance Value (AV) NMT 15.0",
        observedResult: "AV = 3.8 (L1 Pass)",
        passed: true,
        instrumentUsed: "Mettler Toledo Analytical Balance / HPLC"
      },
      {
        id: "PT-04",
        parameter: "Related Substances: Impurity A (Fluoroquinolonic Acid)",
        specification: "NMT 0.20%",
        observedResult: "0.05%",
        passed: true,
        instrumentUsed: "Waters 2998 PDA Detector"
      },
      {
        id: "PT-05",
        parameter: "Disintegration Time",
        specification: "NMT 15 minutes",
        observedResult: "6 min 40 sec",
        passed: true,
        instrumentUsed: "Sotax DT50 Disintegration Tester"
      }
    ],
    createdAt: "2026-09-22T09:00:00Z",
    updatedAt: "2026-09-29T15:20:00Z"
  },
  {
    id: "CP-PRD-2026-0502",
    productName: "Metfor-SR Extended-Release Tablets",
    productCode: "FP-TAB-0208",
    dosageForm: "Tablets",
    strength: "850 mg",
    genericName: "Metformin Hydrochloride USP",
    batchNumber: "MSR-850-26S1",
    batchSize: "500,000 Tablets",
    batchStatus: "Stability Chamber Batch",
    manufacturingDate: "2026-04-10",
    expiryDate: "2029-04-09",
    receivedDate: "2026-10-10",
    samplingDate: "2026-10-10",
    sampleType: "ICH Stability Testing",
    packagingDetails: "Alu-Alu Cold Form Blister Packs in Stability Trays",
    productionLine: "Solid Oral Facility (Line-2 Matrix Compression)",
    targetMarket: "Export (GCC / MENA)",
    storageCondition: "Stability Chamber ICH-02 (40°C ± 2°C / 75% RH ± 5% RH)",
    pharmacopeia: "USP 48-NF 43",
    quantitySampled: 80,
    unit: "Tablets",
    status: "Under Testing",
    analyst: "Saima Naz",
    reviewedBy: "Dr. Farhan Malik",
    remarks: "6-Month accelerated stability pull. Multi-point dissolution profile (1 hr, 3 hr, 10 hr) in progress on Dissolution Station DT-02.",
    statusHistory: [
      {
        id: "SH-01",
        status: "Registered",
        timestamp: "2026-10-10 10:15",
        changedBy: "Saima Naz",
        remarks: "Sample pulled from Chamber ICH-02 at 6-month timepoint."
      },
      {
        id: "SH-02",
        status: "Under Testing",
        timestamp: "2026-10-12 08:30",
        changedBy: "Saima Naz",
        remarks: "Dissolution profile and assay underway."
      }
    ],
    tests: [
      {
        id: "PT-01",
        parameter: "Assay (% Label Claim Metformin HCl)",
        specification: "95.0% - 105.0%",
        observedResult: "99.1%",
        passed: true,
        instrumentUsed: "Agilent 1260 Infinity II HPLC"
      },
      {
        id: "PT-02",
        parameter: "Drug Release at 1 Hour (pH 6.8 Buffer)",
        specification: "20.0% - 40.0%",
        observedResult: "28.5%",
        passed: true,
        instrumentUsed: "Erweka DT 820"
      },
      {
        id: "PT-03",
        parameter: "Drug Release at 10 Hours",
        specification: "NLT 85.0%",
        observedResult: "91.8%",
        passed: true,
        instrumentUsed: "Erweka DT 820"
      }
    ],
    createdAt: "2026-10-10T10:15:00Z",
    updatedAt: "2026-10-15T16:00:00Z"
  },
  {
    id: "CP-PRD-2026-0503",
    productName: "Paracit Pediatric Oral Suspension",
    productCode: "FP-LIQ-0301",
    dosageForm: "Suspensions",
    strength: "120 mg / 5 mL",
    genericName: "Paracetamol Micronized BP",
    batchNumber: "PDS-120-26C",
    batchSize: "15,000 Bottles",
    batchStatus: "Commercial Batch",
    manufacturingDate: "2026-09-28",
    expiryDate: "2028-09-27",
    receivedDate: "2026-10-01",
    samplingDate: "2026-10-01",
    sampleType: "Finished Product Release",
    packagingDetails: "60mL Amber PET Bottles with Child Resistant Caps & 5mL Dosing Syringe",
    productionLine: "Liquid Oral Filling Facility (Line-1 Monoblock)",
    targetMarket: "Domestic (DRAP)",
    storageCondition: "Store below 25°C, do not freeze, shake well before use",
    pharmacopeia: "BP 2026",
    quantitySampled: 18,
    unit: "Bottles",
    status: "Released",
    analyst: "Bilal Tariq",
    reviewedBy: "Dr. Farhan Malik",
    qaReleaseDate: "2026-10-06",
    remarks: "Viscosity, pH and deliverable volume verified compliant. Microbial limit test (TAMC/TYMC) within acceptable limits.",
    statusHistory: [
      {
        id: "SH-01",
        status: "Registered",
        timestamp: "2026-10-01 11:00",
        changedBy: "Bilal Tariq",
        remarks: "Bottles received from packing conveyor line."
      },
      {
        id: "SH-02",
        status: "Under Testing",
        timestamp: "2026-10-02 09:00",
        changedBy: "Bilal Tariq",
        remarks: "Specific gravity, deliverable volume and potency testing."
      },
      {
        id: "SH-03",
        status: "Reviewed",
        timestamp: "2026-10-05 16:30",
        changedBy: "Zubair Ahmed",
        remarks: "Results verified against BP specifications."
      },
      {
        id: "SH-04",
        status: "Released",
        timestamp: "2026-10-06 14:30",
        changedBy: "Dr. Farhan Malik",
        remarks: "Commercial release authorized."
      }
    ],
    tests: [
      {
        id: "PT-01",
        parameter: "Assay (% Label Claim Paracetamol)",
        specification: "95.0% - 105.0%",
        observedResult: "100.4%",
        passed: true,
        instrumentUsed: "Shimadzu UV-1800 Spectrophotometer"
      },
      {
        id: "PT-02",
        parameter: "pH of Suspension",
        specification: "5.0 - 6.5",
        observedResult: "5.62",
        passed: true,
        instrumentUsed: "Mettler Toledo SevenDirect pH"
      },
      {
        id: "PT-03",
        parameter: "Deliverable Volume (USP <698>)",
        specification: "Average NLT 100% of nominal volume (60 mL)",
        observedResult: "61.2 mL (Pass)",
        passed: true,
        instrumentUsed: "Class-A Graduated Cylinder"
      }
    ],
    createdAt: "2026-10-01T11:00:00Z",
    updatedAt: "2026-10-06T14:30:00Z"
  },
  {
    id: "CP-PRD-2026-0504",
    productName: "Ceftriax-Cit Sterile Vial for Injection",
    productCode: "FP-INJ-0401",
    dosageForm: "Injectables / Ampoules",
    strength: "1 g / vial",
    genericName: "Ceftriaxone Sodium USP Sterile",
    batchNumber: "CTX-100-26B",
    batchSize: "50,000 Vials",
    batchStatus: "Commercial Batch",
    manufacturingDate: "2026-09-30",
    expiryDate: "2029-09-29",
    receivedDate: "2026-10-02",
    samplingDate: "2026-10-02",
    sampleType: "Sterile Parenteral Release",
    packagingDetails: "USP Type-1 Clear Glass 15mL Tubular Vials with Bromobutyl Stopper & Flip-off Seal",
    productionLine: "Sterile Injectable Suite (Class A Filling / Lyophilizer-1)",
    targetMarket: "Institutional Hospital Supply",
    storageCondition: "Store below 25°C, protect from light",
    pharmacopeia: "USP 48-NF 43",
    quantitySampled: 60,
    unit: "Vials",
    status: "Under Testing",
    analyst: "Bilal Tariq",
    reviewedBy: "Dr. Farhan Malik",
    remarks: "14-Day sterility incubation underway in laminar air flow biological safety cabinet (Day 12 of 14, no turbidity observed). Endotoxin < 0.20 EU/mg.",
    statusHistory: [
      {
        id: "SH-01",
        status: "Registered",
        timestamp: "2026-10-02 13:00",
        changedBy: "Bilal Tariq",
        remarks: "Sample taken post-crimping from Class A cleanroom."
      },
      {
        id: "SH-02",
        status: "Under Testing",
        timestamp: "2026-10-03 08:00",
        changedBy: "Bilal Tariq",
        remarks: "Membrane filtration sterility test and LAL endotoxin testing initiated."
      }
    ],
    tests: [
      {
        id: "PT-01",
        parameter: "Sterility Test (Membrane Filtration, 14 Days)",
        specification: "No growth observed in FTM and TSB media",
        observedResult: "Incubation Day 12 / 14: Clear, No microbial growth",
        passed: true,
        instrumentUsed: "Millipore Steritest Equinox System"
      },
      {
        id: "PT-02",
        parameter: "Bacterial Endotoxin Test (LAL Kinetic Chromogenic)",
        specification: "NMT 0.20 EU/mg Ceftriaxone",
        observedResult: "0.04 EU/mg",
        passed: true,
        instrumentUsed: "Lonza PyroGent-5000 Kinetic Reader"
      },
      {
        id: "PT-03",
        parameter: "Assay (% Label Claim Ceftriaxone)",
        specification: "90.0% - 115.0%",
        observedResult: "98.8%",
        passed: true,
        instrumentUsed: "Waters HPLC Alliance"
      }
    ],
    createdAt: "2026-10-02T13:00:00Z",
    updatedAt: "2026-10-15T17:00:00Z"
  },
  {
    id: "CP-PRD-2026-0505",
    productName: "Amoxi-Care Dry Powder for Suspension",
    productCode: "IP-DRY-0512",
    dosageForm: "Suspensions",
    strength: "250 mg / 5 mL",
    genericName: "Amoxicillin Trihydrate Compacted BP",
    batchNumber: "AMX-DRY-2601",
    batchSize: "20,000 Bottles",
    batchStatus: "Commercial Batch",
    manufacturingDate: "2026-10-14",
    expiryDate: "2028-10-13",
    receivedDate: "2026-10-14",
    samplingDate: "2026-10-14",
    sampleType: "In-Process Quality Control (IPQC)",
    packagingDetails: "Intermediate Bulk Powder Container (IBC) prior to bottle filling",
    productionLine: "Dedicated Beta-Lactam Powder Filling Line",
    targetMarket: "Domestic (DRAP)",
    storageCondition: "Controlled RH < 35%, Temperature 20-22°C",
    pharmacopeia: "BP 2026",
    quantitySampled: 10,
    unit: "Bottles",
    status: "Reviewed",
    analyst: "Zubair Ahmed",
    reviewedBy: "Dr. Farhan Malik",
    remarks: "Blend uniformity assay sampled across 10 locations in bin blender. RSD = 1.8% (spec NMT 5.0%). Cleared for rotary bottle filling.",
    statusHistory: [
      {
        id: "SH-01",
        status: "Registered",
        timestamp: "2026-10-14 08:30",
        changedBy: "Zubair Ahmed",
        remarks: "IPQC blend samples received from cone blender."
      },
      {
        id: "SH-02",
        status: "Under Testing",
        timestamp: "2026-10-14 09:30",
        changedBy: "Zubair Ahmed",
        remarks: "HPLC potency and KF moisture testing."
      },
      {
        id: "SH-03",
        status: "Reviewed",
        timestamp: "2026-10-15 11:00",
        changedBy: "Dr. Farhan Malik",
        remarks: "Blend uniformity approved for rotary bottle filling."
      }
    ],
    tests: [
      {
        id: "PT-01",
        parameter: "Blend Potency Uniformity (% Label Claim)",
        specification: "90.0% - 110.0%, RSD NMT 5.0%",
        observedResult: "Mean: 99.4%, RSD: 1.8%",
        passed: true,
        instrumentUsed: "Agilent 1260 HPLC"
      },
      {
        id: "PT-02",
        parameter: "Moisture Content by Karl Fischer",
        specification: "NMT 2.5%",
        observedResult: "1.65%",
        passed: true,
        instrumentUsed: "Metrohm KF Titrator"
      }
    ],
    createdAt: "2026-10-14T08:30:00Z",
    updatedAt: "2026-10-15T11:00:00Z"
  },
  {
    id: "CP-PRD-2026-0506",
    productName: "Omecit Delayed-Release Hard Capsules",
    productCode: "FP-CAP-0610",
    dosageForm: "Capsules",
    strength: "20 mg",
    genericName: "Omeprazole Enteric-Coated Pellets 8.5%",
    batchNumber: "OMC-020-25S2",
    batchSize: "1,000,000 Capsules",
    batchStatus: "Stability Chamber Batch",
    manufacturingDate: "2025-10-05",
    expiryDate: "2028-10-04",
    receivedDate: "2026-10-05",
    samplingDate: "2026-10-05",
    sampleType: "ICH Stability Testing",
    packagingDetails: "2 x 7 Alu-Alu Strip Pack in Unit Carton",
    productionLine: "Solid Oral Facility (Line-3 Bosch Encapsulation)",
    targetMarket: "Domestic (DRAP)",
    storageCondition: "Chamber ICH-01 (25°C ± 2°C / 60% RH ± 5% RH)",
    pharmacopeia: "USP 48-NF 43",
    quantitySampled: 60,
    unit: "Capsules",
    status: "Released",
    analyst: "Saima Naz",
    reviewedBy: "Dr. Farhan Malik",
    qaReleaseDate: "2026-10-12",
    remarks: "12-Month real time stability pull satisfied all dissolution & degradation criteria. Enteric coat integrity robust.",
    statusHistory: [
      {
        id: "SH-01",
        status: "Registered",
        timestamp: "2026-10-05 09:00",
        changedBy: "Saima Naz",
        remarks: "12-Month time point sample retrieved from stability chamber."
      },
      {
        id: "SH-02",
        status: "Under Testing",
        timestamp: "2026-10-06 10:30",
        changedBy: "Saima Naz",
        remarks: "Acid resistance and buffer dissolution testing."
      },
      {
        id: "SH-03",
        status: "Reviewed",
        timestamp: "2026-10-10 14:00",
        changedBy: "Zubair Ahmed",
        remarks: "Criteria satisfied."
      },
      {
        id: "SH-04",
        status: "Released",
        timestamp: "2026-10-12 15:45",
        changedBy: "Dr. Farhan Malik",
        remarks: "Stability record archived."
      }
    ],
    tests: [
      {
        id: "PT-01",
        parameter: "Acid Resistance Stage (0.1N HCl, 2 hours)",
        specification: "NMT 10.0% dissolved",
        observedResult: "4.2%",
        passed: true,
        instrumentUsed: "Erweka DT 820"
      },
      {
        id: "PT-02",
        parameter: "Buffer Stage (pH 6.8 Buffer, 30 min)",
        specification: "NLT 75.0% dissolved",
        observedResult: "86.8%",
        passed: true,
        instrumentUsed: "Erweka DT 820"
      }
    ],
    createdAt: "2026-10-05T09:00:00Z",
    updatedAt: "2026-10-12T15:45:00Z"
  },
  {
    id: "CP-PRD-2026-0507",
    productName: "Atorcit Film-Coated Tablets",
    productCode: "FP-TAB-0715",
    dosageForm: "Tablets",
    strength: "20 mg",
    genericName: "Atorvastatin Calcium Trihydrate USP",
    batchNumber: "ATR-020-26F",
    batchSize: "300,000 Tablets",
    batchStatus: "Commercial Batch",
    manufacturingDate: "2026-09-25",
    expiryDate: "2028-09-24",
    receivedDate: "2026-09-28",
    samplingDate: "2026-09-28",
    sampleType: "Finished Product Release",
    packagingDetails: "3 x 10 Alu-Alu Blister Packs",
    productionLine: "Solid Oral Facility (Line-1 Tablet Press)",
    targetMarket: "Export (GCC / MENA)",
    storageCondition: "Store below 25°C, protect from moisture",
    pharmacopeia: "USP 48-NF 43",
    quantitySampled: 90,
    unit: "Tablets",
    status: "Released",
    analyst: "Zubair Ahmed",
    reviewedBy: "Dr. Farhan Malik",
    qaReleaseDate: "2026-10-04",
    remarks: "Batch released for GCC export consignment. Conforms to USP monograph and GCC-DR guidance on chiral purity.",
    statusHistory: [
      {
        id: "SH-01",
        status: "Registered",
        timestamp: "2026-09-28 10:30",
        changedBy: "Zubair Ahmed",
        remarks: "Sample drawn from export packaging line."
      },
      {
        id: "SH-02",
        status: "Under Testing",
        timestamp: "2026-09-29 09:00",
        changedBy: "Zubair Ahmed",
        remarks: "HPLC potency and dissolution testing."
      },
      {
        id: "SH-03",
        status: "Reviewed",
        timestamp: "2026-10-02 11:30",
        changedBy: "Saima Naz",
        remarks: "All specifications within limits."
      },
      {
        id: "SH-04",
        status: "Released",
        timestamp: "2026-10-04 16:00",
        changedBy: "Dr. Farhan Malik",
        remarks: "Export batch release signed."
      }
    ],
    tests: [
      {
        id: "PT-01",
        parameter: "Assay (% Label Claim Atorvastatin)",
        specification: "95.0% - 105.0%",
        observedResult: "100.8%",
        passed: true,
        instrumentUsed: "Waters HPLC Alliance"
      },
      {
        id: "PT-02",
        parameter: "Dissolution (0.05M Phosphate Buffer pH 6.8, 30 min)",
        specification: "Q NLT 80% dissolved",
        observedResult: "94.2%",
        passed: true,
        instrumentUsed: "Erweka DT 820"
      }
    ],
    createdAt: "2026-09-28T10:30:00Z",
    updatedAt: "2026-10-04T16:00:00Z"
  },
  {
    id: "CP-PRD-2026-0508",
    productName: "Cuf-Cit Expectorant Syrup",
    productCode: "FP-SYR-0802",
    dosageForm: "Syrups",
    strength: "14 mg + 135 mg / 5 mL",
    genericName: "Diphenhydramine + Ammonium Chloride + Menthol",
    batchNumber: "CC-EXP-2608",
    batchSize: "10,000 Liters (83,330 Bottles)",
    batchStatus: "Commercial Batch",
    manufacturingDate: "2026-10-15",
    expiryDate: "2028-10-14",
    receivedDate: "2026-10-15",
    samplingDate: "2026-10-15",
    sampleType: "In-Process Quality Control (IPQC)",
    packagingDetails: "Bulk Compounded Liquid prior to transfer to Holding Tank",
    productionLine: "Liquid Manufacturing Vessel Tank T-04 (10,000L)",
    targetMarket: "Domestic (DRAP)",
    storageCondition: "Store bulk solution below 25°C under continuous slow agitation",
    pharmacopeia: "BP 2026",
    quantitySampled: 500,
    unit: "Bottles",
    status: "Registered",
    analyst: "Saima Naz",
    reviewedBy: "Dr. Farhan Malik",
    remarks: "In-process sample pulled from mixing vessel. Viscosity, pH, and active triple-assay in queue.",
    statusHistory: [
      {
        id: "SH-01",
        status: "Registered",
        timestamp: "2026-10-15 14:00",
        changedBy: "Saima Naz",
        remarks: "Sample registered from Tank T-04."
      }
    ],
    tests: [
      {
        id: "PT-01",
        parameter: "Diphenhydramine HCl Assay",
        specification: "95.0% - 105.0%",
        observedResult: "Testing queued",
        passed: true,
        instrumentUsed: "HPLC Waters e2695"
      }
    ],
    createdAt: "2026-10-15T14:00:00Z",
    updatedAt: "2026-10-15T14:00:00Z"
  },
  {
    id: "CP-PRD-2026-0509",
    productName: "Dermacit Hydrocortisone Cream",
    productCode: "FP-CRM-0901",
    dosageForm: "Creams",
    strength: "1.0% w/w",
    genericName: "Hydrocortisone Acetate USP 1.0% w/w",
    batchNumber: "DMC-010-26A",
    batchSize: "20,000 Tubes (15g)",
    batchStatus: "Quarantine Hold",
    manufacturingDate: "2026-10-02",
    expiryDate: "2028-10-01",
    receivedDate: "2026-10-05",
    samplingDate: "2026-10-05",
    sampleType: "Finished Product Release",
    packagingDetails: "15g Collapsible Aluminum Tubes with Polypropylene Caps",
    productionLine: "Semi-Solid Creams & Ointments Line (FrymaKoruma Homogenizer)",
    targetMarket: "Domestic (DRAP)",
    storageCondition: "Store below 25°C, do not freeze",
    pharmacopeia: "USP 48-NF 43",
    quantitySampled: 24,
    unit: "Tubes",
    status: "Quarantine",
    analyst: "Bilal Tariq",
    reviewedBy: "Dr. Farhan Malik",
    remarks: "INVESTIGATION OOS-2026-092: Presumptive microbial growth on Sabouraud Dextrose Agar during initial Total Yeast and Mold Count (TYMC). Sub-culturing in progress for microbial identification. Lot placed on QA Quarantine hold.",
    statusHistory: [
      {
        id: "SH-01",
        status: "Registered",
        timestamp: "2026-10-05 10:00",
        changedBy: "Bilal Tariq",
        remarks: "Finished tubes received from filling line."
      },
      {
        id: "SH-02",
        status: "Under Testing",
        timestamp: "2026-10-06 09:30",
        changedBy: "Bilal Tariq",
        remarks: "Microbial enumeration and assay started."
      },
      {
        id: "SH-03",
        status: "Quarantine",
        timestamp: "2026-10-14 09:30",
        changedBy: "Dr. Farhan Malik",
        remarks: "Quarantine hold initiated pending speciation."
      }
    ],
    tests: [
      {
        id: "PT-01",
        parameter: "Hydrocortisone Acetate Assay",
        specification: "90.0% - 110.0%",
        observedResult: "99.2%",
        passed: true,
        instrumentUsed: "Waters HPLC Alliance"
      },
      {
        id: "PT-02",
        parameter: "Total Combined Yeast & Mold Count (TYMC)",
        specification: "NMT 10 CFU/g",
        observedResult: "Investigation: Colony observed (under speciation)",
        passed: false,
        instrumentUsed: "Sabouraud Dextrose Agar Incubator 25°C"
      }
    ],
    createdAt: "2026-10-05T10:00:00Z",
    updatedAt: "2026-10-14T09:30:00Z"
  },
  {
    id: "CP-PRD-2026-0510",
    productName: "Azithrocit Film-Coated Tablets",
    productCode: "FP-TAB-1011",
    dosageForm: "Tablets",
    strength: "500 mg",
    genericName: "Azithromycin Dihydrate USP",
    batchNumber: "AZT-500-26D",
    batchSize: "150,000 Tablets",
    batchStatus: "Commercial Batch",
    manufacturingDate: "2026-09-20",
    expiryDate: "2029-09-19",
    receivedDate: "2026-09-24",
    samplingDate: "2026-09-24",
    sampleType: "Finished Product Release",
    packagingDetails: "1 x 3 Blister Pack in Unit Carton",
    productionLine: "Solid Oral Facility (Line-2 Compression)",
    targetMarket: "Domestic (DRAP)",
    storageCondition: "Store below 30°C in a dry place",
    pharmacopeia: "USP 48-NF 43",
    quantitySampled: 48,
    unit: "Tablets",
    status: "Rejected",
    analyst: "Zubair Ahmed",
    reviewedBy: "Dr. Farhan Malik",
    qaReleaseDate: "2026-10-03",
    remarks: "CRITICAL REJECTION: Dissolution testing failed Stage 1 (S1) and Stage 2 (S2). Mean dissolution at 45 min was 68.4% (USP criterion Q NLT 80%). Core tablet disintegration was abnormally prolonged due to over-lubrication of magnesium stearate during blending. Batch rejected and flagged for scrap disposal.",
    statusHistory: [
      {
        id: "SH-01",
        status: "Registered",
        timestamp: "2026-09-24 12:00",
        changedBy: "Zubair Ahmed",
        remarks: "Sample drawn from packing bay."
      },
      {
        id: "SH-02",
        status: "Under Testing",
        timestamp: "2026-09-25 09:30",
        changedBy: "Zubair Ahmed",
        remarks: "Dissolution testing running."
      },
      {
        id: "SH-03",
        status: "Rejected",
        timestamp: "2026-10-03 16:30",
        changedBy: "Dr. Farhan Malik",
        remarks: "Formal rejection: Dissolution Stage 2 failed."
      }
    ],
    tests: [
      {
        id: "PT-01",
        parameter: "Dissolution (USP App 2, 0.1M Phosphate pH 6.0, 45 min)",
        specification: "Q NLT 80% dissolved in 45 min",
        observedResult: "68.4% (Stage 2 Failed)",
        passed: false,
        instrumentUsed: "Erweka DT 820 Dissolution Tester"
      },
      {
        id: "PT-02",
        parameter: "Disintegration Time",
        specification: "NMT 15 minutes",
        observedResult: "24 minutes (Failed)",
        passed: false,
        instrumentUsed: "Sotax DT50"
      }
    ],
    createdAt: "2026-09-24T12:00:00Z",
    updatedAt: "2026-10-03T16:30:00Z"
  },
  {
    id: "CP-PRD-2026-0511",
    productName: "Ibu-Cit Film-Coated Tablets",
    productCode: "FP-TAB-1102",
    dosageForm: "Tablets",
    strength: "400 mg",
    genericName: "Ibuprofen BP 400mg",
    batchNumber: "IBU-400-26S1",
    batchSize: "400,000 Tablets",
    batchStatus: "Stability Chamber Batch",
    manufacturingDate: "2026-07-08",
    expiryDate: "2029-07-07",
    receivedDate: "2026-10-08",
    samplingDate: "2026-10-08",
    sampleType: "ICH Stability Testing",
    packagingDetails: "10 x 10 Blisters in Printed Carton",
    productionLine: "Solid Oral Facility (Line-1)",
    targetMarket: "Domestic (DRAP)",
    storageCondition: "Stability Chamber ICH-02 (40°C ± 2°C / 75% RH ± 5% RH)",
    pharmacopeia: "BP 2026",
    quantitySampled: 60,
    unit: "Tablets",
    status: "Released",
    analyst: "Zubair Ahmed",
    reviewedBy: "Dr. Farhan Malik",
    qaReleaseDate: "2026-10-14",
    remarks: "3-Month accelerated stability pull passed all physicochemical testing. Dissolution rate and chromatographic purity remain within limits.",
    statusHistory: [
      {
        id: "SH-01",
        status: "Registered",
        timestamp: "2026-10-08 08:00",
        changedBy: "Zubair Ahmed",
        remarks: "3-Month chamber pull registered."
      },
      {
        id: "SH-02",
        status: "Under Testing",
        timestamp: "2026-10-09 10:00",
        changedBy: "Zubair Ahmed",
        remarks: "Assay and dissolution running."
      },
      {
        id: "SH-03",
        status: "Reviewed",
        timestamp: "2026-10-13 15:00",
        changedBy: "Saima Naz",
        remarks: "Results verified."
      },
      {
        id: "SH-04",
        status: "Released",
        timestamp: "2026-10-14 15:00",
        changedBy: "Dr. Farhan Malik",
        remarks: "Stability report authorized."
      }
    ],
    tests: [
      {
        id: "PT-01",
        parameter: "Assay (% Label Claim Ibuprofen)",
        specification: "95.0% - 105.0%",
        observedResult: "99.8%",
        passed: true,
        instrumentUsed: "Waters HPLC"
      },
      {
        id: "PT-02",
        parameter: "Dissolution (Phosphate Buffer pH 7.2, 30 min)",
        specification: "Q NLT 75% in 30 min",
        observedResult: "88.6%",
        passed: true,
        instrumentUsed: "Erweka DT 820"
      }
    ],
    createdAt: "2026-10-08T08:00:00Z",
    updatedAt: "2026-10-14T15:00:00Z"
  },
  {
    id: "CP-PRD-2026-0512",
    productName: "Dexa-Cit Sterile Injection Ampoules",
    productCode: "FP-INJ-1205",
    dosageForm: "Injectables / Ampoules",
    strength: "4 mg / mL (2 mL)",
    genericName: "Dexamethasone Sodium Phosphate USP",
    batchNumber: "DXA-004-26B",
    batchSize: "100,000 Ampoules (2mL)",
    batchStatus: "Commercial Batch",
    manufacturingDate: "2026-09-15",
    expiryDate: "2028-09-14",
    receivedDate: "2026-09-18",
    samplingDate: "2026-09-18",
    sampleType: "Sterile Parenteral Release",
    packagingDetails: "5 x 2mL Type-1 Amber Glass Ampoules per Blister Tray in Printed Unit Carton",
    productionLine: "Sterile Parenteral Line-2 (Ampoule Filling & Sealing)",
    targetMarket: "Institutional Hospital Supply",
    storageCondition: "Store below 25°C, protect from light, do not freeze",
    pharmacopeia: "USP 48-NF 43",
    quantitySampled: 80,
    unit: "Vials",
    status: "Released",
    analyst: "Bilal Tariq",
    reviewedBy: "Dr. Farhan Malik",
    qaReleaseDate: "2026-10-02",
    remarks: "Sterility (14 days FTM/TSB) passed with zero microbial growth. Endotoxin level < 0.10 EU/mg. Batch authorized for institutional hospital distribution.",
    statusHistory: [
      {
        id: "SH-01",
        status: "Registered",
        timestamp: "2026-09-18 10:00",
        changedBy: "Bilal Tariq",
        remarks: "Sample taken from optical inspection station."
      },
      {
        id: "SH-02",
        status: "Under Testing",
        timestamp: "2026-09-19 09:00",
        changedBy: "Bilal Tariq",
        remarks: "Sterility incubation day 1."
      },
      {
        id: "SH-03",
        status: "Reviewed",
        timestamp: "2026-10-01 16:00",
        changedBy: "Saima Naz",
        remarks: "14-day incubation complete. Zero growth."
      },
      {
        id: "SH-04",
        status: "Released",
        timestamp: "2026-10-02 13:45",
        changedBy: "Dr. Farhan Malik",
        remarks: "Commercial release authorized."
      }
    ],
    tests: [
      {
        id: "PT-01",
        parameter: "Sterility Test (Membrane Filtration, 14 Days)",
        specification: "No microbial growth",
        observedResult: "Pass - No growth",
        passed: true,
        instrumentUsed: "Millipore Steritest"
      },
      {
        id: "PT-02",
        parameter: "Assay (% Dexamethasone Phosphate)",
        specification: "90.0% - 115.0%",
        observedResult: "101.2%",
        passed: true,
        instrumentUsed: "Waters HPLC Alliance"
      }
    ],
    createdAt: "2026-09-18T10:00:00Z",
    updatedAt: "2026-10-02T13:45:00Z"
  }
];
