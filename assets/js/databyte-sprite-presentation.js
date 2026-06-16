// assets/js/databyte-sprite-presentation.js
(function () {
  function injectStyles() {
    if (document.getElementById("databyteSpritePresentationStyles")) return;
    const style = document.createElement("style");
    style.id = "databyteSpritePresentationStyles";
    style.textContent = `
      #spriteOrb {
        width: clamp(170px, 23vw, 300px) !important;
        height: clamp(170px, 23vw, 300px) !important;
        font-size: clamp(5.25rem, 9vw, 8.5rem) !important;
      }
      #gamePanel .scan-bg.db-sprite-focus {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-direction: column !important;
      }
      .db-scanner-center-lock { display: contents !important; }
      .db-sprite-status-bar,
      #databyteSpriteStatusBar {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
      .db-reveal-banner { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }
      #gamePanel .scan-bg.db-rare-protocol { box-shadow: inset 0 0 120px rgba(192,132,252,.18), 0 0 45px rgba(192,132,252,.18) !important; }
      @media (max-width: 768px) {
        #spriteOrb { width: clamp(135px,42vw,190px) !important; height: clamp(135px,42vw,190px) !important; font-size: clamp(4.25rem,18vw,6rem) !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function nameNow() { return document.getElementById("encounterName")?.textContent?.trim() || ""; }
  function stage() { return document.querySelector("#gamePanel .scan-bg"); }

  function rarityKey() {
    const text = (document.getElementById("encounterCard")?.innerText || "").toLowerCase();
    if (text.includes("legendary") || text.includes("mythic")) return "legendary";
    if (text.includes("epic")) return "epic";
    if (text.includes("rare")) return "rare";
    return "common";
  }

  function removeBanner() {
    document.querySelectorAll(".db-reveal-banner").forEach((banner) => banner.remove());
  }

  function removeStatusBar() {
    document.getElementById("databyteSpriteStatusBar")?.remove();
    document.querySelectorAll(".db-sprite-status-bar").forEach((bar) => bar.remove());
  }

  function updatePresentation() {
    injectStyles();
    removeBanner();
    removeStatusBar();
    const s = stage();
    if (!s) return;
    const name = nameNow();
    const hasEncounter = !!name && !["Awaiting Signal", "Unknown Signal"].includes(name);
    const rarity = rarityKey();
    s.classList.toggle("db-sprite-focus", hasEncounter);
    s.classList.toggle("db-rare-protocol", rarity !== "common" && hasEncounter);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", updatePresentation);
  else updatePresentation();
  setInterval(updatePresentation, 1000);
})();