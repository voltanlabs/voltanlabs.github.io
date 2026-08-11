(function () {
  const move = (id, name, configuration, power, statusEffect, description, accuracy = 94, learnedBy = ['*']) => ({ id, name, configuration, moveType: power ? 'attack' : 'defense', power, accuracy, downloadEffect: 4, stabilityEffect: power ? -1 : 3, statusEffect, description, learnedBy, version: '0.4.0' });
  window.THREE_BATTLE_AUTHORED_MOVES = [
    move('solar-flare', 'Solar Flare', 'Thermal', 46, { id: 'burn', chance: 55, durationTurns: 3 }, 'A thermal burst that scorches the target signal.'),
    move('undertow-rush', 'Undertow Rush', 'Torrent', 44, { id: 'shock', chance: 35, durationTurns: 2 }, 'A crushing current that disrupts target timing.'),
    move('market-crash', 'Market Crash', 'Financial', 45, { id: 'corruption', chance: 35, durationTurns: 4 }, 'A cascading ledger failure that corrupts the target.'),
    move('signal-bloom', 'Signal Bloom', 'Aether', 0, { id: 'boost', chance: 100, durationTurns: 3, target: 'self' }, 'A restorative signal bloom that boosts the user.'),
    move('signal-scramble', 'Signal Scramble', 'Analog', 40, { id: 'misdirected', chance: 35, durationTurns: 2 }, 'A noisy analog burst that disrupts accuracy.'),
    move('shell-clamp', 'Shell Clamp', 'Mystic', 44, { id: 'bound', chance: 35, durationTurns: 2 }, 'A mystic clamp that binds unstable code.'),
    move('screen-guard-authored', 'Screen Guard', 'Alloy', 0, { id: 'guarded', chance: 100, durationTurns: 2, target: 'self' }, 'A hardened display barrier that reduces incoming damage.', 100, ['screensavior', 'monitorman']),
    move('glitch-sting-authored', 'Glitch Sting', 'Alloy', 43, { id: 'infected', chance: 35, durationTurns: 3 }, 'A corrupted sting that infects the target signal.', 90, ['scorpyone', 'scorpytwo', 'scorpyus'])
  ];
})();
