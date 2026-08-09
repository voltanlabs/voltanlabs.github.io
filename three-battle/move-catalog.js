(function () {
  const names = {
    Voltricity: ['Arc Lash', 'Thunder Pounce', 'Volt Breaker', 'Circuit Roar', 'Static Rush', 'Overcharge Claw', 'Neon Bolt', 'Storm Relay'],
    Mystic: ['Shell Sigil', 'Tide Rune', 'Abyssal Clamp', 'Moon Current', 'Oracle Surge', 'Pearl Ward', 'Mystic Undertow', 'Depth Spiral'],
    Alloy: ['Chrome Sting', 'Iron Lock', 'Rivet Crash', 'Magnetic Snare', 'Steel Veil', 'Scrap Barrage', 'Titan Pin', 'Foundry Pulse'],
    Thermal: ['Ember Ram', 'Heat Bloom', 'Solar Flare', 'Cinder Charge', 'Magma Circuit', 'Afterburn', 'Radiant Horn', 'Core Ignition'],
    Torrent: ['Wave Crash', 'Foam Frenzy', 'Undertow Rush', 'Rain Relay', 'Brine Burst', 'Tidal Guard', 'Flood Gate', 'Current Coil'],
    Financial: ['Coin Toss', 'Market Crash', 'Bull Run', 'Compound Strike', 'Dividend Drain', 'Ledger Lock', 'Asset Shield', 'Vault Break'],
    Aether: ['Cloud Thread', 'Signal Bloom', 'Skyline Pulse', 'Aether Drift', 'Beacon Burst', 'Horizon Link', 'Aurora Sweep', 'Zenith Ray'],
    Spectral: ['Phantom Feint', 'Ghost Packet', 'Echo Slice', 'Prism Shift', 'Haunt Loop', 'Mirror Maze', 'Wisp Lance', 'Veil Break']
  };
  const configurations = Object.keys(names);
  const effects = ['charged', 'bound', 'glitched', 'guarded', 'focused', 'drained'];
  const extras = configurations.flatMap(configuration => names[configuration].map((name, index) => ({
    id: `${configuration.toLowerCase()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name,
    moveType: index === 5 ? 'defense' : 'attack',
    configuration,
    powerClass: index < 2 ? 'standard' : index < 6 ? 'signature' : 'mastery',
    power: index === 5 ? 0 : 28 + (index * 4),
    accuracy: Math.max(82, 98 - index * 2),
    stabilityEffect: index === 5 ? 4 : -1,
    downloadEffect: 3 + (index % 5),
    statusEffect: index === 5 ? { id: 'guarded', chance: 100, durationTurns: 1, target: 'self' } : { id: effects[index % effects.length], chance: 15 + (index * 5), durationTurns: 2, target: 'enemy' },
    alignmentInteractions: { Pristine: index % 3, Stained: (index + 1) % 3, Null: (index + 2) % 3 },
    learnVersion: index < 2 ? 'Kilobyte' : index < 6 ? 'Megabyte' : 'Gigabyte',
    tags: [configuration.toLowerCase(), index === 5 ? 'support' : 'signature'],
    description: `${name} channels ${configuration} through the surrounding signal field.`,
    learnedBy: ['*'],
    version: '0.3.0'
  }))).slice(0, 60);
  const catalog = [...(window.THREE_BATTLE_DATA?.moves || []), ...extras];
  function movesForSpecies(id, species = {}) {
    const config = species.primaryConfiguration || species.configuration || 'Aether';
    const pool = extras.filter(move => move.configuration === config);
    const existing = (window.THREE_BATTLE_DATA?.moves || []).filter(move => move.learnedBy?.includes?.(id));
    return [window.THREE_BATTLE_DATA?.moves?.find(move => move.id === 'signal-strike') || catalog[0], ...(existing.length ? existing : pool).slice(0, 3)];
  }
  window.THREE_BATTLE_MOVE_CATALOG = catalog;
  window.THREE_BATTLE_MOVE_FOR_SPECIES = movesForSpecies;
})();
