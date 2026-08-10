(function () {
  let rewardMarkup = '';
  function returnToScanner(modal) {
    modal.classList.remove('is-open');
    document.getElementById('controlView')?.classList.add('hidden');
    document.getElementById('arenaView')?.classList.add('hidden');
    document.getElementById('encounterView')?.classList.add('hidden');
    document.getElementById('scannerView')?.classList.remove('hidden');
    const scan = document.getElementById('scanBtn');
    if (scan) scan.disabled = false;
  }
  function sync() {
    const modal = document.getElementById('captureModal');
    const state = window.DataByteBattle?.getState?.();
    if (!modal || !state) return;
    const card = modal.querySelector('.capture-card');
    if (state.rewardGranted && card?.querySelector('.eyebrow')?.textContent?.includes('BATTLE REWARDS')) {
      rewardMarkup = modal.innerHTML;
      modal.dataset.rewardLocked = 'true';
    }
    if (modal.dataset.rewardLocked === 'true' && state.rewardGranted && card && /SIGNAL STORED/i.test(card.textContent || '')) {
      modal.innerHTML = rewardMarkup;
      modal.classList.add('is-open');
      modal.querySelector('[data-capture-close]')?.addEventListener('click', () => returnToScanner(modal), { once: true });
    }
  }
  window.setInterval(sync, 40);
})();
