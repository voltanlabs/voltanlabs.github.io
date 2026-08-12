(function () {
  let wasBusy = false;
  function apply(move) {
    const state = window.DataByteBattle?.getState?.();
    if (!state || state.over || !move) return;
    const stability = Number(move.stabilityEffect) || 0;
    if (stability) state.stability = Math.min(100, Math.max(0, Number(state.stability || 0) + stability));
    const download = Number(move.downloadEffect) || 0;
    if (download) state.capturePressure = Math.min(35, Math.max(0, Number(state.capturePressure || 0) + download));
    const effect = move.statusEffect;
    if (!effect || Math.random() * 100 >= Number(effect.chance ?? 100)) return;
    const target = effect.target === 'self' ? 'playerStatus' : 'enemyStatus';
    if (window.DataByteStatusRuntime?.apply) window.DataByteStatusRuntime.apply(state, target, effect);
    else state[target] = [{ id: effect.id, duration: Number(effect.durationTurns) || 1, stacks: 1 }];
    if (effect.id === 'guarded' && effect.target === 'self') state.guarding = true;
    if (effect.id === 'glitched' && effect.target !== 'self') state.status = 'Glitched';
    if (effect.id === 'drained' && effect.target !== 'self') state.stability = Math.max(0, Number(state.stability || 0) - 5);
    state.lastEffectApplied = effect.id;
    state.message = `${state.message || ''} ${effect.id} applied.`.trim();
  }
  function renderStatuses() {
    const state = window.DataByteBattle?.getState?.();
    if (!state) return;
    if (wasBusy && !state.busy) {
      for (const key of ['playerStatus', 'enemyStatus']) {
        const list = Array.isArray(state[key]) ? state[key] : (state[key] ? [state[key]] : []);
        const creature = key === 'playerStatus' ? window.DataByteBattle?.creatures?.player : window.DataByteBattle?.creatures?.enemy;
        const kept = [];
        let damage = 0;
        list.forEach(status => {
          if (status.skipTick) { status.skipTick = false; kept.push(status); return; }
          damage += window.DataByteStatusRuntime?.tick?.({ [key]: [status] }, key, creature) || 0;
          status.duration -= 1;
          if (status.duration > 0) kept.push(status);
        });
        if (damage && key === 'playerStatus') {
          const player = window.DataByteBattle?.creatures?.player;
          const record = window.DataByteSession?.party?.().find(item => (item.uid || item.id) === window.DataByteSession?.starter?.() || item.id === player?.id);
          window.DataByteSession?.updateHp?.(record?.uid || record?.id, creature.hp);
        }
        if (damage) state.message = `${creature.name} suffered ${damage} status damage.`;
        state[key] = kept;
        if (creature?.hp <= 0) {
          if (key === 'playerStatus') window.DataByteBattle?.playerFainted?.();
          else window.DataByteBattle?.enemyFainted?.();
        }
        if (!state[key].some(status => status.id === 'guarded')) {
          if (key === 'playerStatus') state.guarding = false;
          if (key === 'enemyStatus') state.enemyGuarding = false;
        }
        if (!state[key].some(status => status.id === 'glitched')) state.status = null;
      }
    }
    wasBusy = Boolean(state.busy);
    const player = document.getElementById('playerStatus');
    const enemy = document.getElementById('enemyStatus');
    const positive = new Set(['charged', 'guarded', 'boost', 'shield']);
    const descriptions = { charged: 'Your next attack deals increased damage.', bound: 'Attack power and speed are reduced.', boost: 'Attack power and speed are increased.', corruption: 'Attack and defense are reduced over time.', drained: 'Attack power is reduced and signal stability drains.', focused: 'Damage taken is increased by 15%.', freeze: 'There is a chance you cannot act, and speed is reduced.', glitched: 'Incoming damage is increased and signal leakage occurs.', guarded: 'Incoming damage is greatly reduced.', infected: 'Deals damage over time and weakens attacks.', misdirected: 'Move accuracy is reduced.', shock: 'Move accuracy and speed are reduced.', shield: 'Incoming damage is reduced.' };
    const badges = value => (Array.isArray(value) ? value : value ? [value] : []).map(status => { const description = descriptions[status.id] || 'A temporary signal effect.'; const label = `${status.id}${Number(status.stacks) > 1 ? ` ×${status.stacks}` : ''} · ${status.duration}`; return `<span class="status-${positive.has(status.id) ? 'positive' : 'negative'}" tabindex="0" title="${description}" aria-label="${label}. ${description}" data-status-tip="${description}">${label}</span>`; }).join('');
    if (player) player.innerHTML = badges(state.playerStatus);
    if (enemy) enemy.innerHTML = badges(state.enemyStatus);
  }
  window.setInterval(renderStatuses, 150);
  window.DataByteMoveEffects = { apply };
})();
