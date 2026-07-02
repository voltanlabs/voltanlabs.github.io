// assets/js/databyte-move-bridge.js
// Additive move-list bridge for Data Discovery. Does not replace the current Attack button yet.

(function () {
  if (!location.pathname.includes("databyte-discovery")) return;

  const MOVE_INDEX_URL = "/studio/databytesprites/moves.json";
  let moveIndex = { moves: [], speciesMoveSets: [] };

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  async function loadMoves() {
    try {
      const response = await fetch(MOVE_INDEX_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`Move index unavailable: ${response.status}`);
      moveIndex = await response.json();
      window.DBS_MOVE_INDEX = {
        source: MOVE_INDEX_URL,
        version: moveIndex.schemaVersion || "0.1.0",
        moves: asArray(moveIndex.moves),
        speciesMoveSets: asArray(moveIndex.speciesMoveSets),
        movesFor
      };
    } catch (error) {
      console.warn(error);
      window.DBS_MOVE_INDEX = { source: MOVE_INDEX_URL, version: "unavailable", moves: [], speciesMoveSets: [], movesFor: () => [] };
    }
  }

  function movesFor(speciesIdOrName) {
    const key = String(speciesIdOrName || "").toLowerCase();
    const moves = asArray(moveIndex.moves);
    const sets = asArray(moveIndex.speciesMoveSets);
    const set = sets.find((entry) => String(entry.speciesId || "").toLowerCase() === key);
    const ids = new Set(["signal-strike", ...asArray(set && set.moves)]);

    return moves.filter((move) => {
      const learnedBy = asArray(move.learnedBy).map((item) => String(item).toLowerCase());
      return ids.has(move.id) || learnedBy.includes("*") || learnedBy.includes(key);
    });
  }

  function currentSpeciesKey(encounter) {
    return encounter && (encounter.sourceSpeciesId || encounter.name || "");
  }

  function renderMovePreview() {
    const encounter = window.ddGetEncounter && window.ddGetEncounter();
    if (!encounter) return;

    const overlay = document.getElementById("ddOverlay");
    if (!overlay) return;

    const sidePanel = overlay.querySelector(".side") || overlay.querySelector(".dd-panel");
    if (!sidePanel || sidePanel.querySelector("[data-move-preview]")) return;

    const availableMoves = movesFor(currentSpeciesKey(encounter)).slice(0, 4);
    if (!availableMoves.length) return;

    const html = document.createElement("div");
    html.className = "dd-card";
    html.dataset.movePreview = "1";
    html.style.marginTop = "9px";
    html.innerHTML = `<div class="dd-kicker">Move List Foundation</div>${availableMoves.map((move) => `<div class="dd-sub"><strong>${move.name}</strong> • ${move.moveType} • PWR ${move.power}</div>`).join("")}<div class="dd-sub">Current battle still uses basic Attack. Custom move buttons are next.</div>`;
    sidePanel.appendChild(html);
  }

  document.addEventListener("dd:screen", (event) => {
    if (event.detail && (event.detail.overlay === "signal" || event.detail.screen === "battle")) {
      setTimeout(renderMovePreview, 0);
    }
  });

  loadMoves();
})();
