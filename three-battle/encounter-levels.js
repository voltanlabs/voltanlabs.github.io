(function () {
  const rarityBands = { Common: [1, 20], Uncommon: [21, 40], Rare: [41, 60], Epic: [61, 75], Legendary: [76, 90], Mythic: [91, 100] };
  function install() {
    const session = window.DataByteSession;
    if (!session?.createEncounter || session.createEncounter.__levels) return;
    const original = session.createEncounter;
    const wrapped = function (playerId, currentId) {
      const encounter = original(playerId, currentId);
      const authored = Number(encounter?.level ?? encounter?.runtime?.level);
      const band = rarityBands[encounter?.rarity] || rarityBands.Common;
      const level = Number.isFinite(authored) && authored > 0 ? Math.min(100, Math.round(authored)) : band[0] + Math.floor(Math.random() * (band[1] - band[0] + 1));
      window.__threeBattleEncounterLevel = level;
      return { ...encounter, level };
    };
    wrapped.__levels = true;
    session.createEncounter = wrapped;
  }
  install();
  window.addEventListener('DOMContentLoaded', install);
})();
