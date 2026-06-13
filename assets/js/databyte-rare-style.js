// assets/js/databyte-rare-style.js
(function () {
  const NAMES = new Set(["Glitchwyrm", "Mirrormaster", "Proxsentience"]);

  function nameNow() {
    return document.getElementById("encounterName")?.textContent?.trim() || "";
  }

  function loadScriptOnce(id, src) {
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    document.body.appendChild(script);
  }

  function loadFeatureLayers() {
    loadScriptOnce("databyteRareSpawnLoader", "/assets/js/databyte-rare-spawn.js");
    loadScriptOnce("databyteMissionsLoader", "/assets/js/databyte-missions.js");
    loadScriptOnce("databyteInventoryLoader", "/assets/js/databyte-inventory.js");
    loadScriptOnce("databyteBattleLoader", "/assets/js/databyte-battle.js");
    loadScriptOnce("databytePanelStateLoader", "/assets/js/databyte-panel-state.js");
    loadScriptOnce("databyteAppShellLoader", "/assets/js/databyte-app-shell.js");
    loadScriptOnce("databyteSimpleAdminConsoleLoader", "/assets/js/databyte-admin-console-simple.js");
  }

  function apply() {
    const active = NAMES.has(nameNow());
    const card = document.getElementById("encounterCard");
    const orb = document.getElementById("spriteOrb");
    const stage = document.getElementById("revealStage");
    const status = document.getElementById("scannerStatus");

    if (card) {
      card.style.borderColor = active ? "rgba(192,132,252,.9)" : "";
      card.style.boxShadow = active ? "0 0 34px rgba(192,132,252,.30)" : "";
    }
    if (orb) {
      orb.style.borderColor = active ? "rgba(192,132,252,.9)" : "";
      orb.style.boxShadow = active ? "0 0 38px rgba(192,132,252,.42)" : "";
    }
    if (active) {
      if (stage) stage.textContent = "SPECIAL SIGNAL DETECTED";
      if (status) status.textContent = `${nameNow()} rare reading stabilized.`;
    }
  }

  function boot() {
    loadFeatureLayers();
    apply();
    const target = document.getElementById("encounterName");
    if (target) new MutationObserver(apply).observe(target, { childList: true, characterData: true, subtree: true });
    setInterval(apply, 1500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
