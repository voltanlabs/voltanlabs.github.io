// Data Discovery v4.9: canonical app layout, overlays, and lifecycle presentation.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_APP_PRESENTATION_RUNTIME) return;

  const VERSION = '1.0.0';
  const OWNER = 'dd-app-presentation-runtime';
  const STYLE_ID = 'ddAppPresentationStyle';
  let switchOpen = false;

  const $ = id => document.getElementById(id);
  const player = () => window.DD_PLAYER_RUNTIME;
  const shell = () => window.DD_PRODUCT_APP_V4_SHELL;
  const esc = value => String(value ?? '').replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));

  function installStyle() {
    if ($(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      'html,body{height:100%;min-height:100%;overflow:hidden;position:fixed;inset:0;width:100%;overscroll-behavior:none;touch-action:manipulation}',
      '#ddApp{height:100dvh;max-height:100dvh;overflow:hidden}',
      '#ddApp .stage{min-height:0;overflow:hidden;overscroll-behavior:contain}',
      '#ddApp .controls{overflow:auto;overscroll-behavior:contain}',
      '.dd-switch-panel{position:fixed;inset:10px;z-index:1000003;background:rgba(7,17,31,.98);border:1px solid rgba(125,211,252,.28);border-radius:24px;padding:14px;color:white;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:10px}',
      '.dd-switch-head{display:flex;justify-content:space-between;gap:10px;align-items:center}.dd-switch-head b{color:#FFD700}',
      '.dd-switch-list{overflow:auto;display:grid;gap:8px}.dd-switch-card{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:10px;background:rgba(15,23,42,.82)}',
      '.dd-switch-card.active{border-color:rgba(255,215,0,.75)}.dd-switch-card.disabled{opacity:.48}.dd-switch-meta{display:grid;gap:3px;min-width:0}.dd-switch-meta strong{color:#38BDF8}.dd-switch-meta span{font-size:12px;color:#BAE6FD}',
      '.dd-switch-card button,.dd-switch-close{border:0;border-radius:14px;padding:10px 12px;font-weight:900}.dd-switch-card button{background:#FFD700;color:#111827}.dd-switch-card button:disabled{background:#334155;color:#94A3B8}.dd-switch-close{background:#0F172A;color:white}',
      '.dd-switch-note{font-size:12px;color:#BAE6FD;line-height:1.35}'
    ].join('');
    document.head.appendChild(style);
  }

  function inBattle() { return !!(shell() && shell().state && shell().state.screen === 'battle'); }
  function members() { return player() ? player().party.members() : []; }
  function activeSlot() { return player() ? Number(player().partySwitch.getActive() || 0) : 0; }
  function healthy(member) { return !!(member && Number(member.hp || 0) > 0); }

  function hidePartySwitch() {
    switchOpen = false;
    const panel = $('ddPartySwitchPanel');
    if (panel) panel.remove();
  }

  function chooseParty(index) {
    const runtime = player();
    const list = members();
    if (!runtime || !runtime.partySwitch.canSwitch(list, index)) return;
    runtime.partySwitch.setActive(index);
    hidePartySwitch();
    if (shell() && shell().render) shell().render();
  }

  function showPartySwitch(required) {
    if (!inBattle() && !required) return;
    installStyle();
    switchOpen = true;
    let panel = $('ddPartySwitchPanel');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'ddPartySwitchPanel';
      panel.className = 'dd-switch-panel';
      ($('ddApp') || document.body).appendChild(panel);
    }
    const list = members();
    const current = activeSlot();
    panel.innerHTML = '<div class="dd-switch-head"><b>' + (required ? 'Switch Required' : 'Switch Party') + '</b><button class="dd-switch-close" ' + (required ? 'disabled' : '') + '>Close</button></div><div class="dd-switch-list">' + list.map((member, index) => {
      const ready = healthy(member) && index !== current;
      return '<article class="dd-switch-card ' + (index === current ? 'active ' : '') + (!healthy(member) ? 'disabled' : '') + '"><div class="dd-switch-meta"><strong>' + esc(member.name || 'Unknown') + '</strong><span>HP ' + Number(member.hp || 0) + '/' + Number(member.maxHp || member.hp || 0) + (index === current ? ' • Active' : healthy(member) ? ' • Ready' : ' • Fainted') + '</span></div><button data-switch-index="' + index + '" ' + (ready ? '' : 'disabled') + '>' + (index === current ? 'Active' : healthy(member) ? 'Switch' : 'Fainted') + '</button></article>';
    }).join('') + '</div><p class="dd-switch-note">Choose a ready party member. Fainted sprites cannot be sent out.</p>';
    const close = panel.querySelector('.dd-switch-close');
    if (close) close.onclick = hidePartySwitch;
    panel.querySelectorAll('[data-switch-index]').forEach(button => { button.onclick = () => chooseParty(Number(button.dataset.switchIndex)); });
  }

  function preventPageScroll(event) {
    const allowed = event.target && event.target.closest && event.target.closest('.controls,.battleLog,.dd-switch-list');
    if (!allowed) event.preventDefault();
  }

  function boot() {
    installStyle();
    document.addEventListener('touchmove', preventPageScroll, { passive: false });
    document.addEventListener('click', event => {
      const button = event.target && event.target.closest && event.target.closest('[data-action="switch"]');
      if (!button || !inBattle()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      showPartySwitch(false);
    }, true);
    document.addEventListener('dd:open-party-switch', () => showPartySwitch(false));
    document.addEventListener('dd:party-switch-required', () => showPartySwitch(true));
    document.addEventListener('dd:party-switch', hidePartySwitch);
  }

  window.DD_APP_PRESENTATION_RUNTIME = Object.freeze({
    version: VERSION,
    owner: OWNER,
    phase: '4.9-canonical-app-presentation',
    installStyle,
    showPartySwitch,
    hidePartySwitch,
    isPartySwitchOpen: () => switchOpen
  });
  window.DD_PARTY_SWITCH_UI = Object.freeze({ show: showPartySwitch, hide: hidePartySwitch, isOpen: () => switchOpen, owner: OWNER, version: VERSION });
  boot();
  document.dispatchEvent(new CustomEvent('dd:app-presentation-runtime-ready', { detail: window.DD_APP_PRESENTATION_RUNTIME }));
})();
