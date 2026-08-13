(function () {
  const escapeHtml = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const spriteUrl = value => {
    const sprite = String(value || '').trim();
    if (!sprite || /(^|\/)placeholder\.png(?:[?#].*)?$/i.test(sprite)) return './data/sprites/placeholder.png';
    return /^(?:\.\/|\.\.\/|\/|https?:\/\/|data:|blob:)/i.test(sprite) ? sprite : `./data/sprites/${sprite}`;
  };
  const configurationFor = item => item.configurations && item.configurations.join(' / ') || item.primaryConfiguration || item.configuration || 'Unassigned';

  function openRecord(item, isSeen, captureCount) {
    let modal = document.getElementById('dexRecordModal');
    if (!modal) { modal = document.createElement('div'); modal.id = 'dexRecordModal'; modal.className = 'capture-modal'; document.body.appendChild(modal); }
    const visibleName = isSeen ? item.name : 'Unknown Signal';
    const description = isSeen ? (item.description || item.lore || 'Signal record pending.') : 'Scan this signal to reveal its record.';
    const details = isSeen ? `<div class="dex-detail-stats"><span>ALIGNMENT <b>${escapeHtml(item.alignment || 'Unassigned')}</b></span><span>TYPE <b>${escapeHtml(configurationFor(item))}</b></span><span>RARITY <b>${escapeHtml(item.rarity || 'Common')}</b></span><span>CAUGHT <b>${captureCount}</b></span><span>FAMILY <b>${escapeHtml(item.familyId || 'Unassigned')}</b></span><span>FORM <b>${escapeHtml(item.version || 'Base Form')}</b></span>${item.zodiac ? `<span>ZODIAC <b>${escapeHtml(item.zodiac)}</b></span>` : ''}</div>` : '';
    modal.innerHTML = `<div class="capture-card dex-detail-card"><button class="party-info-close ghost" data-dex-close type="button">CLOSE</button><span class="eyebrow">DATABYTEDex // SPECIES RECORD</span><img class="dex-detail-sprite" src="${escapeHtml(isSeen ? spriteUrl(item.sprite) : './data/sprites/placeholder.png')}" alt="${escapeHtml(visibleName)}"><h2>${escapeHtml(visibleName)}</h2><p class="dex-detail-number">#${escapeHtml(item.dex || '???')} - ${isSeen ? 'RECORD UNLOCKED' : 'SCAN REQUIRED'}</p>${details}<p class="dex-detail-description">${escapeHtml(description)}</p><button class="scan-button" data-dex-close type="button">RETURN TO DEX</button></div>`;
    modal.classList.add('is-open');
    modal.querySelectorAll('[data-dex-close]').forEach(button => { button.onclick = () => modal.classList.remove('is-open'); });
  }

  function render() {
    const view = document.getElementById('dexView');
    const data = window.THREE_BATTLE_DATA && window.THREE_BATTLE_DATA.species || [];
    const session = window.DataByteSession;
    if (!view || !session || !data.length) return;
    let host = document.getElementById('dexRecords');
    if (!host) { host = document.createElement('div'); host.id = 'dexRecords'; view.appendChild(host); }
    const seen = new Set(session.seen().map(item => typeof item === 'string' ? item : item && item.id).filter(Boolean));
    const owned = session.party().concat(session.repository());
    const capturedCounts = owned.reduce((counts, item) => {
      const speciesId = item && (item.speciesId || item.id);
      if (speciesId) counts.set(speciesId, (counts.get(speciesId) || 0) + 1);
      return counts;
    }, new Map());
    const searchInput = document.getElementById('dexSearch');
    const query = String(searchInput ? searchInput.value : '').trim().toLowerCase();
    const filtered = data.filter(item => item.id !== 'placeholder' && (!query || [item.name, item.familyId, item.alignment, item.primaryConfiguration, item.version, item.zodiac].some(value => String(value || '').toLowerCase().includes(query))));
    host.innerHTML = filtered.map(item => {
      const isSeen = seen.has(item.id), captureCount = capturedCounts.get(item.id) || 0, isCaptured = captureCount > 0;
      const status = isCaptured ? 'CAPTURED' : isSeen ? 'SEEN' : 'UNKNOWN';
      const sprite = isSeen ? spriteUrl(item.sprite) : './data/sprites/placeholder.png';
      const count = isCaptured ? ` - ${captureCount} caught` : '';
      return `<button class="dex-record ${status.toLowerCase()}" data-dex-id="${escapeHtml(item.id)}" type="button"><img src="${escapeHtml(sprite)}" loading="${isSeen ? 'lazy' : 'eager'}" decoding="async" fetchpriority="low" alt="${escapeHtml(isSeen ? item.name : 'Unknown Signal')}"><span><strong>#${escapeHtml(item.dex || '???')} ${escapeHtml(isSeen ? item.name : 'Unknown Signal')}</strong><small>${status} - ${escapeHtml(item.rarity || 'Common')} - ${escapeHtml(item.alignment || 'Unassigned')}${count}</small><span class="dex-record-description">${escapeHtml(isSeen ? (item.lore || item.description || 'Signal record pending.') : 'Tap to view record status.')}</span></span></button>`;
    }).join('');
    host.querySelectorAll('[data-dex-id]').forEach(button => button.addEventListener('click', () => {
      const item = data.find(entry => entry.id === button.dataset.dexId);
      if (item) openRecord(item, seen.has(item.id), capturedCounts.get(item.id) || 0);
    }));
  }
  window.addEventListener('DOMContentLoaded', render);
  ['databyte:dex-updated', 'databyte:party-updated'].forEach(event => window.addEventListener(event, render));
  document.addEventListener('input', event => { if (event.target && event.target.id === 'dexSearch') render(); });
  window.DataByteDexDetails = { render };
})();
