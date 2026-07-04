// assets/js/studio-coverage-heat-map.js
// Phase 2.0 Repository Coverage Heat Map for VoltanLabs Studio Diagnostics.

(function () {
  const SCRIPT_VERSION = "2.0.0";

  const SUBSYSTEMS = [
    { key: "studio-core", label: "Studio Core", kinds: ["registry", "modules"], keywords: ["dashboard", "studio", "module"] },
    { key: "knowledge-engine", label: "Knowledge Engine", kinds: ["registry", "documentation"], keywords: ["knowledge", "index", "registry"] },
    { key: "databytesprites", label: "DataByteSprites", kinds: ["species", "lore", "move", "ability", "typeChart", "sourceFile", "mechanicsGraph"], keywords: ["databyte", "dbs", "sprite", "battle", "capture"] },
    { key: "creator-suite", label: "Creator Suite", kinds: ["modules", "sourceFile"], keywords: ["creator", "draw", "gif", "promptcraft", "tools"] },
    { key: "asset-library", label: "Asset Library", kinds: ["asset", "sourceFile"], keywords: ["asset", "library", "sprite", "image"] },
    { key: "technology-vault", label: "Technology Vault", kinds: ["modules", "documentation"], keywords: ["technology", "vault", "license", "offline"] },
    { key: "simulation-lab", label: "Simulation Lab", kinds: ["modules", "runtime"], keywords: ["simulation", "sandbox", "testing"] },
    { key: "runtime", label: "Runtime", kinds: ["runtime"], keywords: ["runtime", "loader", "boot", "manifest"] },
    { key: "validation", label: "Validation", kinds: ["validation", "documentation"], keywords: ["diagnostics", "validation", "health", "rules"] },
    { key: "documentation", label: "Documentation", kinds: ["documentation"], keywords: ["readme", "roadmap", "docs", "milestone"] }
  ];

  function asArray(value) { return Array.isArray(value) ? value : []; }
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  }
  function normalize(value) { return String(value || "").toLowerCase(); }

  function sourceText(source) {
    return normalize([source.id, source.label, source.path, source.kind, source.collection].join(" "));
  }

  function findingText(finding) {
    return normalize([finding.rule, finding.message, finding.detail && finding.detail.sourcePath, finding.detail && finding.detail.path].join(" "));
  }

  function matchesSubsystemSource(source, subsystem) {
    if (subsystem.kinds.includes(source.kind)) return true;
    const text = sourceText(source);
    return subsystem.keywords.some((keyword) => text.includes(keyword));
  }

  function matchesSubsystemFinding(finding, subsystem) {
    const text = findingText(finding);
    return subsystem.keywords.some((keyword) => text.includes(keyword)) || subsystem.kinds.some((kind) => text.includes(kind.toLowerCase()));
  }

  function scoreTone(score) {
    if (score >= 85) return { label: "healthy", border: "border-emerald-300/40", bg: "bg-emerald-950/20", text: "text-emerald-100" };
    if (score >= 65) return { label: "watch", border: "border-yellow-300/40", bg: "bg-yellow-950/20", text: "text-yellow-100" };
    return { label: "needs work", border: "border-red-300/50", bg: "bg-red-950/30", text: "text-red-100" };
  }

  function buildCoverageHeatMap(report) {
    const sources = asArray(report && report.sources);
    const findings = asArray(report && report.findings);
    const coverageRows = asArray(report && report.coverage);
    const repairs = asArray(report && report.autoRepairPlan && report.autoRepairPlan.repairs);
    const graph = report && report.dependencyGraph;
    const history = window.VoltanHealthHistory && window.VoltanHealthHistory.readHistory ? window.VoltanHealthHistory.readHistory() : [];

    const subsystems = SUBSYSTEMS.map((subsystem) => {
      const matchedSources = sources.filter((source) => matchesSubsystemSource(source, subsystem));
      const matchedFindings = findings.filter((finding) => matchesSubsystemFinding(finding, subsystem));
      const matchedCoverage = coverageRows.filter((row) => subsystem.kinds.includes(row.kind));
      const matchedRepairs = repairs.filter((repair) => matchesSubsystemFinding({ rule: repair.rule, message: repair.finding, detail: { sourcePath: repair.sourcePath } }, subsystem));
      const sourceRecordCount = matchedSources.reduce((sum, source) => sum + Number(source.count || 0), 0);
      const coverageScore = matchedCoverage.length ? Math.round(matchedCoverage.reduce((sum, row) => sum + Number(row.score || 0), 0) / matchedCoverage.length) : (matchedSources.length ? 70 : 35);
      const errorPenalty = matchedFindings.filter((finding) => finding.severity === "error").length * 12;
      const warningPenalty = matchedFindings.filter((finding) => finding.severity === "warning").length * 4;
      const infoPenalty = matchedFindings.filter((finding) => finding.severity === "info").length * 1;
      const sourceBonus = Math.min(12, matchedSources.length * 2);
      const graphBonus = graph && graph.nodeCount ? 4 : 0;
      const score = Math.max(0, Math.min(100, Math.round(coverageScore + sourceBonus + graphBonus - errorPenalty - warningPenalty - infoPenalty)));
      return {
        ...subsystem,
        score,
        status: scoreTone(score).label,
        sourceCount: matchedSources.length,
        recordCount: sourceRecordCount,
        findingCount: matchedFindings.length,
        errorCount: matchedFindings.filter((finding) => finding.severity === "error").length,
        warningCount: matchedFindings.filter((finding) => finding.severity === "warning").length,
        infoCount: matchedFindings.filter((finding) => finding.severity === "info").length,
        repairCount: matchedRepairs.length,
        coverageKinds: matchedCoverage.map((row) => ({ kind: row.kind, score: row.score, total: row.total })),
        topFindings: matchedFindings.slice(0, 5).map((finding) => ({ severity: finding.severity, rule: finding.rule, message: finding.message })),
        recommendedAction: buildRecommendation(score, matchedFindings, matchedRepairs)
      };
    });

    const averageScore = subsystems.length ? Math.round(subsystems.reduce((sum, item) => sum + item.score, 0) / subsystems.length) : 0;
    const latestHistory = history[history.length - 1] || null;
    return {
      generatedAt: new Date().toISOString(),
      scriptVersion: SCRIPT_VERSION,
      averageScore,
      subsystemCount: subsystems.length,
      healthyCount: subsystems.filter((item) => item.score >= 85).length,
      watchCount: subsystems.filter((item) => item.score >= 65 && item.score < 85).length,
      needsWorkCount: subsystems.filter((item) => item.score < 65).length,
      trendAnchor: latestHistory ? { generatedAt: latestHistory.generatedAt, healthScore: latestHistory.healthScore, coverageScore: latestHistory.coverageScore } : null,
      subsystems: subsystems.sort((a, b) => a.score - b.score || b.findingCount - a.findingCount)
    };
  }

  function buildRecommendation(score, findings, repairs) {
    if (findings.some((finding) => finding.severity === "error")) return "Clear blocking errors first; they drag down subsystem readiness the fastest.";
    if (repairs.length) return "Use the Auto Repair Engine repair plan to clear the highest-volume warning category for this subsystem.";
    if (score < 65) return "Add source coverage, documentation, and dependency links so this subsystem can join the repository graph.";
    if (score < 85) return "Tighten references and documentation to move this subsystem into the healthy band.";
    return "Healthy. Keep this subsystem covered as new records and modules are added.";
  }

  function exportJson(heatMap) {
    const blob = new Blob([JSON.stringify(heatMap, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `voltanlabs-coverage-heat-map-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportMarkdown(heatMap) {
    const lines = [
      "# VoltanLabs Studio Coverage Heat Map",
      "",
      `Generated: ${heatMap.generatedAt}`,
      `Average score: ${heatMap.averageScore}%`,
      `Healthy: ${heatMap.healthyCount}`,
      `Watch: ${heatMap.watchCount}`,
      `Needs work: ${heatMap.needsWorkCount}`,
      "",
      "## Subsystems",
      "",
      ...heatMap.subsystems.map((item) => [`### ${item.label}`, `- Score: ${item.score}% (${item.status})`, `- Sources: ${item.sourceCount}`, `- Records: ${item.recordCount}`, `- Findings: ${item.findingCount} (${item.errorCount} errors, ${item.warningCount} warnings, ${item.infoCount} info)`, `- Repairs: ${item.repairCount}`, `- Recommendation: ${item.recommendedAction}`, ""].join("\n"))
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `voltanlabs-coverage-heat-map-${new Date().toISOString().replace(/[:.]/g, "-")}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function renderSubsystemCards(heatMap) {
    return heatMap.subsystems.map((item) => {
      const tone = scoreTone(item.score);
      const findings = item.topFindings.map((finding) => `<li><span class="text-gray-400">${escapeHtml(finding.rule)}</span>: ${escapeHtml(finding.message)}</li>`).join("");
      return `<article data-coverage-subsystem="${escapeHtml(item.key)}" class="rounded-2xl border ${tone.border} ${tone.bg} p-5">
        <div class="flex items-start justify-between gap-4">
          <div><p class="text-xs uppercase tracking-wide ${tone.text}">${escapeHtml(item.status)}</p><h3 class="text-xl font-bold text-white mt-1">${escapeHtml(item.label)}</h3></div>
          <strong class="text-4xl text-[#FFD700]">${item.score}%</strong>
        </div>
        <div class="mt-4 h-3 rounded-full bg-black/40 overflow-hidden"><div class="h-full bg-[#FFD700]" style="width:${item.score}%"></div></div>
        <div class="grid grid-cols-3 gap-2 mt-4 text-sm">
          <div><p class="text-gray-400">Sources</p><strong>${item.sourceCount}</strong></div>
          <div><p class="text-gray-400">Records</p><strong>${item.recordCount}</strong></div>
          <div><p class="text-gray-400">Repairs</p><strong>${item.repairCount}</strong></div>
        </div>
        <p class="text-sm text-gray-300 mt-4">Findings: ${item.findingCount} • Errors: ${item.errorCount} • Warnings: ${item.warningCount}</p>
        <p class="text-sm text-emerald-100 mt-3">${escapeHtml(item.recommendedAction)}</p>
        <details class="mt-4"><summary class="cursor-pointer text-sm text-[#FFD700] font-bold">Drill down</summary><ul class="text-sm text-gray-200 list-disc ml-5 mt-3">${findings || "<li>No major findings mapped to this subsystem.</li>"}</ul></details>
      </article>`;
    }).join("");
  }

  function renderCoverageHeatMap(report) {
    const output = document.getElementById("diagnostics");
    if (!output || !report) return;
    const existing = document.getElementById("coverageHeatMap");
    if (existing) existing.remove();
    const heatMap = buildCoverageHeatMap(report);
    report.coverageHeatMap = heatMap;

    output.insertAdjacentHTML("afterbegin", `<section id="coverageHeatMap" class="lg:col-span-2 rounded-2xl border border-[#FFD700]/40 bg-[#1d1a0d]/80 p-5">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-wide text-[#FFD700]">Phase 2.0 Coverage Heat Map</p>
          <h2 class="text-2xl font-bold text-[#FFD700] mt-1">Repository Coverage by Subsystem</h2>
          <p class="text-gray-300 mt-3">Combines validation coverage, source records, diagnostics findings, repair-plan pressure, dependency graph availability, and local health history into a subsystem readiness view.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button id="exportCoverageJson" class="px-3 py-2 rounded-xl border border-[#FFD700] text-[#FFD700] text-sm font-bold">Export JSON</button>
          <button id="exportCoverageMarkdown" class="px-3 py-2 rounded-xl border border-white/20 text-white text-sm font-bold">Export MD</button>
        </div>
      </div>
      <div class="grid md:grid-cols-4 gap-3 mt-5">
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Average</p><strong class="text-2xl text-[#FFD700]">${heatMap.averageScore}%</strong></div>
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Healthy</p><strong class="text-2xl text-[#FFD700]">${heatMap.healthyCount}</strong></div>
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Watch</p><strong class="text-2xl text-[#FFD700]">${heatMap.watchCount}</strong></div>
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Needs Work</p><strong class="text-2xl text-[#FFD700]">${heatMap.needsWorkCount}</strong></div>
      </div>
      ${heatMap.trendAnchor ? `<p class="text-sm text-gray-400 mt-4">Trend anchor: health ${heatMap.trendAnchor.healthScore}% / coverage ${heatMap.trendAnchor.coverageScore}% from ${escapeHtml(new Date(heatMap.trendAnchor.generatedAt).toLocaleString())}</p>` : ""}
      <div class="grid lg:grid-cols-2 gap-5 mt-5">${renderSubsystemCards(heatMap)}</div>
    </section>`);

    const jsonButton = document.getElementById("exportCoverageJson");
    const mdButton = document.getElementById("exportCoverageMarkdown");
    if (jsonButton) jsonButton.addEventListener("click", () => exportJson(heatMap));
    if (mdButton) mdButton.addEventListener("click", () => exportMarkdown(heatMap));
  }

  function boot() {
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (window.VOLTAN_VALIDATION_REPORT) {
        renderCoverageHeatMap(window.VOLTAN_VALIDATION_REPORT);
        window.clearInterval(timer);
      }
      if (attempts > 80) window.clearInterval(timer);
    }, 250);
  }

  window.VoltanCoverageHeatMap = { version: SCRIPT_VERSION, buildCoverageHeatMap, exportJson, exportMarkdown, renderCoverageHeatMap };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
