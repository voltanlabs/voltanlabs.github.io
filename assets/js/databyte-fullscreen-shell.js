// assets/js/databyte-fullscreen-shell.js
(function () {
  const STYLE_ID = "databyteFullscreenShellStyles";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      html,body{height:100%;background:#07111f!important;overscroll-behavior:none!important}
      body.dd-fullscreen-mode{margin:0!important;overflow:hidden!important;background:#07111f!important}
      body.dd-fullscreen-mode .dd-app-shell{position:fixed!important;inset:0!important;z-index:999999!important;width:100vw!important;height:100dvh!important;display:grid!important;grid-template-rows:minmax(0,1fr) auto!important;gap:8px!important;padding:8px 10px max(8px,env(safe-area-inset-bottom))!important;box-sizing:border-box!important;overflow:hidden!important;background:#07111f!important;color:#E5E7EB!important}
      body.dd-fullscreen-mode .dd-app-main{min-height:0!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;overflow:hidden!important}
      body.dd-fullscreen-mode .dd-app-stage{min-height:0!important;overflow:auto!important;overscroll-behavior:contain!important;display:block!important}
      body.dd-fullscreen-mode .dd-app-dock{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:7px!important;padding:7px!important;min-height:58px!important;border:1px solid rgba(125,211,252,.18)!important;border-radius:18px!important;background:rgba(15,23,42,.86)!important;box-sizing:border-box!important}
      body.dd-fullscreen-mode .dd-app-dock button{min-height:42px!important;border:1px solid rgba(125,211,252,.24)!important;background:rgba(30,41,59,.72)!important;color:#E5E7EB!important;border-radius:13px!important;padding:8px 4px!important;font-weight:800!important;font-size:.62rem!important;line-height:1.05!important}.dd-app-dock button strong{display:block!important;color:#FFD700!important;font-size:.82rem!important;margin-bottom:2px!important}
      body.dd-fullscreen-mode .dd-app-side{display:none!important}
      body.dd-fullscreen-mode #gamePanel{width:100%!important;max-width:760px!important;margin:0 auto!important;border-radius:18px!important;overflow:hidden!important;box-sizing:border-box!important}
      body.dd-fullscreen-mode #gamePanel .scan-bg{min-height:calc(100dvh - 205px)!important}
      body.dd-fullscreen-mode #gamePanel input,body.dd-fullscreen-mode #gamePanel button{touch-action:manipulation!important}
      .dd-start-screen{position:absolute;inset:0;z-index:1000000;display:grid;place-items:center;padding:24px;box-sizing:border-box;background:radial-gradient(circle at 50% 20%,rgba(0,123,255,.28),rgba(7,17,31,.98) 58%);text-align:center}.dd-start-card{width:min(100%,620px);display:grid;gap:18px;padding:28px 20px;border:1px solid rgba(125,211,252,.24);border-radius:28px;background:rgba(15,23,42,.72);box-shadow:0 24px 80px rgba(0,0,0,.38)}.dd-start-kicker{color:#FFD700;font-weight:900;letter-spacing:.24em;text-transform:uppercase;font-size:.72rem}.dd-start-title{color:#0787ff;font-size:clamp(2.2rem,12vw,5rem);font-weight:900;line-height:.92}.dd-start-copy{color:#CBD5E1;font-size:1rem;line-height:1.45}.dd-start-btn{border:0;border-radius:18px;background:#FFD700;color:#111827;font-weight:900;padding:15px 18px;font-size:1rem}.dd-start-note{color:#BAE6FD;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase}
      body.dd-app-starting .dd-app-main,body.dd-app-starting .dd-app-dock{visibility:hidden!important}
      @media(orientation:landscape) and (min-width:820px){body.dd-fullscreen-mode .dd-app-shell{grid-template-rows:minmax(0,1fr)!important}body.dd-fullscreen-mode .dd-app-main{grid-template-columns:minmax(520px,1.25fr) minmax(300px,.75fr)!important;gap:10px!important}body.dd-fullscreen-mode .dd-app-side{display:grid!important;min-height:0!important;overflow:auto!important}body.dd-fullscreen-mode .dd-app-dock{display:none!important}body.dd-fullscreen-mode #gamePanel .scan-bg{min-height:calc(100dvh - 90px)!important}}
    `;
    document.head.appendChild(style);
  }

  function makeButton(label, icon, action) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerHTML = `<strong>${icon}</strong>${label}`;
    btn.addEventListener("click", action);
    return btn;
  }

  function findScannerOwner(gamePanel) {
    let node = gamePanel;
    while (node && node.parentElement && node.parentElement !== document.body) {
      const text = (node.parentElement.textContent || "").toLowerCase();
      if (text.includes("discovery scanner") || text.includes("discovery code")) node = node.parentElement;
      else break;
    }
    return node || gamePanel;
  }

  function collectSidePanels(owner) {
    return Array.from(document.body.children).filter((el) => {
      if (!el || el === owner || el.contains(owner) || el.classList?.contains("dd-app-shell")) return false;
      if (["SCRIPT", "STYLE", "LINK"].includes(el.tagName)) return false;
      const t = (el.textContent || "").toLowerCase();
      return t.includes("admin") || t.includes("mission") || t.includes("evolution") || t.includes("inventory") || t.includes("databytedex");
    }).slice(0, 8);
  }

  function startScreen(shell) {
    const screen = document.createElement("div");
    screen.className = "dd-start-screen";
    screen.innerHTML = `<div class="dd-start-card"><div class="dd-start-kicker">Scanner Candidate Evaluation</div><div class="dd-start-title">DataByteSprites</div><div class="dd-start-copy">Enter the Data Discovery scanner, lock onto signals, launch DataByteCoins, and build your active party.</div><button class="dd-start-btn" type="button">Start Scanner</button><div class="dd-start-note">Tip: install to home screen for true fullscreen mode</div></div>`;
    shell.appendChild(screen);
    document.body.classList.add("dd-app-starting");
    screen.querySelector("button")?.addEventListener("click", () => {
      document.body.classList.remove("dd-app-starting");
      screen.remove();
    });
  }

  function build() {
    injectStyles();
    const gamePanel = document.getElementById("gamePanel");
    if (!gamePanel || !gamePanel.querySelector(".scan-bg") || document.querySelector(".dd-app-shell")) return false;

    const owner = findScannerOwner(gamePanel);
    const panels = collectSidePanels(owner);
    const originalParent = owner.parentElement;
    const placeholder = document.createComment("databyte-app-placeholder");
    originalParent.insertBefore(placeholder, owner);

    const shell = document.createElement("div");
    shell.className = "dd-app-shell";
    const main = document.createElement("div");
    main.className = "dd-app-main";
    const stage = document.createElement("div");
    stage.className = "dd-app-stage";
    const side = document.createElement("div");
    side.className = "dd-app-side";
    const dock = document.createElement("div");
    dock.className = "dd-app-dock";

    document.body.appendChild(shell);
    shell.appendChild(main);
    main.appendChild(stage);
    main.appendChild(side);
    stage.appendChild(owner);
    panels.forEach((p) => side.appendChild(p));

    dock.appendChild(makeButton("Scan", "⌁", () => stage.scrollTo({ top: 0, behavior: "smooth" })));
    dock.appendChild(makeButton("Party", "⚔", () => document.querySelector("[data-admin-action='party'],[data-panel='party']")?.click()));
    dock.appendChild(makeButton("Dex", "▣", () => document.querySelector("[data-admin-action='dex'],[data-panel='dex']")?.click()));
    dock.appendChild(makeButton("Items", "◈", () => document.querySelector("[data-admin-action='inventory'],[data-panel='inventory']")?.click()));
    dock.appendChild(makeButton("Admin", "☰", () => side.scrollIntoView({ behavior: "smooth", block: "start" })));
    shell.appendChild(dock);

    document.body.classList.add("dd-fullscreen-mode");
    startScreen(shell);
    return true;
  }

  function boot() {
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (build() || tries > 20) clearInterval(timer);
    }, 250);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();