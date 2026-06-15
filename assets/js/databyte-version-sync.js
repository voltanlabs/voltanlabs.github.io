// assets/js/databyte-version-sync.js
(function () {
  const VERSION = "v0.86.5 Data Discovery";
  const CACHE_VERSION = "0865-data-discovery";

  window.DATABYTE_DISCOVERY_VERSION = VERSION;
  window.DATABYTE_DISCOVERY_CACHE_VERSION = CACHE_VERSION;

  function shouldReplace(text) {
    return /^v\d+\.\d+/i.test(text) || /^v0\.[0-9.]+/i.test(text) || /scanner evolution/i.test(text) || /console windows/i.test(text) || /app shell/i.test(text);
  }

  function syncVisibleVersions() {
    document.querySelectorAll("span, strong, small, p").forEach((el) => {
      if (!el || el.children.length) return;
      const text = (el.textContent || "").trim();
      if (shouldReplace(text)) el.textContent = VERSION;
    });
  }

  function syncMeta() {
    document.documentElement.dataset.databyteVersion = VERSION;
    document.body?.setAttribute("data-databyte-version", VERSION);
  }

  function run() {
    syncMeta();
    syncVisibleVersions();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();

  setInterval(run, 800);
})();