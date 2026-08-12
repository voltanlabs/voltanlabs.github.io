(function () {
  function apply(move, actor = 'player') {
    const state = window.DataByteBattle?.getState?.();
    if (!state || state.over || !move) return;
    if (actor === 'player') {
      const stability = Number(move.stabilityEffect) || 0;
      if (stability) state.stability = Math.min(100, Math.max(0, Number(state.stability || 0) + stability));
      const download = Number(move.downloadEffect) || 0;
      if (download) state.capturePressure = Math.min(35, Math.max(0, Number(state.capturePressure || 0) + download));
    }
    const effect = move.statusEffect;
    if (!effect || Math.random() * 100 >= Number(effect.chance ?? 100)) return { applied: false };
    const self = actor === 'enemy' ? 'enemyStatus' : 'playerStatus';
    const opponent = actor === 'enemy' ? 'playerStatus' : 'enemyStatus';
    const target = effect.target === 'self' ? self : opponent;
    if (window.DataByteStatusRuntime?.apply) window.DataByteStatusRuntime.apply(state, target, effect);
    else state[target] = [{ id: effect.id, duration: Number(effect.durationTurns) || 1, stacks: 1 }];
    if (effect.id === 'guarded' && effect.target === 'self') state[actor === 'enemy' ? 'enemyGuarding' : 'guarding'] = true;
    if (effect.id === 'glitched' && target === 'playerStatus') state.status = 'Glitched';
    if (effect.id === 'drained' && target === 'playerStatus') state.stability = Math.max(0, Number(state.stability || 0) - 5);
    state.lastEffectApplied = effect.id;
    state.effectSequence = Number(state.effectSequence || 0) + 1;
    return { applied: true, id: effect.id, target };
  }
  function tickTurnEnd(key) {
    const state = window.DataByteBattle?.getState?.();
    if (!state || state.over) return { damage: 0, defeated: false };
    const list = Array.isArray(state[key]) ? state[key] : (state[key] ? [state[key]] : []);
    const creature = key === 'playerStatus' ? window.DataByteBattle?.creatures?.player : window.DataByteBattle?.creatures?.enemy;
    const kept = [];
    let damage = 0;
    list.forEach(status => {
      damage += window.DataByteStatusRuntime?.tick?.({ [key]: [status] }, key, creature) || 0;
      status.duration -= 1;
      if (status.duration > 0) kept.push(status);
    });
    if (damage && key === 'playerStatus') {
      const player = window.DataByteBattle?.creatures?.player;
      const record = window.DataByteSession?.party?.().find(item => (item.uid || item.id) === window.DataByteSession?.starter?.() || item.id === player?.id);
      window.DataByteSession?.updateHp?.(record?.uid || record?.id, creature.hp);
    }
    if (damage) state.message = `${creature.name} suffered ${damage} ${list.filter(status => (window.DataByteStatusRuntime?.definition?.(status.id)?.tickDamage || 0) > 0).map(status => status.id).join(' and ')} damage.`;
    state[key] = kept;
    if (!state[key].some(status => status.id === 'guarded')) {
      if (key === 'playerStatus') state.guarding = false;
      if (key === 'enemyStatus') state.enemyGuarding = false;
    }
    if (!state[key].some(status => status.id === 'glitched')) state.status = null;
    const defeated = creature?.hp <= 0;
    if (defeated) key === 'playerStatus' ? window.DataByteBattle?.playerFainted?.() : window.DataByteBattle?.enemyFainted?.();
    return { damage, defeated };
  }
  function renderStatuses() {
    const state = window.DataByteBattle?.getState?.();
    if (!state) return;
    if (state.lastEffectApplied && state.lastEffectRendered !== state.effectSequence) {
      state.message = `${state.message} ${effectText(state.lastEffectApplied)}.`;
      state.lastEffectRendered = state.effectSequence;
    }
    const player = document.getElementById('playerStatus');
    const enemy = document.getElementById('enemyStatus');
    const positive = new Set(['charged', 'guarded', 'boost', 'shield']);
    const descriptions = { charged: 'Your next attack deals increased damage.', bound: 'Attack power and speed are reduced.', boost: 'Attack power and speed are increased.', corruption: 'Attack and defense are reduced over time.', drained: 'Attack power is reduced and signal stability drains.', focused: 'Damage taken is increased by 15%.', freeze: 'There is a chance you cannot act, and speed is reduced.', glitched: 'Incoming damage is increased and signal leakage occurs.', guarded: 'Incoming damage is greatly reduced.', infected: 'Deals damage over time and weakens attacks.', misdirected: 'Move accuracy is reduced.', shock: 'Move accuracy and speed are reduced.', shield: 'Incoming damage is reduced.' };
    const badges = value => (Array.isArray(value) ? value : value ? [value] : []).map(status => { const description = descriptions[status.id] || 'A temporary signal effect.'; const label = `${status.id}${Number(status.stacks) > 1 ? ` ×${status.stacks}` : ''} · ${status.duration}`; return `<span class="status-${positive.has(status.id) ? 'positive' : 'negative'}" tabindex="0" title="${description}" aria-label="${label}. ${description}" data-status-tip="${description}">${label}</span>`; }).join('');
    if (player) player.innerHTML = badges(state.playerStatus);
    if (enemy) enemy.innerHTML = badges(state.enemyStatus);
  }
  window.setInterval(renderStatuses, 150);
  const effectText = id => ({ burn: 'Burn applied', corruption: 'Corruption applied', infected: 'Infected applied', shock: 'Shock applied', misdirected: 'Misdirection applied', bound: 'Bound applied', charged: 'Charge applied', guarded: 'Guard applied', boost: 'Boost applied', glitched: 'Glitch applied', focused: 'Focus applied', drained: 'Drain applied', freeze: 'Freeze applied', shield: 'Shield applied' }[id] || `${id} applied`);
  window.DataByteMoveEffects = { apply, effectText, tickTurnEnd };
})();
