(function () {
  const KEY = 'vl_three_battle_reward_history';
  function read() { return window.DataByteSession?.profileGet?.(KEY, []) || []; }
  function record(text, xpOverride, reward = {}) {
    const history = read();
    const name = document.getElementById('enemyName')?.textContent?.trim() || 'Unknown Signal';
    const captured = /captured/i.test(text), bonus = /capture bonus/i.test(text), coins = Number(reward.coins ?? 0), item = reward.item || '';
    const xp = Number.isFinite(Number(xpOverride)) ? Number(xpOverride) : (window.DataByteBattleRewards?.xpForEnemy?.(window.DataByteBattle?.getState?.(), captured ? 'captured' : 'defeat') ?? (captured ? 50 : 25));
    const entry = { name, result: bonus ? 'Capture Bonus' : (captured ? 'Captured' : 'Victory'), xp, coins, item, at: new Date().toISOString() };
    history.unshift(entry); window.DataByteSession?.profileSet?.(KEY, history.slice(0, 20)); render();
  }
  function render() {
    const panel = document.getElementById('missionView'); if (!panel) return;
    let host = document.getElementById('rewardHistory');
    if (!host) { host = document.createElement('div'); host.id = 'rewardHistory'; panel.appendChild(host); }
    const history = read(); host.innerHTML = `<span class="eyebrow">REWARD HISTORY</span>${history.length ? history.slice(0, 5).map(item => `<p><strong>${item.result}</strong> · ${item.name} · +${item.xp} XP${item.coins ? ` · +${item.coins} Coin` : ''}${item.item ? ` · ${item.item}` : ''}</p>`).join('') : '<p>No completed battles yet.</p>'}`;
  }
  window.DataByteRewardHistory = { read, record, render };
  window.addEventListener('DOMContentLoaded', render);
})();
