(function () {
  function install() {
    const view = document.getElementById('partyView');
    if (!view || document.getElementById('evolveBtn')) return;
    const button = document.createElement('button');
    button.id = 'evolveBtn'; button.className = 'ghost'; button.type = 'button'; button.textContent = 'VERSION UP';
    button.addEventListener('click', () => {
      const active = window.DataByteSession?.starter?.();
      const result = active ? window.DataByteSession.evolve?.(active) : null;
      const message = document.getElementById('missionProgress');
      if (message) message.textContent = result?.ok ? `${result.from} upgraded to ${result.to}.` : result?.reason === 'requires-xp' ? `Earn ${result.required - result.xp} more XP before upgrading.` : 'No Version Upgrade is available for the lead yet.';
      if (result?.ok) button.textContent = 'VERSION UP COMPLETE';
    });
    view.querySelector('div')?.appendChild(button);
  }
  window.addEventListener('DOMContentLoaded', install);
  window.addEventListener('databyte:party-updated', install);
})();
