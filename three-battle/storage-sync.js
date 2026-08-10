(function () {
  const session = window.DataByteSession;
  if (!session?.slots || session.slots.__freshPartyMerge) return;
  const originalSlots = session.slots;
  const mergedSlots = function () {
    const party = session.party?.() || [];
    const slots = originalSlots();
    const byId = new Map(party.filter(Boolean).map(item => [item.id, item]));
    let changed = false;
    const merged = slots.map(item => {
      const latest = item && byId.get(item.id);
      if (!latest) return item;
      const next = { ...item, ...latest };
      if (JSON.stringify(next) !== JSON.stringify(item)) changed = true;
      return next;
    });
    if (changed) {
      localStorage.setItem('vl_three_battle_slots', JSON.stringify(merged));
      localStorage.setItem('vl_three_battle_party', JSON.stringify(merged.filter(Boolean)));
    }
    return merged;
  };
  mergedSlots.__freshPartyMerge = true;
  session.slots = mergedSlots;
})();
