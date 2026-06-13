// assets/js/databyte-special-panel.js
(function () {
  const KEY = "vl_databyte_special_signals_v1";
  const SPECIAL_NAMES = new Set(["Glitchwyrm", "Mirrormaster", "Proxsentience"]);

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }

  function write(list) {
    localStorage.setItem(KEY, JSON.stringify(list.slice(-100)));
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
    if (!SPECIAL_NAMES.has(name)) return;

    const type = document.getElementById("encounterType")?.textContent?.trim() || "Unknown";
    const signature = `${name}:${type}`;
    const list = read();
    const last = list[list.length - 1];

    if (!last || last.signature !== signature) {
      list.push({ name, type, signature, detectedAt: new Date().toISOString() });
      write(list);
    }
  }

  function render() {
    makePanel();
    logCurrentSignal();

    const panel = document.getElementById("specialSignalPanel");
    if (!panel) return;
    const list = read();
    const last = list[list.length - 1];
    panel.innerHTML = `
      <div class="text-purple-200 font-bold">Special Signals</div>
      <p class="text-gray-300 mt-1">v0.81 signal monitoring is online.</p>
      <div class="mt-2 text-xs text-purple-100">Signals Logged: <strong>${list.length}</strong></div>
      <div class="mt-1 text-xs text-gray-400">Last Signal: <strong>${last ? last.name : "None"}</strong></div>
      <div class="mt-1 text-xs text-gray-500">Watching: Glitchwyrm, Mirrormaster, Proxsentience</div>`;
  }

  function boot() {
    render();
    const target = document.getElementById("encounterName");
    if (target) {
      new MutationObserver(render).observe(target, { childList: true, characterData: true, subtree: true });
    }
    setInterval(render, 1500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
