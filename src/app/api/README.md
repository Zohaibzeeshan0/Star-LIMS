# Citi Pharma LIMS — Backend API & MySQL Integration Architecture

This directory is prepared for Phase 2 backend implementation. The frontend UI has been strictly decoupled and designed with standard TypeScript data interfaces so that a real backend service (MySQL Workbench + Prisma / Drizzle / mysql2) can be plugged in directly with zero frontend refactoring.

---

## 🏛️ Target MySQL Schema Blueprint (Designed for MySQL Workbench)

### 1. `samples` Table
```sql
CREATE TABLE samples (
    id VARCHAR(32) PRIMARY KEY, -- e.g. 'CP-SAMP-2026-0842'
    batch_number VARCHAR(64) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    category ENUM(
        'Packaging Material',
        'Raw Material (API)',
        'Raw Material Retesting',
        'Product Sample (Finished)',
        'Product Sample (In-Process)',
        'Product Sample (Stability)',
        'Sterile Injectable'
    ) NOT NULL,
    pharmacopeia ENUM('BP 2026', 'USP 48-NF 43', 'Ph. Eur. 11.0', 'In-House Validated') NOT NULL,
    mfg_date DATE NOT NULL,
    exp_date DATE NOT NULL,
    retest_date DATE NULL,
    batch_size VARCHAR(128) NOT NULL,
    sample_quantity VARCHAR(128) NOT NULL,
    storage_condition VARCHAR(255) NOT NULL,
    priority ENUM('Normal', 'Urgent', 'Immediate Release') DEFAULT 'Normal',
    analyst_id VARCHAR(64) NOT NULL,
    received_date DATE NOT NULL,
    target_specification TEXT NOT NULL,
    observed_summary TEXT,
    status ENUM('Pass/Released', 'Fail/Rejected', 'Quarantine/Retest', 'In Testing', 'QA Review') DEFAULT 'In Testing',
    status_notes TEXT,
    reviewed_by VARCHAR(128),
    reviewed_date DATETIME,
    oos_investigation_id VARCHAR(64) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_batch (batch_number),
    INDEX idx_status (status),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. `test_parameters` Table
```sql
CREATE TABLE test_parameters (
    id VARCHAR(64) PRIMARY KEY,
    sample_id VARCHAR(32) NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    specification TEXT NOT NULL,
    observed_result TEXT NOT NULL,
    passed BOOLEAN NOT NULL DEFAULT TRUE,
    tested_by VARCHAR(128),
    instrument_id VARCHAR(64),
    tested_at DATETIME,
    FOREIGN KEY (sample_id) REFERENCES samples(id) ON DELETE CASCADE,
    INDEX idx_sample_test (sample_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. `audit_trail` Table (21 CFR Part 11 Compliant)
```sql
CREATE TABLE audit_trail (
    id VARCHAR(64) PRIMARY KEY,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_name VARCHAR(128) NOT NULL,
    action_type VARCHAR(64) NOT NULL,
    target_entity VARCHAR(255) NOT NULL,
    detail TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    cfr_checksum VARCHAR(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 🔌 API Route Map (To Be Implemented in Phase 2)

| Route | Method | Description |
|---|---|---|
| `/api/samples` | `GET` | Paginated search, filter by status and category |
| `/api/samples` | `POST` | Zod-validated sample registration intake |
| `/api/samples/[id]` | `GET` | Fetch single sample with testing parameters |
| `/api/samples/[id]/results` | `PUT` | Record observed results & auto-evaluate disposition |
| `/api/instruments` | `GET` | List instruments and calibration deadlines |
| `/api/instruments/[id]/calibrate` | `POST` | Record calibration check |
| `/api/audit-trail` | `GET` | Chronological tamper-evident audit logs |
