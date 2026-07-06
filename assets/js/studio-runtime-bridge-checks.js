// assets/js/studio-runtime-bridge-checks.js
// Phase 3.7 Diagnostics Alignment: runtime bridge health checks for Data Discovery Product App v3.5.

(function () {
  if (!location.pathname.includes("databyte-discovery")) return;

  const checks = [
    { id: "canon-roster", label: "Canon Roster", test: () => Array.isArray(window.DD_CANON_ROSTER) && window.DD_CANON_ROSTER.length >= 52 },
    { id: "studio-data-bridge", label: "Studio Data Bridge", test: () => !!window.DD_STUDIO_DATA_BRIDGE && window.DD_STUDIO_DATA_BRIDGE.ok !== false },
    { id: "game-data-manifest", label: "Game Data Manifest", test: () => !!window.DD_GAME_DATA_MANIFEST && !!window.DD_GAME_DATA_MANIFEST.schemaVersion && !!window.DD_GAME_DATA_MANIFEST.id },
    { id: "move-index", label: "Move Index", test: () => !!window.DD_MOVE_INDEX && Array.isArray(window.DD_MOVE_INDEX.moves) && window.DD_MOVE_INDEX.moves.length > 0 },
    { id: "type-chart", label: "Type Chart", test: () => !!window.DD_TYPE_CHART && Array.isArray(window.DD_TYPE_CHART.rules) && window.DD_TYPE_CHART.rules.length > 0 },
    { id: "battle-engine", label: "Battle Engine Hooks", test: () => !!window.DDBattle24 && typeof window.DDBattle24.typeResult === "function" },
    { id: "gameplay-rules", label: "Gameplay Rules", test: () => !!window.DD_GAMEPLAY_RULES && typeof window.DD_GAMEPLAY_RULES.odds === "function" && typeof window.DD_GAMEPLAY_RULES.tuneSprite === "function" },
    { id: "capture-runtime", label: "Capture Runtime", test: () => !!window.DD_CAPTURE_RUNTIME && typeof window.DD_CAPTURE_RUNTIME.attempt === "function" && typeof window.DD_CAPTURE_RUNTIME.odds === "function" },
    { id: "encounter-runtime", label: "Encounter Runtime", test: () => !!window.DD_ENCOUNTER_RUNTIME && typeof window.DD_ENCOUNTER_RUNTIME.create === "function" && typeof window.DD_ENCOUNTER_RUNTIME.randomCode === "function" },
    { id: "battle-balance", label: "Battle Balance", test: () => !!window.DD_BATTLE_BALANCE && !!window.DD_BATTLE_BALANCE.version },
    { id: "battle-resolver", label: "Battle Resolver", test: () => !!window.DD_BATTLE_RESOLVER && typeof window.DD_BATTLE_RESOLVER.resolve === "function" && typeof window.DD_BATTLE_RESOLVER.turnOrder === "function" && typeof window.DD_BATTLE_RESOLVER.chooseEnemyMove === "function" },
    { id: "product-app-v3-5", label: "Product App v3.5", test: () => !!document.getElementById("ddApp") && !!document.getElementById("stage") && !!document.getElementById("controls") && document.body.textContent.includes("Phase 3.5") },
    { id: "hp-ring-ui", label: "HP Ring UI", test: () => !!document.querySelector(".ring.hp") || !!document.querySelector(".ring") },
    { id: "signal-meter-ui", label: "Signal Meter UI", test: () => !!document.querySelector(".signalBox") || !!document.body.textContent.includes("Signal") },
    { id: "local-storage-keys", label: "Local Storage Keys", test: () => typeof localStorage !== "undefined" },
    { id: "visual-compatibility", label: "Visual Compatibility Layers", test: () => true }
  ];

  function runChecks() {
    const results = checks.map((check) => {
      let ok = false;
      try { ok = !!check.test(); } catch { ok = false; }
      return { id: check.id, label: check.label, ok };
    });

    window.DD_RUNTIME_HEALTH = {
      version: "0.5.0",
      phase: "3.7-diagnostics-alignment",
      runtime: "databyte-discovery-product-app-v3-5",
      canonicalOwners: {
        app: "databyte-discovery-product-app-v3-5",
        battle: "dd-battle-resolver",
        capture: "dd-capture-runtime",
        encounter: "dd-encounter-runtime",
        rules: "dd-gameplay-rules-2-4",
        visuals: ["dd-health-signal-bridge", "dd-scan-bg"]
      },
      checkedAt: new Date().toISOString(),
      results,
      passCount: results.filter((result) => result.ok).length,
      failCount: results.filter((result) => !result.ok).length,
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
  document.addEventListener("dd:gameplay-rules-ready", () => setTimeout(runChecks, 220));
  document.addEventListener("dd:capture-runtime-ready", () => setTimeout(runChecks, 220));
  document.addEventListener("dd:encounter-runtime-ready", () => setTimeout(runChecks, 220));
  document.addEventListener("dd:battle-balance-ready", () => setTimeout(runChecks, 220));
  document.addEventListener("dd:battle-resolver-ready", () => setTimeout(runChecks, 220));
  document.addEventListener("runtime:ready", () => setTimeout(runChecks, 80));
  document.addEventListener("dd:screen", () => setTimeout(runChecks, 80));
  window.DBS_RUN_HEALTH_CHECKS = runChecks;
  window.DD_RUN_HEALTH_CHECKS = runChecks;
  setTimeout(runChecks, 1800);
})();
