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
  function settle(state, outcome = 'defeat') {
    if (!state || state.__rewardSettled) return state?.__rewardDetails || null;
    state.__rewardSettled = true;
    const session = window.DataByteSession;
    const party = session?.party?.() || [];
    const active = session?.starter?.();
    const lead = party.find(item => (item.uid || item.id) === active || item.id === active) || party[0];
    const xp = xpForEnemy(state, outcome);
    window.DataByteProgression?.addXp?.(xp);
    if (lead) session?.addSpriteXp?.(lead.uid || lead.id, xp);
    const coins = 1;
    session?.addCoins?.(coins);
    const item = ['patch', 'repair', 'boost'][Math.floor(Math.random() * 3)];
    window.DataByteInventory?.add?.(item, 1);
    const details = { xp, coins, item, outcome, lead: lead?.uid || lead?.id || null };
    state.__rewardDetails = details;
    window.DataByteRewardHistory?.record?.(outcome === 'captured' ? 'Captured' : 'Victory', xp, details);
    window.dispatchEvent(new CustomEvent('databyte:battle-rewarded', { detail: details }));
    return details;
  }
  function awardDefeat(state) {
    return settle(state, 'defeat');
  }
  window.DataByteBattleRewards = { awardDefeat, settle, xpForEnemy };
})();
