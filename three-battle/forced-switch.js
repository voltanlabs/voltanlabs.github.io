(function () {
  let shown = false;
  function show() {
    if (shown) return; shown = true;
    const party = window.DataByteSession?.party?.() || [], active = window.DataByteSession?.starter?.();
    const choices = party.filter(item => item.id !== active && (item.hp ?? 100) > 0);
    let modal = document.getElementById('switchModal');
    if (!modal) { modal = document.createElement('div'); modal.id = 'switchModal'; modal.className = 'capture-modal'; document.body.appendChild(modal); }
    modal.innerHTML = `<div class="capture-card"><span class="eyebrow">SIGNAL LOST</span><h2>Deploy a replacement</h2><p>Your active DataByte needs to switch.</p><div class="switch-list">${choices.length ? choices.map(item => `<button class="ghost" data-switch-id="${item.id}">${item.name}<small>${item.hp ?? 100} HP</small></button>`).join('') : '<p>No usable DataBytes remain.</p>'}</div></div>`;
    modal.classList.add('is-open');
    modal.querySelectorAll('[data-switch-id]').forEach(button => button.onclick = () => { window.DataByteSession.setStarter(button.dataset.switchId); window.dispatchEvent(new CustomEvent('databyte:deploy-requested')); modal.classList.remove('is-open'); shown = false; });
  }
  function watch() {
    const hp = document.getElementById('playerHpText'), arena = document.getElementById('arenaView');
    if (!hp || !arena || !window.MutationObserver) return;
    let previousHp = Number.parseInt(hp.textContent, 10);
    const observer = new MutationObserver(() => { if (arena.classList.contains('hidden')) { previousHp = Number.parseInt(hp.textContent, 10); return; } const currentHp = Number.parseInt(hp.textContent, 10); if (Number.isFinite(currentHp) && previousHp > 0 && currentHp === 0) show(); previousHp = currentHp; });
    observer.observe(hp, { childList: true, characterData: true, subtree: true });
  }
  window.addEventListener('DOMContentLoaded', watch);
})();
