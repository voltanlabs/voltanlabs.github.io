# Data Discovery — Three.js

Standalone Three.js battle product for VoltanLabs. This product is intentionally isolated from the existing DataByteSprites runtime. It uses the vendored Three.js module and existing creature sprite art, while owning its own scene, battle state, controls, and presentation.

Open `index.html` through a local static server (for example VS Code Live Server) so the ES module and sprite assets load correctly.

## Ownership and persistence

`session.js` is the single owner of the Three.js profile boundary. Inventory, progression, missions, regions, events, discovery codes, reward history, party slots, repository, HP, Dex records, and coins use the `DataByteSession` API and the `vl_three_battle_*` namespace. `resetSave()` clears every key in that namespace without touching the original DataByteSprites game.

The inactive legacy handlers are kept in `archive/three-battle-inactive/` for reference only; they are not loaded by `index.html`.
