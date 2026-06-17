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
      body.dd-fullscreen-mode .dd-app-shell{position:fixed!important;inset:0!important;z-index:999999!important;width:100vw!important;height:100dvh!important;display:grid!important;grid-template-rows:minmax(0,1fr) auto!important;gap:8px!important;padding:8px 10px max(8px,env(safe-area-inset-bottom))!important;box-sizing:border-box!important;overflow:hidden!important;color:#E5E7EB!important;background:#07111f!important;isolation:isolate!important}
      body.dd-fullscreen-mode .dd-app-shell:before{content:"";position:absolute;inset:0;z-index:0;background-image:radial-gradient(circle at 50% 46%,rgba(0,123,255,.24),transparent 22%),radial-gradient(circle at 50% 46%,transparent 0 37%,rgba(125,211,252,.22) 37.3%,transparent 37.9%),linear-gradient(rgba(0,123,255,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(0,123,255,.16) 1px,transparent 1px),linear-gradient(135deg,transparent 46%,rgba(255,255,255,.14) 49%,rgba(255,255,255,.08) 51%,transparent 56%);background-size:100% 100%,100% 100%,22px 22px,22px 22px,100% 100%;opacity:.78;pointer-events:none}
      body.dd-fullscreen-mode .dd-app-shell>*{position:relative;z-index:1}
      body.dd-fullscreen-mode .dd-app-main{min-height:0!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;overflow:hidden!important}
      body.dd-fullscreen-mode .dd-app-stage{min-height:0!important;overflow:auto!important;overscroll-behavior:contain!important;display:block!important;border:0!important;border-radius:0!important;background:transparent!important}
      body.dd-fullscreen-mode .dd-app-dock{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:7px!important;padding:7px!important;min-height:58px!important;border:1px solid rgba(125,211,252,.18)!important;border-radius:18px!important;background:rgba(15,23,42,.86)!important;box-sizing:border-box!important}
      body.dd-fullscreen-mode .dd-app-dock button{min-height:42px!important;border:1px solid rgba(125,211,252,.24)!important;background:rgba(30,41,59,.72)!important;color:#E5E7EB!important;border-radius:13px!important;padding:8px 4px!important;font-weight:800!important;font-size:.62rem!important;line-height:1.05!important}.dd-app-dock button strong{display:block!important;color:#FFD700!important;font-size:.82rem!important;margin-bottom:2px!important}
      body.dd-fullscreen-mode .dd-app-side{display:none!important}
      body.dd-fullscreen-mode #gamePanel{display:grid!important;grid-template-columns:1fr!important;width:100%!important;max-width:760px!important;margin:0 auto!important;padding:0!important;border-radius:0!important;overflow:visible!important;box-sizing:border-box!important;background:transparent!important}
      body.dd-fullscreen-mode #gamePanel>aside{display:none!important}
      body.dd-fullscreen-mode #gamePanel>div{background:transparent!important;border:0!important;box-shadow:none!important;border-radius:0!important;overflow:visible!important}
      body.dd-fullscreen-mode #gamePanel>div>div:first-child{display:none!important}
      body.dd-fullscreen-mode #gamePanel>div>div:nth-child(2){padding:0!important;display:block!important}
      body.dd-fullscreen-mode #gamePanel .scan-bg{min-height:calc(100dvh - 92px)!important;height:calc(100dvh - 92px)!important;border:0!important;border-radius:0!important;background-color:transparent!important;background-image:none!important;overflow:hidden!important}
      body.dd-fullscreen-mode #gamePanel input,body.dd-fullscreen-mode #gamePanel button{touch-action:manipulation!important}
      body.dd-fullscreen-mode #gamePanel .scan-bg + div,body.dd-fullscreen-mode #gamePanel .scan-bg~div{position:relative!important;z-index:5!important;padding:10px!important;background:rgba(7,17,31,.72)!important;border-radius:18px!important;margin-top:8px!important}
      .dd-start-screen{position:absolute;inset:0;z-index:2147483600!important;display:grid;place-items:center;padding:24px;box-sizing:border-box;text-align:center;background:rgba(7,17,31,.24);pointer-events:auto!important}.dd-start-card{width:min(100%,620px);display:grid;gap:18px;padding:28px 20px;border:1px solid rgba(125,211,252,.24);border-radius:28px;background:rgba(15,23,42,.82);box-shadow:0 24px 80px rgba(0,0,0,.38);backdrop-filter:blur(8px);pointer-events:auto!important}.dd-start-kicker{color:#FFD700;font-weight:900;letter-spacing:.24em;text-transform:uppercase;font-size:.72rem}.dd-start-title{color:#0787ff;font-size:clamp(2.2rem,12vw,5rem);font-weight:900;line-height:.92}.dd-start-copy{color:#CBD5E1;font-size:1rem;line-height:1.45}.dd-start-btn{border:0;border-radius:18px;background:#FFD700;color:#111827;font-weight:900;padding:15px 18px;font-size:1rem;pointer-events:auto!important}.dd-start-note{color:#BAE6FD;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase}
      body.dd-app-starting .dd-app-main,body.dd-app-starting .dd-app-dock{visibility:hidden!important;pointer-events:none!important}
      @media(orientation:landscape) and (min-width:820px){body.dd-fullscreen-mode .dd-app-shell{grid-template-rows:minmax(0,1fr)!important}body.dd-fullscreen-mode .dd-app-main{grid-template-columns:minmax(520px,1.25fr) minmax(300px,.75fr)!important;gap:10px!important}body.dd-fullscreen-mode .dd-app-side{display:grid!important;min-height:0!important;overflow:auto!important}body.dd-fullscreen-mode .dd-app-dock{display:none!important}body.dd-fullscreen-mode #gamePanel .scan-bg{min-height:calc(100dvh - 32px)!important;height:calc(100dvh - 32px)!important}}
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

  function collectSidePanels(gamePanel) {
    return Array.from(document.body.children).filter((el) => {
      if (!el || el === gamePanel || el.contains(gamePanel) || el.classList?.contains("dd-app-shell")) return false;
      if (["SCRIPT", "STYLE", "LINK"].includes(el.tagName)) return false;
      const t = (el.textContent || "").toLowerCase();
      return t.includes("admin") || t.includes("mission") || t.includes("evolution") || t.includes("inventory") || t.includes("databytedex");
    }).slice(0, 8);
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
    screen.addEventListener("click", function (event) {
      if (event.target.closest("[data-dd-start]")) enterScanner(shell);
    });
    screen.addEventListener("touchend", function (event) {
      if (event.target.closest("[data-dd-start]")) {
        event.preventDefault();
        enterScanner(shell);
      }
    }, { passive: false });
  }

  function build() {
    injectStyles();
    const gamePanel = document.getElementById("gamePanel");
    if (!gamePanel || !gamePanel.querySelector(".scan-bg") || document.querySelector(".dd-app-shell")) return false;

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
    const dock = document.createElement("div");
    dock.className = "dd-app-dock";

    document.body.appendChild(shell);
    shell.appendChild(main);
    main.appendChild(stage);
    main.appendChild(side);
    stage.appendChild(gamePanel);
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