(function () {
  function adminSignalLevel() {
    const xp = Math.max(0, Number(window.DataByteProgression?.xp?.() ?? window.DataByteSession?.profileGet?.('vl_three_battle_xp', 0)) || 0);
    const thresholdForLevel = level => 50 * (level - 1) * level;
    let level = 1;
    while (level < 100 && xp >= thresholdForLevel(level + 1)) level += 1;
    return level;
  }
  function install() {
    const session = window.DataByteSession;
    if (!session?.createEncounter || session.createEncounter.__levels) return;
    const original = session.createEncounter;
    const wrapped = function (playerId, currentId) {
      const encounter = original(playerId, currentId);
      const authored = Number(encounter?.level ?? encounter?.runtime?.level);
      const level = Number.isFinite(authored) && authored > 0 ? Math.min(100, Math.round(authored)) : adminSignalLevel();
      window.__threeBattleEncounterLevel = level;
      window.__threeBattleAdminLevel = adminSignalLevel();
      return { ...encounter, level };
    };
    wrapped.__levels = true;
    session.createEncounter = wrapped;
  }
  install();
  window.addEventListener('DOMContentLoaded', install);
})();
