// assets/js/databyte-ui-state-fix.js
(function () {
  const STYLE_ID = "databyteUiStateFixStyles";

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      body.dd-ui-state-signal #gamePanel .scan-bg + div,
      body.dd-ui-state-signal #gamePanel .scan-bg ~ div,
      body.dd-ui-state-battle #gamePanel .scan-bg + div,
      body.dd-ui-state-battle #gamePanel .scan-bg ~ div,
      body.dd-ui-state-modal #gamePanel .scan-bg + div,
      body.dd-ui-state-modal #gamePanel .scan-bg ~ div {
        display: none !important;
      }

      body.dd-ui-state-battle .dd-floating-menu,
      body.dd-ui-state-modal .dd-floating-menu {
        display: none !important;
      }

      body.dd-ui-state-signal #encounterCard {
        margin: 0 !important;
        max-height: calc(100dvh - 26px) !important;
        overflow: auto !important;
        overscroll-behavior: contain !important;
        padding-bottom: 22px !important;
        box-sizing: border-box !important;
      }

      body.dd-ui-state-modal #encounterCard,
      body.dd-ui-state-modal #databyteSignalOverlay {
        height: 100% !important;
        max-height: 100% !important;
        margin: 0 !important;
        padding-bottom: 18px !important;
        box-sizing: border-box !important;
        display: grid !important;
        align-content: center !important;
      }

      body.dd-ui-state-battle #dbBattlePhase2 {
        display: grid !important;
        align-content: start !important;
        gap: 8px !important;
        padding: 8px 8px 86px !important;
        background: rgba(7,17,31,.34) !important;
      }
    `;
    document.head.appendChild(style);
  }

  function visible(el) {
    if (!el) return false;
    const s = window.getComputedStyle(el);
    return s.display !== "none" && s.visibility !== "hidden" && el.offsetParent !== null;
  }

  function setState() {
    const shell = document.querySelector(".dd-app-shell");
    const scanBg = document.querySelector("#gamePanel .scan-bg");
    const text = (scanBg?.textContent || "").toLowerCase();
    const battle = document.getElementById("dbBattlePhase2");
    const signalOverlay = document.getElementById("databyteSignalOverlay");
    const encounterCard = document.getElementById("encounterCard");

    const battleActive = !!battle && visible(battle) && text.includes("signal battle") && text.includes("active");
    const modalActive =
      text.includes("databytecoin created") ||
      text.includes("signal collapsed") ||
      text.includes("signal lost") ||
      text.includes("party offline") ||
      text.includes("continue");
    const signalActive = !battleActive && !modalActive && (
      (!!signalOverlay && visible(signalOverlay)) ||
      (!!encounterCard && visible(encounterCard)) ||
      text.includes("launch databytecoin") ||
      text.includes("battle signal") ||
      text.includes("display signal") ||
      text.includes("signal locked") ||
      text.includes("discovered") ||
      text.includes("special signal detected")
    );

    document.body.classList.toggle("dd-ui-state-battle", battleActive);
    document.body.classList.toggle("dd-ui-state-modal", modalActive);
    document.body.classList.toggle("dd-ui-state-signal", signalActive);

    if (battleActive || modalActive) shell?.querySelector(".dd-floating-menu")?.classList.remove("open");
  }

  function boot() {
    addStyles();
    setState();
    setInterval(setState, 200);
    const gamePanel = document.getElementById("gamePanel");
    if (gamePanel) {
      new MutationObserver(setState).observe(gamePanel, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
      });
    }
    document.addEventListener("click", () => setTimeout(setState, 80), true);
    document.addEventListener("touchend", () => setTimeout(setState, 80), true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();