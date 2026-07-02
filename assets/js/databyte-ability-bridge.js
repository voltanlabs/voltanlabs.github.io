// assets/js/databyte-ability-bridge.js
// Additive passive ability bridge for Data Discovery.

(function () {
  if (!location.pathname.includes("databyte-discovery")) return;

  const ABILITY_INDEX_URL = "/studio/databytesprites/abilities.json";
  let abilityIndex = { abilities: [], speciesAbilities: [] };

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char] || char));
  }

  function currentEncounter() {
    return window.ddGetEncounter && window.ddGetEncounter();
  }

  function speciesKey(encounter) {
    return String((encounter && (encounter.sourceSpeciesId || encounter.name)) || "").toLowerCase();
  }

  function abilitiesFor(speciesIdOrName) {
    const key = String(speciesIdOrName || "").toLowerCase();
    const set = asArray(abilityIndex.speciesAbilities).find((entry) => String(entry.speciesId || "").toLowerCase() === key);
    const ids = new Set(asArray(set && set.abilities));

    return asArray(abilityIndex.abilities).filter((ability) => {
      const assigned = asArray(ability.assignedTo).map((item) => String(item).toLowerCase());
      return ids.has(ability.id) || assigned.includes(key);
    });
  }

  function applyAbilityEffects(encounter, abilities) {
    if (!encounter || encounter.abilityApplied) return;

    let captureBonus = 0;
    let capturePenalty = 0;
    let powerBonus = 0;
    let defenseBonus = 0;
    let speedBonus = 0;

    abilities.forEach((ability) => {
      const effects = ability.effects || {};
      captureBonus += Number(effects.captureBonus || 0);
      capturePenalty += Number(effects.capturePenalty || 0);
      powerBonus += Number(effects.powerBonus || 0);
      defenseBonus += Number(effects.defenseBonus || 0);
      speedBonus += Number(effects.speedBonus || 0);
    });

    if (captureBonus && typeof window.ddBoostCapture === "function") window.ddBoostCapture(captureBonus);
    if (capturePenalty && typeof window.ddBoostCapture === "function") window.ddBoostCapture(-capturePenalty);

    encounter.def = Math.max(1, Math.round((encounter.def || 0) + defenseBonus));
    encounter.spd = Math.max(1, Math.round((encounter.spd || 0) + speedBonus));
    encounter.power = Math.max(0, Math.round((encounter.power || 0) + powerBonus));
    encounter.abilityApplied = true;
    encounter.abilities = abilities.map((ability) => ability.id);
  }

  function renderAbilityCard() {
    const encounter = currentEncounter();
    const overlay = document.getElementById("ddOverlay");
    if (!encounter || !overlay) return;

    const abilities = abilitiesFor(speciesKey(encounter));
    if (!abilities.length) return;

    applyAbilityEffects(encounter, abilities);

    const sidePanel = overlay.querySelector(".side") || overlay.querySelector(".dd-panel");
    if (!sidePanel || sidePanel.querySelector("[data-ability-preview]")) return;

    const card = document.createElement("div");
    card.className = "dd-card";
    card.dataset.abilityPreview = "1";
    card.style.marginTop = "9px";
    card.innerHTML = `<div class="dd-kicker">Passive Ability</div>${abilities.map((ability) => `<div class="dd-sub"><strong>${escapeHtml(ability.name)}</strong> • ${escapeHtml(ability.abilityType)}</div><div class="dd-sub">${escapeHtml(ability.description)}</div>`).join("")}`;
    sidePanel.appendChild(card);
  }

  async function loadAbilities() {
    try {
      const response = await fetch(ABILITY_INDEX_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`Ability index unavailable: ${response.status}`);
      abilityIndex = await response.json();
      window.DBS_ABILITY_INDEX = {
        source: ABILITY_INDEX_URL,
        version: abilityIndex.schemaVersion || "0.1.0",
        abilities: asArray(abilityIndex.abilities),
        speciesAbilities: asArray(abilityIndex.speciesAbilities),
        abilitiesFor
      };
    } catch (error) {
      console.warn(error);
      window.DBS_ABILITY_INDEX = { source: ABILITY_INDEX_URL, version: "unavailable", abilities: [], speciesAbilities: [], abilitiesFor: () => [] };
    }
  }

  document.addEventListener("dd:screen", (event) => {
    if (event.detail && (event.detail.overlay === "signal" || event.detail.screen === "battle")) {
      setTimeout(renderAbilityCard, 0);
    }
  });

  loadAbilities();
})();
