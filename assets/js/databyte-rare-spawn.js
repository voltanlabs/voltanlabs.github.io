// assets/js/databyte-rare-spawn.js
(function () {
  const SPECIAL = [
    { dex: "043", name: "Glitchwyrm", type: "Glitch", rarity: "Epic", icon: "🐉", color: "#C084FC", chance: 54, stability: 5, lore: "Glitch dragon/wyrm data sprite." },
    { dex: "047", name: "Mirrormaster", type: "Display / Mystic", rarity: "Mythic", icon: "🪞", color: "#A78BFA", chance: 40, stability: 7, lore: "Mirror and display master sprite." },
    { dex: "052", name: "Proxsentience", type: "Proxy / Signal", rarity: "Epic", icon: "◈", color: "#A78BFA", chance: 50, stability: 6, lore: "Sentient proxy data sprite." }
  ];

  function hash(text) {
    let x = 2166136261;
    for (let i = 0; i < text.length; i++) {
      x ^= text.charCodeAt(i);
      x += (x << 1) + (x << 4) + (x << 7) + (x << 8) + (x << 24);
    }
    return Math.abs(x >>> 0);
  }

  function specialTemplate(code) {
    const seed = hash(`special-${code}`);
    if (seed % 100 !== 0) return null;
    const roll = seed % 1000;
    if (roll < 500) return SPECIAL[0];
    if (roll < 800) return SPECIAL[1];
    return SPECIAL[2];
  }

  function makeSprite(template, code) {
    if (typeof window.makeSprite === "function") return window.makeSprite(template, code, false);
    const seed = hash(`${code}-${template.name}`);
    return {
      id: `DBS-${seed}-${Date.now()}`,
      dex: template.dex,
      seed,
      code,
      name: template.name,
      type: template.type,
      icon: template.icon,
      color: template.color,
      rarity: template.rarity,
      captureChance: template.chance,
      currentChance: template.chance,
      maxStability: template.stability,
      stability: template.stability,
      lore: template.lore,
      hp: 34 + (seed % 24),
      atk: 9 + ((seed >> 3) % 18),
      def: 8 + ((seed >> 5) % 17),
      discoveredAt: new Date().toISOString(),
      byteCoin: null
    };
  }

  function runSpecialScan(code) {
    const template = specialTemplate(code);
    if (!template || typeof window.showEncounter !== "function") return false;

    const scanBtn = document.getElementById("scanBtn");
    const randomBtn = document.getElementById("randomBtn");
    const card = document.getElementById("encounterCard");
    const stage = document.getElementById("revealStage");
    const status = document.getElementById("scannerStatus");
    const orb = document.getElementById("spriteOrb");

    if (card) card.classList.add("hidden");
    if (scanBtn) scanBtn.disabled = true;
    if (randomBtn) randomBtn.disabled = true;
    if (stage) stage.textContent = "SPECIAL SIGNAL DETECTED";
    if (status) status.textContent = "Rare signal path opening.";
    if (orb) orb.textContent = "◈";

    setTimeout(function () {
      window.showEncounter(makeSprite(template, code));
      if (scanBtn) scanBtn.disabled = false;
      if (randomBtn) randomBtn.disabled = false;
    }, 900);

    return true;
  }

  function handleCode(code, event) {
    if (!code) return false;
    if (!runSpecialScan(code)) return false;
    if (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    return true;
  }

  function boot() {
    const input = document.getElementById("codeInput");
    const scanBtn = document.getElementById("scanBtn");
    const randomBtn = document.getElementById("randomBtn");

    scanBtn?.addEventListener("click", function (event) {
      handleCode(input?.value?.trim() || "", event);
    }, true);

    input?.addEventListener("keydown", function (event) {
      if (event.key === "Enter") handleCode(input.value.trim(), event);
    }, true);

    randomBtn?.addEventListener("click", function (event) {
      const code = String(Math.floor(100000000000 + Math.random() * 899999999999));
      if (input) input.value = code;
      handleCode(code, event);
    }, true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
