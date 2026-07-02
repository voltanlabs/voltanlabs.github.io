// assets/js/databyte-type-bridge.js
// Additive type-effectiveness bridge for Data Discovery.

(function () {
  if (!location.pathname.includes("databyte-discovery")) return;

  const TYPE_CHART_URL = "/studio/databytesprites/type-chart.json";
  let chart = { rules: [], multipliers: { strong: 1.25, neutral: 1, weak: 0.8, none: 0, captureBonus: 3 } };

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function normalize(value) {
    return String(value || "").toLowerCase();
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char] || char));
  }

  function currentEncounter() {
    return window.ddGetEncounter && window.ddGetEncounter();
  }

  function encounterElements(encounter) {
    if (!encounter) return [];
    if (Array.isArray(encounter.elements) && encounter.elements.length) return encounter.elements;
    return String(encounter.type || "").split("/").map((item) => item.trim()).filter(Boolean);
  }

  function ruleFor(element) {
    return asArray(chart.rules).find((rule) => normalize(rule.attackingElement) === normalize(element));
  }

  function evaluate(attackingElements, defendingElements) {
    let best = { label: "neutral", multiplier: chart.multipliers.neutral || 1, captureBonus: 0, reason: "Neutral signal interaction." };

    asArray(attackingElements).forEach((attackElement) => {
      const rule = ruleFor(attackElement);
      if (!rule) return;
      asArray(defendingElements).forEach((defenseElement) => {
        const target = normalize(defenseElement);
        if (asArray(rule.noEffectAgainst).map(normalize).includes(target)) {
          best = { label: "no effect", multiplier: chart.multipliers.none || 0, captureBonus: 0, reason: `${attackElement} has no effect on ${defenseElement}.` };
          return;
        }
        if (asArray(rule.strongAgainst).map(normalize).includes(target) && best.multiplier <= (chart.multipliers.strong || 1.25)) {
          best = { label: "strong", multiplier: chart.multipliers.strong || 1.25, captureBonus: asArray(rule.captureBonusAgainst).map(normalize).includes(target) ? (chart.multipliers.captureBonus || 3) : 0, reason: `${attackElement} is strong against ${defenseElement}.` };
        }
        if (asArray(rule.weakAgainst).map(normalize).includes(target) && best.label === "neutral") {
          best = { label: "weak", multiplier: chart.multipliers.weak || 0.8, captureBonus: 0, reason: `${attackElement} is weak against ${defenseElement}.` };
        }
      });
    });

    return best;
  }

  function moveElements(move) {
    return asArray(move && move.elements).length ? move.elements : ["Signal"];
  }

  function appendTypeInfo() {
    const encounter = currentEncounter();
    const overlay = document.getElementById("ddOverlay");
    if (!encounter || !overlay) return;

    const moveButtons = overlay.querySelectorAll("[data-dbs-move]");
    moveButtons.forEach((button) => {
      if (button.dataset.typeEnhanced) return;
      const index = window.DBS_MOVE_INDEX;
      const move = index && asArray(index.moves).find((entry) => entry.id === button.dataset.dbsMove);
      if (!move) return;
      const result = evaluate(moveElements(move), encounterElements(encounter));
      button.dataset.typeEnhanced = "1";
      button.dataset.typeMultiplier = String(result.multiplier);
      button.dataset.typeCaptureBonus = String(result.captureBonus);
      button.insertAdjacentHTML("beforeend", `<div class="dd-sub">Type: ${escapeHtml(result.label)} ×${escapeHtml(result.multiplier)} ${result.captureBonus ? `• +${escapeHtml(result.captureBonus)} capture` : ""}</div>`);
    });
  }

  function patchMoveUse() {
    const moveIndex = window.DBS_MOVE_INDEX;
    if (!moveIndex || moveIndex.typePatched || typeof moveIndex.useMove !== "function") return false;

    const original = moveIndex.useMove;
    moveIndex.useMove = function (moveId) {
      const encounter = currentEncounter();
      const move = asArray(moveIndex.moves).find((entry) => entry.id === moveId);
      const result = evaluate(moveElements(move), encounterElements(encounter));

      if (encounter) {
        encounter.lastTypeEffect = result.label;
        encounter.lastTypeMultiplier = result.multiplier;
        encounter.lastTypeReason = result.reason;
      }
      if (result.captureBonus && typeof window.ddBoostCapture === "function") {
        window.ddBoostCapture(result.captureBonus);
      }

      const used = original(moveId);
      setTimeout(() => {
        const log = document.querySelector(".dd-log");
        if (log && move) {
          log.innerHTML = `<div class="dd-kicker">Battle Log</div>${escapeHtml(move.name)} used. ${escapeHtml(result.reason)} Type modifier ×${escapeHtml(result.multiplier)}.`;
        }
      }, 0);
      return used;
    };
    moveIndex.typePatched = true;
    return true;
  }

  async function loadChart() {
    try {
      const response = await fetch(TYPE_CHART_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`Type chart unavailable: ${response.status}`);
      chart = await response.json();
      window.DBS_TYPE_CHART = {
        source: TYPE_CHART_URL,
        version: chart.schemaVersion || "0.1.0",
        rules: asArray(chart.rules),
        multipliers: chart.multipliers || {},
        evaluate
      };
    } catch (error) {
      console.warn(error);
      window.DBS_TYPE_CHART = { source: TYPE_CHART_URL, version: "unavailable", rules: [], multipliers: chart.multipliers, evaluate };
    }
  }

  document.addEventListener("dd:screen", (event) => {
    if (event.detail && (event.detail.overlay === "signal" || event.detail.screen === "battle")) {
      setTimeout(() => {
        patchMoveUse();
        appendTypeInfo();
      }, 0);
    }
  });

  loadChart();
})();
