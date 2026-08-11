(function () {
  let previousBusy = false;
  let pending = null;
  function chooseMove() {
    const battle = window.DataByteBattle;
    const enemy = battle?.creatures?.enemy;
    if (!enemy) return null;
    const species = window.DataByteSession?.roster?.().find(item => item.id === enemy.id) || enemy;
    const moves = (window.THREE_BATTLE_MOVE_FOR_SPECIES?.(enemy.id, species) || []).filter(move => move?.power > 0 || move?.moveType === 'defense');
    if (!moves.length) return null;
    const support = moves.find(move => move.moveType === 'defense' && Number(enemy.hp) < 40);
    return support || moves[Math.floor(Math.random() * moves.length)];
  }
  function tick() {
    const battle = window.DataByteBattle;
    const state = battle?.getState?.();
    const creatures = battle?.creatures;
    if (!state || !creatures) return;
    if (!previousBusy && state.busy) pending = { move: chooseMove(), playerHp: creatures.player.hp, stability: state.stability };
    if (previousBusy && !state.busy && pending?.move && !state.over) {
      const move = pending.move;
      const level = Math.max(1, Number(window.__threeBattleEncounterLevel) || 1);
      const targetDamage = Math.max(1, Math.round((Number(move.power) || 20) * (0.7 + level / 200)));
      const guarded = state.guarding;
      const damage = guarded ? Math.max(1, Math.round(targetDamage * 0.45)) : targetDamage;
      creatures.player.hp = Math.max(0, pending.playerHp - damage);
      if (move.statusEffect && Math.random() * 100 < Number(move.statusEffect.chance ?? 100)) {
        const target = move.statusEffect.target === 'self' ? 'enemyStatus' : 'playerStatus';
        if (window.DataByteStatusRuntime?.apply) window.DataByteStatusRuntime.apply(state, target, move.statusEffect);
        else state[target] = [{ id: move.statusEffect.id, duration: Number(move.statusEffect.durationTurns) || 1, stacks: 1 }];
        if (target === 'enemyStatus' && move.statusEffect.id === 'guarded') state.enemyGuarding = true;
      }
      state.stability = Math.min(100, Math.max(0, Number(pending.stability || state.stability || 0) + (Number(move.stabilityEffect) || 0)));
      state.over = creatures.player.hp <= 0;
      state.message = state.over ? 'Your DataByte lost signal.' : `${creatures.enemy.name} used ${move.name} for ${damage} damage.`;
      battle.message?.(state.message);
    }
    previousBusy = Boolean(state.busy);
  }
  window.setInterval(tick, 80);
  window.DataByteEnemyAI = { chooseMove, tick };
})();
