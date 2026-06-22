# VoltanLabs Odysseus Workspace

This folder contains the bootstrap documents and skill definitions for using Odysseus as a local AI development workspace for VoltanLabs.

## Purpose

Odysseus should act as a local repo-aware assistant for:

- VoltanLabs site development
- DataByteSprites: Data Discovery architecture
- Repository audits
- Shell/file inspection
- Git workflow preparation

## Import Order

1. Import `docs/VOLTANLABS_BOOTSTRAP.md` into Odysseus memory/documents.
2. Import skills from `skills/` one at a time.
3. Start a fresh Odysseus chat using DeepSeek R1 8B or better.
4. Verify Shell Access with `pwd` and `ls` before asking it to work on files.

## Important Rule

Odysseus must never simulate shell output or invent repository contents. It should execute commands, inspect files, and report failures honestly.
