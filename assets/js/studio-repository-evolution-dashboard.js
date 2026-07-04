// assets/js/studio-repository-evolution-dashboard.js
// Phase 2.0 Repository Evolution Dashboard for VoltanLabs Studio Diagnostics.
(function () {
  const VERSION = "2.0.0";
  const safe = (value) => String(value ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const arr = (value) => Array.isArray(value) ? value : [];

  function stage(score) {
    if (score >= 90) return ["Release Candidate", "Ready for final hardening and launch checks."];
    if (score >= 75) return ["Beta", "Core systems are stable with focused cleanup remaining."];
    if (score >= 55) return ["Alpha", "Major systems are online and need validation pressure relief."];
    return ["Prototype", "Foundation is active and still needs structural completion."];
  }

  function history() {
    return window.VoltanHealthHistory && window.VoltanHealthHistory.readHistory ? window.VoltanHealthHistory.readHistory() : [];
  }

  function trend(items, key) {
    if (items.length < 2) return 0;
    return Number(items[items.length - 1][key] || 0) - Number(items[0][key] || 0);
  }

  function buildDashboard(report) {
    const h = history();
    const heat = report.coverageHeatMap || (window.VoltanCoverageHeatMap && window.VoltanCoverageHeatMap.buildCoverageHeatMap ? window.VoltanCoverageHeatMap.buildCoverageHeatMap(report) : null);
    const repairs = report.autoRepairPlan || (window.VoltanAutoRepairEngine && window.VoltanAutoRepairEngine.buildRepairPlan ? window.VoltanAutoRepairEngine.buildRepairPlan(report) : null);
    const graph = report.dependencyGraph || (window.VoltanDependencyGraphViewer && window.VoltanDependencyGraphViewer.buildGraphModel ? window.VoltanDependencyGraphViewer.buildGraphModel(report) : null);
    const health = Number(report.healthScore || 0);
    const coverage = Number(report.coverageScore || 0);
    const heatScore = heat ? Number(heat.averageScore || 0) : coverage;
    const graphScore = graph && graph.edgeCount ? Math.round((graph.resolvedEdgeCount / graph.edgeCount) * 100) : 50;
    const repairPressure = repairs ? Math.min(30, Math.round((repairs.totalRepairs || 0) / 3)) : 0;
    const maturity = Math.max(0, Math.min(100, Math.round(health * 0.35 + coverage * 0.25 + heatScore * 0.25 + graphScore * 0.15 - repairPressure)));
    const stageInfo = stage(maturity);
    const risk = heat && heat.subsystems && heat.subsystems.length ? heat.subsystems[0] : null;
    const topRepair = repairs && repairs.byCategory ? Object.entries(repairs.byCategory).sort((a, b) => b[1] - a[1])[0] : null;
    const milestones = [
      ["Repository Intelligence", !!report.repositoryIntelligence],
      ["Health History", h.length > 0],
      ["Auto Repair Engine", !!repairs],
      ["Dependency Graph Viewer", !!graph],
      ["Coverage Heat Map", !!heat],
      ["Evolution Dashboard", true]
    ];
    const next = topRepair ? `Run a repair pass on ${topRepair[0]}.` : risk && risk.score < 75 ? `Raise ${risk.label} coverage into the healthy band.` : "Begin Phase 2.1 predictive diagnostics and architecture recommendations.";
    return {
      generatedAt: new Date().toISOString(),
      version: VERSION,
      maturityScore: maturity,
      readinessStage: stageInfo[0],
      readinessDetail: stageInfo[1],
      healthScore: health,
      coverageScore: coverage,
      heatMapScore: heatScore,
      graphResolutionScore: graphScore,
      repairPressure,
      healthTrend: trend(h, "healthScore"),
      coverageTrend: trend(h, "coverageScore"),
      historyRuns: h.length,
      milestones: milestones.map(([label, done]) => ({ label, status: done ? "complete" : "pending" })),
      completedMilestones: milestones.filter((item) => item[1]).length,
      totalMilestones: milestones.length,
      highestRiskSubsystem: risk ? { label: risk.label, score: risk.score, recommendation: risk.recommendedAction } : null,
      topRepairCategory: topRepair ? { category: topRepair[0], count: topRepair[1] } : null,
      nextRecommendedMilestone: next,
      technicalDebt: {
        errors: Number(report.errorCount || 0),
        warnings: Number(report.warningCount || 0),
        info: Number(report.infoCount || 0),
        unresolvedEdges: graph ? graph.unresolvedEdgeCount : 0,
        repairs: repairs ? repairs.totalRepairs : 0
      },
      history: h.slice(-10),
      subsystemProgress: heat ? heat.subsystems.map((item) => ({ label: item.label, score: item.score, status: item.status, findings: item.findingCount, repairs: item.repairCount })) : []
    };
  }

  function download(name, type, content) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportJson(data) {
    download(`voltanlabs-evolution-dashboard-${new Date().toISOString().replace(/[:.]/g, "-")}.json`, "application/json;charset=utf-8", JSON.stringify(data, null, 2));
  }

  function exportMarkdown(data) {
    const md = [`# VoltanLabs Studio Evolution Dashboard`, ``, `Maturity Score: ${data.maturityScore}%`, `Readiness: ${data.readinessStage}`, `Next: ${data.nextRecommendedMilestone}`, ``, `## Technical Debt`, `- Errors: ${data.technicalDebt.errors}`, `- Warnings: ${data.technicalDebt.warnings}`, `- Repairs: ${data.technicalDebt.repairs}`, ``, `## Milestones`, ...data.milestones.map((m) => `- ${m.label}: ${m.status}`), ``, `## Subsystems`, ...data.subsystemProgress.map((s) => `- ${s.label}: ${s.score}% (${s.status})`)].join("\n");
    download(`voltanlabs-evolution-summary-${new Date().toISOString().replace(/[:.]/g, "-")}.md`, "text/markdown;charset=utf-8", md);
  }

  function bars(items, key) {
    if (!items.length) return "<span class='text-gray-400'>No history yet.</span>";
    return items.map((item) => `<span class="inline-block w-2 rounded-t bg-[#FFD700]/80" style="height:${Math.max(6, Math.round((Number(item[key] || 0) / 100) * 56))}px"></span>`).join(" ");
  }

  function render(report) {
    const output = document.getElementById("diagnostics");
    if (!output || !report) return;
    const old = document.getElementById("repositoryEvolutionDashboard");
    if (old) old.remove();
    const data = buildDashboard(report);
    report.repositoryEvolutionDashboard = data;
    const milestones = data.milestones.map((m) => `<div class="rounded-xl border ${m.status === "complete" ? "border-emerald-300/30 bg-emerald-950/20" : "border-yellow-300/40 bg-yellow-950/20"} p-4"><p class="text-xs uppercase text-gray-400">${safe(m.status)}</p><h3 class="font-bold text-white">${safe(m.label)}</h3></div>`).join("");
    const rows = data.subsystemProgress.slice(0, 10).map((s) => `<tr class="border-t border-white/10"><td class="py-2 pr-4 text-[#FFD700]">${safe(s.label)}</td><td class="py-2 pr-4">${s.score}%</td><td class="py-2 pr-4">${safe(s.status)}</td><td class="py-2 pr-4">${s.findings}</td><td class="py-2">${s.repairs}</td></tr>`).join("");
    output.insertAdjacentHTML("afterbegin", `<section id="repositoryEvolutionDashboard" class="lg:col-span-2 rounded-2xl border border-[#FFD700]/50 bg-[#111827] p-5">
      <div class="flex flex-wrap items-start justify-between gap-4"><div><p class="text-xs uppercase tracking-wide text-[#FFD700]">Phase 2.0 Repository Evolution Dashboard</p><h2 class="text-3xl font-bold text-[#FFD700] mt-1">Studio Control Center</h2><p class="text-gray-300 mt-3">Unifies Repository Intelligence, Health History, Auto Repair, Dependency Graph, and Coverage Heat Map into one maturity view.</p></div><div class="flex flex-wrap gap-2"><button id="exportEvolutionJson" class="px-3 py-2 rounded-xl border border-[#FFD700] text-[#FFD700] text-sm font-bold">Export JSON</button><button id="exportEvolutionMarkdown" class="px-3 py-2 rounded-xl border border-white/20 text-white text-sm font-bold">Export Summary</button></div></div>
      <div class="grid md:grid-cols-5 gap-3 mt-5"><div class="md:col-span-2 rounded-xl border border-[#FFD700]/30 bg-black/30 p-5"><p class="text-gray-400 text-sm">Maturity Score</p><strong class="text-5xl text-[#FFD700]">${data.maturityScore}%</strong><p class="text-emerald-100 mt-3">${safe(data.readinessStage)} — ${safe(data.readinessDetail)}</p></div><div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Health</p><strong class="text-2xl text-[#FFD700]">${data.healthScore}%</strong><p class="text-xs text-gray-400">Trend ${data.healthTrend >= 0 ? "+" : ""}${data.healthTrend}</p></div><div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Coverage</p><strong class="text-2xl text-[#FFD700]">${data.coverageScore}%</strong><p class="text-xs text-gray-400">Trend ${data.coverageTrend >= 0 ? "+" : ""}${data.coverageTrend}</p></div><div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Milestones</p><strong class="text-2xl text-[#FFD700]">${data.completedMilestones}/${data.totalMilestones}</strong></div></div>
      <div class="grid md:grid-cols-2 gap-5 mt-5"><div class="rounded-xl border border-white/10 bg-black/25 p-4"><h3 class="font-bold text-white">Health Timeline</h3><div class="flex items-end gap-1 h-16 mt-4">${bars(data.history, "healthScore")}</div></div><div class="rounded-xl border border-white/10 bg-black/25 p-4"><h3 class="font-bold text-white">Coverage Timeline</h3><div class="flex items-end gap-1 h-16 mt-4">${bars(data.history, "coverageScore")}</div></div></div>
      <div class="grid md:grid-cols-3 gap-3 mt-5"><div class="rounded-xl border border-red-300/30 bg-red-950/20 p-4"><p class="text-gray-400 text-sm">Highest Risk</p><strong class="text-xl text-white">${safe(data.highestRiskSubsystem ? data.highestRiskSubsystem.label : "None")}</strong><p class="text-sm text-gray-300 mt-2">${safe(data.highestRiskSubsystem ? data.highestRiskSubsystem.recommendation : "No risk subsystem detected.")}</p></div><div class="rounded-xl border border-yellow-300/30 bg-yellow-950/20 p-4"><p class="text-gray-400 text-sm">Top Repair Category</p><strong class="text-xl text-white">${safe(data.topRepairCategory ? data.topRepairCategory.category : "None")}</strong><p class="text-sm text-gray-300 mt-2">${data.topRepairCategory ? data.topRepairCategory.count : 0} item(s)</p></div><div class="rounded-xl border border-emerald-300/30 bg-emerald-950/20 p-4"><p class="text-gray-400 text-sm">Next Milestone</p><strong class="text-xl text-white">Recommended</strong><p class="text-sm text-gray-300 mt-2">${safe(data.nextRecommendedMilestone)}</p></div></div>
      <div class="grid md:grid-cols-3 gap-3 mt-5">${milestones}</div><div class="overflow-x-auto mt-5 rounded-xl border border-white/10 bg-black/25 p-4"><h3 class="font-bold text-white">Subsystem Progress</h3><table class="w-full text-sm text-left mt-3"><thead class="text-gray-300"><tr><th class="py-2 pr-4">Subsystem</th><th class="py-2 pr-4">Score</th><th class="py-2 pr-4">Status</th><th class="py-2 pr-4">Findings</th><th class="py-2">Repairs</th></tr></thead><tbody>${rows}</tbody></table></div>
    </section>`);
    document.getElementById("exportEvolutionJson")?.addEventListener("click", () => exportJson(data));
    document.getElementById("exportEvolutionMarkdown")?.addEventListener("click", () => exportMarkdown(data));
  }

  function boot() {
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (window.VOLTAN_VALIDATION_REPORT) { render(window.VOLTAN_VALIDATION_REPORT); clearInterval(timer); }
      if (tries > 80) clearInterval(timer);
    }, 250);
  }

  window.VoltanRepositoryEvolutionDashboard = { version: VERSION, buildDashboard, exportJson, exportMarkdown, render };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
