// assets/js/studio-diagnostics-snapshot-system.js
// Repo-safe Diagnostics Snapshot System for VoltanLabs Studio.
// This creates portable snapshot payloads without exposing GitHub write credentials in GitHub Pages.
// Phase 4.3 bootstrap manager: watches Diagnostics render cycles and keeps the snapshot panel mounted.
(function () {
  const VERSION = "1.0.1";
  const SNAPSHOT_TARGET = "/studio/diagnostics/latest-report.json";
  let observerStarted = false;
  let insertQueued = false;

  function report() {
    return window.VOLTAN_VALIDATION_REPORT || null;
  }

  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function topFindings(findings, severity, limit) {
    return safeArray(findings)
      .filter((finding) => finding && finding.severity === severity)
      .slice(0, limit || 25)
      .map((finding) => ({
        severity: finding.severity,
        rule: finding.rule,
        message: finding.message,
        detail: finding.detail || null
      }));
  }

  function sourceSummary(sources) {
    return safeArray(sources).map((source) => ({
      id: source.id,
      label: source.label,
      path: source.path,
      kind: source.kind,
      ok: !!source.ok,
      count: Number(source.count || 0),
      ms: Number(source.ms || 0),
      error: source.error || null
    }));
  }

  function buildSnapshotPayload() {
    const current = report();
    if (!current) return null;
    return {
      schemaVersion: "1.0.0",
      generatedBy: "VoltanLabs Studio Diagnostics Snapshot System",
      snapshotSystemVersion: VERSION,
      targetPath: SNAPSHOT_TARGET,
      createdAt: new Date().toISOString(),
      reportGeneratedAt: current.generatedAt,
      engineVersion: current.engineVersion,
      rulesVersion: current.rulesVersion,
      summary: {
        healthScore: Number(current.healthScore || 0),
        coverageScore: Number(current.coverageScore || 0),
        errorCount: Number(current.errorCount || 0),
        warningCount: Number(current.warningCount || 0),
        infoCount: Number(current.infoCount || 0),
        recordCount: Number(current.recordCount || 0),
        idCount: Number(current.idCount || 0),
        linkCount: Number(current.linkCount || 0)
      },
      findings: {
        errors: topFindings(current.findings, "error", 30),
        warnings: topFindings(current.findings, "warning", 40),
        infoSample: topFindings(current.findings, "info", 40)
      },
      coverage: safeArray(current.coverage),
      repairSuggestions: safeArray(current.repairSuggestions).slice(0, 40),
      dependencyExplorerSample: safeArray(current.dependencyExplorer).slice(0, 40),
      sources: sourceSummary(current.sources)
    };
  }

  function downloadJson(filename, payload) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function copySnapshot(button) {
    const payload = buildSnapshotPayload();
    if (!payload) return setButton(button, "No Report Yet");
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setButton(button, "Snapshot Copied");
  }

  function saveSnapshot(button) {
    const payload = buildSnapshotPayload();
    if (!payload) return setButton(button, "No Report Yet");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    downloadJson(`voltanlabs-diagnostics-snapshot-${stamp}.json`, payload);
    setButton(button, "Snapshot Saved");
  }

  function openTarget() {
    window.open(SNAPSHOT_TARGET, "_blank", "noopener,noreferrer");
  }

  function setButton(button, text) {
    if (!button) return;
    const original = button.dataset.originalText || button.textContent;
    button.dataset.originalText = original;
    button.textContent = text;
    window.setTimeout(() => { button.textContent = original; }, 1800);
  }

  function bindButtons() {
    const copyButton = document.getElementById("copySnapshotForRepo");
    const saveButton = document.getElementById("saveSnapshotFile");
    const viewButton = document.getElementById("viewSnapshotTarget");
    if (copyButton && !copyButton.dataset.snapshotBound) {
      copyButton.dataset.snapshotBound = "true";
      copyButton.addEventListener("click", () => copySnapshot(copyButton));
    }
    if (saveButton && !saveButton.dataset.snapshotBound) {
      saveButton.dataset.snapshotBound = "true";
      saveButton.addEventListener("click", () => saveSnapshot(saveButton));
    }
    if (viewButton && !viewButton.dataset.snapshotBound) {
      viewButton.dataset.snapshotBound = "true";
      viewButton.addEventListener("click", openTarget);
    }
  }

  function insertPanel() {
    const container = document.getElementById("diagnostics");
    if (!container || !report()) return;
    if (document.getElementById("diagnosticsSnapshotSystem")) {
      bindButtons();
      return;
    }
    container.insertAdjacentHTML("afterbegin", `<section id="diagnosticsSnapshotSystem" class="lg:col-span-2 rounded-2xl border border-[#FFD700]/40 bg-[#2C3E50]/60 p-5">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-wide text-[#FFD700]">Diagnostics Snapshot System</p>
          <h2 class="text-2xl font-bold text-[#FFD700] mt-1">Repo Snapshot Export</h2>
          <p class="text-gray-300 mt-3">Creates a repo-ready diagnostics payload for <code class="text-[#FFD700]">studio/diagnostics/latest-report.json</code>. The browser cannot safely write to GitHub by itself, so this payload is copied, saved, or reviewed through a trusted connector/backend.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button id="copySnapshotForRepo" class="px-3 py-2 rounded-xl border border-[#FFD700] text-[#FFD700] text-sm font-bold">Copy Snapshot for Repo</button>
          <button id="saveSnapshotFile" class="px-3 py-2 rounded-xl border border-white/20 text-white text-sm font-bold">Save Snapshot File</button>
          <button id="viewSnapshotTarget" class="px-3 py-2 rounded-xl border border-white/20 text-white text-sm font-bold">View Repo Target</button>
        </div>
      </div>
    </section>`);
    bindButtons();
  }

  function queueInsert() {
    if (insertQueued) return;
    insertQueued = true;
    window.setTimeout(() => {
      insertQueued = false;
      insertPanel();
    }, 75);
  }

  function startObserver() {
    const container = document.getElementById("diagnostics");
    if (!container || observerStarted) return;
    observerStarted = true;
    const observer = new MutationObserver(() => queueInsert());
    observer.observe(container, { childList: true, subtree: false });
  }

  function boot() {
    startObserver();
    document.addEventListener("studio:diagnostics-ready", queueInsert);
    document.addEventListener("voltan:diagnostics-ready", queueInsert);

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      startObserver();
      if (report() && document.getElementById("diagnostics")) queueInsert();
      if (attempts > 160 || document.getElementById("diagnosticsSnapshotSystem")) window.clearInterval(timer);
    }, 250);
  }

  window.VoltanDiagnosticsSnapshotSystem = {
    version: VERSION,
    targetPath: SNAPSHOT_TARGET,
    buildSnapshotPayload,
    copySnapshot,
    saveSnapshot,
    insertPanel,
    queueInsert
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
