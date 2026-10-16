# Citi Pharma Laboratory Information Management System (Star-LIMS)
## Phase 11: Backend Integration & MySQL Architecture Blueprint

---

### 1. Executive Summary & Architectural Scope

The Citi Pharma LIMS (Star-LIMS) application has completed 10 frontend engineering phases covering sample registration, analytical workflows, testing worklists, QC reviews, OOS flagging, reporting, validation, and responsive UI polish.

**Phase 11 (Backend Integration Preparation)** establishes a clean separation of concerns, decoupling user interface components from mock datasets and preparing the frontend for seamless, zero-rewrite connection to future Next.js Route Handlers and a MySQL relational database.

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER (React 19 / Next.js)                 │
│  Pages (/samples, /testing, /reports) ──> Modals & UI Components (use client)     │
└────────────────────────────────────────┬──────────────────────────────────────────┘
                                         │ invokes
┌────────────────────────────────────────▼──────────────────────────────────────────┐
│                      TYPED SERVICE LAYER (src/lib/services)                       │
│  sampleService  │  packagingService  │  rawMaterialService  │  retestService      │
│  productService │  testingService    │  reportService                             │
└───────────────────┬─────────────────────────────────────────┬─────────────────────┘
                    │ if NEXT_PUBLIC_USE_MOCK=true            │ if false
┌───────────────────▼─────────────────────┐  ┌────────────────▼─────────────────────┐
│       MOCK DATA & IN-MEMORY STORE       │  │             API CLIENT               │
│  src/lib/mock-data/*                    │  │  src/lib/api/client.ts               │
│  - Instant offline demo state           │  │  - Typed HTTP Fetcher                │
│  - Realistic pharmacopeial records      │  │  - Centralized Error Handling        │
│  - Preserves Phase 1-10 interactions    │  │  - cGMP GLP Audit Headers            │
└─────────────────────────────────────────┘  └────────────────┬─────────────────────┘
                                                              │ REST (HTTP/JSON)
                                             ┌────────────────▼─────────────────────┐
                                             │   NEXT.JS ROUTE HANDLERS (Future)    │
                                             │   src/app/api/...                    │
                                             │   - Zod Payload Validation           │
                                             │   - 21 CFR Part 11 Audit Trail Hook  │
                                             └────────────────┬─────────────────────┘
                                                              │ Prisma / mysql2 pool
                                             ┌────────────────▼─────────────────────┐
                                             │      ENTERPRISE MYSQL DATABASE       │
                                             │   InnoDB • UTF8MB4 • ACID Compliant  │
                                             └──────────────────────────────────────┘
```

---

### 2. Separation of Concerns & Modular Decoupling

Prior to Phase 11, data access was directly coupled to UI states and in-memory mock arrays. The codebase has now been structured into four distinct, non-overlapping layers:

| Layer | Directory Path | Responsibility | Client/Server Boundary |
|---|---|---|---|
| **Domain Types** | `src/lib/types/` | Pure TypeScript interfaces representing domain entities (`SampleRecord`, `PackagingSample`, `RawMaterialSample`, `RetestSample`, `ProductSample`, `TestWorklistItem`, `UnifiedReportItem`). | Isomorphic (Safe for both client and server). |
| **API Contracts** | `src/lib/api/contracts/` | Typed request parameters, payload bodies, filter queries, and standardized response envelopes (`ApiResponse<T>`, `PaginatedResponse<T>`). | Isomorphic (Shared contracts between UI, services, and future endpoints). |
| **Service Layer** | `src/lib/services/` | Concrete implementations (`SampleService`, `PackagingService`, etc.) implementing service interfaces (`ISampleService`, `IPackagingService`, etc.). Automatically toggles between in-memory mock mutations and live HTTP calls via `apiConfig.useMock`. | Client-safe service layer. |
| **API Client & Errors** | `src/lib/api/` | `ApiClient` class managing `fetch`, request timeouts, network resilience, and structured pharmaceutical error hierarchies (`ApiError`, `ValidationError`, `NotFoundError`, `UnauthorizedError`). | Client-safe HTTP engine. |
| **Mock Datasets** | `src/lib/mock-data/` | Static initial seeds matching British Pharmacopoeia (BP) and United States Pharmacopeia (USP) specifications. | Client & development data source. |

---

### 3. Planned Next.js Route Handlers Structure

The future backend will utilize Next.js App Router Route Handlers located under `src/app/api/`. Each route will enforce Zod schema validation, authenticate user sessions, record 21 CFR Part 11 audit trails, and interface with the MySQL database.

#### API Endpoints Specification Table

```
src/app/api/
├── samples/
│   ├── route.ts                     # GET (list/filter), POST (register sample)
│   └── [id]/
│       ├── route.ts                 # GET (detail), PUT (update), DELETE
│       └── status/
│           └── route.ts             # PATCH (update disposition & cGMP remarks)
├── packaging/
│   ├── route.ts                     # GET (list/filter), POST (register packaging)
│   └── [id]/
│       ├── route.ts                 # GET (detail), PUT (update)
│       └── status/
│           └── route.ts             # PATCH (update disposition)
├── raw-materials/
│   ├── route.ts                     # GET (list/filter), POST (intake raw material)
│   └── [id]/
│       ├── route.ts                 # GET (detail), PUT (update)
│       └── status/
│           └── route.ts             # PATCH (update disposition)
├── retesting/
│   ├── route.ts                     # GET (surveillance list), POST (schedule retest)
│   └── [id]/
│       ├── route.ts                 # GET (detail), PUT (update)
│       └── status/
│           └── route.ts             # PATCH (update disposition)
├── products/
│   ├── route.ts                     # GET (finished products), POST (batch release intake)
│   └── [id]/
│       ├── route.ts                 # GET (detail), PUT (update)
│       └── status/
│           └── route.ts             # PATCH (update disposition)
├── testing/
│   ├── route.ts                     # GET (QC worklist query)
│   └── [id]/
│       ├── route.ts                 # GET (test dossier)
│       ├── results/
│       │   └── route.ts             # POST (analyst result entry & auto-OOS check)
│       └── review/
│           └── route.ts             # POST (QA manager electronic signature sign-off)
├── reports/
│   ├── route.ts                     # GET (aggregated compliance data & analytics)
│   └── export/
│       └── route.ts                 # POST (export CSV/PDF stream)
└── audit-trail/
    └── route.ts                     # GET (query 21 CFR Part 11 audit logs)
```

#### Detailed Contract Specifications

1. **`GET /api/samples`**
   - **Query Parameters**: `searchQuery`, `category`, `status`, `page`, `pageSize`, `sortBy`, `sortOrder`, `startDate`, `endDate`.
   - **Response**: `ApiResponse<SampleRecord[]>` or `PaginatedResponse<SampleRecord>`.

2. **`POST /api/samples`**
   - **Request Body**: `CreateSampleRequest`
   - **Validation**: Enforced via `src/lib/validations/samples.ts` (`sampleRegistrationSchema`).
   - **Audit Action**: Logs `SAMPLE_REGISTERED` in `audit_trail_log`.

3. **`PATCH /api/samples/[id]/status`**
   - **Request Body**: `StatusChangeRequest<SampleStatus>` (`{ status: "Released", remarks: "Monograph verified" }`).
   - **Audit Action**: Logs previous status, new status, analyst ID, and timestamp.

4. **`POST /api/testing/[id]/results`**
   - **Request Body**: `SaveTestResultsRequest`
   - **Validation**: Ensures all numeric parameters evaluate against `minAllowed` and `maxAllowed`.
   - **Business Logic**: If any observed result violates monograph limits, automatically set `isOOS = true` and change status to `Out of Specification`.

5. **`POST /api/testing/[id]/review`**
   - **Request Body**: `TestReviewRequest`
   - **Compliance Rule**: Requires `electronicSignatureAcknowledged: true`, QA reviewer identity, and timestamp.

---

### 4. Enterprise MySQL Relational Database Schema

The production database is designed for MySQL 8.0+ using the `InnoDB` storage engine with `utf8mb4_unicode_ci` collation. It provides full ACID compliance, foreign key cascade protections, and immutable audit logs.

#### MySQL DDL Schema Definition

```sql
-- =============================================================================
-- CITI PHARMA STAR-LIMS DATABASE INITIALIZATION
-- Engine: InnoDB | Collation: utf8mb4_unicode_ci | Compliance: 21 CFR Part 11
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `citipharma_lims`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `citipharma_lims`;

-- -----------------------------------------------------------------------------
-- 1. USERS & ANALYSTS TABLE (RBAC & Authentication)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `lims_users` (
  `id` VARCHAR(36) PRIMARY KEY,
  `employee_id` VARCHAR(30) NOT NULL UNIQUE,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `department` ENUM('QC', 'QA', 'Production', 'Microbiology', 'Administration') NOT NULL,
  `role` ENUM('Analyst', 'Senior Analyst', 'QC Supervisor', 'QA Manager', 'Administrator') NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_dept` (`department`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 2. MASTER SAMPLE REGISTRATION TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `samples` (
  `id` VARCHAR(50) PRIMARY KEY, -- e.g. 'CP-REG-2026-0001'
  `batch_number` VARCHAR(50) NOT NULL,
  `product_name` VARCHAR(200) NOT NULL,
  `category` ENUM(
    'Raw Material (API)',
    'Excipient',
    'Packaging Material',
    'Finished Pharmaceutical Product',
    'In-Process Control (IPQC)',
    'Stability Sample',
    'Purified Water'
  ) NOT NULL,
  `pharmacopeia` VARCHAR(100) NOT NULL,
  `mfg_date` DATE NOT NULL,
  `exp_date` DATE NOT NULL,
  `retest_date` DATE NULL,
  `batch_size` VARCHAR(50) NOT NULL,
  `sample_quantity` VARCHAR(50) NOT NULL,
  `storage_condition` VARCHAR(100) NOT NULL,
  `priority` ENUM('Routine', 'Urgent', 'High Priority', 'Emergency / Recall') NOT NULL DEFAULT 'Routine',
  `analyst_id` VARCHAR(36) NULL,
  `analyst_name` VARCHAR(100) NOT NULL,
  `received_date` DATE NOT NULL,
  `target_specification` VARCHAR(255) NOT NULL,
  `observed_summary` TEXT NULL,
  `status` ENUM('In Testing', 'Quarantine', 'Released', 'Rejected', 'Retest') NOT NULL DEFAULT 'In Testing',
  `status_notes` TEXT NULL,
  `reviewed_by` VARCHAR(100) NULL,
  `reviewed_date` VARCHAR(50) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_samples_batch` (`batch_number`),
  INDEX `idx_samples_status` (`status`),
  INDEX `idx_samples_category` (`category`),
  INDEX `idx_samples_priority` (`priority`),
  INDEX `idx_samples_dates` (`received_date`, `exp_date`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 3. PACKAGING SAMPLES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `packaging_samples` (
  `id` VARCHAR(50) PRIMARY KEY, -- e.g. 'CP-PKG-2026-0101'
  `material_code` VARCHAR(50) NOT NULL,
  `material_name` VARCHAR(200) NOT NULL,
  `batch_number` VARCHAR(50) NOT NULL,
  `packaging_type` ENUM('Primary Packaging', 'Secondary Packaging', 'Tertiary Packaging') NOT NULL,
  `supplier` VARCHAR(150) NOT NULL,
  `received_date` DATE NOT NULL,
  `quantity` VARCHAR(50) NOT NULL,
  `specification_ref` VARCHAR(100) NOT NULL,
  `storage_location` VARCHAR(100) NOT NULL,
  `status` ENUM('Released', 'Quarantine', 'Rejected', 'Retest') NOT NULL DEFAULT 'Quarantine',
  `analyst` VARCHAR(100) NOT NULL,
  `remarks` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_pkg_batch` (`batch_number`),
  INDEX `idx_pkg_status` (`status`),
  INDEX `idx_pkg_supplier` (`supplier`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 4. RAW MATERIALS (APIs & EXCIPIENTS) TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `raw_materials` (
  `id` VARCHAR(50) PRIMARY KEY, -- e.g. 'CP-RAW-2026-0201'
  `material_code` VARCHAR(50) NOT NULL,
  `material_name` VARCHAR(200) NOT NULL,
  `batch_number` VARCHAR(50) NOT NULL,
  `category` ENUM('Active Pharmaceutical Ingredient (API)', 'Excipient', 'Solvent / Reagent') NOT NULL,
  `supplier` VARCHAR(150) NOT NULL,
  `manufacturer` VARCHAR(150) NOT NULL,
  `pharmacopeia` VARCHAR(100) NOT NULL,
  `received_date` DATE NOT NULL,
  `mfg_date` DATE NOT NULL,
  `exp_date` DATE NOT NULL,
  `retest_date` DATE NOT NULL,
  `quantity` VARCHAR(50) NOT NULL,
  `storage_location` VARCHAR(100) NOT NULL,
  `status` ENUM('Quarantine', 'Released', 'Rejected', 'Under Retest', 'Reviewed') NOT NULL DEFAULT 'Quarantine',
  `analyst` VARCHAR(100) NOT NULL,
  `remarks` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_raw_batch` (`batch_number`),
  INDEX `idx_raw_status` (`status`),
  INDEX `idx_raw_retest` (`retest_date`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 5. RETESTING & STABILITY SURVEILLANCE TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `retest_surveillance` (
  `id` VARCHAR(50) PRIMARY KEY, -- e.g. 'CP-RET-2026-0301'
  `material_name` VARCHAR(200) NOT NULL,
  `material_code` VARCHAR(50) NOT NULL,
  `batch_number` VARCHAR(50) NOT NULL,
  `original_mfg_date` DATE NOT NULL,
  `original_exp_date` DATE NOT NULL,
  `scheduled_retest_date` DATE NOT NULL,
  `retest_cycle_number` INT NOT NULL DEFAULT 1,
  `status` ENUM('Due for Retest', 'Under Retest', 'Extended', 'Expired / Rejected') NOT NULL,
  `assigned_analyst` VARCHAR(100) NOT NULL,
  `storage_warehouse` VARCHAR(100) NOT NULL,
  `specification_reference` VARCHAR(100) NOT NULL,
  `extension_period_months` INT NULL,
  `new_extended_date` DATE NULL,
  `remarks` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_retest_scheduled` (`scheduled_retest_date`),
  INDEX `idx_retest_status` (`status`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 6. FINISHED PRODUCTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_samples` (
  `id` VARCHAR(50) PRIMARY KEY, -- e.g. 'CP-PRD-2026-0501'
  `product_name` VARCHAR(200) NOT NULL,
  `product_code` VARCHAR(50) NOT NULL,
  `batch_number` VARCHAR(50) NOT NULL,
  `dosage_form` ENUM('Tablet', 'Capsule', 'Liquid Syrup', 'Injectable Vial', 'Suspension', 'Dry Powder') NOT NULL,
  `strength` VARCHAR(50) NOT NULL,
  `pack_size` VARCHAR(50) NOT NULL,
  `mfg_date` DATE NOT NULL,
  `exp_date` DATE NOT NULL,
  `batch_size` VARCHAR(50) NOT NULL,
  `storage_condition` VARCHAR(100) NOT NULL,
  `status` ENUM('Under Testing', 'Quarantine', 'Released', 'Rejected', 'Hold') NOT NULL DEFAULT 'Under Testing',
  `analyst` VARCHAR(100) NOT NULL,
  `qa_release_officer` VARCHAR(100) NULL,
  `market_authorization_num` VARCHAR(50) NOT NULL,
  `remarks` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_prd_batch` (`batch_number`),
  INDEX `idx_prd_status` (`status`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 7. QC LABORATORY TESTING WORKLIST TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `test_worklist` (
  `id` VARCHAR(50) PRIMARY KEY, -- e.g. 'CP-TST-2026-001'
  `sample_id` VARCHAR(50) NOT NULL,
  `sample_category` VARCHAR(100) NOT NULL,
  `material_or_product` VARCHAR(200) NOT NULL,
  `material_or_product_code` VARCHAR(50) NOT NULL,
  `batch_number` VARCHAR(50) NOT NULL,
  `test_type` VARCHAR(100) NOT NULL,
  `assigned_analyst` VARCHAR(100) NOT NULL,
  `due_date` DATE NOT NULL,
  `testing_date` DATE NULL,
  `instrument_reference` VARCHAR(150) NOT NULL,
  `status` ENUM('Not Started', 'In Progress', 'Completed', 'Pending Review', 'Reviewed', 'Out of Specification') NOT NULL DEFAULT 'Not Started',
  `is_oos` BOOLEAN NOT NULL DEFAULT FALSE,
  `observations` TEXT NULL,
  `analyst_comments` TEXT NULL,
  `reviewed_by` VARCHAR(100) NULL,
  `review_date` DATE NULL,
  `review_comments` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_tst_sample` (`sample_id`),
  INDEX `idx_tst_analyst` (`assigned_analyst`),
  INDEX `idx_tst_status` (`status`),
  INDEX `idx_tst_oos` (`is_oos`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 8. TEST PARAMETERS TABLE (Child of Test Worklist)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `test_parameters` (
  `id` VARCHAR(50) PRIMARY KEY,
  `worklist_id` VARCHAR(50) NOT NULL,
  `parameter_name` VARCHAR(150) NOT NULL,
  `specification` VARCHAR(150) NOT NULL,
  `unit` VARCHAR(30) NOT NULL,
  `input_type` ENUM('numeric', 'text', 'selectable') NOT NULL,
  `min_allowed` DECIMAL(12, 4) NULL,
  `max_allowed` DECIMAL(12, 4) NULL,
  `selectable_options_json` JSON NULL,
  `observed_result` VARCHAR(100) NOT NULL DEFAULT '',
  `status` ENUM('Pass', 'Fail', 'Pending') NOT NULL DEFAULT 'Pending',
  `instrument_used` VARCHAR(150) NOT NULL DEFAULT '',
  `analyst_notes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`worklist_id`) REFERENCES `test_worklist`(`id`) ON DELETE CASCADE,
  INDEX `idx_prm_worklist` (`worklist_id`),
  INDEX `idx_prm_status` (`status`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 9. 21 CFR PART 11 IMMUTABLE AUDIT TRAIL LOG
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `audit_trail_log` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `user_id` VARCHAR(36) NOT NULL,
  `user_name` VARCHAR(100) NOT NULL,
  `action` VARCHAR(100) NOT NULL, -- e.g. 'STATUS_CHANGE', 'RESULT_ENTRY', 'QA_SIGNOFF'
  `entity_name` VARCHAR(50) NOT NULL, -- e.g. 'samples', 'test_worklist'
  `entity_id` VARCHAR(50) NOT NULL,
  `old_values_json` JSON NULL,
  `new_values_json` JSON NULL,
  `reason_for_change` TEXT NOT NULL,
  `client_ip` VARCHAR(45) NOT NULL,
  `user_agent` VARCHAR(255) NOT NULL,
  `hmac_signature` VARCHAR(64) NOT NULL, -- SHA-256 tamper detection
  INDEX `idx_audit_entity` (`entity_name`, `entity_id`),
  INDEX `idx_audit_user` (`user_id`),
  INDEX `idx_audit_timestamp` (`timestamp`)
) ENGINE=InnoDB;
```

---

### 5. 21 CFR Part 11 Compliance & Audit Architecture

In pharmaceutical manufacturing, laboratory records must comply with FDA 21 CFR Part 11 and WHO GLP standards:

1. **Electronic Signatures**:
   - Every review or status transition requires active user affirmation (`electronicSignatureAcknowledged: true`), user ID, and authenticated session credentials.
2. **Immutable Audit Logging**:
   - `audit_trail_log` table is append-only.
   - Database user permissions for the application pool will strictly exclude `UPDATE` or `DELETE` on `audit_trail_log`.
   - Each audit entry computes an HMAC-SHA256 signature combining `timestamp`, `user_id`, `action`, `old_values_json`, and `new_values_json` with a server-held secret key.
3. **Reason for Change**:
   - All sample and QC status overrides (such as Quarantining or Rejection) mandate a non-empty `remarks` / `reason_for_change` field.

---

### 6. Server/Client Isolation Guarantee

To avoid importing server-only modules into browser-rendered React components:

- **Browser Bundles**: The UI code (`use client`) only imports domain types (`src/lib/types/`), API contracts (`src/lib/api/contracts/`), and the client-safe service layer (`src/lib/services/`).
- **Zero Server-Only Leakage**: Database connectors (`mysql2`, `prisma`, or `@prisma/client`), native OS packages, or secrets (`DATABASE_URL`, `JWT_SECRET`) reside exclusively inside `src/app/api/...` route handlers or a future `src/lib/server/` directory.
- Next.js build-time bundling statically rejects server-only imports if referenced from `"use client"` modules.

---

### 7. Step-by-Step Backend Integration & Migration Guide

When ready to implement the real backend:

1. **Database Setup**:
   - Run the MySQL DDL script on the production MySQL server.
   - Seed monograph master specifications and test types.
2. **ORM or Connection Pool Installation**:
   - Install `prisma` (`npx prisma init`) or `mysql2` (`npm install mysql2`).
3. **Route Handlers Implementation**:
   - Create Route Handlers under `src/app/api/` matching the endpoints documented above.
   - Connect Route Handlers to the database via transactional queries.
4. **Environment Configuration**:
   - Set `NEXT_PUBLIC_USE_MOCK=false` in `.env.local`.
   - Provide valid `DATABASE_URL` and `JWT_SECRET`.
5. **Zero-Frontend Rewrite**:
   - Because all components invoke the typed service layer, toggling `NEXT_PUBLIC_USE_MOCK=false` immediately directs all frontend requests to the live Route Handlers via `ApiClient`.

---
*Citi Pharma LIMS Star-LIMS Architecture Blueprint • Certified for GLP / cGMP Modernization*
