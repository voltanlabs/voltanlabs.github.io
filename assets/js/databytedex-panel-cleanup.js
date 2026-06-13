// assets/js/databytedex-panel-cleanup.js
(function () {
  function hideStandaloneDex() {
    const consoleBody = document.getElementById("databyteSimpleConsoleBody");
    const list = document.getElementById("collectionList");
    if (!list) return;
    const panel = list.parentElement;
    if (!panel) return;

    const insideConsole = consoleBody && consoleBody.contains(panel);
    if (!insideConsole) {
      panel.classList.add("db-simple-source-hidden");
    }
  }

  function renameDexText() {
    document.querySelectorAll("h2, h3, strong, p").forEach((el) => {
      const text = (el.textContent || "").trim();
      if (text === "ByteCoin Collection") el.textContent = "DataByteDex";
      if (text === "Tap a captured sprite to open Codex data.") el.textContent = "Captured sprite records, Dex data, and discovery history.";
    });
  }

  function boot() {
    hideStandaloneDex();
    renameDexText();
    setInterval(function () {
      hideStandaloneDex();
      renameDexText();
    }, 500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
