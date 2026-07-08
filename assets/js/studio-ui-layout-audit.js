// assets/js/studio-ui-layout-audit.js
// Studio Intelligence UI Layout Audit v1.
// Observational only: reports layout risks without changing page or gameplay behavior.
(function () {
  const VERSION = "1.0.0";
  const AUDIT_ID = "studio-ui-layout-audit";

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;" }[char]));
  }

  function scriptSrcs() {
    return Array.from(document.scripts || []).map((script) => script.getAttribute("src") || "").filter(Boolean);
  }

  function findLayoutScripts() {
    const names = [
      "dd-scanner-os-runtime",
      "dd-mobile-game-tray",
      "dd-unified-scanner-shell",
      "dd-battle-centerline-fix",
      "dd-layout-viewport-lock",
      "dd-battle-experience",
      "databyte-discovery-product-app"
    ];
    return scriptSrcs().filter((src) => names.some((name) => src.includes(name)));
  }

  function auditOverflow() {
    const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const bodyWidth = document.body ? document.body.scrollWidth : 0;
    const bodyHeight = document.body ? document.body.scrollHeight : 0;
    const overflowing = [];

    Array.from(document.body ? document.body.querySelectorAll("*") : []).slice(0, 600).forEach((node) => {
      const rect = node.getBoundingClientRect ? node.getBoundingClientRect() : null;
      if (!rect) return;
      if (rect.width > width + 2 || rect.left < -8 || rect.right > width + 8) {
        overflowing.push({
          tag: node.tagName ? node.tagName.toLowerCase() : "node",
          id: node.id || null,
          className: typeof node.className === "string" ? node.className.slice(0, 120) : null,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width)
        });
      }
    });

    return {
      viewport: { width, height },
      document: { width: bodyWidth, height: bodyHeight },
      horizontalOverflow: bodyWidth > width + 2,
      verticalOverflow: bodyHeight > height + 2,
      overflowingElements: overflowing.slice(0, 12)
    };
  }

  function auditScannerOwnership() {
    const scripts = findLayoutScripts();
    const activeWrapperScripts = scripts.filter((src) => (
      src.includes("dd-mobile-game-tray") ||
      src.includes("dd-unified-scanner-shell") ||
      src.includes("dd-battle-centerline-fix")
    ));
    const hasScannerOs = scripts.some((src) => src.includes("dd-scanner-os-runtime"));
    const hasBehaviorGuard = scriptSrcs().some((src) => src.includes("dd-scanner-behavior-4-3"));
    return {
      layoutScripts: scripts,
      hasScannerOs,
      hasBehaviorGuard,
      activeWrapperScripts,
      duplicateLayoutRisk: activeWrapperScripts.length > 0 || scripts.filter((src) => src.includes("dd-scanner-os-runtime")).length > 1
    };
  }

  function classify(report) {
    const findings = [];
    if (report.overflow.horizontalOverflow) findings.push({ severity: "warning", message: "Page has horizontal overflow risk.", detail: report.overflow.document });
    if (report.overflow.overflowingElements.length) findings.push({ severity: "info", message: `${report.overflow.overflowingElements.length} overflowing element sample(s) detected.`, detail: report.overflow.overflowingElements });
    if (report.scanner.duplicateLayoutRisk) findings.push({ severity: "warning", message: "Potential duplicate Scanner/Battle layout ownership detected.", detail: report.scanner.layoutScripts });
    if (location.pathname.includes("databyte-discovery") && !report.scanner.hasScannerOs) findings.push({ severity: "warning", message: "Data Discovery page did not expose dd-scanner-os-runtime in loaded scripts.", detail: report.scanner.layoutScripts });
    if (location.pathname.includes("databyte-discovery") && !report.scanner.hasBehaviorGuard) findings.push({ severity: "info", message: "Data Discovery page did not expose dd-scanner-behavior-4-3 in loaded scripts yet.", detail: report.scanner.layoutScripts });
    if (!findings.length) findings.push({ severity: "ok", message: "No immediate UI layout risks detected.", detail: null });
    return findings;
  }

  function runAudit() {
    const result = {
      id: AUDIT_ID,
      version: VERSION,
      generatedAt: new Date().toISOString(),
      path: location.pathname,
      overflow: auditOverflow(),
      scanner: auditScannerOwnership()
    };
    result.findings = classify(result);
    window.VOLTAN_UI_LAYOUT_AUDIT = result;
    document.dispatchEvent(new CustomEvent("studio:ui-layout-audit-ready", { detail: result }));
    return result;
  }

  function renderAudit(result) {
    const container = document.getElementById("diagnostics");
    if (!container || !result || document.getElementById("studioUiLayoutAudit")) return;
    const warningCount = result.findings.filter((item) => item.severity === "warning").length;
    const infoCount = result.findings.filter((item) => item.severity === "info").length;
    const status = warningCount ? "Attention" : "Clear";
    const statusClass = warningCount ? "text-yellow-200" : "text-emerald-200";
    const rows = result.findings.map((item) => `<li class="mb-2"><span class="${item.severity === "warning" ? "text-yellow-200" : item.severity === "ok" ? "text-emerald-200" : "text-gray-300"}">${escapeHtml(item.severity.toUpperCase())}</span>: ${escapeHtml(item.message)}</li>`).join("");
    container.insertAdjacentHTML("afterbegin", `<section id="studioUiLayoutAudit" class="lg:col-span-2 rounded-2xl border border-[#007BFF]/40 bg-[#102236]/80 p-5">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-wide text-[#FFD700]">Studio Intelligence</p>
          <h2 class="text-2xl font-bold text-[#FFD700] mt-1">UI Layout Audit</h2>
          <p class="text-gray-300 mt-3">Observational audit for overflow, viewport pressure, and duplicate Scanner/Battle layout ownership risk. This panel does not modify gameplay or page layout.</p>
        </div>
        <div class="rounded-xl border border-white/10 bg-black/25 p-4 min-w-[150px]"><p class="text-gray-400 text-sm">Status</p><strong class="text-2xl ${statusClass}">${status}</strong><p class="text-xs text-gray-400 mt-1">${warningCount} warnings • ${infoCount} info</p></div>
      </div>
      <div class="grid md:grid-cols-3 gap-3 mt-5">
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Viewport</p><strong class="text-white">${result.overflow.viewport.width}×${result.overflow.viewport.height}</strong></div>
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Document</p><strong class="text-white">${result.overflow.document.width}×${result.overflow.document.height}</strong></div>
        <div class="rounded-xl border border-white/10 bg-black/25 p-4"><p class="text-gray-400 text-sm">Layout scripts</p><strong class="text-white">${result.scanner.layoutScripts.length}</strong></div>
      </div>
      <ul class="mt-4 text-sm list-disc ml-5">${rows}</ul>
    </section>`);
  }

  function boot() {
    window.setTimeout(() => {
      const result = runAudit();
      renderAudit(result);
    }, 600);
    document.addEventListener("studio:diagnostics-ready", () => window.setTimeout(() => renderAudit(window.VOLTAN_UI_LAYOUT_AUDIT || runAudit()), 100));
  }

  window.VoltanUiLayoutAudit = { version: VERSION, run: runAudit, render: renderAudit };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
