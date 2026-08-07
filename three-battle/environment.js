(function () {
  const themes = [['forest', 'PRISTINE GROVE'], ['rift', 'STAINED SIGNAL RIFT'], ['cave', 'NULL DATA CAVERN']];
  let last = '';
  function sync() {
    const arena = document.getElementById('arenaView');
    const name = document.getElementById('enemyName')?.textContent?.trim() || '';
    if (!arena || !name || name === last) return;
    last = name;
    let hash = 0; for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    const [theme, label] = themes[hash % themes.length];
    arena.dataset.environment = theme;
    arena.setAttribute('aria-label', `Three dimensional battle arena · ${label}`);
  }
  window.DataByteEnvironment = { sync };
  window.addEventListener('DOMContentLoaded', () => { sync(); setInterval(sync, 250); });
})();
