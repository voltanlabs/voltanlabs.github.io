(function () {
  const KEY = 'vl_three_battle_event_reward';
  const events = [{ name: 'Rift Surge', copy: 'Stained signals are unusually active.', reward: 2 }, { name: 'Grove Bloom', copy: 'Pristine encounters reveal extra lore.', reward: 2 }, { name: 'Cavern Echo', copy: 'Null signals leave a stronger scan trail.', reward: 3 }];
  const current = () => events[new Date().getUTCDate() % events.length];
  function render() {
    const view = document.getElementById('missionView');
    if (!view) return;
    let card = document.getElementById('eventCard');
    if (!card) { card = document.createElement('div'); card.id = 'eventCard'; view.appendChild(card); }
    const event = current(); card.innerHTML = `<span class="eyebrow">LIVE SIGNAL EVENT</span><strong>${event.name}</strong><p>${event.copy} Reward: ${event.reward} DataByteCoins.</p>`;
  }
  function reward() {
    const event = current();
    if (localStorage.getItem(KEY) === event.name) return;
    localStorage.setItem(KEY, event.name); window.DataByteSession?.addCoins?.(event.reward); render();
  }
  window.DataByteEvents = { events, current, render };
  window.addEventListener('DOMContentLoaded', render);
  window.addEventListener('databyte:dex-updated', reward);
})();
