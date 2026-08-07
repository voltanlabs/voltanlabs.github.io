(function () {
  const KEY = 'vl_three_battle_inventory';
  const defaults = { patch: 3, boost: 2, repair: 1 };
  function read() { try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return { ...defaults }; } }
  function save(value) { localStorage.setItem(KEY, JSON.stringify(value)); localStorage.setItem('vl_three_battle_items_used', String(Number(localStorage.getItem('vl_three_battle_items_used') || 0) + 1)); window.dispatchEvent(new CustomEvent('databyte:inventory-updated')); render(); return value; }
  function count(id = 'patch') { return Math.max(0, Number(read()[id] || 0)); }
  function add(id, amount = 1) { const next = read(); next[id] = count(id) + amount; return save(next); }
  function use(id = 'patch') { const next = read(); if (!next[id]) return false; next[id] -= 1; save(next); return true; }
  function render() {
    const button = document.getElementById('itemBtn');
    if (button) button.textContent = `SIGNAL PATCH ×${count()}`;
    const boost = document.getElementById('boostBtn'); if (boost) boost.textContent = `SIGNAL BOOST ×${count('boost')}`;
    const repair = document.getElementById('repairBtn'); if (repair) repair.textContent = `REPAIR PULSE ×${count('repair')}`;
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
    panel.appendChild(button);
    [['boostBtn','SIGNAL BOOST ×','boost'],['repairBtn','REPAIR PULSE ×','repair']].forEach(([id,label,item])=>{const extra=document.createElement('button');extra.id=id;extra.className='ghost';extra.type='button';extra.addEventListener('click',()=>{if(!window.DataByteBattle?.[item])return;if(!use(item)){window.DataByteBattle.message(`No ${label.trim()}s remaining.`);return}window.DataByteBattle[item]();});panel.appendChild(extra)}); render();
  }
  window.DataByteInventory = { read, count, add, use, render };
  window.addEventListener('DOMContentLoaded', install);
  window.addEventListener('databyte:progression-updated', render);
})();
