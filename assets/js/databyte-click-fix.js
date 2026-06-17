// assets/js/databyte-click-fix.js
// Keeps the native scanner shell interactive while legacy layout scripts are still present.
(function () {
  const STYLE_ID = "databyteNativeClickFixStyles";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      body.dd-native-scanner #gamePanel,
      body.dd-native-scanner #gamePanel * {
        pointer-events: auto;
      }

      body.dd-native-scanner #gamePanel:before,
      body.dd-native-scanner #gamePanel .scan-line,
      body.dd-native-scanner #gamePanel .scan-bg > .absolute,
      body.dd-native-scanner #gamePanel .scan-bg:before,
      body.dd-native-scanner #gamePanel .scan-bg:after {
        pointer-events: none !important;
      }

      body.dd-native-scanner #gamePanel > div > div:nth-child(2) {
        position: relative !important;
        z-index: 5 !important;
      }

      body.dd-native-scanner #gamePanel .scan-bg {
        z-index: 1 !important;
        pointer-events: none !important;
      }

      body.dd-native-scanner #gamePanel .scan-bg .relative.z-10 {
        pointer-events: none !important;
      }

      body.dd-native-scanner .dd-scanner-controls,
      body.dd-native-scanner .dd-scanner-controls *,
      body.dd-native-scanner #codeInput,
      body.dd-native-scanner #scanBtn,
      body.dd-native-scanner #randomBtn {
        position: relative !important;
        z-index: 50 !important;
        pointer-events: auto !important;
        touch-action: manipulation !important;
      }

      body.dd-native-scanner #codeInput {
        touch-action: auto !important;
        user-select: text !important;
        -webkit-user-select: text !important;
      }

      #ddNativeOverlayRoot:empty,
      #ddNativeOverlayRoot:not(:has(.dd-native-overlay)) {
        pointer-events: none !important;
        display: none !important;
      }

      #ddNativeOverlayRoot:has(.dd-native-overlay) {
        display: block !important;
        pointer-events: none !important;
      }

      #ddNativeOverlayRoot .dd-native-overlay,
      #ddNativeOverlayRoot .dd-native-overlay * {
        pointer-events: auto !important;
      }

      .dd-native-menu {
        pointer-events: none !important;
      }

      .dd-native-menu .dd-native-fab,
      .dd-native-menu.open .dd-native-stack,
      .dd-native-menu.open .dd-native-stack * {
        pointer-events: auto !important;
      }
    `;
    document.head.appendChild(style);
  }

  function clearLegacyBlockers() {
    document.querySelectorAll(".dd-start-screen,.dd-panel-overlay:not(.open),.db-signal-overlay.hidden,.db-drift-screen").forEach((el) => el.remove());
    document.body.classList.remove("dd-app-starting", "dd-ui-state-signal", "dd-ui-state-modal");
  }

  function boot() {
    injectStyles();
    clearLegacyBlockers();
    setInterval(clearLegacyBlockers, 700);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
