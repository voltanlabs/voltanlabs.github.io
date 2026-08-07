(function () {
  document.addEventListener('click', event => {
    if (event.target?.id !== 'captureRetryBtn') return;
    event.preventDefault();
    const modal = document.getElementById('captureModal');
    const result = window.DataByteBattle?.capture?.();
    if (!modal || !result) return;
    if (result.ok) {
      modal.innerHTML = '<div class="capture-card"><span class="eyebrow">SIGNAL STORED</span><h2>Signal captured</h2><p>Your party storage has been updated.</p><button class="scan-button" data-capture-close>CONTINUE SCANNING</button></div>';
      modal.querySelector('[data-capture-close]').onclick = () => { modal.classList.remove('is-open'); document.getElementById('controlView')?.classList.add('hidden'); document.getElementById('arenaView')?.classList.add('hidden'); document.getElementById('encounterView')?.classList.add('hidden'); document.getElementById('scannerView')?.classList.remove('hidden'); document.getElementById('scanBtn').disabled = false; };
    } else {
      const message = modal.querySelector('p');
      if (message) message.textContent = `The signal broke free again (${result.chance || 45}% capture chance). Try again.`;
    }
  }, true);
})();
