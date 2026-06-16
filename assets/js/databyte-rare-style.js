// assets/js/databyte-rare-style.js
(function () {
  const NAMES = new Set(["Glitchwyrm", "Mirrormaster", "Proxsentience"]);
  const FEATURE_VERSION = "0871-battle-phase2";

  function nameNow() {
    const el = document.getElementById("encounterName");
    return el ? el.textContent.trim() : "";
  }

  function withVersion(src) {
    return src.includes("?") ? `${src}&v=${FEATURE_VERSION}` : `${src}?v=${FEATURE_VERSION}`;
  }

  function loadScriptOnce(id, src) {
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.src = withVersion(src);
    document.body.appendChild(script);
  }

  function loadStyleOnce(id, href) {
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = withVersion(href);
    document.head.appendChild(link);
  }

  function loadFeatureLayers() {
    loadStyleOnce("databyteScannerLayoutStyles", "/assets/css/databyte-scanner-layout.css");
    loadStyleOnce("databyteHideOriginalStatusStyles", "/assets/css/databyte-hide-original-status.css");
    loadScriptOnce("databyteVersionSyncLoader", "/assets/js/databyte-version-sync.js");
    loadScriptOnce("databyteRareSpawnLoader", "/assets/js/databyte-rare-spawn.js");
    loadScriptOnce("databyteMissionsLoader", "/assets/js/databyte-missions.js");
    loadScriptOnce("databyteInventoryLoader", "/assets/js/databyte-inventory.js");
    loadScriptOnce("databytePartyLoader", "/assets/js/databyte-party.js");
    loadScriptOnce("databyteSignalStageLoader", "/assets/js/databyte-signal-stage.js");
    loadScriptOnce("databyteBattleLoader", "/assets/js/databyte-battle.js");
    loadScriptOnce("databyteBattlePhase2Loader", "/assets/js/databyte-battle-phase2.js");
    loadScriptOnce("databytePanelStateLoader", "/assets/js/databyte-panel-state.js");
    loadScriptOnce("databyteAppShellLoader", "/assets/js/databyte-app-shell.js");
    loadScriptOnce("databyteAdminConsoleLoader", "/assets/js/databyte-admin-console.js");
    loadScriptOnce("databyteScannerWorkspaceLoader", "/assets/js/databyte-scanner-workspace.js");
    loadScriptOnce("databyteDexPanelCleanupLoader", "/assets/js/databytedex-panel-cleanup.js");
    loadScriptOnce("databyteDexActionRouterLoader", "/assets/js/databytedex-action-router.js");
    loadScriptOnce("databyteScannerEffectsLoader", "/assets/js/databyte-scanner-effects.js");
    loadScriptOnce("databyteSpritePresentationLoader", "/assets/js/databyte-sprite-presentation.js");
    loadScriptOnce("databyteStatusCenterLoader", "/assets/js/databyte-status-center.js");
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
      if (status) status.textContent = nameNow() + " rare reading stabilized.";
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