// assets/js/dd-party-runtime.js
// Phase 4.5.1: canonical party persistence, lead selection, and usable-member queries.
(function () {
  'use strict';

  const VERSION = '0.2.0';
  const OWNER = 'dd-party-runtime';
  const KEY_COLLECTION = 'vl_databyte_discovery_collection_v2';
  const KEY_PARTY = 'vl_databyte_party_v1';
  const MAX_PARTY = 5;

  function read(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  }

  function collection() {
    return read(KEY_COLLECTION, []);
  }

  function partyIds() {
    return read(KEY_PARTY, []);
  }

  function exists(id, list) {
    return list.some(sprite => sprite && sprite.id === id);
  }

  function isUsable(sprite) {
    return !!(
      sprite &&
      Number(sprite.hp || 0) > 0
    );
  }

  function saveParty(ids) {
    const sprites = collection();
    const clean = [
      ...new Set(
        (ids || []).filter(id => exists(id, sprites))
      )
    ].slice(0, MAX_PARTY);

    return write(KEY_PARTY, clean);
  }

  function autoFill() {
    const sprites = collection();
    const ids = partyIds().filter(id => exists(id, sprites));

    sprites.forEach(sprite => {
      if (
        ids.length < MAX_PARTY &&
        sprite &&
        sprite.id &&
        !ids.includes(sprite.id)
      ) {
        ids.push(sprite.id);
      }
    });

    return saveParty(ids);
  }

  function members() {
    const sprites = collection();
    const ids = autoFill();

    return ids
      .map(id => sprites.find(sprite => sprite && sprite.id === id))
      .filter(Boolean);
  }

  function usableMembers(options) {
    options = options || {};

    const excludedId =
      options.excludeId ||
      options.activeId ||
      null;

    return members().filter(sprite => {
      if (!isUsable(sprite)) return false;
      if (excludedId && sprite.id === excludedId) return false;
      return true;
    });
  }

  function hasUsableMember(options) {
    return usableMembers(options).length > 0;
  }

  function partyWiped() {
    return !hasUsableMember();
  }

  function lead() {
    const party = members();
    const available = party.find(isUsable);

    return (
      available ||
      party[0] ||
      collection()[0] ||
      null
    );
  }

  function activeIndex() {
    const currentLead = lead();
    if (!currentLead) return -1;

    return members().findIndex(
      sprite => sprite && sprite.id === currentLead.id
    );
  }

  function replacementCandidates(activeSprite) {
    const activeId =
      activeSprite &&
      activeSprite.id ||
      null;

    return usableMembers({
      excludeId: activeId
    });
  }

  function add(sprite) {
    if (!sprite || !sprite.id) return autoFill();

    const ids = partyIds();
    if (
      !ids.includes(sprite.id) &&
      ids.length < MAX_PARTY
    ) {
      ids.push(sprite.id);
    }

    return saveParty(ids);
  }

  function remove(id) {
    return saveParty(
      partyIds().filter(item => item !== id)
    );
  }

  function swap(fromIndex, toIndex) {
    const ids = autoFill();

    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= ids.length ||
      toIndex >= ids.length
    ) {
      return ids;
    }

    const next = ids.slice();
    const moved = next.splice(fromIndex, 1)[0];
    next.splice(toIndex, 0, moved);

    return saveParty(next);
  }

  function updateSprite(sprite) {
    if (!sprite || !sprite.id) return sprite;

    const sprites = collection();
    const index = sprites.findIndex(
      item => item && item.id === sprite.id
    );

    if (index >= 0) {
      sprites[index] = sprite;
      write(KEY_COLLECTION, sprites);
    }

    return sprite;
  }

  function reset() {
    return write(KEY_PARTY, []);
  }

  function health() {
    const party = members();
    const usable = party.filter(isUsable);

    return {
      owner: OWNER,
      version: VERSION,
      memberCount: party.length,
      usableCount: usable.length,
      partyWiped: usable.length === 0,
      activeIndex: activeIndex()
    };
  }

  window.DD_PARTY_RUNTIME = Object.freeze({
    version: VERSION,
    owner: OWNER,
    phase: '4.5.1-party-availability-contract',
    maxParty: MAX_PARTY,
    keys: {
      collection: KEY_COLLECTION,
      party: KEY_PARTY
    },
    collection,
    ids: partyIds,
    save: saveParty,
    autoFill,
    members,
    usableMembers,
    hasUsableMember,
    partyWiped,
    isUsable,
    lead,
    activeIndex,
    replacementCandidates,
    add,
    remove,
    swap,
    updateSprite,
    reset,
    health
  });

  document.dispatchEvent(
    new CustomEvent('dd:party-runtime-ready', {
      detail: window.DD_PARTY_RUNTIME
    })
  );
})();
