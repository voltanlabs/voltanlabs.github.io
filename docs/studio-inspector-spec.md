# Studio Inspector Specification

## Purpose

The Studio Inspector is the live developer console for Data Discovery. It should report runtime health and ownership without reading source code.

## Initial Panels

- Active Owners
- Temporary Owners
- Legacy Adapters
- Runtime Health
- Ownership Conflicts
- Current Screen

## Runtime Health

Display READY/WARN/ERROR for:
- App Shell
- Battle Screen
- Battle Controls
- Battle Resolver
- Battle State
- Encounter Runtime
- Capture Runtime
- Party Runtime
- Inventory Runtime
- Dex Runtime

## Ownership Rules

Highlight any responsibility claimed by more than one active module.

## Future Enhancements

- Click an owner to open its source file.
- Show emitted and consumed events.
- Visual ownership graph.
- Runtime timing and load-order diagnostics.
- Hot reload support for screen modules.
