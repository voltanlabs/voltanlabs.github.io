// assets/js/databyte-special-panel.js
(function () {
  const KEY = "vl_databyte_special_signals_v1";

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }

  function makePanel() {
    const adminCard = document.getElementById("adminCard");
    if (!adminCard || document.getElementById("specialSignalPanel")) return;
    const panel = document.createElement("div");
    panel.id = "specialSignalPanel";
    panel.className = "mt-4 bg-purple-500/10 border border-purple-300/30 rounded-2xl p-4 text-sm";
    adminCard.appendChild(panel);
  }

  function render() {
    makePanel();
    const panel = document.getElementById("specialSignalPanel");
    if (!panel) return;
    const list = read();
    const last = list[list.length - 1];
    panel.innerHTML = `
      <div class="text-purple-200 font-bold">Special Signals</div>
      <p class="text-gray-300 mt-1">v0.70 signal monitoring is online.</p>
      <div class="mt-2 text-xs text-purple-100">Signals Logged: <strong>${list.length}</strong></div>
      <div class="mt-1 text-xs text-gray-400">Last Signal: <strong>${last ? last.name : "None"}</strong></div>`;
  }

  function boot() {
    render();
    setInterval(render, 1500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
