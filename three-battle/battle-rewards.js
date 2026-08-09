(function () {
  function awardDefeat(state) {
    if (!state || state.__defeatRewardGranted || !/Victory!/i.test(state.message || '')) return;
    state.__defeatRewardGranted = true;
    const session = window.DataByteSession;
    const lead = session?.starter?.();
    window.DataByteProgression?.addXp?.(25);
    if (lead) session?.addSpriteXp?.(lead, 25);
    session?.addCoins?.(1);
    window.DataByteRewardHistory?.record?.('Victory reward');
    window.dispatchEvent(new CustomEvent('databyte:defeat-rewarded', { detail: { id: lead, xp: 25, coins: 1 } }));
  }
  function poll() { awardDefeat(window.DataByteBattle?.getState?.()); }
  window.setInterval(poll, 100);
  window.DataByteBattleRewards = { awardDefeat };
})();
