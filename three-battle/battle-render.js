// Battle HUD renderer. It receives state and dependencies instead of owning battle rules.
export function renderBattleView({ state, creatures, getElement, documentRef = document }) {
  if (!state || !creatures) return;
  for (const side of ['player', 'enemy']) {
    const creature = creatures[side], hp = Math.max(0, Number(creature.hp) || 0), maxHp = Math.max(1, Number(creature.maxHp) || 1);
    const meter = getElement(`${side}Hp`), text = getElement(`${side}HpText`);
    if (meter) meter.style.width = `${Math.max(0, hp / maxHp * 100)}%`;
    if (text) text.textContent = `${hp} / ${maxHp} HP`;
  }
  const turn = getElement('turnText'), log = getElement('battleLog');
  if (turn) turn.textContent = state.over ? 'BATTLE COMPLETE' : state.busy ? 'ENEMY TURN' : 'YOUR TURN';
  if (log) {
    const effect = state.lastEffectApplied;
    log.textContent = `${state.message || ''}${effect ? ` ${effect} applied.` : ''}`.trim();
    if (effect) state.lastEffectApplied = null;
  }
  const stabilityValue = getElement('stabilityValue'), stabilityFill = getElement('stabilityFill');
  if (stabilityValue) stabilityValue.textContent = `${state.stability}%`;
  if (stabilityFill) stabilityFill.style.width = `${state.stability}%`;
  documentRef.querySelectorAll('.action').forEach(button => { button.disabled = Boolean(state.busy || state.over); });
}
