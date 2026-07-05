// assets/js/studio-diagnostics-intelligence.js
// Phase 2 Repository Intelligence companion layer for VoltanLabs Studio Diagnostics.

(function () {
  const SCRIPT_VERSION = "2.0.1";
  const GROUP_RULES = [
    { key: "missing-ids", label: "Missing IDs", rules: ["required-fields"], autoFixable: "partial", repair: "Add stable IDs or accepted id-like fields to records that cannot join the repository graph." },
    { key: "broken-references", label: "Broken References", rules: ["cross-index-references"], autoFixable: "partial", repair: "Create the referenced record, add a known global ID, or update the field to an existing ID." },
    { key: "orphan-records", label: "Orphan Records", rules: ["orphan-detection"], autoFixable: "no", repair: "Link the record from lore, mechanics, runtime, moves, abilities, or mark it intentionally parked." },
    { key: "duplicate-ids", label: "Duplicate IDs", rules: ["duplicate-ids"], autoFixable: "partial", repair: "Rename duplicate records and migrate dependent references to the canonical ID." },
    { key: "schema-mismatches", label: "Schema Mismatches", rules: ["registry-availability"], autoFixable: "partial", repair: "Add missing schemaVersion fields or repair failed source registry paths." },
    { key: "runtime-dependencies", label: "Runtime Dependencies", rules: ["runtime-load-order"], autoFixable: "partial", repair: "Reorder runtime modules and confirm every required script path exists." },
    { key: "mechanics-graph", label: "Mechanics Graph", rules: ["mechanics-graph-integrity"], autoFixable: "partial", repair: "Add missing graph nodes, correct edge endpoints, or declare missing edge types." },
    { key: "documentation-gaps", label: "Documentation Gaps", rules: ["documentation-drift"], autoFixable: "yes", repair: "Sync README milestone wording with active diagnostics capabilities." }
  ];

  function asArray(value) { return Array.isArray(value) ? value : []; }
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }
  function bySeverity(findings, severity) { return findings.filter((item) => item.severity === severity).length; }

  function severityRank(group) {
    if (group.errors) return 3;
    if (group.warnings) return 2;
    if (group.info) return 1;
    return 0;
  }

  function buildFindingGroups(report) {
    const findings = asArray(report.findings);
    const groupedRules = new Set(GROUP_RULES.flatMap((group) => group.rules));
    const groups = GROUP_RULES.map((group) => {
      const items = findings.filter((finding) => group.rules.includes(finding.rule));
      return {
        key: group.key,
        label: group.label,
        count: items.length,
        errors: bySeverity(items, "error"),
        warnings: bySeverity(items, "warning"),
        info: bySeverity(items, "info"),
        rules: group.rules,
        autoFixable: group.autoFixable,
        suggestedRepair: group.repair,
        examples: items.slice(0, 5).map((item) => ({ severity: item.severity, rule: item.rule, message: item.message, detail: item.detail || null }))
      };
    });

    const otherItems = findings.filter((finding) => !groupedRules.has(finding.rule));
    if (otherItems.length) {
      groups.push({
        key: "other-findings",
        label: "Other Findings",
        count: otherItems.length,
        errors: bySeverity(otherItems, "error"),
        warnings: bySeverity(otherItems, "warning"),
        info: bySeverity(otherItems, "info"),
        rules: [...new Set(otherItems.map((item) => item.rule))],
        autoFixable: "review",
        suggestedRepair: "Review these findings and decide whether they deserve a dedicated diagnostics category.",
        examples: otherItems.slice(0, 5).map((item) => ({ severity: item.severity, rule: item.rule, message: item.message, detail: item.detail || null }))
      });
    }

    return groups.filter((group) => group.count > 0).sort((a, b) => severityRank(b) - severityRank(a) || b.count - a.count || a.label.localeCompare(b.label));
  }

  function buildRepositoryIntelligence(report) {
    const groups = buildFindingGroups(report);
    const priority = groups[0] || null;
    return {
      generatedAt: new Date().toISOString(),
      scriptVersion: SCRIPT_VERSION,
      groupCount: groups.length,
      autoFixableCount: groups.filter((group) => group.autoFixable === "yes" || group.autoFixable === "partial").length,
      topPriority: priority ? { label: priority.label, count: priority.count, errors: priority.errors, suggestedRepair: priority.suggestedRepair } : null,
      groups
    };
  }

  function reportJson(report) {
    return JSON.stringify(report || window.VOLTAN_VALIDATION_REPORT || {}, null, 2);
  }

  function makeFilename(report) {
    const date = new Date(report && report.generatedAt ? report.generatedAt : Date.now()).toISOString().replace(/[:.]/g, "-");
    return `voltanlabs-studio-health-report-${date}.json`;
  }

  function saveReportFile(report) {
    const activeReport = report || window.VOLTAN_VALIDATION_REPORT;
    if (!activeReport) return false;
    const blob = new Blob([reportJson(activeReport)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = makeFilename(activeReport);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  }

  function wireSaveButton(button) {
    if (!button || button.dataset.voltanSaveWired === "true") return;
    button.dataset.voltanSaveWired = "true";
    button.type = "button";
    button.addEventListener("click", () => {
      const saved = saveReportFile(window.VOLTAN_VALIDATION_REPORT);
      const original = "Save Report File";
      button.textContent = saved ? "Saved File" : "Report Not Ready";
      window.setTimeout(() => { button.textContent = original; }, 1800);
    });
  }

  function ensureSaveButton() {
    const copyButton = document.getElementById("copyReport");
    const existing = document.getElementById("saveReport");
    if (existing) {
      wireSaveButton(existing);
      return;
    }
    if (!copyButton) return;
    const button = document.createElement("button");
    button.id = "saveReport";
    button.className = "px-4 py-2 rounded-xl border border-[#FFD700] text-[#FFD700] font-bold";
    button.textContent = "Save Report File";
    wireSaveButton(button);
    copyButton.insertAdjacentElement("afterend", button);
  }

  function renderIntelligencePanel(report) {
    const output = document.getElementById("diagnostics");
    if (!output || !report || document.getElementById("repositoryIntelligence")) return;
    const intelligence = buildRepositoryIntelligence(report);
    report.repositoryIntelligence = intelligence;
    const groups = intelligence.groups;
    const cards = groups.map((group) => {
      const examples = group.examples.map((item) => `<li class="mb-2"><span class="text-gray-400">${escapeHtml(item.rule)}</span>: ${escapeHtml(item.message)}</li>`).join("");
      return `<article class="rounded-2xl border border-white/10 bg-black/25 p-5">
        <div class="flex items-start justify-between gap-3">
          <div><p class="text-xs uppercase tracking-wide text-[#FFD700]">${escapeHtml(group.autoFixable)} auto-fix</p><h3 class="text-xl font-bold text-white mt-1">${escapeHtml(group.label)}</h3></div>
          <strong class="text-3xl text-[#FFD700]">${group.count}</strong>
        </div>
        <p class="text-sm text-gray-300 mt-3">Errors: ${group.errors} • Warnings: ${group.warnings} • Info: ${group.info}</p>
        <p class="text-sm text-emerald-100 mt-3">${escapeHtml(group.suggestedRepair)}</p>
        <ul class="text-sm text-gray-100 list-disc ml-5 mt-4">${examples || "<li>No examples available.</li>"}</ul>
      </article>`;
    }).join("");

    const topPriority = intelligence.topPriority
      ? `<p class="text-gray-300 mt-3">Top priority: <span class="text-[#FFD700] font-bold">${escapeHtml(intelligence.topPriority.label)}</span> with ${intelligence.topPriority.count} finding(s). ${escapeHtml(intelligence.topPriority.suggestedRepair)}</p>`
      : `<p class="text-emerald-200 mt-3">No grouped findings detected.</p>`;

    output.insertAdjacentHTML("afterbegin", `<section id="repositoryIntelligence" class="lg:col-span-2 rounded-2xl border border-[#FFD700]/30 bg-[#2C3E50]/70 p-5">
      <p class="text-xs uppercase tracking-wide text-[#FFD700]">Phase 2 Repository Intelligence</p>
      <h2 class="text-2xl font-bold text-[#FFD700] mt-1">Grouped Findings & Repair Map</h2>
      ${topPriority}
      <div class="grid md:grid-cols-2 gap-4 mt-5">${cards}</div>
    </section>`);
  }

  function enhanceReportWhenReady() {
    ensureSaveButton();
    const report = window.VOLTAN_VALIDATION_REPORT;
    if (!report) return false;
    if (!report.repositoryIntelligence) report.repositoryIntelligence = buildRepositoryIntelligence(report);
    renderIntelligencePanel(report);
    return true;
  }

  function boot() {
    ensureSaveButton();
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const ready = enhanceReportWhenReady();
      if (ready || attempts > 80) window.clearInterval(timer);
    }, 250);
  }

  window.VoltanDiagnosticsIntelligence = { version: SCRIPT_VERSION, buildFindingGroups, buildRepositoryIntelligence, saveReportFile };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
