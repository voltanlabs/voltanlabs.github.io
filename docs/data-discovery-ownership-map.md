# Data Discovery Ownership Map

This document is the canonical ownership registry for the Data Discovery application.

## Active Owners

| Area | Owner | Status |
|---|---|---|
| App lifecycle | DD_PRODUCT_APP_V4_SHELL | Active |
| Header | DD_PRODUCT_APP_V4_SHELL | Active |
| Navigation | DD_PRODUCT_APP_V4_SHELL | Active |
| Screen routing | DD_PRODUCT_APP_V4_SHELL | Active |
| Scanner screen | DD_SCANNER_SCREEN | Active |
| Encounter screen | DD_ENCOUNTER_SCREEN | Active |
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

- Party Screen (v4 shell fallback)
- Items Screen (v4 shell fallback)
- Result Screen (v4 shell fallback)
- Confirm Screen (v4 shell fallback)
- Admin Screen (v4 shell fallback)

## Diagnostic-Only Fallbacks

The v4 shell may retain a minimal fallback renderer for Scanner, Encounter, and Battle only to report a missing module during boot or load failure. These fallbacks are not active presentation owners and must not receive new gameplay or layout work.

## Legacy Compatibility

- Party Switch UI bridge
- Party Switch Battle bridge
- Battle Experience compatibility layer

## Conflict Rule

If two modules claim ownership of the same responsibility, the change must be rejected until ownership is resolved.

## Editing Rule

Presentation changes must be made in the canonical screen owner. Runtime behavior changes must be made in the canonical runtime owner. The v4 shell should only coordinate routing, context, and actions.

## Studio Goal

Studio diagnostics should read this ownership model together with `studio/runtime/load-order.json` so active owners, temporary owners, legacy adapters, and ownership conflicts are visible without manually tracing source files.
