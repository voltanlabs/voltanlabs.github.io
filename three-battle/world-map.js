(function () {
  const unlocks = { grove: 0, rift: 2, cavern: 4, bay: 6 };
  function open() {
    const regions = window.DataByteRegions?.regions || [];
    let modal = document.getElementById('worldMapModal');
    if (!modal) { modal = document.createElement('div'); modal.id = 'worldMapModal'; modal.className = 'capture-modal'; document.body.appendChild(modal); }
    const seen = window.DataByteSession?.seen?.().length || 0;
    modal.innerHTML = `<div class="capture-card"><span class="eyebrow">SIGNAL WORLD MAP</span><h2>Choose a region</h2><div class="map-grid">${regions.map(region => { const needed = unlocks[region.id] || 0; const locked = seen < needed; return `<button class="ghost" data-map-region="${region.id}" ${locked ? 'disabled' : ''}>${locked ? '🔒 ' : ''}${region.name}<small>${locked ? `Discover ${needed - seen} more` : 'Available'}</small></button>`; }).join('')}</div><button class="ghost" data-map-close>CLOSE</button></div>`;
    modal.classList.add('is-open');
    modal.querySelectorAll('[data-map-region]').forEach(button => button.addEventListener('click', () => { localStorage.setItem('vl_three_battle_region', button.dataset.mapRegion); modal.classList.remove('is-open'); window.DataByteRegions?.render?.(); window.dispatchEvent(new CustomEvent('databyte:region-updated', { detail: window.DataByteRegions?.current?.() })); }));
    modal.querySelector('[data-map-close]').onclick = () => modal.classList.remove('is-open');
  }
  function install() { const scanner = document.getElementById('scannerView'); if (!scanner || document.getElementById('mapBtn')) return; const button = document.createElement('button'); button.id = 'mapBtn'; button.className = 'ghost'; button.type = 'button'; button.textContent = 'WORLD MAP'; button.onclick = open; scanner.appendChild(button); }
  window.DataByteWorldMap = { open, unlocks };
  install(); window.addEventListener('DOMContentLoaded', install); window.addEventListener('databyte:dex-updated', install);
})();
