(function () {
  const alignmentByRegion = { grove: 'Pristine', rift: 'Stained', cavern: 'Null' };
  const rarityByRegion = { grove: [['Common', 65], ['Uncommon', 28], ['Rare', 7]], rift: [['Common', 35], ['Uncommon', 40], ['Rare', 25]], cavern: [['Common', 25], ['Uncommon', 40], ['Rare', 35]], bay: [['Common', 45], ['Uncommon', 35], ['Rare', 20]] };
  function rarity(region) { let roll = Math.random() * 100; for (const [name, weight] of rarityByRegion[region] || rarityByRegion.bay) { if ((roll -= weight) < 0) return name; } return 'Common'; }
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
      if (region === 'bay') return { ...original(playerId, currentId), rarity: rarity(region), region };
      for (let attempt = 0; attempt < 12; attempt += 1) {
        const encounter = original(playerId, currentId);
        if (matches(region, encounter)) return { ...encounter, rarity: rarity(region), region };
      }
      return { ...original(playerId, currentId), rarity: rarity(region), region };
    };
    wrapped.__regionAware = true;
    session.createEncounter = wrapped;
  }
  install(); window.addEventListener('DOMContentLoaded', install);
})();
