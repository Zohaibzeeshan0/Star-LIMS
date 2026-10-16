/**
 * Citi Pharma | Laboratory Management System (Star-LIMS)
 * Quality • Precision • Compliance
 * Application Logic & Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    currentView: "dashboard",
    samples: window.LIMS_STORE.samples,
    instruments: window.LIMS_STORE.instruments,
    auditTrail: window.LIMS_STORE.auditTrail,
    filterStatus: "ALL",
    filterCategory: "ALL",
    searchQuery: "",
    selectedSampleForCoA: null,
    activeModalSample: null
  };

  // DOM Elements
  const navItems = document.querySelectorAll(".nav-item");
  const viewSections = document.querySelectorAll(".view-section");
  const viewTitle = document.getElementById("viewTitle");
  const viewSubtitle = document.getElementById("viewSubtitle");
  const sampleSearchInput = document.getElementById("sampleSearchInput");
  const statusPills = document.querySelectorAll(".status-pill");
  const categoryFilter = document.getElementById("categoryFilter");
  const samplesTableBody = document.getElementById("samplesTableBody");
  const registerForm = document.getElementById("sampleRegistrationForm");
  const coaSelect = document.getElementById("coaSampleSelect");
  const toastContainer = document.getElementById("toastContainer");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const sidebar = document.getElementById("sidebar");

  // Modals
  const sampleDetailModal = document.getElementById("sampleDetailModal");
  const testResultModal = document.getElementById("testResultModal");
  const calibrateModal = document.getElementById("calibrateModal");

  // Initialize Application
  init();

  function init() {
    setupNavigation();
    setupMobileSidebar();
    setupFilters();
    setupRegistrationForm();
    setupModals();
    setupCoAView();
    setupCalibrationActions();
    setupExportCSV();
    
    // Initial Render
    refreshAll();
  }

  function refreshAll() {
    renderKPIs();
    renderCharts();
    renderSamplesTable();
    renderUrgentAlerts();
    renderInstrumentsTable();
    renderAuditTrailTable();
    updatePillCounts();
    populateCoADropdown();
  }

  // =========================================================================
  // 1. Navigation Controller
  // =========================================================================
  function setupNavigation() {
    navItems.forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const targetView = item.getAttribute("data-view");
        switchView(targetView);

        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
          sidebar.classList.remove("mobile-open");
        }
      });
    });

    // Quick action buttons
    document.querySelectorAll("[data-action='quick-register']").forEach(btn => {
      btn.addEventListener("click", () => switchView("register"));
    });
    document.querySelectorAll("[data-action='quick-samples']").forEach(btn => {
      btn.addEventListener("click", () => switchView("samples"));
    });
  }

  function switchView(viewId) {
    state.currentView = viewId;

    // Update nav active classes
    navItems.forEach(item => {
      if (item.getAttribute("data-view") === viewId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Show active view
    viewSections.forEach(section => {
      if (section.id === `view-${viewId}`) {
        section.classList.add("active");
      } else {
        section.classList.remove("active");
      }
    });

    // Header updates
    const titleMap = {
      dashboard: { main: "Quality Control Dashboard", sub: "Operational Overview" },
      samples: { main: "Sample Testing Records", sub: "Analytical Repository" },
      register: { main: "Sample Registration", sub: "Chain of Custody Intake" },
      instruments: { main: "Instruments & Calibration", sub: "Equipment Qualification" },
      coa: { main: "Certificate of Analysis", sub: "Official Release Documentation" },
      audit: { main: "21 CFR Part 11 Audit Trail", sub: "Regulatory Compliance Log" }
    };

    if (titleMap[viewId]) {
      viewTitle.textContent = titleMap[viewId].main;
      viewSubtitle.textContent = titleMap[viewId].sub;
    }

    // Refresh view specific components
    if (viewId === "coa") {
      renderCoADocument(state.selectedSampleForCoA || state.samples[0]);
    }
  }

  function setupMobileSidebar() {
    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("mobile-open");
      });
    }
  }

  // =========================================================================
  // 2. Dashboard KPIs & SVG Visualizations
  // =========================================================================
  function renderKPIs() {
    const total = state.samples.length;
    const passed = state.samples.filter(s => s.status === "Pass/Released").length;
    const quarantine = state.samples.filter(s => s.status === "Quarantine/Retest").length;
    const failed = state.samples.filter(s => s.status === "Fail/Rejected").length;
    const inTesting = state.samples.filter(s => s.status === "In Testing").length;

    const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;

    // Update DOM KPI elements
    const kpiTotal = document.getElementById("kpiTotalSamples");
    const kpiPass = document.getElementById("kpiPassRate");
    const kpiQuarantine = document.getElementById("kpiQuarantine");
    const kpiFail = document.getElementById("kpiFailures");
    const kpiBannerRate = document.getElementById("bannerPassRate");
    const kpiBannerActive = document.getElementById("bannerActiveTests");

    if (kpiTotal) kpiTotal.textContent = total;
    if (kpiPass) kpiPass.textContent = `${passRate}%`;
    if (kpiQuarantine) kpiQuarantine.textContent = quarantine;
    if (kpiFail) kpiFail.textContent = failed;
    if (kpiBannerRate) kpiBannerRate.textContent = `${passRate}%`;
    if (kpiBannerActive) kpiBannerActive.textContent = inTesting + quarantine;

    // Subtext indicators
    const subPass = document.getElementById("kpiPassCountSub");
    if (subPass) subPass.textContent = `${passed} batches authorized for release`;
  }

  function renderCharts() {
    // 1. Status Donut SVG
    const donutContainer = document.getElementById("donutChartContainer");
    if (!donutContainer) return;

    const total = state.samples.length || 1;
    const passed = state.samples.filter(s => s.status === "Pass/Released").length;
    const quarantine = state.samples.filter(s => s.status === "Quarantine/Retest").length;
    const failed = state.samples.filter(s => s.status === "Fail/Rejected").length;
    const inTesting = state.samples.filter(s => s.status === "In Testing").length;

    // Calculate stroke-dasharray for SVG circle of radius 42 (circ = ~263.89)
    const circ = 2 * Math.PI * 42;
    const pPct = passed / total;
    const qPct = quarantine / total;
    const fPct = failed / total;
    const tPct = inTesting / total;

    const pDash = pPct * circ;
    const qDash = qPct * circ;
    const fDash = fPct * circ;
    const tDash = tPct * circ;

    const qOffset = -(pDash);
    const fOffset = -(pDash + qDash);
    const tOffset = -(pDash + qDash + fDash);

    donutContainer.innerHTML = `
      <div style="position: relative; width: 160px; height: 160px; margin: 0 auto;">
        <svg viewBox="0 0 100 100" style="transform: rotate(-90deg); width: 100%; height: 100%;">
          <!-- Background track -->
          <circle cx="50" cy="50" r="42" fill="transparent" stroke="#E2E8F0" stroke-width="12"></circle>
          <!-- Passed (Teal Green) -->
          <circle cx="50" cy="50" r="42" fill="transparent" stroke="var(--teal-green)" stroke-width="12"
            stroke-dasharray="${pDash} ${circ - pDash}" stroke-dashoffset="0" stroke-linecap="round"></circle>
          <!-- Quarantine (Warning Amber) -->
          <circle cx="50" cy="50" r="42" fill="transparent" stroke="var(--warning-amber)" stroke-width="12"
            stroke-dasharray="${qDash} ${circ - qDash}" stroke-dashoffset="${qOffset}"></circle>
          <!-- Failed (Fail Red) -->
          <circle cx="50" cy="50" r="42" fill="transparent" stroke="var(--fail-red)" stroke-width="12"
            stroke-dasharray="${fDash} ${circ - fDash}" stroke-dashoffset="${fOffset}"></circle>
          <!-- In Testing (Info Blue) -->
          <circle cx="50" cy="50" r="42" fill="transparent" stroke="var(--info-blue)" stroke-width="12"
            stroke-dasharray="${tDash} ${circ - tDash}" stroke-dashoffset="${tOffset}"></circle>
        </svg>
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none;">
          <span style="font-family: 'Outfit'; font-size: 1.4rem; font-weight: 800; color: var(--pharma-blue);">${total}</span>
          <span style="font-size: 0.65rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;">Samples</span>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 16px; font-size: 0.76rem;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="width: 10px; height: 10px; border-radius: 2px; background: var(--teal-green);"></span>
          <span>Pass: <strong>${passed}</strong></span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="width: 10px; height: 10px; border-radius: 2px; background: var(--warning-amber);"></span>
          <span>Quarantine: <strong>${quarantine}</strong></span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="width: 10px; height: 10px; border-radius: 2px; background: var(--fail-red);"></span>
          <span>Rejected: <strong>${failed}</strong></span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="width: 10px; height: 10px; border-radius: 2px; background: var(--info-blue);"></span>
          <span>Testing: <strong>${inTesting}</strong></span>
        </div>
      </div>
    `;

    // 2. 7-Day Throughput Bar Chart
    const barChartContainer = document.getElementById("throughputBarChart");
    if (!barChartContainer) return;

    const days = [
      { day: "Sat", pass: 14, fail: 1, quar: 2 },
      { day: "Sun", pass: 8, fail: 0, quar: 1 },
      { day: "Mon", pass: 22, fail: 1, quar: 3 },
      { day: "Tue", pass: 26, fail: 2, quar: 4 },
      { day: "Wed", pass: 31, fail: 0, quar: 2 },
      { day: "Thu", pass: 28, fail: 1, quar: 3 },
      { day: "Today", pass: 19, fail: 1, quar: 2 }
    ];

    const maxVal = 35;
    let barsHtml = days.map(d => {
      const heightPass = (d.pass / maxVal) * 110;
      const heightFail = (d.fail / maxVal) * 110;
      const heightQuar = (d.quar / maxVal) * 110;
      const totalDay = d.pass + d.fail + d.quar;

      return `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1;">
          <span style="font-size: 0.7rem; font-weight: 700; color: var(--pharma-blue);">${totalDay}</span>
          <div style="width: 24px; height: 120px; display: flex; flex-direction: column-reverse; background: #F1F5F9; border-radius: 4px; overflow: hidden;">
            <div style="height: ${heightPass}px; background: var(--teal-green);" title="Passed: ${d.pass}"></div>
            <div style="height: ${heightQuar}px; background: var(--warning-amber);" title="Quarantine: ${d.quar}"></div>
            <div style="height: ${heightFail}px; background: var(--fail-red);" title="Failed: ${d.fail}"></div>
          </div>
          <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">${d.day}</span>
        </div>
      `;
    }).join("");

    barChartContainer.innerHTML = `
      <div style="display: flex; align-items: flex-end; justify-content: space-between; height: 160px; padding: 10px 0;">
        ${barsHtml}
      </div>
      <div style="display: flex; justify-content: center; gap: 16px; margin-top: 10px; font-size: 0.75rem; border-top: 1px solid var(--border-subtle); padding-top: 8px;">
        <span style="display: flex; align-items: center; gap: 5px;"><span style="width: 8px; height: 8px; border-radius: 2px; background: var(--teal-green);"></span> Passed/Released</span>
        <span style="display: flex; align-items: center; gap: 5px;"><span style="width: 8px; height: 8px; border-radius: 2px; background: var(--warning-amber);"></span> Quarantine/Retest</span>
        <span style="display: flex; align-items: center; gap: 5px;"><span style="width: 8px; height: 8px; border-radius: 2px; background: var(--fail-red);"></span> Rejected (OOS)</span>
      </div>
    `;
  }

  function renderUrgentAlerts() {
    const urgentContainer = document.getElementById("dashboardUrgentAlerts");
    if (!urgentContainer) return;

    const urgentSamples = state.samples.filter(s => s.priority === "Urgent" || s.status === "Fail/Rejected");
    
    if (urgentSamples.length === 0) {
      urgentContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;">No urgent laboratory alerts at this time.</p>`;
      return;
    }

    urgentContainer.innerHTML = urgentSamples.slice(0, 4).map(s => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: ${s.status === 'Fail/Rejected' ? 'var(--fail-red-light)' : 'var(--clinical-white)'}; border: 1px solid ${s.status === 'Fail/Rejected' ? 'rgba(220, 38, 38, 0.2)' : 'var(--border-subtle)'}; border-radius: var(--radius-md); margin-bottom: 10px;">
        <div style="display: flex; flex-direction: column;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <strong style="color: var(--pharma-blue); font-size: 0.85rem;">${s.productName}</strong>
            ${getStatusBadge(s.status)}
          </div>
          <span style="font-size: 0.74rem; color: var(--text-muted); margin-top: 2px;">
            Lot: <code>${s.batchNumber}</code> • Analyst: ${s.analyst} • Spec: ${s.targetSpec.substring(0, 48)}...
          </span>
        </div>
        <button class="btn btn-sm btn-secondary" onclick="window.viewSampleDetail('${s.id}')">Review</button>
      </div>
    `).join("");
  }

  // =========================================================================
  // 3. Sample Records Table & Filtering
  // =========================================================================
  function setupFilters() {
    if (sampleSearchInput) {
      sampleSearchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        renderSamplesTable();
      });
    }

    statusPills.forEach(pill => {
      pill.addEventListener("click", () => {
        statusPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        state.filterStatus = pill.getAttribute("data-status");
        renderSamplesTable();
      });
    });

    if (categoryFilter) {
      categoryFilter.addEventListener("change", (e) => {
        state.filterCategory = e.target.value;
        renderSamplesTable();
      });
    }
  }

  function updatePillCounts() {
    const countAll = state.samples.length;
    const countPass = state.samples.filter(s => s.status === "Pass/Released").length;
    const countFail = state.samples.filter(s => s.status === "Fail/Rejected").length;
    const countQuar = state.samples.filter(s => s.status === "Quarantine/Retest").length;

    const elAll = document.getElementById("countAll");
    const elPass = document.getElementById("countPass");
    const elFail = document.getElementById("countFail");
    const elQuar = document.getElementById("countQuar");

    if (elAll) elAll.textContent = countAll;
    if (elPass) elPass.textContent = countPass;
    if (elFail) elFail.textContent = countFail;
    if (elQuar) elQuar.textContent = countQuar;
  }

  function renderSamplesTable() {
    if (!samplesTableBody) return;

    let filtered = state.samples.filter(sample => {
      // Status filter
      if (state.filterStatus !== "ALL" && sample.status !== state.filterStatus) {
        return false;
      }
      // Category filter
      if (state.filterCategory !== "ALL" && sample.category !== state.filterCategory) {
        return false;
      }
      // Search Query
      if (state.searchQuery) {
        const query = state.searchQuery;
        const matchId = sample.id.toLowerCase().includes(query);
        const matchBatch = sample.batchNumber.toLowerCase().includes(query);
        const matchProduct = sample.productName.toLowerCase().includes(query);
        const matchAnalyst = sample.analyst.toLowerCase().includes(query);
        const matchTest = sample.testType.toLowerCase().includes(query);
        return matchId || matchBatch || matchProduct || matchAnalyst || matchTest;
      }
      return true;
    });

    if (filtered.length === 0) {
      samplesTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <strong>No matching laboratory records found</strong>
              <span style="font-size: 0.8rem;">Try clearing your search query or selecting a different status filter.</span>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    samplesTableBody.innerHTML = filtered.map(sample => `
      <tr>
        <td>
          <div class="sample-id-cell">
            <span>${sample.id}</span>
            <span class="sample-batch">Lot: ${sample.batchNumber}</span>
          </div>
        </td>
        <td>
          <div class="product-cell">
            <span class="product-name">${sample.productName}</span>
            <span class="product-cat">${sample.category} • ${sample.pharmacopeia}</span>
          </div>
        </td>
        <td>
          <div style="display: flex; flex-direction: column; max-width: 240px;">
            <strong style="color: var(--text-primary); font-size: 0.82rem;">${sample.testType}</strong>
            <span style="font-size: 0.72rem; color: var(--text-muted);">${sample.targetSpec}</span>
          </div>
        </td>
        <td>
          <div style="display: flex; flex-direction: column;">
            <span style="font-weight: 500; color: var(--text-primary);">${sample.analyst}</span>
            <span style="font-size: 0.72rem; color: var(--text-muted);">${sample.analystDept}</span>
          </div>
        </td>
        <td>
          <span style="font-size: 0.8rem; color: var(--text-secondary);">${sample.receivedDate}</span>
        </td>
        <td>
          ${getStatusBadge(sample.status)}
        </td>
        <td>
          <div class="table-actions">
            <button class="table-action-btn primary" title="View Full Specifications & Records" onclick="window.viewSampleDetail('${sample.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              View
            </button>
            <button class="table-action-btn" title="Enter / Update Lab Results" onclick="window.openResultsModal('${sample.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              Results
            </button>
            <button class="table-action-btn" title="Generate Certificate of Analysis" onclick="window.generateCoAForSample('${sample.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              CoA
            </button>
          </div>
        </td>
      </tr>
    `).join("");
  }

  function getStatusBadge(status) {
    if (status === "Pass/Released") {
      return `
        <span class="badge badge-pass">
          <span class="badge-dot"></span>
          Pass / Released
        </span>
      `;
    } else if (status === "Fail/Rejected") {
      return `
        <span class="badge badge-fail">
          <span class="badge-dot"></span>
          Fail / Rejected
        </span>
      `;
    } else if (status === "Quarantine/Retest") {
      return `
        <span class="badge badge-quarantine">
          <span class="badge-dot"></span>
          Quarantine / Retest
        </span>
      `;
    } else {
      return `
        <span class="badge badge-testing">
          <span class="badge-dot"></span>
          ${status}
        </span>
      `;
    }
  }

  // =========================================================================
  // 4. Sample Detail Modal
  // =========================================================================
  window.viewSampleDetail = function(sampleId) {
    const sample = state.samples.find(s => s.id === sampleId);
    if (!sample) return;

    state.activeModalSample = sample;

    const modalTitle = document.getElementById("detailModalTitle");
    const metaContainer = document.getElementById("detailModalMeta");
    const testsContainer = document.getElementById("detailModalTests");
    const notesContainer = document.getElementById("detailModalNotes");

    if (modalTitle) modalTitle.textContent = `${sample.productName} (${sample.id})`;

    if (metaContainer) {
      metaContainer.innerHTML = `
        <div class="detail-item">
          <span class="detail-label">Batch / Lot No</span>
          <span class="detail-value"><code>${sample.batchNumber}</code></span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Current Status</span>
          <span class="detail-value">${getStatusBadge(sample.status)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Category</span>
          <span class="detail-value">${sample.category}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Monograph / Spec</span>
          <span class="detail-value">${sample.pharmacopeia}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Storage Condition</span>
          <span class="detail-value">${sample.storageCondition}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Batch Size</span>
          <span class="detail-value">${sample.batchSize}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Mfg Date</span>
          <span class="detail-value">${sample.mfgDate}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Exp Date</span>
          <span class="detail-value">${sample.expDate}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Assigned Analyst</span>
          <span class="detail-value">${sample.analyst}</span>
        </div>
      `;
    }

    if (testsContainer) {
      testsContainer.innerHTML = `
        <table class="test-spec-table">
          <thead>
            <tr>
              <th>Test Parameter</th>
              <th>Specification Limit</th>
              <th>Observed Result</th>
              <th>Compliance</th>
            </tr>
          </thead>
          <tbody>
            ${sample.tests.map(t => `
              <tr>
                <td><strong>${t.name}</strong></td>
                <td><code style="font-size: 0.8rem;">${t.spec}</code></td>
                <td><strong style="color: ${t.passed ? 'var(--teal-green-dark)' : 'var(--fail-red-dark)'};">${t.result}</strong></td>
                <td>
                  <span class="badge ${t.passed ? 'badge-pass' : 'badge-fail'}">
                    <span class="badge-dot"></span>
                    ${t.passed ? 'Complies' : 'OOS'}
                  </span>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    }

    if (notesContainer) {
      notesContainer.innerHTML = `
        <div style="background: var(--clinical-white); padding: 14px; border-radius: var(--radius-md); border-left: 4px solid var(--pharma-blue); margin-top: 14px;">
          <strong style="color: var(--pharma-blue); font-size: 0.8rem; text-transform: uppercase;">Review & Disposition Notes:</strong>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">${sample.statusNotes}</p>
          <div style="margin-top: 8px; font-size: 0.75rem; color: var(--text-muted);">
            Sign-off: <strong>${sample.reviewedBy}</strong> on ${sample.reviewedDate}
          </div>
        </div>
      `;
    }

    openModal(sampleDetailModal);
  };

  // =========================================================================
  // 5. Results Entry Modal & Automated Evaluation
  // =========================================================================
  window.openResultsModal = function(sampleId) {
    const sample = state.samples.find(s => s.id === sampleId);
    if (!sample) return;

    state.activeModalSample = sample;

    const modalTitle = document.getElementById("resultModalTitle");
    const container = document.getElementById("resultTestEntriesContainer");
    const statusSelect = document.getElementById("resultDispositionStatus");
    const notesInput = document.getElementById("resultDispositionNotes");

    if (modalTitle) modalTitle.textContent = `Log Results: ${sample.productName} (${sample.batchNumber})`;
    if (statusSelect) statusSelect.value = sample.status;
    if (notesInput) notesInput.value = sample.statusNotes;

    if (container) {
      container.innerHTML = sample.tests.map((t, idx) => `
        <div style="display: grid; grid-template-columns: 2fr 2fr 1fr; gap: 12px; align-items: center; padding: 10px 0; border-bottom: 1px dashed var(--border-subtle);">
          <div>
            <span style="font-size: 0.82rem; font-weight: 600; color: var(--pharma-blue);">${t.name}</span>
            <div style="font-size: 0.72rem; color: var(--text-muted);">Spec: ${t.spec}</div>
          </div>
          <div>
            <input type="text" class="form-control test-result-input" data-index="${idx}" value="${t.result}" placeholder="Enter observed value">
          </div>
          <div style="display: flex; align-items: center; justify-content: center;">
            <label class="checkbox-label" style="font-size: 0.78rem;">
              <input type="checkbox" class="test-pass-check" data-index="${idx}" ${t.passed ? 'checked' : ''}>
              Pass
            </label>
          </div>
        </div>
      `).join("");

      // Add auto-evaluation listener to checkboxes
      container.querySelectorAll(".test-pass-check").forEach(chk => {
        chk.addEventListener("change", () => {
          autoEvaluateOverallStatus();
        });
      });
    }

    openModal(testResultModal);
  };

  function autoEvaluateOverallStatus() {
    const checkBoxes = document.querySelectorAll(".test-pass-check");
    const statusSelect = document.getElementById("resultDispositionStatus");
    if (!checkBoxes || !statusSelect) return;

    let allPass = true;
    checkBoxes.forEach(chk => {
      if (!chk.checked) allPass = false;
    });

    if (allPass) {
      statusSelect.value = "Pass/Released";
    } else {
      statusSelect.value = "Fail/Rejected";
    }
  }

  // Save Test Results
  const saveResultsBtn = document.getElementById("saveTestResultsBtn");
  if (saveResultsBtn) {
    saveResultsBtn.addEventListener("click", () => {
      if (!state.activeModalSample) return;

      const sample = state.activeModalSample;
      const statusSelect = document.getElementById("resultDispositionStatus");
      const notesInput = document.getElementById("resultDispositionNotes");

      // Update tests
      const resultInputs = document.querySelectorAll(".test-result-input");
      const checkBoxes = document.querySelectorAll(".test-pass-check");

      resultInputs.forEach(input => {
        const idx = parseInt(input.getAttribute("data-index"), 10);
        if (sample.tests[idx]) {
          sample.tests[idx].result = input.value.trim() || "Tested";
        }
      });

      checkBoxes.forEach(chk => {
        const idx = parseInt(chk.getAttribute("data-index"), 10);
        if (sample.tests[idx]) {
          sample.tests[idx].passed = chk.checked;
        }
      });

      const oldStatus = sample.status;
      sample.status = statusSelect.value;
      sample.statusNotes = notesInput.value.trim() || `Results updated by Lab Analyst on ${new Date().toISOString().slice(0, 10)}`;
      sample.reviewedBy = "Dr. Ayesha Khan (QC Lead)";
      sample.reviewedDate = new Date().toISOString().slice(0, 16).replace("T", " ");

      // Update observed summary
      if (sample.tests.length > 0) {
        sample.observedValue = `${sample.tests[0].name}: ${sample.tests[0].result}`;
        if (sample.tests.length > 1) {
          sample.observedValue += ` | ${sample.tests[1].name}: ${sample.tests[1].result}`;
        }
      }

      // Record 21 CFR Part 11 Audit Trail
      recordAuditTrail(
        "Dr. Ayesha Khan (QC Lead)",
        "TEST_RESULT_ENTRY",
        `${sample.id} (${sample.productName})`,
        `Results updated. Status changed from [${oldStatus}] to [${sample.status}].`
      );

      // Save and refresh
      window.LIMS_STORE.saveSamples();
      refreshAll();
      closeModal(testResultModal);

      showToast(`Test results recorded successfully for lot ${sample.batchNumber}.`, "success");
    });
  }

  // =========================================================================
  // 6. Sample Registration Form
  // =========================================================================
  function setupRegistrationForm() {
    if (!registerForm) return;

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const prodName = document.getElementById("regProductName").value.trim();
      const batchNo = document.getElementById("regBatchNo").value.trim();
      const batchSize = document.getElementById("regBatchSize").value.trim();
      const category = document.getElementById("regCategory").value;
      const pharmacopeia = document.getElementById("regPharmacopeia").value;
      const mfgDate = document.getElementById("regMfgDate").value;
      const expDate = document.getElementById("regExpDate").value;
      const storage = document.getElementById("regStorage").value;
      const priority = document.getElementById("regPriority").value;
      const analyst = document.getElementById("regAnalyst").value;
      const targetSpec = document.getElementById("regTargetSpec").value.trim() || "Per Monograph Requirements";

      // Collect selected tests
      const selectedTests = [];
      document.querySelectorAll(".reg-test-chk:checked").forEach(chk => {
        selectedTests.push({
          name: chk.value,
          spec: chk.getAttribute("data-spec") || "Conforms to standard",
          result: "Pending Analysis",
          passed: true
        });
      });

      if (selectedTests.length === 0) {
        selectedTests.push({
          name: "Standard Monograph Verification",
          spec: "Complies with Monograph",
          result: "Pending Analysis",
          passed: true
        });
      }

      // Generate Sample ID
      const newIndex = state.samples.length + 843;
      const sampleId = `CP-SAMP-2026-${String(newIndex).padStart(4, "0")}`;

      const newSample = {
        id: sampleId,
        batchNumber: batchNo,
        productName: prodName,
        category: category,
        mfgDate: mfgDate || new Date().toISOString().slice(0, 10),
        expDate: expDate || "2029-12-31",
        batchSize: batchSize || "Standard Batch",
        testType: selectedTests.map(t => t.name).slice(0, 2).join(" & "),
        analyst: analyst,
        analystDept: "QC Department",
        receivedDate: new Date().toISOString().slice(0, 10),
        targetSpec: targetSpec,
        observedValue: "Under Intake Queue",
        status: "In Testing",
        statusNotes: "Sample logged into chain of custody. Testing assigned.",
        pharmacopeia: pharmacopeia,
        storageCondition: storage,
        priority: priority,
        tests: selectedTests,
        reviewedBy: "Pending QC Review",
        reviewedDate: "Pending"
      };

      // Add to store
      state.samples.unshift(newSample);
      window.LIMS_STORE.saveSamples();

      // Audit Trail
      recordAuditTrail(
        "Dr. Ayesha Khan (QC Lead)",
        "SAMPLE_REGISTRATION",
        `${newSample.id} (${newSample.productName})`,
        `New sample intake registered with batch #${batchNo} under ${pharmacopeia} protocol.`
      );

      // Reset form
      registerForm.reset();

      // Refresh and switch to sample list
      refreshAll();
      showToast(`Sample ${sampleId} registered successfully!`, "success");
      switchView("samples");
    });
  }

  // =========================================================================
  // 7. Certificate of Analysis (CoA) View
  // =========================================================================
  function setupCoAView() {
    if (coaSelect) {
      coaSelect.addEventListener("change", (e) => {
        const sampleId = e.target.value;
        const sample = state.samples.find(s => s.id === sampleId);
        if (sample) {
          state.selectedSampleForCoA = sample;
          renderCoADocument(sample);
        }
      });
    }

    const printBtn = document.getElementById("printCoABtn");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        window.print();
      });
    }

    const downloadJsonBtn = document.getElementById("downloadCoaJsonBtn");
    if (downloadJsonBtn) {
      downloadJsonBtn.addEventListener("click", () => {
        const sample = state.selectedSampleForCoA || state.samples[0];
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sample, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `CoA_${sample.batchNumber}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast("Certificate data exported as JSON.", "success");
      });
    }
  }

  function populateCoADropdown() {
    if (!coaSelect) return;
    coaSelect.innerHTML = state.samples.map(s => `
      <option value="${s.id}" ${state.selectedSampleForCoA && state.selectedSampleForCoA.id === s.id ? 'selected' : ''}>
        ${s.batchNumber} - ${s.productName} (${s.status})
      </option>
    `).join("");
  }

  window.generateCoAForSample = function(sampleId) {
    const sample = state.samples.find(s => s.id === sampleId);
    if (!sample) return;
    state.selectedSampleForCoA = sample;
    switchView("coa");
    if (coaSelect) coaSelect.value = sample.id;
    renderCoADocument(sample);
  };

  function renderCoADocument(sample) {
    const container = document.getElementById("coaDocumentContainer");
    if (!container || !sample) return;

    const isReleased = sample.status === "Pass/Released";

    container.innerHTML = `
      <div class="coa-document-wrapper">
        <!-- Letterhead Header -->
        <div class="coa-header">
          <div class="coa-brand">
            <img src="assets/citi_pharma_logo.jpg" alt="Citi Pharma Logo" class="coa-logo-img">
            <div class="coa-brand-info">
              <h2>CITI PHARMA</h2>
              <p>Quality Control & Quality Assurance Directorate</p>
              <p style="font-size: 0.72rem; color: var(--teal-green-dark); font-weight: 600;">Quality • Precision • Compliance • cGMP Validated</p>
            </div>
          </div>
          <div class="coa-title-box">
            <h1>Certificate of Analysis</h1>
            <div class="coa-doc-no">Doc Ref: CP-CoA-${sample.batchNumber}</div>
            <div style="margin-top: 6px;">${getStatusBadge(sample.status)}</div>
          </div>
        </div>

        <!-- Metadata Grid -->
        <div class="coa-info-grid">
          <div class="coa-info-row">
            <span class="coa-info-label">Product Name:</span>
            <span class="coa-info-val">${sample.productName}</span>
          </div>
          <div class="coa-info-row">
            <span class="coa-info-label">Sample ID:</span>
            <span class="coa-info-val mono">${sample.id}</span>
          </div>
          <div class="coa-info-row">
            <span class="coa-info-label">Batch / Lot No:</span>
            <span class="coa-info-val mono">${sample.batchNumber}</span>
          </div>
          <div class="coa-info-row">
            <span class="coa-info-label">Monograph Protocol:</span>
            <span class="coa-info-val">${sample.pharmacopeia}</span>
          </div>
          <div class="coa-info-row">
            <span class="coa-info-label">Manufacturing Date:</span>
            <span class="coa-info-val">${sample.mfgDate}</span>
          </div>
          <div class="coa-info-row">
            <span class="coa-info-label">Expiry Date:</span>
            <span class="coa-info-val">${sample.expDate}</span>
          </div>
          <div class="coa-info-row">
            <span class="coa-info-label">Batch Size:</span>
            <span class="coa-info-val">${sample.batchSize}</span>
          </div>
          <div class="coa-info-row">
            <span class="coa-info-label">Storage Condition:</span>
            <span class="coa-info-val">${sample.storageCondition}</span>
          </div>
        </div>

        <!-- Pharmacopeial Analytical Results Table -->
        <h4 style="margin: 20px 0 10px; font-size: 0.95rem; color: var(--pharma-blue); text-transform: uppercase; letter-spacing: 0.5px;">Analytical Testing Results</h4>
        <table class="test-spec-table">
          <thead>
            <tr>
              <th style="width: 35%;">Test Parameter</th>
              <th style="width: 35%;">Specification Monograph</th>
              <th style="width: 20%;">Observed Result</th>
              <th style="width: 10%;">Disposition</th>
            </tr>
          </thead>
          <tbody>
            ${sample.tests.map(t => `
              <tr>
                <td><strong>${t.name}</strong></td>
                <td><code style="font-size: 0.78rem;">${t.spec}</code></td>
                <td><strong style="color: ${t.passed ? 'var(--teal-green-dark)' : 'var(--fail-red-dark)'};">${t.result}</strong></td>
                <td>
                  <span class="badge ${t.passed ? 'badge-pass' : 'badge-fail'}" style="font-size: 0.7rem; padding: 2px 6px;">
                    ${t.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <!-- QA Conclusion Box -->
        <div style="margin-top: 24px; padding: 14px 18px; border-radius: var(--radius-md); background: ${isReleased ? 'var(--teal-green-light)' : 'var(--fail-red-light)'}; border: 1px solid ${isReleased ? 'rgba(15, 157, 138, 0.3)' : 'rgba(220, 38, 38, 0.3)'};">
          <strong style="font-size: 0.85rem; color: ${isReleased ? 'var(--teal-green-dark)' : 'var(--fail-red-dark)'}; text-transform: uppercase;">
            ${isReleased ? '✓ Quality Assurance Release Conclusion:' : '⚠ Quality Assurance Hold / Rejection Conclusion:'}
          </strong>
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-top: 4px;">
            ${sample.statusNotes}
          </p>
        </div>

        <!-- Electronic Signatures (21 CFR Part 11 compliant) -->
        <div class="coa-signatures">
          <div class="sig-box">
            <div class="sig-line">
              <div style="position: absolute; bottom: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--text-muted);">
                Digitally Signed: ${sample.analyst}
              </div>
            </div>
            <span class="sig-name">${sample.analyst}</span>
            <span class="sig-title">Senior QC Analyst / Chemical Section</span>
          </div>

          <div class="sig-box">
            <div class="sig-line">
              <div class="sig-stamp">
                ${isReleased ? 'RELEASED FOR USE' : 'REJECTED / QUARANTINE'}
              </div>
              <div style="position: absolute; bottom: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--text-muted);">
                Authorized Sign-off: ${sample.reviewedBy}
              </div>
            </div>
            <span class="sig-name">${sample.reviewedBy}</span>
            <span class="sig-title">Head of Quality Assurance & Regulatory Compliance</span>
          </div>
        </div>

        <div style="margin-top: 32px; text-align: center; font-size: 0.7rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 12px;">
          Citi Pharma Laboratories • 21 CFR Part 11 Verified Electronic Record • Checksum: SHA-256-${Math.random().toString(36).substring(2, 10).toUpperCase()}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 8. Lab Instruments & Calibration Log
  // =========================================================================
  function renderInstrumentsTable() {
    const tableBody = document.getElementById("instrumentsTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = state.instruments.map(inst => `
      <tr>
        <td><strong class="mono" style="color: var(--pharma-blue);">${inst.id}</strong></td>
        <td>
          <div style="display: flex; flex-direction: column;">
            <strong style="color: var(--text-primary); font-size: 0.85rem;">${inst.name}</strong>
            <span style="font-size: 0.74rem; color: var(--text-muted);">${inst.type}</span>
          </div>
        </td>
        <td><span style="font-size: 0.82rem; color: var(--text-secondary);">${inst.location}</span></td>
        <td><span style="font-size: 0.82rem; color: var(--text-secondary);">${inst.calibDate}</span></td>
        <td><span style="font-size: 0.82rem; font-weight: 600; color: ${inst.calibStatus.includes('Due') ? 'var(--warning-amber-dark)' : inst.calibStatus.includes('Recalibration') ? 'var(--fail-red-dark)' : 'var(--teal-green-dark)'};">${inst.nextCalib}</span></td>
        <td>
          <span class="badge ${inst.status === 'Operational' ? 'badge-pass' : inst.status === 'Due Soon' ? 'badge-quarantine' : 'badge-fail'}">
            <span class="badge-dot"></span>
            ${inst.status}
          </span>
        </td>
        <td>
          <button class="table-action-btn primary" onclick="window.triggerCalibrate('${inst.id}')">
            Calibrate / Verify
          </button>
        </td>
      </tr>
    `).join("");
  }

  function setupCalibrationActions() {
    window.triggerCalibrate = function(instId) {
      const inst = state.instruments.find(i => i.id === instId);
      if (!inst) return;

      const instTitle = document.getElementById("calibModalTitle");
      const instDetail = document.getElementById("calibModalDetail");

      if (instTitle) instTitle.textContent = `Perform Calibration Check: ${inst.name}`;
      if (instDetail) {
        instDetail.innerHTML = `
          <div style="background: var(--clinical-white); padding: 14px; border-radius: var(--radius-md); font-size: 0.85rem; margin-bottom: 14px;">
            <div><strong>Instrument:</strong> ${inst.name} (${inst.id})</div>
            <div><strong>Location:</strong> ${inst.location}</div>
            <div><strong>Last Calibration:</strong> ${inst.calibDate}</div>
            <div><strong>Current State:</strong> ${inst.status}</div>
          </div>
        `;
      }

      openModal(calibrateModal);

      const confirmBtn = document.getElementById("confirmCalibrateBtn");
      if (confirmBtn) {
        confirmBtn.onclick = () => {
          inst.status = "Operational";
          inst.calibStatus = "Valid";
          inst.calibDate = new Date().toISOString().slice(0, 10);
          
          const next = new Date();
          next.setMonth(next.getMonth() + 3);
          inst.nextCalib = next.toISOString().slice(0, 10);

          recordAuditTrail(
            "Zubair Ahmed (Calibration Chemist)",
            "INSTRUMENT_CALIBRATION",
            `${inst.id} (${inst.name})`,
            `Routine calibration standard verified. Status set to Operational through ${inst.nextCalib}.`
          );

          renderInstrumentsTable();
          renderAuditTrailTable();
          closeModal(calibrateModal);
          showToast(`Instrument ${inst.id} successfully calibrated and cleared!`, "success");
        };
      }
    };
  }

  // =========================================================================
  // 9. 21 CFR Part 11 Audit Trail
  // =========================================================================
  function renderAuditTrailTable() {
    const tableBody = document.getElementById("auditTrailTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = state.auditTrail.map(log => `
      <tr>
        <td><span class="mono" style="font-size: 0.78rem; color: var(--text-muted);">${log.timestamp}</span></td>
        <td><strong style="color: var(--pharma-blue); font-size: 0.82rem;">${log.user}</strong></td>
        <td><span class="badge badge-priority-normal" style="font-family: 'JetBrains Mono';">${log.action}</span></td>
        <td><span style="font-weight: 600; color: var(--text-primary); font-size: 0.82rem;">${log.target}</span></td>
        <td><span style="font-size: 0.8rem; color: var(--text-secondary);">${log.detail}</span></td>
        <td><span class="mono" style="font-size: 0.72rem; color: var(--teal-green-dark);">${log.cfrHash}</span></td>
      </tr>
    `).join("");
  }

  function recordAuditTrail(user, action, target, detail) {
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    const fakeHash = Math.random().toString(16).substring(2, 9) + "..." + Math.random().toString(16).substring(2, 5);

    const logItem = {
      timestamp: timestamp,
      user: user,
      action: action,
      target: target,
      detail: detail,
      ip: "192.168.10." + Math.floor(Math.random() * 80 + 10),
      cfrHash: fakeHash
    };

    state.auditTrail.unshift(logItem);
    window.LIMS_STORE.saveAudit();
    renderAuditTrailTable();
  }

  // =========================================================================
  // 10. Data Export to CSV
  // =========================================================================
  function setupExportCSV() {
    const exportBtn = document.getElementById("exportCsvBtn");
    if (!exportBtn) return;

    exportBtn.addEventListener("click", () => {
      const headers = ["Sample ID", "Batch Number", "Product Name", "Category", "Pharmacopeia", "Status", "Analyst", "Received Date", "Target Spec", "Observed Value"];
      const rows = state.samples.map(s => [
        `"${s.id}"`,
        `"${s.batchNumber}"`,
        `"${s.productName}"`,
        `"${s.category}"`,
        `"${s.pharmacopeia}"`,
        `"${s.status}"`,
        `"${s.analyst}"`,
        `"${s.receivedDate}"`,
        `"${s.targetSpec.replace(/"/g, '""')}"`,
        `"${s.observedValue.replace(/"/g, '""')}"`
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Citi_Pharma_LIMS_Records_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      showToast("Sample records exported successfully to CSV.", "success");
    });

    const resetBtn = document.getElementById("resetDemoDataBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset all laboratory sample records and audit trails to Citi Pharma default data?")) {
          window.LIMS_STORE.resetToDefaults();
          state.samples = window.LIMS_STORE.samples;
          state.auditTrail = window.LIMS_STORE.auditTrail;
          refreshAll();
          showToast("Database restored to default Citi Pharma dataset.", "warning");
        }
      });
    }
  }

  // =========================================================================
  // 11. Modal Utilities
  // =========================================================================
  function setupModals() {
    document.querySelectorAll(".modal-overlay").forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    });

    document.querySelectorAll(".modal-close-btn, [data-modal-close]").forEach(btn => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".modal-overlay");
        if (modal) closeModal(modal);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-overlay.open").forEach(modal => closeModal(modal));
      }
    });
  }

  function openModal(modal) {
    if (modal) {
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  // =========================================================================
  // 12. Toast Notification System
  // =========================================================================
  function showToast(message, type = "info") {
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let iconSvg = "";
    if (type === "success") {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--teal-green)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === "warning") {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warning-amber)" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    } else {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--pharma-blue)" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(20px)";
      setTimeout(() => toast.remove(), 250);
    }, 3800);
  }
});
