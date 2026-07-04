// assets/js/studio-runtime-bridge-checks.js
// Runtime bridge health checks for Data Discovery.

(function () {
  if (!location.pathname.includes("databyte-discovery")) return;

  const checks = [
    { id: "capture-pool", label: "Capture Pool", test: () => !!window.DBS_CAPTURE_POOL && window.DBS_CAPTURE_POOL.size > 0 },
    { id: "battle-balance", label: "Battle Balance", test: () => !!window.DBS_BATTLE_BALANCE && !!window.DBS_BATTLE_BALANCE.version },
    { id: "move-index", label: "Move Index", test: () => !!window.DBS_MOVE_INDEX && Array.isArray(window.DBS_MOVE_INDEX.moves) && window.DBS_MOVE_INDEX.moves.length > 0 },
    { id: "type-chart", label: "Type Chart", test: () => !!window.DBS_TYPE_CHART && Array.isArray(window.DBS_TYPE_CHART.rules) && window.DBS_TYPE_CHART.rules.length > 0 },
    { id: "ability-index", label: "Ability Index", test: () => !!window.DBS_ABILITY_INDEX && Array.isArray(window.DBS_ABILITY_INDEX.abilities) && window.DBS_ABILITY_INDEX.abilities.length > 0 },
    { id: "scanner-encounter-api", label: "Scanner Encounter API", test: () => typeof window.ddGetEncounter === "function" }
  ];

  function runChecks() {
    const results = checks.map((check) => {
      let ok = false;
      try { ok = !!check.test(); } catch { ok = false; }
      return { id: check.id, label: check.label, ok };
    });

    window.DBS_RUNTIME_HEALTH = { version: "0.1.0", checkedAt: new Date().toISOString(), results, ready: results.every((result) => result.ok) };
    document.dispatchEvent(new CustomEvent("runtime:health-check", { detail: window.DBS_RUNTIME_HEALTH }));
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

  document.addEventListener("runtime:ready", () => setTimeout(runChecks, 80));
  document.addEventListener("dd:screen", () => setTimeout(runChecks, 80));
  window.DBS_RUN_HEALTH_CHECKS = runChecks;
})();
