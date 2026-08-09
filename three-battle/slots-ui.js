(function () {
  let switchMode = false;
  let selected = null;

  const session = () => window.DataByteSession;
  const list = () => document.getElementById('partyList');

  function ensureModal() {
    let modal = document.getElementById('partyInfoModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'partyInfoModal';
      modal.className = 'capture-modal';
      document.body.appendChild(modal);
    }
    return modal;
  }

  function closeModal() {
    document.getElementById('partyInfoModal')?.classList.remove('is-open');
  }

  function spriteDetails(item, location) {
    const roster = session()?.roster?.() || [];
    const source = roster.find(entry => entry.id === item.id) || item;
    const hp = Number(item.hp ?? 100);
    const maxHp = Number(item.maxHp ?? 100);
    const version = item.version || source.version || 1;
    const progress = session()?.spriteProgress?.(item) || { xp: 0, level: 1, nextXp: 100 };
    return {
      ...source,
      ...item,
      location,
      hp,
      maxHp,
      version,
      xp: progress.xp,
      level: progress.level,
      nextXp: progress.nextXp,
      sprite: item.sprite || `./data/sprites/${source.sprite || 'placeholder.png'}`,
      description: source.description || source.lore || 'Signal record pending.'
    };
  }

  function openInfo(item, location, slotIndex = null) {
    const modal = ensureModal();
    const detail = spriteDetails(item, location);
    const canUpgrade = ['leovolt', 'leothor', 'kindlekid', 'coincalf', 'crabician', 'scorpyone'].includes(detail.id);
    const isLead = location === 'party' && slotIndex === 0;
    modal.innerHTML = `<div class="capture-card party-info-card">
      <button class="party-info-close ghost" data-party-close type="button">CLOSE</button>
      <span class="eyebrow">${detail.location === 'party' ? 'ACTIVE PARTY SIGNAL' : 'SPRITE REPOSITORY'}</span>
      <img class="party-info-sprite" src="${detail.sprite}" alt="${detail.name}">
      <h2>${detail.name}</h2>
      <p>${detail.description}</p>
      <div class="party-info-stats">
        <span>HP <b>${detail.hp} / ${detail.maxHp}</b></span>
        <span>TYPE <b>${detail.type || detail.configuration || 'Unassigned'}</b></span>
        <span>ALIGNMENT <b>${detail.alignment || 'Unassigned'}</b></span>
        <span>VERSION <b>${detail.version}</b></span>
        <span>LEVEL <b>${detail.level}</b></span>
        <span>EXPERIENCE <b>${detail.xp}${detail.nextXp === null ? ' XP · MAX' : ` / ${detail.nextXp} XP`}</b></span>
      </div>
      <div class="party-info-actions">
        ${detail.location === 'party' ? `<button class="ghost" data-party-lead type="button">${session().starter() === detail.id ? 'CURRENT LEAD' : 'SET AS LEAD'}</button><button class="ghost" data-party-store type="button" ${isLead ? 'disabled' : ''}>${isLead ? 'LEAD CANNOT BE STORED' : 'SEND TO REPOSITORY'}</button>` : '<button class="scan-button" data-party-deploy type="button">SEND TO TEAM</button>'}
        ${canUpgrade ? '<button class="scan-button" data-party-upgrade type="button">VERSION UP</button>' : ''}
      </div>
    </div>`;
    modal.classList.add('is-open');
    modal.querySelector('[data-party-close]').onclick = closeModal;
    modal.querySelector('[data-party-lead]')?.addEventListener('click', () => {
      const slots = session().slots();
      const index = slots.findIndex(entry => entry?.id === detail.id);
      if (index > 0) session().swapSlots(0, index);
      else session().setLead(detail.id);
      closeModal();
      render();
    });
    modal.querySelector('[data-party-store]')?.addEventListener('click', () => {
      if (isLead || slotIndex === null) return;
      session().storeSlot(slotIndex);
      closeModal();
      render();
    });
    modal.querySelector('[data-party-deploy]')?.addEventListener('click', () => {
      const emptyIndex = session().slots().findIndex(entry => !entry);
      if (emptyIndex < 0) {
        modal.querySelector('.party-info-actions').insertAdjacentHTML('afterend', '<p class="party-info-message">Your team is full. Use Switch DataBytes to replace a team slot.</p>');
        return;
      }
      session().assignSlot(emptyIndex, detail.id);
      closeModal();
      render();
    });
    modal.querySelector('[data-party-upgrade]')?.addEventListener('click', () => {
      const result = session().evolve?.(detail.id);
      const message = result?.ok
        ? `${result.from} upgraded to ${result.to}.`
        : result?.reason === 'requires-xp'
          ? `Earn ${result.required - result.xp} more XP before upgrading.`
          : result?.reason === 'max-version'
            ? 'This DataByte is already at its highest known version.'
            : 'No Version Upgrade is available for this DataByte yet.';
      modal.querySelector('.party-info-actions').insertAdjacentHTML('afterend', `<p class="party-info-message">${message}</p>`);
      if (result?.ok) {
        render();
        setTimeout(() => openInfo({ ...detail, id: result.to }, location), 0);
      }
    });
  }

  function describeSelection() {
    const button = document.getElementById('partySwitchToggle');
    if (!button) return;
    button.textContent = switchMode ? 'EXIT SWITCH MODE' : 'SWITCH DATABYTES';
    button.classList.toggle('is-active', switchMode);
    const status = document.getElementById('partySwitchStatus');
    if (status) status.textContent = switchMode
      ? selected ? 'Select another slot or repository signal to swap.' : 'Select the first signal to swap.'
      : 'Tap a signal to view its overview.';
  }

  function swapSelection(next) {
    if (!selected) {
      selected = next;
      render();
      return;
    }
    const first = selected;
    const second = next;
    if (first.kind === 'slot' && second.kind === 'slot') session().swapSlots(first.index, second.index);
    else if (first.kind === 'slot' && second.kind === 'repo') session().assignSlot(first.index, second.id);
    else if (first.kind === 'repo' && second.kind === 'slot') session().assignSlot(second.index, first.id);
    else if (first.kind === 'slot' && second.kind === 'repo-empty') session().storeSlot(first.index);
    else if (first.kind === 'repo-empty' && second.kind === 'slot') session().storeSlot(second.index);
    selected = null;
    switchMode = false;
    render();
  }

  function card(item, location, index) {
    const key = location === 'party' ? `slot-${index}` : `repo-${item.id}`;
    const isSelected = selected?.key === key;
    const lead = location === 'party' && index === 0;
    return `<button class="party-card ${lead ? 'is-lead' : ''} ${isSelected ? 'is-selected' : ''}" data-party-key="${key}" type="button">
      <img src="${item.sprite}" alt="${item.name}"><span><b>${item.name}</b><small>${lead ? 'LEAD · ' : ''}LV ${session()?.spriteProgress?.(item)?.level || item.level || 1} · ${location === 'party' ? `SLOT ${index + 1}` : 'STORED SIGNAL'}</small></span>
    </button>`;
  }

  function render() {
    const host = list();
    if (!host || !session()) return;
    const slots = session().slots();
    const repo = session().repository();
    host.innerHTML = `<div class="party-switch-tools"><button id="partySwitchToggle" class="ghost" type="button">${switchMode ? 'EXIT SWITCH MODE' : 'SWITCH DATABYTES'}</button><small id="partySwitchStatus"></small></div>`
      + slots.map((item, index) => item ? card(item, 'party', index) : `<button class="party-card party-empty-slot" data-party-key="slot-${index}" type="button"><span><b>Empty Slot ${index + 1}</b><small>${index === 0 ? 'Lead slot · choose a signal' : 'Available team slot'}</small></span></button>`).join('')
      + `<span class="repository-label">Repository (${repo.length})</span>`
      + (repo.length ? repo.map(item => card(item, 'repo')).join('') : '<span class="party-empty">No stored signals yet.</span>')
      + '<button class="party-card party-empty-slot" data-party-key="repo-empty" type="button"><span><b>Empty Repository Slot</b><small>Use switch mode to deposit a team signal</small></span></button>';
    describeSelection();
    host.querySelector('#partySwitchToggle').onclick = () => { switchMode = !switchMode; selected = null; render(); };
    host.querySelectorAll('[data-party-key]').forEach(button => button.onclick = () => {
      const key = button.dataset.partyKey;
      const isRepo = key.startsWith('repo-') && key !== 'repo-empty';
      const index = isRepo ? null : Number(key.slice(5));
      const item = isRepo ? repo.find(entry => `repo-${entry.id}` === key) : slots[index];
      const target = key === 'repo-empty' ? { kind: 'repo-empty', key } : isRepo ? { kind: 'repo', id: item?.id, key } : { kind: 'slot', index, key };
      if (switchMode && (target.kind === 'slot' || target.kind === 'repo' || target.kind === 'repo-empty')) swapSelection(target);
      else if (item) openInfo(item, isRepo ? 'repository' : 'party', isRepo ? null : index);
    });
  }

  window.renderParty = render;
  window.addEventListener('databyte:party-updated', () => setTimeout(render, 0));
  window.addEventListener('load', render);
  setTimeout(render, 0);
})();
