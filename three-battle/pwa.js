(function () {
  const VERSION = '0.1.4';
  function addVersionBadge() {
    const topbar = document.querySelector('.topbar');
    if (!topbar || document.getElementById('appVersion')) return;
    const badge = document.createElement('span');
    badge.id = 'appVersion'; badge.className = 'app-version'; badge.textContent = `v${VERSION}`;
    topbar.appendChild(badge);
  }
  let installPrompt;
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); installPrompt = event;
    const button = document.createElement('button');
    button.id = 'installAppBtn'; button.className = 'scan-button'; button.type = 'button'; button.textContent = 'INSTALL APP';
    button.onclick = async () => { if (!installPrompt) return; installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; button.remove(); };
    document.querySelector('.topbar')?.appendChild(button);
  });
  window.addEventListener('appinstalled', () => document.getElementById('installAppBtn')?.remove());
  addVersionBadge(); window.addEventListener('DOMContentLoaded', addVersionBadge);
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js?v=release-0.1.7').catch(function (error) {
      console.warn('DataByte offline shell unavailable.', error);
    });
  });
})();
