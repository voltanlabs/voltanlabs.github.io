(function () {
  const rarityLevel = { Common: 10, Uncommon: 30, Rare: 50, Epic: 68, Legendary: 83, Mythic: 96 };
  function sync() {
    const session = window.DataByteSession;
    if (!session) return;
    const lead = session.party?.().find(item => item.id === session.starter?.());
    const player = document.getElementById('playerLevel');
    if (player) player.textContent = `LV ${session.spriteProgress?.(lead)?.level || lead?.level || 1}`;
    const enemyName = document.getElementById('enemyName')?.textContent?.trim();
    const enemy = session.roster?.().find(item => item.name?.toUpperCase() === enemyName?.toUpperCase());
    const wild = document.getElementById('enemyLevel');
    if (wild) wild.textContent = `LV ${Math.min(100, Math.max(1, Number(window.__threeBattleEncounterLevel) || Number(enemy?.level) || rarityLevel[enemy?.rarity] || 1))}`;
  }
  window.addEventListener('DOMContentLoaded', sync);
  window.addEventListener('databyte:party-updated', sync);
  window.addEventListener('databyte:starter-updated', sync);
  window.addEventListener('databyte:encounter-ready', sync);
  window.setInterval(sync, 250);
})();
