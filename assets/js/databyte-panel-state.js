// assets/js/databyte-panel-state.js
(function () {
  const state = {};
  const ids = ["inventoryScrollList", "scannerMissionsList", "evolutionProgressList"];

  function save(id) {
    const el = document.getElementById(id);
    if (el) state[id] = el.scrollTop;
  }

  function apply(id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (!el.dataset.panelStateBound) {
      el.dataset.panelStateBound = "true";
      el.addEventListener("scroll", function () { save(id); }, { passive: true });
    }
    if (state[id] && Math.abs(el.scrollTop - state[id]) > 1) el.scrollTop = state[id];
  }

  function tick() {
    ids.forEach(apply);
  }

  function boot() {
    setInterval(tick, 100);
    tick();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
