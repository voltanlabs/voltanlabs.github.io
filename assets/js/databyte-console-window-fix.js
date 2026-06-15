// assets/js/databyte-console-window-fix.js
(function () {
  const SUBTITLES = {
    profile: "Admin identity, rank, seen count, and ByteCoins.",
    party: "Manage the active battle team. Slot 1 is the lead sprite.",
    arena: "Preview the coming party-based battle system.",
    missions: "Scanner objectives and progression tasks.",
    inventory: "Stored tools, scanner items, and utility systems.",
    databytedex: "Captured sprite records and Codex data.",
    evolution: "Evolution progress and upgrade signals.",
    signals: "Special signal tracking and rare readings.",
    research: "Future research lab and scanner upgrade systems."
  };

  const LABELS = {
    profile: "Profile",
    party: "Party",
    arena: "Arena",
    missions: "Missions",
    inventory: "Inventory",
    databytedex: "DataByteDex",
    evolution: "Evolution",
    signals: "Signals",
    research: "Research"
  };

  function ensureDock() {
    let dock = document.getElementById("databyteConsoleSourceDock");
    if (!dock) {
      dock = document.createElement("div");
      dock.id = "databyteConsoleSourceDock";
      dock.style.display = "none";
      document.body.appendChild(dock);
    }
    return dock;
  }

  function ensureArenaPanel() {
    let panel = document.getElementById("databyteArenaPanel");
    if (panel) return panel;
    panel = document.createElement("section");
    panel.id = "databyteArenaPanel";
    ensureDock().appendChild(panel);
    return panel;
  }

  function renderArenaPanel() {
    const panel = ensureArenaPanel();
    const state = window.getDataBytePartyState?.() || { party: [] };
    const lead = state.party?.[0];
    panel.innerHTML = `
      <div class="db-arena-card">
        <strong style="color:#FFD700;display:block;font-size:1.2rem;">VoltArena Prototype</strong>
        <p style="color:#CBD5E1;font-size:.9rem;margin-top:6px;">This window is ready to connect Party Slot 1 into the battle engine.</p>
        <div class="db-arena-stage">
          <div class="db-arena-fighter"><div><div class="db-arena-icon">${lead?.icon || "◈"}</div><strong>${lead?.name || "No Lead Sprite"}</strong><p style="font-size:.75rem;color:#94A3B8;margin-top:4px;">${lead ? `HP ${lead.hp} • ATK ${lead.atk} • DEF ${lead.def}` : "Set a Party leader first."}</p></div></div>
          <div class="db-arena-vs">VS</div>
          <div class="db-arena-fighter"><div><div class="db-arena-icon">🤖</div><strong>Wild Signal Sprite</strong><p style="font-size:.75rem;color:#94A3B8;margin-top:4px;">Opponent generator next.</p></div></div>
        </div>
        <p style="margin-top:12px;font-size:.8rem;color:#BAE6FD;">Next build: HP bars, turn buttons, and real party-based damage.</p>
      </div>`;
    return panel;
  }

  function shellFor(id) {
    if (id === "profile") return document.getElementById("adminCard")?.closest("section") || null;
    if (id === "party") return document.getElementById("activePartyPanel") || null;
    if (id === "arena") return renderArenaPanel();
    if (id === "missions") return document.getElementById("scannerMissionsPanel")?.closest("section") || document.getElementById("scannerMissionsPanel") || null;
    if (id === "inventory") return document.getElementById("trueInventoryPanel")?.closest("section") || document.getElementById("trueInventoryPanel") || null;
    if (id === "databytedex") return document.getElementById("collectionList")?.closest("section") || null;
    if (id === "evolution") return document.getElementById("progressionBadge")?.closest("section") || document.getElementById("progressionBadge") || null;
    if (id === "signals") return document.getElementById("specialSignalPanel")?.closest("section") || document.getElementById("specialSignalPanel") || null;
    return null;
  }

  function allShells() {
    return ["profile", "party", "arena", "missions", "inventory", "databytedex", "evolution", "signals"]
      .map(shellFor)
      .filter(Boolean);
  }

  function parkOpenSource() {
    const body = document.getElementById("databyteConsoleModalBody");
    if (!body) return;
    while (body.firstChild) ensureDock().appendChild(body.firstChild);
  }

  function hideSources() {
    const body = document.getElementById("databyteConsoleModalBody");
    allShells().forEach((shell) => {
      if (body && body.contains(shell)) return;
      if (shell.id !== "databyteSimpleAdminConsole") shell.classList.add("db-console-source-hidden");
    });
  }

  function renameDexPanel(node) {
    if (!node) return;
    node.querySelectorAll("h2, h3, strong, p").forEach((el) => {
      const text = (el.textContent || "").trim();
      if (text === "ByteCoin Collection") el.textContent = "DataByteDex";
      if (text === "Tap a captured sprite to open Codex data.") el.textContent = "Captured sprite records, Dex data, and discovery history.";
    });
  }

  function openWindow(id) {
    const modal = document.getElementById("databyteConsoleModal");
    const body = document.getElementById("databyteConsoleModalBody");
    const title = document.getElementById("databyteConsoleModalTitle");
    const sub = document.getElementById("databyteConsoleModalSub");
    if (!modal || !body || !title || !sub) return false;

    parkOpenSource();
    const shell = shellFor(id);
    title.textContent = LABELS[id] || "Console";
    sub.textContent = SUBTITLES[id] || "Admin system window.";
    body.innerHTML = "";

    if (shell) {
      shell.classList.remove("db-console-source-hidden");
      if (id === "databytedex") renameDexPanel(shell);
      body.appendChild(shell);
    } else {
      body.innerHTML = `<div class="db-console-placeholder"><strong>${LABELS[id] || "Console"}</strong><p>This system is initializing.</p></div>`;
    }

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    return true;
  }

  function closeWindow() {
    const modal = document.getElementById("databyteConsoleModal");
    if (!modal) return;
    parkOpenSource();
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    hideSources();
  }

  function bind() {
    const consolePanel = document.getElementById("databyteSimpleAdminConsole");
    const tabs = consolePanel?.querySelector(".db-simple-tabs");
    if (!tabs || tabs.dataset.windowFixBound === "true") return;
    tabs.dataset.windowFixBound = "true";

    tabs.addEventListener("click", function (event) {
      const button = event.target.closest("[data-simple-tab]");
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openWindow(button.dataset.simpleTab);
    }, true);

    document.getElementById("databyteConsoleModalClose")?.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      closeWindow();
    }, true);
  }

  function boot() {
    bind();
    hideSources();
    setInterval(function () {
      bind();
      hideSources();
    }, 800);
    window.addEventListener("databyte:party-updated", renderArenaPanel);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();