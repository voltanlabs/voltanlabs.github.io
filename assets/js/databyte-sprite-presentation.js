// assets/js/databyte-sprite-presentation.js
(function () {
  const VERSION = "v0.85.2 Scanner HUD";
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
      }

      #gamePanel .scan-bg.db-sprite-focus {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-direction: column !important;
      }

      #gamePanel .scan-bg.db-sprite-focus #spriteOrb { transform-origin: center; }
      #gamePanel .scan-bg.db-sprite-focus #spriteOrb + * { text-align: center; }

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

      @media (max-width: 768px) {
        #spriteOrb {
          width: clamp(135px, 42vw, 190px) !important;
          height: clamp(135px, 42vw, 190px) !important;
          font-size: clamp(4.25rem, 18vw, 6rem) !important;
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
        }
      }
    `;
    document.head.appendChild(style);
  }

  function stage() { return document.querySelector("#gamePanel .scan-bg"); }
  function nameNow() { return document.getElementById("encounterName")?.textContent?.trim() || ""; }
  function rarityNow() { return document.querySelector("#encounterCard .text-\\[10px\\]")?.textContent?.trim() || ""; }
  function byteChance() { return document.getElementById("byteCoinChance")?.textContent?.trim() || "--"; }

  function rarityKey() {
    const text = rarityNow().toLowerCase();
    if (text.includes("legend")) return "legendary";
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
      if (text === "v0.84 Scanner Evolution" || text === "v0.85 Sprite Presentation" || text === "v0.85.1 Scanner Polish") el.textContent = VERSION;
    });
  }

  function boot() {
    updatePresentation();
    syncVersion();
    const target = document.getElementById("encounterName");
    if (target) new MutationObserver(updatePresentation).observe(target, { childList: true, characterData: true, subtree: true });
    setInterval(function () {
      updatePresentation();
      syncVersion();
    }, 1000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
