# Data Discovery Ownership Map

This document is the canonical ownership registry for the Data Discovery application.

## Active Owners

| Area | Owner | Status |
|---|---|---|
| App lifecycle | DD_PRODUCT_APP_V4_SHELL | Active |
| Header | DD_PRODUCT_APP_V4_SHELL | Active |
| Navigation | DD_PRODUCT_APP_V4_SHELL | Active |
| Screen routing | DD_PRODUCT_APP_V4_SHELL | Active |
| Battle screen | DD_BATTLE_SCREEN | Active |
| Battle controls | DD_BATTLE_CONTROLS | Active |
| Battle resolver | DD_BATTLE_RESOLVER | Active |
| Battle state | DD_BATTLE_STATE_RUNTIME | Active |
| Encounter generation | DD_ENCOUNTER_RUNTIME | Active |
| Capture system | DD_CAPTURE_RUNTIME | Active |
| Party | DD_PARTY_RUNTIME | Active |
| Inventory | DD_INVENTORY_RUNTIME | Active |
| Dex | DD_DEX_RUNTIME | Active |

## Temporary Owners

- Scanner Screen (v4 shell fallback)
- Encounter Screen (v4 shell fallback)
- Party Screen (v4 shell fallback)
- Items Screen (v4 shell fallback)
- Result Screen (v4 shell fallback)
- Confirm Screen (v4 shell fallback)
- Admin Screen (v4 shell fallback)

## Legacy Compatibility

- Party Switch UI bridge
- Party Switch Battle bridge
- Battle Experience compatibility layer

## Conflict Rule

If two modules claim ownership of the same responsibility, the change must be rejected until ownership is resolved.

## Studio Goal

This document is intended to become the data source for a future Studio Inspector panel that visualizes active owners, temporary owners, legacy adapters, and ownership conflicts in real time.
