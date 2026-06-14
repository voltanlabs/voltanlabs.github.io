// assets/js/databyte-sprite-presentation.js
(function () {
  const VERSION = "v0.85.3 Scanner HUD";
  const RARITY_POWER = { common: 62, rare: 78, epic: 88, legendary: 96 };

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
      .db-sprite-status-bar {
        display: none;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
        width: 100%;
        margin-top: 12px;
        border: 1px solid rgba(125,211,252,.18);
        background: rgba(15,23,42,.34);
        border-radius: 18px;
        padding: 9px;
        backdrop-filter: blur(10px);
      }
      .db-sprite-status-bar.is-active { display: grid; }
      .db-sprite-meter { border: 1px solid rgba(125,211,252,.25); background: rgba(15,23,42,.58); border-radius: 14px; padding: 8px 10px; color: #E5E7EB; }
      .db-sprite-meter span { display: flex; justify-content: space-between; gap: 10px; font-size: 10px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; color: #BAE6FD; }
      .db-sprite-meter strong { color: #FFD700; }
      .db-meter-track { height: 6px; border-radius: 999px; background: rgba(255,255,255,.12); overflow: hidden; margin-top: 6px; }
      .db-meter-fill { height: 100%; width: var(--fill, 50%); border-radius: inherit; background: linear-gradient(90deg, rgba(34,211,238,.85), rgba(255,215,0,.85)); }
      .db-reveal-banner { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }
      #gamePanel .scan-bg.db-rare-protocol { box-shadow: inset 0 0 120px rgba(192,132,252,.18), 0 0 45px rgba(192,132,252,.18) !important; }
      @media (max-width: 768px) {
        #spriteOrb { width: clamp(135px,42vw,190px) !important; height: clamp(135px,42vw,190px) !important; font-size: clamp(4.25rem,18vw,6rem) !important; }
        .db-sprite-status-bar { grid-template-columns: 1fr; }
      }
    `;
    document.head.appendChild(style);
  }

  function nameNow() { return document.getElementById("encounterName")?.textContent?.trim() || ""; }
  function stage() { return document.querySelector("#gamePanel .scan-bg"); }
  function byteChance() { return document.getElementById("byteCoinChance")?.textContent?.trim() || "--"; }

  function rarityKey() {
    const text = (document.getElementById("encounterCard")?.innerText || "").toLowerCase();
    if (text.includes("legendary")) return "legendary";
    if (text.includes("epic")) return "epic";
    if (text.includes("rare")) return "rare";
    return "common";
  }

  function meter(label, value, fill) {
    return `<div class="db-sprite-meter"><span>${label}<strong>${value}</strong></span><div class="db-meter-track"><div class="db-meter-fill" style="--fill:${fill}%"></div></div></div>`;
  }

  function ensureStatusBar() {
    const s = stage();
    if (!s) return null;
    let bar = document.getElementById("databyteSpriteStatusBar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "databyteSpriteStatusBar";
      bar.className = "db-sprite-status-bar";
    }
    if (bar.parentElement !== s.parentElement) s.insertAdjacentElement("afterend", bar);
    return bar;
  }

  function removeBanner() {
    document.querySelectorAll(".db-reveal-banner").forEach((banner) => banner.remove());
  }

  function updatePresentation() {
    injectStyles();
    removeBanner();
    const s = stage();
    if (!s) return;
    const name = nameNow();
    const hasEncounter = !!name && !["Awaiting Signal", "Unknown Signal"].includes(name);
    const rarity = rarityKey();
    const signal = hasEncounter ? RARITY_POWER[rarity] || 70 : 34;
    const chanceText = byteChance();
    const chanceNumber = Number(chanceText.replace(/[^0-9]/g, "")) || 8;
    s.classList.toggle("db-sprite-focus", hasEncounter);
    s.classList.toggle("db-rare-protocol", rarity !== "common" && hasEncounter);
    const bar = ensureStatusBar();
    if (bar) {
      bar.classList.toggle("is-active", hasEncounter);
      bar.innerHTML = hasEncounter ? [meter("Signal", `${signal}%`, signal), meter("Capture", chanceText, Math.max(8, chanceNumber)), meter("Rarity", rarity.toUpperCase(), signal)].join("") : "";
    }
    document.querySelectorAll("span,strong").forEach((el) => {
      const t = (el.textContent || "").trim();
      if (t.startsWith("v0.85.")) el.textContent = VERSION;
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", updatePresentation);
  else updatePresentation();
  setInterval(updatePresentation, 1000);
})();