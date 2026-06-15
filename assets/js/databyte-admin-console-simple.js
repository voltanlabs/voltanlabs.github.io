// assets/js/databyte-admin-console-simple.js
(function () {
  const VERSION = "v0.86.1 Console Windows";
  const tabs = [
    ["profile", "Profile"],
    ["party", "Party"],
    ["missions", "Missions"],
    ["inventory", "Inventory"],
    ["databytedex", "DataByteDex"],
    ["evolution", "Evolution"],
    ["signals", "Signals"],
    ["research", "Research"]
  ];

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
      .db-simple-tabs { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
      .db-simple-tab { border:1px solid rgba(255,255,255,.12); background:rgba(0,0,0,.22); color:#CBD5E1; border-radius:14px; padding:11px 8px; font-size:11px; font-weight:900; text-align:center; }
      .db-simple-tab:hover { border-color:rgba(255,215,0,.55); color:#FFD700; }
      .db-console-modal { position:fixed; inset:0; z-index:70; background:rgba(0,0,0,.76); padding:16px; display:flex; align-items:center; justify-content:center; }
      .db-console-modal.hidden { display:none !important; }
      .db-console-window { width:min(760px,100%); max-height:88vh; overflow:hidden; border-radius:28px; background:#2C3E50; border:1px solid rgba(255,215,0,.38); box-shadow:0 24px 80px rgba(0,0,0,.55); }
      .db-console-window-head { display:flex; justify-content:space-between; align-items:flex-start; gap:14px; padding:18px 20px; border-bottom:1px solid rgba(255,255,255,.10); }
      .db-console-window-head h2 { color:#FFD700; font-size:1.65rem; line-height:1.1; }
      .db-console-window-head p { color:#CBD5E1; font-size:.82rem; margin-top:5px; }
      .db-console-close { border:0; background:rgba(0,0,0,.25); color:#fff; border-radius:12px; padding:9px 12px; font-weight:900; }
      .db-console-modal-body { padding:18px; max-height:calc(88vh - 100px); overflow:auto; }
      .db-console-modal-body > section, .db-console-modal-body > div { margin-top:0 !important; }
      .db-console-placeholder { border:1px dashed rgba(255,215,0,.32); background:rgba(255,215,0,.07); border-radius:18px; padding:16px; color:#E5E7EB; }
      .db-console-placeholder strong { color:#FFD700; display:block; margin-bottom:6px; }
      .db-console-source-hidden { display:none !important; }
      @media (min-width:540px) { .db-simple-tabs { grid-template-columns:repeat(3,minmax(0,1fr)); } }
    `;
    document.head.appendChild(style);
  }

  function makeConsole() {
    const adminSection = document.getElementById("adminCard")?.closest("section") || document.querySelector("#gamePanel aside section");
    if (!adminSection) return null;

    let panel = document.getElementById("databyteSimpleAdminConsole");
    if (panel) return panel;

    panel = document.createElement("section");
    panel.id = "databyteSimpleAdminConsole";
    panel.innerHTML = `
      <div class="db-simple-header">
        <div><h2>Admin Console</h2><p>Tap a system to open its command window.</p></div>
        <span class="db-simple-version">${VERSION}</span>
      </div>
      <div class="db-simple-tabs">
        ${tabs.map(([id, label]) => `<button type="button" class="db-simple-tab" data-simple-tab="${id}">${label}</button>`).join("")}
      </div>`;

    adminSection.insertAdjacentElement("afterend", panel);
    panel.querySelector(".db-simple-tabs").addEventListener("click", function (event) {
      const button = event.target.closest("[data-simple-tab]");
      if (!button) return;
      openConsoleWindow(button.dataset.simpleTab);
    });
    return panel;
  }

  function makeModal() {
    let modal = document.getElementById("databyteConsoleModal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "databyteConsoleModal";
    modal.className = "db-console-modal hidden";
    modal.innerHTML = `
      <div class="db-console-window" role="dialog" aria-modal="true" aria-labelledby="databyteConsoleModalTitle">
        <div class="db-console-window-head">
          <div><h2 id="databyteConsoleModalTitle">Console</h2><p id="databyteConsoleModalSub">Admin system window</p></div>
          <button type="button" id="databyteConsoleModalClose" class="db-console-close">✕</button>
        </div>
        <div id="databyteConsoleModalBody" class="db-console-modal-body"></div>
      </div>`;
    document.body.appendChild(modal);

    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeConsoleWindow();
    });
    modal.querySelector("#databyteConsoleModalClose").addEventListener("click", closeConsoleWindow);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeConsoleWindow();
    });
    return modal;
  }

  function sourceMap() {
    return {
      profile: document.getElementById("adminCard"),
      party: document.getElementById("activePartyPanel"),
      missions: document.getElementById("scannerMissionsPanel"),
      inventory: document.getElementById("trueInventoryPanel"),
      databytedex: document.getElementById("collectionList")?.parentElement,
      evolution: document.getElementById("progressionBadge"),
      signals: document.getElementById("specialSignalPanel")
    };
  }

  function labelFor(id) {
    return tabs.find(([tabId]) => tabId === id)?.[1] || "Console";
  }

  function subtitleFor(id) {
    const copy = {
      profile: "Admin identity, rank, seen count, and ByteCoins.",
      party: "Manage the active battle team. Slot 1 is the lead sprite.",
      missions: "Scanner objectives and progression tasks.",
      inventory: "Stored tools, scanner items, and utility systems.",
      databytedex: "Captured sprite records and Codex data.",
      evolution: "Evolution progress and upgrade signals.",
      signals: "Special signal tracking and rare readings.",
      research: "Future research lab and scanner upgrade systems."
    };
    return copy[id] || "Admin system window.";
  }

  function renameDexPanel(node) {
    if (!node) return;
    node.querySelectorAll("h2, h3, strong, p").forEach((el) => {
      const text = (el.textContent || "").trim();
      if (text === "ByteCoin Collection") el.textContent = "DataByteDex";
      if (text === "Tap a captured sprite to open Codex data.") el.textContent = "Captured sprite records, Dex data, and discovery history.";
    });
  }

  function placeholder(id) {
    const label = labelFor(id);
    if (id === "research") {
      return `<div class="db-console-placeholder"><strong>Research Lab</strong><p>Coming next: Research Data, ByteCoins, Scanner Rank, Capture Efficiency, Signal Stabilizers, Rare Signal Detection, and Evolution Insight.</p></div>`;
    }
    return `<div class="db-console-placeholder"><strong>${label}</strong><p>This system is initializing.</p></div>`;
  }

  function openConsoleWindow(id) {
    injectStyles();
    makeConsole();
    const modal = makeModal();
    const body = modal.querySelector("#databyteConsoleModalBody");
    const title = modal.querySelector("#databyteConsoleModalTitle");
    const sub = modal.querySelector("#databyteConsoleModalSub");
    const source = sourceMap()[id];

    title.textContent = labelFor(id);
    sub.textContent = subtitleFor(id);
    body.innerHTML = "";

    if (source) {
      source.classList.remove("db-console-source-hidden");
      if (id === "databytedex") renameDexPanel(source);
      body.appendChild(source);
    } else {
      body.innerHTML = placeholder(id);
    }

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new CustomEvent("databyte:console-window-opened", { detail: { id } }));
  }

  function closeConsoleWindow() {
    const modal = document.getElementById("databyteConsoleModal");
    if (!modal || modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function render() {
    injectStyles();
    makeConsole();
    makeModal();
  }

  function boot() {
    render();
    window.openDataByteConsoleWindow = openConsoleWindow;
    setInterval(render, 2000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();