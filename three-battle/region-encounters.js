(function () {
  const alignmentByRegion = { grove: 'Pristine', rift: 'Stained', cavern: 'Null' };
  const rarityByRegion = {
    grove: [['Common', 65], ['Uncommon', 28], ['Rare', 7]],
    rift: [['Common', 35], ['Uncommon', 40], ['Rare', 25]],
    cavern: [['Common', 25], ['Uncommon', 40], ['Rare', 35]],
    bay: [['Common', 45], ['Uncommon', 35], ['Rare', 20]]
  };
  const regionByConfiguration = {
    Voltricity: 'grove', Organic: 'grove', Torrent: 'bay', Aether: 'bay',
    Financial: 'bay', Analog: 'bay', Thermal: 'rift', Seismic: 'rift',
    Alloy: 'rift', Mystic: 'cavern', Spectral: 'cavern', Malware: 'rift',
    Spam: 'rift', Technoblin: 'rift'
  };
  const regionOrder = ['grove', 'rift', 'cavern', 'bay'];
  let regionBySpecies = {};
  let pools = {};
  function rarity(region) {
    let roll = Math.random() * 100;
    for (const [name, weight] of rarityByRegion[region] || rarityByRegion.bay) {
      if ((roll -= weight) < 0) return name;
    }
    return 'Common';
  }
  function assignRegion(sprite) {
    if (sprite.alignment === alignmentByRegion.grove) return 'grove';
    if (sprite.alignment === alignmentByRegion.rift) return 'rift';
    if (sprite.alignment === alignmentByRegion.cavern) return 'cavern';
    for (const value of [sprite.primaryConfiguration, ...(sprite.configurations || [])]) {
      if (regionByConfiguration[value]) return regionByConfiguration[value];
    }
    return 'bay';
  }
  function buildPools() {
    const roster = window.DataByteSession?.roster?.() || [];
    regionBySpecies = {};
    pools = Object.fromEntries(regionOrder.map(region => [region, []]));
    roster.forEach(sprite => {
      const region = assignRegion(sprite);
      regionBySpecies[sprite.id] = region;
      pools[region].push(sprite);
    });
    if (window.DataByteRegions) window.DataByteRegions.speciesByRegion = { ...pools };
  }
  function matches(region, sprite) {
    return region === 'bay' || regionBySpecies[sprite.id] === region;
  }
  function install() {
    const session = window.DataByteSession;
    if (!session || session.createEncounter.__regionAware) return;
    const original = session.createEncounter;
    buildPools();
    const wrapped = function (playerId, currentId) {
      const region = session.profileGet?.('vl_three_battle_region', 'grove') || 'grove';
      if (!pools[region]?.length) buildPools();
      for (let attempt = 0; attempt < 48; attempt += 1) {
        const encounter = original(playerId, currentId);
        if (matches(region, encounter)) return { ...encounter, rarity: rarity(region), region };
      }
      const eligible = (pools[region] || []).filter(sprite => sprite.id !== playerId && sprite.id !== currentId);
      const fallback = eligible[Math.floor(Math.random() * eligible.length)] || pools.bay?.[0] || session.roster()[0];
      const base = original(playerId, currentId);
      return { ...base, ...fallback, rarity: rarity(region), region, scanCode: base.scanCode };
    };
    wrapped.__regionAware = true;
    session.createEncounter = wrapped;
  }
  install();
  window.addEventListener('DOMContentLoaded', install);
})();
