(function () {
  const KEY = 'vl_three_battle_reward_history';
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
  function record(text) {
    const history = read();
    const name = document.getElementById('enemyName')?.textContent?.trim() || 'Unknown Signal';
    const captured = /captured/i.test(text), coins = captured ? 1 : 0;
    if (coins) window.DataByteSession?.addCoins?.(coins);
    const entry = { name, result: captured ? 'Captured' : 'Victory', xp: captured ? 50 : 25, coins, at: new Date().toISOString() };
    history.unshift(entry); localStorage.setItem(KEY, JSON.stringify(history.slice(0, 20))); render();
  }
  function render() {
    const panel = document.getElementById('missionView'); if (!panel) return;
    let host = document.getElementById('rewardHistory');
    if (!host) { host = document.createElement('div'); host.id = 'rewardHistory'; panel.appendChild(host); }
    const history = read(); host.innerHTML = `<span class="eyebrow">REWARD HISTORY</span>${history.length ? history.slice(0, 5).map(item => `<p><strong>${item.result}</strong> · ${item.name} · +${item.xp} XP${item.coins ? ` · +${item.coins} Coin` : ''}</p>`).join('') : '<p>No completed battles yet.</p>'}`;
  }
  window.DataByteRewardHistory = { read, record, render };
  window.addEventListener('DOMContentLoaded', () => { render(); const outcome = document.getElementById('battleOutcome'); if (outcome && window.MutationObserver) new MutationObserver(() => { const text = outcome.textContent || ''; if (/captured|victory/i.test(text) && !outcome.dataset.rewardRecorded) { outcome.dataset.rewardRecorded = '1'; record(text); } }).observe(outcome, { childList: true, subtree: true, characterData: true }); });
})();
