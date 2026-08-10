(function () {
  function bind() {
    const actions = document.getElementById('actions');
    if (!actions || actions.dataset.pressureBound) return;
    actions.dataset.pressureBound = '1';
    actions.addEventListener('click', event => {
      if (!event.target.closest('.action')) return;
      const state = window.DataByteBattle?.getState?.();
      if (state && !state.over) {
        state.capturePressure = Math.min(35, (state.capturePressure || 0) + 4);
        const log = document.getElementById('battleLog');
        if (log && !/capture pressure/i.test(log.textContent || '')) log.textContent += ` Capture pressure: ${state.capturePressure}%.`;
      }
    });
  }
  window.addEventListener('DOMContentLoaded', bind);
})();
