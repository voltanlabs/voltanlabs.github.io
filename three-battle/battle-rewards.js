(function () {
  function encounterLevel(state) {
    return Math.min(100, Math.max(1, Number(window.__threeBattleEncounterLevel) || Number(state?.enemy?.level) || 1));
  }
  function xpForEnemy(state, outcome = 'defeat') {
    const level = encounterLevel(state);
    const enemy = state?.enemy || window.DataByteBattle?.creatures?.enemy || {};
    const rarityMultiplier = { Common: 1, Uncommon: 1.15, Rare: 1.35, Epic: 1.6, Legendary: 1.9, Mythic: 2.2 }[enemy.rarity] || 1;
    const stage = window.DataByteProgressionData?.stageFor?.(enemy) || Number(enemy.evolutionStage) || 1;
    const stageMultiplier = [1, 1.2, 1.45][Math.max(0, Math.min(2, stage - 1))] || 1;
    const base = 18 + Math.floor(level * 1.5);
    const outcomeMultiplier = outcome === 'captured' ? 1.35 : 1;
    return Math.max(12, Math.round(base * rarityMultiplier * stageMultiplier * outcomeMultiplier));
  }
  function awardDefeat(state) {
    if (!state || state.__defeatRewardGranted || state.outcome !== 'victory') return;
    state.__defeatRewardGranted = true;
    const session = window.DataByteSession;
    const party = session?.party?.() || [];
    const active = session?.starter?.();
    const lead = party.find(item => (item.uid || item.id) === active || item.id === active) || party[0];
    const xp = xpForEnemy(state, 'defeat');
    window.DataByteProgression?.addXp?.(xp);
    if (lead) session?.addSpriteXp?.(lead.uid || lead.id, xp);
    session?.addCoins?.(1);
    window.DataByteRewardHistory?.record?.('Victory reward');
    window.dispatchEvent(new CustomEvent('databyte:defeat-rewarded', { detail: { id: lead?.uid || lead?.id, xp, coins: 1 } }));
  }
  window.DataByteBattleRewards = { awardDefeat, xpForEnemy };
})();
