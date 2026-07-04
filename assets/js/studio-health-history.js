// assets/js/studio-health-history.js
// Phase 2.0 Repository Health History for VoltanLabs Studio Diagnostics.

(function () {
  const SCRIPT_VERSION = "2.0.0";
  const STORAGE_KEY = "voltanlabs.studio.healthHistory.v1";
  const MAX_SNAPSHOTS = 25;

  function asArray(value) { return Array.isArray(value) ? value : []; }
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }

  function readHistory() {
    try {
      return asArray(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
    } catch (error) {
      console.warn("Voltan health history reset after parse failure", error);
      return [];
    }
  }

  function writeHistory(history) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_SNAPSHOTS)));
  }

  function snapshotFromReport(report) {
    return {
      generatedAt: report.generatedAt || new Date().toISOString(),
      engineVersion: report.engineVersion,
      rulesVersion: report.rulesVersion,
      healthScore: Number(report.healthScore || 0),
      coverageScore: Number(report.coverageScore || 0),
      errorCount: Number(report.errorCount || 0),
      warningCount: Number(report.warningCount || 0),
      infoCount: Number(report.infoCount || 0),
      recordCount: Number(report.recordCount || 0),
      idCount: Number(report.idCount || 0),
      linkCount: Number(report.linkCount || 0),
      topPriority: report.repositoryIntelligence && report.repositoryIntelligence.topPriority ? report.repositoryIntelligence.topPriority.label : null
    };
  }

  function sameSnapshot(a, b) {
    return a && b && a.generatedAt === b.generatedAt && a.engineVersion === b.engineVersion && a.healthScore === b.healthScore && a.warningCount === b.warningCount;
  }

  function saveSnapshot(report) {
    if (!report || !report.generatedAt) return readHistory();
    const nextSnapshot = snapshotFromReport(report);
    const history = readHistory();
    const last = history[history.length - 1];
    if (!sameSnapshot(last, nextSnapshot)) {
      history.push(nextSnapshot);
      writeHistory(history);
    }
    return readHistory();
  }

  function delta(current, previous, key) {
    if (!previous) return null;
    return Number(current[key] || 0) - Number(previous[key] || 0);
  }

  function formatDelta(value, suffix) {
    if (value === null || Number.isNaN(value)) return "first tracked run";
    if (value === 0) return "no change";
    return `${value > 0 ? "+" : ""}${value}${suffix || ""}`;
  }

  function exportHistory() {
    const history = readHistory();
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), scriptVersion: SCRIPT_VERSION, snapshots: history }, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `voltanlabs-health-history-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    renderHealthHistory(window.VOLTAN_VALIDATION_REPORT);
  }

  function sparkline(history, key) {
    const values = history.map((item) => Number(item[key] || 0));
    if (!values.length) return "";
    const max = Math.max(...values, 100);
    return values.map((value) => {
      const height = Math.max(6, Math.round((value / max) * 52));
      return `<span title="${escapeHtml(key)}: ${value}" class="inline-block w-2 rounded-t bg-[#FFD700]/80" style="height:${height}px"></span>`;
    }).join(" ");
  }

  function renderHealthHistory(report) {
    const output = document.getElementById("diagnostics");
    if (!output || !report) return;
    const history = saveSnapshot(report);
    const current = history[history.length - 1] || snapshotFromReport(report);
    const previous = history.length > 1 ? history[history.length - 2] : null;
    const existing = document.getElementById("repositoryHealthHistory");
    if (existing) existing.remove();

    const rows = history.slice(-8).reverse().map((item) => {
      const date = new Date(item.generatedAt).toLocaleString();
      return `<tr class="border-t border-white/10"><td class="py-2 pr-4 text-gray-300">${escapeHtml(date)}</td><td class="py-2 pr-4 text-[#FFD700] font-bold">${item.healthScore}%</td><td class="py-2 pr-4">${item.coverageScore}%</td><td class="py-2 pr-4">${item.errorCount}</td><td class="py-2 pr-4">${item.warningCount}</td><td class="py-2">${item.infoCount}</td></tr>`;
    }).join("");

    const healthDelta = delta(current, previous, "healthScore");
    const coverageDelta = delta(current, previous, "coverageScore");
    const errorDelta = delta(current, previous, "errorCount");
    const warningDelta = delta(current, previous, "warningCount");

    output.insertAdjacentHTML("afterbegin", `<section id="repositoryHealthHistory" class="lg:col-span-2 rounded-2xl border border-[#007BFF]/40 bg-[#102236]/80 p-5">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-wide text-[#FFD700]">Phase 2.0 Repository Health History</p>
          <h2 class="text-2xl font-bold text-[#FFD700] mt-1">Health Timeline & Snapshot Archive</h2>
          <p class="text-gray-300 mt-3">Every diagnostics run is saved locally in this browser so you can track health, coverage, warning pressure, and repository growth over time.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button id="exportHealthHistory" class="px-3 py-2 rounded-xl border border-[#FFD700] text-[#FFD700] text-sm font-bold">Export History</button>
          <button id="clearHealthHistory" class="px-3 py-2 rounded-xl border border-white/20 text-white text-sm font-bold">Clear History</button>
        </div>
      </div>
      <div class="grid md:grid-cols-4 gap-3 mt-5">
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Health change</p><strong class="text-2xl text-[#FFD700]">${escapeHtml(formatDelta(healthDelta, "%"))}</strong></div>
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Coverage change</p><strong class="text-2xl text-[#FFD700]">${escapeHtml(formatDelta(coverageDelta, "%"))}</strong></div>
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Error change</p><strong class="text-2xl text-[#FFD700]">${escapeHtml(formatDelta(errorDelta))}</strong></div>
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Warning change</p><strong class="text-2xl text-[#FFD700]">${escapeHtml(formatDelta(warningDelta))}</strong></div>
      </div>
      <div class="grid md:grid-cols-2 gap-5 mt-5">
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-300 text-sm mb-3">Health sparkline</p><div class="flex items-end gap-1 h-16">${sparkline(history, "healthScore")}</div></div>
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-300 text-sm mb-3">Coverage sparkline</p><div class="flex items-end gap-1 h-16">${sparkline(history, "coverageScore")}</div></div>
      </div>
      <div class="overflow-x-auto mt-5">
        <table class="w-full text-sm text-left"><thead class="text-gray-300"><tr><th class="py-2 pr-4">Run</th><th class="py-2 pr-4">Health</th><th class="py-2 pr-4">Coverage</th><th class="py-2 pr-4">Errors</th><th class="py-2 pr-4">Warnings</th><th class="py-2">Info</th></tr></thead><tbody>${rows}</tbody></table>
      </div>
    </section>`);

    const exportButton = document.getElementById("exportHealthHistory");
    const clearButton = document.getElementById("clearHealthHistory");
    if (exportButton) exportButton.addEventListener("click", exportHistory);
    if (clearButton) clearButton.addEventListener("click", clearHistory);
  }

  function boot() {
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (window.VOLTAN_VALIDATION_REPORT) {
        renderHealthHistory(window.VOLTAN_VALIDATION_REPORT);
        window.clearInterval(timer);
      }
      if (attempts > 80) window.clearInterval(timer);
    }, 250);
  }

  window.VoltanHealthHistory = { version: SCRIPT_VERSION, readHistory, saveSnapshot, exportHistory, clearHistory, renderHealthHistory };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
