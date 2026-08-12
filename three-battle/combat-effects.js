(function () {
  function pulse(className, duration = 420) {
    const arena = document.getElementById('arenaView');
    if (!arena) return;
    arena.classList.remove(className); void arena.offsetWidth; arena.classList.add(className);
    setTimeout(() => arena.classList.remove(className), duration);
  }
  window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('actions')?.addEventListener('click', event => { if (event.target.closest('.action')) pulse('attack-active'); });
  });
})();
