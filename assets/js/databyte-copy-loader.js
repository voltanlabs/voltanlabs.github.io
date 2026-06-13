// assets/js/databyte-copy-loader.js
(function () {
  const files = [
    ["databytePartyCopyLoader", "/assets/js/databyte-party-copy.js"],
    ["databyteBattleCopyLoader", "/assets/js/databyte-battle-copy.js"],
    ["databyteEscapeGuardCopyLoader", "/assets/js/databyte-escape-guard-copy.js"],
    ["databyteCaptureLoopCopyLoader", "/assets/js/databyte-capture-loop-copy.js"]
  ];

  function loadOnce(id, src) {
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    document.body.appendChild(script);
  }

  function boot() {
    files.forEach(([id, src]) => loadOnce(id, src));
    console.log("DataByte copy stack loaded for testing.");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
