(function () {
  const regions = [{ id: 'grove', name: 'Pristine Grove', environment: 'forest' }, { id: 'rift', name: 'Stained Rift', environment: 'rift' }, { id: 'cavern', name: 'Null Cavern', environment: 'cave' }, { id: 'bay', name: 'Signal Bay', environment: 'bay' }];
  const KEY = 'vl_three_battle_region';
  function current() { return regions.find(region => region.id === localStorage.getItem(KEY)) || regions[0]; }
  function render() { const button = document.getElementById('regionBtn'); if (button) button.textContent = `REGION · ${current().name}`; }
  function open() {
    let modal = document.getElementById('regionModal');
    if (!modal) { modal = document.createElement('div'); modal.id = 'regionModal'; modal.className = 'capture-modal'; document.body.appendChild(modal); }
    modal.innerHTML = `<div class="capture-card"><span class="eyebrow">SIGNAL REGIONS</span><h2>Choose a field</h2><div class="region-list">${regions.map(region => `<button class="ghost" data-region="${region.id}">${region.name}</button>`).join('')}</div><button class="ghost" data-region-close>CLOSE</button></div>`;
    modal.classList.add('is-open');
    modal.querySelectorAll('[data-region]').forEach(button => button.addEventListener('click', () => { localStorage.setItem(KEY, button.dataset.region); modal.classList.remove('is-open'); render(); window.dispatchEvent(new CustomEvent('databyte:region-updated', { detail: current() })); }));
    modal.querySelector('[data-region-close]').onclick = () => modal.classList.remove('is-open');
  }
  function install() { const scanner = document.getElementById('scannerView'); if (!scanner || document.getElementById('regionBtn')) return; const button = document.createElement('button'); button.id = 'regionBtn'; button.className = 'ghost'; button.type = 'button'; button.onclick = open; (scanner.querySelector('#scannerTools') || scanner).appendChild(button); render(); }
  window.DataByteRegions = { regions, current, open, render };
  window.addEventListener('DOMContentLoaded', install);
})();
