(function () {
  const regions = [
    { id: 'grove', name: 'Pristine Grove', environment: 'forest', needed: 0, neededLevel: 1 },
    { id: 'rift', name: 'Stained Rift', environment: 'rift', needed: 8, neededLevel: 10 },
    { id: 'cavern', name: 'Null Cavern', environment: 'cave', needed: 18, neededLevel: 25 },
    { id: 'bay', name: 'Signal Bay', environment: 'bay', needed: 32, neededLevel: 45 }
  ];
  const KEY = 'vl_three_battle_region';
  function current() {
    return regions.find(region => region.id === window.DataByteSession?.profileGet?.(KEY, 'grove')) || regions[0];
  }
  function leadLevel() {
    const session = window.DataByteSession, active = session?.starter?.();
    const lead = session?.party?.().find(item => (item.uid || item.id) === active || item.id === active);
    return Math.max(1, Number(lead?.level) || 1);
  }
  function access(region) {
    const seen = window.DataByteSession?.seen?.().length || 0, level = leadLevel();
    const needed = Math.max(0, Number(region?.needed) || 0), neededLevel = Math.max(1, Number(region?.neededLevel) || 1);
    return { allowed: seen >= needed && level >= neededLevel, seen, level, needed, neededLevel };
  }
  function render() {
    const button = document.getElementById('mapBtn');
    if (button) button.textContent = `WORLD MAP · ${current().name}`;
  }
  // Region selection belongs to the world map. Keep this compatibility bridge
  // for older callers without creating a second region picker.
  function open() { window.DataByteWorldMap?.open?.(); }
  function install() { render(); }
  window.DataByteRegions = { regions, current, open, render, leadLevel, access, speciesByRegion: {} };
  window.addEventListener('DOMContentLoaded', install);
  window.addEventListener('databyte:region-updated', render);
})();
