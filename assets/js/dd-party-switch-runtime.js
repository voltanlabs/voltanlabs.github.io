// Phase 4.7.3: canonical party-switch state and validation owner.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;

  const VERSION = '0.2.0';
  const OWNER = 'dd-party-switch-runtime';
  let activeSlot = 0;
  let switchRequired = false;
  let switchReason = null;

  function emit(type, detail) {
    document.dispatchEvent(new CustomEvent(type, {
      detail: Object.assign({
        owner: OWNER,
        version: VERSION
      }, detail || {})
    }));
  }

  function normalizeSlot(slot) {
    const value = Number(slot);
    return Number.isInteger(value) && value >= 0 ? value : -1;
  }

  function getActive() {
    return activeSlot;
  }

  function canSwitch(party, slot) {
    const index = normalizeSlot(slot);
    return !!(
      Array.isArray(party) &&
      index >= 0 &&
      party[index] &&
      Number(party[index].hp || 0) > 0
    );
  }

  function setActive(slot) {
    const index = normalizeSlot(slot);
    if (index < 0) return activeSlot;

    const previousSlot = activeSlot;
    activeSlot = index;
    switchRequired = false;
    switchReason = null;

    emit('dd:party-switch', {
      slot: activeSlot,
      previousSlot
    });

    return activeSlot;
  }

  function requireSwitch(reason) {
    switchRequired = true;
    switchReason = reason || 'switch-required';

    emit('dd:party-switch-required', {
      slot: activeSlot,
      reason: switchReason
    });

    return switchRequired;
  }

  function isSwitchRequired() {
    return switchRequired;
  }

  function partyWiped(party) {
    return (
      !Array.isArray(party) ||
      !party.some(member => Number(member && member.hp || 0) > 0)
    );
  }

  function reset() {
    activeSlot = 0;
    switchRequired = false;
    switchReason = null;
    return health();
  }

  function health() {
    return {
      owner: OWNER,
      version: VERSION,
      activeSlot,
      switchRequired,
      switchReason
    };
  }

  window.DD_PARTY_SWITCH_RUNTIME = Object.freeze({
    version: VERSION,
    owner: OWNER,
    phase: '4.7.3-party-switch-recovery',
    getActive,
    setActive,
    requireSwitch,
    isSwitchRequired,
    canSwitch,
    partyWiped,
    reset,
    health
  });

  emit('dd:party-switch-runtime-ready', {
    runtime: window.DD_PARTY_SWITCH_RUNTIME
  });
})();
