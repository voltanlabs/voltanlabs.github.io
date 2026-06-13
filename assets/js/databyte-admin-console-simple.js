// assets/js/databyte-admin-console-simple.js
(function () {
  const STORE_KEY = "vl_databyte_admin_console_tab";
  const VERSION = "v0.83 Unified Console";
  const tabs = [
    ["profile", "Profile"],
    ["missions", "Missions"],
    ["inventory", "Inventory"],
    ["collection", "Collection"],
    ["evolution", "Evolution"],
    ["signals", "Signals"],
    ["research", "Research"]
  ];

  function activeTab() {
    const saved = localStorage.getItem(STORE_KEY) || "profile";
    return tabs.some(([id]) => id === saved) ? saved : "profile";
  }

  function setActive(id) {
    if (!tabs.some(([tabId]) => tabId === id)) return;
    localStorage.setItem(STORE_KEY, id);
    render();
  }

  function injectStyles() {
    if (document.getElementById("databyteSimpleConsoleStyles")) return;
    const style = document.createElement("style");
    style.id = "databyteSimpleConsoleStyles";
    style.textContent = `
      #databyteAdminConsole, #databyteSimpleAdminConsole {
        background: rgba(15, 23, 42, .76);
        border: 1px solid rgba(125, 211, 252, .24);
        border-radius: 24px;
        padding: 14px;
        box-shadow: 0 18px 50px rgba(0,0,0,.22);
      }
      #databyteAdminConsole { display: none !important; }
      .db-simple-header { display:flex; justify-content:space-between; gap:12px; padding:4px 4px 12px; }
      .db-simple-header h2 { color:#FFD700; font-size:1.15rem; line-height:1.2; }
      .db-simple-header p { color:#94A3B8; font-size:.72rem; margin-top:3px; }
      .db-simple-version { color:#BAE6FD; border:1px solid rgba(186,230,253,.35); background:rgba(14,165,233,.08); border-radius:999px; padding:5px 8px; font-size:10px; letter-spacing:.12em; text-transform:uppercase; white-space:nowrap; height:max-content; }
      .db-simple-tabs { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:7px; margin-bottom:12px; }
      .db-simple-tab { border:1px solid rgba(255,255,255,.12); background:rgba(0,0,0,.22); color:#CBD5E1; border-radius:12px; padding:9px 6px; font-size:11px; font-weight:800; text-align:center; }
      .db-simple-tab.is-active { background:#FFD700; border-color:#FFD700; color:#111827; }
      .db-simple-body { max-height:calc(100vh - 260px); min-height:360px; overflow:auto; padding-right:4px; scrollbar-width:thin; }
      .db-simple-body > section, .db-simple-body > div { margin-top:0 !important; }
      .db-simple-placeholder { border:1px dashed rgba(255,215,0,.32); background:rgba(255,215,0,.07); border-radius:18px; padding:16px; color:#E5E7EB; }
      .db-simple-placeholder strong { color:#FFD700; display:block; margin-bottom:6px; }
      .db-simple-source-hidden { display:none !important; }
      @media (max-width:1279px) { .db-simple-body { max-height:none; min-height:0; } }
    `;
    document.head.appendChild(style);
  }

  function makeConsole() {
    const adminCard = document.getElementById("adminCard");
    if (!adminCard) return null;
    let panel = document.getElementById("databyteSimpleAdminConsole");
    if (panel) return panel;
    panel = document.createElement("section");
    panel.id = "databyteSimpleAdminConsole";
    panel.innerHTML = `
      <div class="db-simple-header">
        <div><h2>Admin Console</h2><p>Scanner systems routed into compact tabs.</p></div>
        <span class="db-simple-version">${VERSION}</span>
      </div>
      <div class="db-simple-tabs">
        ${tabs.map(([id, label]) => `<button type="button" class="db-simple-tab" data-simple-tab="${id}">${label}</button>`).join("")}
      </div>
      <div id="databyteSimpleConsoleBody" class="db-simple-body"></div>`;
    adminCard.parentElement.appendChild(panel);
    panel.querySelector(".db-simple-tabs").addEventListener("click", function (event) {
      const button = event.target.closest("[data-simple-tab]");
      if (!button) return;
      setActive(button.dataset.simpleTab);
    });
    return panel;
  }

  function sources() {
    return {
      profile: document.getElementById("adminCard"),
      missions: document.getElementById("scannerMissionsPanel"),
      inventory: document.getElementById("trueInventoryPanel"),
      collection: document.getElementById("collectionList")?.parentElement,
      evolution: document.getElementById("progressionBadge"),
      signals: document.getElementById("specialSignalPanel")
    };
  }

  function placeholder(id) {
    if (id === "research") return `<div class="db-simple-placeholder"><strong>Research Lab</strong><p>Coming next: Research Data, ByteCoins, Scanner Rank, Capture Efficiency, Signal Stabilizers, Rare Signal Detection, and Evolution Insight.</p></div>`;
    const label = tabs.find(([tabId]) => tabId === id)?.[1] || "Console";
    return `<div class="db-simple-placeholder"><strong>${label}</strong><p>This system is initializing.</p></div>`;
  }

  function hideSources(map) {
    Object.values(map).forEach((node) => {
      if (!node) return;
      node.classList.add("db-simple-source-hidden");
    });
  }

  function render() {
    injectStyles();
    const panel = makeConsole();
    if (!panel) return;
    const active = activeTab();
    const body = document.getElementById("databyteSimpleConsoleBody");
    const map = sources();
    if (!body) return;

    panel.querySelectorAll("[data-simple-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.simpleTab === active);
    });

    hideSources(map);

    if (active === "research" || !map[active]) {
      body.innerHTML = placeholder(active);
      return;
    }

    const clone = map[active].cloneNode(true);
    clone.classList.remove("db-simple-source-hidden");
    clone.removeAttribute("id");
    clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
    body.innerHTML = "";
    body.appendChild(clone);
  }

  function boot() {
    render();
    setInterval(render, 1200);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
