(function () {
  const KEY = 'vl_three_battle_discovery_codes';
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
  function discover() {
    const input = document.getElementById('discoveryCode');
    const status = document.getElementById('scannerStatus');
    const value = input?.value.trim().toUpperCase() || '';
    if (!/^VL-[A-Z0-9]{4,12}$/.test(value)) { if (status) status.textContent = 'Enter a valid code like VL-SIGNAL7.'; return; }
    const codes = read(); if (!codes.includes(value)) { codes.push(value); localStorage.setItem(KEY, JSON.stringify(codes)); }
    if (status) status.textContent = `Code ${value} accepted. Start a scan to lock the signal.`;
  }
  function install() {
    const scanner = document.getElementById('scannerView'); if (!scanner || document.getElementById('discoveryCode')) return;
    const row = document.createElement('div'); row.className = 'discovery-code-row'; row.innerHTML = '<input id="discoveryCode" class="discovery-code" placeholder="VL-SIGNAL7" maxlength="12" aria-label="Discovery code"><button id="discoverCodeBtn" class="ghost" type="button">DISCOVER CODE</button>'; scanner.appendChild(row); document.getElementById('discoverCodeBtn').onclick = discover;
  }
  window.DataByteDiscoveryCodes = { read, discover };
  install(); window.addEventListener('DOMContentLoaded', install);
})();
