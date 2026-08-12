// Pure battle rules. This module intentionally has no DOM, storage, or Three.js dependencies.
export const ALIGNMENT_RULES = Object.freeze({
  Signal: Object.freeze({ Stained: 1.25, Pristine: 0.8 }),
  Volt: Object.freeze({ Null: 1.25 }),
  Mirror: Object.freeze({ Pristine: 1.25 })
});

export const ENEMY_PROFILES = Object.freeze({
  Stained: Object.freeze({ move: 'Venom Packet', min: 12, max: 20, drain: 9, glitch: 0.35, status: 'glitched' }),
  Null: Object.freeze({ move: 'Null Pulse', min: 8, max: 16, drain: 12, glitch: 0.18, status: 'bound' }),
  Pristine: Object.freeze({ move: 'Signal Beam', min: 9, max: 17, drain: 6, glitch: 0.12, status: 'focused' }),
  Unassigned: Object.freeze({ move: 'Data Fracture', min: 10, max: 18, drain: 8, glitch: 0.25, status: 'drained' })
});

export function alignmentMultiplier(element, defenderAlignment) {
  return Number(ALIGNMENT_RULES[element]?.[defenderAlignment] || 1);
}

export function enemyProfile(alignment) {
  return ENEMY_PROFILES[alignment] || ENEMY_PROFILES.Unassigned;
}

function levelMultiplier(attackerLevel = 1, defenderLevel = 1) {
  const gap = Math.max(-40, Math.min(40, Number(attackerLevel || 1) - Number(defenderLevel || 1)));
  return Math.max(0.65, Math.min(1.35, 1 + gap * 0.015));
}

export function playerDamage({ move, attack = 60, defense = 60, attackerLevel = 1, defenderLevel = 1, attackMultiplier = 1, incomingMultiplier = 1, critical = false }) {
  const multiplier = alignmentMultiplier(move.element, move.defenderAlignment);
  return Math.max(1, Math.round(Number(move.power || 0) * multiplier * Math.max(1, attack) / Math.max(1, defense) * levelMultiplier(attackerLevel, defenderLevel) * attackMultiplier * incomingMultiplier * (critical ? 1.5 : 1)));
}

export function enemyDamage({ raw, attack = 60, defense = 60, attackerLevel = 1, defenderLevel = 1, incomingMultiplier = 1, attackMultiplier = 1, guarding = false, leak = 0 }) {
  const guardMultiplier = guarding ? 0.45 : 1;
  return Math.max(1, Math.round((Number(raw) + Number(leak)) * Math.max(1, attack) / Math.max(1, defense) * levelMultiplier(attackerLevel, defenderLevel) * guardMultiplier * incomingMultiplier * attackMultiplier));
}
