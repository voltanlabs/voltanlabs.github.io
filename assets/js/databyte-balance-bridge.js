// assets/js/databyte-balance-bridge.js
// Additive Species Index balance layer for Data Discovery.

(function () {
  if (!location.pathname.includes("databyte-discovery")) return;

  const BALANCE_VERSION = "0.1.0";

  const caps = {
    common: { power: 48, stability: 3 },
    uncommon: { power: 56, stability: 4 },
    rare: { power: 66, stability: 5 },
    epic: { power: 78, stability: 6 },
    legendary: { power: 92, stability: 7 },
    mythic: { power: 108, stability: 8 },
    locked: { power: 130, stability: 9 }
  };

  function tierOf(rarity) {
    const text = String(rarity || "").toLowerCase();
    if (text.includes("locked")) return "locked";
    if (text.includes("myth")) return "mythic";
    if (text.includes("legend")) return "legendary";
    if (text.includes("epic")) return "epic";
    if (text.includes("rare")) return "rare";
    if (text.includes("uncommon")) return "uncommon";
    return "common";
  }

  function clamp(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return min;
    return Math.max(min, Math.min(max, Math.round(number)));
  }

  function readPoolRecord(encounter) {
    const pool = window.DBS_CAPTURE_POOL;
    if (!pool || !Array.isArray(pool.records) || !encounter) return null;
    return pool.records.find((record) => record.sourceId === encounter.sourceSpeciesId || record.name === encounter.name) || null;
  }

  function computeBalance(encounter, source) {
    const tier = tierOf(encounter && encounter.rarity);
    const cap = caps[tier] || caps.common;
    const stats = source && source.battleStats ? source.battleStats : {};
    const hp = clamp(stats.hp || encounter.hp || 32, 20, cap.power + 12);
    const atk = clamp(stats.attack || encounter.atk || 10, 5, cap.power);
    const def = clamp(stats.defense || encounter.def || 8, 5, cap.power);
    const spd = clamp(stats.speed || encounter.spd || 8, 5, cap.power);
    const spc = clamp(stats.special || encounter.special || 8, 5, cap.power);
    const power = Math.round((hp * 0.55) + atk + def + spd + spc);

    return { tier, hp, atk, def, spd, spc, power, cap: cap.power };
  }

  function applyBalance() {
    const encounter = window.ddGetEncounter && window.ddGetEncounter();
    if (!encounter) return;

    const source = readPoolRecord(encounter);
    const balance = computeBalance(encounter, source);

    encounter.hp = balance.hp;
    encounter.atk = balance.atk;
    encounter.def = balance.def;
    encounter.spd = balance.spd;
    encounter.special = balance.spc;
    encounter.power = balance.power;
    encounter.balanceTier = balance.tier;
    encounter.balanceVersion = BALANCE_VERSION;

    const overlay = document.getElementById("ddOverlay");
    if (!overlay) return;

    const grid = overlay.querySelector(".dd-grid");
    if (grid) {
      grid.innerHTML = [
        ["HP", balance.hp],
        ["ATK", balance.atk],
        ["DEF", balance.def],
        ["SPD", balance.spd],
        ["SPC", balance.spc],
        ["PWR", balance.power]
      ].map(([label, value]) => `<div class="dd-stat"><span>${label}</span><strong>${value}</strong></div>`).join("");
    }

    const card = overlay.querySelector(".dd-card");
    if (card && !card.dataset.balanceEnhanced) {
      card.dataset.balanceEnhanced = "1";
      card.innerHTML += `<div class="dd-sub">Balance Tier: ${balance.tier} • v${BALANCE_VERSION}</div>`;
    }
  }

  document.addEventListener("dd:screen", (event) => {
    if (event.detail && (event.detail.overlay === "signal" || event.detail.screen === "battle")) {
      setTimeout(applyBalance, 0);
    }
  });

  window.DBS_BATTLE_BALANCE = {
    version: BALANCE_VERSION,
    caps,
    apply: applyBalance
  };
})();
