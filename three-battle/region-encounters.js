(function () {
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
  const stageWeights = { 1: 45, 2: 35, 3: 20 };
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
    if (sprite.alignment === 'Pristine') return 'grove';
    if (sprite.alignment === 'Stained') return 'rift';
    if (sprite.alignment === 'Null') return 'cavern';
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
  function pickEncounter(region, adminLevel, playerId, currentId) {
    const eligible = (pools[region] || []).filter(sprite => sprite.id !== playerId && sprite.id !== currentId);
    const unlocked = eligible.filter(sprite => {
      const stage = window.DataByteProgressionData?.stageFor?.(sprite) || 1;
      return stage === 1 || (stage === 2 && adminLevel >= 3) || (stage === 3 && adminLevel >= 5);
    });
    const available = unlocked.length ? unlocked : eligible;
    const weighted = available.map(sprite => ({ sprite, weight: stageWeights[window.DataByteProgressionData?.stageFor?.(sprite) || 1] || 1 }));
    const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = Math.random() * total;
    return weighted.find(entry => (roll -= entry.weight) < 0)?.sprite || available[0];
  }
  function install() {
    const session = window.DataByteSession;
    if (!session || session.createEncounter.__regionAware) return;
    const original = session.createEncounter;
    buildPools();
    const wrapped = function (playerId, currentId) {
      const region = session.profileGet?.('vl_three_battle_region', 'grove') || 'grove';
      if (!pools[region]?.length) buildPools();
      const base = original(playerId, currentId);
      const adminLevel = window.DataByteProgressionData?.adminLevel?.(window.DataByteProgression?.xp?.() || 0) || window.__threeBattleAdminLevel || 1;
      const selected = pickEncounter(region, adminLevel, playerId, currentId);
      if (!selected) return { ...base, region, rarity: rarity(region) };
      return {
        ...base,
        ...selected,
        rarity: selected.rarity || rarity(region),
        region,
        evolutionStage: window.DataByteProgressionData?.stageFor?.(selected) || 1,
        level: base.level,
        scanCode: base.scanCode
      };
    };
    wrapped.__regionAware = true;
    session.createEncounter = wrapped;
  }
  install();
  window.addEventListener('DOMContentLoaded', install);
})();
