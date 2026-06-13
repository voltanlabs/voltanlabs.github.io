// assets/js/databyte-scanner-effects.js
(function () {
  const VERSION = "v0.84 Signal Effects";
  const SPECIAL_NAMES = new Set(["Glitchwyrm", "Mirrormaster", "Proxsentience"]);
  let lastName = "";

  function injectStyles() {
    if (document.getElementById("databyteScannerEffectsStyles")) return;
    const style = document.createElement("style");
    style.id = "databyteScannerEffectsStyles";
    style.textContent = `
      #gamePanel .scan-bg {
        position: relative;
        overflow: hidden;
        isolation: isolate;
      }

      #gamePanel .scan-bg::before {
        content: "";
        position: absolute;
        inset: -45%;
        z-index: 0;
        pointer-events: none;
        background:
          linear-gradient(115deg, transparent 42%, rgba(125, 211, 252, .18) 49%, rgba(255,255,255,.35) 50%, rgba(125, 211, 252, .18) 51%, transparent 58%),
          repeating-linear-gradient(0deg, rgba(125,211,252,.08) 0 1px, transparent 1px 18px);
        transform: translateX(-38%) rotate(0deg);
        opacity: .45;
        animation: db-signal-sweep 5.5s linear infinite;
      }

      #gamePanel .scan-bg::after {
        content: "";
        position: absolute;
        inset: 8%;
        z-index: 0;
        pointer-events: none;
        border-radius: 999px;
        border: 1px solid rgba(125,211,252,.22);
        box-shadow:
          0 0 70px rgba(0,123,255,.18),
          inset 0 0 70px rgba(0,123,255,.13);
        opacity: .72;
        animation: db-field-pulse 3.2s ease-in-out infinite;
      }

      #gamePanel .scan-bg > * {
        position: relative;
        z-index: 1;
      }

      #spriteOrb {
        animation: db-orb-idle 2.8s ease-in-out infinite;
      }

      #spriteOrb.db-materialize {
        animation: db-materialize .9s ease-out both, db-orb-idle 2.8s ease-in-out .9s infinite;
      }

      #spriteOrb.db-rare-signal {
        box-shadow: 0 0 58px rgba(192,132,252,.65), 0 0 120px rgba(192,132,252,.28) !important;
        border-color: rgba(216,180,254,.95) !important;
      }

      #gamePanel .scan-bg.db-signal-lock {
        box-shadow: inset 0 0 100px rgba(34,197,94,.16), 0 0 40px rgba(34,197,94,.18);
      }

      #gamePanel .scan-bg.db-rare-stage::before {
        opacity: .8;
        background:
          linear-gradient(115deg, transparent 40%, rgba(216,180,254,.24) 49%, rgba(255,255,255,.45) 50%, rgba(216,180,254,.24) 51%, transparent 60%),
          repeating-linear-gradient(0deg, rgba(216,180,254,.12) 0 1px, transparent 1px 16px);
        animation-duration: 3.2s;
      }

      .db-effect-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border: 1px solid rgba(125,211,252,.28);
        background: rgba(14,165,233,.08);
        color: #BAE6FD;
        border-radius: 999px;
        padding: 5px 9px;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: .12em;
        text-transform: uppercase;
      }

      @keyframes db-signal-sweep {
        0% { transform: translateX(-42%) rotate(0deg); }
        100% { transform: translateX(42%) rotate(0deg); }
      }

      @keyframes db-field-pulse {
        0%, 100% { transform: scale(.96); opacity: .46; }
        50% { transform: scale(1.03); opacity: .9; }
      }

      @keyframes db-orb-idle {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-8px) scale(1.035); }
      }

      @keyframes db-materialize {
        0% { opacity: 0; filter: blur(14px); transform: scale(.52) rotate(-8deg); }
        55% { opacity: 1; filter: blur(2px); transform: scale(1.16) rotate(3deg); }
        100% { opacity: 1; filter: blur(0); transform: scale(1) rotate(0deg); }
      }
    `;
    document.head.appendChild(style);
  }

  function currentName() {
    return document.getElementById("encounterName")?.textContent?.trim() || "";
  }

  function scanStage() {
    return document.querySelector("#gamePanel .scan-bg");
  }

  function markMaterialize() {
    const orb = document.getElementById("spriteOrb");
    if (!orb) return;
    orb.classList.remove("db-materialize");
    void orb.offsetWidth;
    orb.classList.add("db-materialize");
  }

  function updateEffects() {
    const name = currentName();
    const stage = scanStage();
    const orb = document.getElementById("spriteOrb");
    if (!stage || !orb) return;

    const hasEncounter = !!name && !["Awaiting Signal", "Unknown Signal"].includes(name);
    const rare = SPECIAL_NAMES.has(name);

    stage.classList.toggle("db-signal-lock", hasEncounter);
    stage.classList.toggle("db-rare-stage", rare);
    orb.classList.toggle("db-rare-signal", rare);

    if (name && name !== lastName) {
      lastName = name;
      if (hasEncounter) markMaterialize();
    }
  }

  function syncVersion() {
    document.querySelectorAll("span, strong").forEach((el) => {
      const text = (el.textContent || "").trim();
      if (text === "v0.82 Scanner Workspace" || text === "v0.83 Stable Console") el.textContent = VERSION;
    });
  }

  function boot() {
    injectStyles();
    updateEffects();
    syncVersion();
    const target = document.getElementById("encounterName");
    if (target) new MutationObserver(updateEffects).observe(target, { childList: true, characterData: true, subtree: true });
    setInterval(function () {
      updateEffects();
      syncVersion();
    }, 1000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
