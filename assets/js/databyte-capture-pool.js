// assets/js/databyte-capture-pool.js
// Species-index capture pool bridge for Scanner OS.

(function () {
  if (!location.pathname.includes("databyte-discovery")) return;

  const SPECIES_INDEX_URL = "/studio/databytesprites/species.json";
  const SEEN_KEY = "vl_databyte_seen_v1";

  let pool = [];
  let pendingCode = "";
  let lastAppliedKey = "";

  const iconMap = {
    Electric: "🦁",
    Voltricity: "🦁",
    Water: "🦀",
    Code: "🦀",
    Shell: "🦀",
    Bug: "🦂",
    Poison: "🦂",
    Glitch: "🐉",
    Screen: "🖥️",
    Display: "🖥️",
    Mirror: "🪞",
    Trick: "🎭",
    Null: "⚠️",
    Admin: "👑"
  };

  const colorMap = {
    Electric: "#FFD700",
    Voltricity: "#FFD700",
    Water: "#38BDF8",
    Code: "#A78BFA",
    Shell: "#A78BFA",
    Bug: "#FB923C",
    Poison: "#FB7185",
    Glitch: "#C084FC",
    Screen: "#38BDF8",
    Display: "#38BDF8",
    Mirror: "#A78BFA",
    Trick: "#FB7185",
    Null: "#FB7185",
    Admin: "#FFD700"
  };

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function read(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function hash(text) {
    let value = 2166136261;
    const input = String(text || "");
    for (let i = 0; i < input.length; i += 1) {
      value ^= input.charCodeAt(i);
      value += (value << 1) + (value << 4) + (value << 7) + (value << 8) + (value << 24);
    }
    return Math.abs(value >>> 0);
  }

  function rarityChance(rarity) {
    const value = String(rarity || "").toLowerCase();
    if (value.includes("starter")) return 100;
    if (value.includes("locked")) return 0;
    if (value.includes("myth")) return 42;
    if (value.includes("legend")) return 55;
    if (value.includes("epic")) return 64;
    if (value.includes("rare")) return 74;
    if (value.includes("uncommon")) return 82;
    return 88;
  }

  function stabilityFor(rarity) {
    const value = String(rarity || "").toLowerCase();
    if (value.includes("locked")) return 9;
    if (value.includes("myth") || value.includes("legend")) return 7;
    if (value.includes("epic")) return 6;
    if (value.includes("rare")) return 5;
    if (value.includes("uncommon")) return 4;
    return 3;
  }

  function iconFor(species) {
    const elements = asArray(species.elements);
    for (const element of elements) {
      if (iconMap[element]) return iconMap[element];
    }
    return "◈";
  }

  function colorFor(species) {
    const elements = asArray(species.elements);
    for (const element of elements) {
      if (colorMap[element]) return colorMap[element];
    }
    return "#38BDF8";
  }

  function typeFor(species) {
    return asArray(species.elements).join(" / ") || species.speciesType || "Signal";
  }

  function dexFor(species, index) {
    if (species.id === "leovolt") return "001";
    return String(index + 1).padStart(3, "0");
  }

  function normalizeSpecies(species, index) {
    const rarity = species.rarity || "Common";
    return {
      dex: dexFor(species, index),
      name: species.name,
      type: typeFor(species),
      rarity,
      icon: iconFor(species),
      color: colorFor(species),
      chance: rarityChance(rarity),
      stability: stabilityFor(rarity),
      lore: species.lore || species.description || "Knowledge Engine signal record.",
      sourceId: species.id,
      sourceVersion: species.version || "0.1.0",
      battleStats: species.battleStats || null
    };
  }

  function pick(code) {
    const candidates = pool.filter((entry) => !String(entry.rarity || "").toLowerCase().includes("locked"));
    if (!candidates.length) return null;
    return candidates[hash(code) % candidates.length];
  }

  function applyStats(target, selected, code) {
    const seed = hash(`${code}-${selected.name}`);
    const stats = selected.battleStats || {};
    target.dex = selected.dex;
    target.seed = seed;
    target.code = code;
    target.name = selected.name;
    target.type = selected.type;
    target.icon = selected.icon;
    target.color = selected.color;
    target.rarity = selected.rarity;
    target.captureChance = selected.chance;
    target.currentChance = selected.chance;
    target.captureCap = selected.chance;
    target.maxStability = selected.stability;
    target.stability = selected.stability;
    target.lore = selected.lore;
    target.hp = stats.hp || target.hp;
    target.atk = stats.attack || target.atk;
    target.def = stats.defense || target.def;
    target.sourceSpeciesId = selected.sourceId;
    target.sourceIndex = SPECIES_INDEX_URL;
    target.sourceVersion = selected.sourceVersion;
  }

  function markSeen(sprite) {
    const seen = read(SEEN_KEY, []);
    const index = seen.findIndex((entry) => entry && entry.name === sprite.name);
    const record = {
      name: sprite.name,
      dex: sprite.dex,
      rarity: sprite.rarity,
      type: sprite.type,
      status: "Seen",
      seenAt: new Date().toISOString(),
      sourceSpeciesId: sprite.sourceSpeciesId || null
    };
    if (index >= 0) seen[index] = record;
    else seen.push(record);
    write(SEEN_KEY, seen);
  }

  function updateSignalDom(sprite) {
    const overlay = document.getElementById("ddOverlay");
    if (!overlay) return;

    const kicker = overlay.querySelector(".dd-kicker");
    const title = overlay.querySelector(".dd-title");
    const sub = overlay.querySelector(".dd-sub");
    const orb = overlay.querySelector(".dd-signal-art .dd-orb");
    const lore = overlay.querySelector(".dd-lore");
    const stats = overlay.querySelectorAll(".dd-grid .dd-stat strong");
    const card = overlay.querySelector(".dd-card");

    if (kicker) kicker.textContent = sprite.rarity;
    if (title) title.textContent = sprite.name;
    if (sub) sub.textContent = `#${sprite.dex} • ${sprite.type}`;
    if (orb) {
      orb.textContent = sprite.icon;
      orb.style.borderColor = sprite.color;
      orb.style.boxShadow = `0 0 45px ${sprite.color}66`;
    }
    if (lore) lore.textContent = sprite.lore;
    if (stats[0]) stats[0].textContent = sprite.hp;
    if (stats[1]) stats[1].textContent = sprite.atk;
    if (stats[2]) stats[2].textContent = sprite.def;
    if (card) {
      card.innerHTML = `<div class="dd-kicker">Signal Stability</div><strong>${sprite.stability}/${sprite.maxStability}</strong><div class="dd-sub">DataByteCoin Chance: ${sprite.captureChance}%</div><div class="dd-sub">Species Index: ${sprite.sourceSpeciesId || "indexed"}</div>`;
    }
  }

  function capturePendingCode(event) {
    const target = event.target && event.target.closest && event.target.closest("#ddDiscover,#ddRandom");
    if (!target) return;
    const input = document.getElementById("ddCode");
    pendingCode = input && input.value ? input.value.trim() : "";
    if (!pendingCode && target.id === "ddRandom") {
      setTimeout(() => {
        const later = document.getElementById("ddCode");
        pendingCode = later && later.value ? later.value.trim() : pendingCode;
      }, 0);
    }
  }

  function applyPoolSelection() {
    const encounter = window.ddGetEncounter && window.ddGetEncounter();
    const code = pendingCode || (encounter && encounter.code) || "";
    if (!encounter || !code || !pool.length) return;

    const selected = pick(code);
    if (!selected) return;

    const applyKey = `${encounter.id}:${selected.sourceId}`;
    if (applyKey === lastAppliedKey) return;
    lastAppliedKey = applyKey;

    applyStats(encounter, selected, code);
    markSeen(encounter);
    updateSignalDom(encounter);
  }

  async function loadPool() {
    try {
      const response = await fetch(SPECIES_INDEX_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`Species index unavailable: ${response.status}`);
      const data = await response.json();
      pool = asArray(data.species).map(normalizeSpecies);
      window.DBS_CAPTURE_POOL = {
        source: SPECIES_INDEX_URL,
        version: data.schemaVersion || "0.1.0",
        size: pool.length,
        pick,
        records: pool.slice()
      };
    } catch (error) {
      console.warn(error);
      window.DBS_CAPTURE_POOL = { source: SPECIES_INDEX_URL, version: "unavailable", size: 0, pick: () => null, records: [] };
    }
  }

  document.addEventListener("click", capturePendingCode, true);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target && event.target.id === "ddCode") {
      pendingCode = event.target.value.trim();
    }
  }, true);

  document.addEventListener("dd:screen", (event) => {
    if (event.detail && event.detail.overlay === "signal") {
      setTimeout(applyPoolSelection, 0);
    }
  });

  loadPool();
})();
