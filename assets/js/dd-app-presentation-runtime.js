// Data Discovery v4.10: canonical design tokens, creature portraits, app layout, overlays, and lifecycle presentation.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_APP_PRESENTATION_RUNTIME) return;

  const VERSION = '2.4.0';
  const OWNER = 'dd-app-presentation-runtime';
  const STYLE_ID = 'ddAppPresentationStyle';
  let switchOpen = false;

  const $ = id => document.getElementById(id);
  const player = () => window.DD_PLAYER_RUNTIME;
  const shell = () => window.DD_PRODUCT_APP_V4_SHELL;
  const esc = value => String(value ?? '').replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
  const TOKENS = Object.freeze({
    color: Object.freeze({
      canvas: '#07111F', canvasDeep: '#020617', surface: '#0F172A', surfaceRaised: '#13213A',
      border: 'rgba(125,211,252,.22)', borderStrong: 'rgba(125,211,252,.42)',
      text: '#F8FAFC', textMuted: '#BAE6FD', primary: '#38BDF8', primaryStrong: '#007BFF',
      accent: '#FFD700', success: '#22C55E', warning: '#FACC15', danger: '#FB7185',
      rare: '#A78BFA', epic: '#F472B6'
    }),
    radius: Object.freeze({ small: '12px', medium: '16px', large: '22px', round: '999px' }),
    space: Object.freeze({ xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px' }),
    portrait: Object.freeze({ small: '64px', medium: '116px', large: '168px' }),
    background: Object.freeze({
      trainingRoom: '/assets/backgrounds/volt-training-room.png',
      archiveGrid: '/assets/backgrounds/volt-archive-grid.png',
      volatileRift: '/assets/backgrounds/volt-volatile-rift.png',
      deepSignalBay: '/assets/backgrounds/volt-deep-signal-bay.png'
    }),
    motion: Object.freeze({ fast: '180ms', standard: '280ms', slow: '560ms' })
  });
  const BACKGROUND_REGISTRY = Object.freeze({
    trainingRoom: Object.freeze({ id: 'training-room', asset: TOKENS.background.trainingRoom }),
    archiveGrid: Object.freeze({ id: 'archive-grid', asset: TOKENS.background.archiveGrid }),
    volatileRift: Object.freeze({ id: 'volatile-rift', asset: TOKENS.background.volatileRift }),
    deepSignalBay: Object.freeze({ id: 'deep-signal-bay', asset: TOKENS.background.deepSignalBay })
  });

  function safeAsset(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    try {
      const origin = location && location.origin || 'http://localhost';
      const url = new URL(raw, origin);
      return url.origin === origin && url.pathname.startsWith('/assets/sprites/') ? url.href : '';
    } catch {
      return '';
    }
  }

  function safeSheet(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    try {
      const origin = location && location.origin || 'http://localhost';
      const url = new URL(raw, origin);
      return url.origin === origin && url.pathname.startsWith('/assets/spritesheets/') ? url.href : '';
    } catch {
      return '';
    }
  }

  function rarityClass(value) {
    const rarity = String(value || 'common').toLowerCase();
    if (rarity === 'legendary' || rarity === 'mythic') return 'legendary';
    if (rarity === 'epic') return 'epic';
    if (rarity === 'rare') return 'rare';
    if (rarity === 'starter') return 'starter';
    return 'common';
  }

  function renderVisual(sprite, options) {
    const value = sprite || {};
    const opts = options || {};
    const asset = safeAsset(value.spriteAsset || value.asset);
    const sheet = value.spriteSheet || null;
    const sheetAsset = sheet && safeSheet(sheet.sheet);
    const className = ['dd-creature-visual', opts.className || ''].filter(Boolean).join(' ');
    if (sheetAsset) {
      const columns = Math.max(1, Number(sheet.columns || 1));
      const rows = Math.max(1, Number(sheet.rows || 1));
      return '<span class="' + esc(className + ' dd-sprite-sheet') + '" style="--dd-sheet-url:url(\'' + esc(sheetAsset) + '\');--dd-sheet-cols:' + columns + ';--dd-sheet-rows:' + rows + '" role="img" aria-label="' + esc(opts.decorative ? '' : value.name || 'DataByte Sprite') + '"></span>';
    }
    return asset
      ? '<img class="' + esc(className) + '" src="' + esc(asset) + '" alt="' + esc(opts.decorative ? '' : value.name || 'DataByte Sprite') + '"' + (opts.decorative ? ' aria-hidden="true"' : '') + '>'
      : '<span class="' + esc(className + ' dd-creature-fallback') + '" aria-hidden="true">' + esc(value.icon || '◇') + '</span>';
  }

  function renderPortrait(sprite, options) {
    const value = sprite || {};
    const opts = options || {};
    const size = ['small', 'medium', 'large'].includes(opts.size) ? opts.size : 'medium';
    const rarity = rarityClass(opts.rarity || value.rarity);
    const className = ['dd-creature-portrait', 'dd-portrait-' + size, 'dd-rarity-' + rarity, opts.className || ''].filter(Boolean).join(' ');
    const label = opts.label === false ? '' : ' aria-label="' + esc(value.name || 'DataByte Sprite') + '"';
    return '<div class="' + esc(className) + '"' + label + '>' + renderVisual(value, { decorative: opts.label !== false }) + '</div>';
  }

  const portraits = Object.freeze({ safeAsset, safeSheet, rarityClass, renderVisual, renderPortrait });

  function resolveBackground(encounter) {
    const value = encounter || {};
    const pool = String(value.encounterPool || value.encounterPoolLabel || '').toLowerCase();
    const key = pool.includes('archive')
      ? 'archiveGrid'
      : pool.includes('volatile') || pool.includes('corrupt')
        ? 'volatileRift'
        : pool.includes('fallback')
          ? 'deepSignalBay'
          : 'trainingRoom';
    const selected = BACKGROUND_REGISTRY[key];
    return Object.freeze({
      id: selected.id,
      asset: selected.asset,
      theme: key === 'archiveGrid' ? 'archive' : key === 'volatileRift' ? 'volatile' : key === 'deepSignalBay' ? 'fallback' : 'standard'
    });
  }

  const backgrounds = Object.freeze({
    registry: BACKGROUND_REGISTRY,
    resolve: resolveBackground
  });

  function playTurn(result) {
    if (!result || !Array.isArray(result.actions)) return;
    result.actions.forEach((action, index) => {
      const actorSelector = action.mode === 'player' ? '.fighter.lead' : '.fighter.wild';
      const targetSelector = action.mode === 'player' ? '.fighter.wild' : '.fighter.lead';
      const delay = index * 110;
      setTimeout(() => {
        const actor = document.querySelector(actorSelector);
        const target = document.querySelector(targetSelector);
        if (actor) actor.classList.add('dd-attacking');
        if (target && action.hit) target.classList.add('dd-hit');
        if (target && action.fainted) target.classList.add('dd-fainted');
        setTimeout(() => {
          if (actor) actor.classList.remove('dd-attacking');
          if (target) target.classList.remove('dd-hit');
        }, 260);
      }, delay);
    });
  }

  function afterRender(effect) {
    if (effect !== 'discover') return;
    const root = $('ddApp');
    if (!root) return;
    root.classList.remove('dd-discovery-running');
    void root.offsetWidth;
    root.classList.add('dd-discovery-running');
    setTimeout(() => root.classList.remove('dd-discovery-running'), 1900);
  }

  const effects = Object.freeze({ playTurn, afterRender });

  function installStyle() {
    if ($(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      ':root{--dd-canvas:#07111F;--dd-canvas-deep:#020617;--dd-surface:#0F172A;--dd-surface-raised:#13213A;--dd-border:rgba(125,211,252,.22);--dd-border-strong:rgba(125,211,252,.42);--dd-text:#F8FAFC;--dd-text-muted:#BAE6FD;--dd-primary:#38BDF8;--dd-primary-strong:#007BFF;--dd-accent:#FFD700;--dd-success:#22C55E;--dd-warning:#FACC15;--dd-danger:#FB7185;--dd-rare:#A78BFA;--dd-epic:#F472B6;--dd-radius-sm:12px;--dd-radius-md:16px;--dd-radius-lg:22px;--dd-radius-round:999px;--dd-space-xs:4px;--dd-space-sm:8px;--dd-space-md:12px;--dd-space-lg:16px;--dd-space-xl:24px;--dd-portrait-sm:64px;--dd-portrait-md:116px;--dd-portrait-lg:168px;--dd-battle-bg-training:url("/assets/backgrounds/volt-training-room.png");--dd-motion-fast:180ms;--dd-motion-standard:280ms;--dd-motion-slow:560ms}',
      'html,body{height:100%;min-height:100%;overflow:hidden;position:fixed;inset:0;width:100%;overscroll-behavior:none;touch-action:manipulation}',
      '#ddApp{height:100dvh;max-height:100dvh;overflow:hidden;color:var(--dd-text);background:var(--dd-canvas)}',
      '#ddApp .card,#ddApp #controls,#ddApp .top,#ddApp .nav button{border-color:var(--dd-border);background-color:color-mix(in srgb,var(--dd-canvas) 88%,transparent);border-radius:var(--dd-radius-lg)}',
      '#ddApp h1,#ddApp h2{color:var(--dd-primary)}',
      '#ddApp .hint,#ddApp .log{color:var(--dd-text-muted)}',
      '#ddApp .gold{background:var(--dd-accent)!important;color:#111827!important}',
      '.dd-creature-portrait{--dd-portrait-size:var(--dd-portrait-md);--dd-rarity-color:var(--dd-primary);width:var(--dd-portrait-size);height:var(--dd-portrait-size);border-radius:var(--dd-radius-round);display:grid;place-items:center;overflow:hidden;position:relative;background:radial-gradient(circle at 50% 42%,var(--dd-surface-raised),var(--dd-canvas) 72%);border:6px solid var(--dd-rarity-color);box-shadow:0 0 30px color-mix(in srgb,var(--dd-rarity-color) 32%,transparent);box-sizing:border-box}',
      '.dd-creature-portrait.dd-portrait-small{--dd-portrait-size:var(--dd-portrait-sm);border-width:3px}',
      '.dd-creature-portrait.dd-portrait-large{--dd-portrait-size:var(--dd-portrait-lg);border-width:7px}',
      '.dd-creature-portrait.dd-rarity-rare{--dd-rarity-color:var(--dd-rare)}',
      '.dd-creature-portrait.dd-rarity-epic{--dd-rarity-color:var(--dd-epic)}',
      '.dd-creature-portrait.dd-rarity-legendary{--dd-rarity-color:var(--dd-accent)}',
      '.dd-creature-portrait.dd-rarity-starter{--dd-rarity-color:var(--dd-success)}',
      '.dd-creature-visual{width:92%;height:92%;object-fit:contain;border-radius:var(--dd-radius-round)}',
      '.dd-sprite-sheet{display:block;width:92%;height:92%;background-image:var(--dd-sheet-url);background-size:calc(var(--dd-sheet-cols)*100%) calc(var(--dd-sheet-rows)*100%);background-position:0 0;background-repeat:no-repeat}',
      '.dd-creature-fallback{display:grid;place-items:center;font-size:clamp(30px,10vw,72px);line-height:1}',
      '#ddApp .stage{min-height:0;overflow:hidden;overscroll-behavior:contain}',
      '#ddApp .stage[data-screen="scanner"],#ddApp .stage[data-screen="encounter"]{position:relative;background:radial-gradient(circle at 50% 36%,rgba(56,189,248,.12),transparent 34%),linear-gradient(rgba(56,189,248,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,.08) 1px,transparent 1px);background-size:100% 100%,22px 22px,22px 22px}',
      '#ddApp .stage[data-screen="scanner"]:before,#ddApp .stage[data-screen="encounter"]:before{content:"";position:absolute;left:0;right:0;top:-10%;height:18%;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(255,215,0,.22),rgba(56,189,248,.12),transparent);filter:blur(1px);animation:ddPresentationScanSweep 4.8s linear infinite;z-index:0}',
      '#ddApp .stage[data-screen="scanner"]>.card,#ddApp .stage[data-screen="encounter"]>.card{position:relative;z-index:1}',
      '#ddApp.dd-discovery-running #controls{pointer-events:none;opacity:.58}',
      '#ddApp .scannerOrb:before,#ddApp .scannerOrb:after{animation:ddPresentationRingSpin 12s linear infinite}',
      '#ddApp .scannerOrb:after{animation-direction:reverse;animation-duration:18s}',
      '@keyframes ddPresentationScanSweep{from{transform:translateY(-30%)}to{transform:translateY(620%)}}',
      '@keyframes ddPresentationRingSpin{to{transform:rotate(360deg)}}',
      '@media(prefers-reduced-motion:reduce){#ddApp .stage[data-screen="scanner"]:before,#ddApp .stage[data-screen="encounter"]:before,#ddApp .scannerOrb:before,#ddApp .scannerOrb:after{animation:none!important}#ddApp.dd-discovery-running #controls{pointer-events:auto;opacity:1}}',
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
    phase: '6.3.0-data-line-portals',
    tokens: TOKENS,
    portraits,
    backgrounds,
    effects,
    installStyle,
    showPartySwitch,
    hidePartySwitch,
    isPartySwitchOpen: () => switchOpen
  });
  window.DD_PARTY_SWITCH_UI = Object.freeze({ show: showPartySwitch, hide: hidePartySwitch, isOpen: () => switchOpen, owner: OWNER, version: VERSION });
  boot();
  document.dispatchEvent(new CustomEvent('dd:app-presentation-runtime-ready', { detail: window.DD_APP_PRESENTATION_RUNTIME }));
})();
