(function () {
  const rarityLevel = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5, Mythic: 6 };
  function install() {
    const session = window.DataByteSession;
    if (!session?.createEncounter || session.createEncounter.__levels) return;
    const original = session.createEncounter;
    const wrapped = function (playerId, currentId) {
      const encounter = original(playerId, currentId);
      const authored = Number(encounter?.level ?? encounter?.runtime?.level);
      const level = Number.isFinite(authored) && authored > 0 ? Math.round(authored) : (rarityLevel[encounter?.rarity] || 1);
      return { ...encounter, level };
    };
    wrapped.__levels = true;
    session.createEncounter = wrapped;
  }
  install();
  window.addEventListener('DOMContentLoaded', install);
})();
