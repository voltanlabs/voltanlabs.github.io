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

function authoredInteractionMultiplier(value) {
  const interaction = Number(value);
  if (!Number.isFinite(interaction) || interaction === 0) return 1;
  if (interaction <= -1) return 0.8;
  if (interaction === 1) return 1.1;
  return 1.25;
}

export function alignmentMultiplier(moveOrElement, defenderAlignment) {
  if (moveOrElement && typeof moveOrElement === 'object' && Object.prototype.hasOwnProperty.call(moveOrElement.alignmentInteractions || {}, defenderAlignment)) {
    return authoredInteractionMultiplier(moveOrElement.alignmentInteractions[defenderAlignment]);
  }
  const element = typeof moveOrElement === 'object' ? moveOrElement.element : moveOrElement;
  return Number(ALIGNMENT_RULES[element]?.[defenderAlignment] || 1);
}

export function enemyProfile(alignment) {
  return ENEMY_PROFILES[alignment] || ENEMY_PROFILES.Unassigned;
}

export function levelMultiplier(attackerLevel = 1, defenderLevel = 1) {
  const gap = Math.max(-40, Math.min(40, Number(attackerLevel || 1) - Number(defenderLevel || 1)));
  return Math.max(0.45, Math.min(2.1, Math.pow(1.03, gap)));
}

export function playerDamage({ move, attack = 60, defense = 60, attackerLevel = 1, defenderLevel = 1, attackMultiplier = 1, incomingMultiplier = 1, critical = false }) {
  const multiplier = alignmentMultiplier(move, move.defenderAlignment);
  return Math.max(1, Math.round(Number(move.power || 0) * multiplier * Math.max(1, attack) / Math.max(1, defense) * levelMultiplier(attackerLevel, defenderLevel) * attackMultiplier * incomingMultiplier * (critical ? 1.5 : 1)));
}

export function enemyDamage({ raw, move = null, attack = 60, defense = 60, attackerLevel = 1, defenderLevel = 1, incomingMultiplier = 1, attackMultiplier = 1, guarding = false, leak = 0, critical = false }) {
  const guardMultiplier = guarding ? 0.55 : 1;
  const alignment = move ? alignmentMultiplier(move, move.defenderAlignment) : 1;
  return Math.max(1, Math.round((Number(raw) + Number(leak)) * alignment * Math.max(1, attack) / Math.max(1, defense) * levelMultiplier(attackerLevel, defenderLevel) * guardMultiplier * incomingMultiplier * attackMultiplier * (critical ? 1.5 : 1)));
}
