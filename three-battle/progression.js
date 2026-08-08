(function () {
  const XP_KEY = 'vl_three_battle_xp';
  const RANKS = [
    { name: 'Signal Initiate', xp: 0 },
    { name: 'Field Scout', xp: 100 },
    { name: 'Data Tracker', xp: 250 },
    { name: 'Signal Ranger', xp: 500 },
    { name: 'Volt Master', xp: 900 }
  ];

  function xp() { return Math.max(0, Number(localStorage.getItem(XP_KEY) || 0)); }
  function rank(value = xp()) {
    let current = RANKS[0];
    RANKS.forEach(entry => { if (value >= entry.xp) current = entry; });
    return current;
  }
  function addXp(amount) {
    const next = xp() + Math.max(0, Number(amount) || 0);
    localStorage.setItem(XP_KEY, String(next));
    render();
    return next;
  }
  function snapshot() {
    const value = xp();
    const current = rank(value);
    const next = RANKS.find(entry => entry.xp > value);
    return { xp: value, rank: current.name, nextXp: next?.xp ?? current.xp, progress: next ? Math.round((value - current.xp) / (next.xp - current.xp) * 100) : 100 };
  }
  function render() {
    const state = snapshot();
    const target = document.getElementById('progressionStatus');
    if (target) target.textContent = `${state.rank} · ${state.xp} XP`;
    const mission = document.getElementById('progressionSummary');
    if (mission) mission.textContent = `${state.rank} · ${state.xp} XP · ${state.nextXp === state.xp ? 'Max rank reached.' : `${state.nextXp - state.xp} XP to next rank.`}`;
    window.dispatchEvent(new CustomEvent('databyte:progression-updated', { detail: state }));
  }

  window.DataByteProgression = { xp, rank, addXp, snapshot, render };
  window.addEventListener('DOMContentLoaded', render);
  const outcome = document.getElementById('battleOutcome');
  if (outcome && window.MutationObserver) {
    new MutationObserver(() => {
      const text = outcome.textContent || '';
      if (!/captured|victory/i.test(text) || outcome.dataset.xpAwarded) return;
      outcome.dataset.xpAwarded = '1';
      addXp(/captured/i.test(text) ? 50 : 25);
    }).observe(outcome, { childList: true, subtree: true, characterData: true });
  }
})();
