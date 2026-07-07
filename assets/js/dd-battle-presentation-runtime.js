// assets/js/dd-battle-presentation-runtime.js
// Phase 4.0: presentation layer for battle HUD events, effects, and future animation hooks.
(function () {
  const history = [];
  const MAX_HISTORY = 40;

  function emit(type, detail) {
    const event = {
      type,
      detail: detail || {},
      at: new Date().toISOString()
    };
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

  function hit(detail) { classPulse('hit', 320); return emit('hit', detail); }
  function heal(detail) { classPulse('heal', 520); return emit('heal', detail); }
  function boost(detail) { classPulse('boost', 520); return emit('boost', detail); }
  function warn(detail) { classPulse('warn', 520); return emit('warn', detail); }
  function success(detail) { classPulse('success', 720); return emit('success', detail); }
  function download(detail) { classPulse('download', 720); return emit('download', detail); }
  function signal(detail) { classPulse('signal', 520); return emit('signal', detail); }
  function reset() { history.length = 0; return emit('reset', {}); }
  function getHistory() { return history.slice(); }

  window.DD_BATTLE_PRESENTATION_RUNTIME = {
    version: '0.1.0',
    phase: '4.0-battle-presentation-runtime',
    emit,
    hit,
    heal,
    boost,
    warn,
    success,
    download,
    signal,
    reset,
    getHistory
  };

  document.dispatchEvent(new CustomEvent('dd:battle-presentation-runtime-ready', { detail: window.DD_BATTLE_PRESENTATION_RUNTIME }));
})();
