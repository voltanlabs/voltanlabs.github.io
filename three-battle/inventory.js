(function () {
  const KEY = 'vl_three_battle_inventory';
  const defaults = { patch: 3, boost: 2, repair: 1 };
  function read() { return { ...defaults, ...(window.DataByteSession?.profileGet?.(KEY, {}) || {}) }; }
  function save(value, used = false) { window.DataByteSession?.profileSet?.(KEY, value); if (used) window.DataByteSession?.profileSet?.('vl_three_battle_items_used', Number(window.DataByteSession?.profileGet?.('vl_three_battle_items_used', 0) || 0) + 1); window.dispatchEvent(new CustomEvent('databyte:inventory-updated')); render(); return value; }
  function count(id = 'patch') { return Math.max(0, Number(read()[id] || 0)); }
  function add(id, amount = 1) { const next = read(); next[id] = count(id) + amount; return save(next); }
  function use(id = 'patch') { const next = read(); if (!next[id]) return false; next[id] -= 1; save(next, true); return true; }
  function render() {
    const list = document.getElementById('itemsList'); if (!list) return;
    const coins = window.DataByteSession?.coins?.() ?? 0;
    list.innerHTML = `<div class="coin-balance"><span><strong>DATABYTECOINS</strong><small>Capture currency</small></span><b>◈ ${coins}</b></div>` + [['patch', 'REPAIR PATCH', 'Restore 25 HP'], ['boost', 'SIGNAL BOOST', 'Increase capture pressure'], ['repair', 'REPAIR PULSE', 'Restore 35 HP']].map(([id, name, copy]) => `<button class="ghost" data-item-id="${id}"><span><strong>${name}</strong><small>${copy}</small></span><b>×${count(id)}</b></button>`).join('');
    list.querySelectorAll('[data-item-id]').forEach(button => button.onclick = () => { const id = button.dataset.itemId; const action = id === 'patch' ? 'healPlayer' : id; const inBattle = !document.getElementById('arenaView')?.classList.contains('hidden'); if (!inBattle) { if (id === 'boost') return; const active = window.DataByteSession?.starter?.(); const item = window.DataByteSession?.party?.().find(entry => entry.id === active); if (!item) return; if (!use(id)) return; const amount = id === 'patch' ? 25 : 35; window.DataByteSession.updateHp(active, Math.min(100, Number(item.hp ?? 100) + amount)); render(); return; } if (!window.DataByteBattle?.[action]) return; if (!use(id)) { window.DataByteBattle.message(`No ${button.querySelector('strong').textContent} items remaining.`); return; } window.DataByteBattle[action](id === 'patch' ? 25 : undefined); });
    const mission = document.getElementById('missionProgress'); if (mission && window.DataByteProgression) mission.textContent = `${window.DataByteProgression.snapshot().rank} · ${window.DataByteProgression.xp()} XP · Signal Boosts: ${count('boost')} · Repair Pulses: ${count('repair')}`;
  }
  function install() { if (document.getElementById('itemsList')) render(); }
  window.DataByteInventory = { read, count, add, use, render };
  install(); window.addEventListener('DOMContentLoaded', install); window.addEventListener('databyte:progression-updated', render); window.addEventListener('databyte:coins-updated', render); window.addEventListener('databyte:dex-updated', render); window.addEventListener('databyte:mission-rewarded', render);
})();
(function(){
  function closePicker(){document.getElementById('healPicker')?.remove()}
  function openPicker(itemId,amount,label){
    const session=window.DataByteSession;
    const targets=[...(session?.party?.()||[]),...(session?.repository?.()||[])].filter(item=>item&&Number(item.hp??100)<100);
    if(!targets.length){window.DataByteInventory?.render?.();return}
    const modal=document.createElement('div');modal.id='healPicker';modal.className='capture-modal is-open';
    modal.innerHTML=`<div class="capture-card"><span class="eyebrow">ITEM CACHE // TARGET</span><h2>${label}</h2><p>Choose a DataByte to restore.</p><div class="outcome-actions">${targets.map(item=>`<button class="ghost" data-heal-target="${item.id}"><span>${item.name}</span><small>${Math.max(0,Number(item.hp??100))} / 100 HP</small></button>`).join('')}</div><button class="ghost" data-heal-cancel>CANCEL</button></div>`;
    document.body.appendChild(modal);
    modal.querySelector('[data-heal-cancel]').onclick=closePicker;
    modal.querySelectorAll('[data-heal-target]').forEach(button=>button.onclick=()=>{if(!session||!window.DataByteInventory?.use(itemId))return;const target=session.party?.().concat(session.repository?.()||[]).find(item=>item.id===button.dataset.healTarget);if(target)session.updateHp(target.id,Math.min(100,Number(target.hp??100)+amount));closePicker();window.DataByteInventory?.render?.()});
  }
  document.addEventListener('click',event=>{const button=event.target.closest?.('[data-item-id]');if(!button||document.getElementById('arenaView')?.classList.contains('hidden')===false)return;const id=button.dataset.itemId;if(id!=='patch'&&id!=='repair')return;event.preventDefault();event.stopImmediatePropagation();openPicker(id,id==='patch'?25:35,id==='patch'?'REPAIR PATCH':'REPAIR PULSE')},true);
})();
