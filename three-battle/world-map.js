(function () {
  function open() {
    const regions = window.DataByteRegions?.regions || [];
    let modal = document.getElementById('worldMapModal');
    if (!modal) { modal = document.createElement('div'); modal.id = 'worldMapModal'; modal.className = 'capture-modal'; document.body.appendChild(modal); }
    modal.innerHTML = `<div class="capture-card"><span class="eyebrow">SIGNAL WORLD MAP</span><h2>Choose a region</h2><div class="map-grid">${regions.map(region => {
      const access = window.DataByteRegions?.access?.(region) || { allowed: true, seen: 0, level: 1, needed: 0, neededLevel: 1 };
      const missing = [];
      if (access.seen < access.needed) missing.push(`Discover ${access.needed - access.seen} more`);
      if (access.level < access.neededLevel) missing.push(`Lead level ${access.neededLevel}`);
      return `<button class="ghost" data-map-region="${region.id}" ${access.allowed ? '' : 'disabled'}>${access.allowed ? '' : '🔒 '}${region.name}<small>${access.allowed ? 'Available' : missing.join(' · ')}</small></button>`;
    }).join('')}</div><button class="ghost" data-map-close>CLOSE</button></div>`;
    modal.classList.add('is-open');
    modal.querySelectorAll('[data-map-region]').forEach(button => button.addEventListener('click', () => {
      window.DataByteSession?.profileSet?.('vl_three_battle_region', button.dataset.mapRegion);
      modal.classList.remove('is-open');
      window.DataByteRegions?.render?.();
      window.dispatchEvent(new CustomEvent('databyte:region-updated', { detail: window.DataByteRegions?.current?.() }));
    }));
    modal.querySelector('[data-map-close]').onclick = () => modal.classList.remove('is-open');
  }
  function install() {
    const scanner = document.getElementById('scannerView');
    if (!scanner || document.getElementById('mapBtn')) return;
    const button = document.createElement('button');
    button.id = 'mapBtn'; button.className = 'ghost'; button.type = 'button'; button.textContent = 'WORLD MAP'; button.onclick = open;
    (scanner.querySelector('#scannerTools') || scanner).appendChild(button);
  }
  window.DataByteWorldMap = { open };
  install(); window.addEventListener('DOMContentLoaded', install); window.addEventListener('databyte:dex-updated', install);
})();
