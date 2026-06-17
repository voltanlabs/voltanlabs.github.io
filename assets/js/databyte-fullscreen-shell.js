// assets/js/databyte-fullscreen-shell.js
(function () {
  const STYLE_ID = "databyteFullscreenShellStyles";
  let startScreenNode = null;

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      html,body{height:100%;background:#07111f!important;overscroll-behavior:none!important}
      body.dd-fullscreen-mode{margin:0!important;overflow:hidden!important;background:#07111f!important}
      body.dd-fullscreen-mode .dd-app-shell{position:fixed!important;inset:0!important;z-index:999999!important;width:100vw!important;height:100dvh!important;display:grid!important;grid-template-rows:minmax(0,1fr)!important;padding:8px 10px max(8px,env(safe-area-inset-bottom))!important;box-sizing:border-box!important;overflow:hidden!important;color:#E5E7EB!important;background:#07111f!important;isolation:isolate!important}
      body.dd-fullscreen-mode .dd-app-shell:before{content:"";position:absolute;inset:0;z-index:0;background-image:radial-gradient(circle at 50% 46%,rgba(0,123,255,.24),transparent 22%),radial-gradient(circle at 50% 46%,transparent 0 37%,rgba(125,211,252,.22) 37.3%,transparent 37.9%),linear-gradient(rgba(0,123,255,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(0,123,255,.16) 1px,transparent 1px),linear-gradient(135deg,transparent 46%,rgba(255,255,255,.14) 49%,rgba(255,255,255,.08) 51%,transparent 56%);background-size:100% 100%,100% 100%,22px 22px,22px 22px,100% 100%;opacity:.78;pointer-events:none}
      body.dd-fullscreen-mode .dd-app-shell>*{position:relative;z-index:1}
      body.dd-fullscreen-mode .dd-app-main{min-height:0!important;height:100%!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;overflow:hidden!important}
      body.dd-fullscreen-mode .dd-app-stage{height:100%!important;min-height:0!important;overflow:hidden!important;overscroll-behavior:contain!important;display:grid!important;grid-template-rows:minmax(0,1fr)!important;border:0!important;border-radius:0!important;background:transparent!important}
      body.dd-fullscreen-mode .dd-app-side{display:none!important}
      body.dd-fullscreen-mode #gamePanel{display:grid!important;grid-template-columns:1fr!important;width:100%!important;height:100%!important;max-width:760px!important;margin:0 auto!important;padding:0!important;border-radius:0!important;overflow:hidden!important;box-sizing:border-box!important;background:transparent!important}
      body.dd-fullscreen-mode #gamePanel>aside{display:none!important}
      body.dd-fullscreen-mode #gamePanel>div{height:100%!important;display:grid!important;grid-template-rows:minmax(0,1fr)!important;background:transparent!important;border:0!important;box-shadow:none!important;border-radius:0!important;overflow:hidden!important}
      body.dd-fullscreen-mode #gamePanel>div>div:first-child{display:none!important}
      body.dd-fullscreen-mode #gamePanel>div>div:nth-child(2){height:100%!important;min-height:0!important;padding:0!important;display:grid!important;grid-template-columns:1fr!important;grid-template-rows:minmax(0,1fr) auto!important;gap:8px!important;overflow:hidden!important}
      body.dd-fullscreen-mode #gamePanel .scan-bg{min-height:0!important;height:100%!important;border:0!important;border-radius:0!important;background-color:transparent!important;background-image:none!important;overflow:hidden!important}
      body.dd-fullscreen-mode #gamePanel input,body.dd-fullscreen-mode #gamePanel button{touch-action:manipulation!important}
      body.dd-fullscreen-mode #gamePanel .scan-bg + div,body.dd-fullscreen-mode #gamePanel .scan-bg~div{position:relative!important;z-index:5!important;min-height:0!important;max-height:31dvh!important;overflow:auto!important;overscroll-behavior:contain!important;padding:10px!important;background:rgba(7,17,31,.78)!important;border:1px solid rgba(125,211,252,.16)!important;border-radius:18px!important;margin:0 0 72px!important;box-sizing:border-box!important}
      body.dd-mode-signal #gamePanel .scan-bg + div,body.dd-mode-signal #gamePanel .scan-bg~div,body.dd-mode-battle #gamePanel .scan-bg + div,body.dd-mode-battle #gamePanel .scan-bg~div{display:none!important}
      body.dd-fullscreen-mode #encounterCard{max-height:58dvh!important;overflow:auto!important;overscroll-behavior:contain!important;margin-top:10px!important}
      body.dd-mode-signal #encounterCard{max-height:calc(100dvh - 40px)!important;margin:0!important;padding-bottom:70px!important;box-sizing:border-box!important}
      body.dd-fullscreen-mode #databyteSignalOverlay,body.dd-fullscreen-mode #dbBattlePhase2{inset:0!important;height:100%!important;max-height:100%!important;overflow:auto!important;overscroll-behavior:contain!important;padding-bottom:82px!important;box-sizing:border-box!important}
      body.dd-mode-battle #dbBattlePhase2{display:grid!important;align-content:start!important;gap:8px!important;padding:8px 8px 86px!important;background:rgba(7,17,31,.34)!important}
      body.dd-fullscreen-mode #dbBattlePhase2 .dbp2-arena{gap:6px!important}
      body.dd-fullscreen-mode #dbBattlePhase2 .dbp2-icon{width:74px!important;height:74px!important;font-size:2.55rem!important}
      body.dd-fullscreen-mode #dbBattlePhase2 .dbp2-name{font-size:1.15rem!important;line-height:1.05!important}
      body.dd-fullscreen-mode #dbBattlePhase2 .dbp2-log{min-height:42px!important;max-height:58px!important;overflow:auto!important}
      body.dd-fullscreen-mode #dbBattlePhase2 .dbp2-actions{gap:8px!important}
      body.dd-fullscreen-mode #dbBattlePhase2 .dbp2-actions button{min-height:46px!important}
      .dd-floating-menu{position:absolute;right:14px;bottom:max(14px,env(safe-area-inset-bottom));z-index:2147482000;display:grid;justify-items:end;gap:9px;pointer-events:none}.dd-fab{width:58px;height:58px;border-radius:20px;border:1px solid rgba(125,211,252,.34);background:rgba(15,23,42,.92);color:#FFD700;font-size:1.45rem;font-weight:900;box-shadow:0 16px 46px rgba(0,0,0,.42);pointer-events:auto}.dd-menu-stack{display:none;gap:8px;grid-auto-rows:min-content;pointer-events:auto}.dd-floating-menu.open .dd-menu-stack{display:grid}.dd-menu-stack button{min-width:132px;border:1px solid rgba(125,211,252,.26);background:rgba(15,23,42,.9);color:#E5E7EB;border-radius:16px;padding:11px 14px;font-weight:900;text-align:left;box-shadow:0 12px 32px rgba(0,0,0,.28)}.dd-menu-stack button span{color:#FFD700;margin-right:8px}body.dd-mode-battle .dd-floating-menu{display:none!important}.dd-panel-overlay{position:fixed!important;inset:12px!important;z-index:2147482100;display:none;border:1px solid rgba(125,211,252,.24);border-radius:24px;background:rgba(7,17,31,.94);box-shadow:0 24px 80px rgba(0,0,0,.44);backdrop-filter:blur(10px);overflow:hidden}.dd-panel-overlay.open{display:grid;grid-template-rows:auto minmax(0,1fr)}.dd-panel-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 16px 10px;border-bottom:1px solid rgba(125,211,252,.14)}.dd-panel-title{color:#FFD700;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.dd-panel-close{border:1px solid rgba(125,211,252,.24);background:rgba(30,41,59,.72);color:#E5E7EB;border-radius:14px;padding:9px 12px;font-weight:900}.dd-panel-body{overflow:auto;overscroll-behavior:contain;padding:16px;display:grid;gap:12px}.dd-panel-card{border:1px solid rgba(125,211,252,.16);border-radius:18px;background:rgba(15,23,42,.76);padding:14px}.dd-panel-card strong{color:#FFD700}.dd-panel-muted{color:#BAE6FD;line-height:1.4}
      .dd-start-screen{position:absolute;inset:0;z-index:2147483600!important;display:grid;place-items:center;padding:24px;box-sizing:border-box;text-align:center;background:rgba(7,17,31,.24);pointer-events:auto!important}.dd-start-card{width:min(100%,620px);display:grid;gap:18px;padding:28px 20px;border:1px solid rgba(125,211,252,.24);border-radius:28px;background:rgba(15,23,42,.82);box-shadow:0 24px 80px rgba(0,0,0,.38);backdrop-filter:blur(8px);pointer-events:auto!important}.dd-start-kicker{color:#FFD700;font-weight:900;letter-spacing:.24em;text-transform:uppercase;font-size:.72rem}.dd-start-title{color:#0787ff;font-size:clamp(2.2rem,12vw,5rem);font-weight:900;line-height:.92}.dd-start-copy{color:#CBD5E1;font-size:1rem;line-height:1.45}.dd-start-btn{border:0;border-radius:18px;background:#FFD700;color:#111827;font-weight:900;padding:15px 18px;font-size:1rem;pointer-events:auto!important}.dd-start-note{color:#BAE6FD;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase}
      body.dd-app-starting .dd-app-main,body.dd-app-starting .dd-floating-menu{visibility:hidden!important;pointer-events:none!important}
      @media(orientation:landscape) and (min-width:820px){body.dd-fullscreen-mode .dd-app-main{grid-template-columns:minmax(0,1fr) 330px!important;gap:10px!important}body.dd-fullscreen-mode .dd-app-side{display:grid!important;min-height:0!important;overflow:auto!important}body.dd-fullscreen-mode #gamePanel>div>div:nth-child(2){grid-template-columns:minmax(0,1fr) 330px!important;grid-template-rows:minmax(0,1fr)!important}body.dd-fullscreen-mode #gamePanel .scan-bg + div,body.dd-fullscreen-mode #gamePanel .scan-bg~div{max-height:100%!important;margin:0!important}.dd-floating-menu{right:354px}.dd-panel-overlay{right:354px!important}}
    `;
    document.head.appendChild(style);
  }

  function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden" && el.offsetParent !== null;
  }

  function registrationComplete() {
    const gamePanel = document.getElementById("gamePanel");
    const reg = document.getElementById("registrationPanel");
    return !!gamePanel && isVisible(gamePanel) && (!reg || !isVisible(reg));
  }

  function makeButton(label, icon, action) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerHTML = icon ? `<span>${icon}</span>${label}` : label;
    btn.addEventListener("click", action);
    return btn;
  }

  function collectSidePanels(gamePanel) {
    return Array.from(document.body.children).filter((el) => {
      if (!el || el === gamePanel || el.contains(gamePanel) || el.classList?.contains("dd-app-shell")) return false;
      if (["SCRIPT", "STYLE", "LINK"].includes(el.tagName)) return false;
      const t = (el.textContent || "").toLowerCase();
      return t.includes("admin") || t.includes("mission") || t.includes("evolution") || t.includes("inventory") || t.includes("databytedex");
    }).slice(0, 8);
  }

  function panelContent(name) {
    const lower = name.toLowerCase();
    if (lower === "party") return `<div class="dd-panel-card"><strong>Active Party</strong><div class="dd-panel-muted">Your captured DataByteSprites will live here. This overlay is now wired to the app shell; next pass will hydrate it from the party system.</div></div><div class="dd-panel-card">Use this screen for team swaps, healing, and partner selection.</div>`;
    if (lower === "dex") return `<div class="dd-panel-card"><strong>DataByteDex</strong><div class="dd-panel-muted">Discovered signals and captured sprite records will be shown here as a full-screen app panel.</div></div>`;
    if (lower === "items") return `<div class="dd-panel-card"><strong>Inventory</strong><div class="dd-panel-muted">DataByteCoins, ByteCoins, upgrades, and future scanner items will be managed here.</div></div>`;
    if (lower === "admin") return `<div class="dd-panel-card"><strong>Admin Profile</strong><div class="dd-panel-muted">Scanner rank, missions, settings, and save controls will be consolidated into this panel.</div></div>`;
    return `<div class="dd-panel-card">${name}</div>`;
  }

  function openPanel(shell, name) {
    const overlay = shell.querySelector(".dd-panel-overlay");
    if (!overlay) return;
    overlay.querySelector(".dd-panel-title").textContent = name;
    overlay.querySelector(".dd-panel-body").innerHTML = panelContent(name);
    overlay.classList.add("open");
    shell.querySelector(".dd-floating-menu")?.classList.remove("open");
  }

  function closePanel(shell) {
    shell.querySelector(".dd-panel-overlay")?.classList.remove("open");
  }

  function enterScanner(shell) {
    document.body.classList.remove("dd-app-starting");
    (startScreenNode || shell.querySelector(".dd-start-screen"))?.remove();
    startScreenNode = null;
    shell.querySelector(".dd-app-stage")?.scrollTo({ top: 0 });
  }

  function startScreen(shell) {
    const screen = document.createElement("div");
    startScreenNode = screen;
    screen.className = "dd-start-screen";
    screen.innerHTML = `<div class="dd-start-card"><div class="dd-start-kicker">Scanner Candidate Evaluation</div><div class="dd-start-title">DataByteSprites</div><div class="dd-start-copy">Enter the Data Discovery scanner, lock onto signals, launch DataByteCoins, and build your active party.</div><button class="dd-start-btn" type="button" data-dd-start="true">Start Scanner</button><div class="dd-start-note">Tip: install to home screen for true fullscreen mode</div></div>`;
    shell.appendChild(screen);
    document.body.classList.add("dd-app-starting");
    ["pointerup", "click", "touchend"].forEach((type) => {
      screen.addEventListener(type, function (event) {
        if (event.target.closest("[data-dd-start]")) {
          event.preventDefault();
          enterScanner(shell);
        }
      }, { passive: false });
    });
  }

  function buildFloatingMenu(shell) {
    const menu = document.createElement("div");
    menu.className = "dd-floating-menu";
    const stack = document.createElement("div");
    stack.className = "dd-menu-stack";
    const fab = document.createElement("button");
    fab.className = "dd-fab";
    fab.type = "button";
    fab.textContent = "☰";
    fab.addEventListener("click", () => menu.classList.toggle("open"));
    stack.appendChild(makeButton("Party", "⚔", () => openPanel(shell, "Party")));
    stack.appendChild(makeButton("Dex", "▣", () => openPanel(shell, "Dex")));
    stack.appendChild(makeButton("Items", "◈", () => openPanel(shell, "Items")));
    stack.appendChild(makeButton("Admin", "☰", () => openPanel(shell, "Admin")));
    menu.appendChild(stack);
    menu.appendChild(fab);
    shell.appendChild(menu);
  }

  function buildPanelOverlay(shell) {
    const overlay = document.createElement("div");
    overlay.className = "dd-panel-overlay";
    overlay.innerHTML = `<div class="dd-panel-head"><div class="dd-panel-title">Panel</div><button class="dd-panel-close" type="button">Close</button></div><div class="dd-panel-body"></div>`;
    overlay.querySelector(".dd-panel-close")?.addEventListener("click", () => closePanel(shell));
    shell.appendChild(overlay);
  }

  function updateMode(shell) {
    const battle = document.getElementById("dbBattlePhase2");
    const signalOverlay = document.getElementById("databyteSignalOverlay");
    const encounterCard = document.getElementById("encounterCard");
    const scanBg = document.querySelector("#gamePanel .scan-bg");
    const text = (scanBg?.textContent || "").toLowerCase();
    const battleActive = !!battle && isVisible(battle) && text.includes("signal battle");
    const signalActive = !battleActive && ((!!signalOverlay && isVisible(signalOverlay)) || (!!encounterCard && isVisible(encounterCard)) || text.includes("launch databytecoin") || text.includes("battle signal"));
    document.body.classList.toggle("dd-mode-battle", battleActive);
    document.body.classList.toggle("dd-mode-signal", signalActive);
    if (battleActive) shell.querySelector(".dd-floating-menu")?.classList.remove("open");
  }

  function build() {
    injectStyles();
    const gamePanel = document.getElementById("gamePanel");
    if (!gamePanel || !gamePanel.querySelector(".scan-bg") || document.querySelector(".dd-app-shell")) return false;
    if (!registrationComplete()) return false;

    const panels = collectSidePanels(gamePanel);
    const originalParent = gamePanel.parentElement;
    const placeholder = document.createComment("databyte-app-placeholder");
    originalParent.insertBefore(placeholder, gamePanel);

    const shell = document.createElement("div");
    shell.className = "dd-app-shell";
    const main = document.createElement("div");
    main.className = "dd-app-main";
    const stage = document.createElement("div");
    stage.className = "dd-app-stage";
    const side = document.createElement("div");
    side.className = "dd-app-side";

    document.body.appendChild(shell);
    shell.appendChild(main);
    main.appendChild(stage);
    main.appendChild(side);
    stage.appendChild(gamePanel);
    panels.forEach((p) => side.appendChild(p));

    buildPanelOverlay(shell);
    buildFloatingMenu(shell);

    document.body.classList.add("dd-fullscreen-mode");
    startScreen(shell);
    updateMode(shell);
    setInterval(() => updateMode(shell), 300);
    new MutationObserver(() => updateMode(shell)).observe(gamePanel, { childList: true, subtree: true, characterData: true, attributes: true });
    return true;
  }

  function boot() {
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (build() || tries > 80) clearInterval(timer);
    }, 250);
    document.addEventListener("click", () => setTimeout(build, 150), true);
    document.addEventListener("touchend", () => setTimeout(build, 150), true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();