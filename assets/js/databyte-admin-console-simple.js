// assets/js/databyte-admin-console-simple.js
(function () {
  const PROFILE_KEY = "vl_databyte_admin_profile_v1";
  const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";
  const SEEN_KEY = "vl_databyte_seen_v1";
  const VERSION = "v0.86.3 Console Windows";
  const tabs = [
    ["profile", "Profile"],
    ["party", "Party"],
    ["arena", "Arena"],
    ["missions", "Missions"],
    ["inventory", "Inventory"],
    ["databytedex", "DataByteDex"],
    ["evolution", "Evolution"],
    ["signals", "Signals"],
    ["research", "Research"]
  ];
  const tabIcons = { profile: "👤", party: "⚔️", arena: "🏟️", missions: "📜", inventory: "🎒", databytedex: "📖", evolution: "🧬", signals: "📡", research: "🔬" };

  function read(key, fallback = []) {
    try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; }
  }

  function getRank(count) {
    if (count >= 25) return "Root Admin";
    if (count >= 15) return "Master Admin";
    if (count >= 8) return "System Admin";
    if (count >= 3) return "Admin";
    return "Scanner";
  }

  function injectStyles() {
    if (document.getElementById("databyteSimpleConsoleStyles")) return;
    const style = document.createElement("style");
    style.id = "databyteSimpleConsoleStyles";
    style.textContent = `
      #databyteProfileStrip{background:rgba(15,23,42,.68);border:1px solid rgba(255,215,0,.26);border-radius:22px;padding:12px 14px;display:grid;gap:8px;box-shadow:0 18px 50px rgba(0,0,0,.20)}
      .db-profile-strip-title{color:#FFD700;font-weight:900;font-size:1rem;line-height:1.15}.db-profile-strip-sub{color:#CBD5E1;font-size:.72rem}.db-profile-strip-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.db-profile-strip-stat{background:rgba(0,0,0,.24);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:8px 6px;text-align:center}.db-profile-strip-stat span{display:block;color:#94A3B8;font-size:10px}.db-profile-strip-stat strong{color:#FFD700;font-size:13px}
      #databyteSimpleAdminConsole{background:rgba(15,23,42,.76);border:1px solid rgba(125,211,252,.24);border-radius:24px;padding:14px;box-shadow:0 18px 50px rgba(0,0,0,.22)}
      #databyteAdminConsole{display:none!important}.db-simple-header{display:flex;justify-content:space-between;gap:12px;padding:4px 4px 12px}.db-simple-header h2{color:#FFD700;font-size:1.15rem;line-height:1.2}.db-simple-header p{color:#94A3B8;font-size:.72rem;margin-top:3px}.db-simple-version{color:#BAE6FD;border:1px solid rgba(186,230,253,.35);background:rgba(14,165,233,.08);border-radius:999px;padding:5px 8px;font-size:10px;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;height:max-content}.db-simple-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.db-simple-tab{border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.22);color:#CBD5E1;border-radius:14px;padding:11px 8px;font-size:11px;font-weight:900;text-align:center}.db-simple-tab:hover{border-color:rgba(255,215,0,.55);color:#FFD700}
      .db-console-modal{position:fixed;inset:0;z-index:70;background:rgba(0,0,0,.76);padding:16px;display:flex;align-items:center;justify-content:center}.db-console-modal.hidden{display:none!important}.db-console-window{width:min(800px,100%);max-height:88vh;overflow:hidden;border-radius:28px;background:#2C3E50;border:1px solid rgba(255,215,0,.38);box-shadow:0 24px 80px rgba(0,0,0,.55)}.db-console-window-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.10)}.db-console-window-head h2{color:#FFD700;font-size:1.65rem;line-height:1.1}.db-console-window-head p{color:#CBD5E1;font-size:.82rem;margin-top:5px}.db-console-close{border:0;background:rgba(0,0,0,.25);color:#fff;border-radius:12px;padding:9px 12px;font-weight:900}.db-console-modal-body{padding:18px;max-height:calc(88vh - 100px);overflow:auto}.db-console-modal-body>section,.db-console-modal-body>div{margin-top:0!important}.db-console-placeholder{border:1px dashed rgba(255,215,0,.32);background:rgba(255,215,0,.07);border-radius:18px;padding:16px;color:#E5E7EB}.db-console-placeholder strong{color:#FFD700;display:block;margin-bottom:6px}.db-console-source-hidden{display:none!important}#databyteConsoleSourceDock{display:none!important}
      .db-arena-card{border:1px solid rgba(125,211,252,.24);background:rgba(15,23,42,.38);border-radius:22px;padding:16px;color:#E5E7EB}.db-arena-stage{margin-top:12px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;background:rgba(0,0,0,.24);border:1px solid rgba(255,255,255,.10);border-radius:18px;padding:14px;text-align:center}.db-arena-fighter{border-radius:16px;background:rgba(0,0,0,.22);padding:12px;min-height:120px;display:grid;place-items:center}.db-arena-icon{font-size:3rem;line-height:1}.db-arena-vs{color:#FFD700;font-weight:900;letter-spacing:.2em}
      @media (min-width:540px){.db-simple-tabs{grid-template-columns:repeat(3,minmax(0,1fr))}}
    `;
    document.head.appendChild(style);
  }

  function ensureDock() {
    let dock = document.getElementById("databyteConsoleSourceDock");
    if (!dock) { dock = document.createElement("div"); dock.id = "databyteConsoleSourceDock"; document.body.appendChild(dock); }
    return dock;
  }

  function makeProfileStrip() {
    const adminSection = document.getElementById("adminCard")?.closest("section") || document.querySelector("#gamePanel aside section");
    if (!adminSection) return null;
    let strip = document.getElementById("databyteProfileStrip");
    if (!strip) { strip = document.createElement("section"); strip.id = "databyteProfileStrip"; adminSection.insertAdjacentElement("beforebegin", strip); }
    const profile = read(PROFILE_KEY, null) || {}, collection = read(COLLECTION_KEY, []), seen = read(SEEN_KEY, []);
    strip.innerHTML = `<div><div class="db-profile-strip-title">Admin ${profile.name || "Scanner"}</div><div class="db-profile-strip-sub">Partner: ${profile.starter || "Unlinked"}</div></div><div class="db-profile-strip-stats"><div class="db-profile-strip-stat"><span>Rank</span><strong>${getRank(collection.length)}</strong></div><div class="db-profile-strip-stat"><span>Captures</span><strong>${collection.length}</strong></div><div class="db-profile-strip-stat"><span>Seen</span><strong>${seen.length}</strong></div></div>`;
    return strip;
  }

  function makeConsole() {
    const anchor = document.getElementById("databyteProfileStrip") || document.getElementById("adminCard")?.closest("section") || document.querySelector("#gamePanel aside section");
    if (!anchor && !document.getElementById("databyteSimpleAdminConsole")) return null;
    let panel = document.getElementById("databyteSimpleAdminConsole");
    if (panel) return panel;
    panel = document.createElement("section");
    panel.id = "databyteSimpleAdminConsole";
    panel.innerHTML = `<div class="db-simple-header"><div><h2>Admin Console</h2><p>Tap a system to open its command window.</p></div><span class="db-simple-version">${VERSION}</span></div><div class="db-simple-tabs">${tabs.map(([id,label]) => `<button type="button" class="db-simple-tab" data-simple-tab="${id}">${tabIcons[id] || ""} ${label}</button>`).join("")}</div>`;
    anchor.insertAdjacentElement("afterend", panel);
    panel.querySelector(".db-simple-tabs").addEventListener("click", function (event) { const button = event.target.closest("[data-simple-tab]"); if (button) openConsoleWindow(button.dataset.simpleTab); });
    return panel;
  }

  function makeModal() {
    let modal = document.getElementById("databyteConsoleModal");
    if (modal) return modal;
    modal = document.createElement("div");
    modal.id = "databyteConsoleModal";
    modal.className = "db-console-modal hidden";
    modal.innerHTML = `<div class="db-console-window" role="dialog" aria-modal="true" aria-labelledby="databyteConsoleModalTitle"><div class="db-console-window-head"><div><h2 id="databyteConsoleModalTitle">Console</h2><p id="databyteConsoleModalSub">Admin system window</p></div><button type="button" id="databyteConsoleModalClose" class="db-console-close">✕</button></div><div id="databyteConsoleModalBody" class="db-console-modal-body"></div></div>`;
    document.body.appendChild(modal);
    modal.addEventListener("click", e => { if (e.target === modal) closeConsoleWindow(); });
    modal.querySelector("#databyteConsoleModalClose").addEventListener("click", closeConsoleWindow);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeConsoleWindow(); });
    return modal;
  }

  function renderArenaPanel() {
    let panel = document.getElementById("databyteArenaPanel");
    if (!panel) { panel = document.createElement("section"); panel.id = "databyteArenaPanel"; ensureDock().appendChild(panel); }
    const state = window.getDataBytePartyState?.() || { party: [] };
    const lead = state.party?.[0];
    panel.innerHTML = `<div class="db-arena-card"><strong style="color:#FFD700;display:block;font-size:1.2rem;">VoltArena Prototype</strong><p style="color:#CBD5E1;font-size:.9rem;margin-top:6px;">This window is ready to connect Party Slot 1 into the battle engine.</p><div class="db-arena-stage"><div class="db-arena-fighter"><div><div class="db-arena-icon">${lead?.icon || "◈"}</div><strong>${lead?.name || "No Lead Sprite"}</strong><p style="font-size:.75rem;color:#94A3B8;margin-top:4px;">${lead ? `HP ${lead.hp} • ATK ${lead.atk} • DEF ${lead.def}` : "Set a Party leader first."}</p></div></div><div class="db-arena-vs">VS</div><div class="db-arena-fighter"><div><div class="db-arena-icon">🤖</div><strong>Wild Signal Sprite</strong><p style="font-size:.75rem;color:#94A3B8;margin-top:4px;">Opponent generator next.</p></div></div></div><p style="margin-top:12px;font-size:.8rem;color:#BAE6FD;">Next build: HP bars, turn buttons, and real party-based damage.</p></div>`;
    return panel;
  }

  function sourceMap() {
    renderArenaPanel();
    return { profile: document.getElementById("adminCard"), party: document.getElementById("activePartyPanel"), arena: document.getElementById("databyteArenaPanel"), missions: document.getElementById("scannerMissionsPanel"), inventory: document.getElementById("trueInventoryPanel"), databytedex: document.getElementById("collectionList")?.parentElement, evolution: document.getElementById("progressionBadge"), signals: document.getElementById("specialSignalPanel") };
  }

  function sourceShell(node) {
    if (!node) return null;
    if (node.id === "adminCard") return node.closest("section");
    if (node.id === "activePartyPanel" || node.id === "databyteArenaPanel") return node;
    return node.closest("section") || node;
  }

  function parkModalSource() {
    const body = document.getElementById("databyteConsoleModalBody");
    if (!body) return;
    while (body.firstChild) ensureDock().appendChild(body.firstChild);
  }

  function hideOriginalSources() {
    const modalBody = document.getElementById("databyteConsoleModalBody");
    Object.values(sourceMap()).forEach(source => {
      if (!source) return;
      if (modalBody && modalBody.contains(source)) return;
      const shell = sourceShell(source);
      if (shell && shell.id !== "databyteSimpleAdminConsole") shell.classList.add("db-console-source-hidden");
    });
  }

  function labelFor(id) { return tabs.find(([tabId]) => tabId === id)?.[1] || "Console"; }
  function subtitleFor(id) {
    return ({ profile:"Admin identity, rank, seen count, and ByteCoins.", party:"Manage the active battle team. Slot 1 is the lead sprite.", arena:"Preview the coming party-based battle system.", missions:"Scanner objectives and progression tasks.", inventory:"Stored tools, scanner items, and utility systems.", databytedex:"Captured sprite records and Codex data.", evolution:"Evolution progress and upgrade signals.", signals:"Special signal tracking and rare readings.", research:"Future research lab and scanner upgrade systems." })[id] || "Admin system window.";
  }

  function renameDexPanel(node) {
    if (!node) return;
    node.querySelectorAll("h2,h3,strong,p").forEach(el => { const text = (el.textContent || "").trim(); if (text === "ByteCoin Collection") el.textContent = "DataByteDex"; if (text === "Tap a captured sprite to open Codex data.") el.textContent = "Captured sprite records, Dex data, and discovery history."; });
  }

  function placeholder(id) {
    if (id === "research") return `<div class="db-console-placeholder"><strong>Research Lab</strong><p>Coming next: Research Data, ByteCoins, Scanner Rank, Capture Efficiency, Signal Stabilizers, Rare Signal Detection, and Evolution Insight.</p></div>`;
    return `<div class="db-console-placeholder"><strong>${labelFor(id)}</strong><p>This system is initializing.</p></div>`;
  }

  function openConsoleWindow(id) {
    injectStyles(); makeProfileStrip(); makeConsole();
    const modal = makeModal(), body = modal.querySelector("#databyteConsoleModalBody"), title = modal.querySelector("#databyteConsoleModalTitle"), sub = modal.querySelector("#databyteConsoleModalSub");
    parkModalSource();
    const source = sourceMap()[id];
    title.textContent = labelFor(id); sub.textContent = subtitleFor(id); body.innerHTML = "";
    if (source) { const shell = sourceShell(source); if (shell) shell.classList.remove("db-console-source-hidden"); source.classList.remove("db-console-source-hidden"); if (id === "databytedex") renameDexPanel(source); body.appendChild(source); }
    else body.innerHTML = placeholder(id);
    modal.classList.remove("hidden"); document.body.style.overflow = "hidden";
    window.dispatchEvent(new CustomEvent("databyte:console-window-opened", { detail: { id } }));
  }

  function closeConsoleWindow() {
    const modal = document.getElementById("databyteConsoleModal");
    if (!modal || modal.classList.contains("hidden")) return;
    parkModalSource(); modal.classList.add("hidden"); document.body.style.overflow = ""; hideOriginalSources();
  }

  function render() { injectStyles(); makeProfileStrip(); makeConsole(); makeModal(); renderArenaPanel(); hideOriginalSources(); }
  function boot() { render(); window.openDataByteConsoleWindow = openConsoleWindow; window.addEventListener("databyte:party-updated", renderArenaPanel); window.addEventListener("storage", render); setInterval(render, 2000); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();