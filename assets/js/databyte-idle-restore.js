// assets/js/databyte-idle-restore.js
(function () {
  const STYLE_ID = "databyteIdleRestoreStyles";

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      body.dd-force-idle #gamePanel .scan-bg + div,
      body.dd-force-idle #gamePanel .scan-bg ~ div {
        display: block !important;
      }
      body.dd-force-idle .dd-floating-menu {
        display: grid !important;
      }
    `;
    document.head.appendChild(style);
  }

  function sync() {
    const scanBg = document.querySelector("#gamePanel .scan-bg");
    const text = (scanBg && scanBg.textContent ? scanBg.textContent : "").toLowerCase();
    const idle = text.includes("signal waiting") || text.includes("scanner ready") || text.includes("enter a code to start discovery");
    document.body.classList.toggle("dd-force-idle", idle);
    if (idle) {
      document.body.classList.remove("dd-ui-state-signal", "dd-ui-state-battle", "dd-ui-state-modal", "dd-mode-signal", "dd-mode-battle", "dd-mode-modal");
      document.querySelector(".dd-floating-menu")?.classList.remove("open");
    }
  }

  function boot() {
    addStyles();
    sync();
    setInterval(sync, 150);
    const gamePanel = document.getElementById("gamePanel");
    if (gamePanel) new MutationObserver(sync).observe(gamePanel, { childList: true, subtree: true, characterData: true, attributes: true });
    document.addEventListener("click", () => setTimeout(sync, 60), true);
    document.addEventListener("touchend", () => setTimeout(sync, 60), true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();