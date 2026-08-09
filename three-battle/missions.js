(function () {
  const KEY = 'vl_three_battle_missions_v3';
  const goals = [
    { id: 'survey', label: 'Signal Survey', copy: 'Discover 3 signals.', target: 3, reward: 2, value: () => window.DataByteSession?.seen?.().length || 0 },
    { id: 'capture', label: 'Download Authorization', copy: 'Capture 2 DataBytes.', target: 2, reward: 3, value: () => (window.DataByteSession?.party?.().length || 0) + (window.DataByteSession?.repository?.().length || 0) },
    { id: 'items', label: 'Field Technician', copy: 'Use 1 field item.', target: 1, reward: 2, value: () => Number(window.DataByteSession?.profileGet?.('vl_three_battle_items_used', 0) || 0) },
    { id: 'rank', label: 'Field Scout', copy: 'Earn 100 XP.', target: 100, reward: 3, value: () => window.DataByteProgression?.xp?.() || 0 },
    { id: 'roster', label: 'Roster Expansion', copy: 'Build a team or repository of 3 DataBytes.', target: 3, reward: 4, value: () => (window.DataByteSession?.party?.().length || 0) + (window.DataByteSession?.repository?.().length || 0) }
  ];
  function read() { return window.DataByteSession?.profileGet?.(KEY, {}) || {}; }
  function write(value) { window.DataByteSession?.profileSet?.(KEY, value); }
  function render() {
    const panel = document.getElementById('missionView'), text = document.getElementById('missionProgress');
    if (!panel || !text) return;
    const state = read(), board = document.getElementById('missionBoard') || (() => { const host = document.createElement('div'); host.id = 'missionBoard'; panel.appendChild(host); return host; })();
    board.innerHTML = goals.map(goal => {
      const record = state[goal.id] || {}, value = Math.min(goal.target, goal.value()), complete = record.completed || value >= goal.target;
      if (complete && !record.completed) state[goal.id] = { completed: true, claimed: false, completedAt: new Date().toISOString() };
      const claimed = Boolean((state[goal.id] || record).claimed);
      return `<article class="mission-card ${claimed ? 'is-claimed' : complete ? 'is-complete' : ''}"><strong>${goal.label}</strong><small>${goal.copy}</small><span>${value}/${goal.target} · Reward ${goal.reward} DataByteCoins</span>${claimed ? '<b>CLAIMED</b>' : complete ? `<button class="ghost" data-claim-mission="${goal.id}">CLAIM REWARD</button>` : '<em>IN PROGRESS</em>'}</article>`;
    }).join('');
    write(state);
    const active = goals.find(goal => !state[goal.id]?.claimed);
    text.textContent = active ? `${active.label} · ${Math.min(active.target, active.value())}/${active.target}` : 'All scanner missions complete.';
    board.querySelectorAll('[data-claim-mission]').forEach(button => button.onclick = () => { const goal = goals.find(item => item.id === button.dataset.claimMission), current = read(); current[goal.id] = { ...(current[goal.id] || {}), claimed: true, claimedAt: new Date().toISOString() }; write(current); window.DataByteSession?.addCoins?.(goal.reward); render(); });
  }
  window.DataByteMissions = { goals, read, render };
  ['databyte:dex-updated', 'databyte:party-updated', 'databyte:inventory-updated', 'databyte:progression-updated'].forEach(event => window.addEventListener(event, render));
  window.addEventListener('DOMContentLoaded', render);
})();
