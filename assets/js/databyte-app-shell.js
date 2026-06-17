// assets/js/databyte-app-shell.js
// Bridge file: old loaders still request this path, so route it into the native scanner shell.
(function () {
  const VERSION = "0894-native-bridge";

  function loadOnce(id, src) {
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.src = src + (src.includes("?") ? "&" : "?") + "v=" + VERSION;
    document.body.appendChild(script);
  }

  function boot() {
    if (!window.location.pathname.includes("databyte-discovery")) return;
    loadOnce("databyteAutoStartBridgeLoader", "/assets/js/databyte-auto-start.js");
    loadOnce("databyteNativeShellBridgeLoader", "/assets/js/databyte-app-shell-v2.js");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
