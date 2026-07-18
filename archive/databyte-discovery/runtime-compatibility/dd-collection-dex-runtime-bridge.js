// assets/js/dd-collection-dex-runtime-bridge.js
// Phase 3.8.2 bridge: lets existing Product App storage calls benefit from new Collection and Dex runtimes.
(function () {
  function ready() {
    const collection = window.DD_COLLECTION_RUNTIME;
    const dex = window.DD_DEX_RUNTIME;
    const party = window.DD_PARTY_RUNTIME;
    if (collection && party && !party.__collectionBridge) {
      const originalCollection = party.collection;
      party.collection = function () { return collection.all ? collection.all() : originalCollection(); };
      party.updateSprite = function (sprite) { return collection.update ? collection.update(sprite) && sprite : sprite; };
      party.__collectionBridge = true;
    }
    window.DD_COLLECTION_DEX_BRIDGE = {
      version: "0.1.0",
      phase: "3.8.2-runtime-bridge",
      collectionReady: !!collection,
      dexReady: !!dex,
      partyBridged: !!(party && party.__collectionBridge)
    };
    document.dispatchEvent(new CustomEvent("dd:collection-dex-bridge-ready", { detail: window.DD_COLLECTION_DEX_BRIDGE }));
  }
  document.addEventListener("dd:collection-runtime-ready", ready);
  document.addEventListener("dd:dex-runtime-ready", ready);
  document.addEventListener("dd:party-runtime-ready", ready);
  setTimeout(ready, 100);
})();
