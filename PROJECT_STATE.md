# VoltanLabs Project State

Status: active  
Current phase: Data Discovery Phase 4.4.3 Modular Vertical Slice + Repository Recovery and Governance Synchronization

Latest runtime recovery: Data Discovery v4.7.3 restores the canonical
`DD_PARTY_SWITCH_RUNTIME` owner and reconnects active-slot selection to the App
Shell lead context. This removes the battle freeze caused by the switch runtime
file accidentally duplicating and overwriting the Party Runtime instead of
publishing its required switch-state contract.

## Purpose

This document is the living internal state of VoltanLabs. It records the active product architecture, canonical owners, working gameplay loop, repository recovery work, known gaps, Studio support, and immediate priorities.

Older Phase 2-era references are consolidated into:

```text
docs/studio-reference.md
```

## Current Direction

VoltanLabs has three connected layers:

```text
Public Website
  ↓
Products and Tools
  ↓
VoltanLabs Studio
```

