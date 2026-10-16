/**
 * Citi Pharma | Laboratory Management System (Star-LIMS)
 * Quality • Precision • Compliance
 * Data Store & Pharmaceutical Catalog
 */

const INITIAL_SAMPLES = [
  {
    id: "CP-SAMP-2026-0842",
    batchNumber: "PAR-500-B294",
    productName: "Paracetamol BP 500mg Tablets",
    category: "Finished Product",
    mfgDate: "2026-09-10",
    expDate: "2029-08-31",
    batchSize: "500,000 Tablets",
    testType: "Assay by HPLC & Dissolution",
    analyst: "Dr. Ayesha Khan",
    analystDept: "QC Finished Products",
    receivedDate: "2026-10-12",
    targetSpec: "Assay: 98.0% - 102.0% | Dissolution: ≥ 80.0% in 30 min",
    observedValue: "Assay: 99.8% | Dissolution: 94.2%",
    status: "Pass/Released",
    statusNotes: "All USP/BP parameters conforming to monograph. Approved for release.",
    pharmacopeia: "BP 2026 / USP 48",
    storageCondition: "Room Temp (15-25°C)",
    priority: "Normal",
    tests: [
      { name: "Identification (HPLC & IR)", spec: "Conforms to standard", result: "Conforms", passed: true },
      { name: "Assay (% Label Claim)", spec: "98.0 - 102.0 %", result: "99.8 %", passed: true },
      { name: "Dissolution (USP Apparatus II)", spec: "Q ≥ 80.0% at 30 min", result: "94.2 %", passed: true },
      { name: "Uniformity of Dosage Units", spec: "AV ≤ 15.0", result: "4.8 (Complies)", passed: true },
      { name: "Related Substances (4-Aminophenol)", spec: "NMT 0.005 %", result: "0.001 %", passed: true }
    ],
    reviewedBy: "Farhan Malik (QA Manager)",
    reviewedDate: "2026-10-14 16:30"
  },
  {
    id: "CP-SAMP-2026-0843",
    batchNumber: "AMX-TRI-RM041",
    productName: "Amoxicillin Trihydrate Micronized",
    category: "Raw Material (API)",
    mfgDate: "2026-08-15",
    expDate: "2029-07-31",
    batchSize: "250 kg Drum",
    testType: "Potency Assay & Water Content (KF)",
    analyst: "Zubair Ahmed",
    analystDept: "QC Raw Materials",
    receivedDate: "2026-10-13",
    targetSpec: "Potency: 95.0% - 102.0% | Water: 11.5% - 14.5%",
    observedValue: "Potency: 99.1% | Water: 12.8%",
    status: "Pass/Released",
    statusNotes: "Certificate of Analysis issued. Transferred to Dispensing Quarantine release.",
    pharmacopeia: "Ph. Eur. 11.0",
    storageCondition: "Store airtight, below 25°C",
    priority: "Normal",
    tests: [
      { name: "Description & Solubility", spec: "White/almost white powder", result: "Conforms", passed: true },
      { name: "Assay (Anhydrous Basis)", spec: "95.0 - 102.0 %", result: "99.1 %", passed: true },
      { name: "Water Content by Karl Fischer", spec: "11.5 - 14.5 %", result: "12.8 %", passed: true },
      { name: "Heavy Metals", spec: "NMT 20 ppm", result: "< 10 ppm", passed: true },
      { name: "Specific Optical Rotation", spec: "+290° to +315°", result: "+301.4°", passed: true }
    ],
    reviewedBy: "Farhan Malik (QA Manager)",
    reviewedDate: "2026-10-15 11:20"
  },
  {
    id: "CP-SAMP-2026-0844",
    batchNumber: "CIP-500-B109",
    productName: "Ciprofloxacin HCl 500mg Film-Coated",
    category: "Finished Product",
    mfgDate: "2026-10-01",
    expDate: "2029-09-30",
    batchSize: "300,000 Tablets",
    testType: "Dissolution Profile & Related Substances",
    analyst: "Sana Rizvi",
    analystDept: "QC Solid Orals",
    receivedDate: "2026-10-14",
    targetSpec: "Dissolution: ≥ 80% at 30 min | Impurity A: ≤ 0.2%",
    observedValue: "Dissolution: 73.4% [Out of Spec] | Impurity A: 0.18%",
    status: "Fail/Rejected",
    statusNotes: "OOS Investigation #OOS-2026-042 initiated. Dissolution rate below BP spec (73.4% vs min 80%).",
    pharmacopeia: "BP 2026",
    storageCondition: "Protect from light, below 30°C",
    priority: "Urgent",
    tests: [
      { name: "Assay (HPLC)", spec: "95.0 - 105.0 %", result: "97.2 %", passed: true },
      { name: "Dissolution (0.1N HCl, 45 min)", spec: "Q ≥ 80.0%", result: "73.4 % (FAIL)", passed: false },
      { name: "Fluoroquinolonic Acid (Imp A)", spec: "NMT 0.2 %", result: "0.18 %", passed: true },
      { name: "Disintegration Time", spec: "NMT 15 min", result: "18.5 min (FAIL)", passed: false },
      { name: "Hardness & Friability", spec: "Hardness ≥ 8.0 kP | Friability < 1.0%", result: "14.2 kP | 0.08%", passed: true }
    ],
    reviewedBy: "Dr. Nadeem Akhtar (Head of QA)",
    reviewedDate: "2026-10-15 17:45"
  },
  {
    id: "CP-SAMP-2026-0845",
    batchNumber: "CEF-1G-INJ08",
    productName: "Ceftriaxone Sodium 1g Sterile Vial",
    category: "Sterile Injectable",
    mfgDate: "2026-10-05",
    expDate: "2028-10-04",
    batchSize: "40,000 Vials",
    testType: "Sterility & Bacterial Endotoxins (LAL)",
    analyst: "M. Bilal Tariq",
    analystDept: "Microbiology Section",
    receivedDate: "2026-10-10",
    targetSpec: "Sterility: Sterile 14-day | BET: < 0.20 EU/mg",
    observedValue: "Day 6 Incubation: No growth | BET: 0.08 EU/mg",
    status: "Quarantine/Retest",
    statusNotes: "Under 14-day mandatory sterility incubation period (Day 6 of 14). Retest scheduled at Day 14.",
    pharmacopeia: "USP 48-NF 43",
    storageCondition: "Protect from light, store 2-8°C",
    priority: "Urgent",
    tests: [
      { name: "Sterility Test (Membrane Filtration)", spec: "No microbial growth (14 days)", result: "In Incubation (Day 6/14)", passed: true },
      { name: "Bacterial Endotoxin Test (BET)", spec: "< 0.20 EU/mg", result: "0.08 EU/mg", passed: true },
      { name: "Sub-visible Particulate Matter", spec: "≥10µm: ≤6000/vial | ≥25µm: ≤600/vial", result: "140 / 12 (Complies)", passed: true },
      { name: "Clarity and Color of Solution", spec: "Clear, not more colored than Y5", result: "Clear pale yellow", passed: true }
    ],
    reviewedBy: "Pending Sterility Incubation",
    reviewedDate: "Expected 2026-10-24"
  },
  {
    id: "CP-SAMP-2026-0846",
    batchNumber: "MET-500-SR15",
    productName: "Metformin HCl 500mg Extended Release",
    category: "Finished Product",
    mfgDate: "2026-09-28",
    expDate: "2029-09-27",
    batchSize: "600,000 Tablets",
    testType: "Dissolution Profile (1h, 3h, 10h) & Assay",
    analyst: "Dr. Ayesha Khan",
    analystDept: "QC Finished Products",
    receivedDate: "2026-10-11",
    targetSpec: "Assay: 95.0% - 105.0% | Dissolution 1h: 20-40%, 3h: 45-65%, 10h: NLT 85%",
    observedValue: "Assay: 100.4% | Dissolution: 31%, 56%, 89%",
    status: "Pass/Released",
    statusNotes: "Dissolution kinetics meet USP Extended Release specifications. Full release authorized.",
    pharmacopeia: "USP 48",
    storageCondition: "Room Temp (15-25°C)",
    priority: "Normal",
    tests: [
      { name: "Identification (UV/Vis & HPLC)", spec: "Conforms to reference standard", result: "Conforms", passed: true },
      { name: "Assay (% Label Claim)", spec: "95.0 - 105.0 %", result: "100.4 %", passed: true },
      { name: "Dissolution 1 Hour", spec: "20 - 40 %", result: "31.2 %", passed: true },
      { name: "Dissolution 3 Hours", spec: "45 - 65 %", result: "56.4 %", passed: true },
      { name: "Dissolution 10 Hours", spec: "NLT 85.0 %", result: "89.1 %", passed: true },
      { name: "Related Substance: Cyanoguanidine", spec: "NMT 0.05 %", result: "0.012 %", passed: true }
    ],
    reviewedBy: "Farhan Malik (QA Manager)",
    reviewedDate: "2026-10-14 14:10"
  },
  {
    id: "CP-SAMP-2026-0847",
    batchNumber: "WFI-LOOP-A04",
    productName: "Water for Injection (WFI) Loop A",
    category: "In-Process / Utility",
    mfgDate: "2026-10-15",
    expDate: "2026-10-16",
    batchSize: "Continuous Generation",
    testType: "Total Organic Carbon (TOC) & Conductivity",
    analyst: "Hamza Shafiq",
    analystDept: "Environmental & Utilities QC",
    receivedDate: "2026-10-15",
    targetSpec: "TOC: < 500 ppb | Conductivity: < 1.3 µS/cm @ 25°C",
    observedValue: "TOC: 182 ppb | Conductivity: 0.84 µS/cm",
    status: "Pass/Released",
    statusNotes: "Loop A sanitization cycle verified. Bioburden < 10 CFU/100 mL.",
    pharmacopeia: "USP / Ph. Eur.",
    storageCondition: "Circulating hot loop (80°C)",
    priority: "Urgent",
    tests: [
      { name: "Conductivity at 25°C", spec: "< 1.3 µS/cm", result: "0.84 µS/cm", passed: true },
      { name: "Total Organic Carbon (TOC)", spec: "< 500 ppb", result: "182 ppb", passed: true },
      { name: "Bacterial Endotoxin", spec: "< 0.25 EU/mL", result: "< 0.05 EU/mL", passed: true },
      { name: "Total Aerobic Count", spec: "< 10 CFU / 100 mL", result: "0 CFU / 100 mL", passed: true }
    ],
    reviewedBy: "Farhan Malik (QA Manager)",
    reviewedDate: "2026-10-15 18:00"
  },
  {
    id: "CP-SAMP-2026-0848",
    batchNumber: "OMP-20-C05",
    productName: "Omeprazole Delayed-Release 20mg",
    category: "Finished Product",
    mfgDate: "2026-09-15",
    expDate: "2028-09-14",
    batchSize: "400,000 Capsules",
    testType: "Gastric Resistance Acid Stage & Buffer Stage",
    analyst: "Sana Rizvi",
    analystDept: "QC Solid Orals",
    receivedDate: "2026-10-13",
    targetSpec: "Acid Stage: < 10% dissolved | Buffer Stage: ≥ 75% in 30 min",
    observedValue: "Acid Stage: 16.4% [FAIL] | Buffer Stage: 81.2%",
    status: "Fail/Rejected",
    statusNotes: "Enteric coating breach in 0.1N HCl acid stage (16.4% vs limit NMT 10%). Batch rejected.",
    pharmacopeia: "USP 48",
    storageCondition: "Desiccant pack, below 25°C",
    priority: "Normal",
    tests: [
      { name: "Assay (% Label Claim)", spec: "90.0 - 110.0 %", result: "98.5 %", passed: true },
      { name: "Dissolution Acid Stage (2 hrs)", spec: "NMT 10.0 % dissolved", result: "16.4 % (FAIL)", passed: false },
      { name: "Dissolution Buffer Stage pH 6.8", spec: "NLT 75.0 % in 30 min", result: "81.2 %", passed: true },
      { name: "Water Content", spec: "NMT 5.0 %", result: "3.2 %", passed: true }
    ],
    reviewedBy: "Dr. Nadeem Akhtar (Head of QA)",
    reviewedDate: "2026-10-16 09:15"
  },
  {
    id: "CP-SAMP-2026-0849",
    batchNumber: "STB-IBU-40C-6M",
    productName: "Ibuprofen Oral Suspension 100mg/5ml",
    category: "Stability Testing",
    mfgDate: "2026-04-12",
    expDate: "2028-04-11",
    batchSize: "Stability Chamber Pull (6-Month Accelerated)",
    testType: "Accelerated Stability (40°C ± 2°C / 75% RH)",
    analyst: "Dr. Ayesha Khan",
    analystDept: "QC Stability Section",
    receivedDate: "2026-10-14",
    targetSpec: "Assay: 90.0-110.0% | pH: 3.6-4.6 | Sedimentation: Resuspendable",
    observedValue: "Assay: 97.4% | pH: 4.02 | Minor viscosity shift",
    status: "Quarantine/Retest",
    statusNotes: "Viscosity re-test required following second pull protocol. Preservative efficacy in progress.",
    pharmacopeia: "BP 2026 / ICH Q1A(R2)",
    storageCondition: "Stability Chamber #SC-02 (40°C/75%RH)",
    priority: "Normal",
    tests: [
      { name: "Assay of Ibuprofen", spec: "90.0 - 110.0 %", result: "97.4 %", passed: true },
      { name: "pH Determination", spec: "3.6 - 4.6", result: "4.02", passed: true },
      { name: "Viscosity (Brookfield RVT)", spec: "1200 - 2500 cP", result: "2480 cP (Borderline)", passed: true },
      { name: "4-Isobutylacetophenone (Imp C)", spec: "NMT 0.1 %", result: "0.04 %", passed: true },
      { name: "Preservative (Sodium Benzoate)", spec: "85.0 - 115.0 %", result: "Awaiting duplicate assay", passed: false }
    ],
    reviewedBy: "Pending Retest Evaluation",
    reviewedDate: "Due 2026-10-18"
  },
  {
    id: "CP-SAMP-2026-0850",
    batchNumber: "LOS-50-B771",
    productName: "Losartan Potassium 50mg Tablets",
    category: "Finished Product",
    mfgDate: "2026-10-08",
    expDate: "2029-10-07",
    batchSize: "450,000 Tablets",
    testType: "Nitrosamine Impurity (NDMA/NDEA) by LC-MS/MS",
    analyst: "Zubair Ahmed",
    analystDept: "QC Instrumental Analysis",
    receivedDate: "2026-10-15",
    targetSpec: "NDMA: < 0.03 ppm | NDEA: < 0.03 ppm | Assay: 95.0-105.0%",
    observedValue: "NDMA: Not Detected (<0.005 ppm) | NDEA: Not Detected",
    status: "Pass/Released",
    statusNotes: "Confirmed absence of mutagenic nitrosamine impurities below LOQ. High compliance score.",
    pharmacopeia: "USP 48 / FDA Guidance",
    storageCondition: "Room Temp (15-30°C)",
    priority: "Urgent",
    tests: [
      { name: "Assay (Potassium Losartan)", spec: "95.0 - 105.0 %", result: "99.4 %", passed: true },
      { name: "NDMA Nitrosamine by LC-MS", spec: "NMT 0.03 ppm", result: "< 0.005 ppm (ND)", passed: true },
      { name: "NDEA Nitrosamine by LC-MS", spec: "NMT 0.03 ppm", result: "< 0.005 ppm (ND)", passed: true },
      { name: "Dissolution (0.1N HCl, 30 min)", spec: "Q ≥ 85.0 %", result: "96.5 %", passed: true }
    ],
    reviewedBy: "Farhan Malik (QA Manager)",
    reviewedDate: "2026-10-16 08:30"
  },
  {
    id: "CP-SAMP-2026-0851",
    batchNumber: "ALC-IPA-70-G12",
    productName: "Sterile Isopropyl Alcohol 70% Spray",
    category: "Cleanroom Disinfectant",
    mfgDate: "2026-10-12",
    expDate: "2028-10-11",
    batchSize: "2,000 Liters",
    testType: "Alcohol Content & Sterility / Endotoxin",
    analyst: "M. Bilal Tariq",
    analystDept: "Microbiology Section",
    receivedDate: "2026-10-14",
    targetSpec: "IPA Content: 68.0% - 72.0% v/v | Sterility: Sterile (0.2µm filtered)",
    observedValue: "IPA Content: 70.3% v/v | Non-volatile residue: 0.002%",
    status: "Pass/Released",
    statusNotes: "Grade A/B Cleanroom sanitization qualified. Gamma irradiated certificate validated.",
    pharmacopeia: "USP Monograph",
    storageCondition: "Flammable cabinet, well ventilated",
    priority: "Normal",
    tests: [
      { name: "Assay of Isopropyl Alcohol", spec: "68.0 - 72.0 % v/v", result: "70.3 % v/v", passed: true },
      { name: "Specific Gravity at 20°C", spec: "0.872 - 0.883", result: "0.877", passed: true },
      { name: "Sterility Filter Integrity", spec: "Bubble point ≥ 3.2 bar", result: "3.5 bar (Passed)", passed: true }
    ],
    reviewedBy: "Farhan Malik (QA Manager)",
    reviewedDate: "2026-10-15 15:45"
  },
  {
    id: "CP-SAMP-2026-0852",
    batchNumber: "AZI-500-B33",
    productName: "Azithromycin 500mg Film-Coated",
    category: "Finished Product",
    mfgDate: "2026-10-14",
    expDate: "2029-10-13",
    batchSize: "200,000 Tablets",
    testType: "Chromatographic Purity & Assay",
    analyst: "Sana Rizvi",
    analystDept: "QC Solid Orals",
    receivedDate: "2026-10-15",
    targetSpec: "Assay: 90.0-110.0% | Any unspecified impurity: ≤ 0.5%",
    observedValue: "Testing In Progress - Chromatogram run 4 of 6",
    status: "In Testing",
    statusNotes: "HPLC gradient sequence running on System Shimadzu-01.",
    pharmacopeia: "USP 48",
    storageCondition: "Room Temp below 25°C",
    priority: "Normal",
    tests: [
      { name: "Identification (HPLC)", spec: "Conforms to standard", result: "Conforms", passed: true },
      { name: "Assay (% Label Claim)", spec: "90.0 - 110.0 %", result: "In Progress (98.9% est)", passed: true },
      { name: "Water Content by KF", spec: "4.0 - 5.0 %", result: "4.4 %", passed: true }
    ],
    reviewedBy: "Pending Completion",
    reviewedDate: "Estimated 2026-10-17"
  },
  {
    id: "CP-SAMP-2026-0853",
    batchNumber: "INS-GLAR-U100",
    productName: "Insulin Glargine 100 IU/mL Cartridge",
    category: "Biotechnology / Parenteral",
    mfgDate: "2026-10-11",
    expDate: "2028-04-10",
    batchSize: "15,000 Cartridges",
    testType: "Bio-Assay, HMWP, Related Proteins by RP-HPLC",
    analyst: "Dr. Ayesha Khan",
    analystDept: "Biologics QC",
    receivedDate: "2026-10-12",
    targetSpec: "Potency: 97.0-103.0% | High Mol Wt Proteins (HMWP): ≤ 0.3%",
    observedValue: "Potency: 99.8% | HMWP: 0.12% | Zinc content: 29.8 µg/mL",
    status: "Pass/Released",
    statusNotes: "Biopharmaceutical release criteria verified. Cold-chain log validated continuous 2-8°C.",
    pharmacopeia: "Ph. Eur. / USP",
    storageCondition: "Cold Chain (2°C - 8°C). Do NOT freeze.",
    priority: "Urgent",
    tests: [
      { name: "Biological Activity / Potency", spec: "97.0 - 103.0 %", result: "99.8 %", passed: true },
      { name: "High Molecular Weight Proteins (SEC)", spec: "NMT 0.3 %", result: "0.12 %", passed: true },
      { name: "A-21 Deamido & Other Related Proteins", spec: "Total NMT 2.5 %", result: "0.95 %", passed: true },
      { name: "Zinc Content", spec: "27.0 - 33.0 µg/mL", result: "29.8 µg/mL", passed: true },
      { name: "Sterility & Endotoxins", spec: "Sterile | < 0.8 EU/100 IU", result: "Complies (<0.1 EU)", passed: true }
    ],
    reviewedBy: "Farhan Malik (QA Manager)",
    reviewedDate: "2026-10-15 12:00"
  }
];

const LAB_INSTRUMENTS = [
  {
    id: "INST-HPLC-01",
    name: "Shimadzu Prominence LC-20AD",
    type: "High-Performance Liquid Chromatograph",
    location: "Instrument Lab 102",
    calibDate: "2026-08-10",
    nextCalib: "2026-11-10",
    status: "Operational",
    calibStatus: "Valid",
    responsible: "Dr. Ayesha Khan"
  },
  {
    id: "INST-GC-03",
    name: "Agilent 7890B Gas Chromatograph",
    type: "Gas Chromatography with FID/MS",
    location: "Instrument Lab 104",
    calibDate: "2026-05-14",
    nextCalib: "2026-11-14",
    status: "Operational",
    calibStatus: "Valid",
    responsible: "Zubair Ahmed"
  },
  {
    id: "INST-BAL-05",
    name: "Mettler Toledo XPE205DR Balance",
    type: "Semi-Micro Analytical Balance (0.01mg)",
    location: "Weighing Room W-02",
    calibDate: "2026-10-01",
    nextCalib: "2026-10-18",
    status: "Due Soon",
    calibStatus: "Due in 48h",
    responsible: "Sana Rizvi"
  },
  {
    id: "INST-DIS-02",
    name: "Hanson Vision G2 Dissolution Tester",
    type: "USP Apparatus I / II Bath with Auto-Sampler",
    location: "Physical Testing Lab",
    calibDate: "2026-07-22",
    nextCalib: "2026-10-22",
    status: "Operational",
    calibStatus: "Valid",
    responsible: "Sana Rizvi"
  },
  {
    id: "INST-KF-01",
    name: "Metrohm 899 Coulometer Karl Fischer",
    type: "Coulometric Moisture Titrator",
    location: "Wet Chemistry 101",
    calibDate: "2026-09-05",
    nextCalib: "2026-12-05",
    status: "Operational",
    calibStatus: "Valid",
    responsible: "Hamza Shafiq"
  },
  {
    id: "INST-UV-04",
    name: "PerkinElmer Lambda 365 UV-Vis",
    type: "Double Beam Spectrophotometer",
    location: "Spectroscopy Lab",
    calibDate: "2026-04-10",
    nextCalib: "2026-10-10",
    status: "Quarantined",
    calibStatus: "Recalibration Required",
    responsible: "Zubair Ahmed"
  }
];

const AUDIT_TRAIL = [
  {
    timestamp: "2026-10-16 10:15:32",
    user: "Dr. Nadeem Akhtar (Head of QA)",
    action: "STATUS_CHANGE",
    target: "CP-SAMP-2026-0848 (Omeprazole)",
    detail: "Status changed from Quarantine to Fail/Rejected following OOS investigation #OOS-2026-042.",
    ip: "192.168.10.45",
    cfrHash: "e8f309a...19d"
  },
  {
    timestamp: "2026-10-16 08:30:11",
    user: "Farhan Malik (QA Manager)",
    action: "COA_GENERATED",
    target: "CP-SAMP-2026-0850 (Losartan Potassium)",
    detail: "Generated official Certificate of Analysis for commercial batch release.",
    ip: "192.168.10.22",
    cfrHash: "9a7b21c...84e"
  },
  {
    timestamp: "2026-10-15 18:00:44",
    user: "Farhan Malik (QA Manager)",
    action: "APPROVAL_RELEASE",
    target: "CP-SAMP-2026-0847 (WFI Loop A)",
    detail: "Electronic signature recorded. Approved for continuous production feed.",
    ip: "192.168.10.22",
    cfrHash: "5b82df1...703"
  },
  {
    timestamp: "2026-10-15 16:22:09",
    user: "Sana Rizvi (QC Analyst)",
    action: "TEST_RESULT_ENTRY",
    target: "CP-SAMP-2026-0844 (Ciprofloxacin HCl)",
    detail: "Dissolution value entered: 73.4%. Triggered automated OOS alert.",
    ip: "192.168.10.78",
    cfrHash: "2c449ee...3b1"
  },
  {
    timestamp: "2026-10-15 11:20:18",
    user: "Farhan Malik (QA Manager)",
    action: "STATUS_CHANGE",
    target: "CP-SAMP-2026-0843 (Amoxicillin Trihydrate)",
    detail: "Approved raw material for factory staging and dispensing.",
    ip: "192.168.10.22",
    cfrHash: "7d0912a...bc4"
  },
  {
    timestamp: "2026-10-14 16:30:55",
    user: "Dr. Ayesha Khan (QC Lead)",
    action: "SAMPLE_REGISTRATION",
    target: "CP-SAMP-2026-0842 (Paracetamol BP)",
    detail: "Sample registered with BP 2026 Monograph testing protocols.",
    ip: "192.168.10.31",
    cfrHash: "1f88a20...09e"
  }
];

// Export to window for vanilla JS application
window.LIMS_STORE = {
  samples: JSON.parse(localStorage.getItem("citi_pharma_samples")) || INITIAL_SAMPLES,
  instruments: LAB_INSTRUMENTS,
  auditTrail: JSON.parse(localStorage.getItem("citi_pharma_audit")) || AUDIT_TRAIL,
  saveSamples: function() {
    localStorage.setItem("citi_pharma_samples", JSON.stringify(this.samples));
  },
  saveAudit: function() {
    localStorage.setItem("citi_pharma_audit", JSON.stringify(this.auditTrail));
  },
  resetToDefaults: function() {
    this.samples = JSON.parse(JSON.stringify(INITIAL_SAMPLES));
    this.auditTrail = JSON.parse(JSON.stringify(AUDIT_TRAIL));
    this.saveSamples();
    this.saveAudit();
  }
};
