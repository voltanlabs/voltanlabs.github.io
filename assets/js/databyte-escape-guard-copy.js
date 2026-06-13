// assets/js/databyte-escape-guard-copy.js
(function () {
  let lastLostName = "";
  let lastLostCode = "";

  function codeInput() { return document.getElementById("codeInput"); }
  function statusText() { return document.getElementById("scannerStatus"); }
  function stageText() { return document.getElementById("revealStage"); }
  function scanButton() { return document.getElementById("scanBtn"); }
  function randomButton() { return document.getElementById("randomBtn"); }
  function captureResult() { return document.getElementById("captureResult"); }

  function currentName() {
    return document.getElementById("encounterName")?.textContent?.trim() || "";
  }

  function markLost() {
    const result = captureResult()?.textContent || "";
    const stage = stageText()?.textContent || "";
    const collapsed = result.includes("SIGNAL COLLAPSED") || stage.includes("SIGNAL COLLAPSED");
    if (!collapsed) return;

    const input = codeInput();
    lastLostName = currentName() || lastLostName;
    lastLostCode = input?.value?.trim() || lastLostCode;

    if (input && input.value.trim() === lastLostCode) {
      input.value = "";
      input.placeholder = "Signal escaped. Enter a new code.";
    }

    if (statusText()) statusText().textContent = "Signal escaped. A fresh code is required for another discovery.";
    if (scanButton()) scanButton().disabled = false;
    if (randomButton()) randomButton().disabled = false;
  }

  function blockSameCode(event) {
    const input = codeInput();
    const value = input?.value?.trim() || "";
    if (!lastLostCode || value !== lastLostCode) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (stageText()) stageText().textContent = "NEW CODE REQUIRED";
    if (statusText()) statusText().textContent = `${lastLostName || "That signal"} escaped. Use a different code to scan again.`;
  }

  function boot() {
    document.getElementById("scanBtn")?.addEventListener("click", blockSameCode, true);
    document.getElementById("codeInput")?.addEventListener("keydown", function (event) {
      if (event.key === "Enter") blockSameCode(event);
    }, true);
    setInterval(markLost, 600);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
