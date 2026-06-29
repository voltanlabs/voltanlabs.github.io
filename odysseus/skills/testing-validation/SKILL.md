---
name: testing-validation
description: Use after code changes, fixes, dependency updates, or configuration changes to verify what actually works.
---

# Testing Validation

Use this skill whenever a task needs proof that a change works.

## Purpose

Replace confidence with evidence.

## Workflow

1. Identify the smallest meaningful validation for the change.
2. Prefer existing project scripts first.
3. If no tests exist, perform a smoke test or syntax/build check.
4. Capture failures honestly.
5. If a failure is caused by the new change, fix and rerun.
6. If a failure is unrelated or environmental, report it clearly.

## Validation Types

- syntax check
- lint
- unit test
- build
- browser smoke test
- endpoint check
- manual reproduction steps

## Tool Examples

```bash
npm test
```

```bash
npm run build
```

```bash
python -m pytest
```

```bash
git diff --check
```

## Reporting

Always report:

- command run
- pass/fail result
- important output
- remaining untested risk

Never claim a fix is verified if no validation was actually run.
