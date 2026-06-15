// assets/js/databyte-special-panel.js
(function () {
  const KEY = "vl_databyte_special_signals_v1";
  const SPECIAL_NAMES = new Set(["Glitchwyrm", "Mirrormaster", "Proxsentience"]);
  let lastSignature = "";

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }

  function write(list) {
    localStorage.setItem(KEY, JSON.stringify(list.slice(-100)));
    window.dispatchEvent(new CustomEvent("databyte:progress-updated"));
  }

  function currentName() {
    return document.getElementById("encounterName")?.textContent?.trim() || "";
  }

  function makePanel() {
    const adminCard = document.getElementById("adminCard");
    if (!adminCard || document.getElementById("specialSignalPanel")) return;
    const panel = document.createElement("div");
    panel.id = "specialSignalPanel";
    panel.className = "mt-4 bg-purple-500/10 border border-purple-300/30 rounded-2xl p-4 text-sm";
    adminCard.appendChild(panel);
  }

  function logCurrentSignal() {
    const name = currentName();
    if (!SPECIAL_NAMES.has(name)) return false;

    const type = document.getElementById("encounterType")?.textContent?.trim() || "Unknown";
    const signature = `${name}:${type}`;
    const list = read();
    const last = list[list.length - 1];

    if (!last || last.signature !== signature) {
      list.push({ name, type, signature, detectedAt: new Date().toISOString() });
      write(list);
      return true;
    }
    return false;
  }

  function stateSignature() {
    const list = read();
    const last = list[list.length - 1];
    return JSON.stringify({ count: list.length, last: last?.signature || "none", current: currentName() });
  }

  function render(force = false) {
    makePanel();
    const changed = logCurrentSignal();

    const panel = document.getElementById("specialSignalPanel");
    if (!panel) return;

    const nextSignature = stateSignature();
    if (!force && !changed && nextSignature === lastSignature && panel.dataset.rendered === "true") return;
    lastSignature = nextSignature;
    panel.dataset.rendered = "true";

    const list = read();
    const last = list[list.length - 1];
    panel.innerHTML = `
      <div class="text-purple-200 font-bold">Special Signals</div>
      <div class="mt-2 text-xs text-purple-100">Signals Logged: <strong>${list.length}</strong></div>
      <div class="mt-1 text-xs text-gray-400">Last Signal: <strong>${last ? last.name : "None"}</strong></div>
      <div class="mt-1 text-xs text-gray-500">Watching: Glitchwyrm, Mirrormaster, Proxsentience</div>`;
  }

  function scheduleRender() {
    requestAnimationFrame(() => render());
  }

  function boot() {
    render(true);
    const target = document.getElementById("encounterName");
    if (target) {
      new MutationObserver(scheduleRender).observe(target, { childList: true, characterData: true, subtree: true });
    }
    window.addEventListener("databyte:progress-updated", scheduleRender);
    window.addEventListener("storage", scheduleRender);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();