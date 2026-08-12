(function () {
  const names = {
    Voltricity: ['Arc Lash', 'Thunder Pounce', 'Volt Breaker', 'Circuit Roar', 'Static Rush', 'Overcharge Claw', 'Neon Bolt', 'Storm Relay'],
    Mystic: ['Shell Sigil', 'Tide Rune', 'Abyssal Clamp', 'Moon Current', 'Oracle Surge', 'Pearl Ward', 'Mystic Undertow', 'Depth Spiral'],
    Alloy: ['Chrome Sting', 'Iron Lock', 'Rivet Crash', 'Magnetic Snare', 'Steel Veil', 'Scrap Barrage', 'Titan Pin', 'Foundry Pulse'],
    Thermal: ['Ember Ram', 'Heat Bloom', 'Solar Flare', 'Cinder Charge', 'Magma Circuit', 'Afterburn', 'Radiant Horn', 'Core Ignition'],
    Torrent: ['Wave Crash', 'Foam Frenzy', 'Undertow Rush', 'Rain Relay', 'Brine Burst', 'Tidal Guard', 'Flood Gate', 'Current Coil'],
    Financial: ['Coin Toss', 'Market Crash', 'Bull Run', 'Compound Strike', 'Dividend Drain', 'Ledger Lock', 'Asset Shield', 'Vault Break'],
    Aether: ['Cloud Thread', 'Signal Bloom', 'Skyline Pulse', 'Aether Drift', 'Beacon Burst', 'Horizon Link', 'Aurora Sweep', 'Zenith Ray'],
    Spectral: ['Phantom Feint', 'Ghost Packet', 'Echo Slice', 'Prism Shift', 'Haunt Loop', 'Mirror Maze', 'Wisp Lance', 'Veil Break'],
    Acoustic: ['Echo Burst', 'Chorus Crash', 'Resonance Wave', 'Feedback Roar', 'Harmonic Link', 'Sonic Ward', 'Overtone Break', 'Final Cadence'],
    Organic: ['Vine Lash', 'Verdant Rush', 'Thorn Volley', 'Pack Rally', 'Root Lock', 'Bark Guard', 'Canopy Crash', 'Wild Kernel'],
    Analog: ['Dial Strike', 'Rotary Rush', 'Needle Drop', 'Tape Loop', 'Phase Knob', 'Soft Reset', 'Signal Drift', 'Master Clock'],
    Seismic: ['Fault Line', 'Quake Rush', 'Tremor Bite', 'Rift Crash', 'Aftershock', 'Stone Guard', 'Core Break', 'Tectonic Roar'],
    Spam: ['Packet Flood', 'Junk Burst', 'Buffer Crash', 'Thread Swarm', 'Overflow', 'Cache Guard', 'Viral Loop', 'System Flood'],
    Cipher: ['Code Lash', 'Key Burst', 'Hash Crash', 'Lock Thread', 'Decode Drain', 'Cipher Guard', 'Root Access', 'Master Key'],
    Unassigned: ['Signal Pulse', 'Buffer Tap', 'Data Drift', 'Packet Guard', 'Cache Burst', 'Open Channel', 'Sync Break', 'Core Ping']
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
    statusEffect: index === 5 ? { id: 'guarded', chance: 100, durationTurns: 1, target: 'self' } : { id: effects[index % effects.length], chance: 15 + (index * 5), durationTurns: 2, target: effects[index % effects.length] === 'charged' ? 'self' : 'enemy' },
    alignmentInteractions: { Pristine: index % 3, Stained: (index + 1) % 3, Null: (index + 2) % 3 },
    learnVersion: index < 2 ? 'Kilobyte' : index < 6 ? 'Megabyte' : 'Gigabyte',
    tags: [configuration.toLowerCase(), index === 5 ? 'support' : 'signature'],
    description: `${name} channels ${configuration} through the surrounding signal field.`,
    learnedBy: ['*'],
    version: '0.3.0'
  })));
  const catalog = [...(window.THREE_BATTLE_DATA?.moves || []), ...(window.THREE_BATTLE_AUTHORED_MOVES || []), ...extras];
  function movesForSpecies(id, species = {}) {
    const config = species.primaryConfiguration || species.configuration || species.configurations?.[0] || 'Unassigned';
    const pool = extras.filter(move => move.configuration === config);
    const basic = window.THREE_BATTLE_DATA?.moves?.find(move => move.id === 'signal-strike') || catalog[0];
    const existing = (window.THREE_BATTLE_DATA?.moves || []).filter(move => move.id !== 'signal-strike' && move.learnedBy?.includes?.(id));
    const authored = (window.THREE_BATTLE_AUTHORED_MOVES || []).filter(move => move.learnedBy?.includes?.(id) || (move.learnedBy?.includes?.('*') && move.configuration === config));
    const selected = [], seen = new Set(), seenNames = new Set();
    [...existing, ...authored, ...pool].forEach(move => { const name = String(move?.name || '').trim().toLowerCase(); if (move && !seen.has(move.id) && !seenNames.has(name) && selected.length < 3) { seen.add(move.id); seenNames.add(name); selected.push(move); } });
    return [basic, ...selected];
  }
  window.THREE_BATTLE_MOVE_CATALOG = catalog;
  window.THREE_BATTLE_MOVE_FOR_SPECIES = movesForSpecies;
})();
