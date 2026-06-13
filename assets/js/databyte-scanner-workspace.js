// assets/js/databyte-scanner-workspace.js
(function () {
  const VERSION = "v0.82 Scanner Workspace";

  function inject() {
    if (document.getElementById("databyteScannerWorkspaceStyles")) return;
    const style = document.createElement("style");
    style.id = "databyteScannerWorkspaceStyles";
    style.textContent = `
      #gamePanel {
        max-width: 1440px !important;
      }

      #gamePanel .scan-bg {
        min-height: clamp(420px, 56vh, 680px) !important;
      }

      #spriteOrb {
        width: clamp(120px, 18vw, 220px) !important;
        height: clamp(120px, 18vw, 220px) !important;
        font-size: clamp(3rem, 6vw, 5.5rem) !important;
      }

      @media (min-width: 1280px) {
        #gamePanel {
          grid-template-columns: minmax(840px, 1fr) 400px !important;
        }
      }

      @media (min-width: 1024px) {
        #gamePanel > div > .p-6 {
          display: grid !important;
          grid-template-columns: 1fr minmax(320px, 420px) !important;
          align-items: start;
          gap: 1.5rem !important;
        }

        #gamePanel > div > .p-6 > :first-child {
          grid-column: 1 / -1;
        }

        #gamePanel > div > .p-6 > :nth-child(2),
        #gamePanel > div > .p-6 > :nth-child(3) {
          grid-column: auto;
        }
      }

      @media (max-width: 768px) {
        #gamePanel .scan-bg {
          min-height: clamp(320px, 62vh, 520px) !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function syncVersion() {
    document.querySelectorAll("span, strong").forEach((el) => {
      const text = (el.textContent || "").trim();
      if (text === "v0.81 App Shell") el.textContent = VERSION;
    });
  }

  function boot() {
    inject();
    syncVersion();
    setInterval(syncVersion, 1500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
