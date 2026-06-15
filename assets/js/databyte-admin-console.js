// assets/js/databyte-admin-console.js
(function () {
  const VERSION = window.DATABYTE_DISCOVERY_VERSION || "v0.86.5 Data Discovery";
  const PROFILE_KEY = "vl_databyte_admin_profile_v1";
  const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";
  const SEEN_KEY = "vl_databyte_seen_v1";
  const DECOMPILE_KEY = "vl_databyte_decompile_count_v1";

  const TABS = [
    ["profile", "👤", "Profile", "Admin identity, rank, seen count, and ByteCoins."],
    ["party", "⚔️", "Party", "Manage the active battle team. Slot 1 is the lead sprite."],
    ["arena", "🏟️", "Arena", "Preview the coming party-based battle system."],
    ["missions", "📜", "Missions", "Scanner objectives and progression tasks."],
    ["inventory", "🎒", "Inventory", "Stored tools, scanner items, and utility systems."],
    ["databytedex", "📖", "DataByteDex", "Captured sprite records and Codex data."],
    ["evolution", "🧬", "Evolution", "Evolution progress and upgrade signals."],
    ["signals", "📡", "Signals", "Special signal tracking and rare readings."],
    ["research", "🔬", "Research", "Future research lab and scanner upgrade systems."]
  ];

  const byId = Object.fromEntries(TABS.map(([id, icon, label, sub]) => [id, { icon, label, sub }]));

  function read(key, fallback) {
    try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; }
  }

  function rank(count) {
    if (count >= 25) return "Root Admin";
    if (count >= 15) return "Master Admin";
    if (count >= 8) return "System Admin";
    if (count >= 3) return "Admin";
    return "Scanner";
  }

  function injectStyles() {
    if (document.getElementById("databyteAdminConsoleStyles")) return;
    const style = document.createElement("style");
    style.id = "databyteAdminConsoleStyles";
    style.textContent = `
      #databyteAdminConsole,#databyteSimpleAdminConsole{background:rgba(15,23,42,.76);border:1px solid rgba(125,211,252,.24);border-radius:24px;padding:14px;box-shadow:0 18px 50px rgba(0,0,0,.22)}
      #databyteProfileStrip{background:rgba(15,23,42,.68);border:1px solid rgba(255,215,0,.26);border-radius:22px;padding:12px 14px;display:grid;gap:8px;box-shadow:0 18px 50px rgba(0,0,0,.20)}
      .db-profile-title{color:#FFD700;font-weight:900}.db-profile-sub{color:#CBD5E1;font-size:.72rem}.db-profile-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.db-profile-stat{background:rgba(0,0,0,.24);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:8px 6px;text-align:center}.db-profile-stat span{display:block;color:#94A3B8;font-size:10px}.db-profile-stat strong{color:#FFD700;font-size:13px}
      .db-console-head{display:flex;justify-content:space-between;gap:12px;padding:4px 4px 12px}.db-console-head h2{color:#FFD700;font-size:1.15rem;line-height:1.2}.db-console-head p{color:#94A3B8;font-size:.72rem;margin-top:3px}.db-console-version{color:#BAE6FD;border:1px solid rgba(186,230,253,.35);background:rgba(14,165,233,.08);border-radius:999px;padding:5px 8px;font-size:10px;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;height:max-content}.db-console-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.db-console-tab{border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.22);color:#CBD5E1;border-radius:14px;padding:11px 8px;font-size:11px;font-weight:900;text-align:center}.db-console-tab:hover{border-color:rgba(255,215,0,.55);color:#FFD700}
      .db-console-modal{position:fixed;inset:0;z-index:80;background:rgba(0,0,0,.76);padding:16px;display:flex;align-items:center;justify-content:center}.db-console-modal.hidden{display:none!important}.db-console-window{width:min(820px,100%);max-height:88vh;overflow:hidden;border-radius:28px;background:#2C3E50;border:1px solid rgba(255,215,0,.38);box-shadow:0 24px 80px rgba(0,0,0,.55)}.db-console-window-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.10)}.db-console-window-head h2{color:#FFD700;font-size:1.65rem;line-height:1.1}.db-console-window-head p{color:#CBD5E1;font-size:.82rem;margin-top:5px}.db-console-close{border:0;background:rgba(0,0,0,.25);color:#fff;border-radius:12px;padding:9px 12px;font-weight:900}.db-console-body{padding:18px;max-height:calc(88vh - 100px);overflow:auto}.db-console-body>section,.db-console-body>div{margin-top:0!important}.db-console-hidden{display:none!important}#databyteConsoleDock{display:none!important}.db-console-placeholder{border:1px dashed rgba(255,215,0,.32);background:rgba(255,215,0,.07);border-radius:18px;padding:16px;color:#E5E7EB}.db-console-placeholder strong{color:#FFD700;display:block;margin-bottom:6px}
      .db-arena-card{border:1px solid rgba(125,211,252,.24);background:rgba(15,23,42,.38);border-radius:22px;padding:16px;color:#E5E7EB}.db-arena-stage{margin-top:12px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;background:rgba(0,0,0,.24);border:1px solid rgba(255,255,255,.10);border-radius:18px;padding:14px;text-align:center}.db-arena-fighter{border-radius:16px;background:rgba(0,0,0,.22);padding:12px;min-height:120px;display:grid;place-items:center}.db-arena-icon{font-size:3rem;line-height:1}.db-arena-vs{color:#FFD700;font-weight:900;letter-spacing:.2em}
      @media(min-width:540px){.db-console-tabs{grid-template-columns:repeat(3,minmax(0,1fr))}}
    `;
    document.head.appendChild(style);
  }

  function dock() {
    let el = document.getElementById("databyteConsoleDock");
    if (!el) { el = document.createElement("div"); el.id = "databyteConsoleDock"; document.body.appendChild(el); }
    return el;
  }

  function anchorSection() {
    return document.getElementById("adminCard")?.closest("section") || document.querySelector("#gamePanel aside section");
  }

  function renderProfileStrip() {
    const anchor = anchorSection();
    if (!anchor) return;
    let strip = document.getElementById("databyteProfileStrip");
    if (!strip) { strip = document.createElement("section"); strip.id = "databyteProfileStrip"; anchor.insertAdjacentElement("beforebegin", strip); }
    const profile = read(PROFILE_KEY, {}) || {};
    const collection = read(COLLECTION_KEY, []) || [];
    const seen = read(SEEN_KEY, []) || [];
    strip.innerHTML = `<div><div class="db-profile-title">Admin ${profile.name || "Scanner"}</div><div class="db-profile-sub">Partner: ${profile.starter || "Unlinked"}</div></div><div class="db-profile-stats"><div class="db-profile-stat"><span>Rank</span><strong>${rank(collection.length)}</strong></div><div class="db-profile-stat"><span>Captures</span><strong>${collection.length}</strong></div><div class="db-profile-stat"><span>Seen</span><strong>${seen.length}</strong></div></div>`;
  }

  function renderConsole() {
    const anchor = document.getElementById("databyteProfileStrip") || anchorSection();
    if (!anchor) return;
    let consoleEl = document.getElementById("databyteAdminConsole") || document.getElementById("databyteSimpleAdminConsole");
    if (!consoleEl) {
      consoleEl = document.createElement("section");
      consoleEl.id = "databyteAdminConsole";
      anchor.insertAdjacentElement("afterend", consoleEl);
    }
    consoleEl.classList.remove("db-console-hidden");
    consoleEl.innerHTML = `<div class="db-console-head"><div><h2>Admin Console</h2><p>Tap a system to open its command window.</p></div><span class="db-console-version">${VERSION}</span></div><div class="db-console-tabs">${TABS.map(([id,icon,label]) => `<button type="button" class="db-console-tab" data-console-tab="${id}">${icon} ${label}</button>`).join("")}</div>`;
  }

  function modal() {
    let m = document.getElementById("databyteConsoleModal");
    if (m) return m;
    m = document.createElement("div");
    m.id = "databyteConsoleModal";
    m.className = "db-console-modal hidden";
    m.innerHTML = `<div class="db-console-window" role="dialog" aria-modal="true"><div class="db-console-window-head"><div><h2 id="databyteConsoleModalTitle">Console</h2><p id="databyteConsoleModalSub">Admin system window.</p></div><button type="button" id="databyteConsoleModalClose" class="db-console-close">✕</button></div><div id="databyteConsoleModalBody" class="db-console-body"></div></div>`;
    document.body.appendChild(m);
    m.addEventListener("click", (e) => { if (e.target === m) closeWindow(); });
    m.querySelector("#databyteConsoleModalClose").addEventListener("click", closeWindow);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeWindow(); });
    return m;
  }

  function generatedPanel(id) {
    let panel = document.getElementById(id);
    if (!panel) { panel = document.createElement("section"); panel.id = id; dock().appendChild(panel); }
    return panel;
  }

  function profilePanel() {
    const panel = generatedPanel("databyteGeneratedProfilePanel");
    const profile = read(PROFILE_KEY, {}) || {};
    const collection = read(COLLECTION_KEY, []) || [];
    const seen = read(SEEN_KEY, []) || [];
    const decompiled = Number(localStorage.getItem(DECOMPILE_KEY) || "0") || 0;
    panel.innerHTML = `<div class="grid grid-cols-2 gap-3 text-sm"><div class="bg-black/25 rounded-2xl p-4"><span class="text-gray-400">Name</span><br><strong>${profile.name || "Scanner"}</strong></div><div class="bg-black/25 rounded-2xl p-4"><span class="text-gray-400">Rank</span><br><strong class="text-[#FFD700]">${rank(collection.length)}</strong></div><div class="bg-black/25 rounded-2xl p-4"><span class="text-gray-400">Seen</span><br><strong>${seen.length}</strong></div><div class="bg-black/25 rounded-2xl p-4"><span class="text-gray-400">ByteCoins</span><br><strong>${collection.length}</strong></div></div><a href="/databytedex.html" class="block mt-4 text-center px-5 py-3 rounded-xl bg-emerald-400/15 border border-emerald-300/40 text-emerald-200 font-bold">Open DataByteDex</a><div class="mt-4 bg-black/25 border border-white/10 rounded-2xl p-4 text-sm"><strong>Signal Management</strong><br><span class="text-gray-300">Sprites Decompiled: ${decompiled}</span></div><div class="mt-4 bg-sky-400/10 border border-sky-200/25 rounded-2xl p-4 text-sm"><strong class="text-sky-200">Partner Sprite</strong><br><span class="text-gray-300">${profile.starter || "Unlinked"}</span></div>`;
    return panel;
  }

  function arenaPanel() {
    const panel = generatedPanel("databyteArenaPanel");
    const state = window.getDataBytePartyState?.() || { party: [] };
    const lead = state.party?.[0];
    panel.innerHTML = `<div class="db-arena-card"><strong style="color:#FFD700;display:block;font-size:1.2rem;">VoltArena Prototype</strong><p style="color:#CBD5E1;font-size:.9rem;margin-top:6px;">This window is ready to connect Party Slot 1 into the battle engine.</p><div class="db-arena-stage"><div class="db-arena-fighter"><div><div class="db-arena-icon">${lead?.icon || "◈"}</div><strong>${lead?.name || "No Lead Sprite"}</strong><p style="font-size:.75rem;color:#94A3B8;margin-top:4px;">${lead ? `HP ${lead.hp} • ATK ${lead.atk} • DEF ${lead.def}` : "Set a Party leader first."}</p></div></div><div class="db-arena-vs">VS</div><div class="db-arena-fighter"><div><div class="db-arena-icon">🤖</div><strong>Wild Signal Sprite</strong><p style="font-size:.75rem;color:#94A3B8;margin-top:4px;">Opponent generator next.</p></div></div></div><p style="margin-top:12px;font-size:.8rem;color:#BAE6FD;">Next build: HP bars, turn buttons, and real party-based damage.</p></div>`;
    return panel;
  }

  function shellFor(id) {
    if (id === "profile") return profilePanel();
    if (id === "arena") return arenaPanel();
    if (id === "party") return document.getElementById("activePartyPanel");
    if (id === "missions") return document.getElementById("scannerMissionsPanel");
    if (id === "inventory") return document.getElementById("trueInventoryPanel")?.closest("section") || document.getElementById("trueInventoryPanel");
    if (id === "databytedex") return document.getElementById("collectionList")?.closest("section");
    if (id === "evolution") return document.getElementById("progressionBadge");
    if (id === "signals") return document.getElementById("specialSignalPanel");
    return null;
  }

  function allShells() {
    return ["profile","party","arena","missions","inventory","databytedex","evolution","signals"].map(shellFor).filter(Boolean).concat([anchorSection()].filter(Boolean));
  }

  function parkOpenSource() {
    const body = document.getElementById("databyteConsoleModalBody");
    if (!body) return;
    while (body.firstChild) dock().appendChild(body.firstChild);
  }

  function hideSources() {
    const body = document.getElementById("databyteConsoleModalBody");
    allShells().forEach((shell) => {
      if (body && body.contains(shell)) return;
      if (shell.id !== "databyteAdminConsole" && shell.id !== "databyteSimpleAdminConsole") shell.classList.add("db-console-hidden");
    });
  }

  function openWindow(id) {
    const info = byId[id] || { label: "Console", sub: "Admin system window." };
    const m = modal();
    const body = m.querySelector("#databyteConsoleModalBody");
    parkOpenSource();
    const shell = shellFor(id);
    m.querySelector("#databyteConsoleModalTitle").textContent = info.label;
    m.querySelector("#databyteConsoleModalSub").textContent = info.sub;
    body.innerHTML = "";
    if (shell) { shell.classList.remove("db-console-hidden"); body.appendChild(shell); }
    else body.innerHTML = `<div class="db-console-placeholder"><strong>${info.label}</strong><p>This system is initializing.</p></div>`;
    m.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeWindow() {
    const m = document.getElementById("databyteConsoleModal");
    if (!m || m.classList.contains("hidden")) return;
    parkOpenSource();
    m.classList.add("hidden");
    document.body.style.overflow = "";
    hideSources();
  }

  function bind() {
    const consoleEl = document.getElementById("databyteAdminConsole") || document.getElementById("databyteSimpleAdminConsole");
    const tabs = consoleEl?.querySelector(".db-console-tabs");
    if (!tabs || tabs.dataset.bound === "true") return;
    tabs.dataset.bound = "true";
    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-console-tab]");
      if (!btn) return;
      openWindow(btn.dataset.consoleTab);
    });
  }

  function removeOldConsoleShells() {
    document.querySelectorAll("#databyteSimpleAdminConsole").forEach((el) => {
      if (el.id !== "databyteAdminConsole") el.remove();
    });
  }

  function render() {
    injectStyles();
    removeOldConsoleShells();
    renderProfileStrip();
    renderConsole();
    modal();
    bind();
    hideSources();
  }

  function boot() {
    render();
    window.openDataByteConsoleWindow = openWindow;
    window.addEventListener("databyte:party-updated", arenaPanel);
    window.addEventListener("storage", render);
    setInterval(render, 2000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();