// assets/js/databyte-admin-tabs-stable.js
(function () {
  const STORE_KEY = "vl_databyte_admin_console_tab";
  const VALID = new Set(["profile", "missions", "inventory", "evolution", "signals", "research"]);
  const LABELS = {
    profile: "Profile",
    missions: "Missions",
    inventory: "Inventory",
    evolution: "Evolution",
    signals: "Signals",
    research: "Research"
  };

  function getActive() {
    const saved = localStorage.getItem(STORE_KEY) || "profile";
    return VALID.has(saved) ? saved : "profile";
  }

  function setActive(id) {
    if (!VALID.has(id)) return;
    localStorage.setItem(STORE_KEY, id);
    sync();
  }

  function paint(id) {
    document.querySelectorAll("[data-db-console-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.dbConsoleTab === id);
    });
  }

  function sourceMap() {
    return {
      profile: document.getElementById("adminCard"),
      missions: document.getElementById("scannerMissionsPanel"),
      inventory: document.getElementById("trueInventoryPanel"),
      evolution: document.getElementById("progressionBadge"),
      signals: document.getElementById("specialSignalPanel")
    };
  }

  function placeholder(id) {
    const label = LABELS[id] || "Console";
    if (id === "research") {
      return `<div class="db-console-placeholder"><strong>Research Lab</strong><p>Coming next: Research Data, ByteCoins, Scanner Rank, Capture Efficiency, Signal Stabilizers, Rare Signal Detection, and Evolution Insight.</p></div>`;
    }
    return `<div class="db-console-placeholder"><strong>${label}</strong><p>This system is initializing.</p></div>`;
  }

  function sync() {
    const active = getActive();
    const body = document.getElementById("databyteAdminConsoleBody");
    const sources = sourceMap();
    paint(active);
    if (!body) return;

    Object.entries(sources).forEach(([id, panel]) => {
      if (!panel) return;
      if (id === active) panel.classList.remove("db-console-hidden-source");
      else panel.classList.add("db-console-hidden-source");
    });

    const activePanel = sources[active];
    if (active === "research" || !activePanel) {
      if (body.dataset.activeTab !== active) {
        body.innerHTML = placeholder(active);
        body.dataset.activeTab = active;
      }
      return;
    }

    if (activePanel.parentElement !== body) {
      body.innerHTML = "";
      body.appendChild(activePanel);
    }
    body.dataset.activeTab = active;
  }

  function bind() {
    const host = document.querySelector(".db-console-tabs");
    if (!host || host.dataset.stableTabsBound) return;
    host.dataset.stableTabsBound = "true";
    host.addEventListener("pointerdown", function (event) {
      const button = event.target.closest("[data-db-console-tab]");
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      setActive(button.dataset.dbConsoleTab);
    }, true);
    host.addEventListener("click", function (event) {
      const button = event.target.closest("[data-db-console-tab]");
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      setActive(button.dataset.dbConsoleTab);
    }, true);
  }

  function boot() {
    bind();
    sync();
    setInterval(function () {
      bind();
      sync();
    }, 250);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
