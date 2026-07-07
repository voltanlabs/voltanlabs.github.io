// assets/js/dd-battle-presentation-runtime.js
// Phase 4.0: presentation layer for battle HUD events, effects, and future animation hooks.
(function () {
  const history = [];
  const MAX_HISTORY = 40;

  function emit(type, detail) {
    const event = { type, detail: detail || {}, at: new Date().toISOString() };
    history.push(event);
    while (history.length > MAX_HISTORY) history.shift();
    document.dispatchEvent(new CustomEvent('dd:presentation-event', { detail: event }));
    return event;
  }

  function classPulse(name, duration) {
    const root = document.getElementById('ddApp');
    if (!root) return;
    const cls = 'present-' + name;
    root.classList.add(cls);
    setTimeout(() => root.classList.remove(cls), duration || 520);
  }

  function floatText(text, kind) {
    if (!text) return;
    const el = document.createElement('div');
    el.className = 'dd-present-float dd-present-' + (kind || 'info');
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  function installStyle() {
    if (document.getElementById('ddBattlePresentationStyle')) return;
    const style = document.createElement('style');
    style.id = 'ddBattlePresentationStyle';
    style.textContent = '.dd-present-float{position:fixed;left:50%;top:38%;transform:translate(-50%,-50%);z-index:1000002;padding:8px 12px;border-radius:999px;background:rgba(7,17,31,.9);border:1px solid rgba(255,215,0,.45);color:#FFD700;font-weight:1000;pointer-events:none;animation:ddPresentFloat .9s ease-out}.present-hit .battle-card{animation:ddPresentShake .24s linear}.present-success .downloadGauge,.present-download .downloadGauge{box-shadow:0 0 30px rgba(255,215,0,.22)}.present-warn .card{box-shadow:0 0 40px rgba(251,113,133,.22)}@keyframes ddPresentFloat{0%{opacity:0;transform:translate(-50%,-20%) scale(.85)}25%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}100%{opacity:0;transform:translate(-50%,-95%) scale(1)}}@keyframes ddPresentShake{0%,100%{transform:none}50%{transform:translateX(4px)}}';
    document.head.appendChild(style);
  }

  function hit(detail) { classPulse('hit', 320); floatText(detail && detail.text || 'Hit', 'hit'); return emit('hit', detail); }
  function heal(detail) { classPulse('heal', 520); floatText(detail && detail.text || 'Repair', 'heal'); return emit('heal', detail); }
  function boost(detail) { classPulse('boost', 520); floatText(detail && detail.text || 'Boost', 'boost'); return emit('boost', detail); }
  function warn(detail) { classPulse('warn', 520); return emit('warn', detail); }
  function success(detail) { classPulse('success', 720); floatText(detail && detail.text || 'Success', 'success'); return emit('success', detail); }
  function download(detail) { classPulse('download', 720); floatText(detail && detail.text || 'Download', 'download'); return emit('download', detail); }
  function signal(detail) { classPulse('signal', 520); return emit('signal', detail); }
  function reset() { history.length = 0; return emit('reset', {}); }
  function getHistory() { return history.slice(); }

  window.addEventListener('dd:battle:hit', (event) => hit(event.detail || {}));
  window.addEventListener('dd:battle:warn', (event) => warn(event.detail || {}));
  window.addEventListener('dd:battle:success', (event) => success(event.detail || {}));
  window.addEventListener('dd:battle:turn', (event) => emit('turn', event.detail || {}));
  document.addEventListener('dd:battle-state-change', (event) => emit('state', event.detail || {}));

  installStyle();
  window.DD_BATTLE_PRESENTATION_RUNTIME = { version: '0.2.0', phase: '4.0-battle-presentation-runtime', emit, hit, heal, boost, warn, success, download, signal, reset, getHistory };
  document.dispatchEvent(new CustomEvent('dd:battle-presentation-runtime-ready', { detail: window.DD_BATTLE_PRESENTATION_RUNTIME }));
})();
