// assets/js/databyte-move-bridge.js
// Additive move-list bridge for Data Discovery. Keeps basic Attack as the fallback.

(function () {
  if (!location.pathname.includes("databyte-discovery")) return;

  const MOVE_INDEX_URL = "/studio/databytesprites/moves.json";
  let moveIndex = { moves: [], speciesMoveSets: [] };

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char] || char));
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
        movesFor,
        useMove
      };
    } catch (error) {
      console.warn(error);
      window.DBS_MOVE_INDEX = { source: MOVE_INDEX_URL, version: "unavailable", moves: [], speciesMoveSets: [], movesFor: () => [], useMove: () => false };
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
    html.innerHTML = `<div class="dd-kicker">Move List</div>${availableMoves.map((move) => `<button class="dd-card" data-dbs-move="${escapeHtml(move.id)}" style="width:100%;color:white;text-align:left;margin-top:7px"><strong>${escapeHtml(move.name)}</strong><div class="dd-sub">${escapeHtml(move.moveType)} • PWR ${escapeHtml(move.power)} • +${escapeHtml(move.captureEffect)} capture</div></button>`).join("")}<div class="dd-sub">Move buttons enhance capture odds and then use the current Attack fallback.</div>`;
    sidePanel.appendChild(html);
  }

  function moveById(id) {
    return asArray(moveIndex.moves).find((move) => move.id === id) || null;
  }

  function useMove(moveId) {
    const move = moveById(moveId);
    const encounter = window.ddGetEncounter && window.ddGetEncounter();
    if (!move || !encounter) return false;

    if (typeof window.ddBoostCapture === "function") {
      window.ddBoostCapture(move.captureEffect || 0);
    }

    encounter.lastMoveId = move.id;
    encounter.lastMoveName = move.name;
    encounter.lastMovePower = move.power;
    encounter.lastMoveType = move.moveType;

    const attackButton = document.getElementById("actAttack");
    if (attackButton && !attackButton.disabled) {
      attackButton.click();
      setTimeout(() => {
        const next = document.querySelector(".dd-log");
        if (next) next.innerHTML = `<div class="dd-kicker">Battle Log</div>${escapeHtml(move.name)} executed. Current battle engine resolved through Attack fallback.`;
      }, 0);
      return true;
    }

    const overlay = document.getElementById("ddOverlay");
    const card = overlay && overlay.querySelector("[data-move-preview]");
    if (card) {
      card.insertAdjacentHTML("beforeend", `<div class="dd-sub">${escapeHtml(move.name)} primed for next battle action.</div>`);
    }
    return true;
  }

  document.addEventListener("click", (event) => {
    const button = event.target && event.target.closest && event.target.closest("[data-dbs-move]");
    if (!button) return;
    event.preventDefault();
    useMove(button.dataset.dbsMove);
  }, true);

  document.addEventListener("dd:screen", (event) => {
    if (event.detail && (event.detail.overlay === "signal" || event.detail.screen === "battle")) {
      setTimeout(renderMovePreview, 0);
    }
  });

  loadMoves();
})();
