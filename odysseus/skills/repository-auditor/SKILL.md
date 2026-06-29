---
name: repository-auditor
description: Use when auditing a code repository before making changes, identifying architecture, locating files, or explaining how a project is wired together.
---

# Repository Auditor

Use this skill before changing a project you have not inspected in the current chat.

## Goal

Build a truthful map of the repository before proposing or applying edits.

## Procedure

1. Confirm the active workspace or repository path.
2. Inspect the top-level tree.
3. Read project metadata such as README, package files, config files, and routing/build files.
4. Locate the files directly related to the user's request.
5. Summarize current architecture before changing code.
6. Make the smallest safe change that fits the architecture.
7. Verify with available build, lint, or smoke-test commands.

## Required Behavior

- Do not invent files, routes, components, APIs, or folder structure.
- Do not rely on memory when the repo can be inspected.
- Prefer direct file inspection over guessing.
- If a file cannot be read, say so clearly.
- For large projects, identify the working subsystem first, then drill down.

## Odysseus Tool Format

When using tools in Agent Mode, call them with fenced code blocks:

```get_workspace
```

```ls
.
```

```read_file
README.md
```

```grep
{"pattern":"function scan","path":".","include":"*.js"}
```

## Deliverable

Before editing, provide a short architecture summary:

- entry points
- relevant files
- current behavior
- suspected issue
- proposed change
