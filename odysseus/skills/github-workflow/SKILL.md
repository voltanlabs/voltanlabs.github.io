---
name: github-workflow
description: Use when preparing commits, branches, pull requests, repository updates, or GitHub-connected coding work.
---

# GitHub Workflow

Use this skill for disciplined GitHub work inside Odysseus.

## Purpose

Keep repository changes intentional, reviewable, and recoverable.

## Workflow

1. Inspect current branch and status.
2. Confirm the target branch and task scope.
3. Make focused changes only.
4. Review diff before committing.
5. Run a reasonable validation check.
6. Commit with a clear message.
7. Push to the intended branch or prepare a pull request.

## Commands

```bash
git status
```

```bash
git diff --stat
```

```bash
git diff
```

```bash
git log --oneline -5
```

## Rules

- Do not commit unrelated changes.
- Do not force push unless the user explicitly approves.
- Do not claim a push or PR exists unless the tool confirms it.
- If GitHub connector and local git disagree, stop and reconcile before writing.
- For generated skill files, keep each skill in its own folder with `SKILL.md`.

## Commit Message Style

Use short, descriptive messages:

- `Add Odysseus tool usage skill`
- `Fix scanner battle overlay state`
- `Refactor Data Discovery scanner shell`

## Completion

Report branch, files changed, commit SHA if available, and any validation performed.
