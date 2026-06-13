// assets/js/databyte-sprite-presentation.js
(function () {
  const VERSION = "v0.85.4 Scanner Layout Fix";
  const RARITY_POWER = { common: 62, rare: 78, epic: 88, legendary: 96 };
  let lastName = "";
  let sequenceUntil = 0;

  function injectStyles() {
    if (document.getElementById("databyteSpritePresentationStyles")) return;
    const style = document.createElement("style");
    style.id = "databyteSpritePresentationStyles";
    style.textContent = `
      #spriteOrb {
        width: clamp(170px, 23vw, 300px) !important;
        height: clamp(170px, 23vw, 300px) !important;
        font-size: clamp(5.25rem, 9vw, 8.5rem) !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      #gamePanel .scan-bg {
        display: grid !important;
        place-items: center !important;
      }

      .db-scanner-center-lock {
        position: absolute !important;
        left: 50% !important;
        top: 50% !important;
        transform: translate(-50%, -50%) !important;
        z-index: 2 !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
        width: min(92%, 560px) !important;
        max-width: 560px !important;
        pointer-events: none;
      }

      .db-scanner-center-lock > *,
      .db-scanner-center-lock p,
      .db-scanner-center-lock h2,
      .db-scanner-center-lock h3,
      .db-scanner-center-lock span,
      .db-scanner-center-lock div {
        margin-left: auto !important;
        margin-right: auto !important;
        text-align: center !important;
      }

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

      .db-sprite-meter {
        border: 1px solid rgba(125,211,252,.25);
        background: rgba(15,23,42,.58);
        backdrop-filter: blur(10px);
        border-radius: 14px;
        padding: 8px 10px;
        color: #E5E7EB;
      }

      .db-sprite-meter span {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: .1em;
        text-transform: uppercase;
        color: #BAE6FD;
      }

      .db-sprite-meter strong { color: #FFD700; }

      .db-meter-track {
        height: 6px;
        border-radius: 999px;
        background: rgba(255,255,255,.12);
        overflow: hidden;
        margin-top: 6px;
      }

      .db-meter-fill {
        height: 100%;
        width: var(--fill, 50%);
        border-radius: inherit;
        background: linear-gradient(90deg, rgba(34,211,238,.85), rgba(255,215,0,.85));
        box-shadow: 0 0 18px rgba(255,215,0,.22);
      }

      .db-reveal-banner {
        position: absolute;
        left: 50%;
        top: 16px;
        z-index: 3;
        transform: translateX(-50%);
        border: 1px solid rgba(255,215,0,.32);
        background: rgba(15,23,42,.58);
        color: #FEF3C7;
        backdrop-filter: blur(10px);
        border-radius: 999px;
        padding: 8px 13px;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .16em;
        text-transform: uppercase;
        opacity: .95;
        box-shadow: 0 0 24px rgba(255,215,0,.12);
        white-space: nowrap;
      }

      .db-reveal-banner.db-rare {
        border-color: rgba(216,180,254,.55);
        color: #F5D0FE;
        box-shadow: 0 0 36px rgba(192,132,252,.34);
      }

      #gamePanel .scan-bg.db-rare-protocol {
        box-shadow: inset 0 0 120px rgba(192,132,252,.18), 0 0 45px rgba(192,132,252,.18) !important;
      }

      #gamePanel .scan-bg.db-rare-protocol + .db-sprite-status-bar {
        border-color: rgba(216,180,254,.32);
      }

      @media (min-width: 1024px) {
        #encounterCard {
          max-width: none !important;
          width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          display: grid !important;
          grid-template-columns: minmax(150px, 210px) minmax(0, 1fr) !important;
          align-items: center !important;
          gap: 1rem !important;
        }

        #encounterCard > * { min-width: 0; }

        #encounterCard .text-5xl,
        #encounterCard .text-6xl,
        #encounterCard [class*="text-5xl"],
        #encounterCard [class*="text-6xl"] {
          font-size: clamp(4rem, 7vw, 6.8rem) !important;
          line-height: 1 !important;
        }
      }

      @media (max-width: 768px) {
        #spriteOrb {
          width: clamp(135px, 42vw, 190px) !important;
          height: clamp(135px, 42vw, 190px) !important;
          font-size: clamp(4.25rem, 18vw, 6rem) !important;
        }

        .db-scanner-center-lock {
          width: min(92%, 360px) !important;
        }

        .db-sprite-status-bar {
          grid-template-columns: 1fr;
          margin-top: 12px;
        }

        .db-reveal-banner {
          top: 12px;
          width: max-content;
          max-width: calc(100% - 24px);
          text-align: center;
          white-space: normal;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function stage() { return document.querySelector("#gamePanel .scan-bg"); }
  function nameNow() { return document.getElementById("encounterName")?.textContent?.trim() || ""; }
  function byteChance() { return document.getElementById("byteCoinChance")?.textContent?.trim() || "--"; }

  function rarityKey() {
    const card = document.getElementById("encounterCard");
    const text = (card?.innerText || card?.textContent || "").toUpperCase();
    if (/\bLEGENDARY\b/.test(text)) return "legendary";
    if (/\bEPIC\b/.test(text)) return "epic";
    if (/\bRARE\b/.test(text)) return "rare";
    if (/\bCOMMON\b/.test(text)) return "common";
    return "common";
  }

  function meter(label, value, fill) {
    return `<div class="db-sprite-meter"><span>${label}<strong>${value}</strong></span><div class="db-meter-track"><div class="db-meter-fill" style="--fill:${fill}%"></div></div></div>`;
  }

  function ensureCenterLock() {
    const s = stage();
    const orb = document.getElementById("spriteOrb");
    if (!s || !orb) return null;
    let lock = s.querySelector(".db-scanner-center-lock");
    if (!lock) {
      lock = document.createElement("div");
      lock.className = "db-scanner-center-lock";
      s.appendChild(lock);
    }

    if (orb.parentElement !== lock) lock.appendChild(orb);

    Array.from(s.children).forEach((node) => {
      if (node === lock) return;
      if (node.classList?.contains("db-scan-fx-layer")) return;
      if (node.classList?.contains("db-reveal-banner")) return;
      if (node.id === "databyteSpriteStatusBar") return;
      if (node.matches?.("script, style")) return;
      lock.appendChild(node);
    });
    return lock;
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

  function ensureBanner() {
    const s = stage();
    if (!s) return null;
    let banner = s.querySelector(".db-reveal-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.className = "db-reveal-banner";
      banner.textContent = "Scanner Ready";
      s.appendChild(banner);
    }
    return banner;
  }

  function runSequence(name, rare) {
    const sequence = rare
      ? ["Rare Signal Detected", "Warning: Anomaly", "Lock Acquired", `${name} Revealed`]
      : ["Signal Detected", "Lock Acquired", "Materializing", `${name} Revealed`];
    sequenceUntil = Date.now() + sequence.length * 560 + 300;
    sequence.forEach((label, index) => {
      setTimeout(() => {
        const banner = ensureBanner();
        if (!banner) return;
        banner.textContent = label;
        banner.classList.toggle("db-rare", rare);
      }, index * 560);
    });
  }

  function updatePresentation() {
    injectStyles();
    const s = stage();
    if (!s) return;
    ensureCenterLock();
    const name = nameNow();
    const hasEncounter = !!name && !["Awaiting Signal", "Unknown Signal"].includes(name);
    const rarity = rarityKey();
    const rare = rarity !== "common";
    const signal = hasEncounter ? RARITY_POWER[rarity] || 70 : 34;
    const chanceText = byteChance();
    const chanceNumber = Number(chanceText.replace(/[^0-9]/g, "")) || (hasEncounter ? 70 : 0);

    s.classList.toggle("db-sprite-focus", hasEncounter);
    s.classList.toggle("db-rare-protocol", rare && hasEncounter);

    const bar = ensureStatusBar();
    if (bar) {
      bar.classList.toggle("is-active", hasEncounter);
      if (hasEncounter) {
        bar.innerHTML = [
          meter("Signal", `${signal}%`, signal),
          meter("Capture", chanceText, Math.max(8, chanceNumber)),
          meter("Rarity", rarity.toUpperCase(), signal)
        ].join("");
      } else {
        bar.innerHTML = "";
      }
    }

    const banner = ensureBanner();
    if (banner && Date.now() > sequenceUntil) {
      banner.classList.toggle("db-rare", rare && hasEncounter);
      banner.textContent = hasEncounter ? `${rare ? "Rare Protocol • " : "Signal Locked • "}${name}` : "Scanner Ready";
    }

    if (hasEncounter && name !== lastName) {
      lastName = name;
      runSequence(name, rare);
    }
  }

  function syncVersion() {
    document.querySelectorAll("span, strong").forEach((el) => {
      const text = (el.textContent || "").trim();
      if (text === "v0.84 Scanner Evolution" || text === "v0.85 Sprite Presentation" || text === "v0.85.1 Scanner Polish" || text === "v0.85.2 Scanner HUD" || text === "v0.85.3 Center Lock") el.textContent = VERSION;
    });
  }

  function boot() {
    updatePresentation();
    syncVersion();
    const target = document.getElementById("encounterName");
    if (target) new MutationObserver(updatePresentation).observe(target, { childList: true, characterData: true, subtree: true });
    const card = document.getElementById("encounterCard");
    if (card) new MutationObserver(updatePresentation).observe(card, { childList: true, characterData: true, subtree: true, attributes: true });
    setInterval(function () {
      updatePresentation();
      syncVersion();
    }, 1000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
