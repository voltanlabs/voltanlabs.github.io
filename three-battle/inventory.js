(function () {
  const KEY = 'vl_three_battle_inventory';
  const defaults = { patch: 3 };
  function read() { try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return { ...defaults }; } }
  function save(value) { localStorage.setItem(KEY, JSON.stringify(value)); render(); return value; }
  function count(id = 'patch') { return Math.max(0, Number(read()[id] || 0)); }
  function add(id, amount = 1) { const next = read(); next[id] = count(id) + amount; return save(next); }
  function use(id = 'patch') { const next = read(); if (!next[id]) return false; next[id] -= 1; save(next); return true; }
  function render() {
    const button = document.getElementById('itemBtn');
    if (button) button.textContent = `SIGNAL PATCH ×${count()}`;
    const mission = document.getElementById('missionProgress');
    if (mission && window.DataByteProgression) mission.textContent = `${window.DataByteProgression.snapshot().rank} · ${window.DataByteProgression.xp()} XP · Signal Patches: ${count()}`;
  }
  function install() {
    const panel = document.querySelector('.panel-heading');
    if (!panel || document.getElementById('itemBtn')) return;
    const button = document.createElement('button');
    button.id = 'itemBtn'; button.className = 'ghost'; button.type = 'button';
    button.addEventListener('click', () => {
      if (!window.DataByteBattle?.healPlayer) return;
      if (!use()) { window.DataByteBattle.message('No Signal Patches remaining.'); return; }
      window.DataByteBattle.healPlayer(25);
    });
    panel.appendChild(button); render();
  }
  window.DataByteInventory = { read, count, add, use, render };
  window.addEventListener('DOMContentLoaded', install);
  window.addEventListener('databyte:progression-updated', render);
})();
