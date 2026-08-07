(function () {
  const KEY = 'vl_three_battle_missions_v2';
  const goals = [
    { id: 'survey', label: 'Discover 3 signals', target: 3, value: () => window.DataByteSession?.seen?.().length || 0, reward: 2 },
    { id: 'capture', label: 'Capture 2 signals', target: 2, value: () => window.DataByteSession?.party?.().length || 0, reward: 3 },
    { id: 'items', label: 'Use 1 field item', target: 1, value: () => Number(localStorage.getItem('vl_three_battle_items_used') || 0), reward: 2 }
  ];
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } }
  function write(value) { localStorage.setItem(KEY, JSON.stringify(value)); }
  function render() {
    const panel = document.getElementById('missionView');
    const text = document.getElementById('missionProgress');
    if (!panel || !text) return;
    const state = read();
    const current = goals.find(goal => !state[goal.id]);
    if (!current) { text.textContent = 'All scanner missions complete. Keep exploring for rare signals.'; return; }
    const value = Math.min(current.target, current.value());
    if (value >= current.target) { state[current.id] = { completedAt: new Date().toISOString() }; write(state); window.DataByteSession?.addCoins?.(current.reward); return render(); }
    text.textContent = `${current.label} · ${value}/${current.target} · Reward: ${current.reward} DataByteCoins`;
  }
  window.DataByteMissions = { goals, render };
  ['databyte:dex-updated', 'databyte:party-updated', 'databyte:inventory-updated'].forEach(event => window.addEventListener(event, render));
  window.addEventListener('DOMContentLoaded', render);
})();
