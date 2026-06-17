// assets/js/databyte-app-shell.js
// Bridge file: old loaders still request this path, so mount the standalone scanner app.
(function () {
  const VERSION = "0897-standalone-app";

  function loadOnce(id, src) {
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.src = src + (src.includes("?") ? "&" : "?") + "v=" + VERSION;
    document.body.appendChild(script);
  }

  function boot() {
    if (!window.location.pathname.includes("databyte-discovery")) return;
    loadOnce("databyteStandaloneAppLoader", "/assets/js/databyte-standalone-app.js");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
