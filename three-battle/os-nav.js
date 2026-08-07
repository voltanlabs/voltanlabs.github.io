(function () {
  const app = document.getElementById('app');
  if (!app) return;

  const nav = document.createElement('nav');
  nav.className = 'os-nav';
  nav.innerHTML = '<button data-os="scanner">⌖<small>SCAN</small></button><button data-os="party">◈<small>PARTY</small></button><button data-os="dex">▣<small>DEX</small></button><button data-os="mission">★<small>MISSIONS</small></button>';
  document.body.appendChild(nav);

  const modal = document.createElement('div');
  modal.className = 'os-modal hidden';
  modal.innerHTML = '<div class="os-modal-card"><button class="os-close">CLOSE</button><div class="os-modal-body"></div></div>';
  document.body.appendChild(modal);

  const body = modal.querySelector('.os-modal-body');
  let moved = null;
  const footer = () => app.querySelector('footer');
  const restorePanels = () => [...body.children].forEach(panel => app.insertBefore(panel, footer()));

  function close() {
    restorePanels();
    moved = null;
    modal.classList.add('hidden');
    body.replaceChildren();
  }

  function showScanner() {
    close();
    ['encounterView', 'arenaView', 'controlView'].forEach(id => document.getElementById(id)?.classList.add('hidden'));
    document.getElementById('scannerView')?.classList.remove('hidden');
    const scan = document.getElementById('scanBtn');
    if (scan) scan.disabled = false;
    const progress = document.getElementById('scanProgress');
    if (progress) progress.style.width = '0%';
    const status = document.getElementById('scannerStatus');
    if (status) status.textContent = 'No active signal locked. Start a scan to discover a DataByte.';
  }

  function open(id) {
    if (id === 'scanner') return showScanner();
    const source = document.getElementById(id + 'View');
    if (!source) return;
    close();
    moved = source;
    body.appendChild(source);
    modal.classList.remove('hidden');
  }

  nav.onclick = event => {
    const button = event.target.closest('[data-os]');
    if (button) open(button.dataset.os);
  };
  modal.querySelector('.os-close').onclick = close;
})();
