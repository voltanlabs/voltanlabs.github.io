(function () {
  let timer = 0;
  let suppressClickUntil = 0;
  let pressedButton = null;

  function closeInfo() {
    document.getElementById('moveInfoModal')?.remove();
  }

  function showInfo(button) {
    const name = button.querySelector('b')?.textContent?.trim() || 'Move details';
    const details = button.querySelector('span')?.textContent?.trim() || '';
    const modal = document.createElement('div');
    modal.id = 'moveInfoModal';
    modal.className = 'capture-modal is-open move-info-modal';
    modal.innerHTML = `<div class="capture-card move-info-card"><span class="eyebrow">MOVE DATA // DETAILS</span><h2>${name}</h2><p>${details}</p><button class="scan-button move-info-close" type="button">BACK TO COMMAND DECK</button></div>`;
    document.body.appendChild(modal);
    modal.querySelectorAll('.move-info-close').forEach(close => close.addEventListener('click', closeInfo));
    modal.addEventListener('click', event => { if (event.target === modal) closeInfo(); });
  }

  function clearPress() {
    clearTimeout(timer);
    timer = 0;
    pressedButton = null;
  }

  window.addEventListener('DOMContentLoaded', () => {
    const actions = document.getElementById('actions');
    if (!actions) return;
    actions.addEventListener('pointerdown', event => {
      const button = event.target.closest('.action');
      if (!button) return;
      pressedButton = button;
      timer = window.setTimeout(() => {
        if (pressedButton !== button) return;
        suppressClickUntil = Date.now() + 700;
        showInfo(button);
      }, 550);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => actions.addEventListener(type, clearPress));
    document.addEventListener('click', event => {
      if (Date.now() < suppressClickUntil && event.target.closest('.action')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        suppressClickUntil = 0;
      }
    }, true);
  });
})();
