(function () {
  const themes = [['forest', 'PRISTINE GROVE'], ['rift', 'STAINED SIGNAL RIFT'], ['cave', 'NULL DATA CAVERN']];
  let last = '';
  let selected = null;
  function sync() {
    const arena = document.getElementById('arenaView');
    const name = document.getElementById('enemyName')?.textContent?.trim() || '';
    if (!arena || !name || name === last && !selected) return;
    last = name;
    let hash = 0; for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    const [theme, label] = selected || themes[hash % themes.length];
    arena.dataset.environment = theme;
    arena.setAttribute('aria-label', `Three dimensional battle arena · ${label}`);
  }
  window.DataByteEnvironment = { sync };
  window.addEventListener('databyte:region-updated', event => { selected = [event.detail?.environment, event.detail?.name]; last = ''; sync(); });
  window.addEventListener('DOMContentLoaded', () => { sync(); setInterval(sync, 250); });
})();
