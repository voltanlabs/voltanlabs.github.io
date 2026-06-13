// assets/js/databyte-app-shell.js
(function () {
  const VERSION = "v0.81 App Shell";

  function injectStyles() {
    if (document.getElementById("databyteAppShellStyles")) return;
    const style = document.createElement("style");
    style.id = "databyteAppShellStyles";
    style.textContent = `
      body {
        background:
          radial-gradient(circle at top left, rgba(0,123,255,.18), transparent 34rem),
          radial-gradient(circle at top right, rgba(255,215,0,.08), transparent 28rem),
          #111827 !important;
      }

      body:has(#gamePanel) main {
        max-width: 1480px;
        margin: 0 auto;
      }

      #gamePanel {
        max-width: 1380px !important;
        margin-left: auto !important;
        margin-right: auto !important;
        align-items: start;
      }

      #gamePanel > div,
      #gamePanel aside > section,
      #dexModal > div,
      #registrationPanel > div {
        border-radius: 24px !important;
        backdrop-filter: blur(14px);
      }

      #gamePanel > div {
        min-width: 0;
      }

      #gamePanel aside {
        min-width: 340px;
        max-width: 440px;
        width: 100%;
      }

      #gamePanel aside > section {
        background: rgba(44,62,80,.88) !important;
      }

      #gamePanel .scan-bg {
        min-height: clamp(300px, 42vh, 520px) !important;
      }

      #encounterCard {
        max-width: 360px;
        margin-left: auto;
        margin-right: auto;
      }

      #collectionList,
      #inventoryScrollList,
      #scannerMissionsList,
      #evolutionProgressList {
        scrollbar-width: thin;
        overscroll-behavior: contain;
      }

      #collectionList::-webkit-scrollbar,
      #inventoryScrollList::-webkit-scrollbar,
      #scannerMissionsList::-webkit-scrollbar,
      #evolutionProgressList::-webkit-scrollbar {
        width: 8px;
      }

      #collectionList::-webkit-scrollbar-thumb,
      #inventoryScrollList::-webkit-scrollbar-thumb,
      #scannerMissionsList::-webkit-scrollbar-thumb,
      #evolutionProgressList::-webkit-scrollbar-thumb {
        background: rgba(255,215,0,.45);
        border-radius: 999px;
      }

      .db-app-topbar {
        max-width: 1380px;
        margin: 18px auto 0;
        padding: 10px 16px;
        border: 1px solid rgba(125,211,252,.22);
        background: rgba(15,23,42,.76);
        border-radius: 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        box-shadow: 0 18px 50px rgba(0,0,0,.24);
        backdrop-filter: blur(14px);
      }

      .db-app-topbar strong {
        color: #FFD700;
        font-family: Orbitron, sans-serif;
        letter-spacing: .04em;
      }

      .db-app-version {
        color: #BAE6FD;
        border: 1px solid rgba(186,230,253,.4);
        background: rgba(14,165,233,.1);
        border-radius: 999px;
        padding: 6px 10px;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: .12em;
        white-space: nowrap;
      }

      @media (min-width: 1280px) {
        #gamePanel {
          grid-template-columns: minmax(720px, 1fr) 400px !important;
        }
      }

      @media (min-width: 1024px) {
        #gamePanel > div > .p-6 {
          grid-template-columns: minmax(320px, .95fr) minmax(320px, .9fr) !important;
        }
      }

      @media (max-width: 1279px) {
        #gamePanel aside {
          min-width: 0;
          max-width: none;
        }
      }

      @media (max-width: 768px) {
        .db-app-topbar {
          margin: 10px 12px 0;
          flex-direction: column;
          align-items: flex-start;
        }

        #encounterCard {
          max-width: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function addTopbar() {
    if (document.getElementById("databyteAppTopbar")) return;
    const gamePanel = document.getElementById("gamePanel");
    if (!gamePanel) return;
    const bar = document.createElement("div");
    bar.id = "databyteAppTopbar";
    bar.className = "db-app-topbar";
    bar.innerHTML = `<strong>Data Discovery Console</strong><span class="db-app-version">${VERSION}</span>`;
    gamePanel.parentElement.insertBefore(bar, gamePanel);
  }

  function syncVersionText() {
    document.querySelectorAll("span, strong").forEach((el) => {
      const text = (el.textContent || "").trim();
      if (text === "v0.70" || text === "v0.80 Preview") el.textContent = VERSION;
    });
  }

  function boot() {
    injectStyles();
    addTopbar();
    syncVersionText();
    setInterval(syncVersionText, 1500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
