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
    if (download) state.capturePressure = Math.min(45, Math.max(0, Number(state.capturePressure || 0) + download));
    const effect = move.statusEffect;
    if (!effect || Math.random() * 100 >= Number(effect.chance ?? 100)) return;
    const target = effect.target === 'self' ? 'playerStatus' : 'enemyStatus';
    state[target] = { id: effect.id, duration: Number(effect.durationTurns) || 1 };
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
        if (!state[key]) continue;
        state[key].duration -= 1;
        if (state[key].duration <= 0) {
          if (key === 'playerStatus' && state[key].id === 'guarded') state.guarding = false;
          if (key === 'enemyStatus' && state[key].id === 'guarded') state.enemyGuarding = false;
          if (key === 'playerStatus' && state[key].id === 'glitched') state.status = null;
          if (key === 'enemyStatus' && state[key].id === 'glitched') state.status = null;
          delete state[key];
        }
      }
    }
    wasBusy = Boolean(state.busy);
    const player = document.getElementById('playerStatus');
    const enemy = document.getElementById('enemyStatus');
    if (player) player.innerHTML = state.playerStatus ? `<span>${state.playerStatus.id} · ${state.playerStatus.duration}</span>` : '';
    if (enemy) enemy.innerHTML = state.enemyStatus ? `<span>${state.enemyStatus.id} · ${state.enemyStatus.duration}</span>` : '';
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
