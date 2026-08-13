(function () {
  const escapeHtml = value => String(value ?? '').replace(/[&<>\"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const spriteUrl = value => {
    const sprite = String(value || '').trim();
    if (!sprite || /(^|\/)placeholder\.png(?:[?#].*)?$/i.test(sprite)) return './data/sprites/placeholder.png';
    return /^(?:\.\/|\.\.\/|\/|https?:\/\/|data:|blob:)/i.test(sprite) ? sprite : `./data/sprites/${sprite}`;
  };
  function render() {
    const view = document.getElementById('dexView');
    const data = window.THREE_BATTLE_DATA?.species || [];
    const session = window.DataByteSession;
    if (!view || !session || !data.length) return;
    let host = document.getElementById('dexRecords');
    if (!host) { host = document.createElement('div'); host.id = 'dexRecords'; view.appendChild(host); }
    const seen = new Set(session.seen().map(item => typeof item === 'string' ? item : item?.id).filter(Boolean));
    const owned = session.party().concat(session.repository());
    const capturedCounts = owned.reduce((counts, item) => {
      const speciesId = item?.speciesId || item?.id;
      if (speciesId) counts.set(speciesId, (counts.get(speciesId) || 0) + 1);
      return counts;
    }, new Map());
    host.innerHTML = data.filter(item => item.id !== 'placeholder').map(item => {
      const isSeen = seen.has(item.id), captureCount = capturedCounts.get(item.id) || 0, isCaptured = captureCount > 0;
      const status = isCaptured ? 'CAPTURED' : isSeen ? 'SEEN' : 'UNKNOWN';
      const sprite = isSeen ? spriteUrl(item.sprite) : './data/sprites/placeholder.png';
      const count = isCaptured ? ` · ${captureCount} instance${captureCount === 1 ? '' : 's'}` : '';
      return `<article class="dex-record ${status.toLowerCase()}"><img src="${escapeHtml(sprite)}" loading="${isSeen ? 'lazy' : 'eager'}" decoding="async" fetchpriority="low" alt="${escapeHtml(isSeen ? item.name : 'Unknown Signal')}"><div><strong>#${escapeHtml(item.dex || '???')} ${escapeHtml(isSeen ? item.name : 'Unknown Signal')}</strong><small>${status} · ${escapeHtml(item.rarity || 'Common')} · ${escapeHtml(item.alignment || 'Unassigned')}${count}</small><p>${escapeHtml(isSeen ? (item.lore || item.description || 'Signal record pending.') : 'Scan this signal to reveal its record.')}</p></div></article>`;
    }).join('');
  }
  window.addEventListener('DOMContentLoaded', render);
  ['databyte:dex-updated', 'databyte:party-updated'].forEach(event => window.addEventListener(event, render));
  window.DataByteDexDetails = { render };
})();
