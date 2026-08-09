(function () {
  function install() {
    const session = window.DataByteSession;
    if (!session?.createEncounter || session.createEncounter.__stabilityNormalized) return;
    const original = session.createEncounter;
    const wrapped = function (playerId, currentId) {
      const encounter = original(playerId, currentId);
      const authored = Number(encounter?.maxStability ?? encounter?.stability);
      const stability = Number.isFinite(authored) ? Math.max(100, authored) : 100;
      return { ...encounter, maxStability: stability, stability };
    };
    wrapped.__stabilityNormalized = true;
    session.createEncounter = wrapped;
  }
  install();
  window.addEventListener('DOMContentLoaded', install);
})();
