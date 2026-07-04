// assets/js/studio-auto-repair-engine.js
// Phase 2.0 Auto Repair Engine for VoltanLabs Studio Diagnostics.

(function () {
  const SCRIPT_VERSION = "2.0.0";

  const REPAIR_RULES = {
    "documentation-drift": {
      category: "Documentation Drift",
      mode: "safe-auto-fix",
      action: "Sync README milestone language with the active diagnostics capabilities.",
      impact: "Should reduce documentation drift warnings after README is updated.",
      command: "Update README wording to include the missing milestone phrase."
    },
    "required-fields": {
      category: "Missing Required Fields",
      mode: "assisted-fix",
      action: "Add the missing field to the source record using the source schema.",
      impact: "Can remove blocking validation errors and improve repository graph coverage.",
      command: "Open the affected JSON record and add the missing id-like/title-like/required field."
    },
    "cross-index-references": {
      category: "Broken References",
      mode: "assisted-fix",
      action: "Create the missing target record or update the reference to an existing canonical ID.",
      impact: "Should reduce cross-index warnings and strengthen dependency graph accuracy.",
      command: "Resolve the unknown target by adding a record, alias, known global ID, or corrected reference."
    },
    "duplicate-ids": {
      category: "Duplicate IDs",
      mode: "architecture-review",
      action: "Choose the canonical record, rename the duplicate, then migrate references.",
      impact: "Prevents graph ambiguity and future accidental overwrites.",
      command: "Rename one duplicate ID and update all dependent references."
    },
    "orphan-detection": {
      category: "Orphan Records",
      mode: "manual-review",
      action: "Link the record from another index or mark it intentionally parked.",
      impact: "Improves knowledge coverage and reduces loose records.",
      command: "Add a reference from lore, mechanics graph, runtime, moves, or abilities."
    },
    "runtime-load-order": {
      category: "Runtime Load Order",
      mode: "assisted-fix",
      action: "Move dependencies earlier in the runtime manifest and confirm script paths.",
      impact: "Prevents runtime modules from loading before their requirements.",
      command: "Reorder load-order.json and verify module script fields."
    },
    "mechanics-graph-integrity": {
      category: "Mechanics Graph Integrity",
      mode: "assisted-fix",
      action: "Add missing graph nodes, correct edge endpoints, or declare edge types.",
      impact: "Repairs gameplay relationship graph integrity.",
      command: "Patch mechanics-graph.json nodes, edges, or graphModel.edgeTypes."
    },
    "registry-availability": {
      category: "Registry Availability / Schema",
      mode: "assisted-fix",
      action: "Repair failed source paths or add missing schemaVersion fields.",
      impact: "Restores source availability and schema tracking.",
      command: "Check diagnostics sources.json and the affected source file."
    }
  };

  function asArray(value) { return Array.isArray(value) ? value : []; }
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }

  function sourcePathOf(finding) {
    const detail = finding && finding.detail;
    if (!detail) return null;
    if (typeof detail === "string") return detail;
    if (detail.sourcePath) return detail.sourcePath;
    if (detail.path) return detail.path;
    if (Array.isArray(detail) && detail[0] && detail[0].path) return detail[0].path;
    return null;
  }

  function targetOf(finding) {
    const detail = finding && finding.detail;
    if (!detail || typeof detail !== "object" || Array.isArray(detail)) return null;
    return detail.target || detail.id || null;
  }

  function buildRepairItem(finding, index) {
    const rule = REPAIR_RULES[finding.rule] || {
      category: "Unclassified Finding",
      mode: "manual-review",
      action: "Review the source file and reconcile the finding with the active validation rule.",
      impact: "Unknown until reviewed.",
      command: "Inspect the source record and decide whether this needs a dedicated repair rule."
    };
    const sourcePath = sourcePathOf(finding);
    const target = targetOf(finding);
    return {
      id: `repair-${index + 1}`,
      rule: finding.rule,
      severity: finding.severity,
      category: rule.category,
      mode: rule.mode,
      finding: finding.message,
      sourcePath,
      target,
      action: rule.action,
      impact: rule.impact,
      dryRunCommand: target ? `${rule.command} Target: ${target}.` : rule.command,
      status: rule.mode === "safe-auto-fix" ? "ready-for-safe-fix" : "needs-review"
    };
  }

  function buildRepairPlan(report) {
    const findings = asArray(report && report.findings);
    const repairs = findings.map(buildRepairItem);
    const byMode = repairs.reduce((acc, item) => {
      acc[item.mode] = (acc[item.mode] || 0) + 1;
      return acc;
    }, {});
    const byCategory = repairs.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
    const currentHealth = Number(report && report.healthScore || 0);
    const estimatedWarningReduction = repairs.filter((item) => item.mode === "safe-auto-fix" || item.mode === "assisted-fix").length;
    const estimatedHealthLift = Math.min(30, Math.round(estimatedWarningReduction * 1.5));
    return {
      generatedAt: new Date().toISOString(),
      scriptVersion: SCRIPT_VERSION,
      totalRepairs: repairs.length,
      safeAutoFixes: byMode["safe-auto-fix"] || 0,
      assistedFixes: byMode["assisted-fix"] || 0,
      manualReviews: byMode["manual-review"] || 0,
      architectureReviews: byMode["architecture-review"] || 0,
      estimatedImpact: {
        currentHealth,
        projectedHealthAfterSafeAndAssistedFixes: Math.min(100, currentHealth + estimatedHealthLift),
        estimatedWarningReduction
      },
      byCategory,
      repairs
    };
  }

  function exportRepairPlan(plan) {
    const activePlan = plan || buildRepairPlan(window.VOLTAN_VALIDATION_REPORT || {});
    const blob = new Blob([JSON.stringify(activePlan, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `voltanlabs-auto-repair-plan-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function copyCommitSummary(plan) {
    const activePlan = plan || buildRepairPlan(window.VOLTAN_VALIDATION_REPORT || {});
    const lines = [
      "Phase 2.0 Auto Repair Plan",
      `Total repairs: ${activePlan.totalRepairs}`,
      `Safe auto-fixes: ${activePlan.safeAutoFixes}`,
      `Assisted fixes: ${activePlan.assistedFixes}`,
      `Manual reviews: ${activePlan.manualReviews}`,
      `Architecture reviews: ${activePlan.architectureReviews}`,
      "",
      "Top categories:",
      ...Object.entries(activePlan.byCategory).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([category, count]) => `- ${category}: ${count}`)
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
  }

  function renderRepairQueue(plan) {
    const rows = plan.repairs.slice(0, 18).map((item) => `<li class="mb-4 rounded-xl border border-white/10 bg-black/25 p-4">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div><p class="text-xs uppercase tracking-wide text-[#FFD700]">${escapeHtml(item.mode)} • ${escapeHtml(item.severity)}</p><h3 class="font-bold text-white mt-1">${escapeHtml(item.category)}</h3></div>
        <span class="text-xs text-gray-400">${escapeHtml(item.rule)}</span>
      </div>
      <p class="text-sm text-gray-100 mt-3">${escapeHtml(item.finding)}</p>
      <p class="text-sm text-emerald-100 mt-3">Action: ${escapeHtml(item.action)}</p>
      <p class="text-sm text-gray-300 mt-2">Dry run: ${escapeHtml(item.dryRunCommand)}</p>
      ${item.sourcePath ? `<p class="text-xs text-gray-500 mt-2">Source: ${escapeHtml(item.sourcePath)}</p>` : ""}
    </li>`).join("");
    return rows || "<li class=\"text-emerald-200\">No repair actions needed.</li>";
  }

  function renderAutoRepair(report) {
    const output = document.getElementById("diagnostics");
    if (!output || !report) return;
    const existing = document.getElementById("autoRepairEngine");
    if (existing) existing.remove();
    const plan = buildRepairPlan(report);
    report.autoRepairPlan = plan;
    const categories = Object.entries(plan.byCategory).sort((a, b) => b[1] - a[1]).map(([category, count]) => `<div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">${escapeHtml(category)}</p><strong class="text-2xl text-[#FFD700]">${count}</strong></div>`).join("");

    output.insertAdjacentHTML("afterbegin", `<section id="autoRepairEngine" class="lg:col-span-2 rounded-2xl border border-emerald-300/30 bg-emerald-950/20 p-5">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-wide text-[#FFD700]">Phase 2.0 Auto Repair Engine</p>
          <h2 class="text-2xl font-bold text-[#FFD700] mt-1">Dry-Run Repair Queue</h2>
          <p class="text-gray-300 mt-3">This layer does not rewrite files in-browser. It classifies diagnostics findings into safe auto-fixes, assisted fixes, manual reviews, and architecture reviews, then exports a repair plan for implementation.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button id="exportRepairPlan" class="px-3 py-2 rounded-xl border border-[#FFD700] text-[#FFD700] text-sm font-bold">Export Repair Plan</button>
          <button id="copyRepairSummary" class="px-3 py-2 rounded-xl border border-white/20 text-white text-sm font-bold">Copy Commit Summary</button>
        </div>
      </div>
      <div class="grid md:grid-cols-5 gap-3 mt-5">
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Total</p><strong class="text-2xl text-[#FFD700]">${plan.totalRepairs}</strong></div>
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Safe</p><strong class="text-2xl text-[#FFD700]">${plan.safeAutoFixes}</strong></div>
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Assisted</p><strong class="text-2xl text-[#FFD700]">${plan.assistedFixes}</strong></div>
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Manual</p><strong class="text-2xl text-[#FFD700]">${plan.manualReviews}</strong></div>
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Projected Health</p><strong class="text-2xl text-[#FFD700]">${plan.estimatedImpact.projectedHealthAfterSafeAndAssistedFixes}%</strong></div>
      </div>
      <div class="grid md:grid-cols-3 gap-3 mt-5">${categories}</div>
      <h3 class="text-xl font-bold text-white mt-6">Repair Queue Preview</h3>
      <ul class="mt-4">${renderRepairQueue(plan)}</ul>
    </section>`);

    const exportButton = document.getElementById("exportRepairPlan");
    const copyButton = document.getElementById("copyRepairSummary");
    if (exportButton) exportButton.addEventListener("click", () => exportRepairPlan(plan));
    if (copyButton) copyButton.addEventListener("click", async () => {
      await copyCommitSummary(plan);
      copyButton.textContent = "Copied Summary";
      window.setTimeout(() => { copyButton.textContent = "Copy Commit Summary"; }, 1800);
    });
  }

  function boot() {
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (window.VOLTAN_VALIDATION_REPORT) {
        renderAutoRepair(window.VOLTAN_VALIDATION_REPORT);
        window.clearInterval(timer);
      }
      if (attempts > 80) window.clearInterval(timer);
    }, 250);
  }

  window.VoltanAutoRepairEngine = { version: SCRIPT_VERSION, buildRepairPlan, exportRepairPlan, copyCommitSummary, renderAutoRepair };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
