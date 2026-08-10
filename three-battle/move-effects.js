(function () {
  function moveForIndex(index) {
    const player = window.DataByteSession?.party?.().find(item => item.id === window.DataByteSession?.starter?.());
    const species = window.DataByteSession?.roster?.().find(item => item.id === player?.id) || player || {};
    const moves = window.THREE_BATTLE_MOVE_FOR_SPECIES?.(player?.id, species) || window.THREE_BATTLE_DATA?.moves || [];
    return moves[index];
  }
  function apply(move) {
    const state = window.DataByteBattle?.getState?.();
    if (!state || state.over || !move) return;
    const stability = Number(move.stabilityEffect) || 0;
    if (stability) state.stability = Math.min(100, Math.max(0, Number(state.stability || 0) + stability));
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
    const target = document.getElementById('battleStatus');
    const state = window.DataByteBattle?.getState?.();
    if (!target || !state) return;
    const statuses = [state.playerStatus && `YOU: ${state.playerStatus.id} · ${state.playerStatus.duration}`, state.enemyStatus && `WILD: ${state.enemyStatus.id} · ${state.enemyStatus.duration}`].filter(Boolean);
    target.innerHTML = statuses.map(status => `<span>${status}</span>`).join('');
    target.classList.toggle('has-status', statuses.length > 0);
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
