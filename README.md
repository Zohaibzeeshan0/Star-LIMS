# Citi Pharma | Laboratory Management System (Star-LIMS)
> **Quality • Precision • Compliance**

A modern, high-precision Laboratory Information Management System (LIMS) engineered for **Citi Pharma**. Built with uncompromising compliance standards (WHO GMP, US FDA 21 CFR Part 11, and ISO/IEC 17025) for chemical, instrumental, and microbiological pharmaceutical batch testing.

---

## 🎨 Official Brand Palette & Design Language

| Color Token | Hex Code | Visual Application |
|---|---|---|
| **Pharma Blue** | `#123B63` | Dark blue navigation sidebar, primary headers, modal titles, elevation elements |
| **Clinical White** | `#F5F8FC` | Clinical workspace backdrop, pristine card containers, clean table surfaces |
| **Teal Green** | `#0F9D8A` | **Pass / Released** status badges, primary action buttons, compliance seals |
| **Warning Amber** | `#E7A23B` | **Quarantine / Retest** status badges, calibration due warnings, pending holds |
| **Critical Red** | `#DC2626` | **Fail / Rejected** status badges, Out-of-Specification (OOS) investigation alerts |

---

## 🔬 Core Capabilities

### 1. Quality Control Executive Dashboard
- **Live Analytical Throughput**: 7-day volume tracking of tested batches across departments.
- **Batch Disposition Ratio**: Visual SVG Donut chart displaying real-time distribution of Pass, Quarantine, Fail, and In-Testing samples.
- **Urgent QA/QC Action Stream**: Instant access to batches requiring immediate review or OOS investigations.

### 2. Analytical Testing Repository & Sample Records
- Multi-criteria filtering by compliance disposition (**Pass/Released**, **Quarantine/Retest**, **Fail/Rejected**, **In Testing**).
- Real-time search by Sample ID, Batch/Lot Number, Product Name, Analyst, and Pharmacopeia.
- Category segmentation: Finished Products, Raw Materials (APIs), Sterile Injectables, Stability Samples, In-Process/Water for Injection (WFI).
- Comprehensive test specification drawer with individual monograph limits and compliance indicators.

### 3. Chain-of-Custody Sample Intake
- Registration interface with pharmacopeial selection (BP 2026, USP 48-NF 43, Ph. Eur. 11.0, In-House).
- Multi-select testing protocol matrix (Assay by HPLC, Dissolution, Water Content KF, Related Impurities, Uniformity, Sterility).
- Automated unique LIMS Sample ID generation with timestamp logging.

### 4. Interactive Results Entry & Automated Specification Evaluation
- Analyst input interface for entering observed values.
- Real-time pass/fail evaluation against monograph boundaries.
- Immediate disposition recalculation with 21 CFR Part 11 audit logging.

### 5. Official Certificate of Analysis (CoA) Engine
- Formatted official letterhead document with Citi Pharma seal.
- Batch parameters, testing results table, analyst digital signature, and QA Director approval stamp.
- **Dedicated Print Stylesheet**: Clean, high-fidelity export directly to A4 / PDF via browser print.
- JSON data export for laboratory ERP integrations.

### 6. Lab Instruments & Calibration Log
- Equipment tracking (HPLC, GC-FID/MS, Analytical Balances, Dissolution Baths, Coulometers, UV-Vis Spectrophotometers).
- Interactive calibration qualification workflow extending certified operational status.

### 7. 21 CFR Part 11 Tamper-Evident Audit Trail
- Traceable chronological log tracking user identity, timestamps, transaction details, and simulated cryptographic checksums.
- Instant CSV dataset export for external regulatory audits.

---

## 🚀 Running the Application Locally

The application is built using standard HTML5, Vanilla CSS, and modern JavaScript, with zero external build dependencies or npm compilation required.

### Option 1: Direct Browser Launch
Simply double click or open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari).

### Option 2: Local HTTP Server
Using Python:
```bash
python -m http.server 8080
```
Then navigate to `http://localhost:8080`.

Using Node / npx:
```bash
npx serve .
```

---

*© 2026 Citi Pharma Laboratories. Quality • Precision • Compliance.*