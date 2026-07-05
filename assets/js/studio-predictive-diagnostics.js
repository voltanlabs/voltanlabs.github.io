// assets/js/studio-predictive-diagnostics.js
// Phase 2.2 Predictive Diagnostics for VoltanLabs Studio.
(function () {
  const VERSION = "2.2.0";
  const safe = (value) => String(value ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const arr = (value) => Array.isArray(value) ? value : [];

  function history() {
    return window.VoltanHealthHistory && window.VoltanHealthHistory.readHistory ? window.VoltanHealthHistory.readHistory() : [];
  }

  function trend(items, key) {
    if (items.length < 2) return 0;
    return Number(items[items.length - 1][key] || 0) - Number(items[0][key] || 0);
  }

  function groupBy(items, keyFn) {
    return items.reduce((acc, item) => {
      const key = keyFn(item) || "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  function topEntry(map) {
    return Object.entries(map || {}).sort((a, b) => b[1] - a[1])[0] || null;
  }

  function sourcePath(finding) {
    const detail = finding && finding.detail;
    if (!detail) return "unknown";
    if (typeof detail === "string") return detail;
    return detail.sourcePath || detail.path || detail.source || "unknown";
  }

  function subsystemRisk(heatMap) {
    const subsystems = arr(heatMap && heatMap.subsystems);
    return subsystems.slice().sort((a, b) => a.score - b.score || b.findingCount - a.findingCount)[0] || null;
  }

  function confidence(report, h, repairPlan, graph, heatMap) {
    let score = 35;
    if (report) score += 15;
    if (h.length >= 2) score += 15;
    if (repairPlan) score += 10;
    if (graph) score += 10;
    if (heatMap) score += 10;
    if (Number(report && report.recordCount || 0) > 50) score += 5;
    return Math.min(100, score);
  }

  function severityPressure(report) {
    return (Number(report.errorCount || 0) * 12) + (Number(report.warningCount || 0) * 4) + Number(report.infoCount || 0);
  }

  function buildPredictiveDiagnostics(report) {
    const h = history();
    const findings = arr(report.findings);
    const repairPlan = report.autoRepairPlan || (window.VoltanAutoRepairEngine && window.VoltanAutoRepairEngine.buildRepairPlan ? window.VoltanAutoRepairEngine.buildRepairPlan(report) : null);
    const graph = report.dependencyGraph || (window.VoltanDependencyGraphViewer && window.VoltanDependencyGraphViewer.buildGraphModel ? window.VoltanDependencyGraphViewer.buildGraphModel(report) : null);
    const heatMap = report.coverageHeatMap || (window.VoltanCoverageHeatMap && window.VoltanCoverageHeatMap.buildCoverageHeatMap ? window.VoltanCoverageHeatMap.buildCoverageHeatMap(report) : null);
    const evolution = report.repositoryEvolutionDashboard || (window.VoltanRepositoryEvolutionDashboard && window.VoltanRepositoryEvolutionDashboard.buildDashboard ? window.VoltanRepositoryEvolutionDashboard.buildDashboard(report) : null);

    const rulePressure = groupBy(findings, (finding) => finding.rule);
    const sourcePressure = groupBy(findings, sourcePath);
    const topRule = topEntry(rulePressure);
    const topSource = topEntry(sourcePressure);
    const riskySubsystem = subsystemRisk(heatMap);
    const healthTrend = trend(h, "healthScore");
    const coverageTrend = trend(h, "coverageScore");
    const unresolvedEdges = graph ? Number(graph.unresolvedEdgeCount || 0) : 0;
    const repairCount = repairPlan ? Number(repairPlan.totalRepairs || 0) : findings.length;
    const repairLoad = repairCount + unresolvedEdges + Number(report.errorCount || 0) * 3 + Number(report.warningCount || 0);
    const pressure = severityPressure(report) + repairLoad + (riskySubsystem ? Math.max(0, 80 - riskySubsystem.score) : 0);
    const riskLevel = pressure >= 220 ? "critical" : pressure >= 120 ? "high" : pressure >= 60 ? "medium" : "low";

    const actions = [];
    if (Number(report.errorCount || 0) > 0) actions.push("Clear blocking validation errors before expanding features.");
    if (topRule) actions.push(`Run a focused repair pass on ${topRule[0]} (${topRule[1]} finding${topRule[1] === 1 ? "" : "s"}).`);
    if (riskySubsystem) actions.push(`Raise ${riskySubsystem.label} from ${riskySubsystem.score}% into the healthy band.`);
    if (unresolvedEdges > 0) actions.push(`Resolve ${unresolvedEdges} unresolved dependency graph edge${unresolvedEdges === 1 ? "" : "s"}.`);
    if (healthTrend < 0) actions.push("Health trend is falling; compare the latest health history snapshots before the next feature build.");
    if (coverageTrend < 0) actions.push("Coverage trend is falling; add references or documentation before adding more indexes.");
    if (!actions.length) actions.push("Repository pressure is low; begin the next planned feature phase with documentation updates included.");

    return {
      generatedAt: new Date().toISOString(),
      version: VERSION,
      riskLevel,
      maintenancePressure: pressure,
      confidence: confidence(report, h, repairPlan, graph, heatMap),
      healthTrend,
      coverageTrend,
      topRule: topRule ? { rule: topRule[0], count: topRule[1] } : null,
      topSource: topSource ? { path: topSource[0], count: topSource[1] } : null,
      highestRiskSubsystem: riskySubsystem ? { key: riskySubsystem.key, label: riskySubsystem.label, score: riskySubsystem.score, findings: riskySubsystem.findingCount, repairs: riskySubsystem.repairCount } : null,
      unresolvedEdges,
      repairCount,
      maturityScore: evolution ? evolution.maturityScore : null,
      recommendedActions: actions.slice(0, 6),
      predictedNextPhase: riskLevel === "low" || riskLevel === "medium" ? "Predictive Diagnostics Expansion" : "Repair Stabilization Pass"
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
    download(`voltanlabs-predictive-diagnostics-${new Date().toISOString().replace(/[:.]/g, "-")}.json`, "application/json;charset=utf-8", JSON.stringify(data, null, 2));
  }

  function exportMarkdown(data) {
    const md = [`# VoltanLabs Predictive Diagnostics`, ``, `Risk Level: ${data.riskLevel}`, `Maintenance Pressure: ${data.maintenancePressure}`, `Confidence: ${data.confidence}%`, `Health Trend: ${data.healthTrend}`, `Coverage Trend: ${data.coverageTrend}`, ``, `## Recommended Actions`, ...data.recommendedActions.map((action) => `- ${action}`)].join("\n");
    download(`voltanlabs-predictive-diagnostics-${new Date().toISOString().replace(/[:.]/g, "-")}.md`, "text/markdown;charset=utf-8", md);
  }

  function render(report) {
    const output = document.getElementById("diagnostics");
    if (!output || !report) return;
    const old = document.getElementById("predictiveDiagnostics");
    if (old) old.remove();
    const data = buildPredictiveDiagnostics(report);
    report.predictiveDiagnostics = data;
    const actions = data.recommendedActions.map((action) => `<li class="mb-2">${safe(action)}</li>`).join("");
    output.insertAdjacentHTML("afterbegin", `<section id="predictiveDiagnostics" class="lg:col-span-2 rounded-2xl border border-purple-300/40 bg-purple-950/20 p-5">
      <div class="flex flex-wrap items-start justify-between gap-4"><div><p class="text-xs uppercase tracking-wide text-[#FFD700]">Phase 2.2 Predictive Diagnostics</p><h2 class="text-3xl font-bold text-[#FFD700] mt-1">Next Best Action Engine</h2><p class="text-gray-300 mt-3">Correlates findings, repair load, dependency graph pressure, coverage heat, evolution maturity, and local health history into predictive maintenance guidance.</p></div><div class="flex flex-wrap gap-2"><button id="exportPredictiveJson" class="px-3 py-2 rounded-xl border border-[#FFD700] text-[#FFD700] text-sm font-bold">Export JSON</button><button id="exportPredictiveMarkdown" class="px-3 py-2 rounded-xl border border-white/20 text-white text-sm font-bold">Export MD</button></div></div>
      <div class="grid md:grid-cols-5 gap-3 mt-5"><div class="md:col-span-2 rounded-xl border border-purple-300/30 bg-black/30 p-5"><p class="text-gray-400 text-sm">Risk Level</p><strong class="text-5xl text-[#FFD700]">${safe(data.riskLevel)}</strong><p class="text-gray-300 mt-2">Predicted next phase: ${safe(data.predictedNextPhase)}</p></div><div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Pressure</p><strong class="text-2xl text-[#FFD700]">${data.maintenancePressure}</strong></div><div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Confidence</p><strong class="text-2xl text-[#FFD700]">${data.confidence}%</strong></div><div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Repairs</p><strong class="text-2xl text-[#FFD700]">${data.repairCount}</strong></div></div>
      <div class="grid md:grid-cols-3 gap-3 mt-5"><div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Top Rule Pressure</p><strong class="text-xl text-white">${safe(data.topRule ? data.topRule.rule : "None")}</strong><p class="text-sm text-gray-300 mt-1">${data.topRule ? data.topRule.count : 0} finding(s)</p></div><div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Highest Risk Subsystem</p><strong class="text-xl text-white">${safe(data.highestRiskSubsystem ? data.highestRiskSubsystem.label : "None")}</strong><p class="text-sm text-gray-300 mt-1">${data.highestRiskSubsystem ? data.highestRiskSubsystem.score + "%" : "No subsystem risk"}</p></div><div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Unresolved Edges</p><strong class="text-xl text-white">${data.unresolvedEdges}</strong><p class="text-sm text-gray-300 mt-1">Health ${data.healthTrend >= 0 ? "+" : ""}${data.healthTrend} / Coverage ${data.coverageTrend >= 0 ? "+" : ""}${data.coverageTrend}</p></div></div>
      <div class="rounded-xl border border-white/10 bg-black/25 p-4 mt-5"><h3 class="font-bold text-white">Recommended Actions</h3><ol class="list-decimal ml-5 mt-3 text-gray-200">${actions}</ol></div>
    </section>`);
    document.getElementById("exportPredictiveJson")?.addEventListener("click", () => exportJson(data));
    document.getElementById("exportPredictiveMarkdown")?.addEventListener("click", () => exportMarkdown(data));
  }

  function boot() {
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (window.VOLTAN_VALIDATION_REPORT) { render(window.VOLTAN_VALIDATION_REPORT); clearInterval(timer); }
      if (tries > 80) clearInterval(timer);
    }, 250);
  }

  window.VoltanPredictiveDiagnostics = { version: VERSION, buildPredictiveDiagnostics, exportJson, exportMarkdown, render };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
