(function () {
  const definitions = {
    burn: { duration: 3, maxStacks: 3, tickDamage: 2 },
    freeze: { duration: 2, maxStacks: 1, actionBlockChance: 55, speedMultiplier: 0.65 },
    shock: { duration: 2, maxStacks: 2, accuracyMultiplier: 0.82, speedMultiplier: 0.8 },
    corruption: { duration: 4, maxStacks: 3, tickDamage: 1, attackMultiplier: 0.9, defenseMultiplier: 0.9 },
    shield: { duration: 3, maxStacks: 2, damageTakenMultiplier: 0.72 },
    boost: { duration: 3, maxStacks: 2, attackMultiplier: 1.18, speedMultiplier: 1.12 },
    charged: { duration: 2, maxStacks: 2, attackMultiplier: 1.25 },
    guarded: { duration: 2, maxStacks: 1, damageTakenMultiplier: 0.55 },
    misdirected: { duration: 2, maxStacks: 1, accuracyMultiplier: 0.72 },
    bound: { duration: 2, maxStacks: 1, attackMultiplier: 0.8, speedMultiplier: 0.75 },
    infected: { duration: 3, maxStacks: 3, tickDamage: 2, attackMultiplier: 0.9 },
    glitched: { duration: 2, maxStacks: 1, damageTakenMultiplier: 1.2 },
    focused: { duration: 2, maxStacks: 1, damageTakenMultiplier: 1.15 },
    drained: { duration: 2, maxStacks: 1, attackMultiplier: 0.9, stabilityLoss: 3 }
  };
  function definition(id) { return definitions[String(id || '').toLowerCase()] || { duration: 2, maxStacks: 1 }; }
  function apply(state, key, effect) {
    const config = definition(effect.id), list = Array.isArray(state[key]) ? state[key] : (state[key] ? [state[key]] : []);
    const existing = list.find(status => status.id === effect.id);
    const duration = Number(effect.durationTurns || effect.duration) || config.duration;
    if (existing) { existing.duration = duration; existing.stacks = Math.min(config.maxStacks, Math.max(1, Number(existing.stacks || 1) + 1)); }
    else list.push({ id: effect.id, duration, stacks: 1 });
    state[key] = list;
    return list.find(status => status.id === effect.id);
  }
  function tick(state, key, creature) {
    const list = Array.isArray(state[key]) ? state[key] : (state[key] ? [state[key]] : []);
    let damage = 0;
    list.forEach(status => { damage += (definition(status.id).tickDamage || 0) * Math.max(1, Number(status.stacks || 1)); });
    if (damage && creature) creature.hp = Math.max(0, Number(creature.hp || 0) - damage);
    return damage;
  }
  window.DataByteStatusRuntime = { definitions, definition, apply, tick };
})();
