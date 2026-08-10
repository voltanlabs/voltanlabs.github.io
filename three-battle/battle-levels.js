(function () {
  function sync() {
    const session = window.DataByteSession;
    if (!session) return;
    const active = session.starter?.();
    const lead = session.party?.().find(item => (item.uid || item.id) === active || item.id === active);
    const player = document.getElementById('playerLevel');
    const progress = session.spriteProgress?.(lead) || { xp: 0, level: lead?.level || 1, nextXp: 100 };
    if (player) player.textContent = `LV ${progress.level}`;
    const xpBar = document.getElementById('playerXp');
    const xpText = document.getElementById('playerXpText');
    const currentThreshold = progress.level > 1 ? 50 * (progress.level - 1) * progress.level : 0;
    const span = progress.nextXp === null ? 100 : Math.max(0, Math.min(100, ((progress.xp - currentThreshold) / Math.max(1, progress.nextXp - currentThreshold)) * 100));
    if (xpBar) xpBar.style.width = `${span}%`;
    if (xpText) xpText.textContent = progress.nextXp === null ? `${progress.xp} XP · MAX` : `${progress.xp} / ${progress.nextXp} XP`;
    const enemyName = document.getElementById('enemyName')?.textContent?.trim();
    const enemy = session.roster?.().find(item => item.name?.toUpperCase() === enemyName?.toUpperCase());
    const wild = document.getElementById('enemyLevel');
    if (wild) wild.textContent = `LV ${Math.min(100, Math.max(1, Number(window.__threeBattleEncounterLevel) || Number(enemy?.level) || Number(window.__threeBattleAdminLevel) || 1))}`;
  }
  window.addEventListener('DOMContentLoaded', sync);
  window.addEventListener('databyte:party-updated', sync);
  window.addEventListener('databyte:starter-updated', sync);
  window.addEventListener('databyte:encounter-ready', sync);
  window.setInterval(sync, 250);
})();
