(function () {
  function render() {
    const view = document.getElementById('dexView');
    const data = window.THREE_BATTLE_DATA?.species || [];
    const session = window.DataByteSession;
    if (!view || !session || !data.length) return;
    let host = document.getElementById('dexRecords');
    if (!host) { host = document.createElement('div'); host.id = 'dexRecords'; view.appendChild(host); }
    const seen = new Set(session.seen().map(item => typeof item === 'string' ? item : item.id));
    const captured = new Set(session.party().concat(session.repository()).map(item => item.id));
    host.innerHTML = data.filter(item => item.id !== 'placeholder').map(item => {
      const isSeen = seen.has(item.id), isCaptured = captured.has(item.id);
      const status = isCaptured ? 'CAPTURED' : isSeen ? 'SEEN' : 'UNKNOWN';
      const sprite = item.sprite && item.sprite !== 'placeholder.png' ? `./data/sprites/${item.sprite}` : './data/sprites/placeholder.png';
      return `<article class="dex-record ${status.toLowerCase()}"><img src="${sprite}" alt=""><div><strong>#${item.dex || '???'} ${isSeen ? item.name : 'Unknown Signal'}</strong><small>${status} · ${item.rarity || 'Common'} · ${item.alignment || 'Unassigned'}</small><p>${isSeen ? (item.lore || item.description || 'Signal record pending.') : 'Scan this signal to reveal its record.'}</p></div></article>`;
    }).join('');
  }
  window.addEventListener('DOMContentLoaded', render);
  ['databyte:dex-updated', 'databyte:party-updated'].forEach(event => window.addEventListener(event, render));
  window.DataByteDexDetails = { render };
})();
