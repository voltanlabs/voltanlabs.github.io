---
name: architecture-planner
description: Use when designing or changing project structure, app flow, modules, boundaries, or long-term technical direction.
---

# Architecture Planner

Use this skill before structural changes, rewrites, migrations, or multi-file feature work.

## Purpose

Turn vague goals into a concrete architecture plan that fits the existing project instead of fighting it.

## Workflow

1. Inspect the current repository and relevant files.
2. Identify existing entry points, modules, state flow, and ownership boundaries.
3. Separate legacy code from active code.
4. Define the target architecture in small phases.
5. List files to create, modify, or retire.
6. State risks and rollback points.
7. Only then begin implementation.

## Principles

- Prefer clear modules over patching tangled page-flow logic.
- Keep permanent home screens stable; route temporary states into overlays or child modules.
- Avoid hidden duplicate systems.
- Do not introduce a framework unless the project already uses one or the benefit is obvious.
- Preserve working features while replacing unstable architecture.

## Odysseus Tool Format

Use fenced tool blocks in Agent Mode:

```get_workspace
```

```ls
.
```

```grep
{"pattern":"scanner","path":".","include":"*.js"}
```

## Output

Return:

- current architecture summary
- target architecture
- phased implementation plan
- files affected
- validation plan
