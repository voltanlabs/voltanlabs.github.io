(function () {
  function encounterLevel(state) {
    return Math.min(100, Math.max(1, Number(window.__threeBattleEncounterLevel) || Number(state?.enemy?.level) || 1));
  }
  function xpForEnemy(state) {
    const level = encounterLevel(state);
    const enemy = state?.enemy || window.DataByteBattle?.creatures?.enemy || {};
    const rarityMultiplier = { Common: 1, Uncommon: 1.15, Rare: 1.35, Epic: 1.6, Legendary: 1.9, Mythic: 2.2 }[enemy.rarity] || 1;
    const stage = window.DataByteProgressionData?.stageFor?.(enemy) || Number(enemy.evolutionStage) || 1;
    const stageMultiplier = [1, 1.2, 1.45][Math.max(0, Math.min(2, stage - 1))] || 1;
    return Math.max(12, Math.round((18 + Math.floor(level * 1.5)) * rarityMultiplier * stageMultiplier));
  }
  function captureBonusFor(state) { return Math.max(5, Math.round(xpForEnemy(state) * 0.25)); }
  function leadFor(state) {
    const session = window.DataByteSession;
    const party = session?.party?.() || [];
    const active = session?.starter?.();
    return party.find(item => (item.uid || item.id) === active || item.id === active) || party[0];
  }
  function applyXp(state, xp) {
    const session = window.DataByteSession;
    const lead = leadFor(state);
    window.DataByteProgression?.addXp?.(xp);
    if (lead) session?.addSpriteXp?.(lead.uid || lead.id, xp);
    return lead;
  }
  function settleVictory(state) {
    if (!state || state.__victoryRewardSettled) return state?.__victoryRewardDetails || null;
    state.__victoryRewardSettled = true;
    const xp = xpForEnemy(state), lead = applyXp(state, xp), coins = 1;
    window.DataByteSession?.addCoins?.(coins);
    const item = ['patch', 'repair', 'boost'][Math.floor(Math.random() * 3)];
    window.DataByteInventory?.add?.(item, 1);
    const details = { xp, coins, item, outcome: 'defeat', lead: lead?.uid || lead?.id || null };
    state.__victoryRewardDetails = details;
    window.DataByteRewardHistory?.record?.('Victory', xp, details);
    window.dispatchEvent(new CustomEvent('databyte:battle-rewarded', { detail: details }));
    return details;
  }
  function settleCaptureBonus(state) {
    if (!state || state.__captureBonusSettled) return state?.__captureBonusDetails || null;
    state.__captureBonusSettled = true;
    const xp = captureBonusFor(state), lead = applyXp(state, xp);
    const details = { xp, coins: 0, item: '', outcome: 'captured', lead: lead?.uid || lead?.id || null };
    state.__captureBonusDetails = details;
    window.DataByteRewardHistory?.record?.('Capture Bonus', xp, details);
    window.dispatchEvent(new CustomEvent('databyte:capture-bonus-awarded', { detail: details }));
    return details;
  }
  function settle(state, outcome = 'defeat') {
    const victory = settleVictory(state);
    if (outcome === 'captured') {
      const bonus = settleCaptureBonus(state);
      return { ...victory, bonusXp: bonus?.xp || 0, xp: (victory?.xp || 0) + (bonus?.xp || 0), outcome: 'captured' };
    }
    return victory;
  }
  function awardDefeat(state) { return settleVictory(state); }
  window.DataByteBattleRewards = { awardDefeat, settle, settleVictory, settleCaptureBonus, captureBonusFor, xpForEnemy };
})();
