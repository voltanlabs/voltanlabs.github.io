(function () {
  const alignmentByRegion = { grove: 'Pristine', rift: 'Stained', cavern: 'Null' };
  function matches(region, sprite) {
    const alignment = alignmentByRegion[region];
    return !alignment || sprite.alignment === alignment || sprite.configurations?.some?.(value => value.toLowerCase().includes(region === 'grove' ? 'organic' : region === 'rift' ? 'malware' : 'spectral'));
  }
  function install() {
    const session = window.DataByteSession;
    if (!session || session.createEncounter.__regionAware) return;
    const original = session.createEncounter;
    const wrapped = function (playerId, currentId) {
      const region = localStorage.getItem('vl_three_battle_region') || 'grove';
      if (region === 'bay') return { ...original(playerId, currentId), region };
      for (let attempt = 0; attempt < 12; attempt += 1) {
        const encounter = original(playerId, currentId);
        if (matches(region, encounter)) return { ...encounter, region };
      }
      return { ...original(playerId, currentId), region };
    };
    wrapped.__regionAware = true;
    session.createEncounter = wrapped;
  }
  install(); window.addEventListener('DOMContentLoaded', install);
})();
