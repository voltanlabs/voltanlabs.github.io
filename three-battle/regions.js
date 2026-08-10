(function () {
  const regions = [
    { id: 'grove', name: 'Pristine Grove', environment: 'forest', needed: 0 },
    { id: 'rift', name: 'Stained Rift', environment: 'rift', needed: 3 },
    { id: 'cavern', name: 'Null Cavern', environment: 'cave', needed: 5 },
    { id: 'bay', name: 'Signal Bay', environment: 'bay', needed: 8 }
  ];
  const KEY = 'vl_three_battle_region';
  function current() {
    return regions.find(region => region.id === window.DataByteSession?.profileGet?.(KEY, 'grove')) || regions[0];
  }
  function render() {
    const button = document.getElementById('mapBtn');
    if (button) button.textContent = `WORLD MAP · ${current().name}`;
  }
  // Region selection belongs to the world map. Keep this compatibility bridge
  // for older callers without creating a second region picker.
  function open() { window.DataByteWorldMap?.open?.(); }
  function install() { render(); }
  window.DataByteRegions = { regions, current, open, render, speciesByRegion: {} };
  window.addEventListener('DOMContentLoaded', install);
  window.addEventListener('databyte:region-updated', render);
})();
