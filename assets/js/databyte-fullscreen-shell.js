// assets/js/databyte-fullscreen-shell.js
(function () {
  const STYLE_ID = "databyteFullscreenShellStyles";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      html,body{min-height:100%;background:#07111f!important;overscroll-behavior:none}
      body:has(#gamePanel){margin:0!important;overflow-x:hidden!important;background:radial-gradient(circle at top,#17283d,#07111f 62%)!important}
      body:has(#gamePanel) main,
      body:has(#gamePanel) .page,
      body:has(#gamePanel) .container,
      body:has(#gamePanel) .mx-auto{
        max-width:none!important;
      }
      body:has(#gamePanel) #site-header,
      body:has(#gamePanel) header.site-header,
      body:has(#gamePanel) .shared-header,
      body:has(#gamePanel) footer,
      body:has(#gamePanel) .shared-footer{
        display:none!important;
      }
      body:has(#gamePanel) .dd-app-shell{
        width:100vw!important;
        min-height:100svh!important;
        display:grid!important;
        grid-template-rows:auto minmax(0,1fr) auto!important;
        gap:10px!important;
        padding:10px clamp(10px,3vw,22px) max(10px,env(safe-area-inset-bottom))!important;
        box-sizing:border-box!important;
        overflow:hidden!important;
      }
      .dd-app-topbar{
        display:flex;align-items:center;justify-content:space-between;gap:10px;
        padding:10px 12px;border:1px solid rgba(125,211,252,.22);border-radius:18px;
        background:rgba(15,23,42,.72);backdrop-filter:blur(10px);box-shadow:0 16px 40px rgba(0,0,0,.22);
      }
      .dd-app-brand{display:grid;gap:1px;min-width:0}.dd-app-title{color:#FFD700;font-weight:900;letter-spacing:.08em;text-transform:uppercase;font-size:clamp(.95rem,4vw,1.35rem);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dd-app-sub{color:#BAE6FD;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dd-app-chip{color:#BAE6FD;border:1px solid rgba(186,230,253,.32);background:rgba(14,165,233,.12);border-radius:999px;padding:8px 10px;font-size:.72rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap}.dd-app-main{min-height:0!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:10px!important;overflow:hidden!important}.dd-app-stage{min-height:0!important;overflow:auto!important;overscroll-behavior:contain!important;display:grid!important;align-items:start!important}.dd-app-side{min-height:0!important;overflow:auto!important;overscroll-behavior:contain!important;display:grid!important;gap:10px!important}.dd-app-dock{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;padding:8px;border:1px solid rgba(125,211,252,.18);border-radius:20px;background:rgba(15,23,42,.78);backdrop-filter:blur(12px)}.dd-app-dock button{border:1px solid rgba(125,211,252,.24);background:rgba(30,41,59,.72);color:#E5E7EB;border-radius:14px;padding:9px 6px;font-weight:800;font-size:.72rem;line-height:1.05}.dd-app-dock button strong{display:block;color:#FFD700;font-size:.95rem;margin-bottom:2px}
      body.dd-fullscreen-mode #gamePanel{
        width:min(100%,760px)!important;
        margin:0 auto!important;
        min-height:auto!important;
      }
      body.dd-fullscreen-mode #gamePanel .scan-bg{
        min-height:clamp(520px,68svh,780px)!important;
        max-height:none!important;
        aspect-ratio:auto!important;
      }
      body.dd-fullscreen-mode #gamePanel input,
      body.dd-fullscreen-mode #gamePanel button{
        touch-action:manipulation;
      }
      body.dd-fullscreen-mode .dd-app-side > *{
        margin:0!important;
      }
      @media(orientation:landscape) and (min-width:820px){
        body:has(#gamePanel) .dd-app-shell{grid-template-rows:auto minmax(0,1fr)!important;padding:10px 14px!important}
        .dd-app-main{grid-template-columns:minmax(520px,1.25fr) minmax(320px,.75fr)!important;align-items:stretch!important}.dd-app-dock{display:none!important}.dd-app-stage,.dd-app-side{max-height:calc(100svh - 82px)!important}.dd-app-stage{align-items:center!important}body.dd-fullscreen-mode #gamePanel{width:100%!important;max-width:860px!important}body.dd-fullscreen-mode #gamePanel .scan-bg{min-height:calc(100svh - 118px)!important}
      }
      @media(max-width:768px){
        body:has(#gamePanel) .dd-app-shell{padding-top:8px!important;gap:8px!important}.dd-app-topbar{padding:8px 10px;border-radius:16px}.dd-app-chip{font-size:.64rem;padding:7px 8px}.dd-app-stage{padding-bottom:4px}body.dd-fullscreen-mode #gamePanel{border-radius:20px!important}body.dd-fullscreen-mode #gamePanel .scan-bg{min-height:clamp(520px,66svh,720px)!important}.dd-app-dock{position:sticky;bottom:0;z-index:80}.dd-app-dock button{padding:8px 4px;font-size:.62rem}.dd-app-dock button strong{font-size:.82rem}
      }
    `;
    document.head.appendChild(style);
  }

  function findPanels(gamePanel) {
    const cards = Array.from(document.body.children).filter((el) => {
      if (el === gamePanel || el.classList.contains("dd-app-shell") || el.tagName === "SCRIPT" || el.tagName === "STYLE") return false;
      const txt = (el.textContent || "").toLowerCase();
      return txt.includes("admin d") || txt.includes("admin console") || txt.includes("discovery journal") || txt.includes("profile") || txt.includes("missions") || txt.includes("evolution");
    });
    return cards.slice(0, 8);
  }

  function dockButton(label, icon, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerHTML = `<strong>${icon}</strong>${label}`;
    btn.addEventListener("click", onClick);
    return btn;
  }

  function build() {
    injectStyles();
    const gamePanel = document.getElementById("gamePanel");
    if (!gamePanel || document.querySelector(".dd-app-shell")) return;
    document.body.classList.add("dd-fullscreen-mode");

    const shell = document.createElement("div");
    shell.className = "dd-app-shell";
    const topbar = document.createElement("div");
    topbar.className = "dd-app-topbar";
    topbar.innerHTML = `<div class="dd-app-brand"><div class="dd-app-title">Data Discovery</div><div class="dd-app-sub">Scanner app shell</div></div><div class="dd-app-chip">v0.88 shell</div>`;

    const main = document.createElement("div");
    main.className = "dd-app-main";
    const stage = document.createElement("div");
    stage.className = "dd-app-stage";
    const side = document.createElement("div");
    side.className = "dd-app-side";
    const dock = document.createElement("div");
    dock.className = "dd-app-dock";

    const originalParent = gamePanel.parentNode;
    originalParent.insertBefore(shell, gamePanel);
    shell.appendChild(topbar);
    shell.appendChild(main);
    main.appendChild(stage);
    main.appendChild(side);
    stage.appendChild(gamePanel);

    findPanels(gamePanel).forEach((panel) => side.appendChild(panel));

    dock.appendChild(dockButton("Scan", "⌁", () => document.getElementById("gamePanel")?.scrollIntoView({ behavior:"smooth", block:"center" })));
    dock.appendChild(dockButton("Party", "⚔", () => document.querySelector("[data-panel='party'],[data-admin-action='party'],button[aria-label*='Party']")?.click()));
    dock.appendChild(dockButton("Dex", "▣", () => document.querySelector("[data-panel='dex'],[data-admin-action='dex'],[data-admin-action='databytedex']")?.click()));
    dock.appendChild(dockButton("Items", "◈", () => document.querySelector("[data-panel='inventory'],[data-admin-action='inventory']")?.click()));
    dock.appendChild(dockButton("Admin", "☰", () => side.scrollIntoView({ behavior:"smooth", block:"start" })));
    shell.appendChild(dock);
  }

  function boot() {
    build();
    setTimeout(build, 800);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();