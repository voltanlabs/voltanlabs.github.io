(function () {
  function encounterLevel(state) {
    return Math.min(100, Math.max(1, Number(window.__threeBattleEncounterLevel) || Number(state?.enemy?.level) || 1));
  }
  function xpForEnemy(state, outcome = 'defeat') {
    const level = encounterLevel(state);
    // The level curve is quadratic, so rewards stay deliberately sub-linear.
    // Higher-level signals pay more, but late-game levels still take grinding.
    const defeat = 10 + Math.floor(level * 0.5);
    return outcome === 'captured' ? 15 + Math.floor(level * 0.75) : defeat;
  }
  function awardDefeat(state) {
    if (!state || state.__defeatRewardGranted || !/Victory!/i.test(state.message || '')) return;
    state.__defeatRewardGranted = true;
    const session = window.DataByteSession;
    const party = session?.party?.() || [];
    const lead = party.find(item => item.id === session?.starter?.())?.id || party[0]?.id;
    const xp = xpForEnemy(state, 'defeat');
    window.DataByteProgression?.addXp?.(xp);
    if (lead) session?.addSpriteXp?.(lead, xp);
    session?.addCoins?.(1);
    window.DataByteRewardHistory?.record?.('Victory reward');
    window.dispatchEvent(new CustomEvent('databyte:defeat-rewarded', { detail: { id: lead, xp, coins: 1 } }));
  }
  function poll() { awardDefeat(window.DataByteBattle?.getState?.()); }
  window.setInterval(poll, 100);
  window.DataByteBattleRewards = { awardDefeat, xpForEnemy };
})();
