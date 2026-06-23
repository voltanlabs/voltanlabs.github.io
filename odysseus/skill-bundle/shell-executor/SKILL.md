---
name: shell-executor
version: 1.0.0
category: development
status: active
---

# Shell Executor

## When to use
Use this skill when a task requires terminal output, file listing, path checks, git status, or workspace inspection.

## Instructions
1. Use Shell Access before reasoning about files.
2. Run the requested command.
3. Return the actual output.
4. If the command fails, return the actual error.
5. Do not replace command output with a summary.

## Starter commands
- pwd
- ls
- git status
