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
      body.dd-fullscreen-mode .dd-app-shell{position:fixed!important;inset:0!important;z-index:999999!important;width:100vw!important;height:100dvh!important;display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important;gap:8px!important;padding:8px 10px max(8px,env(safe-area-inset-bottom))!important;box-sizing:border-box!important;overflow:hidden!important;background:#07111f!important;color:#E5E7EB!important}
      body.dd-fullscreen-mode .dd-app-topbar{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;min-height:46px!important;padding:8px 10px!important;border:1px solid rgba(125,211,252,.22)!important;border-radius:16px!important;background:rgba(15,23,42,.86)!important;box-sizing:border-box!important}
      .dd-app-title{color:#FFD700!important;font-weight:900!important;letter-spacing:.08em!important;text-transform:uppercase!important;font-size:1rem!important}.dd-app-sub{color:#BAE6FD!important;font-size:.66rem!important;letter-spacing:.12em!important;text-transform:uppercase!important}.dd-app-chip{color:#BAE6FD!important;border:1px solid rgba(186,230,253,.32)!important;background:rgba(14,165,233,.12)!important;border-radius:999px!important;padding:7px 9px!important;font-size:.62rem!important;font-weight:800!important;letter-spacing:.12em!important;text-transform:uppercase!important;white-space:nowrap!important}
      body.dd-fullscreen-mode .dd-app-main{min-height:0!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;overflow:hidden!important}
      body.dd-fullscreen-mode .dd-app-stage{min-height:0!important;overflow:auto!important;overscroll-behavior:contain!important;display:block!important}
      body.dd-fullscreen-mode .dd-app-dock{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:7px!important;padding:7px!important;min-height:58px!important;border:1px solid rgba(125,211,252,.18)!important;border-radius:18px!important;background:rgba(15,23,42,.86)!important;box-sizing:border-box!important}
      body.dd-fullscreen-mode .dd-app-dock button{min-height:42px!important;border:1px solid rgba(125,211,252,.24)!important;background:rgba(30,41,59,.72)!important;color:#E5E7EB!important;border-radius:13px!important;padding:8px 4px!important;font-weight:800!important;font-size:.62rem!important;line-height:1.05!important}.dd-app-dock button strong{display:block!important;color:#FFD700!important;font-size:.82rem!important;margin-bottom:2px!important}
      body.dd-fullscreen-mode .dd-app-side{display:none!important}
      body.dd-fullscreen-mode #gamePanel{width:100%!important;max-width:760px!important;margin:0 auto!important;border-radius:18px!important;overflow:hidden!important;box-sizing:border-box!important}
      body.dd-fullscreen-mode #gamePanel .scan-bg{min-height:calc(100dvh - 265px)!important}
      body.dd-fullscreen-mode #gamePanel input,body.dd-fullscreen-mode #gamePanel button{touch-action:manipulation!important}
      @media(orientation:landscape) and (min-width:820px){body.dd-fullscreen-mode .dd-app-shell{grid-template-rows:auto minmax(0,1fr)!important}body.dd-fullscreen-mode .dd-app-main{grid-template-columns:minmax(520px,1.25fr) minmax(300px,.75fr)!important;gap:10px!important}body.dd-fullscreen-mode .dd-app-side{display:grid!important;min-height:0!important;overflow:auto!important}body.dd-fullscreen-mode .dd-app-dock{display:none!important}body.dd-fullscreen-mode #gamePanel .scan-bg{min-height:calc(100dvh - 150px)!important}}
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
    const topbar = document.createElement("div");
    topbar.className = "dd-app-topbar";
    topbar.innerHTML = `<div><div class="dd-app-title">Data Discovery</div><div class="dd-app-sub">Scanner Active</div></div><div class="dd-app-chip">v0.88 App</div>`;
    const main = document.createElement("div");
    main.className = "dd-app-main";
    const stage = document.createElement("div");
    stage.className = "dd-app-stage";
    const side = document.createElement("div");
    side.className = "dd-app-side";
    const dock = document.createElement("div");
    dock.className = "dd-app-dock";

    document.body.appendChild(shell);
    shell.appendChild(topbar);
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