// assets/js/databyte-rare-style.js
// Data Discovery standalone loader.
// This file remains loaded by databyte-discovery.html, so it is now the handoff point
// from the legacy page into the standalone mobile-app container.
(function () {
  const FEATURE_VERSION = "0911-boot-cloak";

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

  function retireLegacyLayers() {
    document.getElementById("databyteSignalCollapseLoader")?.remove();
    document.getElementById("databyteContainerRefineLoader")?.remove();
    document.getElementById("databyteFullscreenShellLoader")?.remove();
    document.getElementById("databyteSignalStageLoader")?.remove();
    document.getElementById("databyteAppShellLoader")?.remove();
    document.getElementById("databyteNativeAppShellLoader")?.remove();
    document.getElementById("databyteAutoStartLoader")?.remove();
    document.getElementById("databyteSignalDriftStyles")?.remove();
    document.getElementById("databyteContainerRefineStyles")?.remove();
    document.getElementById("databyteFullscreenShellStyles")?.remove();
    document.getElementById("databyteSignalStageStyles")?.remove();
    document.getElementById("databyteAppShellStyles")?.remove();
    document.getElementById("databyteNativeScannerShellStyles")?.remove();
    document.querySelector(".dd-app-shell")?.remove();
    document.querySelectorAll(".db-drift-screen,.db-storage-summary,.db-signal-overlay,.dd-floating-menu,.dd-panel-overlay,.db-app-topbar").forEach((el) => el.remove());
    document.body.classList.remove("dd-fullscreen-mode", "dd-app-starting", "dd-mode-signal", "dd-mode-battle", "dd-ui-state-signal", "dd-ui-state-battle", "dd-ui-state-modal", "dd-native-scanner", "dd-root");
  }

  function boot() {
    retireLegacyLayers();
    loadScriptOnce("databyteStandaloneAppLoader", "/assets/js/databyte-standalone-app.js");
    loadScriptOnce("ddScanBgLoader", "/assets/js/dd-scan-bg.js");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();