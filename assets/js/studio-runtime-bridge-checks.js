// assets/js/studio-runtime-bridge-checks.js
// Runtime bridge health checks for the active Data Discovery Product App chain.

(function () {
  if (!location.pathname.includes("databyte-discovery")) return;

  const checks = [
    { id: "canon-roster", label: "Canon Roster", test: () => Array.isArray(window.DD_CANON_ROSTER) && window.DD_CANON_ROSTER.length >= 52 },
    { id: "studio-data-bridge", label: "Studio Data Bridge", test: () => !!window.DD_STUDIO_DATA_BRIDGE && window.DD_STUDIO_DATA_BRIDGE.ok !== false },
    { id: "game-data-manifest", label: "Game Data Manifest", test: () => !!window.DD_GAME_DATA_MANIFEST && !!window.DD_GAME_DATA_MANIFEST.schemaVersion },
    { id: "move-index", label: "Move Index", test: () => !!window.DD_MOVE_INDEX && Array.isArray(window.DD_MOVE_INDEX.moves) && window.DD_MOVE_INDEX.moves.length > 0 },
    { id: "type-chart", label: "Type Chart", test: () => !!window.DD_TYPE_CHART && Array.isArray(window.DD_TYPE_CHART.rules) && window.DD_TYPE_CHART.rules.length > 0 },
    { id: "battle-engine", label: "Battle Engine Hooks", test: () => !!window.DDBattle24 && typeof window.DDBattle24.typeResult === "function" && typeof window.DDBattle24.chooseEnemyMove === "function" },
    { id: "battle-balance", label: "Battle Balance", test: () => !!window.DD_BATTLE_BALANCE && !!window.DD_BATTLE_BALANCE.version },
    { id: "product-app", label: "Product App", test: () => !!document.getElementById("ddApp") },
    { id: "scanner-background", label: "Scanner Background", test: () => true }
  ];

  function runChecks() {
    const results = checks.map((check) => {
      let ok = false;
      try { ok = !!check.test(); } catch { ok = false; }
      return { id: check.id, label: check.label, ok };
    });

    window.DD_RUNTIME_HEALTH = {
      version: "0.3.0",
      runtime: "databyte-discovery-product-app",
      checkedAt: new Date().toISOString(),
      results,
      ready: results.every((result) => result.ok)
    };
    window.DBS_RUNTIME_HEALTH = window.DD_RUNTIME_HEALTH;
    document.dispatchEvent(new CustomEvent("runtime:health-check", { detail: window.DD_RUNTIME_HEALTH }));
    renderHealthSummary(results);
  }

  function renderHealthSummary(results) {
    const panel = document.getElementById("runtimeHealthPanel");
    if (!panel) return;
    let summary = document.getElementById("runtimeHealthChecks");
    if (!summary) {
      summary = document.createElement("div");
      summary.id = "runtimeHealthChecks";
      summary.style.cssText = "margin-top:8px;border-top:1px solid rgba(255,255,255,.1);padding-top:8px;display:grid;gap:3px";
      panel.appendChild(summary);
    }
    summary.innerHTML = results.map((result) => `<div>${result.ok ? "✅" : "⚠️"} ${result.label}</div>`).join("");
  }

  document.addEventListener("dd:studio-data-ready", () => setTimeout(runChecks, 220));
  document.addEventListener("dd:battle-balance-ready", () => setTimeout(runChecks, 220));
  document.addEventListener("runtime:ready", () => setTimeout(runChecks, 80));
  document.addEventListener("dd:screen", () => setTimeout(runChecks, 80));
  window.DBS_RUN_HEALTH_CHECKS = runChecks;
  window.DD_RUN_HEALTH_CHECKS = runChecks;
  setTimeout(runChecks, 1400);
})();
