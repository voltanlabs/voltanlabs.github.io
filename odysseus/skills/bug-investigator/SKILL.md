---
name: bug-investigator
description: Use when debugging broken behavior, errors, regressions, or mismatches between expected and actual app behavior.
---

# Bug Investigator

Use this skill when something does not work and the user needs a real diagnosis.

## Purpose

Find the root cause before applying fixes.

## Workflow

1. Restate the symptom in plain language.
2. Gather evidence from screenshots, logs, error messages, and source files.
3. Identify the exact subsystem involved.
4. Form one or more testable hypotheses.
5. Inspect the code path that could produce the symptom.
6. Apply the smallest fix that addresses the root cause.
7. Verify the behavior and report what was tested.

## Rules

- Do not patch randomly.
- Do not assume the most recent file is the active runtime file.
- Do not hide elements with CSS when the real issue is duplicate logic.
- Do not keep wrapping legacy behavior when a module boundary should be fixed.
- Prefer evidence from runtime logs and source inspection over memory.

## Useful Tool Calls

```grep
{"pattern":"error text or function name","path":".","include":"*.js"}
```

```read_file
path/to/suspect-file.js
```

```bash
git status
```

## Output

Return:

- confirmed symptom
- evidence found
- likely root cause
- fix applied or proposed
- validation result
