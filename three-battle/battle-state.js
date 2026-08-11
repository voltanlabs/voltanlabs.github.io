// Battle state factory. State transitions remain in the engine; this keeps the shape consistent.
export function createBattleState({ maxStability = 100, message = '' } = {}) {
  return {
    busy: false,
    over: false,
    resultShown: false,
    rewardGranted: false,
    guarding: false,
    enemyGuarding: false,
    playerStatus: [],
    enemyStatus: [],
    status: null,
    capturePressure: 0,
    stability: Math.max(1, Number(maxStability) || 100),
    maxStability: Math.max(1, Number(maxStability) || 100),
    message
  };
}

export function clearPlayerBattleEffects(state) {
  if (!state) return state;
  state.playerStatus = [];
  state.guarding = false;
  return state;
}
