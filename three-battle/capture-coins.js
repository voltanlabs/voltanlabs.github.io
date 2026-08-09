(function () {
  function sync() {
    const modal = document.getElementById('captureModal');
    const card = modal?.querySelector('.capture-card');
    if (!modal?.classList.contains('is-open') || !card) return;
    const coins = window.DataByteSession?.coins?.() ?? 0;
    let balance = card.querySelector('[data-capture-coins]');
    if (!balance) { balance = document.createElement('small'); balance.dataset.captureCoins = 'true'; balance.className = 'capture-coin-balance'; card.appendChild(balance); }
    const label = `DataByteCoins available: ${coins}`;
    if (balance.textContent !== label) balance.textContent = label;
    const retry = card.querySelector('#captureRetryBtn');
    if (retry && coins < 1) {
      retry.remove();
      const note = document.createElement('p'); note.className = 'party-info-message'; note.textContent = 'No DataByteCoins remain. Return to the scanner for another signal.'; card.insertBefore(note, card.querySelector('[data-capture-close]') || null);
    }
  }
  function install() {
    const modal = document.getElementById('captureModal');
    if (!modal || modal.dataset.coinSync) return;
    modal.dataset.coinSync = 'true';
    new MutationObserver(sync).observe(modal, { childList: true, subtree: true, attributes: true });
    window.addEventListener('databyte:coins-updated', sync);
    sync();
  }
  window.addEventListener('DOMContentLoaded', install);
  window.setInterval(install, 250);
})();
