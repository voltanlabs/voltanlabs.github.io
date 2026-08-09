(function () {
  const rarityLevel = { Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5, Mythic: 6 };
  function sync() {
    const session = window.DataByteSession;
    if (!session) return;
    const lead = session.party?.().find(item => item.id === session.starter?.());
    const player = document.getElementById('playerLevel');
    if (player) player.textContent = `LV ${session.spriteProgress?.(lead)?.level || lead?.level || 1}`;
    const enemyName = document.getElementById('enemyName')?.textContent?.trim();
    const enemy = session.roster?.().find(item => item.name?.toUpperCase() === enemyName?.toUpperCase());
    const wild = document.getElementById('enemyLevel');
    if (wild) wild.textContent = `LV ${Math.max(1, Number(enemy?.level) || rarityLevel[enemy?.rarity] || 1)}`;
  }
  window.addEventListener('DOMContentLoaded', sync);
  window.addEventListener('databyte:party-updated', sync);
  window.addEventListener('databyte:starter-updated', sync);
  window.addEventListener('databyte:encounter-ready', sync);
  window.setInterval(sync, 250);
})();
