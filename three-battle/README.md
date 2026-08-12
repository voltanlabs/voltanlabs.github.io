# Data Discovery — Three.js

Standalone Three.js battle product for VoltanLabs. This product is intentionally isolated from the existing DataByteSprites runtime. It uses the vendored Three.js module and existing creature sprite art, while owning its own scene, battle state, controls, and presentation.

Open `index.html` through a local static server (for example VS Code Live Server) so the ES module and sprite assets load correctly.

The complete current gameplay rules are documented in [THREE-BATTLE-RULEBOOK.md](./THREE-BATTLE-RULEBOOK.md). The rulebook should be updated in the same commit as any gameplay-rule change.

## Ownership and persistence

`session.js` is the single owner of the Three.js profile boundary. Inventory, progression, missions, regions, events, discovery codes, reward history, party slots, repository, HP, Dex records, and coins use the `DataByteSession` API and the `vl_three_battle_*` namespace. `resetSave()` clears every key in that namespace without touching the original DataByteSprites game.

The retired non-canonical enemy loop has been removed. The page uses the canonical battle loop in `main.js` with the imported `battle-ai.js`, `battle-rules.js`, `battle-state.js`, and `battle-render.js` modules.
