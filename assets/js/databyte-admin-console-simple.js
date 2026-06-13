// assets/js/databyte-admin-console-simple.js
(function () {
  const STORE_KEY = "vl_databyte_admin_console_tab";
  const VERSION = "v0.83 Stable Console";
  const tabs = [
    ["profile", "Profile"],
    ["missions", "Missions"],
    ["inventory", "Inventory"],
    ["databytedex", "DataByteDex"],
    ["evolution", "Evolution"],
    ["signals", "Signals"],
    ["research", "Research"]
  ];

  function activeTab() {
    const saved = localStorage.getItem(STORE_KEY) || "profile";
    if (saved === "collection") return "databytedex";
    return tabs.some(([id]) => id === saved) ? saved : "profile";
  }

  function setActive(id) {
    if (!tabs.some(([tabId]) => tabId === id)) return;
    localStorage.setItem(STORE_KEY, id);
    paint();
  }

  function injectStyles() {
    if (document.getElementById("databyteSimpleConsoleStyles")) return;
    const style = document.createElement("style");
    style.id = "databyteSimpleConsoleStyles";
    style.textContent = `
      #databyteSimpleAdminConsole {
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
      .db-console-section { display:none !important; }
      .db-console-section.is-active { display:block !important; }
      .db-console-section > section, .db-console-section > div { margin-top:0 !important; }
      .db-console-placeholder { border:1px dashed rgba(255,215,0,.32); background:rgba(255,215,0,.07); border-radius:18px; padding:16px; color:#E5E7EB; }
      .db-console-placeholder strong { color:#FFD700; display:block; margin-bottom:6px; }
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
        <div><h2>Admin Console</h2><p>Scanner systems routed into stable tabs.</p></div>
        <span class="db-simple-version">${VERSION}</span>
      </div>
      <div class="db-simple-tabs">
        ${tabs.map(([id, label]) => `<button type="button" class="db-simple-tab" data-simple-tab="${id}">${label}</button>`).join("")}
      </div>
      <div id="databyteSimpleConsoleBody" class="db-simple-body">
        ${tabs.map(([id]) => `<div class="db-console-section" data-console-section="${id}"></div>`).join("")}
      </div>`;

    adminCard.parentElement.appendChild(panel);
    panel.querySelector(".db-simple-tabs").addEventListener("click", function (event) {
      const button = event.target.closest("[data-simple-tab]");
      if (!button) return;
      setActive(button.dataset.simpleTab);
    });
    return panel;
  }

  function sourceMap() {
    return {
      profile: document.getElementById("adminCard"),
      missions: document.getElementById("scannerMissionsPanel"),
      inventory: document.getElementById("trueInventoryPanel"),
      databytedex: document.getElementById("collectionList")?.parentElement,
      evolution: document.getElementById("progressionBadge"),
      signals: document.getElementById("specialSignalPanel")
    };
  }

  function renameDexPanel(node) {
    if (!node) return;
    node.querySelectorAll("h2, h3, strong, p").forEach((el) => {
      const text = (el.textContent || "").trim();
      if (text === "ByteCoin Collection") el.textContent = "DataByteDex";
      if (text === "Tap a captured sprite to open Codex data.") el.textContent = "Captured sprite records, Dex data, and discovery history.";
    });
  }

  function ensurePlaceholder(id) {
    const section = document.querySelector(`[data-console-section="${id}"]`);
    if (!section || section.children.length) return;
    if (id === "research") {
      section.innerHTML = `<div class="db-console-placeholder"><strong>Research Lab</strong><p>Coming next: Research Data, ByteCoins, Scanner Rank, Capture Efficiency, Signal Stabilizers, Rare Signal Detection, and Evolution Insight.</p></div>`;
      return;
    }
    const label = tabs.find(([tabId]) => tabId === id)?.[1] || "Console";
    section.innerHTML = `<div class="db-console-placeholder"><strong>${label}</strong><p>This system is initializing.</p></div>`;
  }

  function parkSources() {
    const map = sourceMap();
    Object.entries(map).forEach(([id, node]) => {
      if (!node) return;
      const section = document.querySelector(`[data-console-section="${id}"]`);
      if (!section) return;
      if (node.parentElement !== section) {
        section.innerHTML = "";
        section.appendChild(node);
      }
      node.classList.remove("db-simple-source-hidden");
      if (id === "databytedex") renameDexPanel(node);
    });
  }

  function paint() {
    const active = activeTab();
    document.querySelectorAll("[data-simple-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.simpleTab === active);
    });
    document.querySelectorAll("[data-console-section]").forEach((section) => {
      section.classList.toggle("is-active", section.dataset.consoleSection === active);
    });
  }

  function render() {
    injectStyles();
    if (!makeConsole()) return;
    parkSources();
    tabs.forEach(([id]) => ensurePlaceholder(id));
    paint();
  }

  function boot() {
    render();
    setInterval(render, 1500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
