// assets/js/databyte-admin-tabs.js
(function () {
  const VERSION = "v0.82 Desktop Console";
  let activeTab = localStorage.getItem("vl_databyte_admin_console_tab") || "profile";

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "missions", label: "Missions" },
    { id: "inventory", label: "Inventory" },
    { id: "evolution", label: "Evolution" },
    { id: "signals", label: "Signals" },
    { id: "research", label: "Research" }
  ];

  function injectStyles() {
    if (document.getElementById("databyteAdminTabsStyles")) return;
    const style = document.createElement("style");
    style.id = "databyteAdminTabsStyles";
    style.textContent = `
      #databyteAdminConsole {
        background: rgba(15, 23, 42, .72);
        border: 1px solid rgba(125, 211, 252, .24);
        border-radius: 24px;
        padding: 14px;
        box-shadow: 0 18px 50px rgba(0,0,0,.22);
      }

      .db-console-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        padding: 4px 4px 12px;
      }

      .db-console-header h2 {
        color: #FFD700;
        font-size: 1.15rem;
        line-height: 1.2;
      }

      .db-console-header p {
        color: #94A3B8;
        font-size: .72rem;
        margin-top: 3px;
      }

      .db-console-version {
        color: #BAE6FD;
        border: 1px solid rgba(186,230,253,.35);
        background: rgba(14,165,233,.08);
        border-radius: 999px;
        padding: 5px 8px;
        font-size: 10px;
        letter-spacing: .12em;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .db-console-tabs {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 7px;
        margin-bottom: 12px;
      }

      .db-console-tab {
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(0,0,0,.22);
        color: #CBD5E1;
        border-radius: 12px;
        padding: 9px 6px;
        font-size: 11px;
        font-weight: 800;
        text-align: center;
      }

      .db-console-tab.is-active {
        background: #FFD700;
        border-color: #FFD700;
        color: #111827;
      }

      .db-console-body {
        max-height: calc(100vh - 260px);
        min-height: 420px;
        overflow: auto;
        padding-right: 4px;
        scrollbar-width: thin;
      }

      .db-console-body > section,
      .db-console-body > div {
        margin-top: 0 !important;
      }

      .db-console-placeholder {
        border: 1px dashed rgba(255,215,0,.32);
        background: rgba(255,215,0,.07);
        border-radius: 18px;
        padding: 16px;
        color: #E5E7EB;
      }

      .db-console-placeholder strong {
        color: #FFD700;
        display: block;
        margin-bottom: 6px;
      }

      .db-console-hidden-source {
        display: none !important;
      }

      @media (max-width: 1279px) {
        .db-console-body {
          max-height: none;
          min-height: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createConsole() {
    const adminCard = document.getElementById("adminCard");
    if (!adminCard) return null;
    let consolePanel = document.getElementById("databyteAdminConsole");
    if (consolePanel) return consolePanel;

    consolePanel = document.createElement("section");
    consolePanel.id = "databyteAdminConsole";
    consolePanel.innerHTML = `
      <div class="db-console-header">
        <div><h2>Admin Console</h2><p>Scanner systems routed into compact tabs.</p></div>
        <span class="db-console-version">${VERSION}</span>
      </div>
      <div class="db-console-tabs"></div>
      <div id="databyteAdminConsoleBody" class="db-console-body"></div>`;
    adminCard.parentElement.appendChild(consolePanel);
    return consolePanel;
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

  function renderTabs(consolePanel) {
    const tabHost = consolePanel.querySelector(".db-console-tabs");
    if (!tabHost) return;
    tabHost.innerHTML = tabs.map((tab) => `
      <button type="button" class="db-console-tab ${activeTab === tab.id ? "is-active" : ""}" data-db-console-tab="${tab.id}">${tab.label}</button>
    `).join("");

    tabHost.querySelectorAll("[data-db-console-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        activeTab = button.dataset.dbConsoleTab;
        localStorage.setItem("vl_databyte_admin_console_tab", activeTab);
        render();
      });
    });
  }

  function moveActivePanel(body, sources) {
    body.innerHTML = "";

    if (activeTab === "research") {
      body.innerHTML = `
        <div class="db-console-placeholder">
          <strong>Research Lab</strong>
          <p>Coming next: Research Data, ByteCoins, Scanner Rank, Capture Efficiency, Signal Stabilizers, Rare Signal Detection, and Evolution Insight.</p>
        </div>`;
      return;
    }

    const panel = sources[activeTab];
    if (!panel) {
      body.innerHTML = `<div class="db-console-placeholder"><strong>${tabs.find((tab) => tab.id === activeTab)?.label || "Console"}</strong><p>This system is initializing.</p></div>`;
      return;
    }

    body.appendChild(panel);
    panel.classList.remove("db-console-hidden-source");
  }

  function hideInactiveSources(sources) {
    Object.entries(sources).forEach(([id, panel]) => {
      if (!panel) return;
      if (id !== activeTab) panel.classList.add("db-console-hidden-source");
      else panel.classList.remove("db-console-hidden-source");
    });
  }

  function render() {
    injectStyles();
    const consolePanel = createConsole();
    if (!consolePanel) return;
    const body = document.getElementById("databyteAdminConsoleBody");
    if (!body) return;
    const sources = sourceMap();

    renderTabs(consolePanel);
    hideInactiveSources(sources);
    moveActivePanel(body, sources);
  }

  function boot() {
    render();
    setInterval(render, 900);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
