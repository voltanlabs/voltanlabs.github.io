// assets/js/databyte-app-shell.js
// Bridge file: old loaders still request this path, so route them into the scanner-root app flow.
(function () {
  const VERSION = "0896-root-boot";

  function loadOnce(id, src) {
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.src = src + (src.includes("?") ? "&" : "?") + "v=" + VERSION;
    document.body.appendChild(script);
  }

  function boot() {
    if (!window.location.pathname.includes("databyte-discovery")) return;
    loadOnce("ddRootBridgeLoader", "/assets/js/dd-root.js");
    loadOnce("databyteNativeShellBridgeLoader", "/assets/js/databyte-app-shell-v2.js");
    loadOnce("databyteClickFixBridgeLoader", "/assets/js/databyte-click-fix.js");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
