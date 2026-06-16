// assets/js/databyte-container-refine.js
(function () {
  const STYLE_ID = "databyteContainerRefineStyles";
  let lastLaunch = 0;

  function text(el) { return (el && el.textContent ? el.textContent : "").trim(); }
  function chanceValue() { return Number(String(document.getElementById("chanceText")?.textContent || "0").replace(/[^0-9]/g, "")) || 0; }
  function rarity() { return (document.getElementById("encounterRarity")?.textContent || "common").toLowerCase(); }
  function decay() { const r = rarity(); return r.includes("legendary") ? 4 : r.includes("epic") ? 6 : r.includes("rare") ? 8 : 10; }

  function normalizeString(value) {
    return String(value || "")
      .replace(/DataDataByteCoin/gi, "DataByteCoin")
      .replace(/DD+BC-(\d+)/g, "DBC-$1")
      .replace(/stored in DataByteCoin DBC-(\d+)/gi, "stored in DataByteCoin DBC-$1")
      .replace(/stored in BC-(\d+)/gi, "stored in DataByteCoin DBC-$1")
      .replace(/\bBC-(\d+)/g, "DBC-$1");
  }

  function normalizeVisibleText(root) {
    const walker = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const fixed = normalizeString(node.nodeValue);
      if (fixed !== node.nodeValue) node.nodeValue = fixed;
    });
  }

  function css() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `.db-storage-summary{background:rgba(15,23,42,.76);border:1px solid rgba(52,211,153,.45);border-radius:14px;padding:10px;text-align:center;color:#A7F3D0;font-weight:800;display:grid;gap:5px}.db-storage-summary strong{color:#FFD700}.db-stored-clean .db-signal-meter{display:none!important}.db-stored-clean [data-signal-action='capture'],.db-stored-clean [data-signal-action='battle']{opacity:.45;pointer-events:none}`;
    document.head.appendChild(style);
  }

  function maybeLowerSignal() {
    const chance = document.getElementById("chanceText");
    if (!chance) return;
    const before = chanceValue();
    if (!before) return;
    const after = Math.max(5, before - decay());
    if (after !== before) chance.textContent = `${after}%`;
  }

  function captureResultText() { return normalizeString(document.getElementById("captureResult")?.textContent || ""); }
  function isStored(value) { return /captured|stored|created|success/i.test(value || ""); }
  function isFailure(value) { return /failed|escaped|breakout|collapsed/i.test(value || ""); }
  function dbc(value) { return normalizeString(value).match(/DBC-\d+/i)?.[0]?.toUpperCase() || "DBC-????"; }

  function addStorageSummary() {
    const overlay = document.getElementById("databyteSignalOverlay");
    if (!overlay || overlay.classList.contains("hidden")) return;
    const result = captureResultText();
    const feedback = Array.from(overlay.querySelectorAll(".db-signal-feedback")).find(Boolean);
    const visible = text(overlay);
    if (!isStored(result) && !isStored(visible)) return;
    overlay.classList.add("db-stored-clean");
    if (overlay.querySelector(".db-storage-summary")) return;
    const name = document.getElementById("encounterName")?.textContent?.trim() || "DataByteSprite";
    const rare = document.getElementById("encounterRarity")?.textContent?.trim() || "Unknown";
    const summary = document.createElement("div");
    summary.className = "db-storage-summary";
    summary.innerHTML = `<div>SIGNAL STORED</div><div><strong>${name}</strong> contained successfully.</div><div>Container: <strong>${dbc(result || visible)}</strong></div><div>Rarity: <strong>${rare}</strong></div>`;
    if (feedback) feedback.insertAdjacentElement("beforebegin", summary);
    else overlay.querySelector(".db-signal-bottom")?.prepend(summary);
  }

  function watchLaunches(event) {
    const button = event.target.closest("button");
    if (!button) return;
    if (!/launch databytecoin/i.test(text(button))) return;
    lastLaunch = Date.now();
    const before = chanceValue();
    setTimeout(function () {
      const result = captureResultText();
      normalizeVisibleText(document.body);
      if (isStored(result)) { addStorageSummary(); return; }
      if (isFailure(result) && chanceValue() >= before) maybeLowerSignal();
    }, 180);
  }

  function scan() {
    css();
    normalizeVisibleText(document.body);
    addStorageSummary();
    if (lastLaunch && Date.now() - lastLaunch < 900) {
      const result = captureResultText();
      if (isFailure(result)) maybeLowerSignal();
    }
  }

  function boot() {
    css();
    document.addEventListener("click", watchLaunches, true);
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true, characterData: true });
    setInterval(scan, 1000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();