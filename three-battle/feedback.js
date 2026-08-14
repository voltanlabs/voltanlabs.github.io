(function () {
  let audio;
  function tone(frequency, duration = 0.08, type = 'sine') {
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audio.createOscillator(), gain = audio.createGain();
      oscillator.type = type; oscillator.frequency.value = frequency; gain.gain.setValueAtTime(0.045, audio.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
      oscillator.connect(gain).connect(audio.destination); oscillator.start(); oscillator.stop(audio.currentTime + duration);
    } catch {}
  }
  function buzz(pattern) { navigator.vibrate?.(pattern); }
  document.addEventListener('click', event => {
    if (event.target.closest('.action')) { tone(420, 0.07, 'triangle'); buzz(15); }
    else if (event.target.closest('#captureWinBtn')) { const button = event.target.closest('#captureWinBtn'); button.disabled = true; button.classList.add('is-busy'); button.textContent = 'CAPTURING'; tone(680, 0.12); buzz([20, 30, 20]); }
    else if (event.target.closest('#captureRetryBtn')) { const button = event.target.closest('#captureRetryBtn'); button.disabled = true; button.classList.add('is-busy'); button.textContent = 'RETRYING'; tone(260, 0.1, 'square'); buzz(25); }
    else if (event.target.closest('#battleResetBtn')) { tone(320, 0.08); buzz(10); }
  });
  window.DataByteFeedback = { tone, buzz };
})();
