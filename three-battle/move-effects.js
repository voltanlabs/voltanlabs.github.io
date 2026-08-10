(function () {
  let wasBusy = false;
  function moveForIndex(index) {
    const active = window.DataByteSession?.starter?.();
    const player = window.DataByteSession?.party?.().find(item => (item.uid || item.id) === active || item.id === active);
    const species = window.DataByteSession?.roster?.().find(item => item.id === player?.id) || player || {};
    const moves = window.THREE_BATTLE_MOVE_FOR_SPECIES?.(player?.id, species) || window.THREE_BATTLE_DATA?.moves || [];
    return moves[index];
  }
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
    const list = Array.isArray(state[target]) ? state[target] : (state[target] ? [state[target]] : []);
    const existing = list.find(status => status.id === effect.id);
    if (existing) existing.duration = Number(effect.durationTurns) || 1;
    else list.push({ id: effect.id, duration: Number(effect.durationTurns) || 1 });
    state[target] = list;
    if (effect.id === 'guarded' && effect.target === 'self') state.guarding = true;
    if (effect.id === 'glitched' && effect.target !== 'self') state.status = 'Glitched';
    if (effect.id === 'drained' && effect.target !== 'self') state.stability = Math.max(0, Number(state.stability || 0) - 5);
    window.DataByteBattle.message?.(`${effect.id} applied.`);
  }
  function renderStatuses() {
    const state = window.DataByteBattle?.getState?.();
    if (!state) return;
    if (wasBusy && !state.busy) {
      for (const key of ['playerStatus', 'enemyStatus']) {
        const list = Array.isArray(state[key]) ? state[key] : (state[key] ? [state[key]] : []);
        list.forEach(status => { status.duration -= 1; });
        state[key] = list.filter(status => status.duration > 0);
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
    const positive = new Set(['charged', 'guarded']);
    const badges = value => (Array.isArray(value) ? value : value ? [value] : []).map(status => `<span class="status-${positive.has(status.id) ? 'positive' : 'negative'}">${status.id} · ${status.duration}</span>`).join('');
    if (player) player.innerHTML = badges(state.playerStatus);
    if (enemy) enemy.innerHTML = badges(state.enemyStatus);
  }
  document.addEventListener('click', event => {
    const button = event.target.closest?.('#actions .action');
    if (!button) return;
    const index = Number(button.dataset.move);
    window.setTimeout(() => apply(moveForIndex(index)), 0);
  }, true);
  window.setInterval(renderStatuses, 150);
  window.DataByteMoveEffects = { apply };
})();
