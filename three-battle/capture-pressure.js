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
      }
    });
  }
  window.addEventListener('DOMContentLoaded', bind);
})();
