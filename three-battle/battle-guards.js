(function () {
  let installed = false;
  function install() {
    const battle = window.DataByteBattle;
    if (!battle || installed || typeof battle.showCapturePrompt !== 'function') return;
    const prompt = battle.showCapturePrompt;
    const capture = battle.capture;
    battle.showCapturePrompt = function (mode) {
      const state = battle.getState?.();
      const hp = Number(battle.creatures?.player?.hp ?? 100);
      if (state?.over || hp <= 0) {
        if (state) { state.over = true; state.message = 'Your DataByte has no signal. Choose a replacement or return to the scanner.'; }
        battle.message?.(state?.message);
        return { ok: false, reason: 'player-fainted' };
      }
      return prompt(mode);
    };
    if (typeof capture === 'function') {
      battle.capture = function () {
        const hp = Number(battle.creatures?.player?.hp ?? 100);
        if (battle.getState?.()?.over || hp <= 0) return { ok: false, reason: 'player-fainted' };
        return capture.apply(this, arguments);
      };
    }
    installed = true;
  }
  window.setInterval(install, 50);
  install();
})();
