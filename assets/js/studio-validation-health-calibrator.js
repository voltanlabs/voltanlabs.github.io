// assets/js/studio-validation-health-calibrator.js
// Stabilizes repository health scoring so warnings/info findings do not collapse the dashboard to zero.

(function () {
  const VERSION = "1.0.0";
  const MAX_ATTEMPTS = 20;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function classifyStatus(score, errorCount) {
    if (errorCount > 0) return score >= 50 ? "attention" : "critical";
    if (score >= 85) return "healthy";
    if (score >= 65) return "stable";
    if (score >= 40) return "attention";
    return "critical";
  }

  function calibratedHealth(report) {
    const errorPenalty = clamp((report.errorCount || 0) * 18, 0, 45);
    const warningPenalty = clamp((report.warningCount || 0) * 1.5, 0, 25);
    const infoPenalty = clamp((report.infoCount || 0) * 0.25, 0, 10);
    const coveragePenalty = clamp((100 - (report.coverageScore || 100)) * 0.2, 0, 20);
    const rawScore = 100 - errorPenalty - warningPenalty - infoPenalty - coveragePenalty;
    return {
      version: VERSION,
      healthScore: clamp(Math.round(rawScore), 0, 100),
      status: classifyStatus(clamp(Math.round(rawScore), 0, 100), report.errorCount || 0),
      penalties: {
        errors: Math.round(errorPenalty),
        warnings: Math.round(warningPenalty),
        info: Math.round(infoPenalty),
        coverage: Math.round(coveragePenalty)
      }
    };
  }

  function renderSummary(report) {
    const summary = document.getElementById("summary");
    if (!summary || !report) return;
    const cards = [
      ["Health", `${report.healthScore}%`],
      ["Status", report.healthStatus || "unknown"],
      ["Sources", report.sources ? report.sources.length : 0],
      ["Records", report.recordCount || 0],
      ["IDs", report.idCount || 0],
      ["Links", report.linkCount || 0],
      ["Errors", report.errorCount || 0],
      ["Coverage", `${report.coverageScore || 0}%`]
    ];
    summary.className = "grid md:grid-cols-4 xl:grid-cols-8 gap-4 mt-10";
    summary.innerHTML = cards.map(([label, value]) => `<div class="rounded-2xl border border-white/10 bg-[#2C3E50] p-5"><p class="text-gray-300 text-sm">${label}</p><strong class="text-3xl text-[#FFD700]">${value}</strong></div>`).join("");
  }

  function calibrate() {
    const report = window.VOLTAN_VALIDATION_REPORT;
    if (!report || report.healthCalibrated) return !!report;
    const result = calibratedHealth(report);
    report.originalHealthScore = report.healthScore;
    report.healthScore = result.healthScore;
    report.healthStatus = result.status;
    report.healthCalibrated = true;
    report.healthCalibration = result;
    window.VOLTAN_VALIDATION_REPORT = report;
    renderSummary(report);
    document.dispatchEvent(new CustomEvent("validation:health-calibrated", { detail: { report, calibration: result } }));
    return true;
  }

  function start(attempt) {
    if (calibrate()) return;
    if (attempt >= MAX_ATTEMPTS) return;
    setTimeout(() => start(attempt + 1), 100);
  }

  window.VoltanValidationHealthCalibrator = { version: VERSION, calibrate, calibratedHealth };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => start(0));
  else start(0);
})();
